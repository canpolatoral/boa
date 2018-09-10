import React from 'react';
import BInputNumeric from 'b-input-numeric';
import BLabel from 'b-label';
var BRadioButton = require('b-radio-button').BRadioButton;

export class BRadioButtonTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    // this.RadioButtonComponent.getInstance().setDisable(this.disabled);
    this.RadioButtonComponent1.getInstance().setDisable(this.disabled);
  }
  _btnDisableOnclick1(e) {
    this.disabled = !this.disabled;
    this.RadioButtonComponent.getInstance().setDisable(this.disabled);
    // this.RadioButtonComponent1.getInstance().setDisable(this.disabled);
  }

  generate(context, self) {
    return [
      // {
      //   text: 'BRadioButton',
      //   component: (
      //     <div>
      //       <div>
      //         <BRadioButton
      //           ref={r => (this.RadioButtonComponent1 = r)}
      //           context={context}
      //           label="Radio1"
      //           labelPosition="left"
      //           disabled={this.disabled}
      //         />
      //       </div>
      //       <div>
      //         <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>
      //           Disable/Editable
      //         </button>
      //       </div>
      //     </div>
      //   )
      // },
      {
        text: 'BRadioButton',
        component: (
          <div className={'baslangic'}>
              <BRadioButton
                ref={r => (this.RadioButtonComponent = r)}
                context={context}
                disabled={this.disabled}
                content={
                  <div style={{display: 'inline-flex'}}>
                    <BInputNumeric context={context} maxlength="5" />
                    <BLabel context={context} text="iş gününde bir çalıştır" />
                  </div>
                }
              />
            {/* <div>
              <button id="disable" onClick={this._btnDisableOnclick1.bind(this)} style={{ marginLeft: '10px' }}>
                Disable/Editable
              </button>
            </div> */}
          </div>
        )
      }
    ];
  }
}
export default BRadioButtonTestGenerator;
