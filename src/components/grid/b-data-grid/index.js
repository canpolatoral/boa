import React from 'react';
import PropTypes from 'prop-types';
import KendoGrid from './kendogrid';
import BDataGridHeader from './header';
import StyleHelper from './style';
import { BComponent, BAppProvider, BComponentComposer } from 'b-component';
import ReactDOM from 'react-dom';
import { BCheckBox } from 'b-check-box';
import { BRadioButton } from 'b-radio-button';
import { BPopover } from 'b-popover';
import { BMenuItem } from 'b-menu-item';

window.kendo.culture('tr-TR');
@BComponentComposer
export class BDataGrid extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
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
    columns: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      attributes: PropTypes.object,
      editable: PropTypes.bool,
      editor: PropTypes.func,
      encoded: PropTypes.bool,
      format: PropTypes.string,
      key: PropTypes.string,
      filterable: PropTypes.object,
      groupable: PropTypes.bool,
      headerAttributes: PropTypes.object,
      headerTemplate: PropTypes.string,
      hidden: PropTypes.bool,
      locked: PropTypes.bool,
      lockable: PropTypes.bool,
      minResizableWidth: PropTypes.number,
      minScreenWidth: PropTypes.number,
      sortable: PropTypes.bool,
      template: PropTypes.string,
      title: PropTypes.string,
      values: PropTypes.array,
      menu: PropTypes.bool,
      width: PropTypes.number,
      type: PropTypes.oneOf(['number', 'enum', 'image', 'date'])
    })).isRequired,
    columnsDefaultWidth: PropTypes.number,
    dataSource: PropTypes.array,
    onRowSelectionChanged: PropTypes.func,
    onRowUpdated: PropTypes.func,
    sortable: PropTypes.bool,
    groupable: PropTypes.bool,
    reordable: PropTypes.bool,
    resizable: PropTypes.bool,
    filterable: PropTypes.bool,
    columnMenu: PropTypes.bool,
    selectedIndexes: PropTypes.any,
    columnWidths: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    scrollable: PropTypes.any,
    selectable: PropTypes.oneOf(['single', 'multiple', 'singleNonPointer']), // singleNonPointer: checkbox ve radio button görüntülenmez.
    multiSelection: PropTypes.bool,
    editable: PropTypes.bool,
    autoFit: PropTypes.bool,
    rowTemplate: PropTypes.any,
    showGrid: PropTypes.bool,
    emptyText: PropTypes.string,
    subGridProperties: PropTypes.any,
    group: PropTypes.array,
    aggregate: PropTypes.array,
    onRowDoubleClick: PropTypes.func
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    headerBarOptions: {
      show: true,
      showTitle: true,
      showGrouping: true,
      showFiltering: true,
      showMoreOptions: true,
      showDelete: false,
      showDivit: false,
      showAdd: false
    },
    sortable: true,
    groupable: false,
    reordable: true,
    resizable: true,
    filterable: false,
    columnMenu: true,
    scrollable: {
      // endless: true   // çok başarısız
      virtual: true
    },
    columnsDefaultWidth: 200,
    selectable: 'singleNonPointer',
    autoFit: true,
    showGrid: true
  }

  state = {
    groupable: this.props.groupable,
    dataSource: this.props.dataSource,
    disabledDivit: true,
    disabledDelete: true
  };

  constructor(props, context) {
    super(props, context);

    this.makeAutoFit = true;

    if (props.multiSelection) // geriye destek
      this.selectable = 'multiple';
    else {
      this.selectable = this.props.selectable;
    }
    this.dataGridId = window.kendo.guid(); // todo geçici olarak konuldu.
    window[this.dataGridId] = {};
    this.onToggleFilter = this.onToggleFilter.bind(this);
    this.onToggleGrouping = this.onToggleGrouping.bind(this);
    this.onToggleMoreOptions = this.onToggleMoreOptions.bind(this);
    this.onToggleDivit = this.onToggleDivit.bind(this);
    this.onToggleDelete = this.onToggleDelete.bind(this);
    this.onToggleAdd = this.onToggleAdd.bind(this);
    this.getSelectedItems = this.getSelectedItems.bind(this);
    this.selectRow = this.selectRow.bind(this);
    this.selectAllRow = this.selectAllRow.bind(this);
    this.getSelectedRowIndexes = this.getSelectedRowIndexes.bind(this);
    this.getDataSource = this.getDataSource.bind(this);
    this.setSize = this.setSize.bind(this);
    this.manageSelection = this.manageColumns.bind(this);
    this.checkedIndexes = [];
    this.selectedIndexes = [];

    this.checkedUids = [];
    this.anomalyUids = [];
    this.columns = [];
    this.columnWidths = this.props.columnWidths;
    this.setSelectedRowIndexes(this.props.selectedIndexes);
    this.manageColumns(this.props);
    this._getThis = this._getThis.bind(this);
    this.hydrateCell = this.hydrateCell.bind(this);
    this.hydrateSelectCell = this.hydrateSelectCell.bind(this);
  }

  /**
   * componentWillReceiveProps
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {

    if (this.props.dataSource != nextProps.dataSource) {
      // let dataSource=this._generateDataSource(nextProps.dataSource);
      // this.dataGrid &&
      // this.dataGrid.widgetInstance &&
      // this.dataGrid.widgetInstance.setDataSource(dataSource);

      this.generatedDatagrid = null;
      this.makeAutoFit = true;
      this.setColumnWidths(undefined);
    }

    if (this.props.selectedIndexes != nextProps.selectedIndexes) {
      this.setSelectedRowIndexes(nextProps.selectedIndexes);
    }

    if (nextProps.selectedIndexes==null || nextProps.selectedIndexes==undefined) {
      this.selectedIndexes=[];
    }

    if (this.props.selectable !== nextProps.selectable) {
      this.selectable = nextProps.selectable;
    }


    this.manageColumns(nextProps);
    if (nextProps.multiSelection)
      this.selectable = 'multiple';
  }

  /**
   * render
   */
  render() {
    // this.makeAutoFit = true; // her render da tekrar çalışması gerekiyor. gruplama filtreleme vs olaylarda...
    // this.setColumnWidths(undefined);
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    var className = this.props.context.localization.isRightToLeft ? 'k-rtl' : null;
    var themePath = this.props.context.theme.kendoThemePath ? `${this.props.context.theme.kendoThemePath}/kendo.${this.props.context.theme.themeName}.css` : '';
    var showGrouping = this._getShowGrouping();
    let showEmptyText = false;
    let emptyText = this.props.emptyText;
    if ((this.props.dataSource == undefined
      || this.props.dataSource.length == 0)
    ) {
      showEmptyText = true;
      if (!emptyText) {
        emptyText = this.getMessage('BOAOne', 'UseCriteriaFieldToQuery');
      }
    }

    return (
      <div style={{ height: '100%' }} className={className}>

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
          <BMenuItem context={this.props.context}
            primaryText='Excel e Çıktı Ver'
            // disabled={this.props.context.applicationContext && this.props.context.applicationContext.isBOALogin ? true:false} // TODO: container tarayıcı desteklemediği için kaldırıldı, daha sonra eklenecek.
            itemSelected={() => {

              setTimeout(() => {
                this.dataGrid.widgetInstance.saveAsExcel();
                this.moreOptionsPopover.manualClose();

              }, 200);

            }}
            style={{
              marginLeft: -6,
              width: 'calc(100% + 24px)',
              backgroundColor: this.props.context.theme.boaPalette.base10,
              color: this.props.context.theme.boaPalette.base450,
              fontSize: 14,
              fontWeight: 600
            }}
            value={1} />
        </BPopover>

        <link rel='stylesheet' type='text/css' href={themePath} />

        {StyleHelper.getDataGridStyle(this.props)}
        {/*
        <svgIcon  context={this.props.context} ></svgIcon> */}
        <BDataGridHeader
          context={this.props.context}
          show={this.props.headerBarOptions.show}
          title={this.props.headerBarOptions.title || this.getMessage('BOA', 'ResutList')}
          showTitle={this.props.headerBarOptions.showTitle}
          showGrouping={(isMobileOrTablet ? false : (!showEmptyText && showGrouping))}
          showFiltering={!showEmptyText && this.props.headerBarOptions.showFiltering}
          showMoreOptions={isMobileOrTablet ? false : (!showEmptyText && this.props.headerBarOptions.showMoreOptions)}
          showDelete={this.props.headerBarOptions.showDelete}
          showDivit={this.props.headerBarOptions.showDivit}
          showAdd={this.props.headerBarOptions.showAdd}
          onToggleFilter={this.onToggleFilter}
          onToggleGrouping={this.onToggleGrouping}
          onToggleMoreOptions={this.onToggleMoreOptions}
          onToggleDivit={this.onToggleDivit}
          onToggleDelete={this.onToggleDelete}
          onToggleAdd={this.onToggleAdd}
          disabledDivit={this.state.disabledDivit}
          disabledDelete={this.state.disabledDelete}
          isGrouping={this.props.group ? true : false}
          isFilter={this.props.filterable ? true : false}
        />

        {this.props.showGrid && !showEmptyText &&
          <div style={{ marginBottom: '-6px'}}> {this.generateDatagrid() }</div>
        }
        {
          showEmptyText &&
          <div style={{ height: '100%' }}>
            <div style={
            {
              height: 1,
              width: '100%',
                // width: 'calc(100% + 48px)',
                // marginLeft: -24,
              backgroundColor: this.props.context.theme.boaPalette.base200

            }}></div>
            <div style={
            {
              paddingTop: 52,
              paddingBottom: 34,
              fontSize: 15,
              textAlign: 'center',
              color: this.props.context.theme.boaPalette.base300

            }}>{emptyText}</div>
          </div>

        }

      </div>
    );
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this._getThis().selectRow = this.selectRow;
    this._getThis().selectAllRow = this.selectAllRow;
    this._getThis().hydrateCell = this.hydrateCell;
    this._getThis().hydrateSelectCell = this.hydrateSelectCell;

    this.generateSelectAll();
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    this.generateSelectAll();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {

    let headerCell = document.getElementById(this.generateCellId(0));
    headerCell && this.unmountElements([headerCell]);
    this.unmountElements(this.mountedCells);
    this.unmountElements(this.mountedGrids);

    delete this._getThis();
  }


  /**
   * unmountElements
   * @param {*} domElements
   */
  unmountElements(domElements) {
    if (domElements && domElements.length > 0) {
      domElements.forEach((item) => {
        ReactDOM.unmountComponentAtNode(item);
      });
    }
    domElements = [];
  }


  /**
   * generateSelectAll
   */
  generateSelectAll() {

    if (this.selectable == 'multiple') {
      var isSelected = false;
      // var uncheckedIcon = (<ToggleCheckBoxOutlineBlank style={{ fill: this.props.context.theme.boaPalette.base400 }}  />);
      var dataSource = this.getDataSource();
      if (dataSource &&
        dataSource.length > 0) {
        let checkedList = dataSource.filter(item => item.isSelected == true);
        let unCheckedList = dataSource.filter(item => item.isSelected == false || item.isSelected == undefined || item.isSelected == null);
        if (checkedList && checkedList.length == dataSource.length)
          isSelected = true;
        else if (unCheckedList && unCheckedList.length == dataSource.length)
          isSelected = false;
        else
          isSelected = null;
      }

      // if (isSelected == null) {
      //   uncheckedIcon = (<ToggleIndeterminateCheckBox style={{ fill: this.props.context.theme.boaPalette.base400 }} />);
      //   isSelected = false;
      // }

      var checkBox = (
        <BAppProvider theme={this.props.context.theme}>
          <BCheckBox
            ref={r => this.selectAllCheckBox = r}
            context={this.props.context}
            checked={isSelected}
            onCheck={this.selectAllOnCheck.bind(this)}
          // uncheckedIcon={uncheckedIcon}
          />

        </BAppProvider>
      );

      let headerCell = document.getElementById(this.generateCellId(0));
      headerCell &&
        ReactDOM.hydrate(
          checkBox,
          headerCell,
        );
      return checkBox;
    }
  }


  /**
   * getSelectCheckBox
   * @param {*} selected
   */
  getSelectCheckBox(selected) {
    var checkBox = (
      <BAppProvider theme={this.props.context.theme}>
        <BCheckBox
          context={this.props.context}
          checked={selected}
          onCheck={this.rowOnCheck.bind(this)}
        />
      </BAppProvider>
    );
    return checkBox;
  }

  /**
   * getSelectRadioButton
   * @param {*} selected
   */
  getSelectRadioButton(selected) {
    var radio = (
      <BAppProvider theme={this.props.context.theme}>
        <BRadioButton
          context={this.props.context}
          checked={selected}
          value={selected}
          onChange={this.rowOnCheckRadio.bind(this)}
        />
      </BAppProvider>
    );
    return radio;
  }

  /**
   * rowOnCheck
   * @param {*} e
   * @param {*} isInputChecked
   */
  rowOnCheck(e, isInputChecked) {
    var row = e.currentTarget.closest('tr');
    this.selectRow(row, isInputChecked);
  }

  /**
   * rowOnCheckRadio
   * @param {*} e
   */
  rowOnCheckRadio(e) {

    var dataSource = this.getDataSource();
    dataSource && dataSource.forEach(element => {
      element.isSelected = false;
    });
    var row = e.currentTarget.closest('tr');
    this.selectRow(row, true);
    this.refreshGrid();
  }

  /**
   * selectAllOnCheck
   * @param {*} e
   * @param {*} isInputChecked
   */
  selectAllOnCheck(e, isInputChecked) {
    this.selectAllRow(isInputChecked);
  }

  /**
   * generateSelectColumn
   */
  generateSelectColumn() {
    if (this.selectable == 'singleNonPointer' || this.selectable == '' || this.selectable == false) {
      return null;
    }

    if (this.props.columns && this.props.columns.length > 0) {
      const isSelectedColumns = this.props.columns.filter(column => column.key == 'isSelected');
      if (isSelectedColumns && isSelectedColumns.length > 0) {
        return isSelectedColumns[0];
      }
    }
    var column1 = {
      key: 'isSelected',
      minResizableWidth: 48,
      width: 48
    };
    return column1;
  }

  /**
   * manageColumns
   * @param {*} props
   */
  manageColumns(props) {


    if (props.columns) {
      this.fieldsConfig = {};
      var columns = props.columns;

      var selectColumn = this.generateSelectColumn();
      if (selectColumn && columns[0].key != 'isSelected')
        columns.unshift(selectColumn);

      columns.forEach((column, index) => {

        // eski grid içn
        column.field = column.key != 'isSelected' ? column.key : null;
        column.title = column.name;
        column.columnIndex = index;

        if (column.width == 0)
          column.hidden = true;

        if (props.scrollable && !props.autoFit)
          column.width = column.width ? column.width : this.props.columnsDefaultWidth;

        var fieldConfig = {
          type: column.type,
          editable: column.editable
        };
        column.editable = undefined;

        this.fieldsConfig[column.key] = fieldConfig;

        this.generateFormatColumnTemplate(column);

        if (column.key == 'isSelected') {
          column.template = this.generateSelectCellTemplate(column, index);
          column.headerTemplate = this.generateSelectCellHeaderTemplate();
        }

        if (column.reactTemplate) {
          if (!this.state.reactTemplateColumns) {
            this.state.reactTemplateColumns = [];
          }
          column.template = this.getKendoReactTemplate(index);
          this.state.reactTemplateColumns.push(column);
        }

        if (column.color) {
          if (!this.state.coloredColumns) {
            this.state.coloredColumns = [];
          }
          this.state.coloredColumns.push(column);
        }
        if (column.textClicked) {
          if (!this.state.clickableColumns) {
            this.state.clickableColumns = [];
          }
          this.state.clickableColumns.push(column);
        }
        if (column.icon) {
          if (!this.state.iconColumns) {
            this.state.iconColumns = [];
          }
          this.state.iconColumns.push(column);
        }

      });

      this.columnWidths && this.columnWidths.forEach((width, i) => { // snapshot için
        columns[i].width = width;
      });
      this.columns = columns;
    }

  }

  /**
   * getFormatedColumnValue
   * @param {*} column
   * @param {*} dataItem
   */
  getFormatedColumnValue(column, dataItem) {
    if (dataItem[column.key] == null || dataItem[column.key] == undefined)
      return '';
    if (column.type == 'date' || column.type == 'number') {
      var defaultDateFormat = column.dateFormat ? column.dateFormat : 'L';
      var defaultNumberFormat = column.numberFormat ? column.numberFormat : 'D';
      let formatedValue;
      if (column.type == 'date') {
        formatedValue = BComponent.Localization.formatDateTime(dataItem[column.key], defaultDateFormat);
      }
      else if (column.type == 'number') {
        formatedValue = BComponent.Localization.formatCurrency(dataItem[column.key], defaultNumberFormat);
      }
      return formatedValue;
    }
  }

  /**
   * generateFormatColumnTemplate
   * @param {*} column
   */
  generateFormatColumnTemplate(column) {

    if (column.type == 'date' || column.type == 'number') {
      var defaultNumberFormat = column.numberFormat ? column.numberFormat : 'D';

      // decimal alanların sağa yaslanması
      let textAlign = 'left';
      if (column.type == 'number' && ['F', 'M', 'FX'].indexOf(defaultNumberFormat) >= 0)
        textAlign = 'right';

      column.template = (dataItem) => {
        let formatedValue = this.getFormatedColumnValue(column, dataItem);
        return window.kendo.template(' <div style="text-align:' + textAlign + '" >' + formatedValue + '</div>')(dataItem);

      };
    }
  }

  /**
   * generateSelectCellTemplate
   * @param {*} column
   * @param {*} columnIndex
   */
  generateSelectCellTemplate() {
    // var selectedCheckBoxString = ReactDOMServer.renderToString(this.getSelectCheckBox(true));
    // var unSelectedCheckBoxString = ReactDOMServer.renderToString(this.getSelectCheckBox(false));

    // selectedCheckBoxString = ReactDOMServer.renderToString(this.getSelectRadioButton(true));
    // unSelectedCheckBoxString = ReactDOMServer.renderToString(this.getSelectRadioButton(false));

    var selectedCheckBoxString;
    var unSelectedCheckBoxString;

    if (this.selectable == 'multiple') {
      selectedCheckBoxString =
        `
        <div style=" ${this.props.context.theme.direction == 'rtl' ? 'margin-right:-16px;' : ''} margin-top:-2px; cursor:pointer;position:relative;overflow:visible;display:table;height:auto;width:100%">
        <input type="checkbox" style="position:absolute;cursor:inherit;pointer-events:all;opacity:0;width:100%;height:100%;z-index:2;left:0;box-sizing:border-box;padding:0;margin:0" checked=""/>
        <div style="display:flex;width:100%;height:100%">
           <div style="transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;float:left;position:relative;display:block;flex-shrink:0;width:24px;margin-right:16px;margin-left:0;height:24px">
              <div>
                 <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.pri500};height:24px;width:24px;user-select:none;transition:opacity 650ms cubic-bezier(0.23, 1, 0.32, 1) 150ms;position:absolute;opacity:0" viewBox="0 0 24 24">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                 </svg>
                 <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.pri500};height:24px;width:24px;user-select:none;transition:opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;position:absolute;opacity:1;transform:scale(1);transition-origin:50% 50%" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                 </svg>
              </div>
              <div></div>
              <div style="position:absolute;height:100%;width:100%;top:0;left:0"></div>
           </div>
        </div>
      </div>
      `;
      unSelectedCheckBoxString =
        `

        <div style=" ${this.props.context.theme.direction == 'rtl' ? 'margin-right:-16px;' : ''} margin-top:-2px; cursor:pointer;position:relative;overflow:visible;display:table;height:auto;width:100%">
         <input type="checkbox" style="position:absolute;cursor:inherit;pointer-events:all;opacity:0;width:100%;height:100%;z-index:2;left:0;box-sizing:border-box;padding:0;margin:0"/>
         <div style="display:flex;width:100%;height:100%">
            <div style="transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;float:left;position:relative;display:block;flex-shrink:0;width:24px;margin-right:16px;margin-left:0;height:24px">
               <div>
                  <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.base400};height:24px;width:24px;user-select:none;transition:opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1) 200ms;position:absolute;opacity:1" viewBox="0 0 24 24">
                     <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                  </svg>
                  <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.pri500};height:24px;width:24px;user-select:none;transition:opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms;position:absolute;opacity:0;transform:scale(0);transition-origin:50% 50%" viewBox="0 0 24 24">
                     <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                  </svg>
               </div>
               <div></div>
               <div style="position:absolute;height:100%;width:100%;top:0;left:0"></div>
            </div>
         </div>
      </div>

      `;
    }
    else {

      selectedCheckBoxString =
        `
        <div style="margin-left:0px; margin-top:5px; cursor:pointer;position:relative;overflow:visible;display:table;height:auto;width:100%" data-reactroot="">
           <input type="radio" style="position:absolute;cursor:inherit;pointer-events:all;opacity:0;width:100%;height:100%;z-index:2;left:0;box-sizing:border-box;padding:0;margin:0" value="true" checked=""/>
           <div style="display:flex;width:100%;height:100%">
              <div style="transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;float:left;position:relative;display:block;flex-shrink:0;width:24px;margin-right:16px;margin-left:0;height:24px">
                 <div>
                    <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.base400};height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;position:absolute;opacity:0;transform:scale(0)" viewBox="0 0 24 24">
                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                    </svg>
                    <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.pri500};height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;position:absolute;opacity:1;transform:scale(1);transform-origin:50% 50%" viewBox="0 0 24 24">
                       <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                    </svg>
                 </div>
                 <div></div>
                 <div style="position:absolute;height:100%;width:100%;top:0;left:0"></div>
              </div>
           </div>
        </div>

      `;
      unSelectedCheckBoxString =
        `
        <div style="margin-left:0px; margin-top:5px; cursor:pointer;position:relative;overflow:visible;display:table;height:auto;width:100%" data-reactroot="">
           <input type="radio" style="position:absolute;cursor:inherit;pointer-events:all;opacity:0;width:100%;height:100%;z-index:2;left:0;box-sizing:border-box;padding:0;margin:0" value="false"/>
           <div style="display:flex;width:100%;height:100%">
              <div style="transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;float:left;position:relative;display:block;flex-shrink:0;width:24px;margin-right:16px;margin-left:0;height:24px">
                 <div>
                    <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.base400};height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;position:absolute;opacity:1;transform:scale(1)" viewBox="0 0 24 24">
                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                    </svg>
                    <svg style="display:inline-block;color:rgba(0, 0, 0, 0.87);fill:${this.props.context.theme.boaPalette.pri500};height:24px;width:24px;user-select:none;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;position:absolute;opacity:1;transform:scale(0);transform-origin:50% 50%" viewBox="0 0 24 24">
                       <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                    </svg>
                 </div>
                 <div></div>
                 <div style="position:absolute;height:100%;width:100%;top:0;left:0"></div>
              </div>
           </div>
        </div>

      `;

      // selectedCheckBoxString = ReactDOMServer.renderToString(this.getSelectRadioButton(true));
      // unSelectedCheckBoxString = ReactDOMServer.renderToString(this.getSelectRadioButton(false));
    }
    selectedCheckBoxString = selectedCheckBoxString.replace(/#/g, '\\#');
    unSelectedCheckBoxString = unSelectedCheckBoxString.replace(/#/g, '\\#');

    let radioStyle = '';
    if (this.selectable == 'multiple')
      radioStyle = '';
    else
      radioStyle = `
      width: 100%; text-align: center
    `;


    var kendoTemplate;

    return (dataItem) => {
      var selected = dataItem.isSelected ? dataItem.isSelected : false;
      if (selected)
        kendoTemplate = selectedCheckBoxString;
      else
        kendoTemplate = unSelectedCheckBoxString;

      dataItem.dataGridId = this.dataGridId;


      // var cellId = this.generateCellId(columnIndex, dataItem.bDataGridIndex);
      return window.kendo.template(' <div style="' + radioStyle + '"  id="bdatatemplate#=uid#" data-index=#=bDataGridIndex#  onmouseover="window[\'#=dataGridId#\'].hydrateSelectCell(' + (selected) + ' , this)"   >' + kendoTemplate + '</div>')(dataItem);

    };
  }

  /**
   * generateSelectCellHeaderTemplate
   */
  generateSelectCellHeaderTemplate() {
    return window.kendo.template('<div id="' + this.generateCellId(0) + '"  ></div>')({ dataGridId: this.dataGridId });
  }


  /**
   * getKendoReactTemplate
   * @param {*} columnIndex
   */
  getKendoReactTemplate(columnIndex) {

    return (dataItem) => {
      dataItem.dataGridId = this.dataGridId;
      var cellId = this.generateCellId(columnIndex, dataItem.bDataGridIndex);

      // TODO: databound da değil de burada da bu işlem gerçekleştirilebilir.

      // setTimeout(function() {
      //   var column=this.props.columns[columnIndex];
      //   if (column.reactTemplate) {
      //     let reactElement = column.reactTemplate(dataItem, this.props.context);
      //     if (reactElement)
      //       reactElement=React.cloneElement(
      //         reactElement, { inlineGridMode: true } // grid inline style
      //       );
      //     var cell= document.getElementById(this.generateCellId(columnIndex, dataItem.bDataGridIndex ));
      //     cell && reactElement &&
      //     ReactDOM.hydrate(
      //       reactElement,
      //       cell
      //     );
      //   }
      // }.bind(this), 0);

      let divConStyle = `
        margin-right: -12px ;
        margin-left: -12px ;
        margin-bottom: -7px ;
        margin-top: -7px ;
        `;

      return window.kendo.template(
        '<div style="' + divConStyle + '"'+
        // '" ontouchstart=' + hydateFunction +
        // ' onmouseover=' + hydateFunction +
        ' id="' + cellId + '" > </div>')(dataItem); // blank
    };
  }

  /**
   * hydrateCell
   * @param {*} target
   * @param {*} columnIndex
   * @param {*} rowIndex
   */
  hydrateCell() {
    // let dataItem = this.props.dataSource[rowIndex];
    // if (!this.props.columns[columnIndex].elementArray) {
    //   this.props.columns[columnIndex].elementArray = {};
    // }
    // this.props.columns[columnIndex].elementArray[dataItem.bDataGridIndex] = this.props.columns[columnIndex].reactTemplate(dataItem, this.props.context);
    // ReactDOM.hydrate(this.props.columns[columnIndex].elementArray[rowIndex], target);
  }

  /**
   * hydrateSelectCell
   * @param {*} isSelected
   * @param {*} target
   */
  hydrateSelectCell(isSelected, target) {
    if (this.mountedCells)
      this.mountedCells.push(target);

    if (this.selectable == 'multiple') {
      ReactDOM.hydrate(this.getSelectCheckBox(isSelected), target);
    }
    else {
      ReactDOM.hydrate(this.getSelectRadioButton(isSelected), target);
    }

  }

  /**
   * generateCellId
   * @param {*} columnIndex
   * @param {*} rowIndex
   */
  generateCellId(columnIndex, rowIndex) {
    var cellName = 'cellId_' + this.dataGridId + '_' + (rowIndex ? rowIndex : '-1') + '_' + columnIndex;
    return cellName;
  }

  /**
   * onToggleFilter
   */
  onToggleFilter() {

    if (this.dataGrid.widgetInstance.getOptions().filterable == false || this.dataGrid.widgetInstance.getOptions().filterable == undefined) {
      this.dataGrid.widgetInstance.setOptions({
        filterable: {
          mode: 'row'
        }
      });
    }
    else {
      this.dataGrid.widgetInstance.setOptions({
        filterable: false
      });
    }

    if (this.props.headerBarOptions.onToggleFilter) {
      this.props.headerBarOptions.onToggleFilter();
    }
  }

  /**
   * onToggleGrouping
   */
  onToggleGrouping() {

    if (this.dataGrid.widgetInstance.getOptions().groupable == false || this.dataGrid.widgetInstance.getOptions().groupable == undefined) {
      this.dataGrid.widgetInstance.setOptions({
        groupable: true
      });
      this.props.group
        && this.dataGrid.widgetInstance.dataSource.group(this.props.group);
    }
    else {
      this.dataGrid.widgetInstance.setOptions({
        groupable: false
      });
      this.dataGrid.widgetInstance.dataSource.group([]); // remove group
    }

    if (this.props.headerBarOptions.onToggleGrouping) {
      this.props.headerBarOptions.onToggleGrouping();
    }
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

  setSize(width, height) {
    if (this.dataGrid && this.dataGrid.jQueryInstance && this.dataGrid.widgetInstance) {
      this.dataGrid.jQueryInstance.height(height);
      this.dataGrid.widgetInstance.resize();
    }
    this.gridHeight = height;
  }

  /**
   * addNewRow
   * @param {*} data
   */
  addNewRow(data) {

    let dataSource = this.getDataSource();
    let rowIndex = dataSource.length;

    if (data) {
      data.bDataGridIndex = rowIndex;
    }
    else {
      data = { bDataGridIndex: rowIndex };
    }
    this.dataGrid.widgetInstance.dataSource.add(data);
    this.refreshGrid();
  }

  /**
   * refreshGrid
   */
  refreshGrid() {
    this.dataGrid &&
      this.dataGrid.widgetInstance &&
      this.dataGrid.widgetInstance.refresh();
  }


  /**
   * deleteRows
   * @param {*} rows
   */
  deleteRows(rows) {
    if (!rows || rows.length == 0)
      return;

    rows.forEach((element) => {
      this.dataGrid.widgetInstance.dataSource.remove(element);
    });
    this.refreshGrid();

    let selectedItems = this.getSelectedItems();
    if (selectedItems && selectedItems.length > 0) {
      this.setState({
        disabledDelete: false,
        disabledDivit: false,
      });
    }
    else {
      this.setState({
        disabledDelete: true,
        disabledDivit: true,
      });
    }

  }

  _getShowGrouping() {
    var showGrouping = this.props.headerBarOptions.showGrouping;
    this.props.group && this.props.group.length > 0 &&
      this.props.group.forEach(item => {
        if (item.aggregates) {
          showGrouping = false;
        }
      });
    return showGrouping;
  }

  /**
   * getGridOptions
   */
  getGridOptions() {
    var groupable = this._getShowGrouping() && this.props.group;

    var that = this;

    this.mountedCells = [];
    this.mountedGrids = [];
    this.options = {
      dataSource: this._generateDataSource(this.props.dataSource),
      columns: this.columns,
      scrollable: this.props.scrollable,
      sortable: this.props.sortable,
      groupable: groupable,
      reordable: this.props.reordable,
      resizable: this.props.resizable,
      filterable: this.props.filterable,
      selectable: this.selectable == 'singleNonPointer' || this.selectable == 'single' ? 'row' : '',
      height: this.gridHeight ? this.gridHeight : this.props.height,
      editable: this.props.editable,
      columnMenu: false,
      rowTemplate: this.props.rowTemplate,
      excel: {
        filterable: true,
        allPages: true
      },
      excelExport: (e) => {
        let now = new Date();
        let name = '' + now.getFullYear() + '' + now.getDay() + '' + now.getMilliseconds();
        e.workbook.fileName = name + '.xlsx';

        var sheet = e.workbook.sheets[0];
        var grid = e.sender;
        var columns = grid.columns;
        columns = columns.filter((col) => { return col.key != 'isSelected'; });

        // formatlanmış alanların formatlı şekilde oluşturulabilmesi için...
        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
          var row = sheet.rows[rowIndex];
          columns.forEach((element, index) => {
            if (element.template) {
              var dataItem = {};
              dataItem[element.key] = row.cells[index].value;
              row.cells[index].value = this.getFormatedColumnValue(element, dataItem);
            }
          });

        }
      },

      group: () => {

      },
      sort: () => {

      },
      filter: () => {

      },
      detailInit: this.props.subGridProperties ? (e) => {
        // if (e.data.isOpenSubGrid)
        //   return;
        e.data.isOpenSubGrid = true;
        var gridWrapperWidth = $(this.dataGrid.jQueryInstance).find('.k-grid-header-wrap')[0].offsetWidth; // todo: soldaki boşluk kadar eksilt
        let grid = (
          <div style={{
            width: gridWrapperWidth,
            marginTop: 0,
            marginBottom: 0,
            marginRight: -12,
            marginLeft: -12
          }}>
            <BDataGrid
              {...this.props}
              {...this.props.subGridProperties}
              dataSource={
                this.props.subGridProperties.dataSource ?
                  this.props.subGridProperties.dataSource :
                  e.data[this.props.subGridProperties.dataSourceName]}
              height={null}
              subGridProperties={this.props.subGridProperties.subGridProperties}
              headerBarOptions={{
                show: false,
              }}
            />
          </div>
        );
        let innerGridElement = $('<div/>').appendTo(e.detailCell);
        this.mountedGrids.push(innerGridElement[0]);
        ReactDOM.hydrate(
          grid,
          innerGridElement[0]
        );
      } : null,
      detailCollapse: function (event) {
        var dataItem = event.sender.dataItem(event.masterRow);
        dataItem.isOpenSubGrid = false;
      },
      dataBound: (event) => {
        var thisPage = this;
        if (this.props.autoFit
          && this.makeAutoFit
          && !this.columnWidths
          && this.props.dataSource
          && this.props.dataSource.length != 0) {

          event.sender.fitColumns(); // autofit logic
          this.fieldsConfig = event.sender.dataSource.options.fields;
          this.makeAutoFit = false;

        }
        // daha önce satır içlerine çizilen react objeleri kaldırılıyor...
        this.unmountElements(this.mountedCells);
        this.unmountElements(this.mountedGrids);

        // şuan çizilmekte olan satırlar
        event.sender.items().each(function () {
          var dataItem = event.sender.dataItem(this);
          window.kendo.bind(this, dataItem);

          // seçili satırlar işaretleniyor.
          if (dataItem.isSelected) {
            $(this).addClass('k-state-selected');
          }
          // Satır renklendirmeleri
          if (dataItem.rowColor) {
            $(this).css('cssText', 'background-color: ' + dataItem.rowColor + ' !important');
          }

          //
          if (thisPage.props.onRowDoubleClick) {
            $(this).dblclick(() => {
              thisPage.props.onRowDoubleClick(dataItem);
            });
          }


          // Column renklendirmeleri
          thisPage.state.coloredColumns &&
            thisPage.state.coloredColumns.forEach((column) => {
              let cell = $(this).find('[data-field=' + column.key + ']');
              $(cell).css('cssText', 'background-color: ' + column.color(dataItem, thisPage.props.context) + ' !important');
              // todo:  callback fonksiyonundan [color()] dönen değer saklanarak tekrar çağrılmayabilir perf. için.
            }
            );

          // Clickable Text
          thisPage.state.clickableColumns &&
            thisPage.state.clickableColumns.forEach((column) => {
              let cell = $(this).find('[data-field=' + column.key + ']');
              let styleText = 'color: ' + thisPage.props.context.theme.boaPalette.pri500 + ' !important; cursor: pointer; text-decoration: underline';
              $(cell).css('cssText', styleText);
              $(cell).click(() => {
                column.textClicked(dataItem, thisPage.props.context);
              });
              // todo: mobil cihazlarda touch event lara da bağlama ihtiyacı olabilir.
            }
            );

          // icon
          // thisPage.state.iconColumns &&
          //   thisPage.state.iconColumns.forEach((column) => {
          //     let iconResult=column.icon(dataItem, thisPage.props.context);
          //     var svgIcon= BIcon.getIcon(thisPage.props.context, iconResult);
          //     let cell= $(this).find('[data-field=' + column.key + ']');

          //     let innerGridElement=$('<div/>').appendTo(cell);

          //     let styleText='cursor: pointer;';
          //     $(cell).css('cssText', styleText);
          //     $(cell).click(()=>{
          //       iconResult.onClick();
          //     });

          //     // this.mountedGrids.push(innerGridElement[0]);
          //     ReactDOM.hydrate(
          //       svgIcon,
          //       innerGridElement[0]
          //     );
          //     // todo: mobil cihazlarda touch event lara da bağlama ihtiyacı olabilir.
          //   }
          // );


          // expand edilen satırlar geri açılıyor
          if (dataItem.isOpenSubGrid) {
            // event.sender.expandRow(this);
            setTimeout(function () {
              event.sender.expandRow(this);
            }.bind(this), 0);
          }

          // eğer reactTemplate kullanılmış ise hücrelere bileşenler yerleştiriliyor.
          thisPage.state.reactTemplateColumns &&
            thisPage.state.reactTemplateColumns.forEach((column) => {
              let reactElement = column.reactTemplate(dataItem, thisPage.props.context, column);
              if (reactElement)
                reactElement = React.cloneElement(
                  reactElement, { inlineGridMode: true } // grid inline style
                );
              var cell = document.getElementById(thisPage.generateCellId(column.columnIndex, dataItem.bDataGridIndex));

              var appReact = (
                <BAppProvider theme={thisPage.props.context.theme}>
                  {reactElement}
                </BAppProvider>
              );

              if (cell && reactElement) {
                thisPage.mountedCells.push(cell);
                ReactDOM.hydrate(
                  appReact,
                  cell
                );
              }
            });

        }, thisPage);
      },
      change: function () {
        if (that.selectable == 'singleNonPointer' || that.selectable == 'single') { // sadece 1 satır seçili olabilir o da ilki
          that.selectedIndexes = [];
        }

        var selectedRow = this.select();
        var selectedDataItem = this.dataItem(selectedRow);

        that.props.dataSource.forEach(element => {
          element.isSelected = false;
        });
        selectedDataItem.isSelected = true;
        that.selectedIndexes.push(selectedDataItem.bDataGridIndex);
        that.selectedIndexes.forEach(item => {
          if (that.props.dataSource[item])
            that.props.dataSource[item].isSelected = true;
        });

        // if (that.selectable == 'single') { // todo: radio butonun seçili olmasını sağlamak için... başka bir lojik düşünülebilir.
        //   that.refreshGrid();
        // }

        if (that.selectable == 'singleNonPointer' || that.selectable == 'single') {
          // that.props.dataSource.forEach(element => {
          //   element.isSelected = false;
          // });
          that.props.dataSource[selectedDataItem.bDataGridIndex].isSelected = true;
          that.props.onRowSelectionChanged && that.props.onRowSelectionChanged(selectedDataItem, selectedDataItem.bDataGridIndex);
        }

      },
      save: function (e) {
        that.props.onRowUpdated && that.props.onRowUpdated({ rowIdx: e.model.bDataGridIndex, updated: e.values });
      }
    };

    this.options.dataSource.data && this.options.dataSource.data.forEach((dataItem, index) => {
      dataItem.bDataGridIndex = index;
    });

    return this.options;
  }

  /**
   * _generateDataSource
   * @param {*} data
   */
  _generateDataSource(data) {
    return {
      data: data,
      schema: {
        model: {
          fields: this.fieldsConfig
        }
      },
      pageSize: this.props.subGridProperties ? 50 : 30,  // hiyerarşik grid
      group: this.props.group,
      aggregate: this.props.aggregate
    };
  }

  /**
   * generateDatagrid
   */
  generateDatagrid() {

    if (this.generatedDatagrid) {
      return this.generatedDatagrid;
    }
    else {

      this.generatedDatagrid =
        (
          <KendoGrid
            ref={r => this.dataGrid = r}
            options={this.getGridOptions()}
          />
        );
      return this.generatedDatagrid;
    }
  }


  /**
   * selectRow
   * @param {*} row
   * @param {*} isSelected
   */
  selectRow(row, isSelected) {
    var dataItem = this.dataGrid.widgetInstance.dataItem(row);
    var selectedIndex = dataItem.bDataGridIndex;
    var uid = row.getAttribute('data-uid');
    var fullrow = $('tr[data-uid="' + uid + '"]');
    dataItem.isSelected = isSelected;
    this.changeSelectedRowIndex(dataItem.bDataGridIndex, isSelected);
    if (isSelected) {
      fullrow.addClass('k-state-selected');
    } else {
      fullrow.removeClass('k-state-selected');
    }
    // header checkbox ın güncellenmesi
    this.generateSelectAll();
    var that = this;

    that.props.dataSource.forEach(element => {
      element.isSelected = false;
    });

    that.selectedIndexes.forEach(item => {
      if (that.props.dataSource[item])
        that.props.dataSource[item].isSelected = true;
    });


    that.props.onRowSelectionChanged && that.props.onRowSelectionChanged(dataItem, selectedIndex, isSelected);
  }

  /**
   * selectAllRow
   * @param {*} isSelected
   */
  selectAllRow(isSelected) {
    this.allRowSelected = isSelected;
    var dataSource = this.getDataSource();
    dataSource && dataSource.length > 0 &&
      this.getDataSource().forEach(element => {
        element.isSelected = isSelected;
        this.changeSelectedRowIndex(element.bDataGridIndex, isSelected);
      });
    this.refreshGrid();
    // this.dataGrid.widgetInstance.trigger('dataBound');
    this.generateSelectAll();

    var that = this;

    that.props.dataSource.forEach(element => {
      element.isSelected = false;
    });

    that.selectedIndexes.forEach(item => {
      if (that.props.dataSource[item])
        that.props.dataSource[item].isSelected = true;
    });


    that.props.onRowSelectionChanged && that.props.onRowSelectionChanged(null, null, isSelected);
  }

  /**
   * getSelectedItems
   */
  getSelectedItems() {
    let dataSource = this.getDataSource();
    var selectedItems = [];
    if (this.selectable == 'multiple') {

      dataSource && dataSource.forEach((element) => {
        if (element.isSelected) {
          selectedItems.push(element);
        }
      });
      return selectedItems;
    } else {
      dataSource && dataSource.forEach((element) => {
        if (element.isSelected) {
          selectedItems.push(element);
        }
      });
      return selectedItems;
    }
  }

  /**
   * getSelectedRowIndexes
   */
  getSelectedRowIndexes() {
    return this.selectedIndexes;
  }

  /**
   * changeSelectedRowIndex
   * @param {*} index
   * @param {*} isSelected
   */
  changeSelectedRowIndex(index, isSelected) {

    if (isSelected) {
      var findIndex = this.selectedIndexes.indexOf(index);
      if (findIndex == -1) {
        this.selectedIndexes.push(index);
      }
    }
    else {
      if (findIndex != -1) {
        this.selectedIndexes.splice(findIndex, 1);
      }
    }
    // todo metod
    if (this.selectedIndexes && this.selectedIndexes.length > 0) {
      this.setState({
        disabledDivit: false,
        disabledDelete: false
      });
    }
    else {
      this.setState({
        disabledDivit: true,
        disabledDelete: true
      });
    }

  }

  /**
   * setSelectedRowIndexes
   * @param {*} selectedIndexes
   */
  setSelectedRowIndexes(selectedIndexes) {
    let dataSource = this.getDataSource();
    if (dataSource == null || dataSource == undefined || dataSource.length == 0) {
      dataSource = this.props.dataSource;
    }
    if (selectedIndexes > -1) {
      this.selectedIndexes = selectedIndexes;

      // TODO:selectedIndex yapısı kaldırıldığında burası da kaldırılacak...
      if (dataSource && dataSource.length > 0) {
        dataSource.forEach(element => {
          element.isSelected = false;
        });
      }

      if (dataSource && dataSource.length > 0 && this.selectedIndexes && this.selectedIndexes.length > 0) {
        this.selectedIndexes.forEach((element) => {
          var item = dataSource[element];
          if (item != null) {
            dataSource[element].isSelected = true;
            if (this.selectable == 'singleNonPointer' || this.selectable == 'single') { // sadece 1 satır seçili olabilir o da ilki
              return;
            }
          }
        });
      }
      this.refreshGrid();

    }
  }

  /**
   * getColumnWidths
   */
  getColumnWidths() {
    let dataSource = this.getDataSource();
    var columnWidths = [];
    if (dataSource && dataSource.length
      && this.dataGrid.widgetInstance.table[0]
      && this.dataGrid.widgetInstance.table[0].rows
      && this.dataGrid.widgetInstance.table[0].rows[0].cells
    ) {
      var columns = this.dataGrid.widgetInstance.columns.filter((col) => { return !col.locked; });
      columns.forEach((col, i) => {
        // var colItem = {
        //   field: col.field,
        //   width: this.dataGrid.widgetInstance.table[0].rows[0].cells[i].offsetWidth
        // };
        // columnWidths.push(colItem);
        this.dataGrid.widgetInstance.table[0].rows[0].cells &&
          this.dataGrid.widgetInstance.table[0].rows[0].cells[i] &&
          columnWidths.push(this.dataGrid.widgetInstance.table[0].rows[0].cells[i].offsetWidth);
      });
    }

    return columnWidths;
  }

  /**
   * setColumnWidths
   * @param {*} columnWidths
   */
  setColumnWidths(columnWidths) {
    this.columnWidths = columnWidths;
  }

  /**
   * getSnapshot
   */
  getSnapshot() {
    return {
      selectedRowIndexes: this.getSelectedRowIndexes(),
      columnWidths: this.getColumnWidths()

    };
  }

  /**
   * setSnapshot
   * @param {*} snapshot
   */
  setSnapshot(snapshot) {
    this.setSelectedRowIndexes(snapshot.selectedRowIndexes);
    this.setColumnWidths(snapshot.columnWidths);
  }

  /**
   * getDataSource
   */
  getDataSource() {
    var dataSource =
      this.dataGrid &&
      this.dataGrid.widgetInstance &&
      this.dataGrid.widgetInstance.dataSource &&
      this.dataGrid.widgetInstance.dataSource.data();

    return dataSource;
  }

  _getThis() {
    return window[this.dataGridId];
    // return this;
  }
}

export default BDataGrid;
