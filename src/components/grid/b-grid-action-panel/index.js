import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer} from 'b-component';
import { BButton } from 'b-button';
import { BDataGrid } from 'b-data-grid-dx';
import Button from '@material-ui/core/Button';
import *  as SvgIcons from '@material-ui/icons';
import { BFlexPanel } from 'b-flex-panel';
import _ from 'lodash';

@BComponentComposer
export class BGridActionPanel extends BComponent {
  static defaultProps = {
    ...BComponent.defaultProps,
    historyButtonText: null,
    addButtonText: null,
    dontShowGridIfItemNotExists: false, // gridi göster
    multiSelection: false,
    sortable: false,
    groupable: false,
    reordable: false,
    resizable: true,
    filterable: false,
    columnMenu: false,
    selectable: 'single',
    editable: false,
    showHeaderBar: false,
    buttonList:[]
  };

  static propTypes = {
    ...BComponent.defaultProps,
    ...BDataGrid.defaultProps,
    addButtonText: PropTypes.string,
    historyButtonText: PropTypes.string,
    showAddButton: PropTypes.bool,
    showDeleteButton: PropTypes.bool,
    showEditButton: PropTypes.bool,
    showHistoryButton: PropTypes.bool,
    showHeaderBar: PropTypes.bool,
    addButtonDisabled: PropTypes.bool,
    historyButtonDisabled: PropTypes.bool,
    dontShowGridIfItemNotExists: PropTypes.bool, // Eğer herhangi bir item yoksa gridi gösterme, sadece ekle butonu görünecek
    onItemSelected: PropTypes.func,
    onItemsSelected: PropTypes.func,
    onAddClicked: PropTypes.func,
    onEditClicked: PropTypes.func,
    onDeleteClicked: PropTypes.func,
    onDeleteItemsClicked: PropTypes.func,
    onHistoryClicked: PropTypes.func,
    selectedIndex: PropTypes.number,
    style: PropTypes.any,
    onRowUpdated: PropTypes.func,
    buttonList: PropTypes.array,
    onFooterClicked: PropTypes.func
  };

  state = {
    selectedIndex: this.props.selectedIndex !== undefined ? this.props.selectedIndex : this.props.selectable == 'multiple' ? [] : -1,
    selectedItem: null,
    disabledDeleteAction: true,
    disabledEditAction: true
  };

  constructor(props, context) {
    super(props, context);
    this.handleOnRowSelectionChanged = this.handleOnRowSelectionChanged.bind(this);
    this.handleOnAddClicked = this.handleOnAddClicked.bind(this);
    this.handleOnDeleteClicked = this.handleOnDeleteClicked.bind(this);
    this.handleOnEditClicked = this.handleOnEditClicked.bind(this);
    this.handleOnHistoryClicked = this.handleOnHistoryClicked.bind(this);
    this.handleOnRowUpdate = this.handleOnRowUpdate.bind(this);
    this.handleCustomOnClicked = this.handleCustomOnClicked.bind(this);
    this.gridWidth = 500;
    this.gridHeight = 300;
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.buttonList != nextProps.buttonList ||
      this.props.selectedIndex != nextProps.selectedIndex ||
      this.props.dataSource != nextProps.dataSource) {
      this.setState({
        dataSource:  nextProps.dataSource,
        buttonList:  nextProps.buttonList,
        selectedIndex: nextProps.selectedIndex
      });
    }
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  handleCustomOnClicked(e, callBack) {
    if (this.props.onFooterClicked) {
      return this.props.onFooterClicked(e, callBack);
    }
  }

  populateActions(actionList) {
    let actionButtons = [];
    actionList.forEach(element => {
      actionButtons.push(this.createAction(element));
    }, this);

    return actionButtons;
  }

  createAction(action) {
    const {context} = this.props;
    let icon = SvgIcons[action.icon];
    let DynamicIcon = icon;
    return (
      <Button
        context={context}
        color="primary"
        onClick={() => {
          this.handleCustomOnClicked(action.name);
        }}
        style={{margin: context.theme.spacing.unit}}
        disabled={action.disabled}>{icon != null? <div style={{marginRight:'5px'}}> <DynamicIcon /></div>:null} {action.label}</Button>
    );
  }

