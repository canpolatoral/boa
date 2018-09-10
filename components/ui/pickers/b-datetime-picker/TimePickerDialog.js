import React from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import TimeBase from './TimeBase';
import CalendarActionButtons from './CalendarActionButtons';
import { BPopover } from 'b-popover';
import { BComponent } from 'b-component';
import { BInputAction } from 'b-input-action';
import { BDialog } from 'b-dialog-box';

import {
  dateTimeFormat,
  getLocalizedTime,
  calendarMouseWheelAction,
  isEqualDateTime,
  getLocalizedDate,
  getDatePickerStyle
} from './dateUtils';


class TimePickerDialog extends BComponent {

  constructor(props, context) {
    super(props, context);
    let formatedlocalizedTime = getLocalizedTime(props.initialDate ? props.initialDate:new Date(), props.datetimeOption,
      this.props.timeFormat, this.props.localization);
    this.state = {
      localizedTime: formatedlocalizedTime,
    };
  }
  BActionInputFocused = false;
  componentWillMount() {
    super.componentWillMount();
    this.BActionInputFocused = false;
    this.setState({
      date: this.props.initialDate ? this.props.initialDate: new Date(),
      localizedTime: getLocalizedTime(this.props.initialDate ? this.props.initialDate: new Date(), this.props.datetimeOption,
        this.props.timeFormat, this.props.localization),
      floatingLabelStyle: this.props.floatingLabelStyle,
      inputStyle: this.props.inputStyle,
    });
  }
  componentWillReceiveProps(nextProps) {
    const newDate = nextProps.initialDate;
    if (!isEqualDateTime(this.state.date, newDate)) {
      this.setState({
        date: newDate,
      });
    }
  }
  componentDidUpdate() {

  }

