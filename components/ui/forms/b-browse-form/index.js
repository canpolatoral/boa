import React from 'react'; import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { BComponent, Utils, BComponentComposer } from 'b-component';
import { BBaseForm } from 'b-base-form';
import { BCard } from 'b-card';
import { BDataGrid } from 'b-data-grid-dx';
import { BCriteriaPanel } from 'b-criteria-panel';
import { BScroll } from 'b-scroll';
import { BVirtualizedList  } from 'b-virtualized-list';
import { AutoSizer  } from 'react-virtualized';


@BComponentComposer
export class BBrowseForm extends BBaseForm {


  static propTypes = {
    /**
     * BBaseForm prop types.
     */
    ...BBaseForm.propTypes,

    /**
     * BDataGrid prop types.
     */
    ...BDataGrid.propTypes,

    /**
     * Criteria pane expanded/collapsed status. Default true (expanded).
     */
    criteriaPanelExpanded: PropTypes.bool,
    /**
     * Criteria pane can expandable status. Default true (expandable).
     */
    criteriaPanelExpandable: PropTypes.bool,
    /**
     * Criteria pane header button text. Default 'Criterias'.
     */
    criteriaPanelHeader: PropTypes.string,

    /**
     * Callback function fired when datagrid row selection changed event.
     */
    onGridRowSelectionChanged: PropTypes.func,

    /**
     * hideActionManager
     */
    hideActionManager: PropTypes.bool,

     /**
     * isRenderCustomRow, default: false
     */
    isRenderCustomRow:PropTypes.bool,

    /**
     * customRowProperties
     */
    customRowProperties:PropTypes.any,

    /**
     * hideCriteriPanel default false
     */
    hideCriteriaPanel: PropTypes.bool,


  };

  static defaultProps = {
    ...BBaseForm.defaultProps,
    ...BDataGrid.defaultProps,

    selectable:BDataGrid.Selectables.MULTIPLE,

    leftPaneWidth: 270,
    leftPaneMaxWidth: 511,
    rightPaneWidth: 0,
    rightPaneMaxWidth: 511,
    criteriaPanelExpanded: true,
    criteriaPanelExpandable: true,
    criteriaPanelHeader: null,
    hideCriteriaPanel:false
  };

  constructor(props, context) {
    super(props, context);
    this.onCriteriaExpandChanged = this.onCriteriaExpandChanged.bind(this);
    this.onGridRowSelectionChanged = this.onGridRowSelectionChanged.bind(this);


    this.criteriaExpanded = this.props.criteriaPanelExpanded;

    this.gridWidth = 500;
    this.gridHeight = 300;

    this.selectedIndexes = this.props.selectedIndexes;

  }

  componentDidMount() {
    super.componentDidMount();
    this.props.pageLoaded && this.props.pageLoaded();
  }

  componentWillUnmount() {
    super.componentWillUnmount();

  }

  setDisable(disabled) {
    this.baseForm && this.baseForm.getInstance().setDisable(disabled);
  }

  disableAction(commandName) {
    this.baseForm && this.baseForm.getInstance().disableAction(commandName);
  }

  enableAction(commandName) {
    this.baseForm && this.baseForm.getInstance().enableAction(commandName);
  }

