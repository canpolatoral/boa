import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayButton from './DayButton';
import { isBetweenDates, isEqualDate, getWeekArray, substructDay } from './dateUtils';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontWeight: 400,
    lineHeight: 2,
    position: 'relative',
    textAlign: 'center',
    MozPaddingStart: 0,
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
  },
};

const dayType = {
  EmptyDay: -1,
  WorkDay: 0,
  WeekendDay: 1,
  Holiday: 2,
  Eve: 3,
  ReliHoliday: 4,
};

class CalendarMonth extends Component {
  static propTypes = {
    calendarInfo: PropTypes.array,
    canSelectOldDates: PropTypes.bool,
    canSelectSpecialDays: PropTypes.bool,
    canSelectWeekendDays: PropTypes.bool,
    context: PropTypes.object,
    DateTimeFormat: PropTypes.func.isRequired,
    displayDate: PropTypes.object.isRequired,
    firstDayOfWeek: PropTypes.number,
    isBusiness: PropTypes.bool,
    isFlexMode: PropTypes.bool,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    onTouchTapDay: PropTypes.func,
    selectedDate: PropTypes.object,
    shouldDisableDate: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.SpecialDays = [];
    this.handleTouchTapDay = this.handleTouchTapDay.bind(this);
  }

  getDayType(day, calendarInfo) {
    if (day === null) return { dayType: dayType.EmptyDay };
    if (!isBetweenDates(day, this.props.minDate, this.props.maxDate)) {
      return { dayType: dayType.EmptyDay };
    }
    if (calendarInfo) {
      for (let i = 0; i < calendarInfo.length; i++) {
        if (calendarInfo[i] && calendarInfo[i].day) {
          const calendarDay = new Date(calendarInfo[i].day);
          if (isEqualDate(calendarDay, day)) {
            return calendarInfo[i];
          }
        }
      }
    }
    return { dayType: dayType.EmptyDay };
  }

  getWeekElements() {
    const weekArray = getWeekArray(this.props.displayDate, this.props.firstDayOfWeek);

    const weekStyle = Object.assign({}, styles.week);
    if (this.props.isFlexMode) {
      weekStyle.marginLeft = -2;
      weekStyle.marginRight = -2;
    }

    return weekArray.map((week, i) => {
      return (
        // eslint-disable-next-line
        <div key={i} style={weekStyle}>
          {this.getDayElements(week, i)}
        </div>
      );
    }, this);
  }

  getDayElements(week, i) {
    const {
      DateTimeFormat,
      selectedDate,
      isBusiness,
      calendarInfo,
      canSelectOldDates,
      canSelectWeekendDays,
      canSelectSpecialDays,
      displayDate,
      isFlexMode,
    } = this.props;

    return week.map((day, j) => {
      const isSameDate = isEqualDate(selectedDate, day);

      const dayInfo = this.getDayType(day, calendarInfo);
      const options = {
        day,
        displayDate,
        dayInfo,
        canSelectOldDates,
        canSelectWeekendDays,
        canSelectSpecialDays,
      };
      const disabled = this.shouldDisableDate(options);

      if (dayInfo.dayType !== dayType.EmptyDay) {
        this.SpecialDays.push(dayInfo);
      }
      const selected = !disabled && isSameDate;
      if (isSameDate) {
        this.selectedDateDisabled = disabled;
      }

      return (
        <DayButton
          DateTimeFormat={DateTimeFormat}
          context={this.props.context}
          date={day}
          disabled={disabled}
          key={`db${i + j}`}
          onTouchTap={this.handleTouchTapDay}
          selected={selected}
          dayInfo={dayInfo}
          isBusiness={isBusiness}
          displayDate={this.props.displayDate}
          isFlexMode={isFlexMode}
        />
      );
    }, this);
  }

  handleTouchTapDay(event, date) {
    if (this.props.onTouchTapDay) {
      this.props.onTouchTapDay(event, date);
    }
  }

  isSelectedDateDisabled() {
    return this.selectedDateDisabled;
  }

  shouldDisableDate(options) {
    const { day, dayInfo, canSelectOldDates, canSelectWeekendDays, canSelectSpecialDays } = options;

    if (day === null) return false;
    let disabled = !isBetweenDates(day, this.props.minDate, this.props.maxDate);
    if (!disabled && this.props.shouldDisableDate) disabled = this.props.shouldDisableDate(day);

    const dateNow = new Date();
    const subDay = substructDay(dateNow, day);
    if (!canSelectOldDates && subDay < 0) {
      disabled = true;
    }
    if (dayInfo.dayType !== dayType.EmptyDay) {
      if (!canSelectWeekendDays && dayInfo.dayType === dayType.WeekendDay) {
        disabled = true;
      }
      if (
        !canSelectSpecialDays &&
        (dayInfo.dayType === dayType.Eve ||
          dayInfo.dayType === dayType.ReliHoliday ||
          dayInfo.dayType === dayType.Holiday)
      ) {
        disabled = true;
      }
    }

    return disabled;
  }

  render() {
    return (
      <div>
        <div style={styles.root}>{this.getWeekElements()}</div>
      </div>
    );
  }
}

export default CalendarMonth;
