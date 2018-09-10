import React from 'react';
// import { findDOMNode } from 'react-dom';
import { propTypes, defaultProps } from './Properties';
import CommonConstant from './constants';
import { CommissionSetter } from './CommissionSetter';

import { BBusinessComponent } from 'b-business-component';
// import { BComponent } from 'b-component';
import { BAccountComponent } from 'b-account-component';
import { BTabBar } from 'b-tab-bar';
import { BInput } from 'b-input';
import { BMoney } from 'b-money';
import { BCheckBox } from 'b-check-box';
import { BFECComponent } from 'b-fec-component';
export class BCommissionComponent extends BBusinessComponent {

  // #region Properties

  static propTypes = {
    ...propTypes
  };

  static defaultProps = {
    ...defaultProps
  };

  _isSafeOptionChecked = this.props.isSafeOptionChecked;
  _isAccountOptionChecked = this.props.isAccountOptionChecked;
  _selectedAccount = null;
  _selectedCustomer = null;
  _useCustomCommissionRate;
  _customCommissionRate = 0;
  _OPMUser = false;
  _commissionBranchFreeInformationTypes = [];
  _bsmvRatio = this.props.bsmvRatio;
  _commissionDefinitionInfo = [];
  _commissionInfo = this.props.commissionInfo;
  _canLoadData = false;
  _canRefreshRequestedCommissionAmount = false;
  _canLoadDataOnSerialize = this.props.canLoadDataOnSerialize;
  _canLoadDataOnWorkFlow = this.props.canLoadDataOnWorkFlow;
  _commissionPaymentTypeParameter = this.props.commissionPaymentTypeParameter;
  _commissionCount = this.props.commissionCount;
  _selectedAccountBranchId = 0;
  _selectedCommissionType = this._isAccountOptionChecked == true ? CommonConstant.CommissionType.FromAccount : CommonConstant.CommissionType.FromBox;
  _selectedLedgerId = 0;
  _selectedFec = 0;
  _maxCommissionAmountControlValue = 0;
  _minCommissionAmountControlValue = 0;
  _isEligibleForCommissionDiscountMessageSet = false;
  _isEligibleForCommissionDiscountControlEnabled = this.props.isEligibleForCommissionDiscountControlEnabled;
  _isLockedCommissionRate = false;
  _isLockedRequestedCommissionAmount = false;
  // #endregion Properties

  constructor(props, context) {
    super(props, context);

    this.setter = new CommissionSetter(this);
    this.initialState();
    this.setter.setRequestedCommissionFECDefaultValue();
    this.setter.setFECListDefaultValue();

  }

  // #region Events

  componentDidMount() {
    
    this.setter.setVisibility();
    this.getParameter();
    this.isOPMUser();
    this.getCommissionDefinitionByCommissionKey();

    if (this.props.commissionSerializeId != 0) {
      this.getCommissionSerialize();
      this.setAllUIFromCommissionContract();
      this._canLoadData = this._canLoadDataOnSerialize;
      this._canRefreshRequestedCommissionAmount = this._canLoadDataOnSerialize;
    }
    else if (this.props.context != null && this.props.isInWorkFlow == true) { // Worflow
      this.setAllUIFromCommissionContract();
      this._canLoadData = this._canLoadDataOnWorkFlow;
      this._canRefreshRequestedCommissionAmount = this._canLoadDataOnWorkFlow;
      return;
    }
    else if (this.props.commissionJournalBusinessKey != null && this.props.commissionJournalBusinessKey != 0) {
      this.loadComponentFromCommissionJournalBusinessKey();
      this._canLoadData = false;
    }
    else {
      this.setter.setCommissionPaymentInfo();
      this._canRefreshRequestedCommissionAmount = true;
      this._canLoadData = true;

      this.calculateCommission();
    }
    if (this.controlFEC.state.selectedFECId != null)
      this.setState({ _fECAmountCurrencyCode: this.controlFEC.state.selectedFECId });

    if (this.props.onLoadCompleted) {
      this.props.onLoadCompleted();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._commissionInfo != null) // OnWithCustomerChanged
      this._commissionInfo.withCustomer = this._isSafeOptionChecked ? this.props.withCustomer : true;
    
    if (this.props.withCustomer == true)
      this.setter.setVisibilityPaymentInformationOptions(true);
    else {
      this.setter.setVisibilityPaymentInformationOptions(false);
      this._isSafeOptionChecked = true;
      this.setState({_accountNumber: null});
    }

    if (prevState._requestedCommissionAmount != this.state._requestedCommissionAmount) { // OnRequestedCommissionAmountSet
      if (this._canRefreshRequestedCommissionAmount && !this._isLockedRequestedCommissionAmount) {
        this.refreshCommissionAmountInfo();
        // this.checkBalance();
      }
      // commission.GetRequestedCommissionAmountWithoutIncentive();
    }

    if (prevState._commissionRate != this.state._commissionRate && !this._isLockedCommissionRate) { // OnCommissionRateChanged
      this._isLockedCommissionRate = true;
      this.reCalculateCommissionAmountByNewCommissionRate();
      this._isLockedCommissionRate = false;
    }

    if (prevState._commissionBaseCount!= this.state._commissionBaseCount) { // OnCommissionBaseCountChanged
      this.calculateCommission();
    }

    if (prevState._transactionAmount!= this.state._transactionAmount) { // OnCommissionParamsChanged
      this.calculateCommission();
    }
  }

  handlePaymentInfoChange(e, value) {
    if (this.state._ispaymentInfoDisabled == false) {
      if (value == 0) {
        this.setter.setIsSafeOptionChecked(true);
        this._commissionInfo.commissionType = CommonConstant.CommissionType.FromBox; // Kasa

        if (this.state._fECGroupList.includes(2)) {
          let segmentList = [];
          segmentList = Object.assign([], this.state._fECGroupList),
            segmentList.splice(segmentList.indexOf(2), segmentList.indexOf(2) + 1);
          this.setState({ _fECGroupList: segmentList });
        }

        this.setter.setVisibilityFECList(true);
        if (this._selectedAccount && this.controlFEC) {
          this.controlFEC.setSelectedFECById(this._selectedAccount.fec);
        }
      }
      else if (value == 1) {
        this.setter.setIsAccountOptionChecked(true);
        this._commissionInfo.commissionType = CommonConstant.CommissionType.FromAccount; // Hesap
        if (!this.state._fECGroupList.includes(2)) {
          let segmentList = [];
          segmentList = Object.assign([], this.state._fECGroupList),
            segmentList.push(2);
          this.setState({ _fECGroupList: segmentList });
        }
        this.setter.setVisibilityFECList(false);
        
        // CheckBalance();
      }
      if (this._commissionInfo != null)
        this._commissionInfo.withCustomer = this._isSafeOptionChecked ? this.props.withCustomer : true;
      this.calculateCommission();
      if (this.props.onPaymentInformationOptionsChanged != null)
        this.props.onPaymentInformationOptionsChanged();
    }
  }

  handleCustomerSelect(selectedCustomer) {
    this._selectedCustomer = selectedCustomer;
  }

  handleCustomerNotFound() {
  }

  handleAccountSelect(selectedAccount) {
    this._selectedAccount = selectedAccount;
    if (selectedAccount != null) {
      this.setState({ _accountNumber: selectedAccount.accountNumber});
      this.setState({ _requestedCommissionFEC: selectedAccount.fec });
      this.handleFecChanged();
      this.calculateCommission();
      // this.checkBalance();
    }
  }

  handleCommissionRateChange(e, v) {
    this.setState({_commissionRate: v});

    if (this.props.commissionSerializeId > 0 || (this.props.commissionJournalBusinessKey != null && this.props.commissionJournalBusinessKey > 0)) {
      this.calculateCommission();
    }
    this._isLockedCommissionRate = true;
    this.reCalculateCommissionAmountByNewCommissionRate();
    this._useCustomCommissionRate = true;
    this._customCommissionRate = this.state._commissionRate;
    this._isLockedCommissionRate = false;
  }

