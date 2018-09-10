import React from 'react';
import PropTypes from 'prop-types';
import BProductBrowserDialog from './BProductBrowserDialog';

import { BBusinessComponent } from 'b-business-component';

import { BDialogHelper } from 'b-dialog-box';
import { BComponent, BComponentComposer } from 'b-component';
import { BInputAction } from 'b-input-action';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
@BComponentComposer
export class BProductBrowser extends BBusinessComponent {
  static deleteSvgIcon = 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z';

  static propTypes = {
    ...BBusinessComponent.propTypes,
    style: PropTypes.object,
    label: PropTypes.string,
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
    selectedProductCode: PropTypes.string,
    selectedItemChange: PropTypes.func,
    disabled: PropTypes.bool,
    errorText: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    style: null,
    label: null,
    productType: null,
    fec: null,
    channelId: null,
    customerType: null,
    ignoreBeginAndEndDates: false,
    accountNumber: null,
    parentProductCodeList: null,
    parentProductCode: null,
    ignoreProductSegmentBeginAndEndDates: false,
    productTypeList: null,
    selectedProductCode: null,
    selectedItemChange: null,
    disabled: false
  };

  _addButton = { dynamicIcon: 'AddCircleOutline', iconProperties: { nativeColor: this.props.context.theme.boaPalette.pri500 }, onClick: this.addProductClicked.bind(this) };
  _searchButton = { bIcon: 'ArrowCircle', iconProperties: { folder: 'Others', nativeColor: this.props.context.theme.boaPalette.pri500 }, onClick: this.findProductClicked.bind(this) };
  _clearActionButton = { dynamicIcon: 'Clear', iconProperties: { color: this.props.context.theme.boaPalette.base400 }, onClick: this.clearProductClicked.bind(this) };

