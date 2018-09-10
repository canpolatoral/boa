import React from 'react';
import PropTypes from 'prop-types';
import ResourceTreeDialog from './ResourceTreeDialog';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import { BProgress } from 'b-progress';
import { BComboBox } from 'b-combo-box';
import { BToolTip } from 'b-tool-tip';
import { BFormManager } from 'b-form-manager';
import { ResourceNode, ResourceActionContract } from './model';
import * as helper from './helper';
import _ from 'lodash';

interface state {
  resourceList: Array<ResourceNode>;
  selectedResourceList: Array<ResourceNode>;
  resourceActionList: Array<ResourceActionContract>;
  selectedResourceCodeList: Array<String>;
  selectedResourceIdList: Array<Number>;
  displayText: String;
  toolTipText: Array<any>;
}

@BComponentComposer
export class BResourceBrowser extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    labelResource: PropTypes.string,
    hintResource: PropTypes.string,
    labelActions: PropTypes.string,
    hintActions: PropTypes.string,
    errorText: PropTypes.string,
    isAuthorizedResourcesOnly: PropTypes.bool,
    canMultipleSelect: PropTypes.bool,
    showParentsHaveNoChildren: PropTypes.bool,
    canCheckChildsByParent: PropTypes.bool,
    actionListVisibility: PropTypes.bool,
    onResourceSelect: PropTypes.func,
    onResourceActionSelect: PropTypes.func,
    onResetValue: PropTypes.func,
    typeIdFilterList: PropTypes.array,
    channelId: PropTypes.number,
    channelIdList: PropTypes.array,
    tagFilter: PropTypes.string,
    selectedResourceAction: PropTypes.object,
    selectedResourceId: PropTypes.number,
    selectedResourceIdList: PropTypes.arrayOf(PropTypes.number),
    selectedResourceCode: PropTypes.string,
    selectedResourceCodeList: PropTypes.arrayOf(PropTypes.string),
    isChoosable: PropTypes.bool,
    showDetailedResourceName: PropTypes.bool
  };

  /**
   * Default props
   */
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    isAuthorizedResourcesOnly: false,
    canMultipleSelect: false,
    canCheckChildsByParent: false,
    showParentsHaveNoChildren: false,
    actionListVisibility: true,
    typeIdFilterList: [],
    channelIdList: [],
    selectedResourceCodeList: [],
    selectedResourceIdList: [],
    isChoosable: true,
    showDetailedResourceName: true
  };

  /**
   * Default state
   */
  state: state = {
    resourceList: [],
    selectedResourceList: [],
    displayText: null,
    toolTipText: [],
    resourceActionList: [],
    selectedResourceAction: this.props.selectedResourceAction,
    selectedResourceCodeList:
      this.props.selectedResourceCodeList.length > 0
        ? this.props.selectedResourceCodeList
        : this.props.selectedResourceCode
          ? [this.props.selectedResourceCode]
          : [],
    selectedResourceIdList:
      this.props.selectedResourceIdList.length > 0
        ? this.props.selectedResourceIdList
        : this.props.selectedResourceId
          ? [this.props.selectedResourceId]
          : []
  };

  constructor(props, context) {
    super(props, context);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.handleOnActionSelect = this.handleOnActionSelect.bind(this);
  }

  /**
   * Clear button
   */
  clearButton = {
    dynamicIcon: 'Clear',
    iconProperties: { color: this.props.context.theme.boaPalette.base400 },
    onClick: () => {
      this.resetValue();
    }
  };

  refreshButton = {
    dynamicIcon: 'Refresh',
    iconProperties: { color: this.props.context.theme.boaPalette.base400 },
    onClick: () => {
      this.loadResourceList(this.props, true);
    }
  };

  /**
   * Open dialog button
   */
  openDialogButton = {
    dynamicIcon: 'AddCircleOutline',
    iconProperties: { color: 'primary' },
    onClick: () => {
      this.openResourceDialog();
    }
  };

  /**
   * Loading icon
   */
  loadingIcon = (
    <BProgress
      context={this.props.context}
      size={20}
      progressType={'circular'}
      mode={'indeterminate'}
      style={{
        color: this.props.context.theme.boaPalette.base400,
        position: 'absolute',
        top: '30%',
        right: !this.props.context.localization.isRightToLeft ? '5px' : 'auto'
      }}
    />
  );

  /**
   * Resource action columns
   */
  actionsColumns = [
    { key: 'name', name: this.getMessage('BusinessComponents', 'ActionName'), width: 120 },
    { key: 'actionId', name: this.getMessage('BusinessComponents', 'ActionIdLabel'), width: 140 },
    { key: 'commandName', name: this.getMessage('BusinessComponents', 'CommandName'), width: 140 },
    { key: 'description', name: this.getMessage('BusinessComponents', 'Description'), width: 140 },
    { key: 'hasAccounting', name: this.getMessage('BusinessComponents', 'HasAccounting'), width: 140 },
    { key: 'hasSlip', name: this.getMessage('BusinessComponents', 'HasSlip'), width: 140 },
    { key: 'hasCommission', name: this.getMessage('BusinessComponents', 'HasCommission'), width: 140 },
    { key: 'isVirtual', name: this.getMessage('BusinessComponents', 'IsVirtual'), width: 140 },
    { key: 'isAssignable', name: this.getMessage('BusinessComponents', 'IsAssignable'), width: 140 }
  ];

  /**
   * componentDidMount
   */
  componentDidMount() {
    super.componentDidMount();

    if (this.state.selectedResourceCodeList.length > 0 || this.state.selectedResourceIdList.length > 0) {
      this.loadData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if (
        !_.isEqual(this.props.selectedResourceCodeList, nextProps.selectedResourceCodeList) ||
        !_.isEqual(this.props.selectedResourceIdList, nextProps.selectedResourceIdList)
      ) {
        let codes: Array<String> = nextProps.selectedResourceCodeList || [];
        let ids: Array<Number> = nextProps.selectedResourceIdList || [];
        this.setValue(this.state.resourceList, ids, codes);
      } else if (
        this.props.isAuthorizedResourcesOnly !== nextProps.isAuthorizedResourcesOnly ||
        this.props.channelId !== nextProps.channelId ||
        this.props.showParentsHaveNoChildren !== nextProps.showParentsHaveNoChildren ||
        this.props.tagFilter !== nextProps.tagFilter ||
        !_.isEqual(this.props.typeIdFilterList, nextProps.typeIdFilterList) ||
        !_.isEqual(this.props.channelIdList, nextProps.channelIdList)
      ) {
        this.loadResourceList(nextProps, false);
      }
    }
  }

  loadData() {
    if ((ResourceTreeDialog.StaticResourceList || []).length > 0) {
      this.setValue(_.cloneDeep(ResourceTreeDialog.StaticResourceList));
    } else {
      this.loadResourceList(this.props, false);
    }
  }

  /**
   * Load resource data from database.
   */
  loadResourceList(props: any, refresh: Boolean, callback) {
    const getData = function(response: any) {
      if (!response.success) {
        this.debugLog(this.resultErrorListToString(response.results), 3);
        this.clear();
        callback && callback(null);
      } else {
        let newList = [];
        let resourceList = Array.isArray(response.value) ? response.value : [response.value || []];
        if (resourceList.length > 0) {
          resourceList[0].parent = null; // getAllResourceListLight metodundan geldiğinde dolu geliyor, gelmemeli.
          resourceList[0].isExpanded = true;
          newList = helper.sortByNumber(resourceList);
          ResourceTreeDialog.StaticResourceList = _.cloneDeep(newList);
          this.setValue(newList);
        }
        callback && callback(newList);
      }
    };

    if (props.isAuthorizedResourcesOnly) {
      BFormManager.getAllResourceListLight(props.context.language, getData);
    } else {
      let request = {
        requestClass: 'BOA.Types.BusinessComponents.ResourceBrowserRequest',
        requestBody: {
          methodName: 'ResourceTreeWithActions',
          doNotUseCache: refresh,
          channelIdList: props.channelId ? [props.channelId] : props.channelIdList,
          canGetActions: props.actionListVisibility,
          showParentsHaveNoChildren: props.showParentsHaveNoChildren,
          typeIdFilterList: props.tagFilter ? [props.tagFilter] : props.typeIdFilterList
        }
      };
      this.proxyExecute(request, getData);
    }
  }

  setValue(
    resourceList,
    selectedResourceIds: Number[] = this.state.selectedResourceIdList || [],
    selectedResourceCodes: String[] = this.state.selectedResourceCodeList || []
  ) {
    let selectedResourceList = [];
    helper.treeForEach(resourceList, node => {
      if (selectedResourceCodes.includes(node.resourceCode) || selectedResourceIds.includes(node.id)) {
        node.isSelected = true;
        selectedResourceList.push(node);
      } else {
        node.isSelected = false;
      }
    });

    let displayText = selectedResourceList.map(item => {
      return item.name;
    });

    let toolTipText = selectedResourceList.map(item => {
      return <div> {item.name} </div>;
    });

    let selectedResourceIdList = selectedResourceList.map(item => {
      return item.id;
    });

    let resourceActionList: Array<ResourceActionContract> = [];
    selectedResourceList.forEach(element => {
      if (element.resourceActionList) {
        element.resourceActionList.forEach(actionItem => {
          resourceActionList.push(actionItem);
        });
      }
    });

    this.setState({
      resourceList: resourceList,
      selectedResourceList: selectedResourceList,
      selectedResourceIdList: selectedResourceIdList,
      resourceActionList: resourceActionList,
      displayText: displayText.join(', '),
      toolTipText: toolTipText
    });

    this.props.onResourceSelect && this.props.onResourceSelect(selectedResourceIdList, selectedResourceList);
    this.props.onDynamicChange && this.props.onDynamicChange(selectedResourceIdList);
  }

  /**
   * Set Snapshot
   * @param {*} snapshot
   */
  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  /**
   * Get Snapshot
   */
  getSnapshot() {
    return { state: this.state };
  }

  /**
   * Get data
   */
  getData(): ResourceNode[] {
    return (this.state.selectedResourceList || []).map(item => {
      delete item.parent;
      delete item.children;
      delete item.state;
      return item;
    });
  }

  /**
   * Get the value
   */
  getValue(): Number | Number[] {
    let resourceIds = this.state.selectedResourceIdList || [];
    if (this.props.canMultipleSelect) return resourceIds;
    else return resourceIds.length > 0 ? resourceIds[0] : null;
  }

  getActions(): Object[] {
    if (this.state.isLoading) return [];
    return this.state.displayText ? [this.clearButton, this.openDialogButton] : [this.openDialogButton];
  }

  getResourceTreeDialog(resourceList) {
    return (
      <ResourceTreeDialog
        context={this.props.context}
        canMultipleSelect={this.props.canMultipleSelect}
        canCheckChildsByParent={this.props.canCheckChildsByParent}
        resourceList={resourceList || this.state.resourceList}
      />
    );
  }

  /**
   * Reset value and set the default props
   */
  resetValue() {
    this.clear();
    helper.treeForEach(this.state.resourceList, (node: ResourceNode) => {
      node.isSelected = false;
    });
    if (this.props.onResetValue) {
      this.props.onResetValue();
    }
  }

  clear() {
    this.setState({
      displayText: '',
      toolTipText: [],
      selectedResourceList: [],
      selectedResourceIdList: [],
      resourceActionList: []
    });
  }

  openResourceDialog() {
    const { context, floatingLabelText } = this.props;
    let style = context.deviceSize < BComponent.Sizes.MEDIUM ? { width: '90%', height: '90%' } : { width: '80%', height: '85%' };

    if ((ResourceTreeDialog.StaticResourceList || []).length > 0) {
      let resourceList = this.state.resourceList;
      if ((resourceList || []).length == 0) {
        resourceList = _.cloneDeep(ResourceTreeDialog.StaticResourceList);
        this.setValue(resourceList);
      }
      let dialog = this.getResourceTreeDialog(resourceList);
      BDialogHelper.showWithResourceCode(context, null, dialog, 0, 0, floatingLabelText, this.onDialogClose, style);
    } else {
      this.loadResourceList(this.props, false, resourceList => {
        if (resourceList) {
          let dialog = this.getResourceTreeDialog(resourceList);
          BDialogHelper.showWithResourceCode(context, null, dialog, 0, 0, floatingLabelText, this.onDialogClose, style);
        }
      });
    }
  }

  onDialogClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
      this.setValue(this.state.resourceList, data || []);
    }
  }

  /* eslint-disable no-unused-vars */

  /**
   * Handle function fired when a resource action is selected
   * @param {*} index
   * @param {*} selectedItems
   * @param {*} selectedValues
   */
  handleOnActionSelect(index, selectedItems, selectedValues) {
    if ((selectedItems || []).length > 0) {
      let selectedAction = selectedItems[0];
      this.setState({ selectedResourceAction: selectedAction });
      this.props.onResourceActionSelect && this.props.onResourceActionSelect(selectedAction);
    }
  }

  render() {
    let actionValueMemberPath = 'actionId';
    let selectedAction = this.state.selectedResourceAction;
    let selectedResourceId = selectedAction ? [selectedAction[actionValueMemberPath]] : [];
    let labelResource = this.props.labelResource || this.getMessage('BusinessComponents', 'Screen');
    let hintResource = this.props.hintResource || this.getMessage('BusinessComponents', 'Screen');
    let hintActions = this.props.hintActions || this.getMessage('BusinessComponents', 'labelActions');
    let labelActions = this.props.labelActions || this.getMessage('BusinessComponents', 'labelActions');

    let inputAction = (
      <div style={{ position: 'relative' }}>
        <BInputAction
          context={this.props.context}
          inputDisabled={true}
          floatingLabelText={labelResource}
          hintText={hintResource}
          rightIconList={this.getActions()}
          disabled={!this.props.isChoosable}
          value={this.state.displayText}
          errorText={this.props.errorText}
        />
        {this.state.isLoading && this.loadingIcon}
      </div>
    );

    return (
      <div>
        <div style={{ position: 'relative' }}>
          {this.props.showDetailedResourceName ? (
            <BToolTip context={this.props.context} tooltip={this.state.toolTipText} tooltipPosition="down">
              <div tabIndex="0" style={{ outline: 'none', position: 'relative' }}>
                {inputAction}
              </div>
            </BToolTip>
          ) : (
            inputAction
          )}
        </div>
        {this.props.actionListVisibility && (
          <BComboBox
            ref={r => (self.comboSingle = r)}
            context={this.props.context}
            hintText={hintActions}
            labelText={labelActions}
            displayMemberPath="name"
            valueMemberPath={actionValueMemberPath}
            dataSource={this.state.resourceActionList}
            value={selectedResourceId}
            onSelect={this.handleOnActionSelect}
            columns={this.actionsColumns}
            multiSelect={false}
            multiColumn={true}
            isAllOptionIncluded={false}
            disabled={this.state.isLoading || !this.props.isChoosable}
          />
        )}
      </div>
    );
  }
}

export default BResourceBrowser;
