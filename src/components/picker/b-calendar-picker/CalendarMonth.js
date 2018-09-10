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
    /* height: 228,*/
    lineHeight: 2,
    position: 'relative',
    textAlign: 'center',
    MozPaddingStart: 0,
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40
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
    DateTimeFormat: PropTypes.func.isRequired,
    autoOk: PropTypes.bool,
    displayDate: PropTypes.object.isRequired,
    firstDayOfWeek: PropTypes.number,
    isBusiness: PropTypes.bool,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    onTouchTapDay: PropTypes.func,
    selectedDate: PropTypes.object,
    shouldDisableDate: PropTypes.func,
    calendarInfo: PropTypes.array,
    context:PropTypes.object,
    datePickerStyle: PropTypes.any
  };

  isSelectedDateDisabled() {
    return this.selectedDateDisabled;
  }

  handleTouchTapDay = (event, date) => {
    if (this.props.onTouchTapDay) {
      this.props.onTouchTapDay(event, date);
    }
  };

  getDayType(day, calendarInfo) {
    if (day === null) return { dayType: dayType.EmptyDay };
    if (!isBetweenDates(day, this.props.minDate, this.props.maxDate)) {
      return { dayType: dayType.EmptyDay };
    }
    if (calendarInfo) {
      for (let i = 0; i < calendarInfo.length; i++) {
        if (calendarInfo[i] && calendarInfo[i].day) {
          let calendarDay = new Date(calendarInfo[i].day);
          if (isEqualDate(calendarDay, day)) {
            return calendarInfo[i];
          }
        }
      }
    }
    return { dayType: dayType.EmptyDay };
  }
  shouldDisableDate(day, displayDate, dayInfo, canSelectOldDates, canSelectWeekendDays, canSelectSpecialDays) {
    if (day === null) return false;
    let disabled = !isBetweenDates(day, this.props.minDate, this.props.maxDate);
    if (!disabled && this.props.shouldDisableDate) disabled = this.props.shouldDisableDate(day);

    if (day.getMonth() !== displayDate.getMonth()) {
      disabled = true;
    }
    let dateNow = new Date();
    let subDay = substructDay(dateNow, day);
    if (!canSelectOldDates && subDay<0 && day.getMonth() !== displayDate.getMonth()) {
      disabled = true;
    }
    if (dayInfo.dayType !== dayType.EmptyDay) {
      if (!canSelectWeekendDays && dayInfo.dayType === dayType.WeekendDay) {
        disabled = true;
      }
      if (!canSelectSpecialDays &&
         (dayInfo.dayType === dayType.Eve || dayInfo.dayType === dayType.ReliHoliday || dayInfo.dayType === dayType.Holiday)) {
        disabled = true;
      }
    }

    return disabled;
  }
  SpecialDays = [];

  getWeekElements() {
    const weekArray = getWeekArray(this.props.displayDate, this.props.firstDayOfWeek);

    return weekArray.map((week, i) => {
      return (
        <div key={i} style={styles.week}>
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

    } = this.props;

    return week.map((day, j) => {
      const isSameDate = isEqualDate(selectedDate, day);


      let dayInfo = this.getDayType(day, calendarInfo);
      const disabled = this.shouldDisableDate(day, displayDate, dayInfo, canSelectOldDates, canSelectWeekendDays, canSelectSpecialDays);

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
          key={`db${(i + j)}`}
          onTouchTap={this.handleTouchTapDay}
          selected={selected}
          dayInfo={dayInfo}
          isBusiness={isBusiness}
          datePickerStyle = {this.props.datePickerStyle}
          />
      );
    }, this);
  }

  render() {
    return (
      <div>
        <div style={styles.root}>
          {this.getWeekElements()}
        </div>

      </div>
    );
  }
}

export default CalendarMonth;
