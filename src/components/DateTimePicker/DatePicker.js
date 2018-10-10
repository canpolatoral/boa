import React from 'react';
import PropTypes from 'prop-types';
import { ComponentBase, Sizes } from 'b-component';
import { Input } from 'b-input';
import {
  isEqualDateTime,
  getLocalizedDate,
  getLocalizedTime,
} from './dateUtils';
import DatePickerDialog from './DatePickerDialog';
import TimePickerDialog from './TimePickerDialog';


class DatePicker extends ComponentBase {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    DateTimeFormat: PropTypes.func,
    autoOk: PropTypes.bool,
    className: PropTypes.string,
    container: PropTypes.oneOf(['dialog', 'inline']),
    defaultDate: PropTypes.object,
    dialogContentStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    formatDate: PropTypes.func,
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
      PropTypes.object,
      PropTypes.instanceOf(Date),
    ]),
    dialogNewSelectDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    cancelLabel: PropTypes.node,
    todayLabel: PropTypes.node,
    yearTitle: PropTypes.node,
    monthTitle: PropTypes.node,
    hourTitle: PropTypes.node,
    minuteTitle: PropTypes.node,
    secondTitle: PropTypes.node,
    onChange: PropTypes.func,
    dateOnChange: PropTypes.func,
    timeOnChange: PropTypes.func,
    onDismiss: PropTypes.func,
    onFocus: PropTypes.func,
    onShow: PropTypes.func,
    onTouchTap: PropTypes.func,
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    textFieldStyle: PropTypes.object,
    hintText: PropTypes.string,
    leftIconList: PropTypes.array,
    rightIconList: PropTypes.array,
    floatingLabelTextDate: PropTypes.string,
    floatingLabelTextTime: PropTypes.string,
    floatingLabelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintTextDate: PropTypes.string,
    hintTextTime: PropTypes.string,
    datetimeOption: PropTypes.object,
    maxHour: PropTypes.number,
    minHour: PropTypes.number,
    maxMinute: PropTypes.number,
    minMinute: PropTypes.number,
    maxSecond: PropTypes.number,
    minSecond: PropTypes.number,
    iconStyle: PropTypes.object,
    hintStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    isBusiness: PropTypes.bool,
    calendarInfo: PropTypes.array,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    localization: PropTypes.func,
    canSelectOldDates: PropTypes.bool,
    canSelectWeekendDays: PropTypes.bool,
    canSelectSpecialDays: PropTypes.bool,
    disabled: PropTypes.bool,
    dateUpdate:PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    errorTextDate: PropTypes.string,
    errorTextTime: PropTypes.string,
    inlineGridMode:PropTypes.bool,
    prefixText:PropTypes.any,
    suffixText:PropTypes.any
  };

  static defaultProps = {
    autoOk: false,
    container: 'inline',
    disableYearSelection: false,
    firstDayOfWeek: 1,
    style: {},
    inlineGridMode:false
  };

  componentWillMount() {
    super.componentWillMount();
    const lastValue = this.props.value || this.props.defaultDate;
    this.setState({
      date: lastValue,
      dialogDate: lastValue,
    });
  }

  componentWillReceiveProps(nextProps) {
    const newDate = this.getControlledDate(nextProps);
    if (!isEqualDateTime(this.state.date, newDate)) {
      this.setState({
        date: newDate,
      });
    }
  }

  isMobile() {
    if (this.props.context.deviceSize == Sizes.SMALL) return true;
    return false;
  }

  getDate() {
    return this.state.date;
  }

  openDateDialog(event) {
    var element=event.currentTarget;
    if (this.getDate() !== undefined) {
      this.setState({
        dialogDate: this.getDate(),
        anchorElDate: element,
      }, this.refs.dateDialogWindow.show);
    } else {
      this.setState({
        dialogDate: null,
        anchorElDate: element,
      }, this.refs.dateDialogWindow.show);
    }
  }

  openTimeDialog(event) {

    if (this.getDate() !== undefined) {

      this.setState({
        dialogDate: this.getDate(),
        anchorElTime: event.currentTarget,
      }, this.refs.timeDialogWindow.show);
    } else {
      this.setState({
        dialogDate: null,
        anchorElTime: event.currentTarget,
      }, this.refs.timeDialogWindow.show);
    }
  }

  handleDateAccept(date) {
    if (date && this.state.date) {
      var newDate = new Date(date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        this.props.timeFormat ? this.state.date.getHours() : 0,
        this.props.timeFormat ? this.state.date.getMinutes() : 0,
        this.props.timeFormat ? this.state.date.getSeconds() : 0);
      date = newDate;
    }

    if (this.props.dateOnChange) {
      this.props.dateOnChange(null, date);
    }
  }

  handleTimeAccept(date) {
    if (date && this.state.date) {
      var newDate = new Date(this.state.date.getFullYear(),
        this.state.date.getMonth(),
        this.state.date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds());
      date = newDate;
    }
    // this.setTimeValue(date);
    if (this.props.timeOnChange) {
      this.props.timeOnChange(null, date);
    }
  }

  handleFocus(event) {
    event.target.onFocus();

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  isControlled() {
    return this.props.hasOwnProperty('value');
  }

  getControlledDate(props = this.props) {
    if (props.value instanceof Date) {
      return props.value;
    }
  }

  handleFocusDateInput(event) {
    event.preventDefault();
    this.openDateDialog(event);

  }

  handleFocusTimeInput(event) {
    this.openTimeDialog(event);
    event.preventDefault();
  }

  dateUpdate(oldDate, newDate, changeType) {
    if (this.props.dateUpdate) {
      this.props.dateUpdate(oldDate, newDate, changeType);
    }
  }

  validateConstraint() {
    const {dateFormat, timeFormat} = this.props;

    const dateResult = dateFormat ? (this.bActionInputDate.getInstance() ? this.bActionInputDate.getInstance().validateConstraint() : true) :true;
    if (!dateResult) {
      return dateResult;
    }
    const timeResult = timeFormat ? (this.bActionInputTime ? this.bActionInputTime.getInstance().validateConstraint() : true) :true;
    return dateResult && timeResult;
  }

  renderDate() {
    const {
      valueConstraint,
      DateTimeFormat,
      autoOk,
      cancelLabel,
      container,
      defaultDate, // eslint-disable-line no-unused-vars
      containerStyle,
      dialogContentStyle,
      disableYearSelection,
      firstDayOfWeek,
      maxDate,
      minDate,
      dateFormat,
      timeFormat,
      mode,
      okLabel,
      onDismiss,
      onFocus, // eslint-disable-line no-unused-vars
      onShow,
      onTouchTap, // eslint-disable-line no-unused-vars
      shouldDisableDate,
      localization,
      floatingLabelStyle,
      inputStyle,
      canSelectOldDates,
      canSelectWeekendDays,
      canSelectSpecialDays,
      datetimeOption,
      disabled,
      yearTitle,
      monthTitle,
      todayLabel,
      isBusiness,
      calendarInfo,
      floatingLabelTextDate,
      dialogNewSelectDate,
      hintTextDate,
      errorTextDate,
      noDialog
    } = this.props;

    let cloneSuffixText=this.props.suffixText;

    if (this.props.pageType!='browse' &&  this.props.suffixText) {
      cloneSuffixText = React.cloneElement(
        this.props.suffixText, { onClick: this.handleFocusDateInput.bind(this) }
      );
    }

    let inputLocalizedDate = getLocalizedDate(this.state.date, dateFormat, localization);
    // inputLocalizedDate=inputLocalizedDate== '' ?undefined:inputLocalizedDate;
    let isMobile= this.isMobile();
    if (dateFormat) {
      return (
        <div
        style={{
          width: timeFormat ?  '65%' : '100%',
        }}
        ref={r => this.rootDate = r}
        >
          {!this.props.noDialog &&
          <Input
              context={this.props.context}
              valueConstraint={valueConstraint}
              hintText={hintTextDate}
              floatingLabelText={floatingLabelTextDate}
              onFocus={this.handleFocusDateInput.bind(this)}
              value={inputLocalizedDate}
              mask={this.props.formats.dateMask}
              prefixText={this.props.prefixText}
              suffixText={cloneSuffixText}
              inputAlign={this.props.style.inputAlign}
              ref={r => this.bActionInputDate = r}
              disabled={disabled}
              errorText={errorTextDate}
              inputStyle={{cursor:'pointer'}}
              inlineGridMode={this.props.inlineGridMode}
              />
        }
          <DatePickerDialog
              // {...this.props} todo: geride kalanlar olmuş olabilir bu kullanım hatalı
              DateTimeFormat={DateTimeFormat}
              noDialog={noDialog}
              autoOk={autoOk}
              anchorElDate={this.state.anchorElDate}
              context={this.props.context}
              cancelLabel={cancelLabel}
              container={container}
              containerStyle={containerStyle}
              dialogContentStyle={dialogContentStyle}
              disableYearSelection={disableYearSelection}
              firstDayOfWeek={firstDayOfWeek}
              initialDate={this.state.dialogDate}
              maxDate={maxDate}
              minDate={minDate}
              mode={mode}
              okLabel={okLabel}
              onAccept={this.handleDateAccept.bind(this)}
              onShow={onShow}
              onDismiss={onDismiss}
              ref="dateDialogWindow"
              shouldDisableDate={shouldDisableDate}
              inputStyle={inputStyle}
              floatingLabelStyle={floatingLabelStyle}
              isBusiness={isBusiness}
              style={this.props.style}
              calendarInfo={calendarInfo}
              dateFormat={dateFormat}
              timeFormat={timeFormat}
              localization={localization}
              canSelectOldDates={canSelectOldDates}
              canSelectWeekendDays={canSelectWeekendDays}
              canSelectSpecialDays={canSelectSpecialDays}
              isMobile={isMobile}
              datetimeOption={datetimeOption}
              yearTitle={yearTitle}
              todayLabel={todayLabel}
              monthTitle={monthTitle}
              dateUpdate={this.dateUpdate.bind(this)}
              dialogNewSelectDate={dialogNewSelectDate}
              pageType={this.props.pageType}
              />
        </div>
      );
    }
    else {
      return (
        <div></div>
      );
    }
  }

  renderTime() {
    const {
      valueConstraint,
      DateTimeFormat,
      cancelLabel,
      container,
      defaultDate, // eslint-disable-line no-unused-vars
      containerStyle,
      dialogContentStyle,
      dateFormat,
      timeFormat,
      mode,
      okLabel,
      onDismiss,
      onFocus, // eslint-disable-line no-unused-vars
      onShow,
      onTouchTap, // eslint-disable-line no-unused-vars
      localization,
      floatingLabelStyle,
      inputStyle,
      datetimeOption,
      disabled,
      maxHour,
      minHour,
      maxMinute,
      minMinute,
      maxSecond,
      minSecond,
      hourTitle,
      minuteTitle,
      secondTitle,
      errorTextTime,
      // ...other
    } = this.props;

    let inputLocalizedTime = getLocalizedTime(this.state.date, datetimeOption, timeFormat, localization);
    let isMobile= this.isMobile();
    if (timeFormat) {
      return (
        <div style={{
          width: '35%',
          paddingLeft:24
        }}>

          {!this.props.noDialog &&
          <Input
              context={this.props.context}
              valueConstraint={valueConstraint}
              hintText={this.props.hintTextTime}
              floatingLabelText={this.props.floatingLabelTextTime}
              onFocus={this.handleFocusTimeInput.bind(this)}
              value={inputLocalizedTime}
              ref={r => this.bActionInputTime = r}
              inputStyle={inputStyle}
              floatingLabelStyle={floatingLabelStyle}
              leftIconList={null}
              rightIconList={null}
              disabled={disabled}
              errorText={errorTextTime}
              prefixText={null}
              suffixText={null}
              />
        }
          <TimePickerDialog
              DateTimeFormat={DateTimeFormat}
              context={this.props.context}
              cancelLabel={cancelLabel}
              container={container}
              containerStyle={containerStyle}
              dialogContentStyle={dialogContentStyle}
              initialDate={this.state.dialogDate}
              mode={mode}
              anchorEl={this.state.anchorElTime}
              okLabel={okLabel}
              onAccept={this.handleTimeAccept.bind(this)}
              onShow={onShow}
              onDismiss={onDismiss}
              ref="timeDialogWindow"
              maxHour={maxHour}
              minHour={minHour}
              maxMinute={maxMinute}
              minMinute={minMinute}
              maxSecond={maxSecond}
              minSecond={minSecond}
              datetimeOption={datetimeOption}
              inputStyle={inputStyle}
              floatingLabelStyle={floatingLabelStyle}
              style={this.props.style}
              dateFormat={dateFormat}
              timeFormat={timeFormat}
              localization={localization}
              isMobile={isMobile}
              hourTitle={hourTitle}
              minuteTitle={minuteTitle}
              secondTitle={secondTitle}
              />
        </div>);
    }
    else {
      return (
        <div></div>
      );
    }

  }

  render() {
    const {
      timeFormat,
      dateFormat,

    } = this.props;
    const isRtl = this.props.context.localization.isRightToLeft;

    return (
      <div>{
      !isRtl &&
        <div style={{
          display:'flex'

          // height:60
        }}>
          {
            dateFormat &&
            this.renderDate()
          }
          {
            timeFormat &&
            this.renderTime()
          }
        </div>
        }
        {
        isRtl &&
        <div style={{
          display:'flex',
          // height:60,
          alignItems:'baseline'
        }}>
          {
            timeFormat &&
            this.renderTime()
          }
          {
            dateFormat &&
            this.renderDate()
          }
        </div>
      }
      </div>
    );
  }
}

export default DatePicker;
