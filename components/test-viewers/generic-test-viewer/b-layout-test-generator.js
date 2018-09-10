import React from 'react';
var BCard = require('b-card').BCard;
var BInput = require('b-input').BInput;
var BGridSection = require('b-grid-section').BGridSection;

export class BLayoutTestGenerator {
  constructor() {
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.BCardComponent.setDisable(this.disabled);
    // this.GridSectionComponent.setDisable(this.disabled);
  }

  generate(context) {
    return [
      {
        'text': 'BCard',
        'component':
  <div style={{ height: 1000 }}>
    <BCard
      ref={(r) => this.BCardComponent = r}
      column={0}
      context={context}
      disabled={this.disabled}
      expandable={true}
      expanded={true}>
      <div>
        <BInput context={context} />
      </div>
    </BCard>
    <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
  </div>
      },
      {
        'text': 'GridSection',
        'component':
  <div style={{ height: 1000 }}>
    <BGridSection
      ref={(r) => this.GridSectionComponent = r}
      context={context}
      disabled={this.disabled}
      >
      <BInput context={context} />
    </BGridSection>
    <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
  </div>
      }
    ];
  }
}
export default BLayoutTestGenerator;
