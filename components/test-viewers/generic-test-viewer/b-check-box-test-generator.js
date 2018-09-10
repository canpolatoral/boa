import React from 'react';
var BCheckBox = require('b-check-box').BCheckBox;
export class BCheckBoxTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.CheckBoxComponent.getInstance().setDisable(this.disabled);
  }

  generate(context, self) {
    return [
      {
        'text': 'BCheckBox',
        'component':
  <div >
    <BCheckBox context={context}
              ref={(r) => this.CheckBoxComponent = r}
              label={'BCheckBox Label'}
              defaultChecked={true}
              disabled={this.disabled}
            // classes={{label:this.props.classes.label}}
            />
    <button id="disable" onClick={this._btnDisableOnclick.bind(this)} >Disable/Editable</button>
  </div>
      }
    ];
  }
}

export default BCheckBoxTestGenerator;
