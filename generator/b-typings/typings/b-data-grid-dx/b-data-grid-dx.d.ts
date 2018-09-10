
declare namespace __BDataGridDX {


  interface BDataGridProps extends __BComponent.BComponentProps {

      /** Specifies for which row fields columns are created. */
      columns?: Array<Column>;

      /** An array containing custom data. A user defines the access to this data. Refer to Data Accessors for details. */
      dataSource?: Array<any>;

      /** Grid header bar options */
      headerBarOptions?: HeaderBarOptions;

      /** Grid editing data options */
      editingDataOptions?: EditingDataOptions;

      /** Grid tree data options */
      treeDataOptions?: TreeDataOptions;

      /** Grid height */
      height?: number;

      /** Grid max height */
      maxHeight?: number;

      /** Grid sortable prop. default true */
      sortable?: boolean;

      /** Grid groupable prop. default true */
      groupable?: boolean;

      /** Grid filterable prop. default true */
      filterable?: boolean;

      /** Grid columnMenu prop. default true */
      columnMenu?: boolean;

      /** Grid reordable prop. default true */
      reordable?: boolean;

      /** Grid resizable prop. default true */
      resizable?: boolean;

      /** Grid useNotVirtualization prop. default false. If true, virtualization is disabled. not recommended for large size data */
      useNotVirtualization?: boolean;

      /** Grid show prop. default true */
      showGrid?: boolean;

      /** Grid isInsideTheCard prop. default true. If grid is not used in a card, it is set to false */
      isInsideTheCard?: boolean;

      /** Specifies the applied sorting. */
      sorting?: ColumnSorting[];

      /** Specifies the applied grouping. */
      grouping?: ColumnGrouping[];

      /** Specifies the applied filters. */
      filters?: ColumnFiltering[];

      /** Specifies the applied expandedGroups. A string value that consists of values by which rows are grouped, separated by the | character. For example, the expanded group ‘Male’ is described as Male and ‘Male’/’Audi’ as Male|Audi and so on. */
      expandedGroups?: string[];

      /** Specifies the applied selected index. */
      selectedIndexes?: number[];

      /** Grid selectable prop. default none
       *  none              : none
       *  multiple          : multiple selection
       *  single            : single selection with radio button
       *  singleNonPointer  : single selection without radio button
      */
      selectable?: 'none' | 'single' | 'multiple' | 'singleNonPointer';

      /** Handles selection changes. */
      onRowSelectionChanged?: (dataItem: any, selectedIndex: number) => void;

      /** Specifies the applied row style. */
      rowStyle?: (row: any, context: any) => React.CSSProperties;

      /** Handles row double click. */
      onRowDoubleClick?: (row: any) => void;

      /** Grid subGridProperties. Hierarcihy grid */
      subGridProperties?: (row: any, context: any) => BDataGridProps;

      /** A React node used to render row detail content. */
      rowDetail?: (row: any, context: any) => React.ReactNode;

      /**
      * Specifies column displayGridOnNoRow prop. default false.
      * Set true if you want to show the Grid when DataSource is empty
      */
      displayGridOnNoRow?: boolean;

      /** Grid checkedGrouping prop. defualt false*/
      checkedGrouping?: boolean,

      /** Grid checkedFiltering prop. defualt false*/
      checkedFiltering?: boolean,

      /** Grid showHeaderRow prop. defualt true*/
      showHeaderRow?: boolean,

  }


  /** Defines the column configuration object. Used to display data stored in a row. */
  interface Column {

      /** Specifies the column name or the name of a row field whose value the column displays. If the column name does not match any field name, specify the `getCellValue` function. */
      name?: string;

      /** @deprecated use name property */
      key?: string;

      /** Specifies the column title. */
      title?: string;

      /** Specifies the column width. */
      width?: number;

      /** Specifies the word wrap. default false */
      wordWrapEnabled?: boolean;

      /** Specifies cell text align. default left */
      align?: 'left' | 'right' | 'center';

      /** Specifies hidden. default false */
      hidden?: boolean;

      /** Specifies column type. Many features such as data formatting, column widths, column alignments are automatically set. */
      type: 'string' | 'date' | 'number' | 'decimal' | 'iban' | 'card' | 'telephone' | 'boolean' | 'custom';

      /** Specifies column date format. default 'L' todo:bilgin linki...
      *
      *         LT : 'HH:mm',
      *         LTS : 'HH:mm:ss',
      *         L : 'DD.MM.YYYY',
      *         LL : 'D MMMM YYYY',
      *         LLL : 'D MMMM YYYY HH:mm',
      *         LLLL : 'dddd, D MMMM YYYY HH:mm'
      */
      dateFormat?: 'L' | 'LL' | 'LLL' | 'LT' | 'L LTS' | 'LTS' | 'LLLL' | 'L LT';

      /** Specifies column date format. default if type= decimal 'M' else type=number 'D'   todo:bilgin linki...
       *
       * type decimal;
       *      D: '0'
       *      F: '0.00'
       *      M: '0.0,'
       *      FX: '0.0,00'
       *
       * type number;
       *      D: '0'
       *      F: '0,0'
      */
      numberFormat?: 'D' | 'F' | 'M' | 'FX';

