import React from 'react';
const BFlexPanel = require('b-flex-panel').default;

export class BFlexPanelTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  generate(context, self) {
    return [
      {
        'text': 'BFlexPanel',
        'component':
  <div>
    <BFlexPanel direction= 'vertical'>
      <BFlexPanel order='2' direction= 'vertical'>
        <label style={{width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>2</label>
        <label style={{width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>2</label>
      </BFlexPanel>
      <BFlexPanel order='1' alignment='center' style={{height: '%100'}}>
        <label style={{width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>1</label>
        <label style={{width: 200, height: 300, background: 'red', border:'solid', 'text-align': 'center' }}>1</label>
        <label style={{width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>1</label>
      </BFlexPanel>
      <BFlexPanel order='3' style={{height: '%100'}}>
        <label order='3' style={{ width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>1</label>
        <label order='2' style={{ width: 200, height: 300, background: 'red', border:'solid', 'text-align': 'center' }}>2</label>
        <label order='1' style={{ width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>3</label>
      </BFlexPanel>
      <BFlexPanel order='0' style={{height: '%100'}}>
        <label style={{ width: 200, height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>0</label>
        <label style={{ width:300, height: 300, background: 'red', border:'solid', 'text-align': 'center' }}>0</label>
        <label style={{ height: 200, background: 'red', border:'solid', 'text-align': 'center' }}>5</label>
      </BFlexPanel>
    </BFlexPanel>
  </div>
      }
    ];
  }
}

export default BFlexPanelTestGenerator;
