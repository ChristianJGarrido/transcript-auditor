#transportSDK

Overview
--------------
Generic Web transport for all LP services.  
Needs to be configured with site and requested services (service names from CSDS names list).
####Namespace
 ```
  lpTag.transportSDK
 ```

Methods
---------------
##configure
This method is foc configuring the transport and expects the following parameters:  

| Parameter | Description | Type |
| ------------- |-------------| ----- |
| siteId | the site we want to use | STRING |
| services | a list of services we want to use | Array of STRINGS |
| QA | boolean flag if we are in LP internal QA environment | Boolean |
| callback | Function to be notified when configuration is complete or has failed | function |


<b>Response Object for Callback</b>  

| Parameter | Description | Type |
| ------------- |-------------| ----- |
| configured | If the configuration succeeded | BOOLEAN |
| msg | String description of error in case of failures | STRING |
| site | Site Id (*not always present) | STRING |
| services | Array of services requested (*not always present) | Array |


<b>Sample</b>
```
lpTag.transportSDK.configure({
    siteId : "123123123",
    services: [ "agent", "adminArea", "accountConfigReadWrite" ],
    QA: false,
    callback : function(data) { 
       if(data.configured){
        //Start running requests
       }else{
        //Notify of error
       }
    }
});
```

##getDomain
Returns the domain by service name or the while domain map if no service is specified.  
Only works after the configured callback has been received.

<b>Sample</b>
```
lpTag.transportSDK.getDomain("agent"); // Returns the agent domain
```

##issueCall
This is the way to issue a call to any service ( including same domain services ).

<b>Sample</b>
```            
lpTag.transportSDK.issueCall({ 
        url : "https://adminlogin.liveperson.net/",
        cache : false,
        headers : {
           "AUTHORIZATION" : "kjahsjkdhjkahskd1982379ased7asdlk"
        },
        data: {
           content: "My fish like soup"
        },
        query: {
            version: "1.0"
        },
        timeout: 35,
        retries: 3,
        success: function(data){
            //Do something with the data
        }, 
        error: function(data){
            //Do something about the error
        }
    });
```
<b>Request Structure</b>  

| Parameter | Description | Type |  
| ------------- |-------------| ----- |
| url | The url of the request | String |
| method | The request method (Default is GET) | 'GET' / 'POST' / 'PUT' / 'DELETE'|
| encoding | The encoding of the request - default value utf-8 | String |
| cache | If set to false, it will force requested pages not to be cached by the browser | String |
| headers |  A map of additional header key/value pairs to send along with the request | Object |
| data | Payload data to be sent to the server,It is converted to a query string, if not already a string. It's appended to the url for GET-requests. Deep Object for JSONP will be converted to key : encodeURIComponent(stringify(Object)) format | Object/String |
| query | Query parameters to be added to the URL, will br uriEncoded | Object |
| retries | Number of retries if the timeout is reached, default is 3 | Number |
| timeout |  Set a timeout (in seconds) for the request, default is 30 seconds | Number |
| mimeType | The sent mimeType, supported for override in modern browser. Options: "application/json", "text/javascript", "text/html", "application/xml", "text/xml", "application/x-www-form-urlencoded" | String |
| success | A function to be called if the request succeeds | Function |
| error | A function to be called if the request fails | Function |
| context | The context in which we want to run the success/error callbacks , If none is provided the context will not be set (null) | Object |
                                             
## Service Names
acCdnDomain  
accountConfigReadOnly  
accountConfigReadWrite  
accountCreation  
adminArea  
agent  
agentVep  
appKeyManagement  
asyncMessaging  
asyncMessagingEnt  
batchelor  
coApp  
coBrowse  
connectionPanel  
conversationVep  
engHistDomain  
etool  
idp  
interactionPlatform  
keyService  
leBackofficeInt  
leBiMstr  
leBilling  
leCdnDomain  
leDataReporting  
leIntegration  
leStorage  
liveEngage  
liveEngageUI  
liveEngageVep  
loggos  
lpEng  
mTag  
mobileChat  
mobileVisit  
nlp  
openPlatform  
predictiveDialer  
pusher  
pusherInt  
redirect  
smt  
staticContent  
swift  
tokenizer  
visitManager  
visitorFeed  
vssDomain