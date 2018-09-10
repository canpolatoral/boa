import React from 'react';
var BSlider = require('b-slider').BSlider;


export class BSliderTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.SliderComponent.setDisable(this.disabled);
  }

  generate(context, self) {
    return [
      {
        'text': 'BDatePicker',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BSlider context={context}
        ref={(r) => this.SliderComponent = r}
        disabled={this.disabled}
        style={{ marginRight: '10px' }}
      />
      <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
    </div>
  </div>
      }
    ];
  }
}
export default BSliderTestGenerator;
