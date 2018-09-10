import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BCheckBox } from 'b-check-box';
import { BDateTimePicker } from 'b-datetime-picker';
import { BRadioButtonGroup } from 'b-radio-button-group';
import { BInputNumeric } from 'b-input-numeric';
import { BComboBox } from 'b-combo-box';
import { BTabBar } from 'b-tab-bar';
import { TimeScheduleContract } from './model';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { BFormManager } from 'b-form-manager';

interface state {
  timeScheduleContract: TimeScheduleContract;
  dateList: Array<Date>;
}

@BComponentComposer
export class ScheduleComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps
  };

  state: state;

  constructor(props, context) {
    super(props, context);

    this.state = {
      timeScheduleContract: props.timeScheduleContract || {},
      dateList: []
    };

    this.clear();

    this.dayList = [
      { value: 0, text: this.getMessage('DWH', 'Monday') },
      { value: 1, text: this.getMessage('DWH', 'Tuesday') },
      { value: 2, text: this.getMessage('DWH', 'Wednesday') },
      { value: 3, text: this.getMessage('DWH', 'Thursday') },
      { value: 4, text: this.getMessage('DWH', 'Friday') },
      { value: 5, text: this.getMessage('DWH', 'Saturday') },
      { value: 6, text: this.getMessage('DWH', 'Sunday') }
    ];

    this.weekList = [
      { value: 0, text: this.getMessage('DWH', 'First') },
      { value: 1, text: this.getMessage('DWH', 'Second') },
      { value: 2, text: this.getMessage('DWH', 'Third') },
      { value: 3, text: this.getMessage('DWH', 'Fourth') },
      { value: 4, text: this.getMessage('DWH', 'Last') }
    ];

    this.monthList = [
      { value: 0, text: this.getMessage('DWH', 'January') },
      { value: 1, text: this.getMessage('DWH', 'February') },
      { value: 2, text: this.getMessage('DWH', 'March') },
      { value: 3, text: this.getMessage('DWH', 'April') },
      { value: 4, text: this.getMessage('DWH', 'May') },
      { value: 5, text: this.getMessage('DWH', 'June') },
      { value: 6, text: this.getMessage('DWH', 'July') },
      { value: 7, text: this.getMessage('DWH', 'August') },
      { value: 8, text: this.getMessage('DWH', 'September') },
      { value: 9, text: this.getMessage('DWH', 'October') },
      { value: 10, text: this.getMessage('DWH', 'November') },
      { value: 11, text: this.getMessage('DWH', 'December') }
    ];

    this.dailyPeriodDetailList = [
      { value: '0', label: this.getMessage('DWH', 'RunOnceAXBusinessDay') },
      { value: '1', label: this.getMessage('DWH', 'RunOnceADay') }
    ];

    this.weeklyPeriodDetailList = [{ value: '2', label: this.getMessage('DWH', 'RunSelectedDays') }];

    this.monthlyPeriodDetailList = [
      { value: '3', label: this.getMessage('DWH', 'RunXthDay') },
      { value: '4', label: this.getMessage('DWH', 'RunXthWorkDay') },
      { value: '7', label: this.getMessage('DWH', 'RunXDay') }
    ];

    this.yearlyPeriodDetailList = [
      { value: '5', label: this.getMessage('DWH', 'RunOnceAXBusinessDay') },
      { value: '6', label: this.getMessage('DWH', 'RunOnceADay') }
    ];
  }

  setDateList(contract: TimeScheduleContract, callback) {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.TimeScheduleRequest',
      requestBody: {
        methodName: 'GetTaskScheduleDates',
        dataContract: contract
      },
      params: {}
    };
    this.proxyTransactionExecute(proxyRequest);

    proxyRequest.params.get = response => {
      if (!response.success) {
        BFormManager.showStatusMessage(this.resultErrorListToString(response.results));
        this.setState({ dateList: [] });
      } else {
        this.setState({ dateList: response.value });
      }
      callback && callback(response);
    };
  }

  proxyDidRespond(proxyResponse) {
    let { response, params } = proxyResponse;
    params.get && params.get(response);
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  getValue() {
    return this.state.timeScheduleContract;
  }

  clear() {
    let contract: TimeScheduleContract = this.state.timeScheduleContract || {};
    contract.period = 0;
    contract.periodDetail = 0;
    contract.parameter1 = 1;
    contract.parameter2 = 1;
    contract.parameter3 = 1;
    contract.parameter4 = '2,0,0,0,0,0,0';
  }

  replaceAt(text, index, replacement) {
    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
  }

  resetState() {
    this.setState({ reRender: !this.state.reRender });
  }

  validate() {
    let contract: TimeScheduleContract = this.state.timeScheduleContract;

    if (contract.periodDetail == 2 && contract.parameter4 === '0,0,0,0,0,0,0') {
      return { returnValue: false, errorMessage: this.getMessage('DWH', 'WeeklyJobErrorMessage') };
    }
    if (!(contract.periodDetail > -1 && contract.periodDetail < 8)) {
      return { returnValue: false, errorMessage: this.getMessage('DWH', 'DateSelectionErrorMessage') };
    }
    if (contract.beginDate == null || contract.endDate == null) {
      return { returnValue: false, errorMessage: this.getMessage('DWH', 'ErrorMessage') };
    }
    return { returnValue: true, errorMessage: null };
  }

  getDailyContent(contract: TimeScheduleContract) {
    let m = this.dailyPeriodDetailList.find(s => s.value == contract.periodDetail.toString());
    let label = m && m.label;

    return (
      <div>
        <BRadioButtonGroup
          context={this.props.context}
          disabled={this.props.disabled}
          direction={'horizontal'}
          items={this.dailyPeriodDetailList}
          valueSelected={contract.periodDetail.toString()}
          onChange={(e, value) => {
            contract.periodDetail = Number(value);
            this.resetState();
          }}
        />
        {contract.periodDetail == 0 && (
          <BInputNumeric
            context={this.props.context}
            disabled={this.props.disabled}
            maxLength={2}
            hintText={label}
            floatingLabelText={label}
            value={contract.parameter1}
            onChange={(o, value) => {
              contract.parameter1 = value;
            }}
          />
        )}
        {contract.periodDetail == 1 && (
          <BInputNumeric
            context={this.props.context}
            disabled={this.props.disabled}
            maxLength={2}
            hintText={label}
            floatingLabelText={label}
            value={contract.parameter1}
            onChange={(o, value) => {
              contract.parameter1 = value;
            }}
          />
        )}
      </div>
    );
  }

  getWeeklyContent(contract: TimeScheduleContract) {
    let m = this.weeklyPeriodDetailList.find(s => s.value == contract.periodDetail.toString());
    let label = m && m.label;

    let defaultValue = '2,0,0,0,0,0,0';
    if (!contract.parameter4) {
      contract.parameter4 = defaultValue;
    } else if (contract.parameter4.length != 13) {
      contract.parameter4 = defaultValue;
    }

    return (
      <div>
        <BGridSection context={this.props.context}>
          <BGridRow context={this.props.context} columnCount={2}>
            <BRadioButtonGroup
              context={this.props.context}
              disabled={this.props.disabled}
              className={'inlineradio'}
              items={this.weeklyPeriodDetailList}
              valueSelected={contract.periodDetail.toString()}
              onChange={(e, value) => {
                contract.periodDetail = Number(value);
                this.resetState();
              }}
            />
            <BInputNumeric
              context={this.props.context}
              disabled={this.props.disabled}
              maxLength={2}
              hintText={label}
              floatingLabelText={label}
              disabled={!(contract.periodDetail == 2)}
              value={contract.parameter1}
              onChange={(o, value) => {
                contract.parameter1 = value;
              }}
            />
          </BGridRow>

          <BGridRow context={this.props.context} columnCount={3}>
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              label={this.getMessage('DWH', 'Monday')}
              checked={contract.parameter4[0] == '2'}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 0, v ? '2' : '0');
              }}
            />
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              label={this.getMessage('DWH', 'Tuesday')}
              checked={contract.parameter4[2] == '3'}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 2, v ? '3' : '0');
              }}
            />
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              label={this.getMessage('DWH', 'Wednesday')}
              checked={contract.parameter4[4] == '4'}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 4, v ? '4' : '0');
              }}
            />
          </BGridRow>
          <BGridRow context={this.props.context} columnCount={3}>
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              label={this.getMessage('DWH', 'Thursday')}
              checked={contract.parameter4[6] == '5'}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 6, v ? '5' : '0');
              }}
            />
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              label={this.getMessage('DWH', 'Friday')}
              checked={contract.parameter4[8] == '6'}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 8, v ? '6' : '0');
              }}
            />
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              label={this.getMessage('DWH', 'Saturday')}
              checked={contract.parameter4[10] == '6'}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 10, v ? '7' : '0');
              }}
            />
          </BGridRow>
          <BGridRow context={this.props.context}>
            <BCheckBox
              context={this.props.context}
              disabled={this.props.disabled}
              checked={contract.parameter4[12] == '1'}
              label={this.getMessage('DWH', 'Sunday')}
              onChange={(e, v) => {
                contract.parameter4 = this.replaceAt(contract.parameter4, 12, v ? '1' : '0');
              }}
            />
          </BGridRow>
        </BGridSection>
      </div>
    );
  }

  getMonthlyContent(contract: TimeScheduleContract) {
    return (
      <div>
        <BRadioButtonGroup
          context={this.props.context}
          disabled={this.props.disabled}
          className={'inlineradio'}
          items={this.monthlyPeriodDetailList}
          valueSelected={contract.periodDetail.toString()}
          onChange={(e, value) => {
            contract.periodDetail = Number(value);
            this.resetState();
          }}
        />
        <BGridSection context={this.props.context}>
          {contract.periodDetail == 3 && (
            <BGridRow context={this.props.context} columnCount={2}>
              <BInputNumeric
                context={this.props.context}
                disabled={this.props.disabled}
                maxLength={2}
                floatingLabelText={this.getMessage('DWH', 'OnceInMonth')}
                value={contract.parameter1}
                onChange={(o, value) => {
                  contract.parameter1 = value;
                }}
              />
              <BInputNumeric
                context={this.props.context}
                disabled={this.props.disabled}
                maxLength={2}
                floatingLabelText={this.getMessage('DWH', 'RunXthDay')}
                value={contract.parameter2}
                onChange={(o, value) => {
                  contract.parameter2 = value;
                }}
              />
            </BGridRow>
          )}
          {contract.periodDetail == 7 && (
            <BGridRow context={this.props.context} columnCount={2}>
              <BInputNumeric
                context={this.props.context}
                disabled={this.props.disabled}
                maxLength={2}
                floatingLabelText={this.getMessage('DWH', 'OnceInMonth')}
                value={contract.parameter1}
                onChange={(o, value) => {
                  contract.parameter1 = value;
                }}
              />
              <BInputNumeric
                context={this.props.context}
                disabled={this.props.disabled}
                maxLength={2}
                floatingLabelText={this.getMessage('DWH', 'RunXthWorkDay')}
                value={contract.parameter2}
                onChange={(o, value) => {
                  contract.parameter2 = value;
                }}
              />
            </BGridRow>
          )}
          {contract.periodDetail == 4 && (
            <BGridRow context={this.props.context} columnCount={3}>
              <BInputNumeric
                context={this.props.context}
                disabled={this.props.disabled}
                maxLength={2}
                floatingLabelText={this.getMessage('DWH', 'OnceInMonth')}
                value={contract.parameter1}
                onChange={(o, value) => {
                  contract.parameter1 = value;
                }}
              />
              <BComboBox
                context={this.props.context}
                disabled={this.props.disabled}
                labelText={this.getMessage('DWH', 'Monthly')}
                dataSource={this.weekList}
                value={[contract.parameter2]}
                onSelect={(a, b, values) => {
                  contract.parameter2 = values[0];
                }}
              />
              <BComboBox
                context={this.props.context}
                disabled={this.props.disabled}
                labelText={this.getMessage('DWH', 'RunXDay')}
                dataSource={this.dayList}
                value={[contract.parameter3]}
                onSelect={(a, b, values) => {
                  contract.parameter3 = values[0];
                }}
              />
            </BGridRow>
          )}
        </BGridSection>
      </div>
    );
  }

  getYearlyContent(contract: TimeScheduleContract) {
    return (
      <div>
        <BRadioButtonGroup
          context={this.props.context}
          disabled={this.props.disabled}
          className={'inlineradio'}
          items={this.yearlyPeriodDetailList}
          valueSelected={contract.periodDetail.toString()}
          onChange={(e, value) => {
            contract.periodDetail = Number(value);
            this.resetState();
          }}
        />
        <BGridSection context={this.props.context}>
          {contract.periodDetail == 5 && (
            <BGridRow context={this.props.context} columnCount={2}>
              <BComboBox
                context={this.props.context}
                disabled={this.props.disabled}
                labelText={this.getMessage('DWH', 'MonthOf')}
                dataSource={this.monthList}
                value={[contract.parameter1]}
                onSelect={(a, b, values) => {
                  contract.parameter1 = values[0];
                }}
              />
              <BInputNumeric
                context={this.props.context}
                disabled={this.props.disabled}
                maxLength={2}
                floatingLabelText={this.getMessage('DWH', 'RunXthDay')}
                value={contract.parameter2}
                onChange={(o, value) => {
                  contract.parameter2 = value;
                }}
              />
            </BGridRow>
          )}
          {contract.periodDetail == 6 && (
            <BGridRow context={this.props.context} columnCount={3}>
              <BComboBox
                context={this.props.context}
                disabled={this.props.disabled}
                labelText={this.getMessage('DWH', 'MonthOf')}
                dataSource={this.monthList}
                value={[contract.parameter1]}
                onSelect={(a, b, values) => {
                  contract.parameter1 = values[0];
                }}
              />
              <BComboBox
                context={this.props.context}
                disabled={this.props.disabled}
                labelText={this.getMessage('DWH', 'RunXWeek')}
                dataSource={this.weekList}
                value={[contract.parameter2]}
                onSelect={(a, b, values) => {
                  contract.parameter2 = values[0];
                }}
              />
              <BComboBox
                context={this.props.context}
                disabled={this.props.disabled}
                labelText={this.getMessage('DWH', 'RunXDay')}
                dataSource={this.dayList}
                value={[contract.parameter3]}
                onSelect={(a, b, values) => {
                  contract.parameter3 = values[0];
                }}
              />
            </BGridRow>
          )}
        </BGridSection>
      </div>
    );
  }

  render() {
    let contract: TimeScheduleContract = this.state.timeScheduleContract || {};

    let tabItems = [
      { value: 0, text: this.getMessage('DWH', 'Daily'), content: this.getDailyContent(contract) },
      { value: 1, text: this.getMessage('DWH', 'Weekly'), content: this.getWeeklyContent(contract) },
      { value: 2, text: this.getMessage('DWH', 'Monthly'), content: this.getMonthlyContent(contract) },
      { value: 3, text: this.getMessage('DWH', 'Yearly'), content: this.getYearlyContent(contract) }
    ];

    return (
      <div>
        <BGridSection context={this.props.context}>
          <BGridRow context={this.props.context}>
            <BDateTimePicker
              context={this.props.context}
              disabled={this.props.disabled}
              format="DDMMYYYY hmmss"
              floatingLabelTextDate={this.getMessage('DWH', 'BeginDate')}
              floatingLabelTextTime={this.getMessage('DWH', 'BeginDateTime')}
              value={contract.beginDate}
              dateOnChange={(o, val) => (contract.beginDate = val)}
              timeOnChange={(o, val) => (contract.beginDate = val)}
            />
          </BGridRow>
          <BGridRow context={this.props.context} columnCount={2}>
            <BDateTimePicker
              context={this.props.context}
              disabled={this.props.disabled}
              format={'DDMMYYYY'}
              floatingLabelTextDate={this.getMessage('DWH', 'EndDate')}
              value={contract.endDate}
              dateOnChange={(o, val) => (contract.endDate = val)}
            />
          </BGridRow>
        </BGridSection>
        <BTabBar
          context={this.props.context}
          disabled={this.props.disabled}
          style={{ paddingBottom: '20px' }}
          mode={'secondary'}
          tabItems={tabItems}
          value={contract.period}
          onChange={(event, value) => {
            contract.period = value;
            this.resetState();
          }}
        />
      </div>
    );
  }
}
export default ScheduleComponent;
