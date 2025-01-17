import { LightningElement,api,wire} from 'lwc';
import { getRecord } from "lightning/uiRecordApi";
import { createRecord } from 'lightning/uiRecordApi';
import WORKORDER from "@salesforce/schema/WorkOrder";
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const WORKTYPE_FIELDS=['WorkType.Name'];

const PARENT_WORKORDER_FIELDS = ['WorkOrder.ServiceTerritoryId', 'WorkOrder.AccountId','WorkOrder.Street',
'WorkOrder.City','WorkOrder.State','WorkOrder.PostalCode','WorkOrder.Country','WorkOrder.WorkTypeId','WorkOrder.StartDate',
'WorkOrder.EndDate','WorkOrder.Subject']; 
//Subject field not shown in the form but need to fetch the value from parent workorder to the child workorder.
export default class ChildWorkOrder extends NavigationMixin(LightningElement) {
    @api recordId;
    //load data
    accountId='';serviceTerritory='';
    country='';street='';city='';state='';postalcode='';
    startdate='';enddate='';subject='';

    worktypeid;worktypename;
    wo_data;
    @api isModalOpen=false;
    openModal(){
        this.isModalOpen=true;
    }
    closeModal(){
        this.isModalOpen=false;
    }
    @wire(getRecord,{recordId:'$recordId',fields:PARENT_WORKORDER_FIELDS})
    wiredRecord({error,data}){
        if(data){
            console.log('DATA',data);
            this.wo_data=data.fields;
            console.log('WO_DATA',this.wo_data);
            this.worktypeid=data.fields.WorkTypeId.value;
        }
        else if(error){
            console.error("ERROR",error);
        }
    }
    @wire(getRecord,{recordId:'$worktypeid',fields:WORKTYPE_FIELDS})
    wiredWorkType({error,data}){
        if(data){
        this.worktypename=data.fields.Name.value;
        console.log('WT_DATA',data);
        console.log('WO_2@Data',this.wo_data);
        console.log('WORKTYPE NAME',this.worktypename);
        
        this.subject=this.wo_data.Subject.value; //changes
        if(this.worktypename=="Install"){
            console.log('Install');
            this.accountId=this.wo_data.AccountId.value;
            this.serviceTerritory = this.wo_data.ServiceTerritoryId.value;
            this.street=this.wo_data.Street.value;
            this.city=this.wo_data.City.value;
            this.country=this.wo_data.Country.value;
            this.state=this.wo_data.State.value;
            this.postalcode=this.wo_data.PostalCode.value;
            this.startdate=this.wo_data.StartDate.value;
            this.enddate=this.wo_data.EndDate.value;
            
        }
        else if(this.worktypename=="Buried Drop"){
            console.log("Buried Drop");
            this.serviceTerritory = this.wo_data.ServiceTerritoryId.value;
            this.accountId=this.wo_data.AccountId.value;
        }
        else{
            console.log('Something Else');
        }
        }
        else if(error){
        console.error("Error fetching record",error);
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let fields=event.detail.fields;
        fields.Subject=this.subject;  //changes
        console.log("FIELD",event.detail.fields);
        
        console.log("CONST FIELDS",fields);
        // Create a new work order record
        createRecord({ apiName: WORKORDER.objectApiName,fields:fields})
            .then(workOrder => {
                console.log("NEW WO ID",workOrder.id);
                this.navigate_woid=workOrder.id;
                console.log("NEW WO",workOrder);
                const evt = new ShowToastEvent({
                    title: "Success",
                    message: "WorkOrder "+workOrder.fields.WorkOrderNumber.value+" was Created",
                    variant: "success",
                });
                this.dispatchEvent(evt);
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: workOrder.id,
                        objectApiName: 'WorkOrder',
                        actionName: 'view'
                    }
                })
                
            })
         
            .catch(error => {
                 console.error("ERROR creating record",error);
                 const evt = new ShowToastEvent({
                    title: "Error",
                    message: error.body.output.errors[0].message,
                    variant: "error",
                });
                
                this.dispatchEvent(evt);
            });
            
    }
}