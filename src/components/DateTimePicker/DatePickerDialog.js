import React from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import Calendar from './Calendar';
import { Popover } from 'b-popover';
import { ComponentBase, Sizes } from 'b-component';
import { Dialog } from 'b-dialog-box';

import { dateTimeFormat } from './dateUtils';


class DatePickerDialog extends ComponentBase {

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
    todayButtonOnClick: PropTypes.func,
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
    open: false,
  };

  show = () => {
    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }
    this.setState({
      open: true,
    });
  };

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }

    this.setState({
      open: false,
    });
  }

  handleTouchTapDay = (event, date) => {
    if (this.props.onAccept) {
      this.props.onAccept(date);
    }
    this.setState({
      open: false,
    });
  }

  handleTouchTapCancel = () => {
    this.dismiss();
  }

  todayButtonOnClick = () => {
    if (this.props.onAccept) {
      var today = new Date();
      var handleDate = new Date(this.refs.calendar.getSelectedDate());
      today.setHours(handleDate.getHours());
      today.setMinutes(handleDate.getMinutes());
      today.setSeconds(handleDate.getSeconds());
      this.props.onAccept(today);
    }
    this.setState({
      open: false,
    });
  }

  handleClickToolBar = () => {

  }

  dateUpdate(oldDate, newDate, changeType) {
    if (this.props.dateUpdate) {

      this.props.dateUpdate(oldDate, newDate, changeType);
    }
  }

  handleRequestClose = () => {
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }
    this.popover && this.popover.manualClose();
    this.setState({
      open: false,
    });
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
      containerStyle,
      dialogContentStyle,
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
    let isMobileOrTablet = this.props.context.deviceSize < Sizes.MEDIUM;
    var popoverOrigin = { horizontal: 'left', vertical: 'top' };


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
        onTouchTapCancel={this.handleTouchTapCancel.bind(this)}
        onTouchTapOk={this.handleTouchTapOk}
        todayButtonOnClick={this.todayButtonOnClick.bind(this)}
        okLabel={okLabel}
        shouldDisableDate={shouldDisableDate}
        handleClickToolBar={this.handleClickToolBar.bind(this)}
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
      />
    );

    let content = (
      <Dialog context={this.props.context}
        modal={false}
        open={open}
        onRequestClose={this.handleRequestClose.bind(this)}
        disableRestoreFocus={true}
        style={{
          padding: 0
        }}
      >
        {calendar}
      </Dialog>
    );

    let popoverContent = (
      <Popover
        canAutoPosition={true}
        isOriginSetted={true}
        repositionOnUpdate={true}
        autoCloseWhenOffScreen={false}
        style={{
          marginTop: -57,
          marginLeft: (this.props.pageType != 'browse') ? -10 : -12,
          paddingTop: 0,
          maxWidth: '100%',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          maxheight: 'calc(100% - 24px)',
          direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl'
        }}
        isResizable={false}
        open={open}
        context={this.props.context}
        anchorEl={this.root}
        anchorOrigin={popoverOrigin}
        targetOrigin={popoverOrigin}
        zDepth={1}
        bodyStyle={containerStyle}
        contentStyle={dialogContentStyle}
        ref={r => this.popover = r}
        onRequestClose={this.handleRequestClose.bind(this)}
        scrollableContainer={true}
        disableRestoreFocus={true}
      >
        <EventListener
          target="window"
          onKeyUp={this.handleWindowKeyUp}
        />
        {calendar}
      </Popover>
    );
    return (
      <div ref={ref => (this.root = ref)}>
        {this.props.noDialog ?
          <div> {calendar}</div> : <div> {isMobileOrTablet ? content : popoverContent}  </div>
        }
      </div>
    );
  }
}

export default DatePickerDialog;