      /** A React node used to render cell content. */
      reactTemplate?: (row: any, context?: any, column?: Column) => React.ReactNode;

      /** A React node used to render cell content by edit mode. */
      editTemplate?: (row: any, context?: any, column?: Column) => React.ReactNode;

      /** Specifies cell box style. */
      cellStyle?: (row: any, context?: any, column?: Column) => React.CSSProperties;

      /** Specifies text style. */
      textStyle?: (row: any, context?: any, column?: Column) => React.CSSProperties;

      /** Specifies column format. return formatted text */
      columnFormat?: (value: any, column?: Column) => string;

      /**
       * Specifies column clickable prop. default false.
       * If you are using a reactTemplate (or editTemplate) and you want to make selections on line clicks, choose true.
       */
      clickable?: boolean;

  }

  /** Grid header bar options interface */
  interface HeaderBarOptions {

      /** Grid show prop. default true */
      show?: boolean,

      /** Grid title*/
      title?: string,

      /** Grid showTitle prop. defualt true*/
      showTitle?: boolean,

      /** Grid showGrouping prop. defualt true*/
      showGrouping?: boolean,

      /** Grid showFiltering prop. defualt true*/
      showFiltering?: boolean,

      /** Grid showMoreOptions prop. defualt true*/
      showMoreOptions?: boolean,

      /** Grid showDelete prop. defualt false*/
      showDelete?: boolean,

      /** Grid showDivit prop. defualt false*/
      showDivit?: boolean,

      /** Grid showAdd prop. defualt false*/
      showAdd?: boolean,

      /** Handles onToggleDivit. */
      onToggleDivit?: () => void;

      /** Handles onToggleDelete click. */
      onToggleDelete?: () => void;

      /** Handles onToggleAdd. */
      onToggleAdd?: () => void;

  }

  /** Grid editing data options interface */
  interface EditingDataOptions {

      /** Specifies whether to render the 'New' command within the header row's command cell. */
      showAddCommand?: boolean,

      /** Specifies whether to render the 'Delete' command within the data row's command cell. */
      showDeleteCommand?: boolean,

      /** Specifies whether to render the 'Edit' command within the data row's command cell. */
      showEditCommand?: boolean,

      /** Specifies added new object instance */
      emptyData?: any,

      /** Handles row changes committing. */
      onCommitChanges?: (added?: any, changed?: any, deleted?: any) => void;
  }

  /** Grid tree data options interface */
  interface TreeDataOptions {

      /** Specifies column name */
      for: string,

      /** A function that extracts child rows from the specified data. It is executed recursively for the root and nested rows. The `currentRow` parameter is `null` for root rows. The return value should be null if a row is a leaf, otherwise, it should be an array of rows. If child rows are not available, the function should return an empty array. */
      getChildRows: (row?: any, rootRows?: any, context?: any) => void;
  }

  /** Grid sorting data options interface */
  interface ColumnSorting {

      /** The name of a column to extend. */
      columnName: string;

      /** Specifies the sorting direction. */
      direction: 'asc' | 'desc';
  }

  /** Grid grouping options interface */
  interface ColumnGrouping {

      /** The name of a column to extend. */
      columnName: string;
  }

  /** Grid filter options interface */
  interface ColumnFiltering {

      /** The name of a column to extend. */
      columnName: string;

      /** Specifies the filter value. */
      value?: string;
  }


  interface BDataGridInstance extends __BComponent.BComponentInstance {

      /** Returns selected row */
      getSelectedRowIndexes: () => number[];

      /** Add new row current data */
      addNewRow?: (row?: any) => void;

      /** Returns current data */
      getDataSource?: () => any[];

      /** Delete row */
      deleteRows?: (row?: any[]) => void;

      /** Returns selected items */
      getSelectedItems?: () => any[];

      /** Refresh Grid */
      refreshGrid?: () => void;

      /** Returns user setting */
      getUserSettings?: () => any;

  }

  export class BDataGrid extends __BComponent.BComponetBase<BDataGridProps, BDataGridInstance> {

      /** Returns current data */
      getDataSource?: () => any[];

      static getFormatedColumnValue?: (value: any, column: any, row: any) => string;
  }
}



declare module 'b-data-grid-dx' {
  export import BDataGrid = __BDataGridDX.BDataGrid;
  export import HeaderBarOptions = __BDataGridDX.HeaderBarOptions;
  export import EditingDataOptions = __BDataGridDX.EditingDataOptions;
  export import TreeDataOptions = __BDataGridDX.TreeDataOptions;
  export import Column = __BDataGridDX.Column;
  export import ColumnSorting = __BDataGridDX.ColumnSorting;
  export import ColumnGrouping = __BDataGridDX.ColumnGrouping;
  export import ColumnFiltering = __BDataGridDX.ColumnFiltering;
  export default BDataGrid;

}