  handleFecChanged() {
    this.setState({ _fECAmountCurrencyCode: this._selectedAccount.fec });
    if (this._canLoadData) {
      this.refreshCommissionAmountInfo();
    }
    if (this.props.afterSelectedFECChanged != null)
      this.props.afterSelectedFECChanged(this.controlFEC.state.selectedFECId, null);
  }

  handleSelectedFecChanged() {
    this.setState({ _requestedCommissionFEC: this.controlFEC.state.selectedFECId });
    this.setState({ _fECAmountCurrencyCode: this.state._requestedCommissionFEC });
    if (this._canLoadData) {
      this.refreshCommissionAmountInfo();
    }
    if (this.props.afterSelectedFECChanged != null)
      this.props.afterSelectedFECChanged(this.controlFEC.state.selectedFECId, null);
  }

  handleAutoPrice() {
    // string formNameSuffix = " - " + CommissionInfo.AccountNumber.ToString() + "-" + CommissionInfo.Id;
    // FormManager.ShowWithResourceCode(BOA.Common.Constant.ResourceCodeConstants.CommissionAutoPriceSummary, formNameSuffix, CommissionInfo);
  }

  handleControlRequestedCommissionAmountChange() {
    this._isLockedRequestedCommissionAmount = true;
    if ((this.props.commissionSerializeId > 0 || (this.props.commissionJournalBusinessKey != null && this.props.commissionJournalBusinessKey > 0)))
    {
      var tmpRequestedCommissionAmount =  this.controlRequestedCommissionAmount.getValue(); // this.state._requestedCommissionAmount;
      // var tmpIsLetterParametersChanged = IsLetterParametersChanged;
      // IsLetterParametersChanged = true;
      this.calculateCommission();
      // IsLetterParametersChanged = tmpIsLetterParametersChanged;
      this.setState({_requestedCommissionAmount: tmpRequestedCommissionAmount});
    }

    var requestedCommissionAmountToCalculate = this.controlRequestedCommissionAmount.getValue().value; // this.state._requestedCommissionAmount;
    requestedCommissionAmountToCalculate = this.controlMinMax(requestedCommissionAmountToCalculate);
    if (requestedCommissionAmountToCalculate == this.state._requestedCommissionAmount)
      this.controlRequestedCommissionAmount.setTotalValue(requestedCommissionAmountToCalculate);
    this.setState({_requestedCommissionAmount: requestedCommissionAmountToCalculate});

    this.refreshCommissionAmountInfo();
    // this.checkBalance();

    if (!this._isLockedCommissionRate)
    {
      // oran değiştiği için tutar değişiyorsa tekrar tutara göre oran
      // hesaplanmaması lazım. if kontrolü o yüzden.
      this.reCalculateCommissionRateByNewCommissionAmount();
    }

    if (this.props.onCommissionAmountChanged != null)
      this.props.onCommissionAmountChanged(this.state._requestedCommissionAmount);

    this._isLockedRequestedCommissionAmount = false;

    // GetFirstInstallmentInfo();
  }
  

  handleControlFECAmountChange() {
    var newAmount = this.controlFECAmount.getValue().value;
    newAmount = this.convertToRequestedAmount(newAmount);
    newAmount = this.controlMinMax(newAmount);
    if (this.state._requestedCommissionAmount == newAmount)
    {
      this.controlRequestedCommissionAmount.setTotalValue(newAmount);
      this.refreshCommissionAmountInfo();
    }
    else
    {
      this.setState({_requestedCommissionAmount: newAmount});
    }

    if (this.props.onCommissionAmountChanged != null)
      this.props.onCommissionAmountChanged(null, null);
  }

