import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BDataGrid } from 'b-data-grid';
import { BBaseForm } from 'b-base-form';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';
import { BCard } from 'b-card';
import { BTransactionForm } from 'b-transaction-form';
var BTreeView = require('b-treeview').BTreeView;

export class BProductBrowserDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    ...BBaseForm.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    productType: PropTypes.string,
    fec: PropTypes.short,
    channelId: PropTypes.short,
    customerType: PropTypes.string,
    ignoreBeginAndEndDates: PropTypes.bool,
    accountNumber: PropTypes.int,
    parentProductCodeList: PropTypes.array,
    parentProductCode: PropTypes.string,
    ignoreProductSegmentBeginAndEndDates: PropTypes.bool,
    productTypeList: PropTypes.array,
    selectedProduct: PropTypes.object,
    selectedProductName: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTSELPRO',
    productType: 1,
    fec: 1,
    channelId: -1,
    customerType: null,
    ignoreBeginAndEndDates: false,
    accountNumber: null,
    parentProductCodeList: null,
    parentProductCode: 'FONTOPLAMA',
    ignoreProductSegmentBeginAndEndDates: false,
    productTypeList: null
  };

  state = {
    segmentList: []
  };

  constructor(props, context) {
    super(props, context);
    this.handleSelectedItemChange = this.handleSelectedItemChange.bind(this);
  }

  componentDidMount() {
    this.getProduct();
  }

  actionBarButtonClick(e) {
    if (e.actionId == 5) {
      // OK
      let isLeaf = this.treeView.getInstance().isLeafSelected();
      if (!isLeaf) {
        BDialogHelper.show(
          this.props.context,
          this.getMessage('CoreBanking', 'ChooseProduct'),
          BComponent.DialogType.Error,
          BComponent.DialogResponseStyle.OK
        );
        return;
      }
      if (this.state.selectedProduct == null) {
        if (this.props.selectedProduct == null) {
          BDialogHelper.show(
            this.props.context,
            this.getMessage('CoreBanking', 'ChooseProduct'),
            BComponent.DialogType.Error,
            BComponent.DialogResponseStyle.OK
          );
          return;
        } else {
          this.setState({ selectedProduct: this.props.selectedProduct });
          this.setState({ selectedProduct: this.props.selectedProduct.name });
          BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.selectedProduct);
        }
      } else {
        this.setState({ selectedProduct: this.state.selectedProduct.name });
        BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.selectedProduct);
      }
    } else if (e.actionId == 3) {
      // CloseGroup  
      this.treeView.collapseAll();
      // this.scrollElement.setScrollTop(0);
    } else if (e.actionId == 2) {
      // Open All Nodes On Tree
      this.treeView.expandAll(); 
    }
  }

  getFectList() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.FECRequest',
      requestBody: {
        MethodName: 'GetFecList'
      },
      key: 'GetFecList'
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetFecList':
        if (response.success) {
          var allOption = { fecId: -1, fecName: this.getMessage('BusinessComponents', 'All') };
          response.value.push(allOption);
          this.setState({ FECList: response.value });
        }
        break;
      case 'GetProductTree':
        if (response.success) {
          let parentNode = {};
          parentNode.id = 'allProduct';
          parentNode.name = this.getMessage('BusinessComponents', 'Product');
          parentNode.isExpanded = true;
          parentNode.children = [];
          if (response.value && response.value.length > 0) {
            this.fillTree(parentNode, response.value);
            this.setState({ treeSource: parentNode });
            this.getFectList();
          } else {
            this.showDialogMessage(this.getMessage('CoreBanking', 'ChooseProduct'), BComponent.DialogType.WARNING);
            return false;
          }
        }

        break;
      default:
        break;
    }
  }

  getProduct() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.ProductRequest',
      requestBody: {
        productType: this.props.productType,
        fec: this.props.fec,
        channelId: this.props.channelId,
        customerType: this.props.customerType,
        ignoreBeginAndEndDates: this.props.ignoreBeginAndEndDates,
        accountNumber: this.props.accountNumber,
        parentProductCodeList: this.props.parentProductCodeList,
        parentProductCode: this.props.parentProductCode,
        ignoreProductSegmentBeginAndEndDates: false,
        productTypeList: null,
        MethodName: 'GetProductTree'
      },
      key: 'GetProductTree'
    };
    this.proxyExecute(proxyRequest);
  }

  handleSelectedItemChange(node) {
    this.fillDataGridSource(node);
  }

  fillDataGridSource(selectedItem) {
    if (selectedItem != null) {
      let tempSegmentList = [];
      if (selectedItem.productSegmentInfoList != undefined) {
        for (let i = 0; i < selectedItem.productSegmentInfoList.length; i++) {
          let row = {};
          row.beginDate = selectedItem.productSegmentInfoList[i].beginDate;
          row.channelId = selectedItem.productSegmentInfoList[i].channelId;
          row.customerType = selectedItem.productSegmentInfoList[i].customerType;
          row.definitionCauseType = selectedItem.productSegmentInfoList[i].definitionCauseType;
          row.endDate = selectedItem.productSegmentInfoList[i].endDate;
          row.isDataVisible = selectedItem.productSegmentInfoList[i].isDataVisible;
          row.isSelectable = selectedItem.productSegmentInfoList[i].isSelectable;
          row.fecCode = selectedItem.productSegmentInfoList[i].fec;
          row.fecName = this.state.FECList.filter(a => a.fecId == selectedItem.productSegmentInfoList[i].fec)[0].fecName;
          row.min = selectedItem.productSegmentInfoList[i].minimumBalance;
          row.profitShareRatio = selectedItem.productSegmentInfoList[i].profitShareRatio;
          row.productCode = selectedItem.productSegmentInfoList[i].productCode;
          row.segmentCode = selectedItem.productSegmentInfoList[i].segmentCode;
          row.segmentName = selectedItem.productSegmentInfoList[i].segmentName;
          tempSegmentList.push(row);
        }
        this.setState({ segmentList: Object.assign([], tempSegmentList), selectedProduct: selectedItem });
      }
    } else {
      this.setState({ segmentList: [] });
    }
  }

  fillTree(parentNode, data) {
    for (let i = 0; i < data.length; i++) {
      let child = {};
      if (i == 0) {
        child.isExpanded = true;
      }
      child.id = data[i].product.productCode;
      child.name = data[i].product.productName;
      child.parentProduct = data[i].product.parentProductCode;
      child.beginSuffix = data[i].product.beginSuffix;
      child.endSuffix = data[i].product.endSuffix;
      child.beginDate = data[i].product.beginDate;
      child.endDate = data[i].product.endDate;
      child.isLeafLevel = data[i].product.isLeafLevel;
      child.productType = data[i].product.productType;
      child.productGroup = data[i].product.productGroup;
      child.maturityGroup = data[i].product.maturityGroup;
      child.interimPeriod = data[i].product.interimPeriod;
      child.cardPrinting = data[i].product.cardPrinting;
      child.passbookPrinting = data[i].product.passbookPrinting;
      child.active = data[i].isChecked == '1' ? true : false;
      child.toggled = data[i].isExpanded == '1' ? true : false;
      if (data[i].children.length > 0) {
        child.children = [];
      }
      child.productDeposit = data[i].product.productDeposit;
      child.productSegmentInfoList = data[i].product.productSegmentInfoList;

      parentNode.children.push(child);
      this.fillTree(child, data[i].children);
    }
  }

  onCloseClick(e) {
    this.close(null);
    if (this.props.onClosing) this.props.onClosing(e);
  }

  render() {
    if (this.state.segmentList.length > 0) {
      var columns = [
        {
          key: 'segmentName',
          name: this.getMessage('CoreBanking', 'SegmentName'),
          editable: true,
          sortable: true,
          resizeable: true
        },
        {
          key: 'fecName',
          name: this.getMessage('CoreBanking', 'FEC'),
          editable: true,
          resizeable: true
        },
        {
          key: 'min',
          name: this.getMessage('CoreBanking', 'MinAmount'),
          resizeable: true
        },
        {
          key: 'profitShareRatio',
          name: this.getMessage('CoreBanking', 'ProfitShareRatio'),
          resizeable: true
        }
      ];
    } else {
      columns = [];
    }

    let content = this.state.treeSource ? (
      <BTreeView
        ref={r => (this.treeView = r)}
        context={this.props.context}
        data={this.state.treeSource ? this.state.treeSource : {}}
        showSearch={true}
        isMultiSelect={false}
        onSelectNode={this.handleSelectedItemChange}
        onCheckNode={this.handleSelectedItemChange}
        isLeafCheckable={true}
        isCheckable={false}
        selectedNode={this.state.treeSource.children[0]}
        includeAncestors={true}
        includeDescendants={true} 
      />
    ) : null;

    return (
      <BTransactionForm
        {...this.props}
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.actionBarButtonClick.bind(this)}
        onClosing={this.onCloseClick.bind(this)}
      >
        {content}
        <BCard context={this.props.context} expandable={false} initiallyExpanded={false} style={{ padding: 0 }}>
          <BDataGrid
            context={this.props.context}
            columns={columns}
            dataSource={this.state.segmentList}
            showGrid={this.state.segmentList.length > 0 ? true : false}
            showCheckBox={false}
            multiSelection={false}
            emptyText={this.getMessage('BusinessComponents', 'CustomerNotFountUseCriteria')}
            headerBarOptions={{
              show: true,
              showTitle: true,
              title: this.getMessage('CoreBanking', 'AccountTypeAndLimits'),
              showFiltering: false,
              showGroupping: false,
              showMoreOptions: false
            }}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default BProductBrowserDialog;
