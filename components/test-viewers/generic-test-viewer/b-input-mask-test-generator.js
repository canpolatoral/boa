import React from 'react';
var BInputMask = require('b-input-mask').BInputMask;

export class BInputMaskTestGenerator {
  constructor() {
    this.disabled = false;
  }

  testClick() {
    let plate = this.plateinput.getValue();
    alert('Plate: ' + plate.value + ' - ' + plate.saltValue);
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.plateinput.setDisable(this.disabled);
  }

  _btnValidateConstraintOnclick(e) {
    this.constraintInput.validateConstraint();
  }

  generate(context) {
    return [
      {
        'text': 'Credit Card',
        'component': <BInputMask context={context}
                    errorText="Geçerli bir kart numarası giriniz."
                    type= "CreditCard"
                    floatingLabelText="Kredi Kartı Numarası"
                     />
      },
      {
        'text': 'Expiry Date',
        'component': <BInputMask context={context}
                    mask="nn/nnnn"
                    type= "Custom"
                    helperText="mm/yyyy"
                    errorText="Error Text"
                    floatingLabelText="Expire Date" />
      },
      {
        'text': 'IBAN',
        'component':
  <div>
    <BInputMask context={context}
                        ref={r => this.plateinput = r}
                        type= "IBAN"
                        disabled={this.disabled}
                        errorText="Geçerli bir IBAN giriniz."
                        floatingLabelText="IBAN" />
    {/* <button id="testButton" onClick={this.testClick.bind(this)}>click me</button>
    <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button> */}
  </div>
      },
      {
        'text': 'Phone',
        'component': <BInputMask context={context}
                    type= "MobilePhoneNumber"
                    floatingLabelText="Phone"
                    value={'(532) 123 45 67'} />
      }
    ];
  }
}
export default BInputMaskTestGenerator;
