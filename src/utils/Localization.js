/* eslint-disable no-underscore-dangle */
import Moment from 'moment';
import Numeral from 'numeral';
import IBAN from 'iban';
import phoneFormatter from 'phone-formatter';

import 'numeral/locales';

export class Localization {
  static language = 'en';

  static languageId = 2;

  static currencyFormats = {
    D: '0',
    F: '0.00',
    M: '0.0,',
    FX: '0.0,00',
  };

  static numberFormats = {
    D: '0',
    F: '0,0',
  };

  static staticConstructor(_languageId) {
    const locales = {
      ar: {
        delimiters: {
          thousands: ',',
          decimal: '.',
        },
        abbreviations: {
          thousand: 'ألف',
          million: 'مليون',
          billion: 'مليار',
          trillion: 'تريليون',
        },
        ordinal: () => {
          return ' ';
        },
        currency: {
          symbol: 'KD',
        },
      },
    };

    this.languageId = _languageId;
    if (this.languageId === 1) this.language = 'tr';
    else if (this.languageId === 3) this.language = 'de';
    else if (this.languageId === 4) this.language = 'ru';
    else if (this.languageId === 5) this.language = 'ar-ly';

    if (!Numeral.locales.hasOwnProperty('ar-ly')) {
      Numeral.register('locale', 'ar-ly', locales.ar);
    }
    Moment.locale(this.language);
    Numeral.locale(this.language);
  }

  static createLocalizationContext(_languageId) {
    const localization = {
      isRightToLeft: false,
    };

    this.languageId = _languageId;

    // Arapçca(language=5) olan dilde ekranlar sağdan sola render edilecek
    if (this.languageId === 5) {
      localization.isRightToLeft = true;
    }

    return localization;
  }

  static changeLocalizationLanguage(_languageId) {
    this.languageId = _languageId;
    this.language = 'en';
    if (this.languageId === 1) this.language = 'tr';
    else if (this.languageId === 3) this.language = 'de';
    else if (this.languageId === 4) this.language = 'ru';
    else if (this.languageId === 5) this.language = 'ar-ly';

    Moment.locale(this.language);
    Numeral.locale(this.language);
  }

  static getLocalizationLanguage() {
    return { language: this.language, languageId: this.languageId };
  }

  /*
    Date Time Functions
  */
  static getDateLocale() {
    return Moment.localeData();
  }

  static getFormattedDateLocale(date, format) {
    return Moment(date, format);
  }

  static getDateTimeFormat(format) {
    return Moment.localeData()._longDateFormat[format];
  }

  static formatDateTime(date, format) {
    return Moment.utc(date).format(format);
  }

  static formatDateTimeGMT(date, format) {
    return Moment(date).format(format);
  }

  static getDateValue(value) {
    return Moment.utc(value);
  }

  static getFloatValue(value) {
    return Numeral(value)._value;
  }

  static getIntegerValue(value) {
    return parseInt(Numeral(value)._value, 10);
  }

  /**
   *
   * @param {*} currency
   * @param {*} format
   */
  static formatCurrency(currency, format) {
    if (format) {
      if (format === 'D') {
        return Numeral(currency).format(this.currencyFormats.D);
      }
      if (format === 'F') {
        return Numeral(currency).format(this.currencyFormats.F);
      }
      if (format === 'M') {
        return Numeral(currency).format(this.currencyFormats.M);
      }
      if (format === 'FX') {
        return Numeral(currency).format(this.currencyFormats.FX);
      }

      return Numeral(currency).format(format);
    }

    return Numeral(currency).format(this.currencyFormats.M);
  }

  /**
   *
   * @param {*} currency
   */
  static formatMoney(currency) {
    return Numeral(currency).format(this.currencyFormats.M);
  }

  /**
   *
   * @param {*} number
   * @param {*} format
   */
  static formatNumber(number, format) {
    if (format) {
      if (format === 'D') {
        return Numeral(number).format(this.numberFormats.D);
      }
      if (format === 'F') {
        return Numeral(number).format(this.numberFormats.F);
      }

      return number;
    }

    return Numeral(number).format(this.numberFormats.D);
  }

  /**
   *
   * @param {*} value
   */
  static formatCreditCard(value) {
    if (value == null || value === undefined) return null;

    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    let i = 0;
    for (i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  }

  /**
   *
   * @param {*} value
   */
  static formatIban(value) {
    if (value == null || value === undefined) return null;
    return IBAN.printFormat(value);
  }

  static formatTelephoneNumber(value, format) {
    let defaultFormat = '0 (NNN) NNN NN NN';
    if (value == null || value === undefined) return null;
    if (format) defaultFormat = format;

    const normalizedNumber = phoneFormatter.normalize(value);
    return phoneFormatter.format(normalizedNumber, defaultFormat);
  }

  /*
    String Functions
  */
  static stringUpperCase(value) {
    if (this.languageId === 1) {
      const letters = { i: 'İ', ş: 'Ş', ğ: 'Ğ', ü: 'Ü', ö: 'Ö', ç: 'Ç', ı: 'I' };
      value = value.replace(/(([iışğüçö]))/g, letter => {
        return letters[letter];
      });
    }
    return value.toUpperCase();
  }

  static stringLowerCase(value) {
    if (this.languageId === 1) {
      const letters = { İ: 'i', I: 'ı', Ş: 'ş', Ğ: 'ğ', Ü: 'ü', Ö: 'ö', Ç: 'ç' };
      value = value.replace(/(([İIŞĞÜÇÖ]))/g, letter => {
        return letters[letter];
      });
    }
    return value.toLowerCase();
  }

  static getDelimiters() {
    return Numeral.localeData().delimiters;
  }
}

export function getLocalization() {
  return Localization.getLocalizationLanguage();
}
