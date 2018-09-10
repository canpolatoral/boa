import React from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { BBusinessComponent } from 'b-business-component';
import { BDateTimePicker } from 'b-datetime-picker';
var Format = BDateTimePicker.Format;


export class BBusinessDateTimeComponent extends BBusinessComponent {

  static defaultProps = {
    ...BDateTimePicker.defaultProps,
    minDate: new Date(1950, 0, 1),
    maxDate: new Date(2045, 11, 30),
    format: Format.LD,
    mode: 'portrait',
    defaultValue: null,
    canSelectOldDates: false,
    canSelectWeekendDays: false,
    canSelectSpecialDays: false,
    disabled: false,
    pageType: 'browse'
  }

  static propTypes = {
    ...BDateTimePicker.propTypes,
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    canSelectOldDates: PropTypes.bool,
    canSelectWeekendDays: PropTypes.bool,
    canSelectSpecialDays: PropTypes.bool,
    disabled: PropTypes.bool,
    mode: PropTypes.string,
    onChange: PropTypes.func,
    dateOnChange: PropTypes.func,
    timeOnChange: PropTypes.func,
    errorTextDate: PropTypes.string,
    errorTextTime: PropTypes.string,
    floatingLabelTextDate: PropTypes.string,
    floatingLabelTextTime: PropTypes.string,
    hintTextDate: PropTypes.string,
    hintTextTime: PropTypes.string,
    cancelLabel: PropTypes.string,
    okLabel: PropTypes.string,
    format: PropTypes.string,
  };

  state = {
    selectedValues: [],
  }
  static calendarInfo = [];
  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.timeOnChange = this.timeOnChange.bind(this);

    let selectedDate = this.getDateToString(props.value, props.defaultValue);
    let minDate = this.getDateToString(props.minDate, Date(1950, 0, 1));
    let maxDate = this.getDateToString(props.maxDate, new Date(2099, 11, 30));

