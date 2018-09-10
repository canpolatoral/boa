import warning from 'warning';
import isString from 'lodash/isString';
import { BComponent } from 'b-component';

const dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];
const monthLongList = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const seperator = '.';
export const receiveFormat = {
  LD: 'DDMMYYYY',
  LDLT: 'DDMMYYYY hmmss',
  LDT: 'DDMMYYYY hmm',
  LT: 'hmmss',
  T: 'hmm',
};
export const momentFormat = {
  hourAndMinute: 'LT',
  hourAndMinuteAndSecond: 'LTS',
  Date: 'L',
};

export function getLocalizedDate(value, dateformat, localization) {
  if (localization && dateformat && value) {

    // var oldToJson = Date.prototype.toJSON;
    // var date = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
    // var newDate = oldToJson.call(date);

    return localization.formatDateTimeGMT(value, dateformat);
  }
  return '';
}
export function getLocalizedTime(value, datetimeOption, timeformat, localization) {
  if (localization && timeformat && value) {

    // var oldToJson = Date.prototype.toJSON;
    // var date = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
    // var newDate = oldToJson.call(date);

    return localization.formatDateTimeGMT(value, timeformat);
  }
  return '';
}

export function dateTimeFormat(options) {
  this.format = function (date) {
    if (options.month === 'short' && options.weekday === 'short' && options.day === '2-digit') {
      return `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`;
    } else if (options.year === 'numeric' && options.month === 'numeric' && options.day === 'numeric') {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } else if (options.year === 'numeric' && options.month === 'long') {
      return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`;
    }
    else if (options.item === 'monthYearName') {
      `${getMonthsLong(date, options.localization, options.format)[date.getMonth()]}`;
      return `${getMonthsLong(date, options.localization, options.format)[date.getMonth()]} ${date.getFullYear()}`;
    }
    else if (options.weekday === 'narrow') {
      return dayAbbreviation[date.getDay()];
    }
    else if (options.localizationWeekday === 'narrow') {
      return getWeekDaysMin(options.localization, date, options.format)[date.getDay()];
    } else if (options.year === 'numeric') {
      return date.getFullYear().toString();
    } else if (options.month === 'numeric') {
      return `${monthLongList[date.getMonth()]}`;
    }
    else if (options.month === 'monthListName') {
      return `${getMonthsLong(date, options.localization, options.format)[date.getMonth()]}`;
    }
    else if (options.day === 'numeric') {
      return date.getDate();
    } else if (options.time === 'hour') {
      return date.getHours();
    } else if (options.time === 'minute') {
      return date.getMinutes();
    } else if (options.time === 'second') {
      return date.getSeconds();
    } else {
      warning(false, 'Material-UI: Wrong usage of DateTimeFormat');
    }
  };
}
export function getMonthName(month) {
  return monthList[month];
}
export function addDays(d, days) {
  const newDate = cloneDate(d);
  newDate.setDate(d.getDate() + days);
  return newDate;
}

export function addMonths(d, months) {
  const newDate = cloneDate(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

export function addYears(d, years) {
  const newDate = cloneDate(d);
  newDate.setFullYear(d.getFullYear() + years);
  return newDate;
}
export function addHours(d, hours) {
  const newDate = cloneDate(d);
  newDate.setHours(d.getHours() + hours);
  return newDate;
}

export function addMinutes(d, minutes) {
  const newDate = cloneDate(d);
  newDate.setMinutes(d.getMinutes() + minutes);
  return newDate;
}

export function addSeconds(d, seconds) {
  const newDate = cloneDate(d);
  newDate.setSeconds(d.getSeconds() + seconds);
  return newDate;
}

export function cloneDate(d) {
  if (d) {
    return new Date(d.getTime());
  }
  else {
    return undefined;
  }

}

export function cloneAsDate(d) {
  const clonedDate = cloneDate(d);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate;
}

export function getDaysInMonth(d) {
  const resultDate = getFirstDayOfMonth(d);

  if (resultDate) {
    resultDate.setMonth(resultDate.getMonth() + 1);
    resultDate.setDate(resultDate.getDate() - 1);
    return resultDate.getDate();
  }
  else return undefined;

}
export function getPatternDate(d, pattern) {
  if (d instanceof Date && pattern) {
    return null;
  }
  return undefined;
}
export function getFormatDecomposition(format) {
  var formats;
  if (!format) {
    formats = {
      dateFormat: momentFormat.Date,
      timeFormat: undefined
    };
  }
  else if (format === receiveFormat.LD) {
    formats = {
      dateFormat: momentFormat.Date,
      timeFormat: undefined
    };
  }
  else if (format === receiveFormat.LDLT) {
    formats = {
      dateFormat: momentFormat.Date,
      timeFormat: momentFormat.hourAndMinuteAndSecond
    };
  }
  else if (format === receiveFormat.LDT) {
    formats = {
      dateFormat: momentFormat.Date,
      timeFormat: momentFormat.hourAndMinute
    };
  }
  else if (format === receiveFormat.LT) {
    formats = {
      dateFormat: undefined,
      timeFormat: momentFormat.hourAndMinuteAndSecond
    };
  }
  else if (format === receiveFormat.T) {
    formats = {
      dateFormat: undefined,
      timeFormat: momentFormat.hourAndMinute
    };
  }
  else {
    formats = {
      dateFormat: momentFormat.Date,
      timeFormat: undefined
    };
  }
  formats.dateFormatHint = BComponent.Localization.stringLowerCase(BComponent.Localization.getDateTimeFormat(formats.dateFormat));
  if (formats.timeFormat)
    formats.timeFormatHint = BComponent.Localization.stringLowerCase(BComponent.Localization.getDateTimeFormat(formats.timeFormat));

  var dateMask = formats.dateFormatHint;
  var timeMask = formats.timeFormatHint;
  dateMask = dateMask.replaceAll('d', 'n');
  dateMask = dateMask.replaceAll('m', 'n');
  dateMask = dateMask.replaceAll('y', 'n');
  if (timeMask) {
    timeMask = timeMask.replaceAll('s', 'n');
    timeMask = timeMask.replaceAll('h', 'n');
    timeMask = timeMask.replaceAll('m', 'n');
  }


  formats.dateMask = dateMask;
  formats.timeMask = timeMask;

  return formats;
}

String.prototype.replaceAll = function (target, replacement) {
  return this.split(target).join(replacement);
};

export function getFirstDayOfMonth(d) {
  if (d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  else {
    return undefined;
  }

}

export function getFirstDayOfWeek() {
  const now = new Date();
  return new Date(now.setDate(now.getDate() - now.getDay()));
}

export function getWeekArray(d, firstDayOfWeek) {
  const dayArray = [];
  const daysInMonth = getDaysInMonth(d);
  const weekArray = [];
  let week = [];

  for (let i = 1; i <= daysInMonth; i++) {
    dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
  }

  const addWeek = (week) => {
    const emptyDays = 7 - week.length;
    for (let i = 0; i < emptyDays; ++i) {
      week[weekArray.length ? 'push' : 'unshift'](null);
    }
    if (week.length > 0 && week[0] == null) {
      var firstDayOfMonth = cloneDate(week[emptyDays]);
      for (var j = emptyDays; j > -1; j--) {
        if (week[j] === null) {
          firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1);
          week[j] = cloneDate(firstDayOfMonth);
        }
      }

    }
    else if (week.length == 7 && week[6] == null) {
      var lastDayOfMonth = cloneDate(week[7 - emptyDays - 1]);
      var beginIndex = 7 - emptyDays;
      for (var i = beginIndex; i < 7; i++) {
        if (week[i] === null) {
          lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
          week[i] = cloneDate(lastDayOfMonth);
        }
      }
    }
    weekArray.push(week);
  };

  dayArray.forEach((day) => {
    if (week.length > 0 && day.getDay() === firstDayOfWeek) {
      addWeek(week);
      week = [];
    }
    week.push(day);
    if (dayArray.indexOf(day) === dayArray.length - 1) {
      addWeek(week);
    }
  });

  return weekArray;
}

export function localizedWeekday(DateTimeFormat, day, firstDayOfWeek, format, localization) {
  const weekdayFormatter = new DateTimeFormat({ localizationWeekday: 'narrow', localization: localization, format: format });
  const firstDayDate = getFirstDayOfWeek();

  return weekdayFormatter.format(addDays(firstDayDate, day + firstDayOfWeek));
}

// Convert date to ISO 8601 (YYYY-MM-DD) date string, accounting for current timezone
export function formatIso(date) {
  return (new Date(`${date.toDateString()} 12:00:00 +0000`)).toISOString().substring(0, 10);
}

export function isEqualDate(d1, d2) {
  if (d1 === undefined && d2 === undefined) {
    return true;
  }
  if (isString(d1)) {
    d1 = new Date(d1);
  }
  if (isString(d2)) {
    d2 = new Date(d2);
  }
  return d1 && d2 && d1 instanceof Date && d2 instanceof Date &&
    (d1.getFullYear() === d2.getFullYear()) &&
    (d1.getMonth() === d2.getMonth()) &&
    (d1.getDate() === d2.getDate());
}
export function isEqualDateTime(d1, d2) {
  if (d1 === undefined && d2 === undefined) {
    return true;
  }
  if (isString(d1)) {
    d1 = new Date(d1);
  }
  if (isString(d2)) {
    d2 = new Date(d2);
  }
  return d1 && d2 && d1 instanceof Date && d2 instanceof Date &&
    (d1.getFullYear() === d2.getFullYear()) &&
    (d1.getMonth() === d2.getMonth()) &&
    (d1.getDate() === d2.getDate()) &&
    (d1.getHours() === d2.getHours()) &&
    (d1.getMinutes() === d2.getMinutes()) &&
    (d1.getSeconds() === d2.getSeconds());
}

export function substructDay(d1, d2) {
  if (isEqualDate(d1, d2)) {
    return 0;
  }
  else {
    return (d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000);
  }

}
export function isBeforeDate(d1, d2) {
  const date1 = cloneAsDate(d1);
  const date2 = cloneAsDate(d2);

  return (date1.getTime() < date2.getTime());

}

export function isAfterDate(d1, d2) {
  const date1 = cloneAsDate(d1);
  const date2 = cloneAsDate(d2);

  return (date1.getTime() > date2.getTime());
}

export function isBetweenDates(dateToCheck, startDate, endDate) {
  return (!(isBeforeDate(dateToCheck, startDate)) &&
    !(isAfterDate(dateToCheck, endDate)));
}

export function monthDiff(d1, d2) {
  let m;
  if (d1 && d2) {
    m = (d1.getFullYear() - d2.getFullYear()) * 12;
    m += d1.getMonth();
    m -= d2.getMonth();
  }
  return m;
}

export function yearDiff(d1, d2) {
  return ~~(monthDiff(d1, d2) / 12);
}
export function getFocusDateTimeItem1(startIndex, format, localization) {
  if (localization && format) {
    let patern = localization.getDateTimeFormat(format);
    if (patern) {
      let item = '';
      if (patern.length - 1 !== startIndex) {
        for (let i = startIndex; i <= 0; i++) {
          if (patern[i] === 'M' ||
            patern[i] === 'Y' ||
            patern[i] === 'D' ||
            patern[i] === 'd' ||
            patern[i] === 'h' ||
            patern[i] === 'm' ||
            patern[i] === 's' ||
            patern[i] === 'a') {
            item = item + patern[i];
          }
          else {
            break;
          }
        }
      }
      if (0 !== startIndex) {
        for (let i = startIndex - 1; i < patern.length; i--) {
          if (patern[i] === 'M' ||
            patern[i] === 'Y' ||
            patern[i] === 'D' ||
            patern[i] === 'd' ||
            patern[i] === 'h' ||
            patern[i] === 'm' ||
            patern[i] === 's' ||
            patern[i] === 'a') {
            item = item + patern[i];
          }
          else {
            break;
          }
        }
      }
      return item;
    }
  }
  return undefined;
}
export function getFocusDateTimeItem(value, startIndex, format, localization, type) {
  if (localization && format) {
    if (value) {
      let item = '';
      let itemBefore = '';
      let itemAfter = '';
      for (let i = startIndex; i >= 0; i--) {
        if (value[i] !== ' ' && !isNaN(Number(value[i])) && itemBefore.length === 0) {
          item = value[i] + item.toString();
        }
        else {
          itemBefore = value[i] + itemBefore.toString();
        }
      }
      for (let j = startIndex + 1; j < value.length; j++) {
        if (value[j] !== ' ' && !isNaN(Number(value[j])) && itemAfter.length === 0) {
          item = item.toString() + value[j];
        }
        else {
          itemAfter = itemAfter.toString() + value[j];
        }
      }
      if (item !== ' ' && !isNaN(item)) {
        item = Number(item);
        if (type === 1) item++;
        else item--;

        item = itemBefore + item + itemAfter;
        return item;
      }
    }
  }
  return undefined;
}
export function getMonthsLong(date, localization, format) {
  let newValue = getLocalizedDate(date);
  var momentObject = localization.getFormattedDateLocale(newValue, format);
  return momentObject._locale._months;
}
export function getMonthsShort(localization, newValue, format) {
  var momentObject = localization.getFormattedDateLocale(newValue, format);
  return momentObject._locale._monthsShort;
}
export function getWeekDays(localization, newValue, format) {
  var momentObject = localization.getFormattedDateLocale(newValue, format);
  return momentObject._locale._weekdays;
}
export function getWeekDaysShort(localization, newValue, format) {
  var momentObject = localization.getFormattedDateLocale(newValue, format);
  return momentObject._locale._monthsShort;
}
export function getWeekDaysMin(localization, newValue, format) {
  var momentObject = localization.getFormattedDateLocale(newValue, format);
  return momentObject._locale._weekdaysMin;
}
export function calendarMouseWheelAction(startIndex, format, localization, date, type, orijinalDate) {

  let newValue = getFocusDateTimeItem(date, startIndex, format, localization, type);

  var momentObject = localization.getFormattedDateLocale(newValue, format);
  if (momentObject && momentObject._isValid) {
    return momentObject._d;
  }
  else if (momentObject !== undefined && !momentObject._isValid) {
    let pf = localization.getFormattedDateLocale(newValue, format)._pf;
    let oldDate = cloneDate(orijinalDate);
    if (pf.overflow === 1) {
      // months
      return cloneDate(addMonths(oldDate, type));
    }
    else if (pf.overflow === 2) {
      // days
      return cloneDate(addDays(oldDate, type));
    }
    else if (pf.overflow === 3) {
      // hours
      return cloneDate(addHours(oldDate, type));
    }
    else if (pf.overflow === 4) {
      // minutes
      return cloneDate(addMinutes(oldDate, type));
    }
    else if (pf.overflow === 5) {
      // seconds
      return cloneDate(addSeconds(oldDate, type));
    }
  }
  return undefined;
}
export function calendarMouseWheelAction1(startIndex, format, localization, date, type) {
  let dateTimeItem = getFocusDateTimeItem(startIndex, format, localization);
  if (dateTimeItem) {
    if (dateTimeItem === 'DD') {
      if (type === 1)
        return addDays(date, 1);
      else
        return addDays(date, -1);
    }
    else if (dateTimeItem === 'YYYY') {
      if (type === 1)
        return addYears(date, 1);
      else
        return addYears(date, -1);
    }
    else if (dateTimeItem === 'MM') {
      if (type === 1)
        return addMonths(date, 1);
      else
        return addMonths(date, -1);
    }
    else if (dateTimeItem === 'h') {
      if (type === 1)
        return addHours(date, 1);
      else
        return addHours(date, -1);
    }
    else if (dateTimeItem === 'mm') {
      if (type === 1)
        return addMinutes(date, 1);
      else
        return addMinutes(date, -1);
    }
    else if (dateTimeItem === 'ss') {
      if (type === 1)
        return addSeconds(date, 1);
      else
        return addSeconds(date, -1);
    }
    else if (dateTimeItem === 'a') {
      if (type === 1)
        return addHours(date, 12);
      else
        return addSeconds(date, -12);
    }
  }
}
export function calendarMouseWheel(value, selectionStart, selectionEnd, deltaMode, seperator) {
  if (value && deltaMode && selectionStart !== undefined && selectionEnd !== undefined) {
    var array = value.split(seperator);
    var selectionValue = '';
    var index = '';
    array.forEach(function (item, i) {
      if (!selectionValue) {
        if (item.length >= selectionStart) {
          selectionValue = item;
          index = i;
        }
        else selectionStart = selectionStart - (item.length + 1);
      }

    }, this);

    if (deltaMode === 'up' && !isNaN(Number(selectionValue))) {
      selectionValue = Number(selectionValue) + 1;
      array[index] = selectionValue;
      return arrayToString(array, seperator);
    }
    else if (deltaMode === 'down' && !isNaN(Number(selectionValue))) {
      selectionValue = Number(selectionValue) - 1;
      array[index] = selectionValue;
      return arrayToString(array, seperator);
    }
  }
  return undefined;
}
export function arrayToString(array, seperator) {
  var returnString = '';
  for (let i = 0; i < array.length; i++) {
    returnString = returnString + (array.length - 1 === i ? (array[i]) : (array[i] + seperator));
  }
  return returnString;
}
export function calendarMouseWheelToDateTime(displayDateValue, selectedDate, type, datetimeOption) {
  if (displayDateValue && selectedDate instanceof Date && type) {
    var clone = cloneDate(selectedDate);
    var array = displayDateValue.split(seperator);
    if (type === 1 && array.length === 3) {
      clone.setDate(Number(array[0]));
      clone.setMonth(Number(array[1]) - 1);
      clone.setFullYear(Number(array[2]));
    }
    else if (type === 2 && array.length === 3) {
      clone.setHours(Number(array[0]));
      clone.setMinutes(Number(array[1]));
      clone.setSeconds(Number(array[2]));
    }
    else if (type === 2 && array.length === 2) {
      if (datetimeOption.isHour)
        clone.setHours(Number(array[0]));
      if (datetimeOption.isMinute)
        clone.setMinutes(Number(array[1]));
      if (datetimeOption.isSecond)
        clone.setSeconds(Number(array[1]));
    }
  }
  else {
    warning(false, 'unexpected params');
  }
  return clone;
}

export function getDatePickerStyle(context) {

  const boaPalette = context.theme.boaPalette;
  const palette = context.theme.palette;
  let datePicker = {
    calWorkDay: boaPalette.calWorkDay,
    calWeekend: boaPalette.calWeekend,
    calHoliday: boaPalette.calHoliday,
    calEve: boaPalette.calEve,
    calReliHoliday: boaPalette.calReliHoliday,
    dayBackgroundsShape: '3px',
    color: palette.primary1Color,
    dayButtonColor: boaPalette.base500,
    dayBorder: '1px solid ' + boaPalette.pri500,
    holidayButtonColor: boaPalette.base300,
    holidayTextColor: boaPalette.base300,
    dateTextColor: boaPalette.base500,
    todayButtonBackgroundColor: boaPalette.pri500,
    todayButtonTextColor: boaPalette.comp500,
    textColor: palette.alternateTextColor,
    inputTextColor: boaPalette.base450,
    inputTextFontSize: 11,
    floatingLabelTextColor: boaPalette.base450,
    floatingLabelTextFontSize: 14,
    calendarTextColor: palette.textColor,
    selectColor: palette.primary2Color,
    selectTextColor: boaPalette.comp500,
    calendarYearBackgroundColor: palette.canvasColor,
    calendarBorder: '1px solid',
    calendarBorderColor: palette.borderColor,
    datetimeBaseTitleBackgroundColor: boaPalette.base10,
    datetimeBaseTitleBorderColor: boaPalette.base50,
    datetimeBaseTitleColor: boaPalette.base400,
    datetimeBaseTitleFontSize: 14,
    equalWidthContainerDisplay: 'flex',
    equalWidthContainerFlexWrap: 'nowrap',
    equalWidthItemFlex: '1 1',
    dateTimeItemFlex: '2 1',
    dialogMarginTop: 30,
  };

  return datePicker;
}

