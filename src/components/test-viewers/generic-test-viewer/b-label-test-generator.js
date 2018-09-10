import React from 'react';
var BLabel = require('b-label').BLabel;

export class BLabelTestGenerator {

  generate(context, self) {
    return [
      {
        'text': 'maxWidth=250',
        'component': <BLabel context={context}
          maxWidth={250}
          text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus' />
      },
      {
        'text': 'maxWidth=250, minFontSize=8',
        'component': <BLabel context={context}
          maxWidth={250}
          minFontSize={8}
          text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus' />
      },
      {
        'text': 'maxWidth=500',
        'component': <BLabel context={context}
          maxWidth={500}
          text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus' />
      },
      {
        'text': 'maxWidth=750, minFontSize=13',
        'component': <BLabel context={context}
          maxWidth={750}
          minFontSize={13}
          text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada, sem quis lacinia elementum, urna mi elementum metus' />
      }
    ];
  }
}
export default BLabelTestGenerator;
