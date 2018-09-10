
export class ValidationHelper {
  static getMessage;
  static setGetMessage(_getMessage) {
    this.getMessage = _getMessage;
  }

  // TO DO BusinessHelper.ValidateTCNumber
  static validateTCNumber(identityNumber: string) {
    if (!identityNumber) {
      return this.getMessage('BusinessComponents', 'PleaseEnterIdentityNumber');
    }
    // if (typeof identityNumber != 'number') {
    //    return 'Girilen değer sayısal olmalıdır.';
    // }
    if (identityNumber.length != 11) {
      return this.getMessage('BusinessComponents', 'IdentityNumberLengthError');
    }
    if (identityNumber.startsWith('9')) {
      return this.getMessage('BusinessComponents', 'IdentityNumberCannotStartsWith9');
    }
    if (identityNumber.startsWith('0')) {
      return this.getMessage('BusinessComponents', 'IdentityNumberCannotStartsWith0');
    }
    if (!this.isValidTCNumber(identityNumber)) {
      return this.getMessage('BusinessComponents', 'InvalidIdentityNumber');
    }
    return null;
  }

  // TO DO: BusinessHelper.ValidateForeignIdentityNumber
  static validateForeignIdentityNumber(identityNumber: string) {
    var errorMessage = null;
    if (!identityNumber) {
      errorMessage = this.getMessage('BusinessComponents', 'PleaseIdentityNumberOrTaxNumber');
      return errorMessage;
    }
    // if (!StringHelper.IsNumeric(identityNumber)) {
    //  errorMessage = BOA.Messaging.MessagingHelper.GetMessage("Kernel", "EnteredValueMustBeNumeric"));
    //   return errorMessage;
    // }
    if (identityNumber.length != 10 && identityNumber.length != 11) {
      errorMessage = this.getMessage('BusinessComponents', 'EnteredValueIsNotIdentityNumberOrTaxNumber');
      return errorMessage;
    }
    if (identityNumber.length == 10 && !this.isValidTaxNumber(identityNumber)) {
      errorMessage = this.getMessage('BusinessComponents', 'InvalidTaxNumber');
      return errorMessage;
    }
    else
      if (identityNumber.length == 11) {
        if (!this.isValidTCNumber(identityNumber)) {
          errorMessage = this.getMessage('BusinessComponents', 'InvalidIdentityNumber');
          return errorMessage;
        }
        if (!identityNumber.startsWith('9')) {
          errorMessage = this.getMessage('BusinessComponents', 'TaxNumberMustStartsWith9');
          return errorMessage;
        }
      }
    return errorMessage;
  }

  // TO DO: BusinessHelper.ValidateTaxNumber
  static validateTaxNumber(taxNumber: string) {
    var errorMessage = null;
    if (!taxNumber) {
      errorMessage = this.getMessage('BusinessComponents', 'PleaseEnterTaxNumber');
      return errorMessage;
    }
    /*   if (!StringHelper.IsNumeric(taxNumber))
                   {
                       errorMessage = BOA.Messaging.MessagingHelper.GetMessage("Kernel", "EnteredValueMustBeNumeric");
                       return errorMessage;
                   }
     */

    if (taxNumber.length != 10) {
      errorMessage = this.getMessage('BusinessComponents', 'TaxNumberLengthError');
      return errorMessage;
    }
    if (!this.isValidTaxNumber(taxNumber)) {
      errorMessage = this.getMessage('BusinessComponents', 'InvalidTaxNumber');
      return errorMessage;
    }
    return errorMessage;

  }

  // TO DO BOA.Commondaki ValidationHelper.IsValidTCNumber metodu kullanılacak.
  static isValidTCNumber(tCNumber: string) {
    if (tCNumber == null)// null olamaz
      return false;

    if (tCNumber.length != 11)// 11 hane olmalı
    {
      return false;
    }
    var TC = [11];
    var i = 0;
    for (; i < 11; i++) {
      var a = tCNumber[i].toString();
      TC[i] = parseInt(a);
    }

    var oddNumbers = 0;
    var evenNumbers = 0;
    var k = 0;
    for (; k < 9; k++) {
      if (k % 2 == 0)
        oddNumbers += TC[k];
      else
        if (k % 2 != 0)
          evenNumbers += TC[k];
    }
    var t1 = (oddNumbers * 3) + evenNumbers;
    var c1 = (10 - (t1 % 10)) % 10;
    var t2 = c1 + evenNumbers;
    var t3 = (t2 * 3) + oddNumbers;
    var c2 = (10 - (t3 % 10)) % 10;
    if (c1 == TC[9] && c2 == TC[10]) {
      return true;
    }
    return false;
  }

  // TO DO BOA.Commondaki ValidationHelper.IsValidTaxNumber metodu kullanılacak.
  static isValidTaxNumber(taxNumber: string) {
    var first = 0;
    var total = 0;
    var second = 0;
    var third = 0;
    var i = 1;

    if (taxNumber.length != 10) {
      return false;
    }
    for (; i <= 9; i++) {
      var selectedChar = taxNumber.substring(9 - i, 10 - i);
      first = (parseInt(selectedChar) + i) % 10;
      second = first * Math.pow(2, i);
      third = second - parseInt((second / 9)) * 9;
      if (third == 0 & second > 0)
        third = 9;
      total += third;
    }
    total = parseInt(((total + 9) / 10)) * 10 - total;
    return (parseInt(taxNumber[9].toString()) == total);
  }

}

export default ValidationHelper;
