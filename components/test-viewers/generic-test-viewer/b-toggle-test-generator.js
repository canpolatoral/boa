import React from 'react';
var BToggle = require('b-toggle').BToggle;

export class BToggleTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.ToggleComponent.getInstance().setDisable(this.disabled);
  }
  _onChange(event) {
    let isChecked = event.target.checked;
  }

  generate(context, self) {
    return [
      {
        'text': 'BToggle',
        'component':
  <div>
    <BToggle
              ref={(r) => this.ToggleComponent = r}
              context={context}
              label='Yetkili veya Talimatlı'
              onToggle={this._onChange.bind(this)}
              disabled={this.disabled} />
  </div>
      },
      {
        'text': 'BToggle',
        'component':
  <div>
    <BToggle
              ref={(r) => this.ToggleComponent = r}
              onToggle={this._onChange.bind(this)}
              context={context}
              label='Yetkili veya Talimatlı'
              dynamicIcon='ThumbUp'
              iconProperties={{ style: { color: '#4CAF50' } }}
              disabled={this.disabled} />
    <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
  </div>
      }
    ];
  }
}
export default BToggleTestGenerator;
