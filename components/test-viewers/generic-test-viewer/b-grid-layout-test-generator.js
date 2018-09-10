import React from 'react';

var BGridLayout = require('b-grid-layout').BGridLayout;
var BCard = require('b-card').BCard;
var BInput = require('b-input').BInput;


export class BGridLayoutTestGenerator {
  constructor() {
    this.disabled = false;
  }

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state.draggable = true;
    this.disabled = false;
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    // this.GridSectionComponent.setDisable(this.disabled);
  }

  _btnDraggableOnclick(e) {
    this.self.setState({ draggable: !this.self.state.draggable });
  }

  generate(context) {
    var cardStyle = { height: '100%' };
    return [
      {
        'text': 'BCard',
        'component':
          <div style={{ height: 1000 }}>
            <BGridLayout ref={r => this.grid = r} context={context} style={{ background: 'wheat' }} isDraggable={this.self.state.draggable} isResizable={true}>
              <div key={'card1'}>
                <BCard
                  ref={(r) => this.BCardComponent1 = r}
                  column={0}
                  context={context}
                  disabled={this.disabled}
                  expandable={true}
                  expanded={true}
                  style={cardStyle}>
                  <BInput context={context} value={'Test Input 1'} />
                </BCard>
              </div>
              <div key={'card2'}>
                <BCard
                  ref={(r) => this.BCardComponent2 = r}
                  column={0}
                  context={context}
                  disabled={this.disabled}
                  expandable={true}
                  expanded={true}
                  style={cardStyle}>
                  <BInput context={context} value={'Test Input 2'} />
                </BCard>
              </div>
              <div key={'card3'} style={{ background: 'lightcoral' }}>
                <label>single</label>
              </div>
            </BGridLayout>
            <button id="draggable" onClick={this._btnDraggableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Draggable/Static</button>
            <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
          </div>
      }
    ];
  }
}
export default BGridLayoutTestGenerator;
