var IBANCountryInformationList = [
  {
    IBANCharacterLength: 22,
    CountryCode: 'DE'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'AD'
  },
  {
    IBANCharacterLength: 28,
    CountryCode: 'AL'
  },
  {
    IBANCharacterLength: 20,
    CountryCode: 'AT'
  },
  {
    IBANCharacterLength: 16,
    CountryCode: 'BE'
  },
  {
    IBANCharacterLength: 20,
    CountryCode: 'BA'
  },
  {
    IBANCharacterLength: 22,
    CountryCode: 'BG'
  },
  {
    IBANCharacterLength: 23,
    CountryCode: 'GI'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'CZ'
  },
  {
    IBANCharacterLength: 18,
    CountryCode: 'DK'
  },
  {
    IBANCharacterLength: 20,
    CountryCode: 'EE'
  },
  {
    IBANCharacterLength: 18,
    CountryCode: 'FO'
  },
  {
    IBANCharacterLength: 18,
    CountryCode: 'FI'
  },
  {
    IBANCharacterLength: 27,
    CountryCode: 'FR'
  },
  {
    IBANCharacterLength: 28,
    CountryCode: 'CY'
  },
  {
    IBANCharacterLength: 21,
    CountryCode: 'HR'
  },
  {
    IBANCharacterLength: 18,
    CountryCode: 'NL'
  },
  {
    IBANCharacterLength: 22,
    CountryCode: 'GB'
  },
  {
    IBANCharacterLength: 22,
    CountryCode: 'IE'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'ES'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'SE'
  },
  {
    IBANCharacterLength: 21,
    CountryCode: 'CH'
  },
  {
    IBANCharacterLength: 27,
    CountryCode: 'IT'
  },
  {
    IBANCharacterLength: 26,
    CountryCode: 'IS'
  },
  {
    IBANCharacterLength: 22,
    CountryCode: 'ME'
  },
  {
    IBANCharacterLength: 21,
    CountryCode: 'LV'
  },
  {
    IBANCharacterLength: 21,
    CountryCode: 'LI'
  },
  {
    IBANCharacterLength: 20,
    CountryCode: 'LT'
  },
  {
    IBANCharacterLength: 20,
    CountryCode: 'LU'
  },
  {
    IBANCharacterLength: 28,
    CountryCode: 'HU'
  },
  {
    IBANCharacterLength: 19,
    CountryCode: 'MK'
  },
  {
    IBANCharacterLength: 31,
    CountryCode: 'MT'
  },
  {
    IBANCharacterLength: 27,
    CountryCode: 'MC'
  },
  {
    IBANCharacterLength: 15,
    CountryCode: 'NO'
  },
  {
    IBANCharacterLength: 28,
    CountryCode: 'PL'
  },
  {
    IBANCharacterLength: 25,
    CountryCode: 'PT'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'RO'
  },
  {
    IBANCharacterLength: 27,
    CountryCode: 'SM'
  },
  {
    IBANCharacterLength: 22,
    CountryCode: 'RS'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'SK'
  },
  {
    IBANCharacterLength: 19,
    CountryCode: 'SI'
  },
  {
    IBANCharacterLength: 26,
    CountryCode: 'TR'
  },
  {
    IBANCharacterLength: 27,
    CountryCode: 'GR'
  },
  {
    IBANCharacterLength: 18,
    CountryCode: 'GL'
  },
  {
    IBANCharacterLength: 23,
    CountryCode: 'IL'
  },
  {
    IBANCharacterLength: 20,
    CountryCode: 'KZ'
  },
  {
    IBANCharacterLength: 28,
    CountryCode: 'LB'
  },
  {
    IBANCharacterLength: 30,
    CountryCode: 'MU'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'TN'
  },
  {
    IBANCharacterLength: 24,
    CountryCode: 'SA'
  },
  {
    IBANCharacterLength: 30,
    CountryCode: 'KW'
  },
  {
    IBANCharacterLength: 22,
    CountryCode: 'BH'
  }
];

export class BValidationHelper {
  static isValidTaxNumber(taxNumber) {
    let first = 0;
    let total = 0;
    let second = 0;
    let third = 0;

    if (!taxNumber) {
      return false;
    }

    if (taxNumber.length != 10) {
      return false;
    }
    for (let i = 1; i <= 9; i++) {
      var selectedChar = taxNumber.substring(9 - i, 10 - i);
      if (isNaN(Number(selectedChar))) {
        return false;
      }

      first = (Number(selectedChar) + i) % 10;
      second = first * Math.pow(2, i);
      third = second - Number((second / 9)) * 9;
      if (third == 0 & second > 0)
        third = 9;
      total += third;
    }
    total = Number(((total + 9) / 10)) * 10 - total;
    return (Number(taxNumber[9].toString()) == total);
  }

