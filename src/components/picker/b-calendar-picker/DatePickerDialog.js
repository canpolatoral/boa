import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Calendar from './Calendar';
import { BComponent } from 'b-component';

import { dateTimeFormat } from './dateUtils';

class DatePickerDialog extends BComponent {

  constructor(props, context) {
    super(props, context);
  }
  static propTypes = {
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    dialogContentStyle: PropTypes.object,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.instanceOf(Date),
    ]),
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    inputStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    hintStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    isBusiness: PropTypes.bool,
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
    datePickerStyle: PropTypes.any,
    anchorElDate: PropTypes.object,

    dateUpdate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    dialogNewSelectDate: PropTypes.instanceOf(Date),
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    container: 'inline',
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    open: true,
  };

  componentWillReceiveProps() {
  }
  show = () => {

    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }
    this.setState({
      open: true,
    });
  };

  handleTouchTapDay = (event, date) => {
  }

  dateUpdate(oldDate, newDate, changeType) {
    if (this.props.dateUpdate) {

      this.props.dateUpdate(oldDate, newDate, changeType);
    }
  }

  handleRequestClose = () => {
  }

  handleTouchTapOk = () => {
    this.handleRequestClose();
  }

  handleWindowKeyUp = (event) => {
    switch (keycode(event)) {
      case 'enter':

    }
  }

  render() {
    const {
      DateTimeFormat,
      autoOk,
      cancelLabel,
      disableYearSelection,
      initialDate,
      firstDayOfWeek,
      maxDate,
      minDate,
      mode,
      okLabel,
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      shouldDisableDate,
      style, // eslint-disable-line no-unused-vars
      context,
      calendarInfo,
      dateFormat,
      timeFormat,
      localization,
      canSelectOldDates,
      canSelectWeekendDays,
      canSelectSpecialDays,
      floatingLabelStyle,
      iconStyle,
      inputStyle,
      isBusiness,
      isMobile,
      datetimeOption,
      todayLabel,
      yearTitle,
      dialogNewSelectDate,
      monthTitle,
      noDialog,
    } = this.props;

    const { open } = this.state;

    let calendar = (
      <Calendar
        autoOk={autoOk}
        DateTimeFormat={DateTimeFormat}
        cancelLabel={cancelLabel}
        context={context}
        disableYearSelection={disableYearSelection}
        firstDayOfWeek={firstDayOfWeek}
        initialDate={initialDate}
        onTouchTapDay={this.handleTouchTapDay.bind(this)}
        maxDate={maxDate}
        minDate={minDate}
        mode={mode}
        open={open}
        ref="calendar"
        onTouchTapOk={this.handleTouchTapOk}
        okLabel={okLabel}
        shouldDisableDate={shouldDisableDate}
        iconStyle={iconStyle}
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
        monthTitle={monthTitle}
        todayLabel={todayLabel}
        dateUpdate={this.dateUpdate.bind(this)}
        dialogNewSelectDate={dialogNewSelectDate}
        noDialog={noDialog}
        datePickerStyle={this.props.datePickerStyle}
      />
    );

    return (
      <div ref={ref => (this.root = ref)}>
        <div> {calendar}</div>
      </div>
    );
  }
}

export default DatePickerDialog;
