import React from 'react';
import PropTypes from 'prop-types';
import TransactionTreeView from './TransactionTreeView';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import { BProgress } from 'b-progress';
import { BToolTip } from 'b-tool-tip';
import _ from 'lodash';

import {
  TransactionNode,
  TransactionGroupDefinitionContract,
  TransactionDetailDefinitionContract,
  TransactionDefinitionContract,
  ParameterContract
} from './model';

interface state {
  allTransactionList: Array<TransactionDefinitionContract>;
  allTransactionDetailList: Array<TransactionDetailDefinitionContract>;
  allTransactionGroupList: Array<TransactionGroupDefinitionContract>;
  transactionNodeList: Array<TransactionNode>;
  selectedTransactionNodes: Array<TransactionNode>;
  displayText: String;
  toolTipText: any[];
}

@BComponentComposer
export class BTransactionComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    labelText: PropTypes.string,
    hintText: PropTypes.string,
    errorText: PropTypes.string,

    selectedTransactionNodes: PropTypes.arrayOf(PropTypes.string),

    /**
     * Arama değeri
     */
    searchText: PropTypes.string,

    /**
     * Birden fazla hizmet seçebilecekse kullanılır. Varsayılan False.
     */
    canMultipleSelect: PropTypes.bool,

    /**
     * Hizmet arama dialogunda başlagıç rootu(ları) istenirse set edilebilir. Root olması istenen transactiongroup un idsi set edilir.
     * CanSelectOwnTransactionGroupRoot propertysi true set edilmeli.
     */
    rootTransactionGroupIds: PropTypes.array,

    /**
     * Hizmet arama dialogunda  başlagıç rootu set edilip edilemeyeceği.
     */
    canSelectOwnTransactionGroupRoot: PropTypes.bool,

    /**
     * True set edilirse sadece yetki kontrolü aktif olan hizmetler getirilir. Varsayılan False.
     */
    showOnlyAuthorized: PropTypes.bool,

    onResetValue: PropTypes.func,

    onTransactionSelect: PropTypes.func,
    transactionCodeVisibility: PropTypes.bool
  };

  /**
   * Default props
   */
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    canMultipleSelect: true,
    canSelectOwnTransactionGroupRoot: false,
    showOnlyAuthorized: false,
    transactionCodeVisibility: true
  };

  state: state;

  constructor(props, context) {
    super(props, context);
    this.state.toolTipText = [];
    this.state.selectedTransactionNodes = this.state.selectedTransactionNodes || [];

    // if ((this.props.selectedTransactionNodes || []).length > 0) {
    //   this.props.selectedTransactionNodes.forEach(item => {
    //     let node: TransactionNode = {
    //       transactionDefinition: { transactionCode: item },
    //       transactionDetailDefinition: {},
    //       transactionGroupDefinition: {}
    //     };
    //     this.state.selectedTransactionNodes.push(node);
    //   });
    // }
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
    onClick: () => {}
  };

  /**
   * Open dialog button
   */
  openDialogButton = {
    dynamicIcon: 'AddCircleOutline',
    iconProperties: { color: 'primary' },
    onClick: () => {
      this.openTransactionTreeView();
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
   * componentDidMount
   */
  componentDidMount() {
    super.componentDidMount();
    if ((BTransactionComponent.StaticTransactionNodeList || []).length == 0) {
      this.loadTransactionList();
    } else {
      this.setSelectedNodes(this.props.selectedTransactionNodes);
    }
  }

  setSelectedNodes(selectedTransactionNodes: Array<String>) {
    let newList = []; 
    let transactionNodeList: Array<TransactionNode> = Object.assign([], BTransactionComponent.StaticTransactionNodeList);
    this.treeForEach(transactionNodeList, (node: TransactionNode) => {
      if (node.transactionDefinition) {
        if (selectedTransactionNodes.find(s => s == node.transactionDefinition.transactionCode)) {
          node.isSelected = true;
          newList.push(node);
        }
      }
    });
    this.state.selectedTransactionNodes = newList;
    this.setState({ transactionNodeList: transactionNodeList, selectedTransactionNodes: newList });
    this.setDisplayText();
  }

  /**
   * Invoked before a mounted component receives new props
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if (!_.isEqual(nextProps.selectedTransactionNodes, this.props.selectedTransactionNodes)) {
        this.setSelectedNodes(nextProps.selectedTransactionNodes);
      }
    }
  }

  treeForEach(nodes: Array<TransactionNode>, doJop) {
    nodes.forEach(node => {
      doJop && doJop(node);
      if ((node.children || []).length > 0) {
        this.treeForEach(node.children, doJop);
      }
    });
  }

  /**
   * Load channel data
   * @param {*} response
   */
  loadTransactionList(response) {
    if (!response) {
      let request = {
        requestClass: 'BOA.Types.BusinessComponents.TransactionBrowserRequest',
        requestBody: {
          MethodName: 'GetList'
        },
        key: 'GET_TRANSACTION_LIST'
      };
      this.proxyExecute(request);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'ErrorWhenGetServiceInformation'),
        BComponent.DialogType.ERROR,
        BComponent.DialogResponseStyle.OK
      );
      this.debugLog(this.resultErrorListToString(response.results), 3);
      return;
    }

    BTransactionComponent.StaticTransactionList = response.value;
    this.state.allTransactionList = Object.assign([], response.value);
    if (this.props.showOnlyAuthorized) {
      this.state.allTransactionList = this.state.allTransactionList.filter(s => s.isAuthorizedCheckActive == 1);
    }

    this.getParameterList('TRANSACTIONDETAIL');
  }

  loadTransactionDetail(value: Array<ParameterContract>) {
    let detailList: Array<TransactionDetailDefinitionContract> = [];
    if (value) {
      value.forEach(detail => {
        let detailContract: TransactionDetailDefinitionContract = {};
        detailContract.transactionDetailId = Number(detail.paramCode);
        detailContract.transactionGroupId = Number(detail.paramValue);
        detailContract.name = detail.paramDescription;
        detailList.push(detailContract);
      });

      BTransactionComponent.StaticTransactionDetailList = detailList;
      this.state.allTransactionDetailList = Object.assign([], detailList);
      this.getParameterList('TRANSACTIONGROUP'); // Grupları yükle
    }
  }

  getParameterList(paramType, response) {
    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.ParameterRequest',
        requestBody: {
          methodName: 'GetParameters',
          parameterContract: {
            paramType: paramType
          }
        },
        key: paramType,
        params: { paramType: paramType }
      };

      this.proxyExecute(request);
      return false;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'ErrorWhenGetServiceInformation'),
        BComponent.DialogType.ERROR,
        BComponent.DialogResponseStyle.OK
      );
      this.debugLog(this.resultErrorListToString(response.results), 3);
      return false;
    }
    return true;
  }

  loadTransactionGroup(value: Array<ParameterContract>) {
    let groupList: Array<TransactionGroupDefinitionContract> = [];
    if (value) {
      value.forEach(grup => {
        let groupContract: TransactionGroupDefinitionContract = {};
        groupContract.transactionGroupId = Number(grup.paramCode);
        groupContract.name = grup.paramDescription;
        groupList.push(groupContract);
      });

      BTransactionComponent.StaticTransactionGroupList = groupList;
      this.state.allTransactionGroupList = Object.assign([], groupList);
      this.createTransactionNodes();
    }
  }

  /**
   * Proxy did respond
   * @param {*} proxyResponse
   */
  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GET_TRANSACTION_LIST': {
        this.loadTransactionList(response);
        break;
      }
      case 'TRANSACTIONDETAIL': {
        if (this.getParameterList(params.paramType, response)) {
          this.loadTransactionDetail(response.value);
        }
        break;
      }
      case 'TRANSACTIONGROUP': {
        if (this.getParameterList(params.paramType, response)) {
          this.loadTransactionGroup(response.value);
        }
        break;
      }
      default:
        break;
    }
  }

  createTransactionNodes() {
    let nodeList: Array<TransactionNode> = [];
    let selectedNodes = this.props.selectedTransactionNodes || [];
    let allTransactionList = this.state.allTransactionList;
    let groupList = this.state.allTransactionGroupList;
    let detailList = this.state.allTransactionDetailList;
    let id: number = 1;

    groupList.forEach(group => {
      let groupNode = new TransactionNode(null, group.transactionGroupId);
      groupNode.transactionGroupDefinition = group;
      groupNode.transactionDetailDefinition = null;
      groupNode.transactionDefinition = null;
      groupNode.name = group.name;
      groupNode.id = id++;

      let dList = detailList.filter(s => s.transactionGroupId == group.transactionGroupId);
      dList.forEach(detail => {
        let detailNode = new TransactionNode(groupNode, detail.transactionDetailId);
        detailNode.transactionGroupDefinition = group;
        detailNode.transactionDetailDefinition = detail;
        detailNode.transactionDefinition = null;
        detailNode.name = detail.name;
        detailNode.id = id++;

        let tList = allTransactionList.filter(
          d => d.transactionGroup == group.transactionGroupId && d.transactionDetail == detail.transactionDetailId
        );
        tList.forEach(transaction => {
          let transactionNode = new TransactionNode(detailNode, 0);
          transactionNode.transactionGroupDefinition = group;
          transactionNode.transactionDetailDefinition = detail;
          transactionNode.transactionDefinition = transaction;
          transactionNode.name = transaction.transactionName;
          transactionNode.id = id++;
          transactionNode.isSelected = selectedNodes.findIndex(s => s == transaction.transactionCode) > -1 ? true : false;
          if (transactionNode.isSelected) {
            let node: TransactionNode = {
              id: transactionNode.id,
              isSelected: transactionNode.isSelected,
              transactionDefinition: transaction,
              transactionDetailDefinition: detailNode,
              transactionGroupDefinition: groupNode
            };
            this.state.selectedTransactionNodes.push(node);
          }

          detailNode.children.push(transactionNode);
        });

        groupNode.children.push(detailNode);
      });

      nodeList.push(groupNode);
    });

    this.state.transactionNodeList = nodeList;
    BTransactionComponent.StaticTransactionNodeList = Object.assign([], nodeList);

    // if (this.props.showOnlyAuthorized) {
    //   let tempTransactionNodeList: Array<TransactionNode> = _.cloneDeep(this.state.transactionNodeList);
    //   tempTransactionNodeList.forEach(node => {
    //     node.children.forEach(item => {
    //       if (item.children.length == 0) {
    //         var transactionGroupNode = this.state.transactionNodeList.find(
    //           x => x.transactionGroupDefinition.transactionGroupId == item.transactionGroupDefinition.transactionGroupId
    //         ).children;
    //         var transactionDetailNode = transactionGroupNode.find(
    //           x => x.transactionDetailDefinition.transactionDetailId == item.transactionDetailDefinition.transactionDetailId
    //         );
    //         this.state.transactionNodeList
    //           .find(x => x.transactionGroupDefinition.transactionGroupId == item.transactionGroupDefinition.transactionGroupId)
    //           .children.Remove(transactionDetailNode);
    //       }
    //     }, this);
    //     if (
    //       this.state.transactionNodeList.find(
    //         x => x.transactionGroupDefinition.transactionGroupId == node.transactionGroupDefinition.transactionGroupId
    //       ).children.length == 0
    //     ) {
    //       var groupNode = this.state.transactionNodeList.find(
    //         x => x.transactionGroupDefinition.transactionGroupId == node.transactionGroupDefinition.transactionGroupId
    //       );
    //       this.state.transactionNodeList.Remove(groupNode);
    //     }
    //   }, this);
    // }

    this.setDisplayText();
  }

  setDisplayText() {
    var text = '';
    var toolTipText = [];

    if ((this.state.selectedTransactionNodes || []).length > 0) {
      this.state.selectedTransactionNodes.forEach(item => {
        if (item.transactionGroupDefinition) {
          text += item.transactionGroupDefinition.name + (item.transactionDetailDefinition ? ' > ' : '');
        }
        if (item.transactionDetailDefinition) {
          text += item.transactionDetailDefinition.name + (item.transactionDefinition ? ' > ' : '');
        }
        if (item.transactionDefinition) {
          text += item.transactionDefinition.transactionName;
        }
        if (!text) text += ', \n';
        toolTipText.push(<div> {text} </div>);
      });
    }
    this.setState({ displayText: text, toolTipText: toolTipText });
  }

  /**
   * Get the value
   */
  getValue() {
    let nodes = this.state.selectedTransactionNodes || [];
    let nodeList = [];
    _.cloneDeep(nodes).forEach(node => {
      delete node.children;
      delete node.parent;
      delete node.id;
      delete node.state;
      delete node.identity;
      delete node.name;
      delete node.isExpanded;
      delete node.isSelected;
      nodeList.push(node);
    });
    return nodeList;
  }

  /**
   * Reset value and set the default props
   */
  resetValue() {
    this.treeForEach(this.state.transactionNodeList, node => {
      node.isSelected = false;
      node.isExpanded = false;
    });

    this.setState({
      selectedTransactionNodes: [],
      displayText: '',
      toolTipText: []
    });

    if (this.props.onResetValue) {
      this.props.onResetValue();
    }
  }

  /**
   * Get Snapshot
   */
  getSnapshot() {
    return { state: this.state };
  }

  /**
   * Set Snapshot
   * @param {*} snapshot
   */
  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  openTransactionTreeView() {
    const { context, floatingLabelText } = this.props;
    let tempList = this.state.transactionNodeList;

    if (this.props.canSelectOwnTransactionGroupRoot && (this.props.rootTransactionGroupIds || []).length > 0) {
      let willRomeve: Array<TransactionNode> = [];
      tempList.forEach(item => {
        if (
          item.transactionGroupDefinition &&
          !this.props.rootTransactionGroupIds.find(s => s == item.transactionGroupDefinition.transactionGroupId)
        ) {
          willRomeve.push(item);
        }
      });

      willRomeve.forEach(item => {
        tempList = tempList.filter(s => s != item);
      });
    }

    if ((this.state.selectedTransactionNodes || []).length > 0) {
      this.treeForEach(tempList, node => {
        if (this.state.selectedTransactionNodes.findIndex(s => s.id == node.id) > -1) {
          node.isSelected = true;
          node.isExpanded = true;
          if (node.parent) node.parent.isExpanded = true;
          if (node.parent && node.parent.parent) node.parent.parent.isExpanded = true;
        } else {
          node.isSelected = false;
          node.isExpanded = false;
        }
      });
    }

    let dialog = (
      <TransactionTreeView context={this.props.context} canMultipleSelect={this.props.canMultipleSelect} transactionNodeList={tempList} />
    );
    BDialogHelper.showWithResourceCode(context, null, dialog, 0, 0, floatingLabelText, this.handleOnDialogClose.bind(this));
  }

  getActions(state: state) {
    if (this.state.isLoading) return [];
    return state.displayText ? [this.clearButton, this.openDialogButton] : [this.openDialogButton];
  }

  handleOnDialogClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
      this.state.selectedTransactionNodes = data;
      this.setDisplayText();
      this.props.onTransactionSelect && this.props.onTransactionSelect(this.getValue());
    }
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        {this.props.transactionCodeVisibility && (
          <BToolTip context={this.props.context} tooltip={this.state.toolTipText} tooltipPosition="down">
            <div
              tabIndex="0"
              style={{
                outline: 'none',
                position: 'relative'
              }}
            >
              <BInputAction
                context={this.props.context}
                inputDisabled={true}
                floatingLabelText={this.props.labelText || this.getMessage('BusinessComponents', 'Transaction')}
                hintText={this.props.hintText || this.getMessage('BusinessComponents', 'Transaction')}
                rightIconList={this.getActions(this.state)}
                disabled={this.props.disabled}
                value={this.state.displayText}
                errorText={this.props.errorText}
              />
              {this.state.isLoading && this.loadingIcon}
            </div>
          </BToolTip>
        )}
      </div>
    );
  }
}

BTransactionComponent.StaticTransactionNodeList = [];
BTransactionComponent.StaticTransactionList = [];
BTransactionComponent.StaticTransactionGroupList = [];
BTransactionComponent.StaticTransactionDetailList = [];

export default BTransactionComponent;
