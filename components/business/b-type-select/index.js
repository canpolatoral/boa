import React from 'react';
import {BBusinessComponent} from 'b-business-component';
import {BToggle} from 'b-toggle';
import {BComboBox} from 'b-combo-box';
import { BInput} from 'b-input';
import {BInputNumeric} from 'b-input-numeric';

export class BTypeSelect extends BBusinessComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedValue:this.props.selectedValue,
      eventData: this.props.eventData
    };
  }
  onSelectComponent() {
    if (this.state.selectedValue!=undefined)
      switch (this.state.selectedValue.componentName) {
        case 'number':
          {
            return (
              <div>
                <BInputNumeric  context={this.props.context}
                  hintText = {this.state.eventData.inputNumeric.hintText}
                  floatingLabelText = {this.state.eventData.inputNumeric.labelText}/>
              </div>);
          }
        case 'text':
          {
            return (
              <div>
                <BInput  context={this.props.context}
                  hintText = {this.state.eventData.input.hintText}
                  floatingLabelText = {this.state.eventData.input.labelText}/>
              </div>);

          }
        case 'toggle':
          {
            return (
              <div>
                <BToggle  context={this.props.context}/>
              </div>);
          }
      }
  }

  render() {
    const selectTypes= [
      {
        'componentName': 'text',
        'componentId': 1
      },
      {
        'componentName': 'number',
        'componentId': 2
      },
      {
        'componentName': 'toggle',
        'componentId': 3
      }
    ];

    return (
      <div >
        < BComboBox
          // ref={r => this.detailCriteriaField2 = r}
          context={this.props.context}
          hintText = {'hint'}  // this.state.eventData.comboBox.hintText
          labelText= {this.state.selectedValue.componentName}
          dataSource = {selectTypes}
          value  = {[]}
          columns = {
          [{
            'key': 'componentId',
            'name': 'componentName',
            'resizable': true
          }]
          }
          displayMemberPath = 'componentName'
          valueMemberPath = 'componentId'
          onSelect={(selectedIndexes: any[], selectedItems: any[]) => {
            this.setState({ selectedValue: selectedItems[0]});}
          }
        />
        <div>{this.onSelectComponent()} </div>
      </div>
    );
  }
}
export default BTypeSelect;
