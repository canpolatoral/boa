import { findDOMNode } from 'react-dom';
import CommonConstant from './constants';
export class CommissionSetter {

  constructor(cmpRef) {
    this.cmpRef= cmpRef;
  }
  
  setIsSafeOptionChecked(value) {
    this.cmpRef._isSafeOptionChecked = value;
    if (value == true) {
      this.setIsAccountOptionChecked(false);
      this.setVisibilityFECList(true);
      if (this.cmpRef.props.isBanknoteInfoRequiredForSafeOption == true)
        this.setVisibilitycontrolBanknoteInfo(true);
    } 
  }  

  setIsAccountOptionChecked(value) {
    this.cmpRef._isAccountOptionChecked = value;
    if (value == true) {
      this.setIsSafeOptionChecked(false);
      this.setVisibilityFECList(false);
      this.setVisibilitycontrolBanknoteInfo(false);
      if (this.cmpRef._selectedAccount == null)
        this.setRequestedCommissionFECDefaultValue();
    }
    this.setVisibilityAccountComponent();    
  }

  setVisibilityAccountComponent() {
    if (this.cmpRef.props.isAccountComponentAlwaysCollapsed == true || this.cmpRef._isSafeOptionChecked == true) 
    {
      findDOMNode(this.cmpRef.controlAccountComponent).style.display = this.returnVisibilityProp(false);
      if (this.cmpRef.props.manageAccountComponentMessages)
        this.cmpRef.controlAccountComponent.state.showDialogMessages = false;
    }
    else if (this.cmpRef._isAccountOptionChecked == true)
    {
      findDOMNode(this.cmpRef.controlAccountComponent).style.display = this.returnVisibilityProp(true);
    }
  }

  setRequestedCommissionFECDefaultValue() {
    if (this.cmpRef.props.context.applicationContext == null)
      this.cmpRef.state._requestedCommissionFEC = 0;
    else
    this.cmpRef.state._requestedCommissionFEC = this.cmpRef.props.context.applicationContext.user.branch.isInFreeZone == 1 ?  1 : 0;
  }
  
  setFECListDefaultValue() {
    if (this.cmpRef.props.context.applicationContext != null && this.cmpRef.props.context.applicationContext.user.branch.isInFreeZone != 1) {
      this.cmpRef.state._fECGroupList.push(0);
    }
    this.cmpRef.state._fECGroupList.push(1);
    this.cmpRef.state._fECGroupList.push(2);
  }

  returnVisibilityProp(value) {
    let result= 'none';
    if (value == true) {
      result= 'block';
    }
    return result;
  }
  
  setVisibilityFECList(value) {
    findDOMNode(this.cmpRef.controlFEC).style.display= this.returnVisibilityProp(value);
  }

  setVisibilitycontrolBanknoteInfo(value) {
    findDOMNode(this.cmpRef.controlBanknoteInfo).style.display= this.returnVisibilityProp(value);
  }

  setVisibilityPaymentInformationOptions(value) {
    findDOMNode(this.cmpRef.paymentInfoOptions).style.display= this.returnVisibilityProp(value);
  }

  setVisibility() {
    findDOMNode(this.cmpRef.paymentInfo).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityPaymentInformation);
    findDOMNode(this.cmpRef.paymentInfoOptionsDiv).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityPaymentInformationOptions);
    findDOMNode(this.cmpRef.commissionRate).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityCommissionRate);
    findDOMNode(this.cmpRef.specialCommissionRate).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilitySpecialCommissionRate);
    findDOMNode(this.cmpRef.commissionAmount).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityCommissionAmount);
    findDOMNode(this.cmpRef.bsmvChkbx).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityBSMV);
    findDOMNode(this.cmpRef.bsmv).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityBSMV);
    findDOMNode(this.cmpRef.autoCalculatedAmount).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityAutoCalculatedAmount);
    findDOMNode(this.cmpRef.controlFECAmount).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityFECAmount);
    findDOMNode(this.cmpRef.controlBanknoteInfo).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityControlBanknoteInfo);
    findDOMNode(this.cmpRef.controlFEC).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityFECList);
    findDOMNode(this.cmpRef.controlInformation).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityInformation);
    findDOMNode(this.cmpRef.controlDescription).style.display = this.returnVisibilityProp(this.cmpRef.props.visibilityDescription);
  }

  setCommissionPaymentInfo() {
    if (this.cmpRef._commissionInfo != null && this.cmpRef._commissionInfo.commissionType != null) {
      if (this._commissionInfo.commissionType == CommonConstant.CommissionType.FromBox)
        this.setIsSafeOptionChecked(true);
      else
        this.setIsAccountOptionChecked(true);
    }
  }

// 
  // setAutoCalculatedAmount(value) {    
  //   this.cmpRef.autoCalculatedAmount.setTotalValue(value);
  //   this.cmpRef._autoCalculatedAmount= value;
  // }
// 
  // setBSMV(value) {
  //   this.cmpRef.bsmv.setTotalValue(value);
  //   this.cmpRef._bSMVAmount= value;
  // }  
// 
  // setBSMVIncluded(value) {
  //   this.cmpRef._bsmvIncluded= value;
  //   this.cmpRef.bsmvIncluded.setValue(value);
  // }  