  render() {

    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;

    let marginTop=isMobileOrTablet ? 8 : 24;
    const divStyle = {
      marginLeft: isMobileOrTablet ? 0 : 24,
      marginRight: isMobileOrTablet ? 0 : 24,
      marginTop: marginTop,
      marginBottom: 0,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      position: 'absolute'
    };
    const scrollContentStyle = { paddingTop: 12, paddingLeft: !Utils.isMobile(this.props) ? 24 : 16, paddingRight: !Utils.isMobile(this.props) ? 24 : 16 };
    let criteriaStyle = {
      width: '100%',
      height: '100%'
    };
    criteriaStyle = merge(criteriaStyle, this.props.style ? this.props.style : {});

    var criteriaContent, criteriaPanel;

    if (this.props.children) {
      criteriaContent = (
        <BScroll context={this.props.context} /* option={{ suppressScrollX: true }}*/ >
          <div style={scrollContentStyle}>
            {this.props.children}
          </div>
        </BScroll>
      );

      criteriaPanel = Utils.isMobile(this.props) ? criteriaContent : (
        <BCriteriaPanel context={this.props.context}
          onExpandChange={this.onCriteriaExpandChanged}
          expanded={this.criteriaExpanded}
          expandable={this.props.criteriaPanelExpandable}
          header={this.props.criteriaPanelHeader || this.getMessage('BusinessComponents', 'Criterias')} >
          <div style={criteriaStyle}>
            {criteriaContent}
          </div>
        </BCriteriaPanel>
      );
    }

    let headerBarOptions={
      show: true,
      showTitle: true,
      title: this.getMessage('BOA', 'ResutList'),
      showFiltering: true,
      showGrouping: true,
      showMoreOptions: true
    };

    return (
      <BBaseForm
        ref={r => this.baseForm = r}
        {...this.props}
        leftPaneContent={ this.props.hideCriteriaPanel ? null :criteriaPanel}
        >

        {(this.props.isRenderCustomRow==false || this.props.isRenderCustomRow==undefined ) ?

          <AutoSizer disableWidth={true}>
            {({ height }) => {
              return (
                <div style={divStyle}>
                  <BCard context={this.props.context}
                    disableGridBehaviour>
                    <div >
                      <BDataGrid context={this.props.context}
                        ref={r => this.datagrid = r}
                        columns={this.props.columns}
                        dataSource={this.props.dataSource}
                        editingDataOptions={this.props.editingDataOptions}
                        treeDataOptions={this.props.treeDataOptions}
                        filters={this.props.filters}
                        expandedGroups={this.props.expandedGroups}
                        grouping={this.props.grouping }
                        sorting={this.props.sorting }
                        aggregate={this.props.aggregate}
                        rowStyle={this.props.rowStyle && this.props.rowStyle.bind(this)}
                        onRowDoubleClick={this.props.onRowDoubleClick && this.props.onRowDoubleClick.bind(this)}
                        subGridProperties={this.props.subGridProperties && this.props.subGridProperties.bind(this)}
                        rowDetail={this.props.rowDetail && this.props.rowDetail.bind(this)}
                        maxHeight={height-marginTop}
                        isInsideTheCard={false}
                        selectable={ this.props.selectable }
                        onRowSelectionChanged={this.onGridRowSelectionChanged}
                        snapshot={this.props.snapshot}
                        emptyText={this.getMessage('BOAOne', 'UseCriteriaFieldToQuery')}
                        headerBarOptions={headerBarOptions}
                        userSetting={this.props.userSetting}
                        page={this.props.page}
                      />
                    </div>
                  </BCard>
                </div>
              );
            }}
          </AutoSizer>
          :
          <BVirtualizedList
            {...this.props.customRowProperties}
            context={this.props.context}
            dataSource={ this.props.dataSource}
            rowRenderer={this.props.rowRenderer.bind(this)}
            >

          </BVirtualizedList>

        }


      </BBaseForm>
    );
  }

  onCriteriaExpandChanged(isExpanded) {
    this.debugLog('BrowseForm.CriteriaHeader clicked!');
    this.criteriaExpanded = isExpanded;
    this.baseForm.getInstance().updateLeftPane(isExpanded);
  }

  updateRightPane(isExpanded) {
    this.baseForm.getInstance().updateRightPane(isExpanded);
  }

  onGridRowSelectionChanged() {
    this.props.onGridRowSelectionChanged && this.props.onGridRowSelectionChanged(this.getSelectedRows(), this.datagrid.lastSelectionChangedRow);
  }

  getSelectedRowIndexes() {
    return this.datagrid &&  this.datagrid.getInstance().getSelectedRowIndexes();
  }

  setSelectedRowIndexes(indexes) {
    return this.datagrid && this.datagrid.getInstance().setSelectedRowIndexes(indexes);
  }

  getSelectedRows() {
    return  this.datagrid && this.datagrid.getInstance().getSelectedItems();
  }

  getUserSettings() {
    return  this.datagrid && this.datagrid.getInstance().getUserSettings();
  }


  getSnapshot() {
    return {
      gridState: this.datagrid && this.datagrid.getSnapshot()
    };
  }

  setSnapshot(snapshot) {
    this.gridState=snapshot && snapshot.gridState;
  }
}

export default BBrowseForm;
