class UserController{

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    getValues(){

        let user = {};
        [...this.formEl.elements].forEach(function(field, index){

            if(field.name == 'gender'){
                
                if (field.checked) 
                user[field.name] = field.value;
        
            }else if(field.name === 'admin'){
                if (field.checked){
                    user[field.name] = "Sim";
                }else{
                    user[field.name] = "Não";
                }
                // user[field.name] = field.checked;
            } else{
                user[field.name] = field.value;
            }
            });
        
            return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

            
    }

    onSubmit(){

        
        this.formEl.addEventListener('submit', event => {
   
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            this.getPhotos().then((content)=>{values.photo = content ;
                this.addLineUser(values);this.formEl.reset(); btnSubmit.disabled = false}, (error)=>{console.error(error)});

            let values = this.getValues()
           

           
        });
        
    }

    getPhotos(){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item =>{
               if (item.name === 'photo'){
                   return item;
               }
           })
   
           let file = (elements[0].files[0]);
   
           fileReader.onload = () =>{
               resolve(fileReader.result);
           };

           fileReader.onerror = (e)=>{
            reject(e)
        }
          
             file ? fileReader.readAsDataURL(file): resolve('dist/img/boxed-bg.jpg');
       })
        
    }
       

    addLineUser(dataUser){
        let tr = document.createElement('tr');

        tr.innerHTML = `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${dataUser.register}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.tableEl.appendChild(tr);
    }

}