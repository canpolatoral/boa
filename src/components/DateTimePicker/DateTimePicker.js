import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from './DatePicker';
import { Localization } from '@boa/utils';
import {
  getFormatDecomposition,
  receiveFormat,
  momentFormat,
  isEqualDateTime,
  isEqualDate,
  substructDay,
  cloneDate,
  getDatePickerStyle
} from './dateUtils';

import { ComponentBase } from '@boa/base';
import { ComponentComposer } from '@boa/base';
import { IconButton } from '@boa/components/IconButton';
let maxHour, maxMinute, maxSecond, minHour, minMinute, minSecond;

/**
 * BDateTimePicker
 */
@ComponentComposer
class DateTimePicker extends ComponentBase {

  static propTypes = {
    ...ComponentBase.propTypes,
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
    onChange: PropTypes.func,
    dateOnChange: PropTypes.func,
    timeOnChange: PropTypes.func,
    hintTextDate: PropTypes.string,
    hintTextTime: PropTypes.string,
    floatingLabelTextDate: PropTypes.string,
    floatingLabelTextTime: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    cancelLabel: PropTypes.string,
    okLabel: PropTypes.string,
    isBusiness: PropTypes.bool,
    format: PropTypes.string,
    canSelectOldDates: PropTypes.bool,
    canSelectWeekendDays: PropTypes.bool,
    canSelectSpecialDays: PropTypes.bool,
    errorTextDate: PropTypes.string,
    errorTextTime: PropTypes.string,
    pageType: PropTypes.oneOf(['browse', 'transactional']),
    inlineGridMode: PropTypes.bool,
    noDialog: PropTypes.bool,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    firstDayOfWeek: 1,
    mode: 'portrait',
    hintTextDate: '',
    hintTextTime: '',
    floatingLabelTextDate: '',
    floatingLabelTextTime: '',
    fullWidth: true,
    defaultValue: null,
    isBusiness: false,
    format: 'DDMMYYYY hmmss',
    canSelectOldDates: true,
    canSelectWeekendDays: false,
    canSelectSpecialDays: false,
    pageType: 'browse',
    inlineGridMode: false,
    noDialog: false,
    minDate: new Date(1950, 0, 1, 1, 3, 5),
    maxDate: new Date(2099, 11, 30, 20, 3, 14),
  };

  formats = getFormatDecomposition(this.props.format);

  state = {
    formats: this.formats,
    dateFormat: this.formats.dateFormat,
    timeFormat: this.formats.timeFormat,
    localization: Localization,
    value: this.getDateToString(this.props.value ? this.props.value : this.getDefaultDate(this.props), this.getDefaultDate(this.props)),
    autoOk: false,
    disableYearSelection: false,
    datetimeOption: {
      isHour: (this.formats.timeFormat === undefined) ? false : true,
      isMinute: (this.formats.timeFormat === undefined) ? false : true,
      isSecond: (this.formats.timeFormat === undefined || this.formats.timeFormat === momentFormat.hourAndMinute) ? false : true,
    },
    yearTitle: this.getMessage('BOA', 'Year'),
    monthTitle: this.getMessage('BOA', 'Month'),
    hourTitle: this.getMessage('BOA', 'Hour'),
    minuteTitle: this.getMessage('BOA', 'Minute'),
    secondTitle: this.getMessage('BOA', 'Second'),
    todayLabel: this.getMessage('BOA', 'Today'),
    okLabel: (this.props.okLabel) ? this.props.okLabel : this.getMessage('BOA', 'Ok'),
    cancelLabel: (this.props.cancelLabel) ? this.props.cancelLabel : this.getMessage('BOA', 'Cancel'),
    mode: this.props.mode,
    container: 'inline',
    canSelectOldDates: this.props.canSelectOldDates,
    canSelectWeekendDays: this.props.canSelectWeekendDays,
    canSelectSpecialDays: this.props.canSelectSpecialDays,
    disabled: this.props.disabled,
    minDate: this.getDateToString(this.props.minDate, Date(1950, 0, 1)),
    maxDate: this.getDateToString(this.props.maxDate, new Date(2099, 11, 30)),
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.dateOnChange = this.dateOnChange.bind(this);
    this.timeOnChange = this.timeOnChange.bind(this);
  }

  isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
  }

  getDefaultDate(props) {
    let defaultDate = undefined;
    if (props.defaultValue != undefined) {
      defaultDate = props.defaultValue;
    }
    else if (props.pageType == 'browse') {
      // defaultDate=new Date();
    }
    return defaultDate;

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
    if (propDate === null || propDate === undefined) {
      return null;
    }
    return returnDate;
  }

  onChange(event, value) {
    if (this.props.onChange) {
      this.props.onChange(event, value);
    }
    this.props.onDynamicChange && this.props.onDynamicChange(event);
  }

  /* eslint-disable no-unused-vars */
  dateOnChange(event, value, addTimezoneOffset = true) {
    this.setState({ value: value }, () => {
      if (this.props.dateOnChange) {
        this.props.dateOnChange(event, this.getValue());
      }
      this.onChange(event, this.getValue());
    });


  }

  timeOnChange(event, value) {
    this.setState({ value: value }, () => {
      if (this.props.timeOnChange) {
        this.props.timeOnChange(event, this.getValue());
      }
      this.onChange(event, this.getValue());
    });

  }

  handleRemoveDate = (e) => {
    let handleDate;
    if (this.getValue()) {
      handleDate = new Date(this.getValue());
      handleDate.setDate(handleDate.getDate() - 1);
      this.dateOnChange(e, handleDate, false);
    }
    else {
      handleDate = new Date();
      handleDate.setDate(handleDate.getDate() - 1);
      handleDate = this.clearTime(handleDate);
      handleDate = this.clearJustTimeZone(handleDate);
      this.dateOnChange(e, handleDate, true);
    }
  }

  handleAddDate = (e) => {
    let handleDate;
    if (this.getValue()) {
      handleDate = new Date(this.getValue());
      handleDate.setDate(handleDate.getDate() + 1);
      this.dateOnChange(e, handleDate, false);
    }
    else {
      handleDate = new Date();
      handleDate.setDate(handleDate.getDate() + 1);
      handleDate = this.clearTime(handleDate);
      handleDate = this.clearJustTimeZone(handleDate);
      this.dateOnChange(e, handleDate, true);
    }

  }

  dateUpdate(oldDate, newDate, changeType, isSetState) {
    isSetState = true;
    let setNewDate = cloneDate(newDate);
    let dateNow = new Date();
    let day = setNewDate.getDate();
    let addValue = -1;
    if (changeType === 1) {
      addValue = 1;
    }
    else if (changeType === 2) {
      addValue = -1;
    }
    if (this.props.isBusiness && this.props.calendarInfo && this.props.calendarInfo.length > 0) {
      let calendarInfo = this.props.calendarInfo;

      for (let i = 0; i < calendarInfo.length; i++) {
        if (isEqualDate(calendarInfo[i].day, newDate)) {
          if (!this.props.canSelectWeekendDays && calendarInfo[i].dayType === 1) {
            setNewDate.setDate(day + addValue);
            this.dateUpdate(oldDate, setNewDate, changeType, true);
            isSetState = false;
          }
          else if (!this.props.canSelectSpecialDays && calendarInfo[i].dayType === 2) {
            setNewDate.setDate(day + addValue);
            this.dateUpdate(oldDate, setNewDate, changeType, true);
            isSetState = false;
          }
          else if (!this.props.canSelectSpecialDays && calendarInfo[i].dayType === 3) {
            setNewDate.setDate(day + addValue);
            this.dateUpdate(oldDate, setNewDate, changeType, true);
            isSetState = false;
          }
          else if (!this.props.canSelectSpecialDays && calendarInfo[i].dayType === 4) {
            setNewDate.setDate(day + addValue);
            this.dateUpdate(oldDate, setNewDate, changeType, true);
            isSetState = false;
          }
        }
      }
    }
    let subDay = substructDay(dateNow, setNewDate);
    if (!this.props.canSelectOldDates && subDay < 0) {
      setNewDate.setDate(day + 1);
      this.dateUpdate(oldDate, setNewDate, changeType, true);
      isSetState = false;
    }
    if (isSetState) {
      this.setState({ dialogNewSelectDate: setNewDate });
    }
    if (this.props.dateUpdate) {
      this.props.dateUpdate(oldDate, newDate, changeType);
    }
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

  clearJustTimeZone(returnDate) {
    return new Date((returnDate).getTime());
  }
  getValue() {
    if (this.state.value) {
      // TODO: timezone farkı kaldırılması gerekiyor.
      // return  new Date((this.state.value).getTime());

      let formats = getFormatDecomposition(this.props.format);
      var returnDate = this.state.value;
      if (formats.timeFormat === undefined) { // sadece tarih gösterilecek ise saat bilgileri temizleniyor.
        this.clearTime(returnDate);
        return returnDate;
      }
      return this.clearTimeZone(returnDate);
    }
    return this.state.value;
  }

  resetValue() {
    this.setState({
      value: this.getDefaultDate(this.props)
    });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  getFormat() {
    return receiveFormat;
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.format !== this.props.format) ||
      (nextProps.canSelectOldDates !== this.props.canSelectOldDates) ||
      (nextProps.canSelectWeekendDays !== this.props.canSelectWeekendDays) ||
      (nextProps.canSelectSpecialDays !== this.props.canSelectSpecialDays) ||
      (nextProps.disabled !== this.props.disabled) ||
      !isEqualDateTime(nextProps.value, this.props.value) ||
      !isEqualDateTime(this.props.minDate, nextProps.minDate) ||
      !isEqualDateTime(this.props.maxDate, nextProps.maxDate) ||
      (nextProps.mode !== this.props.mode)
    ) {
      let date = this.getDateToString(nextProps.value, new Date());
      let minDate = this.getDateToString(nextProps.minDate, this.props.minDate);
      let maxDate = this.getDateToString(nextProps.maxDate, this.props.maxDate);
      let formats = getFormatDecomposition(nextProps.format);
      let datetimeOption = {
        isHour: (formats.timeFormat === undefined) ? false : true,
        isMinute: (formats.timeFormat === undefined) ? false : true,
        isSecond: (formats.timeFormat === undefined || formats.timeFormat === momentFormat.hourAndMinute) ? false : true,
      };

      this.setState({
        value: date,
        formats: formats,
        dateFormat: formats.dateFormat,
        timeFormat: formats.timeFormat,
        canSelectOldDates: nextProps.canSelectOldDates,
        canSelectWeekendDays: nextProps.canSelectWeekendDays,
        canSelectSpecialDays: nextProps.canSelectSpecialDays,
        disabled: nextProps.disabled,
        datetimeOption: datetimeOption,
        mode: nextProps.mode,
        minDate: minDate,
        maxDate: maxDate
      });
    }
  }

  validateConstraint() {
    return this.picker ? this.picker.validateConstraint() : true;
  }

  render() {
    maxHour = 23;
    maxMinute = 59;
    maxSecond = 59;
    minHour = 0;
    minMinute = 0;
    minSecond = 0;

    const datePicker = getDatePickerStyle(this.props.context);

    let dialogContentStyle = {
      minWidth: this.state.mode === 'landscape' ? 479 : 300,
    };
    let containerStyle = {
      minHeight: this.state.mode === 'landscape' ? 330 : 370,
      minWidth: this.state.mode === 'landscape' ? 479 : 300,
    };
    const isRtl = this.props.context.localization.isRightToLeft;
    let datePaddingLeft = 0;
    let timePaddingLeft = 0;
    if (isRtl) {
      datePaddingLeft = 24;
    }
    else {
      timePaddingLeft = 24;
    }

    let baseContainerIconStyle = {
      width: 16,
      height: 16,
      marginTop: 5
    };

    let style = {
      dateTimePickerContainer: {
        display: datePicker.equalWidthContainerDisplay,
        flexWrap: 'wrap',
        alignItems: 'baseline'
      },
      dateSection: {
        flex: '2 1',
        paddingLeft: datePaddingLeft,
      },
      timeSection: {
        flex: datePicker.equalWidthItemFlex,
        paddingLeft: timePaddingLeft,
      },
      datetimeListTitle: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        background: datePicker.datetimeBaseTitleBackgroundColor,
        color: datePicker.datetimeBaseTitleColor,
        fontSize: datePicker.datetimeBaseTitleFontSize,
        height: 24,
        borderTop: '1px solid ' + datePicker.datetimeBaseTitleBorderColor,
      },
      datetimeListContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        overflow: 'hidden',
        borderRight: this.props.context.theme.boaPalette.base200,
        borderRightStyle: 'solid',
        borderRightWidth: isRtl ? 0 : 1,

        borderLeft: this.props.context.theme.boaPalette.base200,
        borderLeftStyle: 'solid',
        borderLeftWidth: isRtl ? 1 : 0,

        borderBottom: '1px solid ' + this.props.context.theme.boaPalette.base200,

      },
      datetimeItemSpan: {
        marginTop: 'auto',
        marginBottom: 'auto',
      },
      datetimeContainer: {
        display: datePicker.equalWidthContainerDisplay,
        flexWrap: datePicker.equalWidthContainerFlexWrap,
      },
      datetimeItem: {
        flex: datePicker.equalWidthItemFlex,
      },
      inputContainer: {
        display: datePicker.equalWidthContainerDisplay,
        flexWrap: datePicker.equalWidthContainerFlexWrap,
      },
      inputDateItem: {
        flex: '2 1',
        marginBottom: -2,
        marginTop: 9
      },
      inputTimeItem: {
        flex: datePicker.equalWidthItemFlex,
      },
      todayButton: {
        fontWeight: 'bold',
        fontSize: 13,
      },
      transitionSlide: {
        minHeight: 252,
        margin: -7
        /* position: 'relative',*/
      },
      transitionChildSlide: {
        /* position: 'relative',*/
      },
      anchorOrigin: {
        horizontal: 'middle',
        vertical: 'bottom'
      },
      targetOrigin: {
        horizontal: 'middle',
        vertical: 'top',
      },
      baseContainerIconStyle: baseContainerIconStyle,

      inputAlign: this.props.pageType == 'browse' ? 'center' : null,

    };

    let iconStyle = {
      color: this.props.context.theme.boaPalette.pri500,
      width: 16,
      height: 16,
    };

    let suffix = (
      <IconButton
        iconProperties={{ style: iconStyle }}
        context={this.props.context}
        dynamicIcon='AddCircleOutline'
        style={{

          width: 16,
          height: 16,
          marginTop: 7
        }}
        onClick={this.handleAddDate.bind(this)}
        disabled={this.state.disabled}
      />
    );


    let prefix = (
      <IconButton
        iconProperties={{ style: iconStyle }}
        context={this.props.context}
        dynamicIcon='RemoveCircleOutline'
        style={{
          width: 16,
          height: 16,
          marginTop: 7
        }}
        onClick={this.handleRemoveDate.bind(this)}
        disabled={this.state.disabled}
      />
    );

    if (this.props.pageType != 'browse') {
      prefix = null;
      suffix = (
        <IconButton
          iconProperties={{
            style: {
              color: this.props.context.theme.boaPalette.base400,
              width: 24,
              height: 24,
            }
          }}
          context={this.props.context}
          dynamicIcon='ArrowDropDown'
          style={{

            width: 24,
            height: 24,
            marginTop: 7
          }}
          // onClick={this.handleAddDate.bind(this)} todo: open popover
          disabled={this.state.disabled}
        />
      );
    }


    return (
      <div>
        <DatePicker
          ref={r => this.picker = r}
          suffixText={suffix}
          prefixText={prefix}
          context={this.props.context}
          valueConstraint={this.props.valueConstraint}
          onChange={this.onChange}
          dateOnChange={this.dateOnChange}
          timeOnChange={this.timeOnChange}
          autoOk={this.state.autoOk}
          floatingLabelTextDate={this.props.floatingLabelTextDate}
          floatingLabelTextTime={this.props.floatingLabelTextTime}
          value={this.state.value}
          disableYearSelection={this.state.disableYearSelection}
          hintTextDate={this.props.hintTextDate}
          hintTextTime={this.props.hintTextTime}
          mode={this.state.mode}
          container={this.state.container}
          errorTextDate={this.props.errorTextDate}
          errorTextTime={this.props.errorTextTime}
          firstDayOfWeek={this.props.firstDayOfWeek}
          okLabel={this.state.okLabel}
          cancelLabel={this.state.cancelLabel}
          todayLabel={this.state.todayLabel}
          yearTitle={this.state.yearTitle}
          monthTitle={this.state.monthTitle}
          hourTitle={this.state.hourTitle}
          minuteTitle={this.state.minuteTitle}
          secondTitle={this.state.secondTitle}
          formatDate={this.props.formatDate}
          fullWidth={this.props.fullWidth}
          datetimeOption={this.state.datetimeOption}
          maxDate={this.state.maxDate}
          minDate={this.state.minDate}
          maxHour={maxHour}
          minHour={minHour}
          maxMinute={maxMinute}
          minMinute={minMinute}
          maxSecond={maxSecond}
          minSecond={minSecond}
          dialogContentStyle={dialogContentStyle}
          containerStyle={containerStyle}
          style={style}
          isBusiness={this.props.isBusiness}
          calendarInfo={this.props.calendarInfo}
          dateFormat={this.state.dateFormat}
          timeFormat={this.state.timeFormat}
          formats={this.state.formats}
          localization={this.state.localization}
          canSelectOldDates={this.state.canSelectOldDates}
          canSelectWeekendDays={this.state.canSelectWeekendDays}
          canSelectSpecialDays={this.state.canSelectSpecialDays}
          disabled={this.state.disabled}
          dateUpdate={this.dateUpdate.bind(this)}
          dialogNewSelectDate={this.state.dialogNewSelectDate}
          pageType={this.props.pageType}
          inlineGridMode={this.props.inlineGridMode}
          noDialog={this.props.noDialog}
        />
      </div>
    );
  }
}

DateTimePicker.Format = receiveFormat;
export default DateTimePicker;
