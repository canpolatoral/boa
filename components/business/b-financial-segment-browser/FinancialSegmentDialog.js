import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BConst } from 'b-const';
import { BDialogHelper } from 'b-dialog-box';
import { BTreeView } from 'b-treeview';
import { BLoading } from 'b-loading';
import { BShowHidePanel } from 'b-show-hide-panel';
import { BParameterComponent } from 'b-parameter-component';

@BComponentComposer
export class BFinancialSegmentDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    handleClose: PropTypes.func
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTEXCELD'
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      segmentList: [],
      value: {
        segmentValue: '',
        segmentText: '',
        sequenceValue: '',
        sequenceText: ''
      }
    };

  }

  componentDidMount() {
    super.componentDidMount();
    this.loadData(false);
  }

  loadData(forceUpdate) {
    let segmentList = Object.assign([], BFinancialSegmentDialog.StaticSegmentList);
    if (!forceUpdate && segmentList && segmentList.length > 0) {
      this.setState({ segmentList: segmentList });
    } else {
      let proxyRequest = {
        requestClass: 'BOA.Types.BusinessComponents.FinancialStateSegmentListRequest',
        requestBody: {
          MethodName: 'FinancialSegmentList',
          DataContract: { PrmFSSateCode: '' }
        },
        key: 'FinancialSegmentList'
      };
      this.proxyExecute(proxyRequest);
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'FinancialSegmentList':
        if (response.success) {
          let newList = response.value;
          BFinancialSegmentDialog.StaticSegmentList = newList;
          this.setState({
            segmentList: newList,
          });
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      default:
        break;
    }
  }

  setResourceData(root) {
    if (root.children) {
      if (root.isLeaf == true) {
        root.children = undefined;
      }
      else {
        root.children.forEach((element) => {
          this.setResourceData(element);
        });
      }
    }
  }

  handleClose = () => {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE);
  }

  actionBarButtonClick(e) {
    if (e.commandName == BConst.ActionCommand.Ok) {
      if (this.state.value.segmentValue && this.state.value.segmentValue != '' &&
        this.state.value.sequenceValue && this.state.value.sequenceValue != '') {
        BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.value);
      }
      else {
        BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'PleaseSelectASegment'), BComponent.DialogType.WARNING);
      }
    }
  }

  onSegmentSelected(value) {
    this.setState({
      value: {
        segmentValue: value.paramCode,
        segmentText: value.paramDescription,
        sequenceValue: '',
        sequenceText: ''
      }
    });
  }

  onSequenceToggled(node, isToggled) {
    this.setState(function (prevState) {
      return {
        value: {
          segmentValue: prevState.value.segmentValue,
          segmentText: prevState.value.segmentText,
          sequenceValue: isToggled ? node.value : '',
          sequenceText: isToggled ? node.name : ''
        }
      };
    });
  }

  render() {
    var treeData = this.getTreeData();

    return (
      <BTransactionForm
        {...this.props}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.handleClose}
        cardSectionThresholdColumn={1}
        onActionClick={this.actionBarButtonClick.bind(this)}
        >
        <div style={{  marginLeft: '24px', marginRight: '24px' }} >
          <BCard
            style={{ paddingBottom: '4px', marginTop: '0px', paddingTop: '0px' }}
            context={this.props.context} >
            <BParameterComponent
              context={this.props.context}
              labelText={this.getMessage('BusinessComponents', 'FinancialSegmentLabel')}
              hintText={this.getMessage('BusinessComponents', 'FinancialSegmentLabel')}
              paramType={'MTADI'}
              displayMember={'ParamDescription'}
              selectedParamCode={this.state.segmentValue}
              onParameterSelect={this.onSegmentSelected.bind(this)}
            />
          </BCard>
          <BShowHidePanel ref={(r) => this.progressPanel = r}>
            <BLoading context={this.props.context} />
          </BShowHidePanel>
        </div>
        {
          treeData.length > 0 ?
            <div style={{marginRight:'24px', marginLeft:'24px', paddingBottom:'0px', marginBottom:'24px'}}>
              <BTreeView
                ref={r => this.treeView = r}
                context={this.props.context}
                data={treeData}
                onToggle={this.onSequenceToggled.bind(this)}
              />
            </div> :
            null
        }
      </BTransactionForm>
    );
  }

  getTreeData() {
    if (this.state.value.segmentValue && this.state.value.segmentValue != '') {
      let list = this.state.segmentList.filter(item => { return item.fincialStateCode == this.state.value.segmentValue; });
      list = sortBy(list, 'fincialStateSegCode');

      let treeData = [];
      list.forEach(item => {
        item.name = item.fincialStateSegCode + ' ' + item.fincialStateSegName;
        item.value = item.fincialStateSegCode;

        let segCode = item.fincialStateSegCode;
        if (segCode.indexOf('.') == -1) {
          treeData.push(item);
        }
        else {
          let parentCode = segCode.substring(0, segCode.lastIndexOf('.'));
          let parent = list.find(element => { return element.fincialStateSegCode == parentCode; });
          if (parent) {
            if (!parent.children)
              parent.children = [];
            parent.children.push(item);
          }
        }
      });

      return treeData;
    }
    else {
      return [];
    }
  }
}

BFinancialSegmentDialog.StaticSegmentList = [];
export default BFinancialSegmentDialog;
