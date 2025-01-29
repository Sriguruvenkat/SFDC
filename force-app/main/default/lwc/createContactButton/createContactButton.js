import { createRecord } from 'lightning/uiRecordApi';
import { LightningElement } from 'lwc';
import CONTACT from '@salesforce/schema/Contact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CreateContactButton extends NavigationMixin(LightningElement) {
    modelOpen=false;
    openModal(){
        this.modelOpen=true;
    }

    closeModal(){
        this.modelOpen=false;
    }

    handleSubmit(event){
        event.preventDefault();
        let fields=event.detail.fields;

        createRecord({apiName:CONTACT.objectApiName,fields:fields})
            .then(contact =>{
                console.log(contact);
                const evt=new ShowToastEvent({
                    title:"Success",
                    message:"Contact "+contact.fields.FirstName.value+" "+contact.fields.LastName.value+" was created.",
                    variant:"success"
                });
                this.dispatchEvent(evt);
                this[NavigationMixin.Navigate]({
                    type:'standard__recordPage',
                    attributes:{
                        recordId:contact.id,
                        objectApiName:'Contact',
                        actionName:'view'
                    }
                })
            })
            .catch(error=>{
                console.log(error);
                const evt=new ShowToastEvent({
                    title:"Error",
                    message:error.body.output.errors[0].message,
                    variant:"error"
                });
                this.dispatchEvent(evt);
            })
    }
}