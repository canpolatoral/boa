import React from 'react';
import BToggle from 'b-toggle';
var BRadioButtonGroup = require('b-radio-button-group').BRadioButtonGroup;
var BComboBox = require('b-combo-box').BComboBox;

export class BRadioButtonGroupTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {
        valueSelected: '12',
        selectedLabelPosition: 'right',
        direction: 'vertical'
      };
    }
    this.disabled = false;
  }

  _btnDisableOnclick() {
    this.disabled = !this.disabled;
    this.RadioButtonGroupComponent.getInstance().setDisable(this.disabled);
  }

  handleChange = event => {
    this.self.setState({ valueSelected: event.target.value });
  };

  handleChangeLabel = event => {
    this.self.setState({ selectedLabelPosition: event.target.value });
  };

  generate(context, self) {
    let items = [
      {
        label: 'İstanbul',
        value: '34'
      },
      {
        label: 'Ankara',
        value: '06'
      },
      {
        label: 'Van',
        value: '65'
      },
      {
        label: 'Kocaeli',
        value: '41',
        disabled: true
      }
    ];

    let labelPositions = [
      {
        label: 'left',
        value: 'left'
      },
      {
        label: 'right',
        value: 'right'
      }
    ];

    let directions = [{ text: 'vertical', value: 'vertical' }, { text: 'horizontal', value: 'horizontal' }];

    return [
      {
        text: 'BRadioButtonGroup',
        component: (
          <div>
            <div>
              <BRadioButtonGroup
                ref={r => (this.RadioButtonGroupComponent = r)}
                context={context}
                headerText="Radio Group Header"
                name="BOARadioButtonGroup"
                valueSelected={self.state.valueSelected}
                items={items}
                labelPosition={self.state.selectedLabelPosition}
                disabled={this.disabled}
                onChange={this.handleChange}
                direction={self.state.direction}
              />
            </div>
            <BComboBox
              context={context}
              hintText="direction"
              labelText="direction"
              dataSource={directions}
              multiSelect={false}
              multiColumn={false}
              isAllOptionIncluded={false}
              displayMemberPath="text"
              valueMemberPath="value"
              value={[self.state.direction]}
              onSelect={(index, selectedItems, selectedValues) => {
                this.self.setState({
                  direction: selectedValues[0]
                });
              }}
            />
            <div>
              <button id="disable" onClick={this._btnDisableOnclick.bind(this)}>
                Disable/Editable
              </button>
              <BRadioButtonGroup
                ref={r => (this.RadioButtonGroupComponentLabel = r)}
                context={context}
                headerText="Label Position"
                name="BOARadioButtonGroup"
                valueSelected={self.state.selectedLabelPosition}
                items={labelPositions}
                labelPosition="right"
                onChange={this.handleChangeLabel}
              />
            </div>
          </div>
        )
      }
    ];
  }
}
export default BRadioButtonGroupTestGenerator;
