import { LightningElement } from 'lwc';
import createContact from '@salesforce/apex/ContactController.createContactRecord';

export default class CreateContact extends LightningElement {
    contact={
        FirstName:'',
        LastName:'',
        Email:'',
        Phone:'',
    }

    message='';

    handleChange(event){
        const field=event.target.name;
        this.contact[field]=event.target.value;
    }
    handleSave(){
        createContact({newContact:this.contact})
            .then(result=>{
                this.message=result;
            })
            .catch(error=>{
                this.message='Error '+error.body.message;
            })
    }
}