  static isValidTCNumber(TCNumber) {
    if (!TCNumber) {
      return false;
    }
    if (TCNumber.length != 11) {
      return false;
    }
    let TC = [11];
    for (let i = 0; i < 11; i++) {
      let a = TCNumber[i].toString();
      TC[i] = Number(a);
    }

    let oddNumbers = 0;
    let evenNumbers = 0;
    let k = 0;
    for (; k < 9; k++) {
      if (k % 2 == 0)
        oddNumbers += TC[k];
      else
        if (k % 2 != 0)
          evenNumbers += TC[k];
    }
    let t1 = (oddNumbers * 3) + evenNumbers;
    let c1 = (10 - (t1 % 10)) % 10;
    let t2 = c1 + evenNumbers;
    let t3 = (t2 * 3) + oddNumbers;
    let c2 = (10 - (t3 % 10)) % 10;
    if (c1 == TC[9] && c2 == TC[10]) {
      return true;
    }
    return false;
  }

  static isValidIBAN(iban) {
    if (!iban) {
      return 'IBAN boş olamaz !';
    }
    let countryCode = iban.substring(0, 2);
    let countryInfo = IBANCountryInformationList.find(x => x.CountryCode === countryCode);
    if (!countryInfo) {
      return 'Ülke kodu bulunamadı!';
    }
    if (countryInfo.IBANCharacterLength != iban.length) {
      return `${countryCode} ülke koduna ait IBAN bilgisi ${countryInfo.IBANCharacterLength} karakter uzunluğunda olmalıdır.`;
    }
    if (iban.includes('İ') || iban.includes('Ç') || iban.includes('Ğ') || iban.includes('Ö') || iban.includes('Ş') || iban.includes('Ü')) {
      return 'Oluşturulan IBAN içinde “İ,Ç,Ğ,Ö,Ş,Ü” harfleri ';
    }
    if (countryInfo.CountryCode === 'TR' && isNaN(Number(iban.substring(2, 8)))) {
      return 'TR Ibanında ülke kodu sonrasındaki ilk 8 karakter sayısal olmalıdır! ';
    }

    // TR IBANI ise kapalı banka kontrolü.
    // her IBAN validasyonunda database'e gitmemesi için kapatılan bankalar statik olarak verildi.
    // kapatılan bankalar PRM.Bank'tan bulunabilir.
    if (iban.toUpperCase().startsWith('TR')) {
      let closedBanks = [56, 60, 63, 71, 87, 93, 101, 106, 107, 110, 133, 136, 140, 144, 204];
      let bankCode = iban.substring(4, 5);
      let bankId = Number(bankCode);
      if (closedBanks.includes(bankId)) {
        return 'Bu IBAN kapanmış olan bir bankaya aittir.';
      }
    }
    // Rezerv alan 0 olmalı.
    if (countryInfo.CountryCode === 'TR' && Number(iban[9]) !== 0) {
      return 'Girdiğiniz IBAN numarasının formatı yanlış!';
    }
    // IBAN'ın ilk 4 karakteri IBAN Stringinin sonuna alınır, ve IBAN içerisindeki harfler
    // sayı karşılığı ile değiştirilir  A = 10, B = 11, ..., Z = 35
    let modifiedIban = iban.toUpperCase().substring(4) + iban.substring(0, 4);
    let modifiedIbanTemp;

    for (let i = 0; i < modifiedIban.length; i++) {
      let item = modifiedIban[i];
      if (!isNaN(Number(item))) {
        let charValue = Number(item) - 55;
        modifiedIbanTemp = modifiedIbanTemp + '' + charValue;
      } else {
        modifiedIbanTemp = modifiedIbanTemp + '' + item;
      }
    }

    modifiedIban = modifiedIbanTemp.toString();
    /*
     * Elde edilen integer sayıya mod 97 uygulanır ve mod işleminden oluşan sonuç,
     * IBAN'ın gelecek 7 basamağı ile birleştirilir.
     * Mod 97 uygulanmaya devam edilir.
     * İşlem sonunda kalan 1 ise IBAN geçerlidir.
     */
    let remainder = 0;
    while (modifiedIban.length >= 7) {
      remainder = Number(remainder + modifiedIban.substring(0, 7)) % 97;
      modifiedIban = modifiedIban.substring(7);
    }
    remainder = Number(remainder + modifiedIban) % 97;
    if (remainder != 1) {
      'IBAN geçerli değil!';
    }

    return undefined;
  }

  static isValidEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  static checkParameter(condition, value, compareValue) {
    switch (condition) {
      case 'NotNull': return (value != null && value != undefined);
      case 'Required': return !(value == null || value == undefined);
      case 'NotEquals': return this.compare(condition, value, compareValue);
      case 'Equals': return this.compare(condition, value, compareValue);
      case 'Greater': return this.compare(condition, value, compareValue);
      case 'GreaterEquals': return this.compare(condition, value, compareValue);
      case 'Lesser': return this.compare(condition, value, compareValue);
      case 'LesserEquals': return this.compare(condition, value, compareValue);
      case 'True': return (value === true);
      case 'False': return (value === false);
      default: break;
    }
  }

  static compare(condition, value1, value2) {
    let param1 = value1;
    let param2 = value2;

    if (param1 === '[object Date]' && param2 === '[object Date]') {
      param1 = value1.getTime();
      param2 = value2.getTime();
    }

    switch (condition) {
      case 'Greater': return (param1 > param2);
      case 'GreaterEquals': return (param1 >= param2);
      case 'Lesser': return (param1 < param2);
      case 'LesserEquals': return (param1 <= param2);
      case 'Equals': return (param1 == param2);
      case 'NotEquals': return (param1 != param2);
    }

  }
}

