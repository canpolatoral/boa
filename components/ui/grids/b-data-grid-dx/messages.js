import { getFrameworkMessage } from 'b-messaging';
export class Messages {

  constructor() {

  }

  static  getTableFilterRow() {
    return {
      filterPlaceholder: getFrameworkMessage('BusinessComponents', 'GridFilter'),
      contains: getFrameworkMessage('BusinessComponents', 'GridInclude'),
      notContains:getFrameworkMessage('BusinessComponents', 'GridNotInclude'),
      startsWith:getFrameworkMessage('BusinessComponents', 'GridStartWith'),
      endsWith:getFrameworkMessage('BusinessComponents', 'GridEndWith'),
      equal:getFrameworkMessage('BusinessComponents', 'GridEqual'),
      notEqual:getFrameworkMessage('BusinessComponents', 'GridNotEqual'),
      greaterThan: getFrameworkMessage('BusinessComponents', 'GridGreaterThan'),
      greaterThanOrEqual:getFrameworkMessage('BusinessComponents', 'GridGreaterThanOrEqual'),
      lessThan: getFrameworkMessage('BusinessComponents', 'GridLessThan'),
      lessThanOrEqual: getFrameworkMessage('BusinessComponents', 'GridLessThanOrEqual')
    };
  }

  static  getTableHeaderRow() {
    return {
      sortingHint: getFrameworkMessage('BusinessComponents', 'GridSortingHint')
    };
  }

  static  getGroupingPanel() {
    return {
      groupByColumn:getFrameworkMessage('BusinessComponents', 'GridGroupByColumn')
    };
  }

  static  getTable () {
    return {
      noData: getFrameworkMessage('BusinessComponents', 'GridNoData')
    };
  }

}
export default Messages;