    this.state = {
      value: selectedDate,
      format: props.format,
      minDate: minDate,
      maxDate: maxDate,
      canSelectOldDates: props.canSelectOldDates,
      canSelectWeekendDays: props.canSelectWeekendDays,
      canSelectSpecialDays: props.canSelectSpecialDays,
      disabled: props.disabled,
      mode: props.mode,
    };
  }
  isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
  }
  getDateToString(propDate, defaultDate) {
    let returnDate = defaultDate;
    if (this.isString(propDate)) {
      returnDate = new Date(propDate);
      if (isNaN(returnDate)) {
        returnDate = defaultDate;
      }
    }
    else if (propDate) {
      returnDate = propDate;
    }
    return returnDate;
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.format !== this.props.format) ||
      (nextProps.canSelectOldDates !== this.props.canSelectOldDates) ||
      (nextProps.canSelectWeekendDays !== this.props.canSelectWeekendDays) ||
      (nextProps.canSelectSpecialDays !== this.props.canSelectSpecialDays) ||
      (nextProps.disabled !== this.props.disabled) ||
      !this.isEqualDateTime(nextProps.value, this.props.value) ||
      !this.isEqualDateTime(this.props.minDate, nextProps.minDate) ||
      !this.isEqualDateTime(this.props.maxDate, nextProps.maxDate) ||
      (nextProps.mode !== this.props.mode)
    ) {
      let date = this.getDateToString(nextProps.value, new Date());
      let minDate = this.getDateToString(nextProps.minDate, this.props.minDate);
      let maxDate = this.getDateToString(nextProps.maxDate, this.props.maxDate);
      this.setState({
        value: date,
        format: nextProps.format,
        canSelectOldDates: nextProps.canSelectOldDates,
        canSelectWeekendDays: nextProps.canSelectWeekendDays,
        canSelectSpecialDays: nextProps.canSelectSpecialDays,
        disabled: nextProps.disabled,
        mode: nextProps.mode,
        minDate: minDate,
        maxDate: maxDate,
      });
    }
  }
  onChange(event, value) {
    if (this.props.onChange) {
      this.props.onChange(event, value);
    }
  }
  dateOnChange(event, value) {
    this.setState({ value: value }, () => {
      if (this.props.dateOnChange) {
        this.props.dateOnChange(event, this.getValue());
      }
    });

  }
  timeOnChange(event, value) {
    this.setState({ value: value }, () => {
      if (this.props.timeOnChange) {
        this.props.timeOnChange(event, this.getValue());
      }
    });

  }

  clearTime(returnDate) {
    returnDate.setHours(0);
    returnDate.setMinutes(0);
    returnDate.setSeconds(0);

    return returnDate;
  }

  clearTimeZone(returnDate) {
    return new Date((returnDate).getTime() - ((returnDate).getTimezoneOffset() * 60000));
  }

  getValue() {

    if (this.state.value) {
      // TODO: timezone farkı kaldırılması gerekiyor.
      // return  new Date((this.state.value).getTime());

      var returnDate = this.state.value;
      this.clearTime(returnDate);

      return this.clearTimeZone(returnDate);
    }
    return this.state.value;
  }
  resetValue() {
    this.setState({
      value: this.props.defaultValue
    });
  }
  getSnapshot() {
    return {
      state: this.state,
      calendarInfo: BBusinessDateTimeComponent.calendarInfo
    };
  }
  setSnapshot(snapshot) {
    let { state, calendarInfo } = snapshot;
    this.setState({ ...state });
    BBusinessDateTimeComponent.calendarInfo = calendarInfo;
  }
  getFormat() {
    return Format;
  }
  isEqualDateTime(d1, d2) {
    if (isString(d1)) {
      d1 = new Date(d1);
    }
    if (isString(d2)) {
      d2 = new Date(d2);
    }
    return d1 && d2 &&
      (d1.getFullYear() === d2.getFullYear()) &&
      (d1.getMonth() === d2.getMonth()) &&
      (d1.getDate() === d2.getDate()) &&
      (d1.getHours() === d2.getHours()) &&
      (d1.getMinutes() === d2.getMinutes()) &&
      (d1.getSeconds() === d2.getSeconds());
  }
  getCalendarInfo() {

    let promise = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.CalendarRequest',
      requestBody: {
        StartDate: this.props.minDate,
        EndDate: this.props.maxDate,
        CountryCode: 1,
        FecId: '1',
        DoNotUseCache: true,
        MethodName: 'GetCountryDateInfo'
      },
      key: 'getCalendarInfo'
    };
    this.proxyExecute(promise);
    return;

    // promise.then((result) => {
    //   if (!this.unMounted) {
    //     if (result.value) {
    //       BBusinessDateTimeComponent.calendarInfo = result.value;
    //     }
    //   }
    //   component.debugLog('GetCountryDateInfo:');
    //   component.debugLog(result);
    // },
    //   (error) => {
    //     component.debugLog('error: GetCountryDateInfo method not found: ' + error, 3);
    //   });  
  }
  // componentDidMount() {
  //   if ( BBusinessDateTimeComponent.calendarInfo === undefined || !(BBusinessDateTimeComponent.calendarInfo.length > 0) ) {
  //     this.getCalendarInfo();
  //   }
  // }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'getCalendarInfo': {
        if (!this.unMounted) {
          BBusinessDateTimeComponent.calendarInfo = response.value;
          this.setState({ isRendered: !this.state.isRendered });
        } 
        break;
      }
      default:
        break;
    }
  }
  componentDidMount() {
    super.componentDidMount();
    if (BBusinessDateTimeComponent.calendarInfo === undefined || !(BBusinessDateTimeComponent.calendarInfo.length > 0)) {
      this.getCalendarInfo();
    }
  }

  render() {

    return (
      <BDateTimePicker
        {...this.props}
        value={this.state.value}
        format={this.state.format}
        isBusiness={true}
        calendarInfo={BBusinessDateTimeComponent.calendarInfo}
        canSelectOldDates={this.state.canSelectOldDates}
        canSelectWeekendDays={this.state.canSelectWeekendDays}
        canSelectSpecialDays={this.state.canSelectSpecialDays}
        disabled={this.state.disabled}
        minDate={this.state.minDate}
        maxDate={this.state.maxDate}
        onChange={this.onChange}
        dateOnChange={this.dateOnChange}
        timeOnChange={this.timeOnChange}
      />
    );
  }
}
BBusinessDateTimeComponent.Format = Format;
export default BBusinessDateTimeComponent;
