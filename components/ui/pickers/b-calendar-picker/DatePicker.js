import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqualDateTime,
  getLocalizedDate,
  getLocalizedTime,
} from './dateUtils';
 import DatePickerDialog from './DatePickerDialog';
import { BComponent } from 'b-component';
import { BInput } from 'b-input';

class DatePicker extends BComponent {

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
    yearTitle: PropTypes.node,
    monthTitle: PropTypes.node,
    onChange: PropTypes.func,
    dateOnChange: PropTypes.func,
    onDismiss: PropTypes.func,
    onFocus: PropTypes.func,
    onShow: PropTypes.func,
    onTouchTap: PropTypes.func,
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    textFieldStyle: PropTypes.object,
    hintText: PropTypes.string,
    floatingLabelTextDate: PropTypes.string,
    floatingLabelTextTime: PropTypes.string,
    floatingLabelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintTextDate: PropTypes.string,
    hintTextTime: PropTypes.string,
    datetimeOption: PropTypes.object,
    hintStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    isBusiness: PropTypes.bool,
    calendarInfo: PropTypes.array,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    localization: PropTypes.func,
    disabled: PropTypes.bool,
    dateUpdate:PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    errorTextDate: PropTypes.string,
    errorTextTime: PropTypes.string,
    inlineGridMode:PropTypes.bool,
    prefixText:PropTypes.any,
    suffixText:PropTypes.any,
    datePickerStyle: PropTypes.any
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
    if (this.props.context.deviceSize == BComponent.Sizes.SMALL) return true;
    return false;
  }

  getDate() {
    return this.state.date;
  }

  openDateDialog(event) {
    // var element = ReactDOM.findDOMNode(this.rootDate);
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
      datetimeOption,
      disabled,
      yearTitle,
      monthTitle,
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
          {/* {!this.props.noDialog &&
          <BInput
              context={this.props.context}
              valueConstraint={valueConstraint}
              onFocus={this.handleFocusDateInput.bind(this)}
              value={inputLocalizedDate}
              mask={this.props.formats.dateMask}
              inputAlign={this.props.style.inputAlign}
              ref={r => this.bActionInputDate = r}
              disabled={disabled}
              inputStyle={{cursor:'pointer'}}
              inlineGridMode={this.props.inlineGridMode}
              />
        } */}
          <DatePickerDialog
              // {...this.props} todo: geride kalanlar olmuş olabilir bu kullanım hatalı
              DateTimeFormat={DateTimeFormat}
              noDialog={noDialog}
              autoOk={autoOk}
              anchorElDate={this.state.anchorElDate}
              context={this.props.context}
              container={container}
              containerStyle={containerStyle}
              dialogContentStyle={dialogContentStyle}
              disableYearSelection={disableYearSelection}
              firstDayOfWeek={firstDayOfWeek}
              initialDate={this.state.dialogDate}
              maxDate={maxDate}
              minDate={minDate}
              mode={mode}
              onShow={onShow}
              ref="dateDialogWindow"
              shouldDisableDate={shouldDisableDate}
              inputStyle={inputStyle}
              floatingLabelStyle={floatingLabelStyle}
              isBusiness={isBusiness}
              style={this.props.style}
              calendarInfo={calendarInfo}
              dateFormat={dateFormat}
              localization={localization}
              isMobile={isMobile}
              datetimeOption={datetimeOption}
              monthTitle={monthTitle}
              dateUpdate={this.dateUpdate.bind(this)}
              dialogNewSelectDate={dialogNewSelectDate}
              pageType={this.props.pageType}
              datePickerStyle = {this.props.datePickerStyle}
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

  render() {
    const {
      // timeFormat,
      dateFormat

    } = this.props;
    const isRtl = this.props.context.localization.isRightToLeft;

    return (
      <div>{
      !isRtl &&
        <div style={{
          display:'flex',
          alignItems:'baseline',
          // height:60
        }}>
          {
            dateFormat &&
            this.renderDate()
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
