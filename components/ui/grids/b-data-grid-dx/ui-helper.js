
import { BLocalization } from 'b-localization';
import _ from 'lodash';

export class UIHelper {

  constructor() {

  }

  static getFormatedColumnValue(value, column, row) {

    if (value==null || value==undefined) {

      // liste altındaki bir objeden referans veriliyor ise  name: 'contract.name' gibi
      if (column.name.indexOf('.')!=-1) {
        value= _.get(row, column.name, '');
      }
      else
       return '';
    }

    // özel format uygulanmış ise
    if (column.columnFormat)
      return column.columnFormat(value, column);

    switch (column.type) {
      case 'date': {
        var defaultDateFormat=column.dateFormat ?  column.dateFormat : 'L';
        return BLocalization.formatDateTime(value, defaultDateFormat);
      }

      case 'decimal': {
        var defaultDecimalFormat= column.numberFormat ? column.numberFormat : 'M';
        return BLocalization.formatCurrency(value, defaultDecimalFormat);
      }

      case 'number': {
        var defaultNumberFormat= column.numberFormat ? column.numberFormat : 'D';
        return BLocalization.formatNumber(value, defaultNumberFormat);
      }
      case 'boolean': {
        if (value==null || value==undefined) return 'Tanımlanmamış';
        return (value==1 || value==true) ? 'Evet': 'Hayır';
      }
      case 'card': {
        return  BLocalization.formatCreditCard(value);
      }
      case 'iban': {
        return  BLocalization.formatIban(value);
      }

      case 'telephone': {
        return  BLocalization.formatTelephoneNumber(value);
      }

      default: {
        return value;
      }
    }

  }


  static getColumnWidth(column) {

    let defaultWidth=200;
    switch (column.type) {
      case 'date': {
        var defaultDateFormat=column.dateFormat ?  column.dateFormat : 'L';

        switch (defaultDateFormat) {
          case 'L': return 100;
          case 'LL': return 135;
          case 'LLL': return 180;
          case 'LT': return 100;
          default :  return defaultWidth;
        }
      }

      case 'decimal':return 150;
      case 'number':return 100;

      // TODO:.. diğer tipler eklenecek...

      default: {
        return defaultWidth;
      }
    }

  }

}
export default UIHelper;
