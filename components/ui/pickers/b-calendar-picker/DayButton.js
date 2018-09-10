import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  isEqualDate,
  getDatePickerStyle
} from './dateUtils';
import ButtonBase from '@material-ui/core/ButtonBase';

function getStyles(props, context, state, isSingle) {
  const {date, selected, dayInfo, isBusiness} = props;
  const {hover} = state;
  const datePicker = getDatePickerStyle(context, props.datePickerStyle);
  
  let labelColor = datePicker.dayButtonColor;
  let backgroundColor = 'white'; // todo: bozuk olabilir.
  let buttonStateOpacity = 0;
  let buttonStateTransform = 'scale(0)';
  let hoverSelectedAndTodayBorder = 'none';
  let hoverSelectedAndTodayPadding = 0;
  let backgroundClip = '';
  const daysType = {
    EmptyDay: -1,
    WorkDay: 0,
    WeekendDay: 1,
    Holiday: 2,
    // Eve: 3,
    // ReliHoliday: 4,
  };

  const backgroundColorTypes = {
    processingDayColor : "#EDF6E3",
    weekendColor : "#FBE9E5",
    holidayColor : "#FFAB91",
  };

  if (dayInfo.dayType === daysType.EmptyDay && isSingle) {
    if (hover || selected && !(isEqualDate(date, new Date()))){
      labelColor = datePicker.alternateTextColor;
      backgroundColor = props.datePickerStyle.backgroundColor;//datePicker.alternateTextColor;
      buttonStateOpacity = 1;//selected ? 1 : 0.6;
      buttonStateTransform = 'scale(1)';
      hoverSelectedAndTodayBorder = props.datePickerStyle.backgroundColor;//datePicker.dayBorder;
      backgroundClip = 'content-box';
      dayInfo.dayType = props.datePickerStyle.backgroundColor == backgroundColorTypes.processingDayColor ? daysType.WorkDay : 
      (props.datePickerStyle.backgroundColor == backgroundColorTypes.weekendColor ? daysType.WeekendDay : daysType.Holiday);
    }
  }

  return {
    root: {
      boxSizing: 'border-box',
      fontWeight: '400',
      opacity: 1,
      padding: '2px 0px',
      position: 'relative',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      width: 40,
      height: 40
    },
    label: {
      color: labelColor,
      fontWeight: '400',
      position: 'relative',
      fontSize: 14,
    },
    buttonState: {
      backgroundColor: backgroundColor,
      borderRadius: datePicker.dayBackgroundsShape,
      border: hoverSelectedAndTodayBorder,
      padding: hoverSelectedAndTodayPadding,
      backgroundClip: backgroundClip,
      height: 36,
      left: 2,
      opacity: buttonStateOpacity,
      position: 'absolute',
      top: 0,
      transform: buttonStateTransform,
      // transition: 'cubic-bezier(0.23, 1, 0.32, 1)', // Transition.easeOut(),
      width: 36,
    },
  };
}

class DayButton extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    date: PropTypes.object,
    disabled: PropTypes.bool,
    onKeyboardFocus: PropTypes.func,
    onTouchTap: PropTypes.func,
    selected: PropTypes.bool,
    dayInfo: PropTypes.object,
    isBusiness: PropTypes.bool,
    context:PropTypes.object,
    datePickerStyle: PropTypes.any
  };

  static defaultProps = {
    selected: false,
    disabled: false
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    hover: false,
    ipsala:'much'
  };

  handleMouseEnter = () => {
    if (!this.props.disabled) {
      this.setState({ hover: true });
    }
  };

  handleMouseLeave = () => {
    if (!this.props.disabled && (this.props.dayInfo.dayType !== -1)) {
      this.setState({ hover: false });
    }
  };

/*
  componentDidUpdate(prevProps, prevState) {
    // only update chart if the data has changed
    if (prevProps.dayInfo.dayType === -1){
      this.state.hover=this.state.hover;
    }else{
      this.state.hover=this.state.hover;
    }
    //this.state.hover = this.state.hover;
}
*/

  handleTouchTap = (event) => {
    this.props.onTouchTap(event, this.props.date);
    if (!this.props.disabled && this.props.onTouchTap) {
      if(this.props.dayInfo.dayType === -1){
        this.setState({ hover: true });
      }
      else{
        this.setState({ hover: false });
        //this.props.datePickerStyle.backgroundColor = 'white';
      }
    }
  };

  handleKeyboardFocus = (event, keyboardFocused) => {
    if (!this.props.disabled && this.props.onKeyboardFocus) {
      this.props.onKeyboardFocus(event, keyboardFocused, this.props.date);
    }
  };

  render() {
    const {
      DateTimeFormat,
      date,
      disabled,
      onTouchTap, // eslint-disable-line no-unused-vars
      selected, // eslint-disable-line no-unused-vars
    } = this.props;
    // const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.props.context, this.state, this.state.hover);

    return date ? (
      <ButtonBase
        // {...other}
        disabled={disabled}
        onKeyboardFocus={this.handleKeyboardFocus}
        // onMouseEnter={this.handleMouseEnter}
        // onMouseLeave={this.handleMouseLeave}
        onClick={this.handleTouchTap}
        style={styles.root}
        >
        <div style={styles.buttonState} />
        <span style={styles.label}>
          {new DateTimeFormat( {
            day: 'numeric',
          }).format(date)}
        </span>
      </ButtonBase>
    ) : (
      <span style={styles.root} />
      );
  }
}

export default DayButton;
