public with sharing class WorkOrderController {
    @AuraEnabled(cacheable=true)
    public static List<WorkOrder> getWorkOrdersForAccount(Id accountId) {
        return [
            SELECT Id, WorkOrderNumber, External_WorkOrder_ID__c, Status,WorkType.Name
            FROM WorkOrder
            WHERE AccountId = :accountId
            ORDER BY CreatedDate DESC
        ];
    }
}