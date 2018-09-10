import React from 'react';

import { BComponent } from 'b-component';
var BInputNumeric = require('b-input-numeric').BInputNumeric;

export class BInputNumericTestGenerator {
  constructor() {
    this.disabled = false;
    this.state = {
      value: BComponent.Localization.getLocalizationLanguage().languageId == 1 ? '20,45' : '20.45'
    };
  }

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state = {
      myValue: null
    };
  }

  getValueClick() {
    let plate = this.itemGenerator.decimalinput.getValue();
    alert('Plate: ' + plate);
  }

  getValue2Click() {
    let plate = this.itemGenerator.moneyinput.getValue();
    alert('Plate: ' + plate);
  }

  setValueClick() {
    var randomValue = Math.random() * (1000 - 200) + 200;
    this.itemGenerator.state.value = randomValue;
    this.setState({ value: randomValue });
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.decimalinput.setDisable(this.disabled);
  }

  _btnResetOnclick(e) {
    this.decimalinput.resetValue();
  }

  _btnSetNullOnclick(e) {
    this.self.setState({ myValue: null });
  }

  _btnSetEmptyOnclick(e) {
    this.self.setState({ myValue: null });
  }

  _onChange(e, value) {
    this.self.setState({ myValue: value });
  }

  generate(context, self) {
    return [
      {
        text: 'Decimal',
        component: (
          <div>
            <BInputNumeric
              context={context}
              ref={r => (this.decimalinput = r)}
              hintText="12345678901"
              format="D"
              floatingLabelText="Decimal"
              value={self.state.myValue}
              // defaultValue={}
              maxLength={11}
              showCounter={true}
              onChange={this._onChange.bind(this)}
            />
            <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>
              Disable/Editable
            </button>
            <button id="resetValue" onClick={this._btnResetOnclick.bind(this)} style={{ marginLeft: '10px' }}>
              Reset Value
            </button>
            <button id="setNull" onClick={this._btnSetNullOnclick.bind(this)} style={{ marginLeft: '10px' }}>
              Set Null
            </button>
            <button id="setEmpty" onClick={this._btnSetEmptyOnclick.bind(this)} style={{ marginLeft: '10px' }}>
              Set Empty
            </button>
          </div>
        )
      },
      {
        text: 'Float',
        component: (
          <BInputNumeric
            context={context}
            ref={r => (this.floatinput = r)}
            hintText="123456,34"
            format="F"
            defaultValue={-100}
            value={0}
            floatingLabelText="Float"
            maxLength={11}
          />
        )
      },
      {
        text: 'Money',
        component: (
          <BInputNumeric
            context={context}
            ref={r => (this.money2input = r)}
            hintText="12345678901"
            format="M"
            floatingLabelText="Money"
            defaultValue={0}
            maxLength={11}
          />
        )
      },
      {
        text: 'Money',
        component: (
          <BInputNumeric
            context={context}
            ref={r => (this.moneyinput = r)}
            hintText="12345678901"
            format="M"
            value={this.state.value}
            defaultValue={765430.21}
            floatingLabelText="Money"
            maxLength={11}
          />
        )
      },
      {
        text: 'Foreign Exchange',
        component: (
          <BInputNumeric
            context={context}
            ref={r => (this.forexinput = r)}
            hintText="12345678901"
            format="FX"
            floatingLabelText="Foreign Exchange"
            maxLength={11}
          />
        )
      },
      {
        text: 'Disabled',
        component: (
          <BInputNumeric
            context={context}
            ref={r => (this.disabledinput = r)}
            hintText="12345678901"
            format="D"
            value={1234567}
            defaultValue={765430.21}
            disabled={true}
            type="text"
            floatingLabelText="Disabled"
            maxLength={11}
          />
        )
      },
      {
        text: 'getValue',
        component: (
          <div>
            <input type="submit" onClick={this.getValueClick.bind(self)} />
            <input type="submit" onClick={this.getValue2Click.bind(self)} />
          </div>
        )
      },
      {
        text: 'setValue',
        component: <input type="submit" onClick={this.setValueClick.bind(self)} />
      }
    ];
  }
}
export default BInputNumericTestGenerator;
