import React from 'react';
import { BLocalization } from 'b-localization';
var BDateTimePicker = require('b-datetime-picker').BDateTimePicker;
var BBusinessDateTimeComponent = require('b-business-datetime-component').BBusinessDateTimeComponent;

export class BDatePickerTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }
  
  _btnDisableOnclick() {
    this.disabled = !this.disabled;
    this.DatePickerComponent.setDisable(this.disabled);
    this.DateRangePickerComponent.setDisable(this.disabled);
    this.DateTimePickerComponent.setDisable(this.disabled);
    this.TimePickerComponent.setDisable(this.disabled);
  }

  _btnValidateConstraintOnclick() {
    this.dateTimePicker1.validateConstraint();
    this.dateTimePicker2.validateConstraint();
  }


  _buttonOnClick() {
    var getValues = BLocalization.formatDateTime( this.DateTimePickerComponent.getValue(), 'LLL');
    alert(this.DateTimePickerComponent.getValue()+ '------' +  getValues);
  }

  _buttonOnClick2() {
    var getValues = BLocalization.formatDateTime( this.dateTimePicker1.getValue(), 'LLL');
    alert(this.dateTimePicker1.getValue() +'-----'+getValues);
  }

  busDateClick() { 
    var getValues = BLocalization.formatDateTime( this.dateTimePicker2.getValue(), 'LLL');
    alert(this.dateTimePicker2.getValue() +'-----'+getValues);
  }

  generate(context, self) {
    return [
      {
        'text': 'Default Browse Page',
        'component':
  <div>
    <div style={{ marginBottom: '10px', width: '256px' }}>
      <BDateTimePicker context={context}
        ref={(r) => self.dateTimePicker1 = r}
        disabled={this.disabled}
        floatingLabelTextDate='İşlem Tarihi'
        floatingLabelTextTime='İşlem Zamanı'
        style={{ marginRight: '10px' }}
        format= 'DDMMYYYY'
        // dateOnChange={(event, value)=>{
        //   console.log(value);
        //   console.log(self.dateTimePicker1.getValue());
        // }}
      />
    </div>

    <div>
      <button onClick={this._buttonOnClick2.bind(self)}>Get Value</button>
    </div>
  </div>
      },
      {
        'text': 'Default Transactional Page',
        'component':
  <div>
    <div style={{ marginBottom: '10px', width: '256px' }}>
      <BDateTimePicker context={context}
        ref={(r) => this.dateTimePicker1 = r}
        disabled={this.disabled}
        floatingLabelTextDate='İşlem Tarihi'
        floatingLabelTextTime='İşlem Zamanı'
        style={{ marginRight: '10px' }}
        pageType='transactional'
        format= 'DDMMYYYY'
      />
    </div>
  </div>
      },

      {
        'text': 'Business Date',
        'component':
  <div>
    <div style={{ marginBottom: '10px', width: '256px' }}>    
      <BBusinessDateTimeComponent
        context={context}
        ref={(r) => self.dateTimePicker2 = r}
        value={new Date(2007, 11, 27)}
        canSelectOldDates={true}
        canSelectWeekendDays={false}
        canSelectSpecialDays={false}
        floatingLabelTextDate='İşlem Tarihi'
        pageType='transactional'
        format= 'DDMMYYYY'
        />
    </div>

    <div>
      <button onClick={this.busDateClick.bind(self)}>Get Value</button>
    </div>
  </div>
      },
      {
        'text': 'With Time',
        'component':
  <div>
    <div style={{ marginBottom: '10px', width: '256px' }}>
      <BDateTimePicker context={context}
        ref={r => self.DateTimePickerComponent = r}
        disabled={this.disabled}
        style={{ marginRight: '10px' }}
        floatingLabelTextDate='İşlem Tarihi'
        floatingLabelTextTime='Saat'
        format= 'DDMMYYYY hmmss'
      />
    </div>

    <div>
      <button onClick={this._buttonOnClick.bind(self)}>Get Value</button>
    </div>
  </div>
      },

      {
        'text': 'Default 2',
        'component':
  <div>
    <div style={{ marginBottom: '10px', width: '256px' }}>
      <BDateTimePicker context={context}
        ref={(r) => this.DateTimePickerComponent = r}
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
export default BDatePickerTestGenerator;