  getSelectedItem() {
    return this.state.selectedItem;
  }

  getSelectedRowIndex() {
    return this.state.selectedIndex;
  }

  /**
   * Get the selected value
   */
  getValue() {
    return {
      index: this.getSelectedRowIndex(),
      item: this.getSelectedItem()
    };
  }

  /**
   * Handle function fired when row selection is changed
   */
  handleOnRowSelectionChanged(dataItem, selectedIndex) {
    if (this.dataGrid ==undefined) return;

    let selectedItems = this.dataGrid.getSelectedItems();
    let selectedIndexes = this.dataGrid.getSelectedRowIndexes();

    if (this.props.selectable == 'multiple') {

      this.setState({
        selectedIndex: selectedIndexes,
        selectedItem: selectedItems,
        disabledDeleteAction: selectedIndexes && selectedIndexes.length > 0 ? false : true,
        disabledEditAction: selectedIndexes && selectedIndexes.length == 1 ? false : true
      });

    } else {
      this.setState({
        selectedIndex: selectedItems ? selectedIndexes[0] :null,
        selectedItem: selectedItems ? selectedItems[0] :null,
        disabledDeleteAction: selectedItems ? false : true,
        disabledEditAction: selectedItems ? false : true
      });
    }

    if (this.props.onItemSelected) {
      if (this.state.buttonList == undefined || this.state.buttonList==null || this.state.buttonList.length == 0)
      {
        this.props.onItemSelected(selectedIndex, dataItem);
      } else {
        this.props.onItemSelected(selectedIndexes, dataItem);
      }
    }
  }

  /**
   * Handle function fired when add button is clicked
   * @param {any} e
   */
  handleOnAddClicked() {
    if (this.props.onAddClicked) {
      this.props.onAddClicked();
    } else if (this.props['buttonOpenScreen'] && this.props['buttonOpenScreen'].resourceData) {
      var resourceData = this.props['buttonOpenScreen'].resourceData;
      var resourceCode = resourceData.resourceCode;
      var resourceName = resourceData.name;
      if (resourceCode && resourceName) {
        BComponent.FormManager.showDialog(resourceCode, undefined, resourceName);
      }
    }
  }

  /**
   * Handle function fired when delete button is clicked
   * @param {any} e
   */
  handleOnDeleteClicked() {
    if (this.props.selectable == 'multiple') {
      if (this.props.onDeleteItemsClicked) {
        this.props.onDeleteItemsClicked(this.getSelectedRowIndex(), this.getSelectedItem());
      }
    } else {
      if (this.props.onDeleteClicked) {
        let selectedItem = this.getValue();
        this.props.onDeleteClicked(selectedItem.index, selectedItem.item);
      }
    }
  }

  /**
   * Handle function fired when edit button is clicked
   * @param {any} e
   */
  handleOnEditClicked() {
    if (this.props.selectable == 'multiple') {
      if (this.props.onEditClicked) {
        this.props.onEditClicked(this.state.selectedIndex[0], this.state.selectedIndex[0]);
      }
    } else {
      if (this.props.onEditClicked) {
        let selectedItem = this.getValue();
        this.props.onEditClicked(selectedItem.index, selectedItem.item);
      }
    }
  }

  /**
   * Handle function fired when history button is clicked
   * @param {any} e
   */
  handleOnHistoryClicked() {
    if (this.props.onHistoryClicked) {
      let selectedItem = this.getValue();
      this.props.onHistoryClicked(selectedItem && selectedItem.index, selectedItem && selectedItem.item);
    }
  }

  /**
   * How to use in your component ?
   * yourcomponent.state.dataSource[index][fieldName] = newValue;
   */
  handleOnRowUpdate(row) {
    this.props.onRowUpdated && this.props.onRowUpdated(row);
    if (row) {
      if (this.props.onItemUpdated) {
        let index = row.rowIdx;
        let fieldName = _.first(Object.keys(row.updated));
        let newValue = row.updated[fieldName];
        this.props.onItemUpdated(index, fieldName, newValue);
      }
    }
  }

