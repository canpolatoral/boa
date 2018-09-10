import { BComponent } from 'b-component';
export class Messages {

  constructor() {

  }

  static getTableFilterRow() {
    return {
      filterPlaceholder: BComponent.Messaging.getMessage('BusinessComponents', 'GridFilter'),
      contains: BComponent.Messaging.getMessage('BusinessComponents', 'GridInclude'),
      notContains: BComponent.Messaging.getMessage('BusinessComponents', 'GridNotInclude'),
      startsWith: BComponent.Messaging.getMessage('BusinessComponents', 'GridStartWith'),
      endsWith: BComponent.Messaging.getMessage('BusinessComponents', 'GridEndWith'),
      equal: BComponent.Messaging.getMessage('BusinessComponents', 'GridEqual'),
      notEqual: BComponent.Messaging.getMessage('BusinessComponents', 'GridNotEqual'),
      greaterThan: BComponent.Messaging.getMessage('BusinessComponents', 'GridGreaterThan'),
      greaterThanOrEqual: BComponent.Messaging.getMessage('BusinessComponents', 'GridGreaterThanOrEqual'),
      lessThan: BComponent.Messaging.getMessage('BusinessComponents', 'GridLessThan'),
      lessThanOrEqual: BComponent.Messaging.getMessage('BusinessComponents', 'GridLessThanOrEqual')
    };
  }

  static getTableHeaderRow() {
    return {
      sortingHint: BComponent.Messaging.getMessage('BusinessComponents', 'GridSortingHint')
    };
  }

  static getGroupingPanel() {
    return {
      groupByColumn: BComponent.Messaging.getMessage('BusinessComponents', 'GridGroupByColumn')
    };
  }

  static getTable() {
    return {
      noData: BComponent.Messaging.getMessage('BusinessComponents', 'GridNoData')
    };
  }

}
export default Messages;
