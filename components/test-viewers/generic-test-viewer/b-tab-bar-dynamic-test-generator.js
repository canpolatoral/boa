import React from 'react';
var BTabBarDynamic = require('b-tab-bar').BTabBar;

export class BInputMaskTestGenerator {
  constructor() {
    this.disabled = false;

    this.tabItemsWithContent = [
      {
        text: 'Raporlar',
        value: '0',
        content: 'kuveyt'
      },
      {
        text: 'Nakit Yatırma',
        value: '1',
        content: 'türk'
      },
      {
        text: 'Nakit Listeleme',
        value: '2',
        content: 'katılım bankası'
      }
    ];
  }

  testClick() {
    let plate = this.plateinput.getValue();
    alert('Plate: ' + plate.value + ' - ' + plate.saltValue);
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.plateinput.setDisable(this.disabled);
  }

  generate(context) {
    return [
      {
        'text': 'Tab Bar With Content',
        'component':         
  <BTabBarDynamic 
            context={context} 
            tabItems={this.tabItemsWithContent} 
            mode='secondary'
          />
      },
      {
        'text': 'Tab Bar Without Content',
        'component': 
  <BTabBarDynamic 
            context={context} 
            tabItems={this.tabItemsWithContent} 
            contentEnabled={false}
            centerTabs={true}
            closeIconEnabled={true}
          />
      }
    ];
  }
}
export default BInputMaskTestGenerator;
