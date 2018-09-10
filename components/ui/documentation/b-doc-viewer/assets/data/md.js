export default `KodFest süresince aşağıdaki servisleri kullanabilir, uygulamanızda bu servisler vasıtasıyla bankacılık işlemlerini simüle edebilirsiniz.

!!! tip "Set up Material using Docker"
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Duis ultricies mi in velit finibus, at porta elit feugiat.
Vestibulum neque dui, mattis vitae lorem quis, interdum molestie risus.
Integer interdum magna et dolor aliquet congue. Praesent dignissim volutpat dui in finibus.
Vestibulum rhoncus, velit non sodales iaculis, mi turpis egestas nunc, nec malesuada libero tellus sit amet nisi. Nunc ac porta nibh.
Morbi nec dolor elit.
Sed lobortis, diam vel finibus molestie, odio dui fermentum ante,
nec accumsan nibh ex et diam. Duis posuere sit amet eros non vulputate.
Integer quis rutrum mauris, quis convallis neque.
Vestibulum purus tellus, pulvinar dapibus lacinia quis, pharetra a nibh.
Maecenas quis nulla sem. Nam enim ante, varius et felis sed, ultrices rhoncus est.
Praesent porta dolor eget bibendum fringilla.
!!!

!!! warning "Set up Material using Docker"
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod tincidunt orci,
finibus varius sapien eleifend et.
Curabitur quis cursus sapien, ac dictum odio.
Ut quis hendrerit leo. Nullam elementum mollis mollis.
Fusce convallis dictum odio, sit amet mollis sem aliquet eu.
Phasellus ante ex, ultricies ut sem vel, convallis sollicitudin nulla.
Aenean sollicitudin dui ut magna eleifend dignissim ut.
!!!

!!! error "Set up Material using Docker"
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis turpis et suscipit hendrerit. Donec.
!!!


Servislerden dönen cevaplar; işlemin başarılı olup olmadığı bilgisini, varsa mesaj bilgisini ve işlem sonrası oluşan datayı içermektedir.

| gray |
| Tables   |||
|----------|---------------|------:|
| col 1 is |  \`\`\` code \`\`\` could be here | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |

<br />

| blue |
| Tables   |||
|----------|---------------|------:|
| col 1 is |  \`\`\` code \`\`\` could be here | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |

<br />

| orange |
| Tables   |||
|----------|---------------|------:|
| col 1 is |  \`\`\` code \`\`\` could be here | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |

<br />

| red |
| Tables   |||
|----------|---------------|------:|
| col 1 is |  \`\`\` code \`\`\` could be here | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |

<br />

| black |
| Tables   |||
|----------|---------------|------:|
| col 1 is |  \`\`\` code \`\`\` could be here | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |


\`\`\`json
{
    "success": true,
    "message": "",
    "result": null
}
\`\`\`

\`\`\`js
  render() {
    var rawMarkup = marked(this.state.md);
    return React.DOM.span({
      dangerouslySetInnerHTML: { __html: rawMarkup }
    });
  }
\`\`\`

## 1. Oturum Açma
**[POST]** URL: [http://localhost:3000/Auth](http://localhost:3000/Auth)

Oturum açma servisini kullanarak access token değeri elde edilir.
Bu değer, diğer tüm servisler çağırımlarında aşağıdaki gibi header içerisinde **Authorization** anahtarı ile gönderilmelidir. Aksi takdirde istekler, HTTP 401 Unauthorized hatası alacaktır.

\`\`\`
Authorization: njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3
\`\`\`

### Request Body

\`\`\`json
{
    "accountNumber": 56,
    "password": "123456"
}
\`\`\`

### Response Body

\`\`\`json
{
    "success": true,
    "message": "",
    "result": {
        "accessToken": "njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3",
        "expires": "07-28-2016-15:43"
    }
}
\`\`\`

## 2. Hesap Listesi
**[POST]** URL: [http://localhost:3000/CoreBanking/Accounts](http://localhost:3000/CoreBanking/Accounts)

Müşterinin hesap bilgilerinin alınabileceği servistir. Müşteriye ait hesapların tamamını listeler. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

\`\`\`
Authorization: njd9wng4d0ycwnn3g4d1jm30yig4d27iom5lg4d3
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "result": [
    {
      "accountNumber": 56,
      "accountSuffix": 1,
      "fec": 0,
      "balance": 100,
      "productCode": "CARIHESAP"
    },
    {
      "accountNumber": 56,
      "accountSuffix": 1,
      "fec": 0,
      "balance": 1000,
      "productCode": "AYLIKKATILMA"
    }
  ]
}
\`\`\`

## 3. ATM Listesi
Ayrıntılı ATM bilgilerini içeren listeyi döner. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[GET]** URL: [http://localhost:3000/CoreBanking/ATMs](http://localhost:3000/CoreBanking/ATMs)

### Response Body

\`\`\`json
{
    "success": true,
    "result": [
        {
            "Code": "KT34A001",
            "Name": "MERKEZ ŞUBE ATM",
            "Address": "BÜYÜKDERE CAD. NO:129",
            "City": "İSTANBUL",
            "Town": "ŞİŞLİ",
            "HasCoin": "1",
            "HasTL": "1",
            "HasUSD": "1",
            "HasEuro": "0",
            "HasGold": "1",
            "Longitude": "41.068135",
            "Latitude": "29.0049173",
            "Type": "ATM"
        },
        {
            "Code": "X3409719",
            "Name": "XTM KİRAZLI",
            "Address": "KİRAZLI MAH.HOCA AHMET YASEVI CAD.NO:68/B",
            "City": "İSTANBUL",
            "Town": "BAĞCILAR",
            "HasCoin": "1",
            "HasTL": "1",
            "HasUSD": "1",
            "HasEuro": "1",
            "HasGold": "1",
            "Longitude": "41.032258",
            "Latitude": "28.8453543",
            "Type": "XTM"
        }
    ]
}
\`\`\`

## 4. Döviz Listesi
Döviz isim, kod ve id bilgisini döner. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[GET]** URL: [http://localhost:3000/CoreBanking/FECs](http://localhost:3000/CoreBanking/FECs)

Döviz Listesi

### Response Body

\`\`\`json
{
    "success": true,
    "result": [
        {
            "FecId": "0",
            "FecCode": "TL",
            "FecName": "Türk Lirası"
        },
        {
            "FecId": "1",
            "FecCode": "USD",
            "FecName": "Amerikan Doları"
        },
        {
            "FecId": "2",
            "FecCode": "AUD",
            "FecName": "Avustralya Doları"
        }
    ]
}
\`\`\`

## 5. Kur Bilgileri
Tüm döviz cinslerinin anlık kur bilgilerini döner. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[GET]** URL: [http://localhost:3000/CoreBanking/FXRates](http://localhost:3000/CoreBanking/FXRates)

### Response Body

\`\`\`json
{
    "success": true,
    "result": [
        {
            "FecId": "1",
            "FecCode": "USD",
            "FecName": "Amerikan Doları",
            "CurrencyAsk": "2.97611",
            "CurrencyBid": "2.95683"
        },
        {
            "FecId": "2",
            "FecCode": "AUD",
            "FecName": "Avustralya Doları",
            "CurrencyAsk": "2.26075",
            "CurrencyBid": "2.23422"
        },
        {
            "FecId": "3",
            "FecCode": "ATS",
            "FecName": "Avusturya Şilini",
            "CurrencyAsk": "0.23949",
            "CurrencyBid": "0.23770"
        }
    ]
}
\`\`\`

## 6. Kur Bilgileri (Döviz Cinsine Göre)
Belirli bir döviz cinsinin anlık kur bilgisini döner. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[GET]** URL: [http://localhost:3000/CoreBanking/FXRates/1](http://localhost:3000/CoreBanking/FXRates/1)

### Response Body

\`\`\`json
{
    "success": true,
    "result": {
        "FecId": "1",
        "FecCode": "USD",
        "FecName": "Amerikan Doları",
        "CurrencyAsk": "2.97611",
        "CurrencyBid": "2.95683"
    }
}
\`\`\`

## 7. QR ile para çekme
Mobil cihazlar üzerinden para çekme isteği oluşturulur. İşlemin başarılı olmasından sonra seçilen ATM'den para çekilebilir.

**[POST]** URL: [http://localhost:3000/CoreBanking/QR](http://localhost:3000/CoreBanking/QR)

### Request Body
ATMCode parametresi için ATM Listesinden dönen ATM kodları kullanılmalıdır.
\`\`\`json
{
    "amount" : 10,
    "ATMCode" : "KT34A001"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "10 TL tutarındaki işleminize MERKEZ ŞUBE ATM üzerinden devam edebilirsiniz."
}
\`\`\`


## 8. Kurum Bilgileri Listeleme
Fatura ödemesi yapılabilecek kurumların listesini bu servis aracılığı ile alabilirsiniz.

**[GET]** URL: [http://localhost:3000/BillPayment/Corporates](http://localhost:3000/BillPayment/Corporates)

### Response Body

\`\`\`json
{
  "success": true,
  "result": [
    {
      "code": "ISKI",
      "name": "İSKİ (İstanbul Su)"
    },
    {
      "code": "IGDAS",
      "name": "İGDAŞ (İstanbul Gaz)"
    },
    {
      "code": "ENERJISA",
      "name": "ENERJİSA (İstanbul Elektrik)"
    }
  ]
}
\`\`\`

## 9. Fatura Borç Sorgulama
Herhangi bir kurumdan kurum kodu ve abone numarası ile aboneye ait olan fatura borcu sorgulaması yapılır. İstek parametresinde kurum kodu ve abone numarası bilgisi verilmelidir. Örnek istek sorgusu ve bu sorgudan dönen cevap aşağıdaki gibidir.

**[GET]** URL: [http://localhost:3000/billpayment?corporateCode=ISKI&&subscriberNumber=11111](http://localhost:3000/billpayment?corporateCode=ISKI&&subscriberNumber=11111)

### Response Body

\`\`\`json
{
  "success": true,
  "result": {
    "corporateCode": "ISKI",
    "subscriberNumber": "11111",
    "debt": 100
  }
}
\`\`\`


## 10. Fatura Ödeme
Herhangi bir kurumda abone numarası ile bu aboneye ait olan borcun ödemesi yapılır. İstek yapılırken kurum kodu, abone numarası ve ödenecek tutar bilgisi gönderilmelidir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/BillPayment](http://localhost:3000/BillPayment)

### Request Body

\`\`\`json
{
    "corporateCode": "ISKI",
    "subscriberNumber": "11111111111",
    "debt": "100"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "11111111111 numaraya ait 100 TL tutarındaki İSKİ (İstanbul Su) faturası ödenmiştir."
}
\`\`\`
## 11. Operatör Listeleme
GSM TL Yükleme işlemi yapılabilecek operatör listesinin kod ve isim bilgilerini kullanıcılara döner. Örnek istek sorgusu ve bu sorgudan dönen cevap aşağıdaki gibidir.

**[GET]** URL: [http://localhost:3000/GSMPrepaid/Operators](http://localhost:3000/GSMPrepaid/Operators)


### Response Body

\`\`\`json
{
  "success": true,
  "result": [
    {
      "code": "turktelekom",
      "name": "Türk Telekom"
    },
    {
      "code": "vodafone",
      "name": "Vodafone"
    },
    {
      "code": "turkcell",
      "name": "Turkcell"
    }
  ]
}
\`\`\`

## 12. GSM TL Yükleme
Herhangi bir GSM numarasına TL yüklemek için yapılan işlemdir. İşlem için operatör, GSM ve yüklenecek olan tutar bilgileri gönderilmelidir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/GSMPrepaid](http://localhost:3000/GSMPrepaid)

### Request Body

\`\`\`json
{
    "phoneNumber" : "5421234567",
    "amount" : 10,
    "operatorCode" : "turktelekom"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "5421234567 numarasına 10 TL yüklenmiştir."
}
\`\`\`

## 13. Finansman Listeleme
Herhangi bir müşterinin kullanmış olduğu finansman bilgilerini döner. İşlem için müşteri numarası bilgisi verilmelidir. Örnek istek sorgusu ve bu sorgudan dönen cevap aşağıdaki gibidir.

**[GET]** URL: [http://localhost:3000/Loan](http://localhost:3000/Loan?identityNumber=56456456465)

### Response Body

\`\`\`json
{
  "success": true,
  "result": [
    {
      "applicationClass": "ARACBINEK2EL",
      "amount": 55000
    },
    {
      "applicationClass": "ARACBINEK2EL",
      "amount": 32500
    },
    {
      "applicationClass": "KONUT",
      "amount": 320000
    },
    {
      "applicationClass": "ISYERI",
      "amount": 132200
    },
    {
      "applicationClass": "KONUT",
      "amount": 160000
    },
    {
      "applicationClass": "EGITIMFINANSMANI",
      "amount": 16500
    }
  ]
}
\`\`\`

## 14. Finansman Başvurusu
Finansman başvurusunda bulunmak için müşteri ve finansman ayrıntılarının gönderilmesiyle başvurunun yapılmasını sağlar. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.
**[POST]** URL: [http://localhost:3000/Loan](http://localhost:3000/Loan)

### Request Body

\`\`\`json
{
    "name": "Muhammed Ömer",
    "surname": "Kısa",
    "identityNumber": "56456456465",
    "mobilePhone": "4440123",
    "mobilePhoneAreaCode": "212",
    "email": "kthackathon@mail.com",
    "applicationClass": "ARACBINEK2EL",
    "amount": 55000
  }
\`\`\`

### Response Body

\`\`\`json
{
    "success": true,
    "message": "Muhammed Ömer Kısa adına ARACBINEK2EL tipinde 55000 TL'lik finansman başvurusu alınmıştır."
}
\`\`\`

## 15. Kredi Kartı Listesi
Müşteriler ait kredi kart bilgilerinin listesini döner. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[GET]** URL: [http://localhost:3000/CreditCard](http://localhost:3000/CreditCard)

### Response Body

\`\`\`json
{
  "success": true,
  "result": [
    {
      "id": 1,
      "cardType": "SALEPLUS",
      "cardNumber": "1111222233334444",
      "limit": 10000,
      "availableLimit": 8000
    },
    {
      "id": 2,
      "cardType": "SALEPLATIN",
      "cardNumber": "5555666677778888",
      "limit": 10000,
      "availableLimit": 9000
    }
  ]
}
\`\`\`

## 16. Kredi Kartı Başvurusu
Belirli bir kişiye kredi kartı başvurusu için gerekli işlemleri yapar. Başvuru için kişinin bilgileri ve başvurulmak istenilen kredi kartı bilgilerinin gönderilmesi gerekir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/CreditCard](http://localhost:3000/CreditCard)

### Request Body

\`\`\`json
{
    "name": "Muhammed Ömer",
    "surname": "Kısa",
    "identityNumber": "11111111111",
    "mobilePhone": "4440123",
    "mobilePhoneAreaCode": "212",
    "email": "kthackathon@mail.com",
    "cardType": "SALEPLUS"
}
\`\`\`

### Response Body

\`\`\`json
{
    "success": true,
    "message": "Muhammed Ömer Kısa adına SALEPLUS tipindeki kart başvurusu alınmıştır."
}
\`\`\`

## 17. Kredi Kartı Borç Ödeme
Kredi kartı numarası ve ödenmek istenilen miktar ile yapılan borç ödeme işlemidir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/CreditCard/Payment)](http://localhost:3000/CreditCard/Payment)

### Request Body

\`\`\`json
{
      "cardNumber": "11111111111",
      "amount": "100"
}
\`\`\`

### Response Body

\`\`\`json
{
    "success": true,
    "message": "11111111111 numaralı kartta bulunan toplam 100 TL'lik borç ödemesi yapılmıştır."
}
\`\`\`

## 18. Para Gönder
Para Gönder servisi ile istenilen cep telefonu numarasına para gönderme işlemi gerçekleştirilebilir. Bunun için gönderenin ve alıcının cep telefonu numarasıyla birlikte gönderilmek istenen miktar yeterlidir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/MoneyTransfer](http://localhost:3000/MoneyTransfer)

### Request Body

\`\`\`json
{
    "senderPhoneNumber" : "555555555",
    "receiverPhoneNumber" : "500000000",
    "amount" : 5000
}
\`\`\`

### Response Body

\`\`\`json
{
    "success": true,
    "message": "500000000 numaralı telefona 5000 TL transfer edilmiştir. Referans numaranız: 11223344",
    "result": {
        "receiverPhoneNumber": "500000000",
        "senderPhoneNumber": "555555555",
        "amount": 5000,
        "tranReference": 11223344
    }
}
\`\`\`

## 19. Para İste
Bir müşterinin diğer bir müşteriden para talep etmesini sağlar. Bu işlem için paranın istenileceği hesap ve istek sahibi bilgisi verilmelidir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/MoneyTransfer/Request](http://localhost:3000/MoneyTransfer/Request)

### Request Body

\`\`\`json
{
    "senderPhoneNumber" : "555555555",
    "receiverPhoneNumber" : "500000000",
    "amount" : 5000
}
\`\`\`

### Response Body

\`\`\`json
{
    "sucess": true,
    "message": "555555555 numaralı telefondan 5000 TL tutarında para istenmiştir. Referans numaranız: 11223344",
    "result": {
        "receiverPhoneNumber": "500000000",
        "senderPhoneNumber": "555555555",
        "amount": 5000,
        "tranReference": 11223344
    }
}
\`\`\`

## 20. Para İsteğini Onayla
Transfer referans numarası ile para isteğinin onaylanmasını sağlar. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/MoneyTransfer/Confirm](http://localhost:3000/MoneyTransfer/Confirm)

### Request Body

\`\`\`json
{
    "tranReference" : "1234567"
}
\`\`\`

### Response Body

\`\`\`json
{
    "sucess": true,
    "message": "5555555555 numaralı telefona 100 TL tutarında para gönderilmiştir. Referans numaranız: 1234567",
    "result": {
        "receiverPhoneNumber": 5555555555,
        "amount": 100,
        "tranReference": "1234567"
    }
}
\`\`\`

## 21. Para İsteklerini Listele
Yapılan para istek bilgisi ve bu isteğin anlık durumunu döner. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[GET]** URL: [http://localhost:3000/MoneyTransfer](http://localhost:3000/MoneyTransfer)

### Response Body

\`\`\`json
{
    "success": true,
    "result": {
        "activities": [
            {
                "senderPhoneNumber": "5555555555",
                "receiverPhoneNumber": "5000000000",
                "tranReference": 1,
                "tranDate": "01/01/2016 11:30",
                "tranType": "Para Gönderme",
                "status": "S"
            },
            {
                "senderPhoneNumber": "5555555555",
                "receiverPhoneNumber": "5000000000",
                "tranReference": 3,
                "tranDate": "03/03/2016 11:30",
                "tranType": "Para Gönderme",
                "status": "C"
            },
            {
                "senderPhoneNumber": "5555555555",
                "receiverPhoneNumber": "5000000000",
                "tranReference": 5,
                "tranDate": "02/03/2016 11:30",
                "tranType": "Para Gönderme",
                "status": "W"
            }
        ]
    }
}
\`\`\`

## 22. Sanal POS - Satış
Sanal POS – Satış servisi, Sanal Pos ile satış işleminin taksitli veya peşin olarak yapılmasını sağlar. Burada kredi kartı bilgileri ile birlikte satış fiyatı request içerisinde gönderilir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/VirtualPOS/Sales](http://localhost:3000/VirtualPOS/Sales)

Sanal POS - Satış

### Request Body

\`\`\`json
{
    "creditCardNumber": "1234000011112222",
    "cardExpireDateYear": "2019",
    "cardExpireDateMonth": "4",
    "CVV2": "233",
    "cardHolderName": "Ahmet Berke",
    "cardType": "SALEPLUS",
    "amount": "100",
    "merchantId": "1",
    "installmentCount": "2",
    "currencyCode": "1"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "",
  "result": {
    "provisionNumber": 377777,
    "orderId": 19,
    "installmentCount": "2"
  }
}
\`\`\`

## 23. Sanal POS - İptal
Sanal POS – İptal servisi, gün içinde yapılan bir işlemin iptal edilebilmesini sağlar. Verilen provizyon numarasına ait işlem iptal edilir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[DEL]** URL: [http://localhost:3000/VirtualPOS/Sales/:provisionNumber](http://localhost:3000/VirtualPOS/:provisionNumber)

Verilen provizyon numarasına ait işlem iptal edilir.


### Response Body

\`\`\`json
{
  "success": true,
  "message": "123232322 provizyon numaralı işlem iptal edilmiştir."
}
\`\`\`

## 24. Sanal POS - Ön Otorizasyon
Sanal POS - Ön Otorizasyon servisi ön otorizasyon işleminin yapılabilmesini sağlar. Burada kredi kartı bilgileri ve satış miktarı yapılacak istek(request) ile gönderilir. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

**[POST]** URL: [http://localhost:3000/VirtualPOS/Preauth](http://localhost:3000/VirtualPOS/Preauth)

### Request Body

\`\`\`json
{
    "creditCardNumber": "1234000011112222",
    "cardExpireDateYear": "2019",
    "cardExpireDateMonth": "4",
    "CVV2": "233",
    "cardHolderName": "Ahmet Berke",
    "cardType": "SALEPLUS",
    "amount": "100",
    "merchantId": "1",
    "installmentCount": "2",
    "currencyCode": "1"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "1234000011112222 numaralı kredi kartından 100TL tutarında ön otorizasyon başarıyla gerçekleştirilmiştir"
}
\`\`\`

## 25. Sanal POS - Otorizasyon Kapama

**[POST]** URL: [http://localhost:3000/VirtualPOS/Postauth](http://localhost:3000/VirtualPOS/Postauth)

Bu servis ile otorizasyon kapama işlemi gerçekleştirilir. Verilen provizyon numarası ve kart bilgilerine göre gerekli işlem sağlanır. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.


### Request Body

\`\`\`json
{
    "creditCardNumber": "1234000011112222",
    "merchantId": "1",
    "orderId": "234",
    "provisionNumber": "123232322"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "1234000011112222 numaralı kredi kartına ait 123232322 provizyon numaralı işlem için otorizasyon kapama başarıyla gerçekleştirilmiştir."
}
\`\`\`

## 26. Sanal POS - İade

**[POST]** URL: [http://localhost:3000/VirtualPOS/Refund](http://localhost:3000/VirtualPOS/Refund)

Bu servis iade işleminin yapılmasını sağlar. Yapılan istekteki bilgilere göre bir işlemi iptal eder. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

### Request Body

\`\`\`json
{
    "creditCardNumber": "1234000011112222",
    "merchantId": "1",
    "orderId": "234",
    "provisionNumber": "123232322"
}
\`\`\`

### Response Body

\`\`\`json
{
  "success": true,
  "message": "1234000011112222 numaralı kredi kartına ait 123232322 provizyon numaralı işlem için iade başarıyla gerçekleştirildi."
}
\`\`\`

## 27. Sanal POS - İşlemler

**[GET]** URL: [http://localhost:3000/VirtualPOS/Sales/](http://localhost:3000/VirtualPOS/Sales)

Sanal POS üzerinden yapılan işlemleri listeler. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

### Response Body

\`\`\`json
{
  "success": true,
  "result": {
    "transactions": [
      {
        "creditCardNumber": "4500********3433",
        "provisionNumber": "12311122",
        "amount": "100 TL",
        "merchantId": "5",
        "name": "Mustafa Tanisir",
        "identityNumber": "11111111111"
      },
      {
        "creditCardNumber": "4500********3434",
        "provisionNumber": "12555895",
        "amount": "500 TL",
        "merchantId": "6",
        "name": "Ahmet Berke",
        "identityNumber": "22223334455"
      },
      {
        "creditCardNumber": "4500********3495",
        "provisionNumber": "12311676",
        "amount": "200 TL",
        "merchantId": "7",
        "name": "Yusuf Ahmet",
        "identityNumber": "77777777777"
      },
      {
        "creditCardNumber": "4500********3456",
        "provisionNumber": "12310005",
        "amount": "800 TL",
        "merchantId": "7",
        "name": "Ömer Faruk",
        "identityNumber": "99998887765"
      },
      {
        "creditCardNumber": "4500********3457",
        "provisionNumber": "12140003",
        "amount": "900 TL",
        "merchantId": "2",
        "name": "Ebu Bekir",
        "identityNumber": "66666666666"
      }
    ]
  }
}
\`\`\`

## 28. Sanal POS - Altın Puan Kullanımı

**[POST]** URL: [http://localhost:3000/VirtualPOS/GoldScoreUsage](http://localhost:3000/VirtualPOS/GoldScoreUsage)

Müşterinin kartına tanımlı olan altın puanının kullanılabilmesini sağlar. Aşağıda örnek bir istek ve bu istekten dönen cevap bilgisi verilmiştir.

### Request Body

\`\`\`json
{
    "creditCardNumber": "1234000011112222",
    "cardExpireDateYear": "2019",
    "cardExpireDateMonth": "4",
    "CVV2": "233",
    "cardHolderName": "Ahmet Berke",
    "cardType": "SALEPLUS",
    "amount": "100",
    "merchantId": "1",
    "goldscore": "200",
    "currencyCode": "1",
    "provisionNumber": "67867"
}
\`\`\`

### Response Body

\`\`\`json
{
    "success": true,
    "message": "1234000011112222 numaralı kredi kartına ait 67867 provizyon numaralı işlem için hesabınıza tanımlı 200 TL değerinde altın puan kullanımı gerçekleştirilmiştir"
}
\`\`\`

## 29. Sanal POS - Altın Puan Sorgula
Müşteriye ait kimlik numarasına tanımlı altın puan bilgisini verir.

**[GET]** URL: [http://localhost:3000/virtualpos/goldscore?identityNumber=12345](http://localhost:3000/virtualpos/goldscore?identityNumber=12345)

Sanal POS - Altın Puan Sorgula

### Response Body

\`\`\`json

{
  "success": true,
  "result": [
    {
    "name": "Muhammed Ömer",
    "surname": "Kısa",
    "identityNumber": "12345",
    "creditCardNumber": "1111222233334444",
    "mobilePhone": "4440123",
    "mobilePhoneAreaCode": "212",
    "email": "kthackathon@mail.com",
    "goldscore": 100
    }
  ]
}


\`\`\``;
