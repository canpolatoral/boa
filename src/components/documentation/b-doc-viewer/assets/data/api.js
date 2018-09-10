export default `
# Introduction

The world of finance is changing dramatically.  Technology is transforming the way financial service providers interact with their customers, just as it is also changing the way consumers’ access financial products. Be a leader in FinTech and help pave the way to re-imagine finance and banking.

This is a document which you can use to provide a high-level overview of our APIs, including such topics as:

•	Installing PostMan

•	Importing Web Service Endpoints

•	Sending a request

In the case of this guide, we use PostMan. PostMan is an API testing tool. We will show you how to call our APIs using Postman.

And also, you can download documentation file from [here](http://hackathon/doc.pdf)

## Postman
### Installing Postman

You cen get the PostMan from [Postman](https://www.getpostman.com/app/download/win64) .

The download should take a few minutes, depending on your internet connection. Once you’ve downloaded the app, you can launch Postman. After launching, you can select “Take me straight to the app. I'll create an account another time.” Option instead of Sign Up.


### Importing Web Service Endpoints

You can use the Import button to import our web service endpoints.

After clicking import button, you must choose a collection file. You can download the collection file from [here](http://hackathon/postman.zip)

After Importing, you will see all API endpoints in the collections section.

### Sending A Request

In the collections section, firstly you must select an endpoint. Using the send button , you can send a request to API Banking Web Service.

If the body parameter and header are correct, the web service will send a respond to you as:

You can find more information about Postman  [here](https://www.getpostman.com/docs/)

# Authentication

In order to use the hackathon APIs, you need to an API key. This key uniquely identifies the user who wants to use the hackathon APIs. Without this key, you will get a 401 (http unauthorized) error. The GenerateAPIKey API sends to you an API key. You should store this key to use other API request. To use other APIs you should add this API key to request header as a parameter.


## Generate API Key


\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "cache-control": "no-cache"
]
let parameters = ["UserName": "guler"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/GenerateAPIKey")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

<br />

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, {
  UserName: "guler"
});
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/GenerateAPIKey")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

<br />

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/GenerateAPIKey",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": {
    UserName: "guler"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
 {
	"userName": null,
	"apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9vEnYLRZqDRPqufSesbD8",
	"results": [],
	"success": true
 }
\`\`\`

This endpoint returns an API Key.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/GenerateAPIKey\`

### Parameters

| blue |
| Parameter | Type | Description | Required |
| --------- | ------- | ----------- | ------ |
| userName | string | This parameter uniquely identifies the user. | Required |

# Accounts API

## Accounts

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["AccountNumber": 8755359] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/Accounts")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/Accounts");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"AccountNumber\":8755359\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"AccountNumber\":8755359\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/Accounts")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`js
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/Accounts",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"AccountNumber\":8755359\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
  {
   "accountList":[
      {
         "accountName":"Cari Hesap",
         "accountNumber":8755359,
         "accountSuffix":"1",
         "accountBalance":60000,
         "accountFEC":"0",
         "accountFECCode":"TL",
         "ibanNumber":"TR670020500000875535900001",
         "accountType":"Cari",
         "accountOpenDate":"10.09.2013",
         "accountBranch":"TEST-TEST-Maltepe Şube",
         "branchId":"28",
         "customerName":"Merlene"
      }
   ],
   "totalTLBalance":54213840.6,
   "totalUSDBalance":13854892.74,
   "results":[],
"success":true
}
\`\`\`

Retrieve all accounts based on Account Number.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/Accounts\`

### Parameters

| green |
| Parameter | Type | Description | Required |
| --------- | ------- | ----------- | ------ |
| accountNumber | int | This parameter uniquely identifies the customer. | Required |


## Account Balance Info

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "AccountNumber": 8991541,
  "AccountSuffix": 101
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/AccountBalanceInfo")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/AccountBalanceInfo");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"AccountNumber\":8991541,\n  \"AccountSuffix\":101\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"AccountNumber\":8991541,\n  \"AccountSuffix\":101\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/AccountBalanceInfo")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/AccountBalanceInfo",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"AccountNumber\":8991541,\n  \"AccountSuffix\":101\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "accountInfo":{
      "accountName":"Cari Hesap",
      "accountNumber":8991541,
      "accountSuffix":"1",
      "accountBalance":482.1,
      "accountFEC":"0",
      "accountFECCode":"TL",
      "ibanNumber":"TR350020500000899154100001",
      "accountType":"Cari",
      "accountOpenDate":"03.06.2014",
      "accountBranch":"TEST-TEST-Soğanlık Şube",
      "branchId":"196",
      "customerName":"Deniz Ceyda Defne"
   },
   "results":[],
   "success":true
}

\`\`\`

Retrieve account’s balance info based on Account Number and Account Suffix.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/AccountBalanceInfo\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | This parameter uniquely identifies the customer. | Required
accountSuffix | int	| Uniquely identifies the account type. | Required

## Account Transactions

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["AccountNumber": 8755359] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/AccountTransactions")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/AccountTransactions");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"AccountNumber\":8755359\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"AccountNumber\":8755359\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/AccountTransactions")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();

\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/AccountTransactions",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"AccountNumber\":8755359\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});

\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "accountTransactionHistoryList":[
      {
         "account":"8755359-1",
         "transactionDate":"17.03.2017",
         "description":"Havale",
         "amount":"11.90 TL",
         "balance":"482.10 TL",
         "fecCode":"TL",
         "fec":0,
	    "transactionAmount":11.9
      }
   ],
   "results":[],
   "success":true
}
\`\`\`

Gets a list of all transactions that have been took place by customer.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/AccountTransactions\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | This parameter uniquely identifies the customer. | Required

# Invoice API
## Invoice Order

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["AccountNumber": "8755359"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/InvoiceOrder")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/InvoiceOrder");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"AccountNumber\":\"8755359\"\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"AccountNumber\":\"8755359\"\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/InvoiceOrder")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/InvoiceOrder",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"AccountNumber\":\"8755359\"\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
 {
   "accountList":[
      {
         "accountName":"Cari Hesap",
         "accountNumber":8755359,
         "accountSuffix":"1",
         "accountBalance":0,
         "accountFEC":"0",
         "accountFECCode":"TL",
         "ibanNumber":"TR350020500000899154100001",
         "accountType":"1",
         "accountOpenDate":"03.06.2014",
         "accountBranch":"TEST-TEST-Soğanlık Şube",
         "branchId":"196",
         "customerName":"Robbins"
      }
   ],
   "creditCardList":[
      {
         "creditCardNumber":"4025901806703233",
         "secureCardNumber":"4025 **** **** 3233",
         "cardHolderName":"Odus Grizel",
         "cardTypeName":"TEMASSIZ VISA SALEPLUS",
         "cardProductCode":"CLESVISALE",
         "cardAvailableLimit":"1,139.43",
         "cardTotalLimit":"2,000.00"
      }
   ],
   "companyList":[
      {
         "description":"Son Ödeme Tarihi Geçmiş Faturalar Kurum Tarafından Kabul Edilmemektedir.",
         "name":"ADIYAMAN SU",
         "companyId":"13",
         "fullName":"ADIYAMAN SU",
         "companyDebtDetails":[
            {
               "name":"Fatura Ödemesi",
               "debtTypeId":1,
               "installmentNumberName":"Abone No",
               "installmentNumberDescription":"Abone numaranızı 15 haneye kadar fatura üzerinde gördüğünüz gibi giriniz. Örnek: 1234",
               "installmentNumberLength":15
            }
         ],
         "corporationTypeInt":3,
         "corporationType":"Water"
      },      {
         "description":null,
         "name":"MESKİ",
         "companyId":"100",
         "fullName":"Mersin Su",
         "companyDebtDetails":[
            {
               "name":"Fatura Ödemesi",
               "debtTypeId":1,
               "installmentNumberName":null,
               "installmentNumberDescription":null,
               "installmentNumberLength":0
            }
         ],
         "corporationTypeInt":3,
         "corporationType":"Water"
      }
   ],
   "corporationTypeList":[
      {
         "text":"Natural Gas",
         "value":"1"
      },
      {
         "text":"Electricity",
         "value":"2"
      },
      {
         "text":"Water",
         "value":"3"
      },
      {
         "text":"Telecommunication",
         "value":"4"
      },
      {
         "text":"Other",
         "value":"5"
      },
      {
         "text":"Municipality Tax",
         "value":"6"
      },
      {
         "text":"Site Subscription",
         "value":"7"
      }
   ],
   "results":[

   ],
   "success":true
}
\`\`\`

Gets all parameters about Invoice Order. Response includes account list, credit card list and company list.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/InvoiceOrder\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | This parameter uniquely identifies the customer. | Required

## Invoices

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache",
]
let parameters = [
  "CompanyId": "2",
  "InstallmentNumber": "0000163415"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/Invoices")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/Invoices");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"CompanyId\":\"2\",\r\n  \"InstallmentNumber\":\"0000163415\"\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"CompanyId\":\"2\",\r\n  \"InstallmentNumber\":\"0000163415\"\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/Invoices")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/Invoices",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9U",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"CompanyId\":\"2\",\r\n  \"InstallmentNumber\":\"0000163415\"\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "invoiceList":[
      {
         "amount":54,
         "invoiceNumber":"2015065990503",
         "dueDate":"14.02.2016",
         "customerName":"AHMET VELİ"
      },{
         "amount":60,
         "invoiceNumber":"2015124278839",
         "dueDate":"15.01.2016",
         "customerName":"EBUBEKİR GÜLER"
      }
   ],
   "results":[],
   "success":true
}

\`\`\`

Gets list of invoices based on Company ID and Installment Number.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/Invoices\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
companyId | int	| A unique id of a company. | Required
installmentNumber | string | Uniquely identifies the invoice. | Required

## Invoice Order Execute

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "AccountNumber": "8991541",
  "CorporationId": 2,
  "DebtTypeId": 1,
  "InstallmentNumber": "0000180992",
  "MethodName": "",
  "Accounts": [
    [
      "AccountNumber": 8991541,
      "AccountSuffix": 1
    ]
  ]
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/InvoiceOrderExecute")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/InvoiceOrderExecute");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n \r\n  \"AccountNumber\":\"8991541\",\r\n  \"CorporationId\" : 2,\r\n    \"DebtTypeId\" : 1,\r\n    \"InstallmentNumber\" : \"0000180992\",\r\n    \"MethodName\" : \"\",\r\n    \"Accounts\":[{\r\n            \"AccountNumber\" : 8991541,\r\n            \"AccountSuffix\" : 1\r\n  }]\r\n} ", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n \r\n  \"AccountNumber\":\"8991541\",\r\n  \"CorporationId\" : 2,\r\n    \"DebtTypeId\" : 1,\r\n    \"InstallmentNumber\" : \"0000180992\",\r\n    \"MethodName\" : \"\",\r\n    \"Accounts\":[{\r\n            \"AccountNumber\" : 8991541,\r\n            \"AccountSuffix\" : 1\r\n  }]\r\n} ");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/InvoiceOrderExecute")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/InvoiceOrderExecute",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n \r\n  \"AccountNumber\":\"8991541\",\r\n  \"CorporationId\" : 2,\r\n    \"DebtTypeId\" : 1,\r\n    \"InstallmentNumber\" : \"0000180992\",\r\n    \"MethodName\" : \"\",\r\n    \"Accounts\":[{\r\n            \"AccountNumber\" : 8991541,\r\n            \"AccountSuffix\" : 1\r\n  }]\r\n} "
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[],
   "success":true
}
\`\`\`

Registers the invoice order based on given information.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/InvoiceOrderExecute\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int	| Uniquely identifies the customer. | Required
corporationID | int | Uniquely identifies the corporation. | Required
debtTypeId | int | Indicates the type of debt. | Required
installmentNumber | int | An unique number given to the invoice. | Required
accounts | account object |Usable accounts for order payment. | Required
accountSuffix | int | Uniquelly identifies the sub account. | Required

## Delete Invoice Order

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "AccountNumber": "8755359",
  "payment": [
    "AccountNumber": "",
    "BranchId": "",
    "CorporationId": 53,
    "CorporationName": "İSKİ",
    "DebtType": 1,
    "InsertDate": "01.01.0001",
    "InsertTime": "01.01.0001",
    "InstallmentNumber": "08382846",
    "InstitutionCode": "",
    "IsAllowPaymentWithMultipleSuffix": "",
    "OtherInstallmentNumber": "08382846",
    "OwnerType": "",
    "PaymentOrderId": 1413483,
    "PhoneInstallmentNumber": "",
    "TranDate": "01.01.001"
  ]
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/DeleteInvoiceOrder")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()

\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/DeleteInvoiceOrder");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"AccountNumber\":\"8755359\",\r\n  \"payment\" : {\r\n        \"AccountNumber\" : 0,\r\n        \"BranchId\" : 0,\r\n        \"CorporationId\" : 53,\r\n        \"CorporationName\" : \"İSKİ\",\r\n        \"DebtType\" : 1,\r\n        \"InsertDate\" : \"01.01.0001\",\r\n        \"InsertTime\" : \"01.01.0001\",\r\n        \"InstallmentNumber\" : \"08382846\",\r\n        \"InstitutionCode\" : \"\",\r\n        \"IsAllowPaymentWithMultipleSuffix\" : 0,\r\n        \"OtherInstallmentNumber\" : \"08382846\",\r\n        \"OwnerType\" : 0,\r\n        \"PaymentOrderId\" : 1413483,\r\n        \"PhoneInstallmentNumber\" : \"\",\r\n        \"TranDate\" : \"01.01.001\"}\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);

\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"AccountNumber\":\"8755359\",\r\n  \"payment\" : {\r\n        \"AccountNumber\" : 0,\r\n        \"BranchId\" : 0,\r\n        \"CorporationId\" : 53,\r\n        \"CorporationName\" : \"İSKİ\",\r\n        \"DebtType\" : 1,\r\n        \"InsertDate\" : \"01.01.0001\",\r\n        \"InsertTime\" : \"01.01.0001\",\r\n        \"InstallmentNumber\" : \"08382846\",\r\n        \"InstitutionCode\" : \"\",\r\n        \"IsAllowPaymentWithMultipleSuffix\" : 0,\r\n        \"OtherInstallmentNumber\" : \"08382846\",\r\n        \"OwnerType\" : 0,\r\n        \"PaymentOrderId\" : 1413483,\r\n        \"PhoneInstallmentNumber\" : \"\",\r\n        \"TranDate\" : \"01.01.001\"}\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/DeleteInvoiceOrder")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/DeleteInvoiceOrder",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"AccountNumber\":\"8755359\",\r\n  \"payment\" : {\r\n        \"AccountNumber\" : 0,\r\n        \"BranchId\" : 0,\r\n        \"CorporationId\" : 53,\r\n        \"CorporationName\" : \"İSKİ\",\r\n        \"DebtType\" : 1,\r\n        \"InsertDate\" : \"01.01.0001\",\r\n        \"InsertTime\" : \"01.01.0001\",\r\n        \"InstallmentNumber\" : \"08382846\",\r\n        \"InstitutionCode\" : \"\",\r\n        \"IsAllowPaymentWithMultipleSuffix\" : 0,\r\n        \"OtherInstallmentNumber\" : \"08382846\",\r\n        \"OwnerType\" : 0,\r\n        \"PaymentOrderId\" : 1413483,\r\n        \"PhoneInstallmentNumber\" : \"\",\r\n        \"TranDate\" : \"01.01.001\"}\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[],
   "success":true
}
\`\`\`

Deletes the invoice order based on Account Number and Payment Order ID.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/DeleteInvoiceOrder\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | Uniquely identifies the customer. | Required
paymentOrderId | int | Uniquely identifies the Invoice Order. | Required

## Invoice Companies

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let postData = NSData(data: "

".data(using: String.Encoding.utf8)!)

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/InvoiceCompanies")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/InvoiceCompanies");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "\n\n", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("text/plain");
RequestBody body = RequestBody.create(mediaType, "\n\n");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/InvoiceCompanies")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/InvoiceCompanies",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "data": "\n\n"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "companyList":[
      {
         "description":"Son Ödeme Tarihi Geçmiş Faturalar Kurum Tarafından Kabul Edilmemektedir.",
         "name":"AFJET",
         "companyId":"21",
         "fullName":"AFJET",
         "companyDebtDetails":[
            {
               "name":"Fatura Ödemesi",
               "debtTypeId":1,
               "installmentNumberName":"Abone No",
               "installmentNumberDescription":"Abone numaranızı 8 haneye kadar fatura üzerinde gördüğünüz gibi giriniz. Örnek: 1234",
               "installmentNumberLength":8
            }
         ],
         "corporationTypeInt":1,
         "corporationType":"NaturalGas"
      }
     ],
   "results":[],
   "success":true
}

\`\`\`

Gets a list of all companies.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/InvoiceCompanies\`

## Invoice Debt Payment

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["PaymentInfo": [
    "SenderAccountNumber": "8755359",
    "SenderAccountSuffix": 1,
    "CompanyId": 2,
    "InstallmentNumber": "0000013210",
    "InvoiceNumber": "0000013210",
    "Amount": 32.51
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/InvoicePayment")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/InvoicePayment");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"PaymentInfo\" :     {\r\n        \"SenderAccountNumber\" : \"8755359\",\r\n        \"SenderAccountSuffix\":1,\r\n        \"CompanyId\":2,\r\n        \"InstallmentNumber\":\"0000013210\",\r\n        \"InvoiceNumber\":\"0000013210\",\r\n        \"Amount\":32.51000\r\n    }\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"PaymentInfo\" :     {\r\n        \"SenderAccountNumber\" : \"8755359\",\r\n        \"SenderAccountSuffix\":1,\r\n        \"CompanyId\":2,\r\n        \"InstallmentNumber\":\"0000013210\",\r\n        \"InvoiceNumber\":\"0000013210\",\r\n        \"Amount\":32.51000\r\n    }\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/InvoicePayment")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/InvoicePayment",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"PaymentInfo\" :     {\r\n        \"SenderAccountNumber\" : \"8755359\",\r\n        \"SenderAccountSuffix\":1,\r\n        \"CompanyId\":2,\r\n        \"InstallmentNumber\":\"0000013210\",\r\n        \"InvoiceNumber\":\"0000013210\",\r\n        \"Amount\":32.51000\r\n    }\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}
\`\`\`

This method let you can a payment for the invoice with the given parameters.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/InvoicePayment\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
senderAccountNumber | int | Account number of sender. | Required
senderAccountSuffix | short | Account suffix number of sender. | Required
companyId | int | This parameter uniquely identifies the company which has the invoice. | Required
installmentNumber | string | A unique identifier to identify the customer. | Required
invoiceNumber | string | A unique identifier to identify the invoice | Required
amount | decimal | Gives the current outstanding invoice balance in the number of cents. | Required
paymentInfo | object | It contains information of payment. | Required


#GSM API

## GSM Package List

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/GsmPackages")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/GsmPackages");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);

\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/GsmPackages")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/GsmPackages",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "packageList":[
      {
         "count":15,
         "price":15,
         "packageName":"15 TL - 15.00 TL"
      },
      {
         "count":9026,
         "price":12,
         "packageName":"12 TL ye Haftalık 50TL - 12.00 TL"
      }
   ],
   "gsmCorporateData":{
      "Turkcell":"0532",
      "TurkTelekom":"0555",
      "Vodafone":"0542"
   },
   "gsmCorporateValue":{
      "Turkcell":1,
      "TurkTelekom":3,
      "Vodafone":2
   },
   "results":[],
   "success":true
}
\`\`\`

Gets a list of all  packages of gsm companies.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/GsmPackages\`

## GSM Payment

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let postData = NSData(data: "{
"GsmPrePaidInfo" :    {
        "Count" :7004,
        "GsmCorporateData" :0542,
        "GsmCorporateValue" :1,
        "PackageName" :"15 TL - 15.00 TL",
        "PaymentType" :1,
        "PhoneNumber" :5399213884,
        "Price" :25,
        "SenderAccountNumber" :8991541,
        "SenderAccountSuffix" :"1"
    }
}".data(using: String.Encoding.utf8)!)

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/GsmPayment")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/GsmPayment");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n\"GsmPrePaidInfo\" :    {\r\n        \"Count\" :7004,\r\n        \"GsmCorporateData\" :0542,\r\n        \"GsmCorporateValue\" :1,\r\n        \"PackageName\" :\"15 TL - 15.00 TL\",\r\n        \"PaymentType\" :1,\r\n        \"PhoneNumber\" :5399213884,\r\n        \"Price\" :25,\r\n        \"SenderAccountNumber\" :8991541,\r\n        \"SenderAccountSuffix\" :\"1\"\r\n    } \r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("text/plain");
RequestBody body = RequestBody.create(mediaType, "{\r\n\"GsmPrePaidInfo\" :    {\r\n        \"Count\" :7004,\r\n        \"GsmCorporateData\" :0542,\r\n        \"GsmCorporateValue\" :1,\r\n        \"PackageName\" :\"15 TL - 15.00 TL\",\r\n        \"PaymentType\" :1,\r\n        \"PhoneNumber\" :5399213884,\r\n        \"Price\" :25,\r\n        \"SenderAccountNumber\" :8991541,\r\n        \"SenderAccountSuffix\" :\"1\"\r\n    } \r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/GsmPayment")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/GsmPayment",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "data": "{\r\n\"GsmPrePaidInfo\" :    {\r\n        \"Count\" :7004,\r\n        \"GsmCorporateData\" :0542,\r\n        \"GsmCorporateValue\" :1,\r\n        \"PackageName\" :\"15 TL - 15.00 TL\",\r\n        \"PaymentType\" :1,\r\n        \"PhoneNumber\" :5399213884,\r\n        \"Price\" :25,\r\n        \"SenderAccountNumber\" :8991541,\r\n        \"SenderAccountSuffix\" :\"1\"\r\n    } \r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[],
   "success":true
}

\`\`\`

Gets a list of all  packages of gsm companies.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/GSMPayment\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
count | int | A unique number of the package | Required
gsmCorporateData | string | Data of the gsm corporate e.g “0542”. | Required
gsmCorporateValue | int | Corporate ID of the GSM Corporate. | Required
packageName | string | Name of the package. | Required
paymentType | int | Type of the payment. | Required
phoneNumber | string | Indicates the phone number. | Required
price | decimal | The price of the package. | Required
accounttNumber | int | Sender account number. | Required
senderAccountSuffix | short | Uniquely identifies the account type. | Required
gsmPrePaidInfo | object | Gsm pre paid info | Required

#Loan API

## Loan Calculation Parameter

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/LoanCalculationParameter")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/LoanCalculationParameter");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/LoanCalculationParameter")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/LoanCalculationParameter",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "loanSegmentList":[
      {
         "paramCode":"1",
         "paramDescription":"Araç"
      },
      {
         "paramCode":"2",
         "paramDescription":"Gayrimenkul"
      },
      {
         "paramCode":"3",
         "paramDescription":"İhtiyaç"
      }
   ],
   "productTypeList":[
      {
         "paramCode":"BO",
         "paramDescription":"Araç Binek-Yeni"
      },
      {
         "paramCode":"BO2",
         "paramDescription":"Araç Binek-2.El"
      },
      {
         "paramCode":"TO",
         "paramDescription":"Ticari Araç"
      },
      {
         "paramCode":"TO2",
         "paramDescription":"Ticari Araç-2.El"
      },
      {
         "paramCode":"A",
         "paramDescription":"Arsa"
      },
      {
         "paramCode":"I",
         "paramDescription":"İşyeri"
      },
      {
         "paramCode":"K",
         "paramDescription":"Konut"
      },
      {
         "paramCode":"2B",
         "paramDescription":"2B Finansmanı"
      },
      {
         "paramCode":"IK",
         "paramDescription":"İhtiyaç Kart"
      },
      {
         "paramCode":"EF",
         "paramDescription":"Eğitim Finansmanı"
      },
      {
         "paramCode":"SF",
         "paramDescription":"Seyahat Finansmanı"
      },
      {
         "paramCode":"TF",
         "paramDescription":"Tekne Finansmanı"
      },
      {
         "paramCode":"KY",
         "paramDescription":"Konut Yapım Edinim"
      },
      {
         "paramCode":"IY",
         "paramDescription":"İşyeri Yapım Edinim"
      }
   ],
   "results":[],
   "success":true
}

\`\`\`

Returns list of loan segments and product types.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/LoanCalculationParameter\`

## Loan Calculation

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["ComputationInfo": [
    "ProductTypeId": "K",
    "CalculationTypeId": "1",
    "LoanAmount": "2500",
    "LoanMaturity": "2"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/LoanCalculation")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/LoanCalculation");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n\r\n  \"ComputationInfo\":{\r\n      \"ProductTypeId\":\"K\",\r\n    \"CalculationTypeId\":\"1\",\r\n    \"LoanAmount\":\"2500\",\r\n    \"LoanMaturity\":\"2\"\r\n  \r\n    \r\n  }\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n\r\n  \"ComputationInfo\":{\r\n      \"ProductTypeId\":\"K\",\r\n    \"CalculationTypeId\":\"1\",\r\n    \"LoanAmount\":\"2500\",\r\n    \"LoanMaturity\":\"2\"\r\n  \r\n    \r\n  }\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/LoanCalculation")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/LoanCalculation",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n\r\n  \"ComputationInfo\":{\r\n      \"ProductTypeId\":\"K\",\r\n    \"CalculationTypeId\":\"1\",\r\n    \"LoanAmount\":\"2500\",\r\n    \"LoanMaturity\":\"2\"\r\n  \r\n    \r\n  }\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
      "paymentInfo":{
      "loanType":"Konut",
      "profitRate":0.98,
      "loanAmount":2500,
      "loanMaturity":2,
      "instalmentAmount":1268.4,
      "totalAmount":2536.81,
      "totalProfit":36.81,
      "paymentTable":[
         {
            "sortOrder":1,
            "amount":1268.4048661558364016320031834,
            "mainAmount":1243.9048661558364016320031834,
            "profit":24.5,
            "remainingMainAmount":1256.0951338441635983679968166
         },
         {
            "sortOrder":2,
            "amount":1268.4048661558364016320031834,
            "mainAmount":1256.0951338441635983679968146,
            "profit":12.309732311672803264006368803,
            "remainingMainAmount":2e-24
         }
      ]
   },
   "results":[],
   "success":true
}
\`\`\`

Calculates loan based on sended parameters.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/LoanCalculation\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
computationInfo | computation object | Indicates the computation info. | Required
productTypeId | string | Indicates the product type. | Required
loanAmount | string | Indicates the loan amount. | Required
loanMaturity | string | Maturity of loan. | Required

## Loans

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["AccountNumber": 8755359] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/loans")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/loans");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"AccountNumber\":8755359\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"AccountNumber\":8755359\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/loans")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/loans",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"AccountNumber\":8755359\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
	"loanList":[
      	{
         		"remainingInstallment":36,
         		"loanType":"Taksitli Ticari Krediler",
         		"remainingDebt":"263,447.55 TL",
         		"loanAmount":"200,000.00 TL",
         		"projectNumber":302,
         		"accountNumber":8991541,
         		"debt":263447.55,
         		"fecCode":"TL",
         		"totalLoanAmount":"263,447.55 TL",
         		"totalPaymentAmount":"0.00 TL"
      	}],
   "results":[  ],
   "success":true
}
\`\`\`

Returns list of loans belong to given account number.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/Loans\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | This parameter uniquely identifies the customer. | Required


# News API

## All Financial News

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/API/AllFinancialNews")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/API/AllFinancialNews");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/API/AllFinancialNews")
  .post(null)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/API/AllFinancialNews",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": ""
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "financialNewsList":[
      {
         "date":"20170323133411",
         "dateTime":"2017-03-23T13:34:11",
         "header":"BOE Başkan Yardımcısı Broadbent, faiz artırımı yönünde oy kullanmaya yakın olup olmadığını söylemedi"
      },

            {
         "date":"20170323114423",
         "dateTime":"2017-03-23T11:44:23",
         "header":"Hazine, kira sertifikası ihracı olanaklarını araştırmak üzere yetki verdi"
      }
   ],
   "results":[

   ],
   "success":true
}
\`\`\`

Returns list of news.

### HTTP Request

\`POST http://srvboaoneprep1:90/API/AllFinancialNews\`


#Credit Card API

## Credit Card List

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["AccountNumber": "91262643"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/CreditCards")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/CreditCards");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"AccountNumber\":\"91262643\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"AccountNumber\":\"91262643\"\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/CreditCards")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/CreditCards",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"AccountNumber\":\"91262643\"\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "creditCardList":[
      {
         "creditCardNumber":"5253125858226531",
         "secureCardNumber":"5253 **** **** 6531",
         "cardHolderName":"Kindra Rella",
         "cardTypeName":"TEMASSIZ SALE PLUS",
         "cardProductCode":"MCSALESB",
         "cardAvailableLimit":"2,639.08",
         "cardTotalLimit":"3,000.00"
      },
      {
         "creditCardNumber":"5188960355882819",
         "secureCardNumber":"5188 **** **** 2819",
         "cardHolderName":"Kindra Rella",
         "cardTypeName":"TEMASSIZ SAĞLAM KART",
         "cardProductCode":"SAGLAMMCSB",
         "cardAvailableLimit":"3,000.00",
         "cardTotalLimit":"3,000.00"
      }
   ],
   "results":[],
   "success":true
}
\`\`\`

Using the customer number, it gets a list of all credit cards information belonging to the account.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/CreditCards\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | This parameter uniquely identifies the customer. | Required

## Card Info

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "CardNumber": "5188969343476389",
  "AccountNumber": "8755359"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/CreditCardInformation")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/CreditCardInformation");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"CardNumber\":\"5188969343476389\",\n  \"AccountNumber\":\"8755359\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"CardNumber\":\"5188969343476389\",\n  \"AccountNumber\":\"8755359\"\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/CreditCardInformation")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/CreditCardInformation",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"CardNumber\":\"5188969343476389\",\n  \"AccountNumber\":\"8755359\"\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "creditCardList":[
      {
         "creditCardNumber":"5253125858226531",
         "secureCardNumber":"5253 **** **** 6531",
         "cardHolderName":"Kindra Rella",
         "cardTypeName":"TEMASSIZ SALE PLUS",
         "cardProductCode":"MCSALESB",
         "cardAvailableLimit":"2,639.08",
         "cardTotalLimit":"3,000.00"
      },
      {
         "creditCardNumber":"5188960355882819",
         "secureCardNumber":"5188 **** **** 2819",
         "cardHolderName":"Kindra Rella",
         "cardTypeName":"TEMASSIZ SAĞLAM KART",
         "cardProductCode":"SAGLAMMCSB",
         "cardAvailableLimit":"3,000.00",
         "cardTotalLimit":"3,000.00"
      }
   ],
   "results":[  ],
   "success":true
}

\`\`\`

Using the account number and credit card number , it gets credit card information belonging to the account.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/CreditCardInformation\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber | int | This parameter uniquely identifies the customer. | Required
creditCardNumber | string | This parameter uniquely identifies the card. | Required

## Credit Card Debt Payment

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["TransferInfo": [
    "Amount": "11.9",
    "CreditCardNumber": "5188960090297079",
    "SenderAccountNumber": 8432793,
    "SenderAccountSuffix": 1,
    "TranDateWithTime": "23.03.2017"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/SendMoneyToCard")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/SendMoneyToCard");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9);
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"TransferInfo\" :     {\r\n        \"Amount\" : \"11.9\",\r\n        \"CreditCardNumber\" : \"5188960090297079\",\r\n        \"SenderAccountNumber\" : 8432793,\r\n        \"SenderAccountSuffix\" : 1,\r\n        \"TranDateWithTime\" : \"23.03.2017\"\r\n    }\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"TransferInfo\" :     {\r\n        \"Amount\" : \"11.9\",\r\n        \"CreditCardNumber\" : \"5188960090297079\",\r\n        \"SenderAccountNumber\" : 8432793,\r\n        \"SenderAccountSuffix\" : 1,\r\n        \"TranDateWithTime\" : \"23.03.2017\"\r\n    }\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/SendMoneyToCard")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/SendMoneyToCard",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"TransferInfo\" :     {\r\n        \"Amount\" : \"11.9\",\r\n        \"CreditCardNumber\" : \"5188960090297079\",\r\n        \"SenderAccountNumber\" : 8432793,\r\n        \"SenderAccountSuffix\" : 1,\r\n        \"TranDateWithTime\" : \"23.03.2017\"\r\n    }\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}
\`\`\`

Send money from an authorized user’s account to any caredit card.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/SendMoneyToCard\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
transferInfo | transfer object | Information about transfer | Required
amount | decimal | Amount of funds to transfer to destination card. | Required
creditCarNumber | string | Destination card number. | Required
senderAccountNumber | int | Sender account number. | Required
senderAccountSuffix | short | Sender account suffix. | Required
tranDateWithTime | datetime | The date time when the payment will be paid. | Required


#Stock API

## IMKB Top Stocks

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/IMKBTopStocks")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/IMKBTopStocks");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/IMKBTopStocks")
  .post(null)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/IMKBTopStocks",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": ""
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
  "fxStockList":[
      {
         "code":"DOHOL",
         "flag":"1",
         "lastValue":0,
         "difference":0,
         "daily":0,
         "yearly":-100
      },
      {
         "code":"TKFEN",
         "flag":"1",
         "lastValue":0,
         "difference":0,
         "daily":0,
         "yearly":-100
      },
      {
         "code":"ETYAT",
         "flag":"1",
         "lastValue":0,
         "difference":0,
         "daily":0,
         "yearly":-100
      },
      {
         "code":"MMCAS",
         "flag":"1",
         "lastValue":0,
         "difference":0,
         "daily":0,
         "yearly":-100
      },
      {
         "code":"DOCO",
         "flag":"1",
         "lastValue":0,
         "difference":0,
         "daily":0,
         "yearly":-100
      }
   ],
   "results":[],
   "success":true
}
\`\`\`

It gets a list of top five stocks of IMKB

### HTTP Request

\`POST http://srvboaoneprep1:90/api/IMKBTopStocks\`

## IMKB Last Stocks

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/IMKBLastStocks")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/IMKBLastStocks");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/IMKBLastStocks")
  .post(null)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9U")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/IMKBLastStocks",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": ""
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "fxStockList":[
      {
         "code":"ASCEL",
         "flag":"-1",
         "lastValue":3.51,
         "difference":-0.37,
         "daily":-9.54,
         "yearly":-8.83
      },
      {
         "code":"AYES",
         "flag":"-1",
         "lastValue":1.4,
         "difference":-0.1,
         "daily":-6.67,
         "yearly":40
      },
      {
         "code":"MERIT",
         "flag":"-1",
         "lastValue":5,
         "difference":-0.34,
         "daily":-6.37,
         "yearly":1.63
      },
      {
         "code":"MEMSA",
         "flag":"-1",
         "lastValue":0.15,
         "difference":-0.01,
         "daily":-6.25,
         "yearly":0
      },
      {
         "code":"VAKFN",
         "flag":"-1",
         "lastValue":2.61,
         "difference":-0.09,
         "daily":-3.33,
         "yearly":175.07
      }
   ],
   "results":[ ],
   "success":true
}
\`\`\`

It gets a list of last five stocks of IMKB

### HTTP Request

\`POST http://srvboaoneprep1:90/api/IMKBLastStocks\`

## IMKB Indexes

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/IMKBIndexes")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/IMKBIndexes");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/IMKBIndexes")
  .post(null)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/IMKBIndexes",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": ""
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "fxStockList":[
      {
         "code":"BIST 100",
         "flag":"1",
         "lastValue":91338,
         "difference":436,
         "daily":0.48,
         "yearly":9.51
      },
      {
         "code":"BIST 30",
         "flag":"1",
         "lastValue":112225,
         "difference":558,
         "daily":0.5,
         "yearly":9.11
      },
      {
         "code":"BIST HIZMET",
         "flag":"1",
         "lastValue":58199,
         "difference":229,
         "daily":0.39,
         "yearly":-4.44
      },
      {
         "code":"BIST SINAI",
         "flag":"1",
         "lastValue":97354,
         "difference":625,
         "daily":0.65,
         "yearly":15.33
      },
      {
         "code":"BIST MALI",
         "flag":"1",
         "lastValue":119861,
         "difference":415,
         "daily":0.35,
         "yearly":11.32
      },
      {
         "code":"BIST BANKA",
         "flag":"1",
         "lastValue":154323,
         "difference":680,
         "daily":0.44,
         "yearly":12.43
      }
   ],
   "results":[],
   "success":true
}

\`\`\`

It gets a list of index of IMKB.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/IMKBIndexes\`

# Currency Rate API

## Foreign Exchange Rates

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/ForeignExchangeRates")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/ForeignExchangeRates");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/ForeignExchangeRates")
  .post(null)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/ForeignExchangeRates",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": ""
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
  "fxRateList":[
      {
         "fxName":"Amerikan Doları",
         "fxShortName":"USD",
         "fxCode":1,
         "baseFEC":0,
         "buyRate":3.52849,
         "sellRate":3.72007,
         "dailyBuyChange":-1,
         "dailySellChange":1
      },
      {
         "fxName":"Euro",
         "fxShortName":"EUR",
         "fxCode":19,
         "baseFEC":0,
         "buyRate":3.73827,
         "sellRate":4.03131,
         "dailyBuyChange":-1,
         "dailySellChange":1
      },
      {
         "fxName":"Altın",
         "fxShortName":"ALT (gr)",
         "fxCode":24,
         "baseFEC":0,
         "buyRate":139.14847,
         "sellRate":150.40745,
         "dailyBuyChange":1,
         "dailySellChange":1
      },
      {
         "fxName":"Gümüş",
         "fxShortName":"GMS (gr)",
         "fxCode":26,
         "baseFEC":0,
         "buyRate":1.8229,
         "sellRate":2.18258,
         "dailyBuyChange":1,
         "dailySellChange":1
      },   ],
   "results":[

   ],
   "success":true
}
\`\`\`

Currency API is a service for querying the currency exchange rates between many common currencies.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/ForeignExchangeRates\`

## Foreign Exchange Transaction

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "FromFec": 19,
  "ToFec": "",
  "AccountNumber": 8755359,
  "AccountSuffixFrom": 102,
  "AccountSuffixTo": 1,
  "ExchangeAmount": 2,
  "ToAccontBranch": 28,
  "FromAccontBranch": 28
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/ForeignExchangeTransaction")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/ForeignExchangeTransaction");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n\"FromFec\":19,\r\n\"ToFec\":0,\r\n\"AccountNumber\":8755359,\r\n\"AccountSuffixFrom\":102,\r\n\"AccountSuffixTo\":1,\r\n\"ExchangeAmount\":2,\r\n\"ToAccontBranch\":28,\r\n\"FromAccontBranch\":28\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n\"FromFec\":19,\r\n\"ToFec\":0,\r\n\"AccountNumber\":8755359,\r\n\"AccountSuffixFrom\":102,\r\n\"AccountSuffixTo\":1,\r\n\"ExchangeAmount\":2,\r\n\"ToAccontBranch\":28,\r\n\"FromAccontBranch\":28\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/ForeignExchangeTransaction")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/ForeignExchangeTransaction",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n\"FromFec\":19,\r\n\"ToFec\":0,\r\n\"AccountNumber\":8755359,\r\n\"AccountSuffixFrom\":102,\r\n\"AccountSuffixTo\":1,\r\n\"ExchangeAmount\":2,\r\n\"ToAccontBranch\":28,\r\n\"FromAccontBranch\":28\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}
\`\`\`

You can buy or sell foreign exchange with this method.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/ForeignExchangeTransaction\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
fromFec | short | Information about fec which will sell or buy | Required
toFec | short | Information about fec which will sell or buy | Required
accountNumber | int | Indicates account number | Required
accountSuffixFrom | short | Indicates account suffix of fromfec | Required
accountSuffixTo | short | Indicates account suffix of toFec | Required
exchangeAmount | decimal | Amount of the transaction | Required
toAccountBranch | short | Indicates account branch of toFec | Required
fromAccountBranch | short | Indicates account branch of fromFec | Required

#Entity Service

## Entity Coordinate List

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/Entities")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/Entities");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/Entities")
  .post(null)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/Entities",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": ""
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
"branchList":[
      {
         "name":"Merter Şubesi",
         "cityId":34,
         "cityName":"İstanbul",
         "branchName":"Merter Şubesi",
         "branchType":"Şube",
         "longitude":"28.883524",
         "latitude":"41.013365",
         "address":"Fatih Cad. No:22",
         "phone":"+90 212 637 0087",
         "fax":"+90 212 637 3705"
      },
      {
         "name":"Diyarbakır Şubesi",
         "cityId":21,
         "cityName":"Diyarbakır",
         "branchName":"Diyarbakır Şubesi",
         "branchType":"Şube",
         "longitude":"40.236960",
         "latitude":"37.914262",
         "address":"Gazi Cad. No:27/D",
         "phone":"+90 412 223 5348",
         "fax":"+90 412 223 5100"
      }
   ],
   "atmList":[
      {
         "name":"Süleymanpaşa ATM",
         "cityId":59,
         "cityName":"Tekirdağ",
         "branchName":"Süleymanpaşa ATM",
         "branchType":"",
         "longitude":"27.502053",
         "latitude":"40.976447",
         "address":"Hükümet Cad. No:219",
         "phone":"",
         "fax":""
      }
   ],
   "xtmList":[
      {
         "name":"Göztepe Meydan XTM Şube",
         "cityId":34,
         "cityName":"İstanbul",
         "branchName":"Göztepe Meydan XTM Şube",
         "branchType":"",
         "longitude":"28.837608",
         "latitude":"41.054189",
         "address":"Demirkapı Mah. Maslak Cad. No:36",
         "phone":"+90 212 634 3194",
         "fax":"+90 212 634 3194"
      }
   ],
   "results":[

   ],
   "success":true
}

\`\`\`

Returns a list of ATMs,XTMs and branches with Address, Latitude and Longitude.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/Entities\`


#Profit Share Service

## Profit Share Calculation Parameter

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9,
  "cache-control": "no-cache"
]
let parameters = [
  "FEC": "",
  "MaturityTerm": 180,
  "Money": "2000",
  "ProductGroup": "2"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/ProfitShareParameters")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/ProfitShareParameters");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"FEC\":0,\r\n  \"MaturityTerm\":180,\r\n  \"Money\":\"2000\",\r\n  \"ProductGroup\":\"2\"\r\n  \r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"FEC\":0,\r\n  \"MaturityTerm\":180,\r\n  \"Money\":\"2000\",\r\n  \"ProductGroup\":\"2\"\r\n  \r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/ProfitShareParameters")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/ProfitShareParameters",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"FEC\":0,\r\n  \"MaturityTerm\":180,\r\n  \"Money\":\"2000\",\r\n  \"ProductGroup\":\"2\"\r\n  \r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
"accountTypeList":[
      {
         "paramCode":"2",
         "paramDescription":"KATILMA"
      },
      {
         "paramCode":"3",
         "paramDescription":"YATIRIM"
      }
   ],
"MinBalanceList":[
      {
         "paramCode":"KATILMA",
         "paramDescription":"250"
      },
      {
         "paramCode":"YATIRIM",
         "paramDescription":"20000"
      }
   ],
   "fecList":[
      {
         "fecCode":"TL",
         "fecId":0,
         "fecName":"Türk Lirası"
      },
      {
         "fecCode":"USD",
         "fecId":1,
         "fecName":"Amerikan Doları"
      },
      {
         "fecCode":"EUR",
         "fecId":19,
         "fecName":"Euro"
      },
      {
         "fecCode":"ALT (gr)",
         "fecId":24,
         "fecName":"Altın"
      }
   ],
   "maturityTermList":[
      {
         "maturityTerm":31,
         "maturityName":"1 Aylık"
      },
      {
         "maturityTerm":91,
         "maturityName":"3 Aylık"
      },
      {
         "maturityTerm":180,
         "maturityName":"6 Aylık"
      },
      {
         "maturityTerm":364,
         "maturityName":"1 Yıllık"
      },
      {
         "maturityTerm":366,
         "maturityName":"1 Yıldan Uzun"
      }
   ],
   "results":[

   ],
   "success":true
}
\`\`\`

Returns list of account type, fec and maturity term to calculate profit share.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/ProfitShareParameters\`

## Profit Share Calculation

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "FEC": "",
  "MaturityTerm": 180,
  "Money": "2000",
  "ProductGroup": "2"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/ProfitShareComputation")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/ProfitShareComputation");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"FEC\":0,\r\n  \"MaturityTerm\":180,\r\n  \"Money\":\"2000\",\r\n  \"ProductGroup\":\"2\"\r\n  \r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"FEC\":0,\r\n  \"MaturityTerm\":180,\r\n  \"Money\":\"2000\",\r\n  \"ProductGroup\":\"2\"\r\n  \r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/ProfitShareComputation")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/ProfitShareComputation",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"FEC\":0,\r\n  \"MaturityTerm\":180,\r\n  \"Money\":\"2000\",\r\n  \"ProductGroup\":\"2\"\r\n  \r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
 "profitShareCalculation":{
      "productCode":"6AYLIKKATILMA",
      "segmentCode":"KATKLASIK",
      "segmentName":"Klasik",
      "minimumBalance":250,
      "maximumBalance":49999.99,
      "profitShareRatio":78,
      "grossProfitShare":76.16573,
      "netProfitShare":64.740871,
      "grossProfitShareYearly":7.722358702492581,
      "netProfitShareYearly":6.564005
   },
   "results":[ ],
   "success":true
}

\`\`\`

According to request parameter, it retrives the result of profit share calculation.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/ProfitShareComputation\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
fec | int | An unique code given to the fec type. | Required
maturityTerm | string | It indicates number of day in a maturity term. | Required
money | decimal |Calculation amount | Required

#Money Transfer Service

## Money Transfer To IBAN

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["TransferInfo": [
    "Amount": "11.9",
    "ReceiverIBANNumber": "TR350020500000899154100001",
    "SenderAccountNumber": 8755359,
    "SenderAccountSuffix": 1,
    "TranDateWithTime": "13.03.2017"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/SendMoney")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/SendMoney");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\r\n  \"TransferInfo\" :     {\r\n        \"Amount\" : \"11.9\",\r\n        \"ReceiverIBANNumber\" : \"TR350020500000899154100001\",\r\n        \"SenderAccountNumber\" : 8755359,\r\n        \"SenderAccountSuffix\" : 1,\r\n        \"TranDateWithTime\" : \"13.03.2017\"\r\n    }\r\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\r\n  \"TransferInfo\" :     {\r\n        \"Amount\" : \"11.9\",\r\n        \"ReceiverIBANNumber\" : \"TR350020500000899154100001\",\r\n        \"SenderAccountNumber\" : 8755359,\r\n        \"SenderAccountSuffix\" : 1,\r\n        \"TranDateWithTime\" : \"13.03.2017\"\r\n    }\r\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/SendMoney")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/SendMoney",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\r\n  \"TransferInfo\" :     {\r\n        \"Amount\" : \"11.9\",\r\n        \"ReceiverIBANNumber\" : \"TR350020500000899154100001\",\r\n        \"SenderAccountNumber\" : 8755359,\r\n        \"SenderAccountSuffix\" : 1,\r\n        \"TranDateWithTime\" : \"13.03.2017\"\r\n    }\r\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}
\`\`\`

Send money from an authorized user’s account to any IBAN.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/SendMoney\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
amount | decimal |Amount that will be sent. | Required
receiverIBANNumber | string | Indicates receiver IBAN number. | Required
senderAccountNumber | int | Indicates sender account number. | Required
senderAccountSuffix | short | Indicates sender account suffix number. | Required
tranDateWithTime | datetime | Indicates transaction date | Required
transferInfo | object | It contains information of transfer |Required


## Money Transfer To Mobile

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "SenderAccountNumber": 8755359,
  "SenderAccountSuffix": 1,
  "ReceiverPhone": 5075913876,
  "MoneyTransferDescription": "test desc",
  "Amount": 13
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/SendToMobile")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/SendToMobile");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"SenderAccountNumber\":8755359,\n  \"SenderAccountSuffix\":1,\n  \"ReceiverPhone\":5075913876,\n  \"MoneyTransferDescription\":\"test desc\",\n  \"Amount\":13\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"SenderAccountNumber\":8755359,\n  \"SenderAccountSuffix\":1,\n  \"ReceiverPhone\":5075913876,\n  \"MoneyTransferDescription\":\"test desc\",\n  \"Amount\":13\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/SendToMobile")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/SendToMobile",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"SenderAccountNumber\":8755359,\n  \"SenderAccountSuffix\":1,\n  \"ReceiverPhone\":5075913876,\n  \"MoneyTransferDescription\":\"test desc\",\n  \"Amount\":13\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}
\`\`\`

Send money from an authorized user’s account to any phone number.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/SendToMobile\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
amount | decimal | Amount that will be sent. | Required
receiverPhone | string | indicates receiver phone number. | Required
senderAccountNumber | int | Indicates sender account number. | Required
senderAccountSuffix | short | Indicates sender account suffix number. | Required
moneyTransferDescription | string | Description about transfer. | Required

## Approve Money Transfer To Mobile

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "ReferenceNumber": 651531,
  "ReceiverTaxNumber": "30296434944",
  "ReceiverPhone": "902124440124",
  "Amount": 13
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/PaymentToMobile")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/PaymentToMobile");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"ReferenceNumber\":651531,\n  \"ReceiverTaxNumber\":\"30296434944\",\n  \"ReceiverPhone\":\"902124440124\",\n  \"Amount\":13\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"ReferenceNumber\":651531,\n  \"ReceiverTaxNumber\":\"30296434944\",\n  \"ReceiverPhone\":\"902124440124\",\n  \"Amount\":13\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/PaymentToMobile")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/PaymentToMobile",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"ReferenceNumber\":651531,\n  \"ReceiverTaxNumber\":\"30296434944\",\n  \"ReceiverPhone\":\"902124440124\",\n  \"Amount\":13\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}

\`\`\`

Approve money transfer from an authorized user’s account to any phone number.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/PaymentToMobile\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
amount | decimal | Amount that will be sent. | Required
receiverPhone | string | indicates receiver phone number. | Required
receiverTaxNumber | int | Indicates receiver tax number. | Required
referenceNumber | int | Indicates reference number of money transfer. | Required

## Mobile Money Transfers

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "SenderAccountNumber": 8755359,
  "SenderAccountSuffix": 1
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/MobileMoneyTransfers")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/MobileMoneyTransfers");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"SenderAccountNumber\":8755359,\n  \"SenderAccountSuffix\":1\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"SenderAccountNumber\":8755359,\n  \"SenderAccountSuffix\":1\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/MobileMoneyTransfers")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/MobileMoneyTransfers",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"SenderAccountNumber\":8755359,\n  \"SenderAccountSuffix\":1\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "mobileTransferList":[
      {
         "senderAccountSuffix":1,
         "senderAccountNumber":8755359,
         "moneyTransferAmount":13.2,
         "moneyTransferState":3,
         "moneyTransferFec":0,
         "moneyTransferFecCode":"TL",
         "moneyTransferDate":"2017-04-04T15:08:35.68",
         "senderName":"Ceyda Bora",
         "receiverName":"",
         "referenceNumber":548458,
         "encryptedReferenceNumber":"xz+JAxTVA8cGPvjUPuQLuA==",
         "moneyTransferStateDesc":"Teslim Alındı",
         "moneyTransferId":11742768,
         "receiverPhone":"902124440123"
      }
   ],
   "results":[],
   "success":true
}
\`\`\`

Show a list of all mobile money transfers based on given account number and account suffix.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/MobileMoneyTransfers\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
senderAccountNumber | int | Indicates sender account number. | Required
senderAccountSuffix | short | Indicates sender account suffix number. | Required

## Cancel Mobile Money Transfer

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = ["MoneyTransferId": 11742812] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/CancelMobileMoneyTransfer")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/CancelMobileMoneyTransfer");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"MoneyTransferId\":11742812\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"MoneyTransferId\":11742812\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/CancelMobileMoneyTransfer")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/CancelMobileMoneyTransfer",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"MoneyTransferId\":11742812\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[],
   "success":true
}
\`\`\`

Cancels the mobile money transfer based on money transfer id.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/CancelMobileMoneyTransfer\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
moneyTransferId | int | Indicates the id of money transfer | Required

# Cash withdrawal from ATM via QR Code

## Cash withdrawal from ATM via QR Code

\`\`\`swift
import Foundation

let headers = [
  "content-type": "application/json",
  "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "cache-control": "no-cache"
]
let parameters = [
  "AccountNumber": 8755359,
  "AccountSuffix": 1,
  "Amount": 16,
  "FecId": "",
  "QRCodeKey": "123"
] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "http://srvboaoneprep1:90/api/QrWithdrawMoney")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
\`\`\`

\`\`\`c
var client = new RestClient("http://srvboaoneprep1:90/api/QrWithdrawMoney");
var request = new RestRequest(Method.POST);
request.AddHeader("cache-control", "no-cache");
request.AddHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
request.AddHeader("content-type", "application/json");
request.AddParameter("application/json", "{\n  \"AccountNumber\":8755359,\n  \"AccountSuffix\":1,\n  \"Amount\":16,\n  \"FecId\":0,\n  \"QRCodeKey\":\"123\"\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "{\n  \"AccountNumber\":8755359,\n  \"AccountSuffix\":1,\n  \"Amount\":16,\n  \"FecId\":0,\n  \"QRCodeKey\":\"123\"\n}");
Request request = new Request.Builder()
  .url("http://srvboaoneprep1:90/api/QrWithdrawMoney")
  .post(body)
  .addHeader("content-type", "application/json")
  .addHeader("api_key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
\`\`\`

\`\`\`javascript
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://srvboaoneprep1:90/api/QrWithdrawMoney",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": "{\n  \"AccountNumber\":8755359,\n  \"AccountSuffix\":1,\n  \"Amount\":16,\n  \"FecId\":0,\n  \"QRCodeKey\":\"123\"\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
\`\`\`

> The above command returns JSON structured like this:

\`\`\`json
{
   "results":[ ],
   "success":true
}
\`\`\`

Assuming that a bank customer has an Android or iOS smartphone with a built-in camera, the customer approaches an ATM and launches the QR code reader application. The customer presses to 5 on keyboard of ATM. Then the application reads the QR codes and sends to web service. If the code is correct, the customer takes money.

### HTTP Request

\`POST http://srvboaoneprep1:90/api/QrWithdrawMoney\`

### Parameters

Parameter | Type | Description | Required
--------- | ------- | ----------- | ------
accountNumber |int | Indicates account number. | Required
accountSuffix | short | Indicates account suffix number. | Required
amount | decimal | Amount that will be sent. | Required
fecId | Int	An unique id given to the fx type. | Required
QRCodeKey | string | An unique key given to process that cash withdrawal from ATM via QR Cod. | Required
`;
