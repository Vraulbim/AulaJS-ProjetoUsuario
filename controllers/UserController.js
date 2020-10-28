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

            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);


            this.getPhotos(this.formUpdateEl).then((content)=>{
               
                if(!values.photo){
                    result._photo = userOld._photo
                }else{
                    result._photo = content;
                }
                
                tr.dataset.user = JSON.stringify(result);

                tr.innerHTML = `
                <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${result._name}</td>
                <td>${result._email}</td>
                <td>${result._admin}</td>
                <td>${Utils.formatDate(result._register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-remove btn-xs btn-flat">Excluir</button>
            </td>
            `;
            
            this.addEventTr(tr);
            this.updateCount();
            this.formUpdateEl.reset();
            this.showPanelCreate();
            btnSubmit.disabled = false}
            
                , (error)=>{console.error(error)});


        });

    }

    onSubmit(){
        
        this.formEl.addEventListener('submit', event => {
   
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl)
            if(!values){return false}

            this.getPhotos(this.formEl).then((content)=>{
                values.photo = content ;
                this.addLineUser(values);
                this.formEl.reset();
                 btnSubmit.disabled = false;
                }, (error)=>{
                    console.error(error)
                });

           
                      
        });
        
    }

    getPhotos(formEl){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item =>{
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

    insert(dataUser){

        let users =[];

        users.push(dataUser);

        sessionStorage.setItem("", "");
    }
       

    addLineUser(dataUser){
        let tr = document.createElement('tr');

        this.insert(dataUser);

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${Utils.formatDate(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-remove btn-xs btn-flat">Excluir</button>
            </td>
        `;

       this.addEventTr(tr);

        this.tableEl.appendChild(tr);
        this.updateCount();


    }

    addEventTr(tr){

        tr.querySelector('.btn-delete').addEventListener('click', e =>{

            if(confirm('Deseja realmente excluir o usuário? ')){
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector('.btn-edit').addEventListener('click', e =>{
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            for(let name in json){
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") +" ]")
                if (field){ 

                    switch(field.type){
                        case 'file':
                        continue;
                        break;

                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") +" ][value="+ json[name] + "]");
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

            this.formUpdateEl.querySelector('.photo').src = json._photo;
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