import React from 'react';
var BExcelBrowser = require('b-excel-browser').BExcelBrowser;

export class BExcelBrowserTestGenerator {
  constructor() {    
  }

  generate(context) {

    return [
      {
        'text': 'BExcelBrowser',
        'component': <BExcelBrowser 
                        context={context} 
                        floatingLabelText={'Müşteri Listesi'}
                        hintText={'Müşteri Listesi'}
                        valueType={99}
                      />
      }
    ];
  }
}
export default BExcelBrowserTestGenerator;

