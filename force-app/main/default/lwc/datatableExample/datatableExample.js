import { LightningElement,api,wire} from 'lwc';
import getWorkOrdersForAccount from '@salesforce/apex/WorkOrderController.getWorkOrdersForAccount';

export default class DatatableExample extends LightningElement {
    @api recordId;
    data=[];
    error;
    columns=[
        {label:'Work Order Number',fieldName:'WorkOrderNumber',sortable:true},
        {label:'External WorkOrder ID',fieldName:'External_WorkOrder_ID__c',sortable:true},
        {label:'Status',fieldName:'Status',sortable:true},
        {label:'WorkType',fieldName:'WorkTypeName',sortable:false}
    ]
    sortedBy;
    sortedDirection='asc';

    @wire(getWorkOrdersForAccount,{accountId:'$recordId'})
        wiredWorkOrders({error,data}){
            if(data){
                this.data=data.map(workOrder=>({
                    ...workOrder,WorkTypeName:workOrder.WorkType ? workOrder.WorkType.Name: 'n/a'
                }));
            this.error=undefined;
            }
            else if(error){
                this.error=error.body.message;
                this.data=undefined;
            }
        }
        //handling sorting
        handleSort(event) {
            const { fieldName: sortedBy, sortDirection } = event.detail;
            const cloneData = [...this.data];
            cloneData.sort((a, b) => {
                let valA = a[sortedBy] || '';
                let valB = b[sortedBy] || '';
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
            this.data = cloneData;
            this.sortedBy = sortedBy;
            this.sortedDirection = sortDirection;
        }
}