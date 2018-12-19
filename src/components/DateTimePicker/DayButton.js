import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqualDate, getDatePickerStyle } from './dateUtils';
import ButtonBase from '@material-ui/core/ButtonBase';

function getStyles(props, context, state) {
  const { date, selected, dayInfo, isBusiness, displayDate, isFlexMode } = props;
  const { hover } = state;
  const datePicker = getDatePickerStyle(context);

  let labelColor = datePicker.dayButtonColor;
  let backgroundColor = 'white'; // todo: bozuk olabilir.
  let buttonStateOpacity = 0;
  let buttonStateTransform = 'scale(0)';
  let hoverSelectedAndTodayBorder = 'none';
  const hoverSelectedAndTodayPadding = 0;
  let backgroundClip = '';
  const daysType = {
    EmptyDay: -1,
    WorkDay: 0,
    WeekendDay: 1,
    Holiday: 2,
    ReliHoliday: 3,
    Eve: 4,
  };

  if (dayInfo.dayType === daysType.EmptyDay) {
    if (isEqualDate(date, new Date())) {
      labelColor = datePicker.selectTextColor;
      backgroundColor = datePicker.todayButtonBackgroundColor;
      buttonStateOpacity = 1;
      buttonStateTransform = 'scale(1)';
      hoverSelectedAndTodayBorder = datePicker.dayBorder;
      // hoverSelectedAndTodayPadding = 2;
      backgroundClip = 'content-box';
    } else if (hover || selected) {
      labelColor = datePicker.alternateTextColor;
      backgroundColor = datePicker.alternateTextColor;
      buttonStateOpacity = selected ? 1 : 0.6;
      buttonStateTransform = 'scale(1)';
      hoverSelectedAndTodayBorder = datePicker.dayBorder;
      // hoverSelectedAndTodayPadding = 2;
      backgroundClip = 'content-box';
    }
  } else if (isBusiness) {
    if (dayInfo.dayType === daysType.WorkDay) {
      if (isEqualDate(date, new Date())) {
        labelColor = 'white';
        backgroundColor = datePicker.todayButtonBackgroundColor;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else if (hover || selected) {
        if (date.getMonth() === displayDate.getMonth()) {
          labelColor = datePicker.dayButtonColor;
        } else {
          labelColor = datePicker.otherMonthTextColor;
        }
        backgroundColor = datePicker.calWorkDay;
        buttonStateOpacity = selected ? 1 : 0.6;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else {
        labelColor = datePicker.dayButtonColor;
        backgroundColor = datePicker.calWorkDay;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
      }
    } else if (dayInfo.dayType === daysType.WeekendDay) {
      if (isEqualDate(date, new Date())) {
        labelColor = 'white';
        backgroundColor = datePicker.todayButtonBackgroundColor;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else if (hover || selected) {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calWeekend;
        buttonStateOpacity = selected ? 1 : 0.6;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calWeekend;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
      }
    } else if (dayInfo.dayType === daysType.Holiday) {
      if (isEqualDate(date, new Date())) {
        labelColor = 'white';
        backgroundColor = datePicker.todayButtonBackgroundColor;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else if (hover || selected) {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calHoliday;
        buttonStateOpacity = selected ? 1 : 0.6;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calHoliday;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
      }
    } else if (dayInfo.dayType === daysType.Eve) {
      if (isEqualDate(date, new Date())) {
        labelColor = 'white';
        backgroundColor = datePicker.todayButtonBackgroundColor;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else if (hover || selected) {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calEve;
        buttonStateOpacity = selected ? 1 : 0.6;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calEve;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
      }
    } else if (dayInfo.dayType === daysType.ReliHoliday) {
      if (isEqualDate(date, new Date())) {
        labelColor = 'white';
        backgroundColor = datePicker.todayButtonBackgroundColor;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else if (hover || selected) {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calReliHoliday;
        buttonStateOpacity = selected ? 1 : 0.6;
        buttonStateTransform = 'scale(1)';
        hoverSelectedAndTodayBorder = datePicker.dayBorder;
        // hoverSelectedAndTodayPadding = 2;
        backgroundClip = 'content-box';
      } else {
        labelColor = datePicker.holidayButtonColor;
        backgroundColor = datePicker.calReliHoliday;
        buttonStateOpacity = 1;
        buttonStateTransform = 'scale(1)';
      }
    }
  } else if (isEqualDate(date, new Date())) {
    labelColor = datePicker.selectTextColor;
    backgroundColor = datePicker.todayButtonBackgroundColor;
    hoverSelectedAndTodayBorder = datePicker.dayBorder;
    // hoverSelectedAndTodayPadding = 2;
    backgroundClip = 'content-box';
    buttonStateOpacity = 1;
    buttonStateTransform = 'scale(1)';
  } else if (hover || selected) {
    labelColor = datePicker.selectTextColor;
    buttonStateOpacity = selected ? 1 : 0.6;
    buttonStateTransform = 'scale(1)';
  }
  return {
    root: {
      boxSizing: 'border-box',
      fontWeight: '400',
      opacity: 1,
      padding: '2px 0px',
      position: 'relative',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      width: isFlexMode ? '100%' : 40,
      height: 40,
      marginLeft: isFlexMode ? 2 : undefined,
      marginRight: isFlexMode ? 2 : undefined,
    },
    label: {
      color: labelColor,
      fontWeight: '400',
      position: 'relative',
      fontSize: 14,
      marginTop: -1,
    },
    buttonState: {
      backgroundColor,
      borderRadius: datePicker.dayBackgroundsShape,
      border: hoverSelectedAndTodayBorder,
      padding: hoverSelectedAndTodayPadding,
      backgroundClip,
      height: 36,
      left: isFlexMode ? 0 : 2,
      opacity: buttonStateOpacity,
      position: 'absolute',
      top: 0,
      transform: buttonStateTransform,
      // transition: 'cubic-bezier(0.23, 1, 0.32, 1)', // Transition.easeOut(),
      width: isFlexMode ? '100%' : 36,
    },
  };
}

class DayButton extends Component {
  static propTypes = {
    context: PropTypes.object,
    date: PropTypes.object,
    DateTimeFormat: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isFlexMode: PropTypes.bool, // eslint-disable-line
    onKeyboardFocus: PropTypes.func,
    onTouchTap: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    selected: false,
    disabled: false,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    hover: false,
  };

  constructor(props, context) {
    super(props, context);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleKeyboardFocus = this.handleKeyboardFocus.bind(this);
  }

  handleMouseEnter() {
    if (!this.props.disabled) {
      this.setState({ hover: true });
    }
  }

  handleMouseLeave() {
    if (!this.props.disabled) {
      this.setState({ hover: false });
    }
  }

  handleTouchTap(event) {
    if (!this.props.disabled && this.props.onTouchTap) {
      this.props.onTouchTap(event, this.props.date);
    }
  }

  handleKeyboardFocus(event, keyboardFocused) {
    if (!this.props.disabled && this.props.onKeyboardFocus) {
      this.props.onKeyboardFocus(event, keyboardFocused, this.props.date);
    }
  }

  render() {
    const {
      DateTimeFormat,
      date,
      disabled,
      onTouchTap, // eslint-disable-line no-unused-vars
      selected, // eslint-disable-line no-unused-vars
    } = this.props;
    const styles = getStyles(this.props, this.props.context, this.state);

    return date ? (
      <ButtonBase
        disabled={disabled}
        onFocusVisible={this.handleKeyboardFocus}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleTouchTap}
        style={styles.root}
      >
        <div style={styles.buttonState} />
        <span style={styles.label}>
          {
            new DateTimeFormat({
              day: 'numeric',
            }).format(date)
          }
        </span>
      </ButtonBase>
    ) : (
        <span style={styles.root} />
      );
  }
}

export default DayButton;
