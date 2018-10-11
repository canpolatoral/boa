import React from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import { ComponentBase } from '@boa/base';
import { Button } from '@boa/components/Button';
import { Localization } from '@boa/utils';
import { Divider } from '@boa/components/Divider';
import { IconButton } from '@boa/components/IconButton';
import { InputMask } from '@boa/components/InputMask';
import CalendarActionButtons from './CalendarActionButtons';
import CalendarMonth from './CalendarMonth';
import CalendarToolbar from './CalendarToolbar';
import TimeBase from './TimeBase';
import SpecialDay from './SpecialDay';

import {
  addDays,
  addMonths,
  addYears,
  cloneDate,
  dateTimeFormat,
  isAfterDate,
  isBeforeDate,
  getFirstDayOfMonth,
  localizedWeekday,
  monthDiff,
  getLocalizedDate,
  isEqualDate,
  isBetweenDates,
  calendarMouseWheelAction,
  getWeekArray,
  getDatePickerStyle
} from './dateUtils';

const daysArray = [...Array(7)];

class Calendar extends ComponentBase {

  constructor(props, context) {
    super(props, context);
  }
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    initialDate: PropTypes.object,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    maxMonth: PropTypes.number,
    minMonth: PropTypes.number,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onTouchTapCancel: PropTypes.func,
    onTouchTapDay: PropTypes.func,
    onTouchTapOk: PropTypes.func,
    open: PropTypes.bool,
    shouldDisableDate: PropTypes.func,
    handleTouchTapYear: PropTypes.func,
    handleTouchTapMonth: PropTypes.func,
    handleClickToolBar: PropTypes.func,
    todayButtonOnClick: PropTypes.func,
    iconStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    floatingLabelFocusStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    isBusiness: PropTypes.bool,
    style: PropTypes.object,
    calendarInfo: PropTypes.array,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    localization: PropTypes.func,
    datetimeOption: PropTypes.object,
    canSelectOldDates: PropTypes.bool,
    canSelectWeekendDays: PropTypes.bool,
    canSelectSpecialDays: PropTypes.bool,
    isMobile: PropTypes.bool,
    todayLabel: PropTypes.node,
    yearTitle: PropTypes.node,
    monthTitle: PropTypes.node,
    hourTitle: PropTypes.node,
    minuteTitle: PropTypes.node,
    secondTitle: PropTypes.node,
    dateUpdate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    dialogNewSelectDate: PropTypes.instanceOf(Date),
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    disableYearSelection: false,
    initialDate: new Date(),
    minDate: addYears(new Date(), -33),
    maxDate: addYears(new Date(), 33),
    maxMonth: 11,
    minMonth: 0,
  };
  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    displayDate: undefined,
    displayMonthDay: true,
    selectedDate: undefined,
    transitionDirection: 'left',
    transitionEnter: true,
  };
  SpecialDays = [];
  CalendarInfoSelectedDate;
  componentWillMount() {
    super.componentWillMount();
    this.setState({
      displayDate: getFirstDayOfMonth(this.props.initialDate ? this.props.initialDate : new Date()),
      selectedDate: this.props.initialDate,
      floatingLabelStyle: this.props.floatingLabelStyle,
      inputStyle: this.props.inputStyle,
    });
  }

  componentDidMount() {
    this.bactioninput &&
      this.bactioninput.binput &&
      this.bactioninput.binput.getInstance() &&
      this.bactioninput.binput.getInstance().state &&
      !this.bactioninput.binput.getInstance().state.focussed &&
      setTimeout(() => {
        // this.bactioninput.focus();
      }, 200);
  }

  setSpecialDays() {
    if (this.props.calendarInfo && this.props.calendarInfo.length > 0 && this.state.displayDate) {
      let calendarInfo = this.props.calendarInfo;
      let date = this.state.displayDate;
      if (date !== undefined) {


        if (this.CalendarInfoSelectedDate === undefined ||
          this.CalendarInfoSelectedDate.getMonth() !== date.getMonth() ||
          this.CalendarInfoSelectedDate.getFullYear() !== date.getFullYear()) {
          this.CalendarInfoSelectedDate = date;
          this.SpecialDays = [];
          for (let i = 0; i < calendarInfo.length; i++) {
            let beginDate = cloneDate(getFirstDayOfMonth(date));
            let endDate = cloneDate(getFirstDayOfMonth(date));
            beginDate = new Date(beginDate.setMonth(beginDate.getMonth() - 1));
            endDate = new Date(endDate.setMonth(endDate.getMonth() + 2));
            if (calendarInfo[i] && calendarInfo[i].day) {
              let calendarDay = new Date(calendarInfo[i].day);
              if (isBetweenDates(calendarDay, beginDate, endDate)) {
                calendarInfo[i].day = new Date(calendarInfo[i].day);
                this.SpecialDays.push(calendarInfo[i]);
              }
            }
          }
        }
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dialogNewSelectDate !== undefined && !isEqualDate(nextProps.dialogNewSelectDate, this.props.dialogNewSelectDate)) {
      this.setState({
        displayDate: getFirstDayOfMonth(nextProps.dialogNewSelectDate),
        selectedDate: nextProps.dialogNewSelectDate
      });
    }
    if (nextProps.initialDate !== this.props.initialDate) {
      const date = nextProps.initialDate || new Date();
      this.setState({
        displayDate: getFirstDayOfMonth(date),
        selectedDate: date
      });
    }
  }

  getSelectedDate() {
    return this.state.selectedDate;
  }

  isSelectedDateDisabled() {
    if (!this.state.displayMonthDay) {
      return false;
    }

    return this.refs.calendar.isSelectedDateDisabled();
  }

  addSelectedDays(days) {
    return addDays(this.state.selectedDate, days);
  }

  addSelectedMonths(months) {
    addMonths(this.state.selectedDate, months);
  }

  addSelectedYears(years) {
    addYears(this.state.selectedDate, years);
  }

  setDisplayDate(date, newSelectedDate) {
    const newDisplayDate = getFirstDayOfMonth(date);
    const direction = newDisplayDate > this.state.displayDate ? 'left' : 'right';

    if (newDisplayDate !== this.state.displayDate) {
      this.setState({
        displayDate: newDisplayDate,
        transitionDirection: direction,
        selectedDate: newSelectedDate || this.state.selectedDate,
      });
    }
  }

  setSelectedDate(date) {
    let adjustedDate = date;
    if (date && isBeforeDate(date, this.props.minDate)) {
      adjustedDate = this.props.minDate;
    } else if (date && isAfterDate(date, this.props.maxDate)) {
      adjustedDate = this.props.maxDate;
    }

    const newDisplayDate = getFirstDayOfMonth(adjustedDate);
    if (newDisplayDate !== this.state.displayDate) {
      this.setDisplayDate(newDisplayDate, adjustedDate);
    } else {
      this.setState({
        selectedDate: adjustedDate
      });
    }
  }

  handleTouchTapDay = (event, date) => {
    this.setSelectedDate(date);

    if (this.props.onTouchTapDay) this.props.onTouchTapDay(event, date);
  };

  handleMonthChange = (months) => {
    this.setState({
      transitionDirection: months >= 0 ? 'left' : 'right',
      displayDate: addMonths(this.state.displayDate, months),
    });
  };
  handleTouchTapYear = (event, year) => {

    const date = cloneDate(this.state.selectedYearMonthDate);
    date.setFullYear(year);
    this.setState({
      selectedYearMonthDate: date,
    });
  };
  handleTouchTapMonth = (event, month) => {
    const date = cloneDate(this.state.selectedYearMonthDate);
    date.setMonth(month);
    this.setState({
      selectedYearMonthDate: date,
    });
  };
  getToolbarInteractions() {
    return {
      prevMonth: monthDiff(this.state.displayDate, this.props.minDate) > 0,
      nextMonth: monthDiff(this.state.displayDate, this.props.maxDate) < 0,
    };
  }
  onTouchTapOk = () => {
    const date = cloneDate(this.state.selectedYearMonthDate);
    this.setSelectedDate(date, event);
    this.handleTouchTapDateDisplayMonthDay();
  }
  handleTouchTapDateDisplayMonthDay = () => {
    this.setState({
      displayMonthDay: true,
    });
  };

  handleTouchTapDateDisplayYear = () => {
    this.setState({
      displayMonthDay: false,
    });
  };
  handleClickToolBar(e) {
    if (this.state.displayMonthDay) {
      this.setState({
        displayMonthDay: false,
        selectedYearMonthDate: this.state.displayDate,
      });
      if (this.props.handleClickToolBar) {
        this.props.handleClickToolBar(e, this.state.displayMonthDay);
      }
    }
    else {
      this.setState({
        displayMonthDay: true,
        selectedDate: this.state.selectedYearMonthDate,
      });
      if (this.props.handleClickToolBar) {
        this.props.handleClickToolBar(e, this.state.displayMonthDay);
      }
    }

  }
  handleRemoveDate = (e) => {
    var handleDate;
    if (!this.state.selectedDate) {
      handleDate = new Date();
    } else {
      handleDate = new Date(this.getSelectedDate());
    }
    handleDate.setDate(handleDate.getDate() - 1);
    this.handleChangeDate(e, handleDate);
  }
  handleAddDate = (e) => {
    var handleDate;
    if (!this.state.selectedDate) {
      handleDate = new Date();
    } else {
      handleDate = new Date(this.getSelectedDate());
    }
    handleDate.setDate(handleDate.getDate() + 1);
    this.handleChangeDate(e, handleDate);
  }
  todayButtonOnClick = (e) => {
    if (this.props.todayButtonOnClick) {
      this.props.todayButtonOnClick(e);
    }
  }
  handleChangeDate = (event, date) => {
    this.setState({
      initialDate: date,
      displayDate: getFirstDayOfMonth(date),
      selectedDate: date,
    });
  };
  handleWindowKeyDown = (event) => {
    let oldDate = cloneDate(this.state.selectedDate);
    if (this.props.open) {
      switch (keycode(event)) {
        case 'up':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(-1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedYears(-1)), 2);
            }
          } else if (event.shiftKey) {
            this.addSelectedMonths(-1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedMonths(-1)), 2);
            }
          } else {
            this.addSelectedDays(-7);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedDays(-7)), 2);
            }
          }
          break;

        case 'down':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedYears(1)), 1);
            }
          } else if (event.shiftKey) {
            this.addSelectedMonths(1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedMonths(1)), 1);
            }
          } else {
            this.addSelectedDays(7);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedDays(7)), 1);
            }
          }
          break;

        case 'right':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedYears(1)), 1);
            }
          } else if (event.shiftKey) {
            this.addSelectedMonths(1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedMonths(1)), 1);
            }
          } else {
            this.addSelectedDays(1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedDays(1)), 1);
            }
          }
          break;

        case 'left':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(-1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedYears(-1)), 2);
            }
          } else if (event.shiftKey) {
            this.addSelectedMonths(-1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedMonths(-1)), 2);
            }
          } else {
            this.addSelectedDays(-1);
            if (this.props.dateUpdate) {
              this.props.dateUpdate(oldDate, cloneDate(this.addSelectedDays(-1)), 2);
            }
          }
          break;


      }
    }
  };
  handleWindowOnWheel = (event) => {
    let value = getLocalizedDate(this.state.selectedDate,
      this.props.dateFormat, this.props.localization);
    var selectionStart = undefined;
    var selectionEnd = undefined;
    var newValue;
    if (event && this.state.focus && event.target) {
      if (event && event.wheelDelta !== 0 && event.wheelDelta / 120 > 0) {
        selectionStart = event.target.selectionStart;
        selectionEnd = event.target.selectionEnd;
        newValue = calendarMouseWheelAction(event.target.selectionStart,
          this.props.dateFormat,
          this.props.localization,
          value,
          1,
          this.state.selectedDate);
        this.setState({
          initialDate: newValue,
          displayDate: getFirstDayOfMonth(newValue),
          selectedDate: newValue,
        });
        if (this.props.dateUpdate) {
          this.props.dateUpdate(cloneDate(this.state.selectedDate), cloneDate(newValue), 4);
        }
      }
      else {
        selectionStart = event.target.selectionStart;
        selectionEnd = event.target.selectionEnd;

        newValue = calendarMouseWheelAction(event.target.selectionStart,
          this.props.dateFormat,
          this.props.localization,
          value,
          -1,
          this.state.selectedDate);
        this.setState({
          initialDate: newValue,
          displayDate: getFirstDayOfMonth(newValue),
          selectedDate: newValue,
        });
        if (this.props.dateUpdate) {
          this.props.dateUpdate(cloneDate(this.state.selectedDate), cloneDate(newValue), 5);
        }
      }
    }
    if (selectionStart !== undefined && selectionEnd !== undefined) {
      event.target.selectionStart = selectionStart;
      event.target.selectionEnd = selectionEnd;
    }
  }

  handleFocusInput(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.inputFocus = true;
    this.setState(
      {
        focus: true,
      }
    );
  }
  handleBlurInput(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
    this.inputFocus = true;
    this.setState(
      {
        focus: false,
      }
    );
  }
  yearSelector() {
    if (!this.props.disableYearSelection) {
      return (
        <TimeBase
          key="years"
          context={this.props.context}
          DateTimeFormat={this.props.DateTimeFormat}
          onTouchTapTime={this.handleTouchTapYear}
          selectedDate={this.state.selectedYearMonthDate}
          minValue={this.props.minDate.getFullYear()}
          maxValue={this.props.maxDate.getFullYear()}
          timeType={5}
          format={this.props.dateFormat}
          localization={this.props.localization}

        />

      );
    }
  }

  onKeyDownInputDate(e) {
    // const keyCode = e.keyCode || e.charCode || e.which;
    // console.log(keyCode + '-' + keycode(e));
    // var delimiters = Localization.getDelimiters();
    // if (keycode(e) != 'enter') {
    //   if (!((keyCode == 35 || keyCode == 36 || keyCode == 37 || keyCode == 39) || // Home, end, left and right arrows
    //       // (e.shiftKey || e.altKey || e.ctrlKey) ||
    //       (((keyCode == 65 || keyCode == 86 || keyCode == 67) && (e.ctrlKey === true || e.metaKey === true))) || // Ctrl-A, Ctrl-V, Ctrl-C
    //       ((e.shiftKey && (keyCode == 35 || keyCode == 36 || keyCode == 37 || keyCode == 39))) || // shift-home, shift-end, shift-left, shift-right
    //       (!e.shiftKey && (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105)) || // Numbers and numeric keypad
    //       (keyCode == 8 || keyCode == 46) || // Backspace And del
    //       (keyCode == 9) || // Tab
    //       (keyCode == 45) || // Ins
    //       (keyCode == 111 || (e.shiftKey && keyCode == 55)) || // numpad / or normal /
    //       ((keyCode == 188 &&  delimiters.decimal == ',') || (keyCode == 190 && delimiters.decimal == '.')) || // comma and point;
    //       // (keyCode == 189 || keyCode == 109) || // dash and subtract
    //       (e.keyCode == 38 || e.keyCode == 40))) { // upper / lower
    //     if (e.preventDefault) e.preventDefault();
    //     return;
    //   }
    // }

    switch (keycode(e)) {
      case 'enter':
        if (this.inputFocus) {
          if (this.bactioninput && !this.bactioninput.getInstance().getValue()) {
            this.handleTouchTapDay(e, null);
          }
          else if (this.bactioninput && this.bactioninput.getInstance().getValue()) {
            let inputValue = this.bactioninput.getInstance().getValue();
            let dateValue = Localization.getDateValue(inputValue.value);
            if (dateValue.isValid()) {
              // set focus new date
              let newDate = dateValue._d;
              this.setState({
                initialDate: newDate,
                displayDate: getFirstDayOfMonth(newDate),
                selectedDate: newDate,
              }, () => { this.handleTouchTapDay(e, newDate); });
              // if (this.props.dateUpdate) {
              //   this.props.dateUpdate(cloneDate(this.state.selectedDate), cloneDate(newDate), 5);
              // }
            }

          }
        }
    }
  }

  onChangeInputDate() {
    if (this.bactioninput && this.bactioninput.getInstance().getValue()) {
      // console.log(val);
    }
  }

  mounthSelector() {
    if (!this.props.disableYearSelection) {
      return (
        <TimeBase
          key="months"
          context={this.props.context}
          DateTimeFormat={this.props.DateTimeFormat}
          onTouchTapTime={this.handleTouchTapMonth}
          selectedDate={this.state.selectedYearMonthDate}
          minValue={this.props.minMonth}
          maxValue={this.props.maxMonth}
          timeType={4}
          format={this.props.dateFormat}
          localization={this.props.localization}
        />

      );
    }
  }

  getCalendarMonth(DateTimeFormat, minDate, maxDate) {
    let calendarMonth = (
      <CalendarMonth
        DateTimeFormat={DateTimeFormat}
        context={this.props.context}
        displayDate={this.state.displayDate}
        firstDayOfWeek={this.props.firstDayOfWeek}
        key={this.state.displayDate.toDateString()}
        minDate={minDate}
        maxDate={maxDate}
        onTouchTapDay={this.handleTouchTapDay}
        ref="calendar"
        selectedDate={this.state.selectedDate}
        shouldDisableDate={this.props.shouldDisableDate}
        calendarInfo={this.SpecialDays}
        isBusiness={this.props.isBusiness}
        canSelectOldDates={this.props.canSelectOldDates}
        canSelectWeekendDays={this.props.canSelectWeekendDays}
        canSelectSpecialDays={this.props.canSelectSpecialDays}
      />
    );
    return calendarMonth;
  }

  renderYearAndMounthSelector() {
    const {
      style,
      yearTitle,
      monthTitle
    } = this.props;
    const isRtl = this.props.context.localization.isRightToLeft;
    return (
      <div style={style.datetimeContainer}>
        {
          !isRtl &&
          this.renderSelection(style, monthTitle, true)
        }
        {
          !isRtl &&
          this.renderSelection(style, yearTitle, false)
        }
        {
          isRtl &&
          this.renderSelection(style, yearTitle, false)
        }
        {
          isRtl &&
          this.renderSelection(style, monthTitle, true)
        }
      </div>
    );
  }
  renderSelection(style, title, yearOrMounth) {
    return (
      <div style={style.datetimeItem}>
        <div style={style.datetimeListTitle}>
          <span style={style.datetimeItemSpan}>{title}</span>
        </div>
        <div style={style.datetimeListContainer}>
          {
            yearOrMounth &&
            this.mounthSelector()
          }
          {
            !yearOrMounth &&
            this.yearSelector()
          }
        </div>
      </div>
    );
  }

  prepareStyles(object) {
    return object;
  }

  render() {
    this.setSpecialDays();
    // const {this.prepareStyles} = this.context.muiTheme;
    const toolbarInteractions = this.getToolbarInteractions();
    const isLandscape = this.props.mode === 'landscape';
    const { calendarTextColor, equalWidthContainerDisplay, equalWidthContainerFlexWrap,
      equalWidthItemFlex, timeBaseTitleBackgroundColor } = getDatePickerStyle(this.props.context);  // this.context.muiTheme.datePicker;
    const styles = {
      root: {
        color: calendarTextColor,
        userSelect: 'none',
        width: isLandscape ? 479 : 300
      },
      calendar: {
        display: 'flex',
        flexDirection: 'column',
      },
      calendarContainer: {
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 400,
        padding: '0px 0px',
        // transition: 'cubic-bezier(0.23, 1, 0.32, 1)', // transitions.easeOut(),
      },
      yearContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        /* marginTop: 10,*/
        overflow: 'hidden',
        // width: 155,
      },
      mounthContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        /* marginTop: 10,*/
        overflow: 'hidden',
        // width: 155,
      },
      weekTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontWeight: '500',
        height: 40,
        lineHeight: '15px',
        opacity: '0.5',
        textAlign: 'center',
        alignItems: 'center',
      },
      weekTitleDay: {
        width: 40,
      },

      yearsTitle: {
        display: 'flex',
        flexDirection: 'column',
        opacity: '0.5',
        textAlign: 'center',
        background: timeBaseTitleBackgroundColor,
      },
      monthsTitle: {
        display: 'flex',
        flexDirection: 'column',
        opacity: '0.5',
        textAlign: 'center',
        background: timeBaseTitleBackgroundColor,
      },
      dateContainer: {
        display: equalWidthContainerDisplay,
        flexWrap: equalWidthContainerFlexWrap,
        padding: '0px 0px 0px 0px',
      },
      dateItem: {
        flex: equalWidthItemFlex,
      },
      dayAndInput: {
        padding: '7px 12px 0px 12px',
      },
      inputStyle: {

      },

    };

    const weekTitleDayStyle = this.prepareStyles(styles.weekTitleDay);
    const buttonStyle = {
      marginTop: 6,
      height: 36,
      minWidth: '100%',
      textAlign: 'center',
      borderStyle: 'solid',
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderRightWidth: 0,
      borderRadius: 0,
      borderColor: this.props.context.theme.palette.borderColor
    };

    const buttonTextStyle = {
      color: this.props.context.theme.palette.primary1Color,
      fontWeight: 'bold',
    };
    const {
      minDate,
      maxDate,
      cancelLabel,
      DateTimeFormat,
      firstDayOfWeek,
      okLabel,
      style,
      todayLabel,
      onTouchTapCancel, // eslint-disable-line no-unused-vars
      onTouchTapOk, // eslint-disable-line no-unused-vars
    } = this.props;

    let dateInputValue = getLocalizedDate(this.state.selectedDate ? this.state.selectedDate : new Date(), this.props.dateFormat, this.props.localization);

    // ayda kaç hafta olduğu bulunup yüksekliği verilmek zorunda
    const weekArray = getWeekArray(this.state.displayDate, this.props.firstDayOfWeek);
    let minHeight;
    if (weekArray != null && weekArray.length == 5) {
      minHeight = 196;
    }
    else {
      minHeight = 236;
    }

    let iconStyle = {
      color: this.props.context.theme.boaPalette.pri500,
      width: 16,
      height: 16,
    };

    dateInputValue = dateInputValue && dateInputValue.replace('/', '.');
    dateInputValue = dateInputValue && dateInputValue.replace('/', '.');

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
    return (
      <div style={this.prepareStyles(styles.root)}>

        <div style={this.prepareStyles(styles.dayAndInput)}>
          <EventListener
            target="window"
            context={this.props.context}
            onKeyDown={this.handleWindowKeyDown}
            onWheel={this.handleWindowOnWheel.bind(this)}
          />
          <div style={this.prepareStyles(styles.inputStyle)} >
            <div style={style.inputContainer} >
              <div style={style.inputDateItem}>
                {!this.props.noDialog &&
                  <InputMask
                    // {...other}
                    onKeyDown={this.onKeyDownInputDate.bind(this)}
                    onChange={this.onChangeInputDate.bind(this)}
                    context={this.props.context}
                    onFocus={this.handleFocusInput.bind(this)}
                    onBlur={this.handleBlurInput.bind(this)}
                    value={dateInputValue}
                    ref={r => this.bactioninput = r}
                    prefixText={prefix}
                    suffixText={suffix}
                    floatingLabelStyle={this.state.floatingLabelStyle}
                    inputStyle={this.state.inputStyle}
                    inputAlign={'center'}
                    hintText={this.props.formats && this.props.formats.dateFormatHint}
                    // maskString = {'DD.MM.YYYY'}
                    mask={'nn.nn.nnnn'}
                    bottomRightInfoEnable={false}
                    bottomLeftInfoEnable={false}
                    fullWidth={false}

                  />
                }

              </div>
            </div>

            <Divider
              context={this.props.context}
              style={{
                width: 'calc(100% + 24px)',
                marginBottom: 0,
                marginLeft: -12,
                marginRight: -12,
                marginTop: 0
              }} />

            <div style={{ marginTop: 15 }}>
              {this.state.displayMonthDay &&

                <CalendarToolbar
                  context={this.props.context}
                  DateTimeFormat={DateTimeFormat}
                  displayDate={this.state.displayDate}
                  onMonthChange={this.handleMonthChange}
                  prevMonth={toolbarInteractions.prevMonth}
                  nextMonth={toolbarInteractions.nextMonth}
                  handleClickToolBar={this.handleClickToolBar.bind(this)}
                  format={this.props.dateFormat}
                  localization={this.props.localization}
                />
              }
            </div>
          </div>
          <div style={this.prepareStyles(styles.calendar)}>
            {this.state.displayMonthDay &&
              <div style={this.prepareStyles({})}>
                <div style={this.prepareStyles(styles.calendarContainer)}>

                  <div style={this.prepareStyles(styles.weekTitle)}>
                    {daysArray.map((event, i) => (
                      <span key={i} style={weekTitleDayStyle}>
                        {localizedWeekday(DateTimeFormat, i, firstDayOfWeek, this.props.dateFormat, this.props.localization)}
                      </span>
                    ))}
                  </div>
                  {/* <Slide direction={this.state.transitionDirection} style={Object.assign({}, style.transitionSlide, {minHeight:minHeight})}
                    childStyle={style.transitionChildSlide}> */}
                  <div style={Object.assign({}, style.transitionSlide, { minHeight: minHeight })} >
                    { // TODO :SLIDE
                      this.getCalendarMonth(DateTimeFormat, minDate, maxDate)
                    }
                  </div>

                  {/* </Slide> */}
                  <div>
                    {this.getSpecialDays()}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <div>
          {!this.state.displayMonthDay &&
            this.renderYearAndMounthSelector(style)
          }
          {this.state.displayMonthDay &&
            <div style={{ height: 48 }}>


              {(this.props.isBusiness == false) ?
                (<Divider
                  context={this.props.context}
                  style={{
                    width: 'calc(100%)',
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 12
                  }} />
                ) :
                (<div></div>)
              }

              {(this.props.noDialog == false) ?
                (<Button
                  context={this.props.context}
                  type="flat"
                  text={todayLabel}
                  colorType="primary"
                  fullWidth={true}
                  onClick={this.todayButtonOnClick}
                  style={buttonStyle}
                  textStyle={buttonTextStyle}
                />
                ) :
                (<div></div>)
              }


            </div>
          }
        </div>
        {!this.state.displayMonthDay && okLabel &&
          <CalendarActionButtons
            context={this.props.context}
            autoOk={this.props.autoOk}
            cancelLabel={cancelLabel}
            okLabel={okLabel}
            onTouchTapCancel={onTouchTapCancel}
            onTouchTapOk={this.onTouchTapOk}

          />
        }
      </div>
    );
  }

  getSpecialDays() {

    return (<div>
      {this.props.isBusiness && this.SpecialDays.length > 0 &&

        <SpecialDay
          context={this.props.context}
          DateTimeFormat={this.props.DateTimeFormat}
          specialDayType={1}
          key={`db${(4)}`}
          selectedDate={this.state.displayDate}
          calendarInfo={this.SpecialDays}
          localization={this.props.localization}
          format={this.props.dateFormat}
        />

      }
    </div>
    );
  }
}

export default Calendar;
