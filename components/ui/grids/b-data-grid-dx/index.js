import React from 'react';
import PropTypes from 'prop-types';
import Selection from './templates/selection';
import Cell from './templates/cell';
import Row from './templates/row';
import EditRow from './templates/edit-row';
import BTable from './templates/table';
import RowDetail from './templates/row-detail';
import  HeaderBar  from './templates/toolbar';
import  FormatterProvider  from './provider/formatter-provider';
import  EditorProvider  from './provider/editor-provider';
import { UIHelper } from './ui-helper';
import * as XLSX from 'xlsx';
import { BPopover } from 'b-popover';
import { BMenuItem } from 'b-menu-item';
import { BCheckBoxGroup } from 'b-check-box-group';
import { findDOMNode } from 'react-dom';
import { BFormManager } from 'b-form-manager';

import {
  BComponent,
  BComponentComposer
} from 'b-component';

import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  Table,
  TableGroupRow,
  GroupingPanel,
  DragDropProvider,
  Toolbar,
  TableSelection,
  TableColumnVisibility,
  TableFilterRow,
  TableColumnReordering,
  TableColumnResizing,
  TableRowDetail,
  TableTreeColumn,
  TableEditRow,
  TableEditColumn,

} from '@devexpress/dx-react-grid-material-ui';

import {
  SortingState,
  IntegratedSorting,

  GroupingState,
  IntegratedGrouping,

  SelectionState,
  IntegratedSelection,

  FilteringState,
  IntegratedFiltering,

  Column,
  TableColumnWidthInfo,
  ColumnExtension,
  Sorting,

  RowDetailState,

  TreeDataState,
  CustomTreeData,
  EditingState

} from '@devexpress/dx-react-grid';
import { Messages } from './messages';


/**
 * Selectables enum
 */
export var Selectables;
(function (Selectables) {
  Selectables[Selectables['NONE'] = 'none'] = 'NONE';
  Selectables[Selectables['SINGLE'] = 'single'] = 'SINGLE';
  Selectables[Selectables['MULTIPLE'] = 'multiple'] = 'MULTIPLE';
  Selectables[Selectables['SINGLENONPOINTER'] = 'singleNonPointer'] = 'SINGLENONPOINTER';
})(Selectables || (Selectables = {}));

@BComponentComposer
export class BDataGrid extends BComponent {

