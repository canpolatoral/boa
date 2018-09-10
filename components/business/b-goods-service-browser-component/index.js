import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BComponent, BComponentComposer } from 'b-component';
import { BTreeView } from 'b-treeview';
import FlashOn from '@material-ui/icons/FlashOn';

@BComponentComposer
export class BGoodsServiceBrowser extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    goodsServiceType: PropTypes.string,
    channelId: PropTypes.short,
    customerType: PropTypes.string,
    ignoreBeginAndEndDates: PropTypes.bool,
    accountNumber: PropTypes.int,
    parentGoodsServiceCodeList: PropTypes.array,
    parentGoodsServiceCode: PropTypes.string,
    ignoreGoodsServiceSegmentBeginAndEndDates: PropTypes.bool,
    goodsServiceCodeList: PropTypes.array,
    selectedGoodsService: PropTypes.object,
    selectedGoodsServiceName: PropTypes.string,
    goodsService: PropTypes.any,
    height: PropTypes.number,
    selectedItemChange: PropTypes.func,
    checkedNodeChange: PropTypes.func,
    isMultiSelect: PropTypes.bool,
    showWarningRiskIcon: PropTypes.bool
  };

  static defaultProps = {
    ...BBusinessComponent.propTypes,
    goodsServiceType: 1,
    channelId: -1,
    customerType: null,
    ignoreBeginAndEndDates: false,
    accountNumber: null,
    goodsServiceCodeList: ['İÇECEKLER', 'HİZMET', 'KİRA', 'ARSA'],
    parentGoodsServiceCode: -1,
    ignoreGoodsServiceSegmentBeginAndEndDates: false,
    parentGoodsServiceCodeList: null,
    goodsService: null,
    height: 400,
    isMultiSelect: true,
    showWarningRiskIcon:true
  };

  constructor(props) {
    super(props);
    this.handleSelectedItemChange = this.handleSelectedItemChange.bind(this);
    this.checkedNodeChange = this.checkedNodeChange.bind(this);
    this.initialState();
  }
  initialState() {
    this.state = {
      selectedGoodsService: null,
      parentGoodsServiceCode: '',
      selectedGoodsServiceName: '',
      selectedGoodsServiceList : [],
      willOpenNode: [],
      selo:5,
      goodsServiceList: []
    };
  }
  componentDidMount() {
    this.getGoodsService();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedGoodsService != nextProps.selectedGoodsService) {
      this.findGoodsServiceByGoodsServiceCode(nextProps.selectedGoodsService);
    }
  }

  resetState() {
    this.setState({
      selectedGoodsService: null,
      goodsServiceList: [],
      parentGoodsServiceCode: '',
      selectedGoodsServiceList : [],
      selectedGoodsServiceName: '',
      errorText: null
    }, () => { !this.props.selectedItemChange || this.props.selectedItemChange(null, null); }); // () => { this.binputaction.resetValue() }
  }

  refreshTree(node:any) {
    this.BTreeViewRef.resetState();
    this.BTreeViewRef.selectedItem(node);
  }
  getValue() {
    return {
      selectedGoodsService: this.state.selectedGoodsService,
      goodsServiceList: this.state.goodsServiceList,
      selectedGoodsServiceList :  this.state.selectedGoodsServiceList,
      parentGoodsServiceCode: this.state.parentGoodsServiceCode,
      selectedGoodsServiceName: this.state.selectedGoodsServiceName,
    };
  }
  resetValue() {
    this.resetState();
  }
  getSelectedItemsOrItem() {
    return ( this.props.isMultiSelect ==true ?   this.getSelectedItems() :  this.state.selectedGoodsService);
  }
  getSelectedItems() {
    return  this.BTreeViewRef.getCheckedNodes();
  }

  removeSelectedNode() {
    let parent:any =this.BTreeViewRef.getSelectedNode().parent;
    if (this.props.isMultiSelect ==true)
    {   this.removeNodes(); }
    else {
      this.BTreeViewRef.removeNode(this.state.selectedGoodsService);
      let findindex:any =  this.state.goodsServiceList.findIndex(x=> x.goodsServiceCode ==  this.state.selectedGoodsService.goodsServiceCode);
      if (findindex!=-1)
      {
        this.state.goodsServiceList.splice(findindex, 1);
      }
    }
    this.BTreeViewRef.openNode(parent);
  }
  removeNodes() {
    let deleteItems :any =  this.getSelectedItems();
    if (deleteItems!=undefined  &&  deleteItems.length >  0 )
      {
      for (var index = 0; index < deleteItems.length; index++) {
        let findindex:any =  this.state.goodsServiceList.findIndex(x=> x.goodsServiceCode == deleteItems[index].goodsServiceCode);
        if (findindex!=-1)
        {
          this.state.goodsServiceList.splice(findindex, 1);
        }
        this.BTreeViewRef.removeNode(deleteItems[index]);

      }
    }
  }
  addtoSelectedNode(addNode:any) {
    this.BTreeViewRef.appendChildNode(addNode, this.state.selectedGoodsService);
    this.state.goodsServiceList.push(addNode);
  }
  updateSelcetedNode(newNode:any) {
    this.BTreeViewRef.updateNode(this.state.selectedGoodsService, newNode);

    let findindex:any =  this.state.goodsServiceList.findIndex(x=> x.goodsServiceCode == this.state.selectedGoodsService.goodsServiceCode);
    if (findindex!=-1) {
      this.state.goodsServiceList[findindex].goodsServiceName =  newNode.goodsServiceName;
      this.state.goodsServiceList[findindex].isRiskProduct = newNode.isRiskProduct;
      this.state.goodsServiceList[findindex].name =newNode.goodsServiceName;
      this.state.goodsServiceList[findindex].goodsService =newNode;
    }

  }
  setSelectNode(selectingNode:any)   {
    return  this.BTreeViewRef.selectNode(selectingNode);
  }

  setOpenNode(selectingNode:any)   {
    return  this.BTreeViewRef.openNode(selectingNode);
  }


  getGoodsService() {
    if (this.state.goodsServiceList && this.state.goodsServiceList.length > 0) { return null; }
    let proxyRequest = {
      requestClass: 'BOA.Types.Loans.FundUtilization.GoodsServiceRequest',
      requestBody: {
        channelId: this.props.channelId,
        customerType: this.props.customerType,
        ignoreBeginAndEndDates: this.props.ignoreBeginAndEndDates,
        accountNumber: this.props.accountNumber,
        parentGoodsServiceCodeList: this.props.parentGoodsServiceCodeList,
        parentGoodsServiceCode: -1,
        ignoreGoodsServiceSegmentBeginAndEndDates: false,
        goodsServiceTypeList: null,
        MethodName: 'GetGoodsServiceTree'
      },
      key: 'GetGoodsServiceTree'
    };
    this.proxyTransactionExecute(proxyRequest);
  }

  handleSelectedItemChange(node, checked) {
    if (node && node != null)
      this.fillDataGridSource(node);
    if (this.props.selectedItemChange)
      this.props.selectedItemChange(node, checked);
     // this.getSelectedItems();
  }

  checkedNodeChange(node, checked)  {
    if (this.props.checkedNodeChange)
      this.props.checkedNodeChange(node, checked);
      this.state.selectedGoodsServiceList  = this.BTreeViewRef.getCheckedNodes();
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetGoodsServiceTree':
        if (response.success) {
          let parentNode = {};
          parentNode.goodsServiceId = -1;
          parentNode.id = -1;
          parentNode.goodsServiceType = 1;
          parentNode.goodsServiceCode = '-1';
          parentNode.name = 'Mal-Hizmet Ürün Ağacı';
          parentNode.children = [];
          parentNode.parentGoodsService = null;
          parentNode.beginSuffix = null;
          parentNode.endSuffix = null;
          parentNode.beginDate = null;
          parentNode.endDate = null;
          parentNode.isLeafLevel = 0;
          parentNode.goodsServiceType = 0;
          parentNode.goodsServiceGroup = null;
          parentNode.maturityGroup = null;
          parentNode.interimPeriod = null;
          parentNode.cardPrinting = null;
          parentNode.passbookPrinting = null;
          parentNode.goodsService = null,
          parentNode.active = true;
          parentNode.toggled = true;
          parentNode.isRiskProduct = 0;
          parentNode.isExpanded = true;
          parentNode.showIcons = this.props.showWarningRiskIcon;
          parentNode.isSelected =   false;
          if (response.value && response.value.length > 0) {
            this.fillTree(parentNode, response.value[0].children);
            this.setState({ treeSource: [parentNode] });
            var linearGoodsServiceList = this.getGoodsServiceLeaf(parentNode.children);
            this.setState({ goodsServiceList: linearGoodsServiceList });

          } else {
            this.showDialogMessage(this.getMessage('CoreBanking', 'ChooseGoodsService'), BComponent.DialogType.WARNING);
            return false;
          }
        }
        break;

      case 'FindGoodsServiceByGoodsServiceCode':
        if (response.success) {
          let defaultGoodsService: any = {};
          linearGoodsServiceList = this.getGoodsServiceLeaf(response.value);
          this.setState({ goodsServiceList: linearGoodsServiceList });
          if (this.goodsServiceCode) {
            for (let index: any = 0; index < linearGoodsServiceList.length; index++) {
              let element: any = linearGoodsServiceList[index];
              if (element.goodsServiceCode.toLowerCase() == this.goodsServiceCode.toLowerCase()) {
                defaultGoodsService = element;
                break;
              }
            }
            this.setState({
              selectedGoodsService: defaultGoodsService,
              goodsServiceList: linearGoodsServiceList
            });
            if (this.props.selectedItemChange)
              this.props.selectedItemChange(defaultGoodsService, null);
          }
          else {
            this.showDialogMessage(this.getMessage('CoreBanking', 'ChoosegoodsService'), BComponent.DialogType.WARNING);
          }

        }
        else {
          this.showDialogMessage(this.getMessage('CoreBanking', 'ChoosegoodsService'), BComponent.DialogType.WARNING);
          return null;
        }
        break;

      default:
        break;
    }
  }

  findGoodsServiceByGoodsServiceCode(goodsService) {
    if (goodsService!=undefined && goodsService!=null)
    {
      goodsService.toggled = true;
      goodsService.active =  true;
      goodsService.isSelected = true;
      goodsService.isExpanded = true;
      this.state.selectedGoodsService = goodsService;
    }
  }
  getGoodsServiceLeaf(list) {
    var returnObject = [];
    for (var index = 0; index < list.length; index++) {
      var element = list[index];
      if (element.goodsService && element.children != null && element.children.length > 0) {
        var innerList = this.getGoodsServiceLeaf(element.children);
        for (var innerIndex = 0; innerIndex < innerList.length; innerIndex++) {
          var innerElement = innerList[innerIndex];
          returnObject.push(innerElement);
        }
      } else {
        returnObject.push(element);
      }
    }
    return returnObject;
  }


  fillDataGridSource(selectedItem) {
    let tempSegmentList = [];
    if (
      selectedItem.goodsServiceSegmentInfoList &&
      selectedItem.goodsServiceSegmentInfoList != undefined &&
      selectedItem.goodsServiceSegmentInfoList != null
    ) {
      for (let i = 0; i < selectedItem.goodsServiceSegmentInfoList.length; i++) {
        let row = {};
        row.beginDate = selectedItem.goodsServiceSegmentInfoList[i].beginDate;
        row.channelId = selectedItem.goodsServiceSegmentInfoList[i].channelId;
        row.customerType = selectedItem.goodsServiceSegmentInfoList[i].customerType;
        row.definitionCauseType = selectedItem.goodsServiceSegmentInfoList[i].definitionCausefvType;
        row.endDate = selectedItem.goodsServiceSegmentInfoList[i].endDate;
        row.isDataVisible = selectedItem.goodsServiceSegmentInfoList[i].isDataVisible;
        row.isSelectable = selectedItem.goodsServiceSegmentInfoList[i].isSelectable;
        row.min = selectedItem.goodsServiceSegmentInfoList[i].minimumBalance;
        row.profitShareRatio = selectedItem.goodsServiceSegmentInfoList[i].profitShareRatio;
        row.goodsServiceCode = selectedItem.goodsServiceSegmentInfoList[i].goodsServiceCode;
        row.segmentCode = selectedItem.goodsServiceSegmentInfoList[i].segmentCode;
        row.segmentName = selectedItem.goodsServiceSegmentInfoList[i].segmentName;
        row.isRiskProduct = selectedItem.goodsServiceSegmentInfoList[i].isRiskProduct;
        row.isSelected = selectedItem.goodsServiceSegmentInfoList[i].isSelected;
        tempSegmentList.push(row);
      }
    }
    this.setState({
      segmentList: Object.assign([], tempSegmentList),
      selectedGoodsService: selectedItem
    });

  }

  setExpandAllNodes(node, isToggled) {
    if (node.children != undefined && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        this.setExpandAllNodes(node.children[i], isToggled);
      }
    }
    node.toggled = isToggled;
  }

  fillTree(parentNode, data) {
    for (let i = 0; i < data.length; i++) {
      let child = {};
      child.id = data[i].goodsService.goodsServiceId;
      child.goodsServiceId = data[i].goodsService.goodsServiceId;
      child.goodsServiceCode = data[i].goodsService.goodsServiceCode;
      child.name = data[i].goodsService.goodsServiceName;
      child.parentGoodsService = data[i].goodsService.parentGoodsServiceCode;
      child.beginSuffix = data[i].goodsService.beginSuffix;
      child.endSuffix = data[i].goodsService.endSuffix;
      child.beginDate = data[i].goodsService.beginDate;
      child.endDate = data[i].goodsService.endDate;
      child.isLeafLevel = data[i].goodsService.isLeafLevel;
      child.goodsServiceType = data[i].goodsService.goodsServiceType;
      child.goodsServiceGroup = data[i].goodsService.goodsServiceGroup;
      child.maturityGroup = data[i].goodsService.maturityGroup;
      child.interimPeriod = data[i].goodsService.interimPeriod;
      child.cardPrinting = data[i].goodsService.cardPrinting;
      child.passbookPrinting = data[i].goodsService.passbookPrinting;
      child.goodsService = data[i].goodsService;
      child.isRiskProduct =  child.goodsService.isRiskProduct;

      if (data[i].children.length > 0) {
        child.children = [];
      }
      child.showIcons=   ( child.isRiskProduct ==1 && this.props.showWarningRiskIcon==true) ? true: false;
      child.icon  = ( child.isRiskProduct ==1 && this.props.showWarningRiskIcon==true) ? <FlashOn style={{ color: 'coral'  }} />:<div></div>;
      child.goodsServiceDeposit = data[i].goodsService.goodsServiceDeposit;
      child.goodsServiceSegmentInfoList = data[i].goodsService.goodsServiceSegmentInfoList;
      for (let j =0; j< this.props.goodsServiceCodeList.length;  j++) {
        if (this.props.goodsServiceCodeList[j]  == child.goodsServiceCode  )
       {
          child.isExpanded = true;
          child.isSelected = true;
          child.toggled =true;
          parentNode.isExpanded =true;
        }
      }

      parentNode.children.push(child);
      this.fillTree(child, data[i].children);
    }
  }

  onCloseClick(e) {
    this.close(null);
    if (this.props.onClosing) this.props.onClosing(e);
  }

  render() {
    return (
      <div>
        {this.state.treeSource &&
            this.state.treeSource.length > 0 && (
              <BTreeView
                 ref={r => this.BTreeViewRef = r}
                context={this.props.context}
                data={this.state.treeSource}
                showSearch={true}
                isMultiSelect={this.props.isMultiSelect}
                onSelectNode={this.handleSelectedItemChange}
                onCheckNode={this.checkedNodeChange}
                height={this.props.height ? this.props.height : 240}
                isCheckable={this.props.isMultiSelect}
                isSelectable={this.props.isMultiSelect}
                scrollavle
                includeAncestors={true}
                showIcons={this.props.showWarningRiskIcon}
                includeDescendants={true}
                selectedNode={this.state.selectedGoodsService}
              />
            )}
      </div>
    );
  }
}

export default BGoodsServiceBrowser;
