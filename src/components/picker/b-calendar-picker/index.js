import React from 'react';
import PropTypes from  'prop-types';
import DatePicker from './DatePicker';
import DatePickerDialog from './DatePickerDialog';
import { BComponent } from 'b-component';
import { BComponentComposer } from 'b-component';
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

//let maxHour, maxMinute, maxSecond, minHour, minMinute, minSecond;

@BComponentComposer
export class BCalendarPicker extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
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
    hintTextDate: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    mode: PropTypes.string,
    isBusiness: PropTypes.bool,
    format: PropTypes.string,
    pageType: PropTypes.oneOf('browse', 'transactional'),
    inlineGridMode:PropTypes.bool,
    noDialog: PropTypes.bool,
    datePickerStyle: PropTypes.any
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    firstDayOfWeek: 1,
    mode: 'portrait',
    fullWidth: true,
    minDate: new Date(1950, 0, 1, 1, 3, 5),
    maxDate: new Date(2099, 11, 30, 20, 3, 14),
    defaultValue: null,
    isBusiness: false,
    format: receiveFormat.LDLT,
    canSelectOldDates: true,
    canSelectWeekendDays: false,
    canSelectSpecialDays: false,
    pageType:'browse',
    inlineGridMode:false,
    noDialog:false,
    datePickerStyle : {
      textColor : "#21e155",
      backgroundColor : "#EDF6E3"
    }
  };

  formats = getFormatDecomposition(this.props.format);

  state = {
    formats:this.formats,
    dateFormat: this.formats.dateFormat,
    localization: BComponent.Localization,
    value: this.getDateToString(this.props.value ? this.props.value:this.getDefaultDate(this.props),  this.getDefaultDate(this.props)),
    autoOk: false,
    disableYearSelection: false,
    monthTitle: this.getMessage('BOA', 'Month'),
    mode: this.props.mode,
    container: 'dialog',
    canSelectOldDates: this.props.canSelectOldDates,
    canSelectWeekendDays: this.props.canSelectWeekendDays,
    canSelectSpecialDays: this.props.canSelectSpecialDays,
    disabled: this.props.disabled,
    minDate: this.getDateToString(this.props.minDate, Date(1950, 0, 1)),
    maxDate: this.getDateToString(this.props.maxDate, new Date(2099, 11, 30)),
    datePickerStyle : this.props.datePickerStyle
  };

    constructor(props, context) {
      super(props, context);
      this.onChange = this.onChange.bind(this);
    }

    isString(obj) {
      return (Object.prototype.toString.call(obj) === '[object String]');
    }

    getDefaultDate(props) {
      let defaultDate=undefined;
      if  (props.defaultValue!=undefined) {
        defaultDate=props.defaultValue;
      }
      else if (props.pageType=='browse') {
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
      if (propDate ===null || propDate === undefined) {
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

  clearTimeZone(returnDate) {
    return new Date((returnDate).getTime() - ((returnDate).getTimezoneOffset() * 60000));
  }

  clearJustTimeZone(returnDate) {
    return new Date((returnDate).getTime());
  }

    getValue () {
      if (this.state.value) {
        let formats = getFormatDecomposition(this.props.format);
        var returnDate=this.state.value;
        if (formats.timeFormat === undefined) { // sadece tarih gösterilecek ise saat bilgileri temizleniyor.
          this.clearTime(returnDate);
        }
        return  this.clearTimeZone(returnDate);
      }
      return this.state.value;
    }

    setDisable(value) {
      this.setState({ disabled: value });
    }

    getFormat() {
      return receiveFormat;
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.format !== this.props.format) ||
        (nextProps.datePickerStyle !== this.props.datePickerStyle) ||
        (nextProps.canSelectOldDates !== this.props.canSelectOldDates) ||
        (nextProps.canSelectWeekendDays !== this.props.canSelectWeekendDays) ||
        (nextProps.canSelectSpecialDays !== this.props.canSelectSpecialDays) ||
        (nextProps.disabled !== this.props.disabled) ||
        !isEqualDateTime(nextProps.value, this.props.value) ||
        !isEqualDateTime(this.props.minDate, nextProps.minDate) ||
        !isEqualDateTime(this.props.maxDate, nextProps.maxDate) ||
        (nextProps.mode !== this.props.mode
        )
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
          formats:formats,
          dateFormat: formats.dateFormat,
          disabled: nextProps.disabled,
          datetimeOption: datetimeOption,
          mode: nextProps.mode,
          minDate: minDate,
          maxDate: maxDate,
          datePickerStyle:nextProps.datePickerStyle
        });
      }
    }

    validateConstraint() {
      return this.picker ? this.picker.validateConstraint() : true;
    }

    render(){
      const datePicker= getDatePickerStyle(this.props.context);

      let dialogContentStyle = {
        minWidth: this.state.mode === 'landscape' ? 479 : 304,
      };
      let containerStyle = {
        minHeight: this.state.mode === 'landscape' ? 330 : 370,
        minWidth: this.state.mode === 'landscape' ? 479 : 304,
      };
      const isRtl = this.props.context.localization.isRightToLeft;
      let datePaddingLeft= 0;
      let timePaddingLeft= 0;
      if (isRtl) {
        datePaddingLeft =24;
      }
      else {
        timePaddingLeft =24;
      }

      let baseContainerIconStyle = {
        width: 16,
        height: 16,
        marginTop:5
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
          borderRight:this.props.context.theme.boaPalette.base200,
          borderRightStyle:'solid',
          borderRightWidth:isRtl ? 0:1,

          borderLeft:this.props.context.theme.boaPalette.base200,
          borderLeftStyle:'solid',
          borderLeftWidth:isRtl ? 1:0,

          borderBottom:'1px solid ' + this.props.context.theme.boaPalette.base200,

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
          marginBottom:-8
        },
        inputTimeItem: {
          flex: datePicker.equalWidthItemFlex,
        },
        transitionSlide: {
          minHeight: 252,
          margin:-2
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
        baseContainerIconStyle : baseContainerIconStyle,

        inputAlign: this.props.pageType=='browse' ? 'center':null,

      };

      return (
        <div>
          <DatePicker
            ref={r=> this.picker = r}
            context={this.props.context}
            valueConstraint={this.props.valueConstraint}
            onChange={this.onChange}
            dateOnChange={this.dateOnChange}
            floatingLabelTextDate={this.props.floatingLabelTextDate}
            value={this.state.value}
            disableYearSelection={this.state.disableYearSelection}
            mode={this.state.mode}
            container={this.state.container}
            firstDayOfWeek={this.props.firstDayOfWeek}
            monthTitle={this.state.monthTitle}
            formatDate={this.props.formatDate}
            fullWidth={this.props.fullWidth}
            datetimeOption={this.state.datetimeOption}
            maxDate={this.state.maxDate}
            minDate={this.state.minDate}
            dialogContentStyle={dialogContentStyle}
            containerStyle={containerStyle}
            style={style}
            isBusiness={this.props.isBusiness}
            calendarInfo={this.props.calendarInfo}
            dateFormat={this.state.dateFormat}
            formats={this.state.formats}
            localization={this.state.localization}
            disabled={this.state.disabled}
            dialogNewSelectDate={this.state.dialogNewSelectDate}
            pageType={this.props.pageType}
            inlineGridMode={this.props.inlineGridMode}
            noDialog={this.props.noDialog}
            datePickerStyle = {this.state.datePickerStyle}
            />
        </div>
      );
    }
  }

  BCalendarPicker.Format = receiveFormat;
  export default BCalendarPicker;