  static propTypes = {

    dataSource: PropTypes.array,

    headerBarOptions: PropTypes.shape({
      show: PropTypes.bool,
      title: PropTypes.string,
      showTitle: PropTypes.bool,
      showGrouping: PropTypes.bool,
      showFiltering: PropTypes.bool,
      showMoreOptions: PropTypes.bool,
      showDelete: PropTypes.bool,
      showDivit: PropTypes.bool,
      showAdd: PropTypes.bool
    }),

    editingDataOptions: PropTypes.shape({
      onCommitChanges: PropTypes.func,
      showAddCommand:PropTypes.bool,
      showDeleteCommand:PropTypes.bool,
      showEditCommand:PropTypes.bool,
      emptyData:PropTypes.any
    }),

    treeDataOptions: PropTypes.shape({
      for: PropTypes.string,
      getChildRows: PropTypes.func
    }),

    columns: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string, // object name
      title:PropTypes.string, // column title
      key: PropTypes.string,  // bu kullanılmayacak, geriye destek için eklendi,

       /**
       * Specifies column clickable prop. default false.
       * If you are using a reactTemplate (or editTemplate) and you want to make selections on line clicks, choose true.
       */
      clickable : PropTypes.bool
    })).isRequired,

    sorting: PropTypes.arrayOf(PropTypes.shape({
      columnName: PropTypes.string,
      direction:PropTypes.oneOf(['asc', 'desc'])
    })),

    grouping: PropTypes.arrayOf(PropTypes.shape({
      columnName: PropTypes.string
    })),

    filters: PropTypes.arrayOf(PropTypes.shape({
      columnName: PropTypes.string,
      value: PropTypes.string
    })),

    expandedGroups:PropTypes.array,

    height: PropTypes.number,

    sortable: PropTypes.bool,
    groupable: PropTypes.bool,
    filterable: PropTypes.bool,
    columnMenu: PropTypes.bool,
    reordable: PropTypes.bool,
    resizable: PropTypes.bool,

    /**
     * singleNonPointer: checkbox ve radio button görüntülenmez.
     */
    selectable: PropTypes.oneOf(['none', 'single', 'multiple', 'singleNonPointer']),
    multiSelection:PropTypes.bool, // geriye destek
    selectedIndexes: PropTypes.any,

    useNotVirtualization:PropTypes.bool,
    showGrid: PropTypes.bool,

    onRowSelectionChanged: PropTypes.func,
    isInsideTheCard:PropTypes.bool,

    rowStyle: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    rowHeight:PropTypes.number,

    /**
    * Specifies column displayGridOnNoRow prop. default false.
    * Set true if you want to show the Grid when DataSource is empty
    */
    displayGridOnNoRow:PropTypes.bool,

    userSetting: PropTypes.any,

    checkedGrouping: PropTypes.bool,
    checkedFiltering: PropTypes.bool,
    showHeaderRow:PropTypes.bool,
    maxHeight:PropTypes.number
  }

  static defaultProps = {
    rowHeight:36,
    height:undefined,
    maxHeight:500,
    sortable:true,
    groupable:true,
    filterable:true,
    columnMenu:true,
    reordable: true,
    resizable: true,
    selectable:Selectables.NONE,
    useNotVirtualization:false,
    showGrid: true,
    sorting:[],
    grouping:[],
    filters :[],
    expandedGroups:[],
    expandedRowIds:[],
    editingRowIds: [],
    addedRows: [],
    rowChanges: {},
    isInsideTheCard:true,
    displayGridOnNoRow:false,
    checkedGrouping:false,
    checkedFiltering:false,
    showHeaderRow:true,
    headerBarOptions: {
      title:'Sonuç Listesi',
      show: true,
      showTitle: true,
      showGrouping: true,
      showFiltering: true,
      showMoreOptions: true,
      showDelete: false,
      showDivit: false,
      showAdd: false

    },
  }

  constructor(props, context) {
    super(props, context);

    // eski kullanım olan multiSelection alanına destek için.
    let selectable=props.multiSelection ? Selectables.MULTIPLE:props.selectable;

    let columnArray=BDataGrid.prepareColumns(props.columns);
    let dataSource=BDataGrid.prepareDataSource(props);
    let userSettings=BDataGrid.prepareSetting(props);
    let controlledProps=BDataGrid.controlledProps(props);

    this.state = {
      ...this.state,
      ...props,
      ...controlledProps,
      ...columnArray,
      ...userSettings,
      selectable:selectable,
      dataSource:dataSource,
      selectedIndexes:BDataGrid.prepareSelectedIndex( selectable, dataSource)

    };
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.columns  != nextProps.columns) {
      let columnArray=BDataGrid.prepareColumns(nextProps.columns);
      this.setState({
        ...columnArray,
      });
    }

    if (this.props.dataSource != nextProps.dataSource ||
      this.props.selectedIndexes != nextProps.selectedIndexes
    ) {
      let dataSource=BDataGrid.prepareDataSource(nextProps);
      this.setState({
        dataSource:dataSource,
        selectedIndexes: BDataGrid.prepareSelectedIndex(this.props.selectable, dataSource )

      });
    }
    if (this.props.height  != nextProps.height  ) {
      this.setState({
        height: (nextProps.heights && nextProps.heights !=this.state.height ) ? nextProps.heights: this.state.height
      });
    }

    if (this.props.maxHeight  != nextProps.maxHeight  ) {
      this.setState({
        maxHeight: nextProps.maxHeight
      });
    }

    if (this.props.grouping != nextProps.grouping) {
      let controlledProps=BDataGrid.controlledProps(nextProps);
      this.setState({
        grouping: nextProps.grouping,
        ...controlledProps
      });
    }

    if (this.props.filters != nextProps.filters) {
      let controlledProps=BDataGrid.controlledProps(nextProps);
      this.setState({
        filters: nextProps.filters,
        ...controlledProps
      });
    }
    
    if (this.props.sorting != nextProps.sorting) {
      let controlledProps=BDataGrid.controlledProps(nextProps);
      this.setState({
        sorting: nextProps.sorting,
        ...controlledProps
      });
    }

  }

  static controlledProps(props) {

    let checkedGrouping;
    let checkedFiltering;

    if (props.grouping && props.grouping.length>0)
      checkedGrouping=true;

    if (props.filters && props.filters.length>0)
      checkedFiltering=true;
    return {
      checkedGrouping,
      checkedFiltering
    };

  }

  /**
   * prepareSetting
   * @param {*} props
   */
  static prepareSetting(props) {

    /**
     * props.columns  ile ayarlarda tutulan sutun tanımları aynı değil ise kullanıcı ayarları uygulanmaz.
     */
    if (props.userSetting  &&
      JSON.stringify(props.userSetting.initialColumnDefinition)==JSON.stringify(props.columns)) {
      return props.userSetting;
    }
    return {};

  }

  /**
   * getUserSettings
   */
  getUserSettings() {

    if ((this.state.dataSource == undefined
      || this.state.dataSource.length == 0)
    ) {
      return null;
    }
    return {
      checkedGrouping:this.state.checkedGrouping,
      sorting:this.state.sorting,
      grouping:this.state.grouping,
      columnWidths:this.state.columnWidths,
      columnOrder:this.state.columnOrder,
      hiddenColumnNames:this.state.hiddenColumnNames,
      columnChoicerCheckBoxList:this.state.columnChoicerCheckBoxList,
      initialColumnDefinition:this.props.columns
    };
  }

  /**
  * saveGridSettings
  */
  saveGridSettings() {
    if (
      this.props.page &&
      this.props.page.state.pageParams &&
      this.props.page.state.pageParams.resourceInfo &&
      this.getUserSettings()!=null ) {
      BFormManager.saveGridSetting(
        this.state.context.applicationContext.user.userName,
        this.props.page.state.pageParams.resourceInfo.resourceCode,
        JSON.stringify(this.getUserSettings())
      );
      this.props.page.showStatusMessage('Görünüm kaydedildi.');
    }
  }

  /**
   * prepareColumns
   * @param {*} columns
   */
  static prepareColumns(columns:Column):Column[] {

    let columnWidths:Array<TableColumnWidthInfo>=[];
    let columnOrder:Array<string>=[];
    let beFormatedColumns:Array<string>=[];
    let columnExtensions:Array<string>=[];
    let reactTemplateColumns:Array<string>=[];
    let hiddenColumnNames:Array<string>=[];
    let columnChoicerCheckBoxList=[];
    let newColumnList:Column[]=[];

    columns && columns.length>0 && columns.forEach((column) => {

      // geriye dönük destek için eklendi, ilerde kaldırılabilir.
      if (column.key &&
        (column.title==null ||column.title==undefined)) {
        column.title=column.name;
        column.name=column.key;
      }

      let isExists=newColumnList.find((element)=>element.name==column.name);

      if (isExists==undefined) {
        newColumnList.push(column);
      }

      // column width
      let columnWidth:TableColumnWidthInfo={};
      columnWidth.columnName=column.name;
      columnWidth.width=column.width ? column.width :UIHelper.getColumnWidth(column);
      columnWidths.push(columnWidth);

      // column order
      columnOrder.push(column.name);

      // be formated
      if ( (column.type=='date' ||
          column.type=='number' ||
          column.type=='decimal' ||
          column.type=='iban' ||
          column.type=='card' ||
          column.type=='telephone' ||
          column.type=='boolean' ) &&
          !column.reactTemplate
        )
        beFormatedColumns.push(column.name);

      // react template
      if (column.reactTemplate)
        reactTemplateColumns.push(column.name);

      // set default align
      if (column.type=='decimal'
        || (column.type=='number' && column.numberFormat=='F' ))
        column.align=column.align?column.align: 'right';

      // column extension
      let extension:ColumnExtension={};
      extension.columnName=column.name;
      extension.wordWrapEnabled=column.wordWrapEnabled;
      extension.align=column.align;
      extension.width=columnWidth.width;
      columnExtensions.push(extension);

      // hidden Columns
      if (column.width==0 || column.hidden )
        hiddenColumnNames.push(column.name);

      // column choicer
      let columnChoicerElement={
        value:column.name,
        label:column.title,
        checked:hiddenColumnNames.includes(column.name) ? false:true
      };
      columnChoicerCheckBoxList.push(columnChoicerElement);

    });

    return {
      columns:newColumnList,
      columnWidths:columnWidths,
      columnOrder:columnOrder,
      beFormatedColumns:beFormatedColumns,
      columnExtensions:columnExtensions,
      reactTemplateColumns:reactTemplateColumns,
      hiddenColumnNames:hiddenColumnNames,
      columnChoicerCheckBoxList:columnChoicerCheckBoxList
    };
  }


  /**
   * bileşen içerisindeki seçim işlemlerinin hepsi dataSource altındaki isSelected alanına bağlandı. bu alandaki değişimlerin
   * state üzerindeki indexe aktarılma işlemi bu fonksiyon aracılığı ile yapılır.
   * @param {*} selectable
   * @param {*} dataSource
   */
  static prepareSelectedIndex ( selectable, dataSource:Array<any>) {

    let newSelection= [];
    if (selectable==Selectables.NONE
      || dataSource ==undefined || dataSource==null || dataSource.length==0 )
      return [];
    if (selectable==null || selectable==undefined)
      selectable=Selectables.MULTIPLE;


    let selectedItems= dataSource.filter((row)=>{return row.isSelected ==true; });
    selectedItems && selectedItems.forEach(element => {
      newSelection.push(element.rowIndex);
    });
    return newSelection;
  }

  /**
   * prepareDataSource
   * @param {*} dataSource
   */
  static prepareDataSource (props:any) {

    let dataSource=props.dataSource;
    let selectedIndexes=props.selectedIndexes;
    if ( dataSource==null ||
      dataSource==undefined )
      return [];

    // tekli seçim aktif ise diğer seçimler temizlenip sadece son seçim aktif yapılıyor.
    if (  ( selectedIndexes && selectedIndexes.length>1 ) &&
       (props.selectable==Selectables.SINGLE || props.selectable==Selectables.SINGLENONPOINTER) ) {
      selectedIndexes=[selectedIndexes[selectedIndexes.length-1]];
    }

    dataSource && dataSource.length>0 &&
    dataSource.forEach((dataItem, index) => {
      dataItem.rowIndex = index;
      if (selectedIndexes && selectedIndexes.length>0)
        dataItem.isSelected= selectedIndexes.includes(dataItem.rowIndex) == true ? true:dataItem.isSelected;  // eski değerin korunması için
    });

    return dataSource;
  }

  /**
   * onRowSelectionChanged
   * @param {*} selection
   */
  onRowSelectionChanged () {

    this.setState({
      selectedIndexes:BDataGrid.prepareSelectedIndex(this.state.selectable, this.state.dataSource)
    }, ()=>{
      if (this.props.onRowSelectionChanged) {
        let isAllSelected=this.state.selectedIndexes==this.state.dataSource.length;
        let lastIndex=this.lastSelectionChangedRow ? this.lastSelectionChangedRow.rowIndex:null;
        this.props.onRowSelectionChanged(this.lastSelectionChangedRow, lastIndex, isAllSelected);
      }
    });
  }

  /**
   * getSelectedItems
   */
  getSelectedItems() {

    let selectedItems= this.state.dataSource.filter((row)=>{return row.isSelected ==true; });
    return selectedItems;
  }

  /**
   * setSize
   * @param {*} width
   * @param {*} height
   */
  setSize(width, height) {

    this.setState({
      height:height
    });
  }

  /**
   * setMaxSize
   * @param {*} width
   * @param {*} height
   */
  setMaxSize(width, height) {

    this.setState({
      maxHeight:height
    });
  }

  /**
   * onToggleFilter
   */
  onToggleFilter() {

    this.setState({
      checkedFiltering:!this.state.checkedFiltering
    });

  }

  /**
   * onToggleGrouping
   */
  onToggleGrouping() {

    let checkedGrouping = !this.state.checkedGrouping;


    this.setState({
      checkedGrouping:checkedGrouping,
      grouping:checkedGrouping==false ?[] :this.state.grouping
    });


  }


  /**
   * onToggleMoreOptions
   * @param {*} e
   */
  onToggleMoreOptions(e) {
    this.moreOptionsPopover.manualOpen(e.currentTarget, 300);
  }

  /**
   * onToggleDivit
   */
  onToggleDivit() {
    if (this.props.headerBarOptions.onToggleDivit) {
      this.props.headerBarOptions.onToggleDivit();
    }
  }

  /**
   * onToggleDelete
   */
  onToggleDelete() {

    // this.deleteRows(this.getSelectedItems());
    if (this.props.headerBarOptions.onToggleDelete) {
      this.props.headerBarOptions.onToggleDelete();
    }
  }

  /**
   * onToggleAdd
   */
  onToggleAdd() {
    if (this.props.headerBarOptions.onToggleAdd) {
      this.props.headerBarOptions.onToggleAdd();
    }
  }

  /**
   * getSnapshot
   */
  getSnapshot() {
    return this.state;
  }

  /**
   * setSnapshot
   * @param {*} snapshot
   */
  setSnapshot(snapshot) {

    let stateX=(snapshot && snapshot.gridState) ? snapshot.gridState :snapshot;
    this.state=Object.assign({}, this.state, stateX);

  }

  /**
   * getSelectedRowIndexes
   */
  getSelectedRowIndexes () {
    return this.state.selectedIndexes;
  }

  /**
   * getDataSource
   */
  getDataSource() {

    return this.state.dataSource;
  }

  /**
   * addNewRow
   * @param {*} data
   */
  addNewRow(data) {

    let dataSource = Object.assign([], this.getDataSource());
    let rowIndex = dataSource.length;

    if (data) {
      data.rowIndex = rowIndex;
    }
    else {
      data = { rowIndex: rowIndex };
    }
    dataSource.push(data);
    this.setState({
      dataSource:dataSource
    });
  }

  /**
   * resetUserSettings
   */
  resetUserSettings() {

    // column property..
    let columnArray=BDataGrid.prepareColumns(this.props.columns);

    // other
    this.setState({
      ...columnArray,
      sorting:[],
      grouping:[],
      selectedIndexes:[],
      expandedRowIds:[],
      filters:[],
      checkedGrouping:false,
      checkedFiltering:false
    });


  }


  /**
   * exportAsExcelFile
   */
  exportAsExcelFile() {
    let allDataSource=Object.assign([], this.state.dataSource);
    let exportData=[];
    let headerList=[];
    let headerRow={};
    if (allDataSource==null || allDataSource==undefined || allDataSource.length==0)
      return;

      // aktif sutun sırası
    this.state.columnOrder.forEach(columnName => {

      // gizli sutunlar hariç tutuluyor
      let isHiddenColumn=this.state.hiddenColumnNames.includes(columnName);
      if (!isHiddenColumn) {
        headerList.push(columnName);
      }

    });

    headerList.forEach(columnName => {
      let activeColumn=this.state.columns.find((obj)=>{return obj.name== columnName;});
      headerRow[columnName]=activeColumn.title;

    });

    // header
    exportData.push(headerRow);

    // tüm satırlar
    allDataSource.forEach(row => {
      let rowObject={};

      headerList.forEach(columnName => {
        let activeColumn=this.state.columns.find((obj)=>{return obj.name== columnName;});
        // formatlı hücre değeri
        let value= UIHelper.getFormatedColumnValue(row[columnName], activeColumn, row);
        rowObject[columnName]=value;

      });
      exportData.push(rowObject);

    });

    let headerOptions= {
      skipHeader:true
    };
    // file name
    let now = new Date();
    let name = '' + now.getFullYear() + '' + now.getDay() + '' + now.getMilliseconds();
    let fileName = name + '.xlsx';

    const worksheet: any = XLSX.utils.json_to_sheet(exportData, headerOptions);
    const workbook: any = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, fileName, { bookType: 'xlsx', type: 'binary' });

  }

  /**
   * refreshGrid
   */
  refreshGrid() {
    this.forceUpdate();
  }


  /**
   * deleteRows
   * @param {*} rows
   */
  deleteRows(deletedRows:any[]) {

    let cloneDataSource=Object.assign([], this.getDataSource());

    if (deletedRows && deletedRows.length>0) {
      deletedRows.forEach(deleted => {
        cloneDataSource=cloneDataSource.filter((row)=>{return row.rowIndex != deleted.rowIndex; });
      });

      this.setState({
        dataSource:cloneDataSource
      });
    }

  }

  /**
   * getFormatedColumnValue
   * @param {*} value
   * @param {*} column
   * @param {*} row
   */
  static getFormatedColumnValue(value, column, row ) {

    return UIHelper.getFormatedColumnValue(value, column, row);
  }


  /**
   * generatePopoversAndMenus
   */
  generatePopoversAndMenus() {
    let isMobileOrTablet = this.state.context.deviceSize < BComponent.Sizes.MEDIUM;

    let menuItemStyle={
      marginLeft: -6,
      width: 'calc(100% + 24px)',
      backgroundColor: this.props.context.theme.boaPalette.base10,
      color: this.props.context.theme.boaPalette.base450,
      fontSize: 14,
      fontWeight: 600
    };
    return (
      <div>
        <BPopover
          ref={r => this.columnChoicerPopover = r}
          open={false}
          context={this.props.context}
          style={{ width: 300 }}
          zDepth={1}
          onRequestClose={() => {
            this.columnChoicerPopover.manualClose();
          }}>
          <div style={{
            width:300,
            paddingLeft:16,
            paddingRight:16,
            paddingBottom:24
          }}>
            <BCheckBoxGroup
              context={this.props.context}
              items={this.state.columnChoicerCheckBoxList}
              ref={r => (this.checkGroup = r)}
              onChange={(selectedValues)=>{
                let hiddenColumnNames=[];
                this.state.columns.forEach(column => {
                  let isVisible=selectedValues.includes(column.name);
                  if  (!isVisible)
                    hiddenColumnNames.push(column.name);
                });
                this.setState({
                  hiddenColumnNames:hiddenColumnNames
                });
              }}/>
          </div>

        </BPopover>
        <BPopover
            ref={r => this.moreOptionsPopover = r}
            open={false}
            context={this.props.context}
            style={{ width: 300 }}
            zDepth={1}
            onRequestClose={() => {
              this.moreOptionsPopover.manualClose();
            }}
          >
          {
            isMobileOrTablet==false &&
            <BMenuItem context={this.props.context}
              primaryText={this.getMessage('BOA', 'ExportToExcel')}
              itemSelected={() => {
                setTimeout(() => {
                  this.exportAsExcelFile();
                  this.moreOptionsPopover.manualClose();
                }, 200);

              }}
              style={menuItemStyle}
              value={1} />
          }

          <BMenuItem context={this.props.context}
              primaryText={this.getMessage('BOA', 'ChooseField')}
              ref={r => this.menuColumnChoicer = r}
              itemSelected={() => {

                setTimeout(() => {
                  this.columnChoicerPopover.manualOpen(findDOMNode( this.menuColumnChoicer), 300);
                }, 200);

              }}
              style={menuItemStyle}
              value={1} >
          </BMenuItem>
          <BMenuItem context={this.props.context}
              primaryText={this.getMessage('BOA', 'BOAReturnToDefaultView')}
              itemSelected={() => {

                setTimeout(() => {
                  this.resetUserSettings();
                  this.moreOptionsPopover.manualClose();
                }, 200);

              }}
              style={menuItemStyle}
              value={1} />
          {
            this.props.page &&
            <BMenuItem context={this.props.context}
              primaryText={'Görünümü Kaydet'}
              itemSelected={() => {

                setTimeout(() => {
                  this.saveGridSettings();
                  this.moreOptionsPopover.manualClose();
                }, 200);

              }}
              style={menuItemStyle}
              value={1} />
          }

        </BPopover>
      </div>
    );
  }

  /**
   * render
   */
  render() {


    /**
     * if isInCardEnabled
     */
    const containerCardStyle={
      marginTop: this.state.isInsideTheCard ? -12:0,
      marginBottom:this.state.isInsideTheCard ? -12:0,
      marginRight:this.state.isInsideTheCard ? -24:0,
      marginLeft:this.state.isInsideTheCard ? -24:0
    };

    let showEmptyText = false;
    let emptyText = this.state.emptyText;
    if ((this.state.dataSource == undefined
      || this.state.dataSource.length == 0)
    ) {
      if (this.state.displayGridOnNoRow) {
        showEmptyText=false;
      }
      else {
        showEmptyText = true;
        if (!emptyText) {
          emptyText = this.getMessage('BOAOne', 'UseCriteriaFieldToQuery');
        }
      }

    }

    return (

      <div >

        {this.generatePopoversAndMenus()}{this.generatePopoversAndMenus()}

        {this.state.showGrid && !showEmptyText &&
          <div style={containerCardStyle}>
            <Grid
              rows={this.state.dataSource}
              columns={this.state.columns}
              style={{
                height: this.state.height ? this.state.height :  '100%',
                maxHeight:this.state.maxHeight
              }}
              getRowId={(row)=>{
                return row.rowIndex;
              }}
              >
              <FormatterProvider
                for={this.state.beFormatedColumns}
                context={this.props.context}
                >
              </FormatterProvider> <FormatterProvider
                for={this.state.beFormatedColumns}
                context={this.props.context}
                >
              </FormatterProvider>

              <EditorProvider
                for={this.state.reactTemplateColumns}
                context={this.props.context}
                >
              </EditorProvider>

              {
                this.state.sortable &&
                <SortingState
                  sorting={this.state.sorting}
                  onSortingChange={(sorting:Array<Sorting>)=>{
                    this.setState({
                      sorting:sorting
                    });
                  }}
                />
              }
              {
                this.state.sortable &&
                <IntegratedSorting />
              }
              {
                this.state.groupable &&
                <DragDropProvider />
              }
              {
                this.state.groupable &&
                <GroupingState
                  grouping={this.state.grouping}
                  onGroupingChange={(grouping)=>{

                    this.setState({
                      checkedGrouping:(grouping && grouping.length>0) ? true:false,
                      grouping: grouping
                    });

                  }}
                  expandedGroups={this.state.expandedGroups}
                  onExpandedGroupsChange={(expandedGroups)=>{
                    this.setState({
                      expandedGroups:expandedGroups
                    });
                  }}

                  />
              }
              {
                this.state.groupable &&
                <IntegratedGrouping />
              }
              {
                <SelectionState
                  selection={this.state.selectedIndexes}
                  onSelectionChange={this.onRowSelectionChanged.bind(this)}
                />
              }

              {
                this.state.treeDataOptions &&
                <TreeDataState
                  expandedRowIds={this.state.expandedRowIds}
                  onExpandedRowIdsChange={(expandedRowIds:Array<number>)=>{
                    this.setState({
                      expandedRowIds:expandedRowIds
                    });
                  }}

                />
              }
              {
                this.state.treeDataOptions &&
                <CustomTreeData
                  getChildRows={(row, rootRows)=>{
                    return this.state.treeDataOptions.getChildRows(row, rootRows, this.state.context);
                  }}
                />
              }

              {
                this.state.selectable!=Selectables.NONE &&
                <IntegratedSelection />
              }

              {
                this.state.filterable &&
                <FilteringState
                  filters={this.state.filters}
                  onFiltersChange={(filters)=>{
                    this.setState({
                      filters:filters
                    });
                  }} />
              }
              {
                this.state.filterable &&
                <IntegratedFiltering />
              }
              {
                (this.state.subGridProperties ||  this.state.rowDetail) &&
                <RowDetailState
                  expandedRowIds={this.state.expandedRowIds}
                  onExpandedRowIdsChange={(expandedRowIds:Array<number>)=>{
                    this.setState({
                      expandedRowIds:expandedRowIds
                    });
                  }}

                />

              }

              { this.state.editingDataOptions &&
                <EditingState
                  editingRowIds={this.state.editingRowIds}
                  onEditingRowIdsChange={(editingRowIds)=>{
                    this.setState({ editingRowIds });
                  }}

                  rowChanges={this.state.rowChanges}
                  onRowChangesChange={(rowChanges)=>{
                    this.setState({ rowChanges });
                  }}
                  addedRows={this.state.addedRows}
                  onAddedRowsChange={(addedRows)=>{
                    const initialized = addedRows.map(row => (Object.keys(row).length ?
                      row :  this.state.editingDataOptions.emptyData? Object.assign({}, this.state.editingDataOptions.emptyData) :{})); // emptyData olarak belirtilen obje var ise o ekleniyor.
                    this.setState({ addedRows: initialized });
                  }}
                  onCommitChanges={({ added, changed, deleted })=>{

                    let rows  = this.state.dataSource;
                    let addedObject, changedObject, deletedObject;
                    if (added && added.length>0) {
                      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].rowIndex + 1 : 0;
                      addedObject=added[0];
                      addedObject.rowIndex=startingAddedId+1;
                    }
                    if (changed) {
                      changedObject=rows[Object.keys(changed)[0]];
                    }
                    if (deleted && deleted.length>0) {
                      deletedObject = rows.find((x)=>x.rowIndex==deleted[0]);
                    }

                    this.state.editingDataOptions.onCommitChanges &&
                      this.state.editingDataOptions.onCommitChanges(addedObject, changedObject, deletedObject);
                  }}
              />
              }
              {
                this.props.useNotVirtualization ?
                  <Table
                    columnExtensions={this.state.columnExtensions}
                    cellComponent={ (props) => {
                      return Cell.template(this, props);
                    }}
                    rowComponent={ (props) => {
                      return Row.template(this, props);
                    }}
                    tableComponent={(props)=>{
                      return (
                        <BTable
                          context={this.props.context}
                          {...props}
                        ></BTable>
                      );
                    }}
                    messages={Messages.getTable()}

                    noDataRowComponent={()=>{
                      return (
                        <div></div>
                      );
                    }}

                    // TODO: opps :(  header bileşni ile oynamak filtreleme yapıldığında bileşenin tekrar render olmasına sebep oluyor...
                    // headComponent={ (props) => {
                    //   return Row.headTemplate(this, props);
                    // }}


                  >

                  </Table> :
                  <VirtualTable
                    height='auto'
                    estimatedRowHeight={this.state.rowHeight}
                    columnExtensions={this.state.columnExtensions}
                    cellComponent={ (props) => {
                      return Cell.template(this, props);
                    }}
                    rowComponent={ (props) => {
                      return Row.template(this, props);
                    }}

                    tableComponent={(props)=>{
                      return (
                        <BTable
                          context={this.props.context}
                          {...props}
                        ></BTable>
                      );
                    }}
                    messages={Messages.getTable()}

                    noDataRowComponent={()=>{
                      return (
                        <div></div>
                      );
                    }}


                    // TODO: opps :(  header bileşni ile oynamak filtreleme yapıldığında bileşenin tekrar render olmasına sebep oluyor...
                    // headComponent={ (props) => {
                    //   return Row.headTemplate(this, props);
                    // }}

                  />
              }
              {
                this.state.resizable &&
                <TableColumnResizing
                  columnWidths={this.state.columnWidths}
                  onColumnWidthsChange={(columnWidths:Array<TableColumnWidthInfo>)=>{
                    this.setState({
                      columnWidths:columnWidths
                    });
                  }}
                />
              }
              { this.state.showHeaderRow &&
                <TableHeaderRow
                  showSortingControls ={this.state.sortable}
                  messages={Messages.getTableHeaderRow()}
                  // showGroupingControls ={this.state.groupable}  // başlıklarda grupla kısayolu
                />
              }

              { this.state.editingDataOptions &&
                <TableEditRow
                  cellComponent={ (props) => {
                    return EditRow.cellComponent(this, props);
                  }}
                />
              }
              { this.state.editingDataOptions &&
                <TableEditColumn
                  showAddCommand={this.state.editingDataOptions.showAddCommand}
                  showEditCommand={this.state.editingDataOptions.showEditCommand}
                  showDeleteCommand={this.state.editingDataOptions.showDeleteCommand}
                  commandComponent={ (props) => {
                    return EditRow.commandComponent(this, props);
                  }}
                />
              }

              { this.state.reordable &&
                <TableColumnReordering
                  order={this.state.columnOrder}
                  onOrderChange={(columnOrder)=>{
                    this.setState({
                      columnOrder:columnOrder
                    });
                  }}
                />
              }

              {
                this.state.filterable &&
                this.state.headerBarOptions.show &&
                this.state.checkedFiltering &&
                <TableFilterRow
                  showFilterSelector
                  messages={Messages.getTableFilterRow()}
                />
              }
              {
                <TableColumnVisibility
                  hiddenColumnNames={this.state.hiddenColumnNames}
                  onHiddenColumnNamesChange={(hiddenColumnNames)=>{
                    this.setState({
                      hiddenColumnNames:hiddenColumnNames
                    });
                  }}
                />
              }
              {
                this.state.groupable &&
                <TableGroupRow />
              }
              {
                this.state.headerBarOptions &&
                this.state.headerBarOptions.show &&
                <Toolbar
                  rootComponent={ (props) => {
                    return HeaderBar.generateHeaderBar(this, props);
                  }}
                />
              }
              {
                // this.state.columnMenu &&
                // <ColumnChooser  />
              }
              {
                this.state.groupable &&
                this.state.headerBarOptions.show &&
                this.state.checkedGrouping &&
                <GroupingPanel
                  showGroupingControls
                  showSortingControls
                  messages={Messages.getGroupingPanel()}
                />
              }

              {
                 (this.state.subGridProperties ||  this.state.rowDetail) &&
                 <TableRowDetail
                    contentComponent={(props)=>{
                      return RowDetail.template(this, props);
                    }}
                />
              }

              {
                this.state.treeDataOptions &&
                <TableTreeColumn
                  for={this.state.treeDataOptions.for}
                  showSelectionControls={this.state.selectable==Selectables.SINGLENONPOINTER ? false:true}
                  showSelectAll={this.state.selectable==Selectables.MULTIPLE }
                  checkboxComponent={ (props) => {
                    return Selection.treeSelection(this, props);
                  }}
                />
              }

              {
                this.state.selectable!=Selectables.NONE &&
                <TableSelection
                  // highlightRow, selectByRowClick özelliği rowTemplate ile birlikte kullanılamıyor, bu yüzden burada kapatılıp
                  // rowTemplate üzerinden geliştirme yapıldı..
                  // highlightRow
                  // selectByRowClick ={this.state.selectable!=Selectables.MULTIPLE }
                  showSelectAll={this.state.selectable==Selectables.MULTIPLE }
                  selectionColumnWidth={56}
                  showSelectionColumn={this.state.selectable==Selectables.SINGLENONPOINTER ? false:true }
                  cellComponent={ (props) => {
                    return Selection.cellSelection(this, props);
                  }}
                  headerCellComponent={ (props) => {
                    return Selection.headerSelection(this, props);
                  }}
              />
              }

            </Grid>

          </div>
        }

        {
          showEmptyText &&
          <div style={{ height: '100%' }}>
            <div style={
            {
              height: 1,
              width: '100%',
              backgroundColor: this.props.context.theme.boaPalette.base200

            }}></div>
            <div style={
            {
              paddingTop: 35,
              paddingBottom: 35,
              fontSize: 15,
              textAlign: 'center',
              color: this.props.context.theme.boaPalette.base300

            }}>{emptyText}</div>
          </div>

        }
      </div>

    );
  }

}

BDataGrid.Selectables = Selectables;

export default BDataGrid;
