import React from 'react';
var BCard = require('b-card').BCard;
const BFlexPanel = require('b-flex-panel').default;


export class BCardPostTestGenerator {
  constructor() {
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.BCardComponent.setDisable(this.disabled);
  }

  _onclick() {
    alert('ses deneme');
  }

  generate(context) {
    return [
      {
        'text': 'Card',
        'component': <div style={{ height: 520 }}>
          <BFlexPanel style={{height: '%100', width:1280}} >
            <BCard context={context}
              column={2}
              expandable={false}
              hasMedia= {true}
              style = {{width:300, height:340, margin: 10}}
              cardTitle = {'Accounts2'}
              cardText = {'An API is a very useful mechanism tha connect two pieces of sotfware equipment to exchange message or data in a standard format.'}
              mediaImage= {'https://bbvaopen4u.com/sites/default/files/img/new/6-cosas-api.jpg'}>
            </BCard>
            <BCard context={context}
              column={1}
              expandable={false}
              hasMedia= {true}
              style = {{width:300, height:340, margin: 10}}
              cardTitle = {'Accounts1'}
              cardSubtitle = {'Coming Soon'}
              cardText = {'An API is a very useful mechanism tha connect two pieces of sotfware equipment to exchange message or data in a standard format.'}
              mediaImage= {'https://bbvaopen4u.com/sites/default/files/img/new/6-cosas-api.jpg'}>
            </BCard>
            <BCard context={context}
              column={3}
              expandable={false}
              hasMedia= {true}
              style = {{width:300, height:340, margin: 10}}
              cardTitle = {'Accounts3'}
              cardText = {'An API is a very useful mechanism tha connect two pieces of sotfware equipment to exchange message or data in a standard format.'}
              mediaImage= {'https://bbvaopen4u.com/sites/default/files/img/new/6-cosas-api.jpg'}>
            </BCard>
          </BFlexPanel>
        </div>
      }
    ];
  }
}
export default BCardPostTestGenerator;
