import React from 'react';
import { BComponent } from 'b-component';

var BCalendarPicker = require('b-calendar-picker').BCalendarPicker;

export class BCalendarPickerTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  _btnDisableOnclick() {
    this.disabled = !this.disabled;
    this.CalendarPickerComponent.setDisable(this.disabled);
  }

  _btnValidateConstraintOnclick() {
    this.dateTimePicker1.validateConstraint();
    this.dateTimePicker2.validateConstraint();
  }

  _buttonOnClick() {
    var getValues = BComponent.Localization.formatDateTime( this.DateTimePickerComponent.getValue(), 'LLL');
    alert(this.DateTimePickerComponent.getValue()+ '------' +  getValues);
  }

  _buttonOnClick2() {
    var getValues = BComponent.Localization.formatDateTime( this.dateTimePicker1.getValue(), 'LLL');
    alert(this.dateTimePicker1.getValue() +'-----'+getValues);
  }

  busDateClick() {
    var getValues = BComponent.Localization.formatDateTime( this.dateTimePicker2.getValue(), 'LLL');
    alert(this.dateTimePicker2.getValue() +'-----'+getValues);
  }

  generate(context, self) {
    return [
      {
        'text': 'Default',
        'component':
  <div>
    <div style={{ marginBottom: '10px', width: '256px' }}>
      <BCalendarPicker context={context}
        ref={(r) => this.CalendarPicker = r}//DateTimePicker
        disabled={this.disabled}
        style={{ marginRight: '10px' }}
        floatingLabelTextDate='İşlem Tarihi'
        valueConstraint={{ required: true }}
        pageType='transactional'
        format= 'DDMMYYYY'
      />
    </div>
  </div>
      },
    ];
  }
}
export default BCalendarPickerTestGenerator;
