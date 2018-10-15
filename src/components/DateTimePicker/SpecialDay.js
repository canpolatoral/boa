import React from 'react';
import PropTypes from 'prop-types';
import { ComponentBase } from '@boa/base';
import { Divider } from '@boa/components/Divider';
import {
  cloneDate,
  getFirstDayOfMonth,
  getMonthsShort,
  getDatePickerStyle
} from './dateUtils';

const dayType = {
  EmptyDay: -1,
  WorkDay: 0,
  WeekendDay: 1,
  Holiday: 2,
  Eve: 3,
  ReliHoliday: 4,
};

function getStyles(props, type) {
  const datePicker = getDatePickerStyle(props.context);
  let dateTextColor = datePicker.DateTextColor;
  let EveHolidayBoxColor = datePicker.calEve;
  let HolidayBoxColor = datePicker.calHoliday;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderTop: '1px solid ' + dateTextColor,
      borderBottom: '1px solid ' + dateTextColor,
      paddingTop: 12,
      paddingBottom: 12,

    },
    child: {
      display: 'flex',
      flexDirection: 'row',
      marginleft: 1,
      alignItems: 'center',
      marginTop: -2
    },
    item: {
      height: 24,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemDate: {
      fontSize: 11,
      color: props.context.theme.boaPalette.base300,
      marginLeft: 4
    },
    itemDescription: {
      opacity: 1,
      fontSize: 11,
      color: props.context.theme.boaPalette.base450,
      marginLeft: 4,
    },
    Box: {
      width: 10,
      height: 10,
      background: type === dayType.Eve ? EveHolidayBoxColor : HolidayBoxColor,
    },
  };

}