// 
  // setComboInstalmentTypeValue(value) {
  //   this.cmpRef._comboInstalmentTypeValue= value;
  //   this.cmpRef.radioSearchTypes.setValue(value);
  // }    
// 
  // setCommissionAmount(value) {
  //   this.cmpRef.commissionAmount.setTotalValue(value);
  //   this.cmpRef._commissionAmount= value;
  // }
// 
  // setCommissionCount(value) {
  //   this.cmpRef._commissionCount= value;
  //   this.cmpRef.commissionCount.setValue(value);
  // }   
// 
  // setCommissionRate(value) {
  //   this.cmpRef._commissionRate= value;
  //   this.cmpRef.commissionRate.setValue(value);
  // }  
  // 
  // setDescription(value) {
  //   this.cmpRef._description = value; 
  //   this.cmpRef.description.setValue(value);
  // }  
// 
  // setFECAmount(value) {
  //   this.cmpRef.fECAmount.setTotalValue(value);
  //   this.cmpRef.controlBanknoteInfo.setTotalValue(value);
  //   this.cmpRef._fecAmount= value;
  // }
// 
  // setInformation(value) {
  //   this.cmpRef._information = value; 
  //   this.cmpRef.controlInformation.setValue(value);
  // }  
  // 
  // setMaxCommissionAmount(value) {
  //   this.cmpRef.minMaxAmount2.setTotalValue(value);
  //   this.cmpRef._maxCommissionAmount= value;
  // }
  // 
  // setMinCommissionAmount(value) {    
  //   this.cmpRef.minMaxAmount.setTotalValue(value);
  //   this.cmpRef._minCommissionAmount= value;
  // }
// 
  // setPaidCommissionAmount(value) {
  //   this.cmpRef.controlPaidCommissionAmount.setTotalValue(value);
  //   this.cmpRef._paidCommissionAmount= value;
  // }
// 
  // setRequestedCommissionAmount(value) {
  //   var newValue= value;
  //   if (!value) {
  //     newValue=0;
  //   }
  //   this.cmpRef.controlRequestedCommissionAmount.setTotalValue(newValue);
  //   this.cmpRef._requestedCommissionAmount= newValue;
  // }
// 
  // setRequestedCommissionFEC(value) {
  //   this.cmpRef._requestedCommissionFEC= value;
// 
  //   if (!this.cmpRef._requestedCommissionFEC) {
  //     this.cmpRef._requestedCommissionFEC= 0;
  //   }
// 
  //   this.cmpRef.controlFEC.setSelectedFECById(this.cmpRef._requestedCommissionFEC);
  // }  
// 

// 

// 
  // setVisibilityAutoCalculatedAmount(value) {
  //   findDOMNode(this.cmpRef.autoCalculatedAmount).style.display= this.returnVisibilityProp(value);
  //   this.cmpRef._visibilityAutoCalculatedAmount= value;
  // }  
// 
  
// 
  // setVisibilityBSMV(value) {
  //   findDOMNode(this.cmpRef.bsmv).style.display= this.returnVisibilityProp(value);
  //   findDOMNode(this.cmpRef.bsmvIncluded).style.display= this.returnVisibilityProp(value);       
  //   this.cmpRef._visibilityBSMV= value;
  // }  
// 
  // setvisibilityCommissionAmount(value) {
  //   findDOMNode(this.cmpRef.commissionAmount).style.display= this.returnVisibilityProp(value);    
  //   this.cmpRef.visibilityCommissionAmount= value;
  // }  
// 
  // setVisibilityCommissionCount(value) {
  //   findDOMNode(this.cmpRef.commissionCount).style.display= this.returnVisibilityProp(value);
  //   this.cmpRef._visibilityCommissionCount= value;
  // }  
// 
// 
  // setVisibilityDescription(value) {
  //   findDOMNode(this.cmpRef.description).style.display= this.returnVisibilityProp(value);
  //   this.cmpRef._visibilityDescription= value;
  // }
// 
 
// 
  // setVisibilityInformation(value) {
  //   findDOMNode(this.cmpRef.controlInformation).style.display= this.returnVisibilityProp(value);
  //   this.cmpRef._visibilityInformation= value;
  // }  
// 
  // setVisibilityMinMaxAmount(value) {
  //   findDOMNode(this.cmpRef.minMaxAmount).style.display= this.returnVisibilityProp(value);
  //   findDOMNode(this.cmpRef.minMaxAmount2).style.display= this.returnVisibilityProp(value);    
  //   this.cmpRef._visibilityMinMaxAmount= value;
  // }  
// 
  // setVisibilityPaidCommissionAmount(value) {
  //   findDOMNode(this.cmpRef.controlPaidCommissionAmount).style.display= this.returnVisibilityProp(value);
  //   this.cmpRef._visibilityPaidCommissionAmount= value;
  // }
// 
  // setVisibilityPayBackPlan(value) {
  //   findDOMNode(this.cmpRef.radioSearchTypes).style.display= this.returnVisibilityProp(value);
  //   findDOMNode(this.cmpRef.controlButonPayBackPlan).style.display= this.returnVisibilityProp(value);
  //   this.cmpRef._visibilityPayBackPlan= value;
  // }  

} 