  render() {

    let { context, addButtonText, buttonList, ...gridProps } = this.props;

    if (buttonList != undefined && buttonList.length > 0  ) {
      this.actionButtons = this.populateActions(buttonList);
    }

    const actionsDivStyle = {
      width: '100%',
      textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    };

    const actionsParentDivStyle = {
      width: '100%'
    };

    let showGrid = true;
    if (this.props.dontShowGridIfItemNotExists) {
      if (this.props.dataSource && this.props.dataSource.length > 0) {
        showGrid = true;
      } else {
        showGrid = false;
      }
    }

    let Delete = SvgIcons['Delete'];
    let Create = SvgIcons['Create'];

    return (
      <div style={this.props.style} >
        {showGrid && (
          <div className="dgWrap">
              {this.props.buttonList.length > 0 && (
              <BDataGrid
                  context={context}
                  ref={r => (this.dataGrid = r)}
                  {...gridProps}
                  selectedIndexes={this.props.selectable == 'multiple' ? this.state.selectedIndex : [this.state.selectedIndex]}
                  onRowSelectionChanged={this.handleOnRowSelectionChanged}
                  onRowUpdated={this.handleOnRowUpdate}
                />
              )}
              {this.props.buttonList.length == 0 && (
              <BDataGrid
                context={context}
                ref={r => (this.dataGrid = r)}
                {...gridProps}
                headerBarOptions={{ show: this.props.showHeaderBar }}
                selectedIndexes={this.props.selectable == 'multiple' ? this.state.selectedIndex : [this.state.selectedIndex]}
                onRowSelectionChanged={this.handleOnRowSelectionChanged}
                onRowUpdated={this.handleOnRowUpdate}
              />
              )}
          </div>
        )}
        {this.props.buttonList.length > 0 && this.actionButtons != undefined && (
          <div className="actionButtonWrap">
            <BFlexPanel
                alignItems="center"
                responsive={false}
                ref={r => (this.actionsParentDiv = r )}
                style={actionsParentDivStyle}>
              <BFlexPanel
                alignItems="center"
                responsive={false}
                ref={r => { this.actionsDiv = r;}}
                style={actionsDivStyle}>
                {this.actionButtons}
              </BFlexPanel>
            </BFlexPanel>
          </div>
          )}
        {this.props.showHistoryButton &&
          showGrid && this.props.buttonList.length > 0 && this.actionButtons == undefined && (
            <div className="historyButtonWrap">
              <BButton
                context={context}
                type="flat"
                text={this.props.historyButtonText || this.getMessage('BOA', 'History')}
                colorType="primary"
                disabled={this.props.historyButtonDisabled}
                onClick={this.handleOnHistoryClicked}
                style={{ minWidth: '70px' }}
              />
            </div>
          )}
        {this.props.buttonList.length == 0 && this.actionButtons == undefined && (
          <div className="actionButtonWrap">
            {this.props.showAddButton && (
              <BButton
                context={context}
                type="flat"
                text={addButtonText || this.getMessage('BusinessComponents', 'Add')}
                colorType="primary"
                disabled={this.props.addButtonDisabled}
                style={{ minWidth: '70px' }}
                onClick={this.handleOnAddClicked}
              />
            )}
            {this.props.showDeleteButton &&
              showGrid && (

               // let DynamicIcon = icon;
                <BButton
                  context={context}
                  type="flat"
                  icon={<Delete />}
                  disabled={this.state.disabledDeleteAction}
                  onClick={this.handleOnDeleteClicked}
                  style={{ minWidth: '40px' }}
                />
              )}
            {this.props.showEditButton &&
              showGrid && (
                <BButton
                  context={context}
                  type="flat"
                  icon={<Create />}
                  disabled={this.state.disabledEditAction}
                  onClick={this.handleOnEditClicked}
                  style={{ minWidth: '40px' }}
                />
              )}
          </div>
          )}
        <style>
          {`
              .dgWrap { margin-bottom:10px; }
              .actionButtonWrap { float:right; }
              .historyButtonWrap { float:left; }
          `}
        </style>
      </div>
    );
  }

  getSelectedRowIndexes() {
    return this.dataGrid.getInstance().getSelectedRowIndexes();
  }

  getSelectedItems() {
    return this.dataGrid.getInstance().getSelectedItems();
  }

  setSize(gridWidth, gridHeight) {
    this.dataGrid.getInstance().setSize(gridWidth, gridHeight);
  }
}

export default BGridActionPanel;
