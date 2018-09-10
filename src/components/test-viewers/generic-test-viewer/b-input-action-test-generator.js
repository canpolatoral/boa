import React from 'react';
var BInputAction = require('b-input-action').BInputAction;

export class BInputActionTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state.helperTextInput = {
      hint: 'Customer Id',
      label: ' '
    };
    self.state.searchText = 456;
    this.disabled = false;
  }
  _iconSize =20;  
  helperTextInput_OnChange(e) {
    let value = e.target.value;
    let hasValue = value && value.length > 0;
    let hint = this.self.state.helperTextInput.hint;
    this.self.setState({
      helperTextInput: {
        hint: hint,
        label: hasValue ? hint : ' '
      }
    });
  }

  inputAction_onChange(e) {
    this.self.setState({ searchText: parseInt(e.target.value) });
  }

  _btnClearClicked(e) {
    this.self.setState({ searchText: 0 });
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.binputaction.setDisable(this.disabled);
    this.binputaction2.setDisable(this.disabled);
  }

  generate(context, self) {
    return [
      {
        'text': 'Input Action',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInputAction
          ref={r => this.binputaction = r}
          context={context}
          value={this.self.searchText}
          hintText='Input Action'
          floatingLabelText='Müşteri No, TCKN'
          maxLength={11}
          onChange={this.inputAction_onChange.bind(this)}
          rightIconList={[  //
            { dynamicIcon: 'Refresh', iconProperties: { style: { color: context.theme.boaPalette.pri500, width: this._iconSize, height:  this._iconSize  } } },
            { dynamicIcon: 'Clear', iconProperties: { style: {color: context.theme.boaPalette.base400, width: this._iconSize, height:  this._iconSize  } }, onClick: this._btnClearClicked.bind(this) },
            { dynamicIcon: 'AddCircleOutline', iconProperties: { style: {color: context.theme.boaPalette.pri500, width: this._iconSize, height:  this._iconSize  } } }

          ]}
          />
    </div>
  </div>
      },
      {
        'text': 'Input Action Numeric',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInputAction
          ref={r => this.binputaction = r}
          context={context}
          disabled={this.disabled}
          value={this.self.state.searchText}
          hintText='Numeric Input Action'
          type='numeric'
          floatingLabelText='Müşteri No, TCKN'
          maxLength={11}
          onChange={this.inputAction_onChange.bind(this)}
          rightIconList={[
              { dynamicIcon: 'Clear', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize } }, onClick: this._btnClearClicked.bind(this) }
          ]}
          />
      <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
    </div>
  </div>
      },
      {
        'text': 'Input Action Password',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInputAction
          ref={r => this.binputaction2 = r}
          context={context}
          value={this.self.state.searchText}
          disabled={this.disabled}
          hintText='Password Input Action'
          type='password'
          floatingLabelText='Müşteri No, TCKN'
          maxLength={11}
          onChange={this.inputAction_onChange.bind(this)}
          bottomRightInfoEnable={false}
          rightIconList={[
              { dynamicIcon: 'Clear', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } }, onClick: this._btnClearClicked.bind(this) }
          ]}
          />
    </div>
  </div>
      },
      {
        'text': 'Input Action No Floating',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInputAction
          ref={r => this.binputaction = r}
          context={context}
          value={this.self.searchText}
          hintText='Input Action'
          onChange={this.inputAction_onChange.bind(this)}
          rightIconList={[
              { dynamicIcon: 'AlarmOn', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } } },
              { dynamicIcon: 'Clear', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } }, onClick: this._btnClearClicked.bind(this) }
          ]}
          />
    </div>
  </div>
      },
      {
        'text': 'Input Action Left Icon',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInputAction
          ref={r => this.binputaction = r}
          context={context}
          value={this.self.searchText}
          hintText='Input Action'
          onChange={this.inputAction_onChange.bind(this)}
          rightIconList={[
              { dynamicIcon: 'AlarmOn', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } } },
              { dynamicIcon: 'Clear', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } }, onClick: this._btnClearClicked.bind(this) }
          ]}
          leftIconList={[
            { dynamicIcon: 'Toys', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } } },
            { dynamicIcon: 'Traffic', iconProperties: { style : { color: '#1976D2', width: this._iconSize, height:  this._iconSize  } }, onClick: this._btnClearClicked.bind(this) }
          ]}
          />
    </div>
  </div>
      }
    ];
  }
}
export default BInputActionTestGenerator;
