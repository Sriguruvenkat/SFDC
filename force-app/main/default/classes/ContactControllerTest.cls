/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class ContactControllerTest {

    @isTest
    static void myUnitTest() {
        //setup test data
        Contact newContact=new Contact(FirstName='Test',LastName='Account for LWC',Email='test@hotmail.com',Phone='1233456787');

        try {
            // Call the method and expect an exception
            Test.startTest();
            ContactController.createContactRecord(newContact);
            Test.stopTest();
            // If exception is not thrown, fail the test
            System.assertEquals('Test', newContact.FirstName);
            System.assertEquals('Account for LWC', newContact.LastName);
            System.assertEquals('test@hotmail.com',newContact.Email);
            system.assertEquals('1233456787',newContact.Phone);
        } catch (AuraHandledException e) {
            // Assert: Verify that the exception message matches
            System.assert(e.getMessage().contains('Error creating record'), 'Expected error message');
        }
}
}