  static propTypes = {
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    dialogContentStyle: PropTypes.object,
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.instanceOf(Date),
    ]),
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onTimeChange: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
    style: PropTypes.object,
    minHour: PropTypes.number,
    maxHour: PropTypes.number,
    minMinute: PropTypes.number,
    maxMinute: PropTypes.number,
    minSecond: PropTypes.number,
    maxSecond: PropTypes.number,
    datetimeOption: PropTypes.object,
    handleTouchTapHour: PropTypes.func,
    handleTouchTapMinute: PropTypes.func,
    handleTouchTapSecond: PropTypes.func,
    onTouchTapTimeOk: PropTypes.func,
    onTouchTapTimeCancel: PropTypes.func,
    hintStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    dialogItemStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    localization: PropTypes.func,
    isMobile: PropTypes.bool,
    hourTitle: PropTypes.node,
    minuteTitle: PropTypes.node,
    secondTitle: PropTypes.node,
    anchorEl: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.node,
    ]),
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    container: 'dialog',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
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
  }

  dismiss = () => {

    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }
    this.setState({
      open: false,
    });
  }

  handleTouchTapCancel = () => {
    this.dismiss();
  }
  handleRequestClose = () => {
    this.dismiss();
    this.popover.manualClose();
  }

  handleTouchTapOk = () => {
    if (this.props.onAccept) {
      this.props.onAccept(this.state.date);
    }
    this.setState({
      open: false,
    });
  }
  handleTouchTapHour = (event, hour) => {
    if (this.state.date) {
      var newDate = new Date(this.state.date.setHours(hour));
      this.setState({
        date: newDate,
      });
    }
    else {
      this.setState({
        date: new Date((new Date()).setHours(hour)),
      });
    }

    if (this.props.handleTouchTapHour) {
      this.props.handleTouchTapHour(event, hour);
    }
  }
  handleTouchTapMinute = (event, minute) => {
    if (this.state.date) {
      var newDate = new Date(this.state.date.setMinutes(minute));
      this.setState({
        date: newDate,
      });
    }
    else {
      this.setState({
        date: new Date((new Date()).setMinutes(minute))
      });
    }
    if (this.props.handleTouchTapMinute) {
      this.props.handleTouchTapMinute(event, minute);
    }
  }
  handleTouchTapSecond = (event, second) => {
    if (this.state.date) {
      var newDate = new Date(this.state.date.setSeconds(second));
      this.setState({
        date: newDate,
      });
    }
    else {
      this.setState({
        date: new Date((new Date()).setMinutes(second)),
      });
    }
    if (this.props.handleTouchTapSecond) {
      this.props.handleTouchTapSecond(event, second);
    }
  }
  onKeyDownInputTime(e) {
    switch (keycode(e)) {
      case 'enter':
        if (this.BActionInputFocused) {
          if (this.bInputActionDialogTime && !this.bInputActionDialogTime.getValue()) {
            this.setState({date:null}, this.handleTouchTapOk);
          }
          else {
            this.handleTouchTapOk();
          }
        }
    }
  }
  hourSelector(DateTimeFormat, minHour, maxHour, format, localization) {
    return (
      <TimeBase
        key="hours"
        context={this.props.context}
        DateTimeFormat={DateTimeFormat}
        onTouchTapTime={this.handleTouchTapHour.bind(this)}
        selectedDate={this.state.date ? this.state.date: new Date()}
        minValue={minHour}
        maxValue={maxHour}
        timeType={1}
        format={format}
        localization={localization}
        />
    );
  }
  minuteSelector(DateTimeFormat, minMinute, maxMinute, format, localization) {

    return (
      <TimeBase
        key="minutes"
        context={this.props.context}
        DateTimeFormat={DateTimeFormat}
        onTouchTapTime={this.handleTouchTapMinute.bind(this)}
        selectedDate={this.state.date ? this.state.date: new Date()}
        minValue={minMinute}
        maxValue={maxMinute}
        timeType={2}
        format={format}
        localization={localization}
        />
    );
  }
  secondSelector(DateTimeFormat, minSecond, maxSecond, format, localization) {
    return (
      <TimeBase
        key="seconds"
        context={this.props.context}
        DateTimeFormat={DateTimeFormat}
        onTouchTapTime={this.handleTouchTapSecond.bind(this)}
        selectedDate={this.state.date ? this.state.date: new Date() }
        minValue={minSecond}
        maxValue={maxSecond}
        timeType={3}
        format={format}
        localization={localization}
        />
    );
  }
  handleFocusInput() {
    this.BActionInputFocused = true;
  }
  handleBlurInput() {
    this.BActionInputFocused = false;
  }
  handleWindowOnWheel(event) {
    let value = getLocalizedTime(this.state.date ? this.state.date: new Date(), this.props.datetimeOption,
      this.props.timeFormat, this.props.localization);
    var selectionStart = undefined;
    var selectionEnd = undefined;
    var newValue;
    if (event && this.BActionInputFocused && event.target) {
      if (event && event.wheelDelta !== 0 && event.wheelDelta / 120 > 0) {
        newValue = calendarMouseWheelAction(event.target.selectionStart,
          this.props.timeFormat,
          this.props.localization,
          value,
          1,
          this.state.date);
        selectionStart = event.target.selectionStart;
        selectionEnd = event.target.selectionEnd;
        /* if (this.props.onTimeChange) {
          this.props.onTimeChange(newValue, 1);
        }*/
        this.setState({
          date: newValue,
        });
      }
      else {
        newValue = calendarMouseWheelAction(event.target.selectionStart,
          this.props.timeFormat,
          this.props.localization,
          value,
          -1,
          this.state.date);
        selectionStart = event.target.selectionStart;
        selectionEnd = event.target.selectionEnd;
        this.setState({
          date: newValue,
        });
      }
    }
    if (selectionStart !== undefined && selectionEnd !== undefined) {
      event.target.selectionStart = selectionStart;
      event.target.selectionEnd = selectionEnd;
    }
  }
  renderRTLTimeSelections() {
    const {
      style, // eslint-disable-line no-unused-vars
    } = this.props;
    const isRtl = this.props.context.localization.isRightToLeft;
    return (
      <div style={style.datetimeContainer}>
        {
        !isRtl &&
        this.renderHours()
      }
        {
        !isRtl &&
        this.renderMinutes()
      }
        {
        !isRtl &&
        this.renderSeconds()
      }
        {
        isRtl &&
        this.renderSeconds()
      }
        {
        isRtl &&
        this.renderMinutes()
      }
        {
        isRtl &&
        this.renderHours()
      }
      </div>
    );
  }
  renderHours() {
    const {
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      style, // eslint-disable-line no-unused-vars
      DateTimeFormat,
      timeFormat,
      localization,
      datetimeOption,
      hourTitle,
      minHour,
      maxHour,
    } = this.props;
    if (datetimeOption && datetimeOption.isHour) {
      return (
        <div style={style.datetimeItem}>
          <div style={style.datetimeListTitle}>
            <span style={style.datetimeItemSpan}>{hourTitle}</span>
          </div>
          <div style={style.datetimeListContainer}>
            {this.hourSelector(DateTimeFormat, minHour, maxHour, timeFormat, localization)}
          </div>
        </div>
      );
    }
  }
  renderMinutes() {
    const {
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      style, // eslint-disable-line no-unused-vars
      DateTimeFormat,
      maxMinute,
      minMinute,
      timeFormat,
      localization,
      datetimeOption,
      minuteTitle,
    } = this.props;
    if (datetimeOption && datetimeOption.isMinute) {
      return (
        <div style={style.datetimeItem}>
          <div style={style.datetimeListTitle}>
            <span style={style.datetimeItemSpan}>{minuteTitle}</span>
          </div>
          <div style={style.datetimeListContainer}>
            {this.minuteSelector(DateTimeFormat, minMinute, maxMinute, timeFormat, localization)}
          </div>
        </div>
      );
    }
  }
  renderSeconds() {
    const {
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      style, // eslint-disable-line no-unused-vars
      DateTimeFormat,
      timeFormat,
      localization,
      datetimeOption,
      minSecond,
      maxSecond,
      secondTitle,
    } = this.props;
    if (datetimeOption && datetimeOption.isSecond) {
      return (
        <div style={style.datetimeItem}>
          <div style={style.datetimeListTitle}>
            <span style={style.datetimeItemSpan}>{secondTitle}</span>
          </div>
          <div style={style.datetimeListContainer}>
            {this.secondSelector(DateTimeFormat, minSecond, maxSecond, timeFormat, localization)}
          </div>
        </div>
      );
    }
  }
  render() {

    const {
      cancelLabel,
      containerStyle,
      dialogContentStyle,
      okLabel,
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      style, // eslint-disable-line no-unused-vars
      mode,
      context,
      floatingLabelText,
      timeFormat,
      dateFormat,
      localization,
      datetimeOption,
      hintText,
      initialDate,
      isMobile,
      autoOk
    } = this.props;


    const open=this.state.open==undefined ? false:this.state.open;
    // const {prepareStyles} = this.context.muiTheme;
    const {calendarTextColor} = getDatePickerStyle(this.props.context); // this.context.muiTheme.datePicker;
    const isLandscape = mode === 'landscape';
    const styles = {
      root: {
        color: calendarTextColor,
        userSelect: 'none',
        minWidth: isLandscape ? 479 : 310,
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
        fontSize: 12,
        fontWeight: 400,
        padding: '0px 8px',
        // transition: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      hourTitle: {
        display: 'flex',
        flexDirection: 'column',
        opacity: '0.5',
        textAlign: 'center',
      },
      hourContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        marginTop: 10,
        overflow: 'hidden',
      },
      minuteTitle: {
        display: 'flex',
        flexDirection: 'column',
        opacity: '0.5',
        textAlign: 'center',
      },
      minuteContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        marginTop: 10,
        overflow: 'hidden',
      },
      secondTitle: {
        display: 'flex',
        flexDirection: 'column',
        opacity: '0.5',
        textAlign: 'center',
      },
      secondContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        marginTop: 10,
        overflow: 'hidden',
      },
    };
    let dateInputValue = getLocalizedDate(initialDate? initialDate : new Date(), dateFormat, localization);
    let timeInputValue = getLocalizedTime(this.state.date? this.state.date : new Date(), datetimeOption, timeFormat, localization);


    var popoverOrigin = { horizontal: 'left', vertical: 'top' };

    let content=(

      <div style={styles.root}>
        <EventListener
          target="window"
          onWheel={this.handleWindowOnWheel.bind(this)}
        />
        <div style={style.inputContainer}>
          {dateFormat && isMobile &&
          <div style={style.inputDateItem}>

            <div style={{
              marginLeft:12,
              marginRight:12,
              marginTop:12,

            }}>
              <BInputAction
                  context={this.props.context}
                  hintText={this.props.hintText}
                  onFocus={this.handleFocusInput.bind(this)}
                  onBlur={this.handleBlurInput.bind(this)}
                  value={dateInputValue}
                  ref={r => this.bInputActionDialogDate = r}
                  leftIconList={null}
                  rightIconList={null}
                  floatingLabelStyle={this.state.floatingLabelStyle}
                  inputStyle={this.state.inputStyle}
                  disabled={true}
                  />
            </div>

          </div>
          }
          <div style={style.inputTimeItem}>
            <div style={{
              marginLeft:12,
              marginRight:12,
              marginTop:12
            }}>
              <BInputAction
                // {...other}
                context={context}
                hintText={hintText}
                floatingLabelText={floatingLabelText}
                value={timeInputValue}
                ref={r => this.bInputActionDialogTime = r}
                floatingLabelStyle={this.state.floatingLabelStyle}
                onKeyDown={this.onKeyDownInputTime.bind(this)}
                inputStyle={this.state.inputStyle}
                leftIconList={null}
                rightIconList={null}
                onFocus={this.handleFocusInput.bind(this)}
                onBlur={this.handleBlurInput.bind(this)}
                />
            </div>
          </div>

        </div>
        <div style={styles.calendar}>
          {
            this.renderRTLTimeSelections()
          }
          {okLabel &&
            <CalendarActionButtons
              context={context}
              autoOk={autoOk}
              cancelLabel={cancelLabel}
              okLabel={okLabel}
              onTouchTapCancel={this.handleTouchTapCancel.bind(this)}
              onTouchTapOk={this.handleTouchTapOk.bind(this)}
              />
          }

        </div>
      </div>
    );

    let popoverContent=(
      <BPopover
          canAutoPosition={true}
          isOriginSetted={true}
          useLayerForClickAway={false}
          repositionOnUpdate={true}
          canAutoPosition={true}
          isOriginSetted={true}
          repositionOnUpdate={true}
          autoCloseWhenOffScreen={false}
          style={{
            marginTop:-12,
            marginLeft:-12,
            paddingTop: 0,
            maxWidth: '100%',
            width: 'calc(100% - 16px)',
            height: 'calc(100% - 16px)',
            maxheight: 'calc(100% - 24px)',
            direction:!this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl'
          }}
          isResizable={false}
          open={open}
          context={this.props.context}
          anchorOrigin={popoverOrigin}
          targetOrigin={popoverOrigin}
          zDepth={1}
          bodyStyle={containerStyle}
          contentStyle={dialogContentStyle}
          ref={r => this.popover = r}
          onRequestClose={this.handleRequestClose.bind(this)}
          contentStyle={dialogContentStyle}
          open={open}
          disableRestoreFocus={true}
          anchorEl={this.props.anchorEl}
          >

        {content}

      </BPopover>
    );

    let dialogContent=(
      <BDialog context={this.props.context}
          modal={false}
          open={open}
          onRequestClose={this.handleRequestClose.bind(this)}
          disableRestoreFocus={true}>
        {content}
      </BDialog>
    );


    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    return (
      <div
        ref="root">
        { isMobileOrTablet ? dialogContent: popoverContent }

      </div >
    );
  }
}

export default TimePickerDialog;