  handleDescriptionChange(e, v) {
    this.setState({_description: v});
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'IsOPMUser':
        if (response.success)
          this.isOPMUser = response.value;
        break;
      case 'GetParameter':
        if (response.success)
          this._commissionBranchFreeInformationTypes = response.value;
        break;
      case 'ComSerialize':
        if (response.success)
          this.setCommissionSerialize(response.value);
        break;
      case 'CommissionJournalInfo':
        this.loadComponentFromCommissionJournalBusinessKey(response);
        break;
      case 'CommissionDefinition':
        if (response.success)
          this._commissionDefinitionInfo = response.value;
        break;
      case 'GetCommission':
        if (response.success)
          this.calculateCommission(response.value);
        break;
      case 'GetFXRate':
        this.convertToFECAmount(response);
        break;
      case 'EligibleForCommissionDiscount':
        this.controlEligibleForCommissionDiscount(response);
        break;
      default:
        break;
    }
  }
  // #endregion Events

  // #region Methods

  initialState() {
    this.state = {
      _accountSuffix: null,
      _accountNumber:this.props.accountNum,
      _commissionRate: 0, // OnCommissionRateChanged
      _specialCommissionRate: null,
      _commissionAmount: null,
      _transactionAmount: this.props.transactionAmount,
      _transactionAmountFEC: this.props.transactionAmountFEC,
      _autoCalculatedAmount: 0,
      _requestedCommissionFEC: 0, // TL
      _currencyCode: 0, // TL
      _commissionBaseCount: this.props.commissionBaseCount,
      _bsmvIncluded: false,
      _bsmvAmount: null,
      _requestedCommissionAmount: this.props.requestedCommissionAmount,
      _isCommissionAmountReadOnly: this.props.isCommissionAmountReadOnly,
      _isAutoPriceEnabled: this.props.isAutoPriceEnabled,
      _fECGroupList: [],
      _fECAmountCurrencyCode: 0, // TL
      _fECAmount: 0,
      _requestedCommissionFER: this.props.requestedCommissionFER,
      _ispaymentInfoDisabled: this.props.ispaymentInfoDisabled,
      _iscommissionInfoDisabled: this.props.iscommissionInfoDisabled,
      _information: '',
      _description: ''
    };
  }

  clearData() {
    this._isLockedCommissionRate = true;
    this.setState({
      _autoCalculatedAmount: 0,
      _bsmvAmount: 0,
      _bsmvIncluded: false,
      _commissionAmount: 0,
      _commissionRate: 0,
      // _isBtnAccountSelected = false;
      // _isBtnDepositSelected = false;
      // _visibilityPaidCommissionAmount = false;
      _description: '',
      _fECAmount: 0,
      _information: '',
      // _initialCommissionAmount = 0;
      
      // _minCommissionAmount = null;
      // _maxCommissionAmount = null;
      _requestedCommissionAmount: 0,
    });
    this._isLockedCommissionRate = false;
    this._commissionInfo = {};
    this._minCommissionAmountControlValue = 0;
    this._maxCommissionAmountControlValue = 0;
    this._isEligibleForCommissionDiscountMessageSet = false;
    this._bsmvRatio= 0;
  }

  isOPMUser() {
    let request = {
      requestClass: 'BOA.Types.BusinessComponents.CommissionComponentRequest',
      requestBody: {
        MethodName: 'IsOPMUser',
      },
      key: 'IsOPMUser'
    };
    this.proxyExecute(request);

  }

  
  setCommissionSerialize(serializeInfo) {
    this._commissionInfo = serializeInfo;
  }

  setAllUIFromCommissionContract() {
    if (this._commissionInfo == {})
      return;
    this.setter.setCommissionPaymentInfo();

    this._isLockedCommissionRate = true;
    this.setState({_commissionRate: this._commissionInfo.commissionRate});
    this._isLockedCommissionRate = false;
    this.setState({
      _commissionAmount          : this._commissionInfo.commissionAmount,
      _bsmvIncluded              : this._commissionInfo.bSMVIncluded,
      _bsmvAmount                : this._commissionInfo.bSMVAmount,
      _autoCalculatedAmount      : this._commissionInfo.autoCalculatedAmount,
      _requestedCommissionAmount : this._commissionInfo.requestedCommissionAmount,
      _fECAmount                 : this._commissionInfo.fECAmount,
      _description               : this._commissionInfo.description,
      _information               : this._commissionInfo.information,
    });
    this._commissionCount = this._commissionInfo.commissionCount;
    // this._minCommissionAmount = CommissionInfo.MinCommissionAmount;
    // this._maxCommissionAmount = CommissionInfo.MaxCommissionAmount;
    
    // var isLetterCommission = LetterCommissionKeys.Exists(p => p == CommissionKey);
    
    if (this._commissionInfo.commissionDefinitionFEC > 0) // || isLetterCommission)
      this.setState({ _currencyCode: this.getFecCodeInFecList(this._commissionInfo.commissionDefinitionFEC)});

    if (this._commissionInfo.commissionType == CommonConstant.CommissionType.FromAccount) {
      this.setState({ _accountNumber: this._commissionInfo.accountNumber });
      this.setState({ _accountSuffix: this._commissionInfo.accountSuffix });
    }

    this.setState({ _requestedCommissionFEC: this._commissionInfo.requestedCommissionFEC });
    // hesap yüklendikten sonra bu yüklenmeli.
    this.setState({ _requestedCommissionFER: this._commissionInfo.requestedCommissionFER });

    // SetComboInstalmentTypeSelectedValue(true);

    // EnableOrDisableInstalmentCombo();

    if (this._commissionInfo.information == CommonConstant.CampaignPrice || this._commissionInfo.information == CommonConstant.PackagePrice)
    {
      this._commissionInfo.canChangeAmount = 0;
      this._commissionInfo.isUsedAdvantage = true;

    }
    if (this._commissionInfo.canChangeAmount != null && this._commissionInfo.canChangeAmount == 0)
    {
      this.setState({
        _isCommissionAmountReadOnly : true,
        _isCommissionRateReadonly   : true
      });
    }
    else if (this._commissionInfo.canChangeAmount != null && this._commissionInfo.canChangeAmount == 1)
    {
      this.setState({
        _isCommissionAmountReadOnly : false 
      });
    }

    if (this._commissionInfo.information == CommonConstant.AutoPrice)
    {
      this.setState({ _isAutoPriceEnabled: true });
      // RequestedCommissionAmount = (CommissionInfo.HasBSMV && !BsmvIncluded) ? decimal.Round(CommissionInfo.BaseAmount * (1 + BSMVRatio), 2) : CommissionInfo.BaseAmount;
    }
    else
    {
      this.setState({ _isAutoPriceEnabled: false });
    }
  }

  loadComponentFromCommissionJournalBusinessKey(response) {
    if (response == null)
      this.getCommissionJournalInformation();
    else
      if (response.success && response.value != null && response.value.length > 0) {
        let journalContract = response.value[0];
        if (journalContract.commissionType == CommonConstant.CommissionType.FromBox)
          this.setter.setIsSafeOptionChecked(true);
        else
          this.setter.setIsAccountOptionChecked(true);
        
        this._isLockedCommissionRate = true;
        this.setState({ _commissionRate: journalContract.commissionRate });
        this._isLockedCommissionRate = false;
        this.setState({ _commissionAmount: journalContract.commissionAmount });
        this.setState({ _bsmvIncluded: journalContract.bsmvIncluded });
        this.setState({ _bsmvAmount: journalContract.bsmvAmount });
        if (journalContract.hasBSMV && journalContract.bsmvIncluded)
          this.setState({ _autoCalculatedAmount: journalContract.baseAmount + (journalContract.baseBSMVAmount == null ? 0 : journalContract.baseBSMVAmount) });
        else
          this.setState({ _autoCalculatedAmount: journalContract.baseAmount });
        this.setState({ _requestedCommissionAmount: journalContract.commissionAmount + journalContract.bsmvAmount });
        this.setState({ _fECAmount: journalContract.fecAmount });
        if (journalContract.commissionCount != null) {
          this._commissionCount = journalContract.commissionCount;
        }
        // MinCommissionAmount = journalContract.MinCommissionAmount;
        // MaxCommissionAmount = journalContract.MaxCommissionAmount;
        this.setState({
          _description: journalContract.Description,
          _information: journalContract.Information
        });

        if (this._commissionInfo.commissionDefinitionFEC > 0) // || isLetterCommission
          this.setState({ _currencyCode: this.getFecCodeInFecList(this._commissionInfo.commissionDefinitionFEC) });

        if (journalContract.commissionType == CommonConstant.CommissionType.FromAccount) {
          this.setState({ _accountNumber: journalContract.accountNumber });
          this.setState({ _accountSuffix: journalContract.accountSuffix });
        }

        this.setState({ _requestedCommissionFEC: journalContract.requestedCommissionFEC });
        // hesap yüklendikten sonra bu yüklenmeli.
        this.setState({ _requestedCommissionFER: journalContract.requestedCommissionFER });
        // EnableOrDisableInstalmentCombo();
        
        // if (CommissionPaymentTypeParameter == CommissionPaymentType.WithPartialPayment)
        // {
        //     ControlPaidCommissionAmount.Value = journalContract == null ? 0 : (journalContract.PaidCommissionAmount + journalContract.BsmvAmount);
        //     ControlPaidCommissionAmount.Visibility = Visibility.Visible;
        // }

        this.setState({_ispaymentInfoDisabled: true});
        this.setState({_iscommissionInfoDisabled: true});
        
      }
  }

  calculateCommission(response) {
    if (!this.props.canCalculateCommission || !this._canLoadData || this.props.commissionKey == null)
      return;
    this.clearData();
    if (this.state._accountNumber != null && this.state._accountNumber <= 0)
      return;
    if (response == null)
      this.proxyExecute(this.fillRequest());
    else if (response != null) {
      this._commissionInfo = response;
      this.fillComponentVariables();
      if (this.props.afterCommissionInfoLoaded)
        this.props.afterCommissionInfoLoaded(this.state._requestedCommissionAmount);
    /*
      if (CommissionInfo.HasInstalment == 1)
      {
        ComboInstalmentType.IsReadOnly = isLetterCommission ? IsInstallmentTypeReadOnly : false;
        if (tmpInstalmentList != null)
        {
          CommissionInfo.InstalmentList = tmpInstalmentList;
        }

        CalculateInstalmentAmount();
      }
    */
      this.controlEligibleForCommissionDiscount();
      
      this.checkBalance();
      if (this._commissionInfo.canChangeAmount != null && this._commissionInfo.canChangeAmount == 0)
      {
        this.setState({_isCommissionAmountReadOnly: true, _isCommissionRateReadonly: true});
      }
      else if (this._commissionInfo.canChangeAmount != null && this._commissionInfo.canChangeAmount == 1)
      {
        this.setState({_isCommissionAmountReadOnly: false});
      }
    }
  }
  
  reCalculateCommissionAmountByNewCommissionRate() {
    this.getCommissionDefinitionByCommissionKey();
    if (this.state._transactionAmount > 0 && this._commissionCount > 0 && this.state._commissionRate > ((100 * this._maxCommissionAmountControlValue) / (this.state._transactionAmount * this._commissionCount * ((this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? (1 + this._bsmvRatio) : 1))))
    {
      this.setState({ _commissionRate: (100 * this._maxCommissionAmountControlValue) / (this.state._transactionAmount * this._commissionCount * ((this._commissionInfo.HasBSMV && !this.state._bsmvIncluded) ? (1 + this._bsmvRatio) : 1))});
    }

    else if (this.state._transactionAmount > 0 && this._commissionCount > 0 && this.state._commissionRate  < ((100 * this._minCommissionAmountControlValue) / (this.state._transactionAmount * this._commissionCount  * ((this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? (1 + this._bsmvRatio) : 1))))
    {
      this.setState({ _commissionRate: ((100 * this._minCommissionAmountControlValue) / (this.state._transactionAmount * this._commissionCount  * ((this._commissionInfo.HasBSMV && !this.state._bsmvIncluded) ? (1 + this._bsmvRatio) : 1)))});
    }

    this.setState({ _commissionRate: (this._commissionDefinitionInfo.maxCommissionRate != null && this.state._commissionRate  > this._commissionDefinitionInfo.maxCommissionRate) ? this._commissionDefinitionInfo.maxCommissionRate : this.state._commissionRate});
    this.setState({ _commissionRate: (this._commissionDefinitionInfo.minCommissionRate != null && this.state._commissionRate  < this._commissionDefinitionInfo.minCommissionRate) ? this._commissionDefinitionInfo.minCommissionRate : this.state._commissionRate});

    this.calculateCommission();
    this._commissionInfo.commissionRate = this.state._commissionRate;

    if (this._commissionInfo != null
      && this.state._commissionRate != null
      && this._commissionInfo.commissionRate > 0)
    {
      if (this._minCommissionAmountControlValue != null && this._commissionInfo.requestedCommissionAmount < this._minCommissionAmountControlValue)
      {
        this.setState({ _requestedCommissionAmount: this._minCommissionAmountControlValue});
      }
      else if (this._maxCommissionAmountControlValue != null && this._commissionInfo.requestedCommissionAmount > this._maxCommissionAmountControlValue)
      {
        this.setState({ _requestedCommissionAmount: this._maxCommissionAmountControlValue});
      }
      this.refreshCommissionAmountInfo(); // _requestedCommissionAmount
    }

    if (this.props.onCommissionAmountChanged != null)
    {
      this.props.onCommissionAmountChanged();
    }
  }

  reCalculateCommissionRateByNewCommissionAmount() {
    // if (!LetterCommissionKeys.Exists(p => p == CommissionKey))
    // {
    //     return;
    // }

    // this.getCommissionDefinitionByCommissionKey();
    // this._isLockedCommissionRate = true;
    // if (this.state._transactionAmount > 0 && this.props.commissionCount != null && this.props.commissionCount > 0)
    // {
    //   // GetRequestedCommissionAmountWithoutIncentive();
    //   this.setState({_commissionRate : (100 * requestedCommissionAmountWithoutIncentive) / (TransactionAmount * CommissionCount * ((CommissionInfo.HasBSMV && !BsmvIncluded) ? (1 + GetTaxRate()) : 1))});
    // }
    // if (CommissionInfo.Information == EngineConstants.AutoPrice && !OPMUser && !KeepCustomCommissionAmount && ChannelId.GetValueOrDefault(0) != ChannelContract.Internet.GetHashCode() && TransactionAmount > 0 && CommissionCount.GetValueOrDefault(0) > 0)
    // {
    //     CommissionRate = (100 * CommissionInfo.BaseAmount) / (TransactionAmount * CommissionCount);
    // }
    // isLockedCommissionRate = false;
    // CommissionInfo.CommissionRate = CommissionRate;
    // GetFirstInstallmentInfo();
  }

  controlEligibleForCommissionDiscount(response) {
    // IsEligibleForCommissionDiscountMessageSet değeri bu metoda girilirken her zaman false tur.
    if (this.props.context.applicationContext.user.branchId != null && this.props.context.applicationContext.user.branchId != 0 
      && this._selectedAccount != null && this._selectedAccount.accountNumber != 0 && response != null)
    {
      var isCommissionInformationTypeBranchFree = false;
      for (var i=0; i<this._commissionBranchFreeInformationTypes.length; i++) {
        if (isCommissionInformationTypeBranchFree)
          break;
        isCommissionInformationTypeBranchFree = this._commissionInfo.information == this._commissionBranchFreeInformationTypes[i].paramDescription ? true : false;
      }

      var eligibleForCommissionDiscount = !response.success ? null : response.value;
      var message = '';
      if (this._isEligibleForCommissionDiscountControlEnabled
        && eligibleForCommissionDiscount != null
        && eligibleForCommissionDiscount == 0
        && this._commissionInfo.hasCommissionBranch == 1
        && !isCommissionInformationTypeBranchFree)
      {
        
        message = this.getMessage('BusinessComponents', 'BranchCommissionAbandonmentRateHasExpired');
        this._isEligibleForCommissionDiscountMessageSet = true;
        // ControlInformationTextBox.TextFontWeight = FontWeights.Bold;
      }
      else
      {
        this._isEligibleForCommissionDiscountMessageSet = false;
        // ControlInformationTextBox.TextFontWeight = FontWeights.Normal;
      }
      if (this._commissionInfo != null)
        message += this._commissionInfo.information;
      
      this.setState({_information: message});
    
      this.setCommissionIncreaseAndDecreaseRules(); // async çalışmadan dolayı calculate altından buraya alındı.
    }
    else {
      if (this._selectedAccount != null && this._selectedAccount.accountNumber != 0)
        this.getEligibleForCommissionDiscount(this.props.context.applicationContext.user.branchId, this._selectedAccount.accountNumber);
    }
  }

  setCommissionIncreaseAndDecreaseRules() {
    if (this._commissionInfo.information == 'Otomatik Fiyat') {
      // Kurallar sıralamaya göre birbirlerini ezerler, yani örneğin 1. kural bütün hepsini ezerken, 3. kural sadece 4. kuralı ezer.
      if (this._isSafeOptionChecked && this.props.withCustomer == false)
      {
        // Komisyon müşterisiz ve kasadan olduğu zaman komisyon tutarı AutoCalculatedAmount un altına düşürülemez ama istenildiği kadar arttırılabilir. (AutoCalculatedAmount - ~)
        this._minCommissionAmountControlValue = this._commissionInfo == null ? null : this._commissionInfo.autoCalculatedAmount;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }
      else if (this._commissionInfo != null && this._commissionInfo.isException)
      {
        // Komisyon tanımı istisnai ise gelen komisyon miktarı yükseltilebilir ama düşürülemez. (CommissionAmount - ~)
        this._minCommissionAmountControlValue = this.state._requestedCommissionAmount;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }

      else if (this._commissionInfo.hasCommissionBranch != null
        && this._commissionInfo.hasCommissionBranch == 1
        && this._isEligibleForCommissionDiscountMessageSet)// True olması vazgeçme oranının dolduğunu gösterir.
      {
        // Vazgeçme oranı müsait değilse komisyon tutarı azaltılamaz ama yükseltilebilir. (CommissionAmount - ~)
        if (this._commissionInfo.autoPriceAmount == null)
        {
          this._minCommissionAmountControlValue = this.state._requestedCommissionAmount;
        }
        else
        {
          this._minCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? this._commissionInfo.autoPriceAmount + this._commissionInfo.autoPriceBSMVAmount : this._commissionInfo.autoPriceAmount;
        }

        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }
      
      else if (this._commissionInfo.hasCommissionBranch != null
        && this._commissionInfo.hasCommissionBranch == 1
        && !this._isEligibleForCommissionDiscountMessageSet)// False olması vazgeçme oranının daha dolmadığını gösterir.
      {
        // Vazgeçme oranı müsaitse komisyon tutarı azaltılabilir ama MaxCommissionAmount un üstüne çıkamaz. (0 - MaxCommissionAmount)
        this._minCommissionAmountControlValue = 0;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
        // maxCommissionAmountControlValue = CommissionInfo == null ? null : CommissionInfo.MaxCommissionAmount;
      }

      else
      {
        // Hiçbir şarta girmedi ise komisyon tutarı eğer varsa MinCommissionAmount ile MaxCommissionAmount aralığında olabilir. (MinCommissionAmount - MaxCommissionAmount)
        this._minCommissionAmountControlValue = this._commissionInfo == null ? null : (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? this._commissionInfo.minCommissionAmount * (1 + this._bsmvRatio) : this._commissionInfo.minCommissionAmount;

        if (this._commissionInfo.autoPriceAmount != null)
        {
          this._minCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? this._commissionInfo.autoPriceAmount + this._commissionInfo.autoPriceBSMVAmount : this._commissionInfo.autoPriceAmount;
        }

        // if (isLetterCommission && this._commissionInfo != null && this._commissionInfo.autoPriceAmount < this._commissionInfo.minCommissionAmount)
        // {
        //   this._minCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? this._commissionInfo.minCommissionAmount * (1 + this._bsmvRatio) : this._commissionInfo.minCommissionAmount;
        // }

        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }
    }

    else
    {
      // Alınacak komisyon tutarının değiştirilebilmesi bazı kurallara bağlanmıştır.
      // Kurallar sıralamaya göre birbirlerini ezerler, yani örneğin 1. kural bütün hepsini ezerken, 3. kural sadece 4. kuralı ezer.
      if (this._isSafeOptionChecked && this.props.withCustomer == false)
      {
        // Komisyon müşterisiz ve kasadan olduğu zaman komisyon tutarı AutoCalculatedAmount un altına düşürülemez ama istenildiği kadar arttırılabilir. (AutoCalculatedAmount - ~)
        this._minCommissionAmountControlValue = this._commissionInfo.autoCalculatedAmount;
        this._maxCommissionAmountControlValue = (this._commissionInfo.HasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }

      else if (this._commissionInfo != null && this._commissionInfo.isException)
      {
        // Komisyon tanımı istisnai ise gelen komisyon miktarı yükseltilebilir ama düşürülemez. (CommissionAmount - ~)
        this._minCommissionAmountControlValue = this.state._requestedCommissionAmount;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }

      else if (this._commissionInfo.hasCommissionBranch != null
        && this._commissionInfo.hasCommissionBranch == 1
        && this._isEligibleForCommissionDiscountMessageSet) // True olması vazgeçme oranının dolduğunu gösterir.
      {
        // Vazgeçme oranı müsait değilse komisyon tutarı azaltılamaz ama yükseltilebilir. (CommissionAmount - ~)
        this._minCommissionAmountControlValue = this.state._requestedCommissionAmount;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }

      else if (this._commissionInfo.hasCommissionBranch != null
        && this._commissionInfo.hasCommissionBranch == 1
        && !this._isEligibleForCommissionDiscountMessageSet)// False olması vazgeçme oranının daha dolmadığını gösterir.
      {
        // Vazgeçme oranı müsaitse komisyon tutarı azaltılabilir ama MaxCommissionAmount un üstüne çıkamaz. (0 - MaxCommissionAmount)
        this._minCommissionAmountControlValue = 0;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }

      else if (this._commissionInfo.information == CommonConstant.CustomerDimension)
      {
        // Hiçbir şarta girmedi && 'Genel Komisyon' ya da Komiyon Boyut'' ise komisyon tutarı eğer varsa MinCommissionAmount ile MaxCommissionAmount aralığında olabilir. (MinCommissionAmount - MaxCommissionAmount)
        this._minCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.calculatedMinAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.calculatedMinAmount;
        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }
      else
      { // isLetterCommission ? RequestedCommissionAmount:
        this._minCommissionAmountControlValue =  (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? this._commissionInfo.minCommissionAmount * (1 + this._bsmvRatio)
                                                                                                          : this._commissionInfo.minCommissionAmount;

        this._maxCommissionAmountControlValue = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? Math.round((this._commissionInfo.baseAmount * (1 + this._bsmvRatio))*100)/100 : this._commissionInfo.baseAmount;
      }
    }

  }

  // #region Fill Methods

  fillRequest() {
    var request = {
      requestClass: 'BOA.Types.BusinessComponents.CommissionComponentRequest',
      requestBody: {
        Amount: this.state._transactionAmount,
        CommissionKey: this.props.commissionKey,
        CalculateFromTotalAmount: this.props.calculateFromTotalAmount,
        Date: this.props.context.applicationContext.channel.today, // '2018-06-01'
        ChannelId: this.props.context.applicationContext.channel.channelId,
        Efficiency: null,
        RegionId: null,
        AccountNumber: this._selectedAccount == null ? this.state._accountNumber : this._selectedAccount.accountNumber,
        AccountSuffix: this._selectedAccount == null ? null : this._selectedAccount.accountSuffix,
        BranchId: this._selectedAccount == null ? (this.props.branchId == null ? null : this.props.branchId) : this._selectedAccount.branchId,
        DayCountOfMaturity: this.props.dayCountOfMaturity,
        CommissionBaseCount: this.props.commissionBaseCount,
        Fec: this.state._transactionAmountFEC,
        TaxRate: this.props.taxRate,
        MethodName: 'GetCommission'
      },
      key: 'GetCommission'
    };
    if (this._selectedCustomer == null)
      request.requestBody.CustomerTypeId = this.props.portfolioClass;

    else
      request.requestBody.CustomerTypeId = (this._selectedCustomer.customerInfo.portfolioClass == null || this._selectedCustomer.customerInfo.portfolioClass == '') ? this.props.portfolioClass : this._selectedCustomer.customerInfo.portfolioClass;

    // request.ProductCode = ProductCode;
    // request.CalculateWithCampaign = CalculateWithCampaign;

    if (this._isSafeOptionChecked)
    {
      this._selectedAccountBranchId = this.props.context.applicationContext.user.branchId;
      this._selectedCommissionType = CommonConstant.CommissionType.FromBox;
    }
    else if (this._isAccountOptionChecked)
    {
      this._selectedAccountBranchId = (this._selectedAccount == null ? 0 : this._selectedAccount.branchId);
      this._selectedCommissionType = CommonConstant.CommissionType.FromAccount;
    }


    this._selectedLedgerId = this._selectedAccount == null ? 0 : this._selectedAccount.ledgerId;
    this._selectedAccountNumber = this._selectedAccount == null ? 0 : this._selectedAccount.accountNumber;
    this._selectedAccountSuffix = this._selectedAccount == null ? 0 : this._selectedAccount.accountSuffix;
    return request;
  }

  fillComponentVariables() {
    if (this._commissionInfo.commissionDefinitionFEC > 0)
      this.setState({ _currencyCode: this.getFecCodeInFecList(this._commissionInfo.commissionDefinitionFEC) });


    this.updateForCommissionCount();
    this._isLockedCommissionRate = true;
    this.setState({
      _commissionRate: this._commissionInfo.commissionRate,
      _specialCommissionRate: this._commissionInfo.specialCommissionRate,
      _bsmvIncluded: this._commissionInfo.bsmvIncluded,
      _autoCalculatedAmount: this._commissionInfo.autoCalculatedAmount,
    });
    this._isLockedCommissionRate = false;
    if (this._commissionInfo.hasBSMV) {
      this._bsmvRatio = this.getTaxRate();
      if (this.state._bsmvIncluded) {
        this.setState({
          _bsmvAmount: Math.round(((this._commissionInfo.amount * this._bsmvRatio) / (1 + this._bsmvRatio))*100)/100,
          _commissionAmount: Math.round((this._commissionInfo.amount / (1 + this._bsmvRatio))*100)/100,
        });
      }
      else {
        this.setState({
          _bsmvAmount: Math.round(((this._commissionInfo.amount * this._bsmvRatio))*100)/100,
          _commissionAmount: Math.round((this._commissionInfo.amount)*100)/100,
        });
      }
      this.setState({
        _requestedCommissionAmount: (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) 
                                                  ? (this.state._commissionAmount + this.state._bsmvAmount)
                                                  : this._commissionInfo.amount});

    }
    else {
      this._bsmvRatio = 0;
      this.setState({
        _bsmvAmount: null,
        _commissionAmount: this._commissionInfo.amount
      });
    }
    this.fillCommissionInformationContract();

    if (this._commissionInfo.information == CommonConstant.AutoPrice && !this._OPMUser) {
      this.setState({ _isAutoPriceEnabled: true });
      // (KeepCustomCommissionAmount || ChannelId.GetValueOrDefault(0) == ChannelContract.Internet.GetHashCode()) ? RequestedCommissionAmount
      if (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) {
        var tmp = Math.round(((this._commissionInfo.baseAmount * (1 + this._bsmvRatio)))*100)/100;
        this.setState({ _requestedCommissionAmount: tmp});
      }
      else
        this.setState({ _requestedCommissionAmount: this._commissionInfo.baseAmount});
      // this.setState({ _requestedCommissionAmount: this._commissionInfo.hasBSMV && !this.state._bsmvIncluded ? Number((this._commissionInfo.baseAmount * (1 + this._bsmvRatio)).toFixed(2)) : this._commissionInfo.baseAmount });
    }
    else if (this._commissionInfo.information != CommonConstant.AutoPrice)
      this.setState({ _isAutoPriceEnabled: false });

      
    this.refreshCommissionAmountInfo();
    this._commissionInfo.requestedCommissionAmount = this.state._requestedCommissionAmount;
  }

  fillCommissionInformationContract() {
    this._commissionInfo.AccountBranchId = this._selectedAccountBranchId;
    this._commissionInfo.AccountNumber = this._selectedAccountNumber;
    this._commissionInfo.AccountSuffix = this._selectedAccountSuffix;

    if (this._commissionInfo.taxRate != null
      && this._commissionInfo.taxRate > 0
      && this._commissionInfo.taxType == CommonConstant.CommissionTaxType.VAT) {
      this._commissionInfo.bSMVLedgerId = CommonConstant.Ledger.KDVLedgerId;
    }
    else {
      this._commissionInfo.bSMVLedgerId = CommonConstant.Ledger.BSMVLedgerId;
    }

    this._commissionInfo.calculateFromTotalAmount = this.props.calculateFromTotalAmount;
    this._commissionInfo.comment = this.props.comment;
    this._commissionInfo.requestedCommissionFEC = this.state._requestedCommissionFEC;
    this._commissionInfo.requestedCommissionFER = this.state._requestedCommissionFER;
    this._commissionInfo.commissionPaymentType = this._commissionPaymentTypeParameter;
    this._commissionInfo.commissionType = this._selectedCommissionType;
    this._commissionInfo.currentLedgerId = this._selectedLedgerId;
    // this._commissionInfo.description = this._description;
    this._commissionInfo.withCustomer = this._isSafeOptionChecked == true ? this.props.withCustomer : true;

    if (this._selectedCustomer == null) {
      this._commissionInfo.portfolioClass = this.props.portfolioClass;
    }
    else {
      this._commissionInfo.portfolioClass = (this._selectedCustomer.customerInfo.portfolioClass == null || this._selectedCustomer.customerInfo.portfolioClass == '') ? this.props.portfolioClass : (this._selectedCustomer.customerInfo.portfolioClass);
    }

    this._commissionInfo.transactionAccountSuffix = this.props.transactionAccountSuffix;
    this._commissionInfo.useTransactionAccountSuffix = this.props.useTransactionAccountSuffix;
  }

  updateForCommissionCount() {
    var commissionCount = this.getCommissionCount();
    this._commissionInfo.amount = this._commissionInfo.amount * commissionCount;
    this._commissionInfo.autoCalculatedAmount = this._commissionInfo.autoCalculatedAmount * commissionCount;
    this._commissionInfo.commissionBaseAmount = this._commissionInfo.commissionBaseAmount * commissionCount;
    this._commissionInfo.baseAmount = this._commissionInfo.baseAmount * commissionCount;
    this._commissionInfo.maxCommissionAmount = this._commissionInfo.maxCommissionAmount == null ? null : this._commissionInfo.maxCommissionAmount * commissionCount;
    this._commissionInfo.autoPriceAmount = this._commissionInfo.autoPriceAmount * commissionCount;

    if (this.props.isMinCommissionAmountMultipliedByCommissionCount == true) {
      this._commissionInfo.minCommissionAmount = this._commissionInfo.minCommissionAmount == null ? null : this._commissionInfo.minCommissionAmount * commissionCount;
    }
    this._commissionInfo.commissionCount = this.getCommissionCountProperty();
  }

  // #endregion Fill Methods

  // #region Get Methods
  getParameter() {
    let parameterFilter = {};
    parameterFilter.ParamType = 'COMBRANCHFREEINFO';
    let request = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.ParameterRequest',
      requestBody: {
        MethodName: 'GetParameters',
        ParameterContract: parameterFilter
      },
      key: 'GetParameter'
    };
    this.proxyExecute(request);
  }

  getCommissionDefinitionByCommissionKey() {
    if (this.props.commissionKey != null && this.props.commissionKey.trim() != '') {
      let request = {
        requestClass: 'BOA.Types.BusinessComponents.CommissionComponentRequest',
        requestBody: {
          MethodName: 'GetCommissionDefinitionByCommissionKey',
          CommissionKey: this.props.commissionKey
        },
        key: 'CommissionDefinition'
      };
      this.proxyExecute(request);
    }
  }

  getCommissionSerialize() {
    let request = {
      requestClass: 'BOA.Types.BusinessComponents.CommissionComponentRequest',
      requestBody: {
        MethodName: 'GetCommissionSerializeByKey',
        SerializedId: this.props.commissionSerializeId
      },
      key: 'ComSerialize'
    };
    this.proxyExecute(request);
  }


  getCommissionJournalInformation() {
    let request = {
      requestClass: 'BOA.Types.BusinessComponents.CommissionComponentRequest',
      requestBody: {
        MethodName: 'GetCommissionJournalByBusinessKey',
        CommissionJournalBusinessKey: this.props.commissionJournalBusinessKey
      },
      key: 'CommissionJournalInfo'
    };
    this.proxyExecute(request);
  }

  getTaxRate() {
    if (this._commissionInfo.taxRate == null) {
      return 0.05;
    }
    else {
      return this._commissionInfo.taxRate;
    }
  }

  getCommissionCount() {
    // Komisyon adetsizse 1 döner
    // Komisyon adetliyse;
    // ComissionCount null veya 0 ise 1 döner
    // Hem CommissionCount hem de CommissionBaseCount set edilmişse hatalı hesaplanir
    if (this._commissionCount == null || this._commissionCount == 0 || this._commissionInfo.countable == false) {
      return 1;
    }
    else {
      return this._commissionCount;
    }
  }

  getCommissionCountProperty() {
    if (this._commissionInfo.countable == false)
      return null;
    else
      return this._commissionCount;
  }

  getFecCodeInFecList(fecId) {
    if (!this.controlFEC) {
      return;
    }
    for (var fec in this.controlFEC.getValues()) {
      if (fec.fecId == fecId) {
        return fec.fecCode;
      }
    }
  }

  getEligibleForCommissionDiscount(branchId, accountNumber) {
    let request = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.CommissionInstantRequest',
      requestBody: {
        MethodName: 'EligibleForCommissionDiscount',
        branchId: branchId,
        accountNumber: accountNumber
      },
      key: 'EligibleForCommissionDiscount'
    };
    this.proxyExecute(request);
  }

  // #endregion Get Methods

  // #region Balance control
  checkBalance() {
    if (this._commissionPaymentTypeParameter != CommonConstant.CommissionPaymentType.WithEntirePayment)
      return;

    if (this._isSafeOptionChecked) // || IsGeneralAccountOptionChecked
    {
      // ControlRequestedCommissionAmount.ToolTip = new BToolTip(DialogTypes.Info, BOA.Messaging.MessagingHelper.GetMessage("BusinessComponents", "Info"), Information);
      // ControlRequestedCommissionAmount.TextForeground = Brushes.Black;
    }
    else {
      if (this.isBalanceInSufficient()) {
      //  var msg = '';
      //  if (this._selectedAccount != null)
      //    msg = BComponent.Utils.stringFormat(this.getMessage('BusinessComponents', 'XYCommissionAccountHasInsufficentBalance'), this._selectedAccount.accountNumber, this._selectedAccount.accountSuffix);
      //  else
      //    msg = this.getMessage('BusinessComponents', 'CommissionAccountAvailableBalanceInSufficient');
      }
    }
  }
  isBalanceInSufficient() {

  }
  // #endregion Balance control
  
  // #region Amount Methods
  refreshCommissionAmountInfo() {
    if (this.state._requestedCommissionAmount == 0)
      this.setState({ _fECAmount: 0 });

    else
      this.setState({ _fECAmount: this.convertToFECAmount() });
    
    if (this._commissionInfo == null)
      return;

    this._commissionInfo.amount = (this._commissionInfo.hasBSMV && !this.state._bsmvIncluded) ? (this.state._requestedCommissionAmount - (this.state._requestedCommissionAmount * this._bsmvRatio / (1 + this._bsmvRatio))) : this.state._requestedCommissionAmount;
    // commission.IsCommissionAmountChanged = commission.RequestedCommissionAmount != commission.InitialCommissionAmount;

    if (this._commissionInfo.hasBSMV) {
      if (this.state._bsmvIncluded) {
        this.setState({
          _bsmvAmount: Math.round(((this._commissionInfo.amount * this._bsmvRatio) / (1 + this._bsmvRatio))*100)/100,
          _commissionAmount: Math.round((this._commissionInfo.amount / (1 + this._bsmvRatio))*100)/100
        });
      }
      else {
        this.setState({
          _bsmvAmount: Math.round(((this._commissionInfo.amount * this._bsmvRatio))*100)/100,
          _commissionAmount: Math.round((this._commissionInfo.amount)*100)/100
        });
      }
    }
    else
      this.setState({ _commissionAmount: this._commissionInfo.amount });

    // previousRequestedCommissionAmount = commission.CommissionInfo.RequestedCommissionAmount;
    this._commissionInfo.requestedCommissionAmount = this.state._requestedCommissionAmount;

    /* Eklenecekler
    GetRequestedCommissionAmountWithoutIncentive();
    //Tutar değişince eğer taksit varsa bu bilgiler de güncellenmelidir.
    CalculateInstalmentAmount();
    GetFirstInstallmentInfo();
     */
  }
  convertToFECAmount(response) {
    if (this._commissionInfo.commissionDefinitionFEC == this.state._requestedCommissionFEC) {
      this.state._requestedCommissionFER = 1;
      this._commissionInfo.requestedCommissionFER = this.state._requestedCommissionFER;
      this._commissionInfo.requestedCommissionBaseFEC = this._commissionInfo.commissionDefinitionFEC;
      return this.state._requestedCommissionAmount;
    }
    if (response == null) {
      var request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.FXEngineRequest',
        requestBody: {
          MethodName: 'GetFXRate',
          AccountNumber: this.state._accountNumber == null ? 0 : this.state._accountNumber,
          FEC1: this._commissionInfo.commissionDefinitionFEC,
          FEC2: this.state._requestedCommissionFEC,
          IsEffectiveTransaction: false,
          TranAmount: this.state._requestedCommissionAmount,
          ResourceCode: null,
          IsReverseTransaction: false,
          FXKey: 0,
          MaturityDate: this.props.context.applicationContext.channel.today,
          JournalBusinessKey: null,
          IsForward: false,
          IsForwardMaturityDateShifting: false,
        },
        key: 'GetFXRate'
      };
      this.proxyExecute(request);
    }
    else {
      if (!response.success || response.value == null) {
        // BDialogBox.Show(BOA.Messaging.MessagingHelper.GetMessage("BusinessComponents", "CouldNotRateTransformation"), DialogTypes.Error, responseConvert.Results);
        this._commissionInfo.requestedCommissionFER = 1;
        this._commissionInfo.requestedCommissionFER = this.state._requestedCommissionFER;
        this._commissionInfo.requestedCommissionBaseFEC = this._commissionInfo.commissionDefinitionFEC;
        this.setState({ _fECAmount: 0});
      }

      this.setState({ _requestedCommissionFER: response.value.tranFXRate });
      this._commissionInfo.requestedCommissionBaseFEC = response.value.baseFEC;
      this._commissionInfo.requestedCommissionFER = this.state._requestedCommissionFER;
      this.setState({ _fECAmount:  Math.round((response.value.feC2TranAmount)*100)/100});
    }
  }

  convertToRequestedAmount(amount)
  {
    if (this._commissionInfo == null || this._commissionInfo == {})
      return 0;
    if (this._commissionInfo.requestedCommissionBaseFEC == this._commissionInfo.commissionDefinitionFEC)
    {
      if (this.state._requestedCommissionFER != 0)
        amount = amount / this.state._requestedCommissionFER;
    }
    else
      amount = amount * this.state._requestedCommissionFER;

    return Math.round(amount*100)/100;
  }
  
  controlMinMax(value) {
    // krediler grubunun isteği üzerine min-max tutar ın yanına min max oran getirildi.  
    // Eğer min commission oranı girilmiş ise min tutar ve girilen oran ile hesaplanan tutar bilgisinden 
    // hesaplanan tutar bilgisinden müşteri için iyisi hangisi ise o alınır.
    // alınan değer yeni min max commission tutarları belirler.
    if (this._commissionInfo == null || this._commissionInfo == {})
      return;

    if (this._commissionInfo.minCommissionRate != null)
    {
      var tmpMinAmount = (this._commissionInfo.minCommissionRate / 100) * this.state._transactionAmount * this.getCommissionCount();
      tmpMinAmount = (this._commissionInfo.hasBSMV && !this._commissionInfo.bSMVIncluded) ? Math.round((tmpMinAmount * (1 + this.state._bsmvRatio))*100)/100 : tmpMinAmount;

      if (tmpMinAmount > this._minCommissionAmountControlValue)
        this._minCommissionAmountControlValue = tmpMinAmount;
    }
    if (this._commissionInfo.maxCommissionRate != null)
    {
      var tmpMaxAmount = (this._commissionInfo.maxCommissionRate / 100) * this.state._transactionAmount * this.getCommissionCount();
      tmpMaxAmount = (this._commissionInfo.hasBSMV && !this._commissionInfo.bSMVIncluded) ? Math.round((tmpMaxAmount * (1 + this.state._bsmvRatio))*100)/100 : tmpMaxAmount;

      if (tmpMaxAmount < this._maxCommissionAmountControlValue)
        this._maxCommissionAmountControlValue = tmpMaxAmount;
    }

    if (this._maxCommissionAmountControlValue != null && value > this._maxCommissionAmountControlValue)
      value = this._maxCommissionAmountControlValue;
    else if (this._minCommissionAmountControlValue != null && value < this._minCommissionAmountControlValue)
      value = this._minCommissionAmountControlValue;
    
    return value;
  }
  // #endregion Amount Methods

  /**
   * Set Requested Commission Amount
   * @param {any} amount
   */
  setRequestedCommissionAmount(amount) {
    this.setState({_requestedCommissionAmount: amount});
  }

   /**
   * Set Transaction Amount
   * @param {any} amount
   */
  setTransactionAmount(amount) {
    this.setState({_transactionAmount: amount});
  }    

  /**
   * Set AccountNumber
   * @param {any} accnum
   */
  setAccountNumber(accnum) {
    this.setState({_accountNumber: accnum});
  } 

   /**
   * Set CommissionBaseCount
   * @param {any} count
   */
  setCommissionBaseCount(count) {
    this.setState({_commissionBaseCount: count});
  } 

  /**
   * Returns the CommissionInfo
   * @returns {commissionInfo: any} 
   */
  getCommissionInfo() {
    return this._commissionInfo;
  }
  // #endregion Methods


  render() {
    let valueCommissionRate         : any = this.state._commissionRate;
    let valueRequestedCommissionFEC : any = this.state._requestedCommissionFEC;
    let valueFECAmountCurrencyCode  : any = this.state._fECAmountCurrencyCode;
    let valueFECAmount              : any = this.state._fECAmount;
    return (
      <div>
        <div ref={r => this.paymentInfo = r}>
          <div ref={r => this.paymentInfoOptionsDiv = r}>
            <BTabBar
              ref={r => this.paymentInfoOptions = r}
              context={this.props.context}
              onChange={this.handlePaymentInfoChange.bind(this)}
              tabItems={[
                { 'text': this.getMessage('BusinessComponents', 'Safe'), 'value': 0 }, // 'Kasa'
                { 'text': this.getMessage('BusinessComponents', 'Account'), 'value': 1 } // 'Hesap'
              ]}
              mode='secondary'
              centerTabs={true}
              value={this._isAccountOptionChecked == true ? 1 : 0}
            />
          </div>
          <BAccountComponent context={this.props.context}
            ref={r => this.controlAccountComponent = r}
            disabled={this.state._ispaymentInfoDisabled}
            fECGroupList={this.props.accountComponentFECGroupList}
            fECList={this.props.accountComponentFECList}
            fEC={this.props.fEC}
            isCustomerMernisVerified={this.props.isCustomerMernisVerified}
            accountNumber={this.state._accountNumber}
            accountSuffix={this.state._accountSuffix}
            onCustomerSelect={this.handleCustomerSelect.bind(this)}
            onAccountSelect={this.handleAccountSelect.bind(this)}
            onCustomerNotFound={this.handleCustomerNotFound.bind(this)}
            productTypeList={this.props.accountComponentProductTypeList}
            minBalanceFilter={this.props.accountComponentMinBalanceFilter}
            isAccountComponentAccountNumberReadonly={this.props.isAccountComponentAccountNumberReadonly}
            showDialogMessages={this.props.showAccountComponentDialogMessages}
            showBlackListDialogMessages={this.props.showAccountComponentBlackListDialogMessages}
            showCustomerBranchAccountMessage={this.props.showAccountComponentCustomerBranchAccountMessage}
            showCustomerRecordingBranchWarning={this.props.showAccountComponentCustomerRecordingBranchWarning}
            showMernisServiceHealtyDialogMessage={this.props.showAccountComponentMernisServiceHealtyDialogMessage}
            showTaxNumberAndMernisVerifiedDialogMessage={this.props.showAccountComponentTaxNumberAndMernisVerifiedDialogMessage}
            isVisibleAccountSuffix={this.props.accountComponentIsVisibleAccountSuffix}
            isVisibleIBAN={this.props.accountComponentIsVisibleIBAN}
            isVisibleBalance={this.props.accountComponentIsVisibleBalance}
            isVisibleAccountInfo={this.props.accountComponentIsVisibleAccountInfo}
            isVisibleTaxNumber={this.props.accountComponentIsVisibleTaxNumber}
            isVisibleLedger={this.props.accountComponentIsVisibleLedger}
            isDisableAccountNumber={this.props.accountComponentIsDisableAccountNumber}
          />
        </div>

        <div ref={r => this.commissionInfo = r}>

          <BInput context={this.props.context} // 'Komisyon Oranı'
            ref={r => this.commissionRate = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'CommissionRate_2')}
            value={valueCommissionRate}
            disabled={this.state._iscommissionInfoDisabled || this.props.isCommissionRateReadonly}
            onChange={this.handleCommissionRateChange.bind(this)}
          />
          
          <BInput context={this.props.context} // 'Özel Komisyon Oranı'
            ref={r => this.specialCommissionRate = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'SpecialCommissionRate')}
            value={this.state._specialCommissionRate}
            disabled={true}
          />

          <BMoney context={this.props.context} // 'Komisyon Tutarı'
            ref={r => this.commissionAmount = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'CommissionAmount')}
            totalValue={this.state._commissionAmount}
            disabled={true}
            showBankNoteButton={false}
            FEC={this.state._currencyCode}
          />

          <BCheckBox context={this.props.context} // 'BSMV İçinden'
            ref={r => this.bsmvChkbx = r}
            label={this.getMessage('BusinessComponents', 'BSMVInside')}
            disabled={true}
            checked={this.state._bsmvIncluded}
          />

          <BMoney context={this.props.context} // 'BSMV'
            ref={r => this.bsmv = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'BSMV')}
            totalValue={this.state._bsmvAmount}
            FEC={this.state._currencyCode}
            disabled={true}
            showBankNoteButton={false}
          />

          <BMoney context={this.props.context} // 'Hesaplanan Tutar'
            ref={r => this.autoCalculatedAmount = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'CalculatedTotalAmount')}
            disabled={true}
            FEC={this.state._currencyCode}
            totalValue={this.state._autoCalculatedAmount}
            showBankNoteButton={false}
          />

          <BFECComponent context={this.props.context} // 'Döviz Cinsi'
            ref={r => this.controlFEC = r}
            labelText={this.getMessage('BusinessComponents', 'FEC')}
            isAllOptionIncluded={false}
            disabled={this.state._iscommissionInfoDisabled || !this.props.isFECListEnabled}
            fECGroupList={this.state._fECGroupList}
            selectedFECId={valueRequestedCommissionFEC}
            onFECSelect={this.handleSelectedFecChanged.bind(this)}
          />

          <BMoney context={this.props.context} // 'Döviz Tutarı'
            ref={r => this.controlFECAmount = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'FECAmount')}
            FEC={valueFECAmountCurrencyCode}
            onBlur={this.handleControlFECAmountChange.bind(this)}
            totalValue={valueFECAmount}
            disabled={this.state._iscommissionInfoDisabled || this.state._isCommissionAmountReadOnly}
            showBankNoteButton={false}
          />

          <BMoney context={this.props.context} // 'Alınacak Komisyon Tutarı'
            ref={r => this.controlRequestedCommissionAmount = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'RequestedTotalAmount')}
            FEC={this.state._currencyCode}
            onBlur={this.handleControlRequestedCommissionAmountChange.bind(this)}
            totalValue={this.state._requestedCommissionAmount}
            disabled={this.state._iscommissionInfoDisabled || this.state._isCommissionAmountReadOnly}
            showInfoButton={this.state._isAutoPriceEnabled}
            onInfoButtonClick={this.handleAutoPrice.bind(this)}
          />

          <BMoney context={this.props.context} // 'Küpür Bilgileri'
            ref={r => this.controlBanknoteInfo = r}
            floatingLabelText={this.getMessage('BusinessComponents', 'BanknoteInfo')}
            FEC={this.state._requestedCommissionFEC}
            totalValue={valueFECAmount}
            disabled={true}
            showBankNoteButton={true}
          />
          
          <BInput context={this.props.context} // Açıklama
            ref={r => this.controlDescription = r}
            onChange={this.handleDescriptionChange.bind(this)}
            type="text"
            floatingLabelText={this.getMessage('BusinessComponents', 'Description')}
            disabled={false}
            value={this.state._description}
            noWrap={false}
            maxLength={500} 
          />

          <BInput context={this.props.context} // Bilgilendirme
            ref={r => this.controlInformation = r}
            type="text"
            floatingLabelText={this.getMessage('BusinessComponents', 'Informing')}
            disabled={true}
            value={this.state._information}
            noWrap={false}
            />
        </div>
      </div>
    );
  }
}

export default BCommissionComponent;