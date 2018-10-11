import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { ComponentBase } from '@boa/base';
import TimeButton from './TimeButton';
import { cloneDate } from './dateUtils';

class TimeBase extends ComponentBase {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    maxValue: PropTypes.number.isRequired,
    minValue: PropTypes.number.isRequired,
    onTouchTapTime: PropTypes.func,
    selectedDate: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.object.isRequired,
      PropTypes.instanceOf(Date).isRequired,
    ]),
    wordings: PropTypes.object,
    timeType: PropTypes.number.isRequired,
    format: PropTypes.string,
    localization: PropTypes.func,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.scrollToSelectedTime();
  }

  componentDidUpdate() {
    this.scrollToSelectedTime();
  }

  getTimes() {
    const {
      DateTimeFormat,
      selectedDate,
      timeType,
    } = this.props;

    const times = [];
    var maxTime = this.props.maxValue;
    var minTime = this.props.minValue;
    const dateCheck = cloneDate(selectedDate);

    for (let time = minTime; time <= maxTime; time++) {
      const selectedProps = {};
      var selectedTime = '';
      var timeFormated = '';
      if (timeType === 1) {
        dateCheck.setHours(time);
        selectedTime = selectedDate.getHours();
        timeFormated = new DateTimeFormat({
          time: 'hour',
        }).format(dateCheck);
      }
      else if (timeType === 2) {
        dateCheck.setMinutes(time);
        selectedTime = selectedDate.getMinutes();
        timeFormated = new DateTimeFormat({
          time: 'minute',
        }).format(dateCheck);
      }
      else if (timeType === 3) {
        dateCheck.setSeconds(time);
        selectedTime = selectedDate.getSeconds();
        timeFormated = new DateTimeFormat({
          time: 'second',
        }).format(dateCheck);
      }
      else if (timeType === 4) {
        dateCheck.setMonth(time);
        selectedTime = selectedDate.getMonth();
        timeFormated = new DateTimeFormat({
          month: 'monthListName',
          localization: this.props.localization,
          format: this.props.format,
        }).format(dateCheck);
      }
      else if (timeType === 5) {
        dateCheck.setFullYear(time);
        selectedTime = selectedDate.getFullYear();
        timeFormated = new DateTimeFormat({
          year: 'numeric',
        }).format(dateCheck);
      }


      const selected = selectedTime === time;
      if (selected) {
        selectedProps.ref = 'selectedTimeButton';
      }


      const timeButton = (
        <TimeButton
          context={this.props.context}
          key={`yb${time}`}
          onTouchTap={this.handleTouchTapTime}
          selected={selected}
          time={time}
          {...selectedProps}
        >
          {timeFormated}
        </TimeButton>
      );

      times.push(timeButton);
    }

    return times;
  }

  scrollToSelectedTime() {
    if (this.refs.selectedTimeButton === undefined) {
      return;
    }

    const container = ReactDOM.findDOMNode(this);
    const timeButtonNode = ReactDOM.findDOMNode(this.refs.selectedTimeButton);

    const containerHeight = container.clientHeight;
    const timeButtonNodeHeight = timeButtonNode.clientHeight || 32;

    const scrollYOffset = (timeButtonNode.offsetTop + timeButtonNodeHeight / 2) - containerHeight / 2;
    container.scrollTop = scrollYOffset;
  }

  handleTouchTapTime = (event, time) => {
    if (this.props.onTouchTapTime) {
      this.props.onTouchTapTime(event, time);
    }
  };

  render() {
    const styles = {
      root: {
        backgroundColor: this.props.context.theme.palette.canvasColor,
        height: 'inherit',
        lineHeight: '35px',
        overflowX: 'hidden',
        overflowY: 'scroll',
        position: 'relative',
        border: '0px',
        borderColor: this.props.context.theme.palette.borderColor,
      },
      child: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100%',
      },
    };
    return (
      <div style={{ float: 'left', ...styles.root }}>
        <div style={styles.child}>
          {
            this.getTimes()
          }
        </div>
      </div >
    );
  }
}

export default TimeBase;