class SpecialDay extends ComponentBase {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    specialDayType: PropTypes.number,
    calendarInfo: PropTypes.array,
    selectedDate: PropTypes.object.isRequired,
    format: PropTypes.string,
  };
  static defaultProps = {
    selected: false,
    disabled: false,
    calendarInfo: [],
  };
  getDayList(calendarInfo, selectedDate, dayType, betweenDayCount) {
    // let monthFirstDate = cloneDate(getFirstDayOfMonth(selectedDate));
    let specialDayStringArray = [];
    let selectedMonth = selectedDate.getMonth();

    for (let i = 0; i < calendarInfo.length; i++) {
      // aynı ay içerisinde bir özel gün bulundu ise betweenDayCount kadar ileri geri gidilerek günler bulunur
      // aynı degerleri tekrardan gezmemek için var olan list içerisinde dolaşılıp break yapılur
      let sameValue = false;
      if (specialDayStringArray !== undefined && specialDayStringArray.length > 0) {
        for (let list = 0; list < specialDayStringArray.length; list++) {
          if (specialDayStringArray[list] !== undefined && specialDayStringArray[list].length > 0) {
            for (let item = 0; item < specialDayStringArray[list].length; item++) {
              let itemList = specialDayStringArray[list];
              if (itemList[item] !== undefined && itemList[item].day === calendarInfo[i].day) {
                sameValue = true;
              }
            }
          }
        }
        if (sameValue) continue;
      }
      if (dayType === calendarInfo[i].dayType && calendarInfo[i].day.getMonth() === selectedMonth) {

        let itemspecialDayString = [];
        itemspecialDayString.push(calendarInfo[i]);
        let negativeBetweenDaylength = i - betweenDayCount;


        for (let j = i - 1; j > negativeBetweenDaylength; j--) {
          if (calendarInfo[i].dayType !== calendarInfo[j].dayType) {
            break;
          }
          else {
            itemspecialDayString.push(calendarInfo[j]);
          }
        }


        let positiveBetweenDaylength = i + betweenDayCount;
        for (let j = i + 1; j < positiveBetweenDaylength; j++) {
          if (calendarInfo[i].dayType !== calendarInfo[j].dayType) {
            break;
          }
          else {
            itemspecialDayString.push(calendarInfo[j]);
          }
        }
        specialDayStringArray.push(itemspecialDayString);
      }

    }
    return specialDayStringArray;
  }
  getSpecialDayList(calendarInfo, selectedDate) {
    const styleEve = getStyles(this.props, dayType.Eve);
    const styleHoliday = getStyles(this.props, dayType.Holiday);
    const betweenDayCount = 5;
    let returnObject = [];
    let EveList = this.getDayList(calendarInfo, selectedDate, dayType.Eve, betweenDayCount);
    let HolidayList = this.getDayList(calendarInfo, selectedDate, dayType.Holiday, betweenDayCount);
    let Eve = this.getHoliday(EveList, styleEve);
    let Holiday = this.getHoliday(HolidayList, styleHoliday);
    if (Eve && Eve.length > 0) returnObject.push(Eve);
    if (Holiday && Holiday.length > 0) returnObject.push(Holiday);
    return returnObject;
  }
  getHoliday(Mainlist, style) {
    let MainDiv = [];
    for (let i = 0; i < Mainlist.length; i++) {
      let eveItem;
      let list = Mainlist[i];
      if (list.length > 1) {

        eveItem = this.getMultiHoliday(list, style);
      }
      else {
        eveItem = this.getSingleHoliday(list, style);
      }
      MainDiv.push(eveItem);
    }
    return MainDiv;
  }
  getMultiHoliday(list, style) {
    let itemOne = list[0];
    let itemOneDate = new Date(itemOne.day);
    let itemTwo = new Date(list[list.length - 1].day);
    let HolidayName = itemOne.description ? itemOne.description.replace('1*', '') : '';

    let MonthNameList = getMonthsShort(itemOneDate, this.props.format);
    let MonthName = MonthNameList[itemOneDate.getMonth()];
    let beginDay = itemOneDate.getDate();
    let EndDay = itemTwo.getDate();
    let multiHoliday = (
      <div style={style.item}>
        <div style={style.Box}></div>
        <div style={style.child}>
          <div style={Object.assign({}, style.itemDate, { marginLeft: 6 })}>
            {beginDay}-{EndDay} {MonthName}</div>
          <div style={Object.assign({}, style.itemDate, { marginLeft: 0 })} >:</div>
          <div style={style.itemDescription}>{HolidayName}</div>
        </div>
      </div>
    );
    return multiHoliday;
  }
  getSingleHoliday(list, style) {

    let itemOne = list[0];
    let itemOneDate = new Date(itemOne.day);
    let HolidayName = itemOne.description ? itemOne.description.replace('1*', '') : '';
    let MonthNameList = getMonthsShort(itemOneDate, this.props.format);
    let MonthName = MonthNameList[itemOneDate.getMonth()];
    let beginDay = itemOneDate.getDate();
    let singleHoliday = (
      <div style={style.item}>
        <div style={style.Box}></div>
        <div style={style.child}>
          <div style={Object.assign({}, style.itemDate, { marginLeft: 6 })}>{beginDay} {MonthName}</div>
          <div style={Object.assign({}, style.itemDate, { marginLeft: 0 })} >:</div>
          <div style={style.itemDescription}>{HolidayName}</div>
        </div>
      </div>
    );
    return singleHoliday;
  }
  render() {
    let monthFirstDate = cloneDate(getFirstDayOfMonth(this.props.selectedDate));

    let specialDays = this.getSpecialDayList(this.props.calendarInfo, monthFirstDate);

    return (
      <div>
        {specialDays.length === 0 &&
          <Divider
            context={this.props.context}
            style={{
              width: 'calc(100%)',
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 12
            }} />
        }
        {specialDays.length > 0 &&
          <div >
            <Divider
              context={this.props.context}
              style={{
                width: 'calc(100% + 24px)',
                marginBottom: 12,
                marginLeft: -12,
                marginRight: -12,
                marginTop: 14
              }} />
            {specialDays}
            <Divider
              context={this.props.context}
              style={{
                width: 'calc(100% + 24px)',
                marginBottom: 0,
                marginLeft: -12,
                marginRight: -12,
                marginTop: 12
              }} />
          </div>
        }
      </div>
    );
  }
}

export default SpecialDay;
