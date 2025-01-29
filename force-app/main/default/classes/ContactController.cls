public with sharing class ContactController {
    @AuraEnabled
    public static String createContactRecord(Contact newContact) {
        try{
            insert newContact;
            return 'Contact has been created'+newContact.FirstName + ' '+newContact.LastName;
        }
        catch(Exception e){
            throw new AuraHandledException('Error creating record: '+e.getMessage());
        }
    }
}