  constructor(props, context) {
    super(props, context);
    this.initialState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedProductCode != nextProps.selectedProductCode) {
      this.findProductByProductCode(nextProps.selectedProductCode);
    }
  }

  initialState() {
    this.state = {
      selectedProduct: null,
      inputText: null,
      productList: []
    };
  }

  resetState() {
    this.setState({
      selectedProduct: null,
      inputText: null,
      productList: [],
      errorText: null
    }, () => { !this.props.selectedItemChange || this.props.selectedItemChange(null, null); }); // () => { this.binputaction.resetValue() }
    if (this.binputaction && this.binputaction.binput) {
      this.binputaction.binput.getInstance().resetValue();
    }
  }

  getValue() {
    return {
      selectedProduct: this.state.selectedProduct
    };
  }

  resetValue() {
    this.resetState();
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  findProductClicked() {
    this.findProductByProductName(this.state.inputText);
  }

  clearProductClicked() {
    this.resetState();
    this.onTextChanged(null, '');
  }

  addProductClicked() {
    let dialog = (
      <BProductBrowserDialog context={this.props.context}
        fec={this.props.fec}
        channelId={this.props.channelId}
        onClosing={this.handleClose.bind(this)}
        accountNumber={this.props.accountNumber}
        customerType={this.props.customerType}
        ignoreBeginAndEndDates={this.props.ignoreBeginAndEndDates}
        ignoreProductSegmentBeginAndEndDates={this.props.ignoreProductSegmentBeginAndEndDates}
        parentProductCode={this.props.parentProductCode}
        parentProductCodeList={this.props.parentProductCodeList}
        productType={this.props.productType}
        productTypeList={this.props.productTypeList}
        selectedProduct={this.state.selectedProduct}
        selectedItemChange={this.props.selectedItemChange} />);
    let dialogStyle, isMobile = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobile) {
      dialogStyle = { width: '90%', height: '90%' };
    }
    else {
      dialogStyle = { width: '525px', height: '85%' };
    }
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, this.getMessage('BusinessComponents', 'ProductTree'), this.handleClose.bind(this), dialogStyle);
  }

  handleClose(dialogResponse, data) {
    if (data == null) {
      return;
    } else {
      if (dialogResponse == BComponent.DialogResponse.OK) {
        this.setState({ selectedProduct: data, inputText: data.name }, () => {
          if (this.props.selectedItemChange) {
            this.props.selectedItemChange(data, null);
          }
        });
      }
    }
  }

  onTextChanged(e, value) {
    this.setState({ inputText: value });
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.findProductByProductName(this.state.inputText);
    }
    return true;
  }

  render() {
    return (
      <BGridSection context={this.props.context} style={this.props.style}>
        <BGridRow context={this.props.context}>
          <BInputAction
            ref={r => this.binputaction = r}
            context={this.props.context}
            hintText={this.getMessage('CoreBanking', 'ChooseProduct')}
            value={this.state.inputText}
            type='text'
            errorText={this.props.errorText}
            floatingLabelText={this.props.label ? this.props.label : this.getMessage('BusinessComponents', 'Product')}
            onKeyDown={this.onKeyDown.bind(this)}
            onChange={this.onTextChanged.bind(this)}
            bottomRightInfoEnable={false}
            leftIconList={[]}
            rightIconList={this.getActionList(this.state.inputText)}
            disabled={this.props.disabled}
            errorText={this.props.errorText} />
        </BGridRow>
      </BGridSection>
    );
  }

  getActionList(stateValue) {
    if (this.props.disabled)
      return [];
    else
      return stateValue ? [this._clearActionButton, this._searchButton, this._addButton] : [this._addButton];
  }

  findProductByProductName(productName) {
    this.productName = productName;
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
        ignoreProductSegmentBeginAndEndDates: this.props.ignoreProductSegmentBeginAndEndDates,
        productTypeList: this.props.productTypeList,
        MethodName: 'GetProductTree'
      },
      key: 'FindProductByProductName'
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'FindProductByProductName':
        if (response.success) {
          var linearProductList = this.getProductLeaf(response.value);
          this.setState({ productList: linearProductList });
          if (this.productName) {
            var defaultProduct = {};
            for (var index = 0; index < linearProductList.length; index++) {
              var element = linearProductList[index];
              if (element.productName.toLowerCase().indexOf(this.productName.toLowerCase()) > -1) {
                defaultProduct = element;
                break;
              }
            }
            this.setState({
              selectedProduct: defaultProduct,
              inputText: defaultProduct ? defaultProduct.productName : null,
              productList: linearProductList
            });
            this.props.selectedItemChange(defaultProduct, null);
          }
          else {
            this.showDialogMessage(this.getMessage('CoreBanking', 'ChooseProduct'), BComponent.DialogType.WARNING);
          }
        }
        else {
          this.showDialogMessage(this.getMessage('CoreBanking', 'ChooseProduct'), BComponent.DialogType.WARNING);
          return null;
        }
        break;
      case 'FindProductByProductCode':
        if (response.success) {
          linearProductList = this.getProductLeaf(response.value);
          this.setState({ productList: linearProductList });
          if (this.productCode) {
            for (index = 0; index < linearProductList.length; index++) {
              element = linearProductList[index];
              if (element.productCode.toLowerCase() == this.productCode.toLowerCase()) {
                defaultProduct = {};
                defaultProduct = element;
                break;
              }
            }
            this.setState({
              selectedProduct: defaultProduct,
              inputText: defaultProduct ? defaultProduct.productName : null,
              productList: linearProductList
            });
            this.props.selectedItemChange(defaultProduct, null);
          }
          else {
            this.showDialogMessage(this.getMessage('CoreBanking', 'ChooseProduct'), BComponent.DialogType.WARNING);
          }

        }
        else {
          this.showDialogMessage(this.getMessage('CoreBanking', 'ChooseProduct'), BComponent.DialogType.WARNING);
          return null;
        }
        break;

      default:
        break;
    }
  }

  findProductByProductCode(productCode) {
    if (this.state.productList && this.state.productList.length > 0) { return null; }
    this.productCode = productCode;
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
        ignoreProductSegmentBeginAndEndDates: this.props.ignoreProductSegmentBeginAndEndDates,
        productTypeList: this.props.productTypeList,
        MethodName: 'GetProductTree'
      },
      key: 'FindProductByProductCode'
    };
    this.proxyExecute(proxyRequest);

  }

  getProductLeaf(list) {
    var returnObject = [];
    for (var index = 0; index < list.length; index++) {
      var element = list[index];
      if (element.product.isLeafLevel != 1 && element.children != null && element.children.length > 0) {
        var innerList = this.getProductLeaf(element.children);
        for (var innerIndex = 0; innerIndex < innerList.length; innerIndex++) {
          var innerElement = innerList[innerIndex];
          returnObject.push(innerElement);
        }
      } else {
        returnObject.push(element.product);
      }
    }
    return returnObject;
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.selectedProductCode)
      this.findProductByProductCode(this.props.selectedProductCode);
  }
}

export default BProductBrowser;
