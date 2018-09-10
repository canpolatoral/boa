import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BConst } from 'b-const';
import { BDialogHelper } from 'b-dialog-box';
import { BTreeView } from 'b-treeview';

import {
  TransactionNode,
  TransactionGroupDefinitionContract,
  TransactionDetailDefinitionContract,
  TransactionDefinitionContract
} from './model';

interface state {
  transactionNodeList: Array<TransactionNode>;
  selectedTransactionNodes: Array<TransactionNode>;
  selectedTransactionGroup: TransactionGroupDefinitionContract;
  selectedTransactionDetail: TransactionDetailDefinitionContract;
  selectedTransaction: TransactionDefinitionContract;
}

export class TransactionTreeView extends BBusinessComponent {
  static propTypes = {
    onClosing: PropTypes.func,
    transactionNodeList: PropTypes.any
  };

  static defaultProps = {
    resourceCode: 'IBLTHZMBRW'
  };

  static h;
  state: state;

  constructor(props, context) {
    super(props, context);

    this.state.transactionNodeList = this.props.transactionNodeList;
  }

  componentDidMount() {
    super.componentDidMount();
    this.form.disableAction('Ok');
    this.form.disableAction('ExpandGroup');
    this.form.disableAction('CollapseGroup');
  }

  getValue() {
    let treeControl = this.treeView.getInstance();
    if (this.props.canMultipleSelect) {
      let checkedNodes = treeControl.getCheckedNodes();
      return checkedNodes || [];
    }
    return [treeControl.getValue()];
  }

  expander = (nodes, isExpand) => {
    nodes.forEach(node => {
      node.isExpanded = isExpand;
      if (node.children && node.children.length > 0) {
        this.expander(node.children, isExpand);
      }
    });
  };

  getTreeHeight(obj) {
    if (obj && obj.parentDiv) {
      let m = this.props.canMultipleSelect ? 240 : 180;
      TransactionTreeView.h = obj.parentDiv.clientHeight - m;
      return obj.parentDiv.clientHeight - m;
    }
  }

  onClosing = () => {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE);
  };

  handleOnSelectNode = node => {
    this.state.selectedTransactionNodes = this.getValue();
    if (this.props.canMultipleSelect == false) {
      this.form.enableAction('Ok');
    }

    if (node && (node.children || []).length > 0) {
      this.form.enableAction('ExpandGroup');
      this.form.enableAction('CollapseGroup');
    } else {
      this.form.disableAction('ExpandGroup');
      this.form.disableAction('CollapseGroup');
    }
  };

  handleOnCheckNode = () => {
    let values = this.getValue();
    values.length > 0 ? this.form.enableAction('Ok') : this.form.disableAction('Ok');
  };

  onActionClick(e) {
    let { context } = this.props;

    switch (e.commandName) {
      case BConst.ActionCommand.Ok: {
        let value = this.getValue();

        if (this.props.canMultipleSelect && value.length == 0) {
          let closeMsg = this.getMessage('BusinessComponents', 'ChooseAScreenPlease');
          BDialogHelper.show(context, closeMsg, BComponent.DialogType.WARNING);
          return;
        }
 
        BDialogHelper.close(this, BComponent.DialogResponse.OK, value);
        break;
      }
      case 'ExpandGroup': {
        this.expander([this.state.selectedTransactionNodes || []], true);
        let treeControl = this.treeView.getInstance();
        treeControl.openNode(this.state.selectedTransactionNodes);
        break;
      }
      case 'CollapseGroup': {
        this.expander([this.state.selectedTransactionNodes || []], false);
        let treeControl = this.treeView.getInstance();
        treeControl.closeNode(this.state.selectedTransactionNodes);
        break;
      }
      case 'CollapseAll': {
        let treeControl = this.treeView.getInstance();
        treeControl.collapseAll();
        break;
      }
      default:
        break;
    }
  }

  render() {
    let cardStyle = {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px'
    };

    return (
      <BTransactionForm
        ref={r => (this.form = r)}
        disableCardWidth={true}
        {...this.props}
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.onClosing}
        cardSectionThresholdColumn={1}
        onActionClick={e => {
          this.onActionClick(e);
        }}
      >
        <BCard context={this.props.context} style={cardStyle}>
          <BTreeView
            ref={r => (this.treeView = r)}
            context={this.props.context}
            data={this.state.transactionNodeList}
            height={this.form ? this.getTreeHeight(this.form) : TransactionTreeView.h}
            style={{ marginBottom: '-8px' }}
            isCheckable={this.props.canMultipleSelect ? true : false}
            isMultiSelect={this.props.canMultipleSelect}
            isLeafCheckable={this.props.isLeafCheckable}
            onSelectNode={this.handleOnSelectNode}
            onCheckNode={this.handleOnCheckNode}
            rowHeight={this.state.showDetails ? 40 : 36}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default TransactionTreeView;
