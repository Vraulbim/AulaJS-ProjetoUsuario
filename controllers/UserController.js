class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
    }

    getValues(formEl){

        let user = {};
        let isValid = true;
        [...formEl.elements].forEach(function(field, index){

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

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
        
            if (!isValid){
                return false;
            }
            return new User(
                user.name,
                user.gender, 
                user.birth, 
                user.country, 
                user.email, 
                user.password, 
                user.photo, 
                user.admin);

            
    }

    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e =>{
            this.showPanelCreate();
        });


        this.formUpdateEl.addEventListener("submit", e=>{
            e.preventDefault();
            let btnSubmit = this.formUpdateEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index]
            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
                <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${values.admin}</td>
                <td>${Utils.formatDate(values.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-remove btn-xs btn-flat">Excluir</button>
            </td>
            `;

            this.addEventTr(tr);
            this.updateCount();
            this.showPanelCreate();

        });
    }

    onSubmit(){
        
        this.formEl.addEventListener('submit', event => {
   
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl)
            if(!values){return false}

            this.getPhotos().then((content)=>{values.photo = content ;
                this.addLineUser(values);this.formEl.reset(); btnSubmit.disabled = false}, (error)=>{console.error(error)});

           
                      
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
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${Utils.formatDate(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-remove btn-xs btn-flat">Excluir</button>
            </td>
        `;

       this.addEventTr(tr);

        this.tableEl.appendChild(tr);
        this.updateCount();


    }

    addEventTr(tr){
        tr.querySelector('.btn-edit').addEventListener('click', e =>{
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector('#form-user-update');

            form.dataset.trIndex = tr.sectionRowIndex;
            for(let name in json){
                let field = form.querySelector("[name=" + name.replace("_", "") +" ]")
                if (field){ 

                    switch(field.type){
                        case 'file':
                        continue;
                        break;

                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") +" ][value="+ json[name] + "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name]
                    }
                   
                };
                
            }

            this.showPanelUpdate();
            
        })
    }

    updateCount(){

        let numberUser = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr =>{
           let user = JSON.parse(tr.dataset.user);
            numberUser++;
           if(user._admin === 'Sim'){numberAdmin++;}
        });

        document.getElementById('number-users').innerHTML = numberUser;
        document.getElementById('number-admin').innerHTML = numberAdmin;
    }

    showPanelCreate(){
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showPanelUpdate(){
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }
}