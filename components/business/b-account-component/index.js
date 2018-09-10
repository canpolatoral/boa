import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import CustomerAccountSearchDialog from './customerAccountSearchDialog';
import StatusPanel from './statusPanel';
import CrossMarketingInfo from './crossMarketingInfo';
import { BBusinessComponent } from 'b-business-component';
import { BComponent, BThemeProvider, BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';
import { BLabel } from 'b-label';
import { BDialogHelper } from 'b-dialog-box';
import { BFormManager } from 'b-form-manager';
import { BInputAction } from 'b-input-action';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { BLocalization } from 'b-localization';
import { BBlackListComponent } from 'b-black-list-component';
import { BIcon } from 'b-icon';
import { BProgress } from 'b-progress';
import { BDevice } from 'b-device';
import { BInformationText } from 'b-information-text';

@BComponentComposer
export class BAccountComponent extends BBusinessComponent {
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    accountSuffix: null,
    accountNumber: null,
    isVisibleAccountSuffix: true,
    isVisibleBalance: true,
    isVisibleIBAN: true,
    isVisibleAccountInfo: true,
    isVisibleTaxNumber: true,
    isVisibleLedger: true,
    isDisableAccountNumber: false,
    onCustomerSelect: null,
    onCustomerNotFound: null,
    disabled: false,
    label: null,
   // errorText: null,

    fECList: [],
    fECListBanned: [],
    productCodeList: [],
    productCodeListBanned: [],
    productTypeList: [],
    productGroupList: [],

    allow18AgeControl: true,
    allowDoubleSignatureControl: true,
    allowSharedAccountControl: true,
    continueIfCustomerIsDead: true,
    continueIfCustomerIsPersonnel: true,
    continueIfCustomerMernisRegistrationOutOfDate: true,
    continueIfCustomerMernisUnVerify: true,
    continueIfCustomerTaxNumberUnVerify: true,
    showBlackListDialogMessages: true,
    showCustomerAddressAsToolTip: true,
    showCustomerBranchAccountMessage: true,
    showCustomerEmailAsToolTip: true,
    showCustomerGSMAsToolTip: true,
    showCustomerPhoneNumberAsToolTip: true,
    showCustomerRecordingBranchWarning: true,
    showDialogMessages: true,
    showTaxNumberAndMernisVerifiedDialogMessage: true,
    canCheckCustomerAgreementVersion: true,
    isBlackListInfoNeeded: true,
    isCrossMarketingEnable: true,
    showOrderReminder: true,
    useDefaultCustomerOnMernisControl: true,
    useDefaultPersonOnTaxNumberControl: true,
    isAccountSuffixAccountAliasVisible: true,
    isAccountSuffixBranchIdVisible: true,
    isAccountSuffixInternalPeriodEndVisible: false,
    isAccountSuffixLedgerIdVisible: true,
    isAccountSuffixListInMiniMode: false,
    isAccountSuffixMaturityEndVisible: false,
    isAccountSuffixProductNameVisible: true,
    isAccountSuffixProfitShareRatioVisible: true,
    isOpenDateVisible: false,
    isLastNetProfitVisible: false,
    isLastRenewedDateVisible: false,
    isMaturityInfoVisible: false,
    isAddressCheckNeeded: false,
    showMernisServiceHealtyDialogMessage: false,
    style: null,
    showNoAccountSuffixFoundWarningAndClearData: false,
    enableShowDialogMessagesInCallback: false
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    accountSuffix: PropTypes.number,
    accountNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultAccountNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isVisibleAccountSuffix: PropTypes.bool,
    isVisibleIBAN: PropTypes.bool,
    isVisibleBalance: PropTypes.bool,
    isVisibleAccountInfo: PropTypes.bool,
    isVisibleTaxNumber: PropTypes.bool,
    isVisibleLedger: PropTypes.bool,
    isDisableAccountNumber: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onKeyDown: PropTypes.func,
    onCustomerSelect: PropTypes.func,
    onCustomerNotFound: PropTypes.func,
    onAccountSelect: PropTypes.func,
    errorText: PropTypes.string,
    allow18AgeControl: PropTypes.bool,
    allowDoubleSignatureControl: PropTypes.bool,
    allowSharedAccountControl: PropTypes.bool,
    /* Bu özellikler atıl kaldı silinecek*/
    /* önce typingden kaldırılacak.*/
    blackListVerificationType: PropTypes.bool,
    /* Bu özellikler atıl kaldı silinecek*/

    canCheckCustomerAgreementVersion: PropTypes.bool,
    continueIfCustomerIsDead: PropTypes.bool,
    continueIfCustomerIsPersonnel: PropTypes.bool,
    continueIfCustomerMernisRegistrationOutOfDate: PropTypes.bool,
    continueIfCustomerMernisUnVerify: PropTypes.bool,
    continueIfCustomerTaxNumberUnVerify: PropTypes.bool,
    stateNo: PropTypes.number,
    stateNoList: PropTypes.arrayOf(PropTypes.number),
    status: PropTypes.number,
    useDefaultCustomerOnMernisControl: PropTypes.bool,
    useDefaultPersonOnTaxNumberControl: PropTypes.bool,
    isBlackListInfoNeeded: PropTypes.bool,
    isAllCreditCardNumberAccounts: PropTypes.bool,
    isInFreeZone: PropTypes.number,
    isEfficiencyInfoIncluded: PropTypes.bool,
    isAddressCheckNeeded: PropTypes.bool,
    isCrossMarketingEnable: PropTypes.bool,
    isAccountSuffixAccountAliasVisible: PropTypes.bool,
    isAccountSuffixBranchIdVisible: PropTypes.bool,
    isAccountSuffixInternalPeriodEndVisible: PropTypes.bool,
    isAccountSuffixLedgerIdVisible: PropTypes.bool,
    isAccountSuffixListInMiniMode: PropTypes.bool,
    isAccountSuffixMaturityEndVisible: PropTypes.bool,
    isAccountSuffixProductNameVisible: PropTypes.bool,
    isAccountSuffixProfitShareRatioVisible: PropTypes.bool,
    isOpenDateVisible: PropTypes.bool,
    isLastNetProfitVisible: PropTypes.bool,
    isLastRenewedDateVisible: PropTypes.bool,
    isMaturityInfoVisible: PropTypes.bool,
    accountActiveState: PropTypes.number,
    minBalanceFilter: PropTypes.number,
    // OrderByBranchNameAndAccountSuffix=0, OrderByAccountSuffix=1,OrderByBranchName=2,OrderByFEC=3,OrderByAvailableBalance=4
    accountOrder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    showDialogMessages: PropTypes.bool,
    showMernisServiceHealtyDialogMessage: PropTypes.bool,
    showTaxNumberAndMernisVerifiedDialogMessage: PropTypes.bool,
    showBlackListDialogMessages: PropTypes.bool,
    showCustomerAddressAsToolTip: PropTypes.bool,
    showCustomerBranchAccountMessage: PropTypes.bool,
    showCustomerEmailAsToolTip: PropTypes.bool,
    showCustomerGSMAsToolTip: PropTypes.bool,
    showCustomerPhoneNumberAsToolTip: PropTypes.bool,
    showCustomerRecordingBranchWarning: PropTypes.bool,
    showOrderReminder: PropTypes.bool,
    fECGroupList: PropTypes.array,
    fECList: PropTypes.array,
    fECListBanned: PropTypes.array,
    productCodeList: PropTypes.array,
    productCodeListBanned: PropTypes.array,
    productTypeList: PropTypes.array,
    productGroupList: PropTypes.array,
    removeAccountSuffixList: PropTypes.arrayOf(PropTypes.number),
    showNoAccountSuffixFoundWarningAndClearData: PropTypes.bool,
    /* True olduğunda dialog mesajlarını gösterme onAccountSelect'e callback olarak verilir. İstendiği zaman çağırılır.
     Bazı ekranlarda(örn NY) hesap seçildikten sonra request yapılıp dialog mesajlarına mesaj eklenmek isteniyor.
      Ancak request asenkron olduğu için bittiğinde dialog mesajları gösterilmiş oluyor */
    enableShowDialogMessagesInCallback: PropTypes.bool
  };

  static openCrossMarketingMessageList = [];
  processCount = 0;
  dialogMessages = [];
  branchList = [];

  informationLabelStyle: any = null;
  informationValueStyle: any = null;
  customerNameLabelStyle: any = null;
  informationRowStyle: any = null;

  state = {
    accountNumber: this.props.defaultAccountNumber || this.props.accountNumber || '',
    customerInfo: null,
    selectedAccount: null,
    accountList: [],
    errorText: null,
    selectedCriteriaIndex: 0,
    activeBranchName: null,
    showDialogMessages: this.props.showDialogMessages,
    suffixListVisible: false,
    renderCount: 1,
    hasInput: false
  };

  constructor(props, context) {
    super(props, context);
    this.currentProps = Object.assign({}, this.props);
  }

  /* ------------------------------------------------------------------------
	Buttons
----------------------------------------------------------------------------*/

  addActionButton = {
    dynamicIcon: 'AddCircleOutline',
    iconProperties: { color: 'primary' },
    onClick: () => {
      this.openCustomerAccountSearchDialog();
    }
  };

  searchActionButton = {
    bIcon: 'ArrowCircle',
    iconProperties: { folder: 'Others', color: 'primary' },
    onClick: () => {
      this.searchButtonClicked();
    }
  };

  clearActionButton = {
    dynamicIcon: 'Clear',
    iconProperties: { color: this.getTheme().boaPalette.base400 },
    onClick: () => {
      this.clearButtonClicked();
    }
  };

  customer360ActionButton = {
    dynamicIcon: 'Person',
    iconProperties: { color: this.getTheme().boaPalette.pri500 },
    onClick: () => {
      this.customer360ButtonClicked();
    }
  };

  loadingIcon = (
    <BProgress
      context={this.props.context}
      size={20}
      progressType={'circular'}
      mode={'indeterminate'}
      style={{
        color: this.props.context.theme.boaPalette.sec500,
        position: 'absolute',
        top: '30%',
        right: !this.props.context.localization.isRightToLeft ? '60px' : 'auto'
      }}
    />
  );

  /* ------------------------------------------------------------------------
	Gets methods
----------------------------------------------------------------------------*/

  getValue() {
    return {
      selectedAccount: this.state.selectedAccount,
      selectedCustomer: this.state.customerInfo,
      accountNumber: this.state.selectedAccount && this.state.selectedAccount.accountNumber,
      accountSuffix: this.state.selectedAccount && this.state.selectedAccount.accountSuffix,
      accountList: this.state.accountList,
      blackListVerificationType: this.blackListVerificationType
    };
  }

  getSnapshot() {
    return { state: this.state };
  }

  getTheme() {
    return this.props.context.theme;
  }

  getAccountNumber() {
    return this.accountInput ? this.accountInput.getValue() : this.accountInput.getInstance().getValue();
  }

  getBranchId() {
    return this.props.context.applicationContext.user.branchId;
  }

  // bu yöntem geçici olarak eklendi. Kullanmayınız.
  getMessageFromCode(code) {
    var arr = code.split('#');
    if (arr && arr.length == 2) return this.getMessage('BOA', arr[1]);
    else return code;
  }

  getActionList() {
    let isLoading = this.isLoading();
    if (isLoading) {
      return this.state.hasInput ? [{}, this.clearActionButton, this.searchActionButton] : [this.addActionButton];
    }
    return this.state.hasInput ? [this.clearActionButton, this.searchActionButton, this.addActionButton] : [this.addActionButton];
  }

  getUnsafeText(obj, length) {
    var returnObject = obj ? obj.toString() : '';
    if (returnObject.length > length) returnObject.substring(0, length);
    return returnObject;
  }

  getDateDiff(dateA, dateB) {
    var diffInMilliseconds = dateA - dateB;
    return {
      TotalSeconds: diffInMilliseconds / 1000,
      TotalMinutes: diffInMilliseconds / (1000 * 60),
      TotalHours: diffInMilliseconds / (1000 * 60 * 60),
      TotalDays: diffInMilliseconds / (1000 * 60 * 60 * 24)
    };
  }

  getAccountSuffixColumnSet() {
    var accountSuffixColumns = [
      { name: this.getMessage('BusinessComponents', 'AccountSuffix'), key: 'accountSuffix', resizable: true },
      { name: this.getMessage('BusinessComponents', 'Branch'), key: 'branchName', resizable: true }
    ];
    if (this.props.isAccountSuffixBranchIdVisible && !this.props.isAccountSuffixListInMiniMode)
      accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'BranchCodeLabel'), key: 'branchId', resizable: true });
    accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'ForeignExchangeType'), key: 'fecDesc', resizable: true });
    if (this.props.isAccountSuffixLedgerIdVisible && !this.props.isAccountSuffixListInMiniMode)
      accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'Account'), key: 'ledgerId', resizable: true });
    if (this.props.isAccountSuffixProductNameVisible)
      accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'ProductName'), key: 'productName', resizable: true });
    if (this.props.isAccountSuffixProductNameVisible && !this.props.isAccountSuffixListInMiniMode)
      accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'SegmentName'), key: 'segmentName', resizable: true });
    if (this.props.isAccountSuffixAccountAliasVisible)
      accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'AccountName'), key: 'accountAlias', resizable: true });
    if (this.props.isMaturityInfoVisible) {
      accountSuffixColumns.push({
        name: this.getMessage('BusinessComponents', 'MaturityEnd'),
        key: 'maturityEnd',
        resizable: true,
        type: 'date'
      });
      accountSuffixColumns.push({
        name: this.getMessage('BusinessComponents', 'InternalPeriodEnd'),
        key: 'internalPeriodEnd',
        resizable: true,
        type: 'date'
      });
    } else {
      if (this.props.isAccountSuffixMaturityEndVisible)
        accountSuffixColumns.push({
          name: this.getMessage('BusinessComponents', 'MaturityEnd'),
          key: 'maturityEnd',
          resizable: true,
          type: 'date'
        });
      if (this.props.isAccountSuffixInternalPeriodEndVisible)
        accountSuffixColumns.push({
          name: this.getMessage('BusinessComponents', 'InternalPeriodEnd'),
          key: 'internalPeriodEnd',
          resizable: true,
          type: 'date'
        });
    }
    if (this.props.isAccountSuffixProfitShareRatioVisible && !this.props.isAccountSuffixListInMiniMode)
      accountSuffixColumns.push({
        name: this.getMessage('BusinessComponents', 'ProfitShareRatio'),
        key: 'profitShareRatio',
        resizable: true
      });
    if (this.props.isOpenDateVisible)
      accountSuffixColumns.push({
        name: this.getMessage('BusinessComponents', 'OpenDate'),
        key: 'openDate',
        resizable: true,
        type: 'date'
      });
    if (this.props.isLastRenewedDateVisible)
      accountSuffixColumns.push({
        name: this.getMessage('BusinessComponents', 'RenewedDate'),
        key: 'lastRenewedDate',
        resizable: true,
        type: 'date'
      });
    if (this.props.isLastNetProfitVisible)
      accountSuffixColumns.push({ name: this.getMessage('BusinessComponents', 'NetProfit'), key: 'lastNetProfit', resizable: true });
    return accountSuffixColumns;
  }

  getIsCustomerTaxNumberVerified() {
    if (this.state.customerInfo == null) return false;
    else if (this.isCustomerTaxNumberVerified == null) return false;
    else return this.isCustomerTaxNumberVerified;
  }

  getIsMernisServiceHealty() {
    if (this.state.customerInfo == null) return false;
    else if (this.isMernisServiceHealty == null) return false;
    else return this.isMernisServiceHealty;
  }

  getIsCustomerMernisVerified() {
    if (this.state.customerInfo == null) return false;
    else if (this.isCustomerMernisVerified == null) return false;
    else return this.isCustomerMernisVerified;
  }

  getIsCustomerMernisRegistrationOutOfDate() {
    if (this.state.customerInfo == null) return false;
    else if (this.isCustomerMernisRegistrationOutOfDate == null) return false;
    else return this.isCustomerMernisRegistrationOutOfDate;
  }

  getAccountOrder(accountNumber, accountSuffix, selectAccountOrderResponse) {
    if (!selectAccountOrderResponse) {
      let request = {
        requestClass: 'BOA.Types.BusinessComponents.AccountHasOrderRequest',
        requestBody: {
          MethodName: 'Call',
          AccountNumber: accountNumber,
          AccountSuffix: accountSuffix
        },
        key: 'GET_ACCOUNT_ORDER',
        params: { accountNumber: accountNumber, accountSuffix: accountSuffix }
      };
      this.executer(request);
      return;
    }

    if (!selectAccountOrderResponse.success && !selectAccountOrderResponse.results.length > 0) {
      BFormManager.showStatusMessage(selectAccountOrderResponse.results[0].errorMessage);
    } else if (selectAccountOrderResponse.value) {
      this.addDialogMessage(
        false,
        this.getMessage('BusinessComponents', 'AccountNote_2') +
          ' ( ' +
          accountNumber +
          ' - ' +
          accountSuffix +
          ' ) :' +
          selectAccountOrderResponse.value
      );
    }
    this.onDialogMessagesShow(false);
  }

  getBalance(account, customerInfo, response) {
    let selectedCustomer = customerInfo.customerInfo;
    if (
      this.validateAccountNumber() &&
      account != null &&
      selectedCustomer != null &&
      this.hasGetBalancePermission(account, selectedCustomer)
    ) {
      if (!response) {
        var request = {
          requestClass: 'BOA.Types.BusinessComponents.AccountBalanceRequest',
          requestBody: {
            accountNumber: account.accountNumber,
            accountSuffix: account.accountSuffix,
            methodName: 'GetAccountBalance'
          },
          key: 'GET_ACCOUNT_BALANCE',
          params: {
            account: account,
            customerInfo: customerInfo
          }
        };

        this.executer(request);
        return;
      }

      if (response.success) {
        if (response.value != null) {
          account.balance = response.value.balance;
          account.withHoldingAmount = response.value.withholdingAmount;
          account.availableBalance = response.value.availableBalance;
          account.balanceDisplay = response.value.balanceDisplay;
          account.withHoldingAmountDisplay = response.value.withholdingAmountDisplay;
          account.availableBalanceDisplay = response.value.availableBalanceDisplay;
          account.availableBalanceWithoutKMH = response.value.availableBalanceWithoutKMH;
          account.availableBalanceWithoutKMHDisplay = response.value.availableBalanceWithoutKMHDisplay;
          // çeyrek altın için eklendi // todo şu an aciliyeti olmadığı için kapatıldı.
          // if (account.UnitMultiplier != 1 && account.UnitMultiplier != 0) {
          //   account.WithHoldingAmountDisplay = ConvertGramToQuantity(account.WithHoldingAmountDisplay, account.UnitMultiplier);
          //   account.AvailableBalanceDisplay = ConvertGramToQuantity(account.AvailableBalanceDisplay, account.UnitMultiplier);
          //   account.BalanceDisplay = ConvertGramToQuantity(account.BalanceDisplay, account.UnitMultiplier);
          //   account.AvailableBalanceWithoutKMHDisplay = ConvertGramToQuantity(account.AvailableBalanceWithoutKMHDisplay, account.UnitMultiplier);
          // }
        } else {
          account.balance = 0;
          account.withHoldingAmount = 0;
          account.availableBalance = 0;
          account.balanceDisplay = null;
          account.withHoldingAmountDisplay = null;
          account.availableBalanceDisplay = null;
          account.availableBalanceWithoutKMH = 0;
          account.availableBalanceWithoutKMHDisplay = null;
        }
      } else {
        BDialogHelper.show(
          this.props.context,
          this.getMessage('BusinessComponents', 'AccountComponentError'),
          BComponent.DialogType.Error,
          BComponent.DialogResponseStyle.OK,
          this.getMessage('BusinessComponents', 'Warning')
        );
      }

      this.afterGetBalance(account, customerInfo);
    } else {
      this.afterGetBalance(account, customerInfo);
    }
  }

  /* ------------------------------------------------------------------------
	Sets methods
----------------------------------------------------------------------------*/

  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  setAccountNumber() {
    if (this.isAccountNumberChanged()) {
      let currentAccountNumber = this.getAccountNumber();
      if (currentAccountNumber) {
        this.setState(
          {
            accountNumber: currentAccountNumber
          },
          this.searchButtonClicked
        );
      }
    }
  }

  setValues(accountNumber, defaultAccountSuffix, customerAllInfoResponse) {
    // let information = customerAllInfoResponse.value.customerInfo.customerName;
    // if (this.props.showCustomerPhoneNumberAsToolTip && !customerAllInfoResponse.value.customerInfo.phoneNumber)
    //   information = information + '\r\n' + customerAllInfoResponse.value.customerInfo.phoneNumber;
    // if (this.props.showCustomerGSMAsToolTip && !customerAllInfoResponse.value.customerInfo.defaultGSM)
    //   information = information + '\r\n' + +customerAllInfoResponse.value.customerInfo.defaultGSM;
    // if (this.props.showCustomerEmailAsToolTip && !customerAllInfoResponse.value.customerInfo.defaultEMail)
    //   information = information + '\r\n' + +customerAllInfoResponse.value.customerInfo.defaultEMail;
    // if (this.props.showCustomerAddressAsToolTip && !customerAllInfoResponse.value.customerInfo.defaultAddress)
    //   information = information + '\r\n' + +customerAllInfoResponse.value.customerInfo.defaultAddress;

    var accountList = this.filterListSortList(customerAllInfoResponse.value.accountList, this.props.productTypeList);

    if (accountList.length > 0) {
      this.arrangeBalancePropertiesAndBalanceFields(accountList, customerAllInfoResponse.value.customerInfo);
    }

    this.state.accountList = cloneDeep(accountList);

    var suffix = null;
    if (defaultAccountSuffix) {
      suffix = defaultAccountSuffix;
    } else if (this.props.accountSuffix) {
      suffix = this.props.accountSuffix;
    } else if (accountList.length > 0) {
      for (var index = 0; index < accountList.length; index++) {
        var element = accountList[index];
        if (element.branchId == this.getBranchId()) {
          suffix = element.accountSuffix;
          break;
        }
      }
      if (suffix == null) {
        suffix = accountList[0].accountSuffix;
        if (this.props.showCustomerBranchAccountMessage) {
          this.addDialogMessage(false, this.getMessage('BusinessComponents', 'CustomerBranchAccountWarning'));
        }
      }
    } else {
      suffix = null;
    }

    var selectedAccount = null;
    if (suffix == null) {
      selectedAccount = null;
    } else {
      for (var i = 0; i < this.state.accountList.length; i++) {
        var account = cloneDeep(this.state.accountList[i]);
        if (account.accountSuffix == suffix) {
          selectedAccount = account;
          break;
        }
      }
    }

    if (selectedAccount != null && this.props.showNoAccountSuffixFoundWarningAndClearData) {
      var suffixListExists = accountList != null && accountList.length > 0;
      if (!suffixListExists) {
        this.addDialogMessages(false, this.getMessage('BusinessComponents', 'NoSuffixFound'));
      }
    }

    this.getBalance(selectedAccount, customerAllInfoResponse.value);

    if (this.props.isCrossMarketingEnable) this.showCrossMarketingInfo();
  }

  setCustomerBranchName(selectedAccount, selectBranchResponse) {
    if (this.state.customerInfo != null) {
      var branchName = null;
      if (this.branchList.length == 0) {
        if (!selectBranchResponse) {
          let request = {
            requestClass: 'BOA.Types.Kernel.BusinessHelper.BranchRequest',
            requestBody: {
              methodName: 'GetAllBranches'
            },
            key: 'GET_ALL_BRANCHES',
            params: { selectedAccount: selectedAccount }
          };

          this.executer(request);
          return;
        }

        if (!selectBranchResponse.success && !selectBranchResponse.results.length > 0) {
          BFormManager.showStatusMessage(selectBranchResponse.results[0].errorMessage);
          this.afterSetCustomerBranchName(selectedAccount);
          return;
        }

        this.branchList = selectBranchResponse.value;
        for (let index = 0; index < this.branchList.length; index++) {
          if (this.branchList[index].branchId == this.state.customerInfo.branchid) {
            branchName = this.branchList[index].name;
            break;
          }
        }

        if (branchName == null && this.props.showCustomerRecordingBranchWarning) {
          this.addDialogMessage(
            false,
            this.state.customerInfo.branchid + ' ' + this.getMessage('BusinessComponents', 'RecordingBranchIdWarning')
          );
        }
        this.setState({ activeBranchName: branchName }, this.afterSetCustomerBranchName(selectedAccount));
      } else {
        for (let index = 0; index < this.branchList.length; index++) {
          if (this.branchList[index].branchId == this.state.customerInfo.branchid) {
            branchName = this.branchList[index].name;
            break;
          }
        }
        if (branchName == null && this.props.showCustomerRecordingBranchWarning)
          this.addDialogMessage(
            false,
            this.state.customerInfo.branchid + ' ' + this.getMessage('BusinessComponents', 'RecordingBranchIdWarning')
          );
        this.setState({ activeBranchName: branchName }, this.afterSetCustomerBranchName(selectedAccount));
      }
    } else {
      this.setState({ activeBranchName: branchName }, this.afterSetCustomerBranchName(selectedAccount));
    }
  }

  /* ------------------------------------------------------------------------
	Is methods
--------------------------------------------------------------------------*/

  isInBlackList(accountNumber, defaultAccountSuffix, customerAllInfoResponse) {
    this.blackListVerificationType = 0;
    if (
      customerAllInfoResponse == null ||
      !this.props.showBlackListDialogMessages ||
      customerAllInfoResponse.value.customerInfo.isInBlackList == false
    ) {
      // Kara liste kontrolü yapma.
      this.setValues(accountNumber, defaultAccountSuffix, customerAllInfoResponse);
      return;
    }
    if (customerAllInfoResponse.value.customerInfo.isInBlackList) {
      this.tempData = {
        accountNumber: accountNumber,
        defaultAccountSuffix: defaultAccountSuffix,
        customerAllInfoResponse: customerAllInfoResponse
      };
      this.addDialogMessage(false, this.getMessage('BusinessComponents', 'CustomerInBlackList'));
      this.showBlackListDialog(accountNumber, customerAllInfoResponse.value.customerInfo.blackListInfo);
    }
  }

  isCustomerVerified(contract) {
    if (contract.individualStatus == 'KapaliOlum') {
      if (this.props.continueIfCustomerIsDead) return true;
      else return false;
    }
    if (this.isCustomerTaxNumberVerified || this.props.continueIfCustomerTaxNumberUnVerify) {
      if (this.isCustomerMernisVerified || this.props.continueIfCustomerMernisUnVerify) {
        if (this.isCustomerMernisRegistrationOutOfDate == false || this.props.continueIfCustomerMernisRegistrationOutOfDate) {
          return true;
        } else {
          if (this.isMernisServiceHealty == false) return true;
          else return false;
        }
      } else {
        if (this.isMernisServiceHealty == false) return true;
        else return false;
      }
    } else {
      return false;
    }
  }

  isAccountNumberChanged() {
    let oldAccountNumber = this.state.accountNumber;
    let currentAccountNumber = this.getAccountNumber();
    if (currentAccountNumber) {
      return oldAccountNumber !== currentAccountNumber;
    }
    if (!currentAccountNumber && oldAccountNumber) {
      return true;
    }
    return false;
  }

  isLoading() {
    return this.processCount !== 0;
  }

  /* ------------------------------------------------------------------------
	Events 
--------------------------------------------------------------------------*/

  handleOnTextChange(value) {
    let hasInput = value && value > 0 ? true : false;
    if (hasInput) {
      // 1 defa render etsin
      if (!this.state.hasInput) {
        this.setState({
          hasInput: true,
          accountNumber: value
        });
      }
    } else {
      this.setState({
        hasInput: false,
        accountNumber: null
      });
    }
  }

  handleClose(dialogResponse, data) {
    if (data == null) {
      return;
    }

    this.initializeState();
    this.search(data.accountNumber, data.accountSuffix);
  }

  handleBlackListClose(dialogResponse) {
    if (dialogResponse == BComponent.DialogResponse.CANCEL) {
      this.setState({ accountNumber: '' });
    } else {
      this.setValues(this.tempData.accountNumber, this.tempData.defaultAccountSuffix, this.tempData.customerAllInfoResponse);
      if (dialogResponse == BComponent.DialogResponse.OK) {
        this.blackListVerificationType = 1;
      } else {
        this.blackListVerificationType = 0;
      }
    }
  }

  handleOnAccountSelect(index) {
    if (index > -1) {
      var account = cloneDeep(this.state.accountList[index]);
      this.setState({ selectedAccount: account }, () => {
        this.onAccountSelect(account);
      });
    }
  }

  handleCrossMarketingClose() {
    if (this.crossMarketingData) {
      BAccountComponent.openCrossMarketingMessageList = BAccountComponent.openCrossMarketingMessageList.filter(
        c =>
          c.UserId != this.crossMarketingData.UserId &&
          c.ChannelId != this.crossMarketingData.ChannelId &&
          c.ResourceCode != this.crossMarketingData.ResourceCode &&
          c.AccountNumber != this.crossMarketingData.AccountNumber
      );
    }
  }

  onCustomerSelect(value) {
    if (this.props.onCustomerSelect) {
      this.props.onCustomerSelect(value);
    }
  }

  onDialogMessagesShow(showOnlySuffixMessages) {
    if (showOnlySuffixMessages) return;
    if (this.dialogMessages.length == 0) return;

    let arrayText = [];
    for (var index = 0; index < this.dialogMessages.length; index++) {
      var element = this.dialogMessages[index];
      arrayText.push(element.message + '<br />'); 
    }

    BDialogHelper.show(
      this.props.context,
      arrayText,
      BComponent.DialogType.WARNING,
      BComponent.DialogResponseStyle.OK,
      this.getMessage('BusinessComponents', 'Warning')
    );
    // this.dialogMessages = [];
  }

  onCustomerNotFound() {
    if (this.props.onCustomerNotFound) {
      this.props.onCustomerNotFound();
    }
    this.resetValue();
  }

  onAccountSelect(selectedAccount) {
    if (this.state.showDialogMessages && selectedAccount != null && selectedAccount.hasBalanceDisplayConstraint == true) {
      var sb =
        '( ' +
        selectedAccount.accountNumber +
        ' - ' +
        selectedAccount.accountSuffix +
        ' ) ' +
        this.getMessage('BusinessComponents', 'HasAccountBalanceDisplayConstraintWarning');
      this.addDialogMessage(true, sb);
    }

    this.setCustomerBranchName(selectedAccount);
  }

  /* ------------------------------------------------------------------------
	Methods
--------------------------------------------------------------------------*/

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    this.processCount--;

    switch (key) {
      case 'GET_ACCOUNT_NUMBER_LIST_BY_TAX_OR_TCNUMBER': {
        this.searchButtonClicked(response);
        break;
      }
      case 'CHECK_SELF_ACCOUNT_NUMBER': {
        this.search(params.customerNumber, params.defaultAccountSuffix, response);
        break;
      }
      case 'GET_ALL_CUSTOMER_INFO': {
        this.executeSearch(params.customerNumber, params.defaultAccountSuffix, response);
        break;
      }
      case 'SHOW_CROSS_MARKETING_INFO': {
        this.showCrossMarketingInfo(response);
        break;
      }
      case 'GET_ACCOUNT_BALANCE': {
        this.getBalance(params.account, params.customerInfo, response);
        break;
      }
      case 'GET_ALL_BRANCHES': {
        this.setCustomerBranchName(params.selectedAccount, response);
        break;
      }
      case 'GET_ACCOUNT_ORDER': {
        this.getAccountOrder(params.accountNumber, params.accountSuffix, response);
        break;
      }
      default:
        break;
    }

    this.processCount === 0 ? this.setState({ renderCount: this.state.renderCount ? this.state.renderCount + 1 : 1 }) : null;
  }

  executer(request) {
    this.processCount++;
    this.proxyExecute(request);
  }

  openCustomerAccountSearchDialog() {
    let dialog = (
      <CustomerAccountSearchDialog
        context={this.props.context}
        onClosing={this.handleClose.bind(this)}
        fECList={this.props.fECList}
        fECListBanned={this.props.fECListBanned}
        productCodeList={this.props.productCodeList}
        productCodeListBanned={this.props.productCodeListBanned}
        productTypeList={this.props.productTypeList}
        productGroupList={this.props.productGroupList}
        ref={r => (this.customerAccountSearchDialog = r)}
      />
    );
    BDialogHelper.showWithResourceCode(this.props.context, 'IBLRMSHSAR', dialog, 0, 0, null, this.handleClose.bind(this));
  }

  searchButtonClicked(response) {
    if (!response) {
      var searchText = this.getAccountNumber();
      // this.state.accountNumber = searchText;
      // this.state.customerInfo = null;
      // this.state.selectedAccount = null;
      // this.state.errorText = null;
      // this.state.accountList = [];

      if (searchText.length == 0) {
        this.setState({ errorText: this.getMessage('BusinessComponents', 'PleaseEnterSearchValue'), accountNumber: searchText }, () => {
          this.onCustomerNotFound();
        });
        return false;
      }

      //	If text.length > 9 means user entered TCKN or TaxNumber
      if (searchText.length > 9) {
        let request = {
          requestClass: 'BOA.Types.BusinessComponents.AccountComponentCustomerAllInfoRequest',
          requestBody: {
            MethodName: 'GetAccountNumberListByTaxOrTcNumber',
            TaxOrTcNumber: searchText + ''
          },
          key: 'GET_ACCOUNT_NUMBER_LIST_BY_TAX_OR_TCNUMBER'
        };
        this.executer(request);
      } else {
        this.search(searchText, null);
      }
      return;
    }

    if (response.value) {
      searchText = response.value[0];
      this.search(searchText, null);
    } else {
      this.setState({ errorText: this.getMessage('BusinessComponents', 'PleaseEnterSearchValue'), accountNumber: searchText }, () => {
        this.onCustomerNotFound();
        BDialogHelper.show(
          this.props.context,
          this.getMessage('BusinessComponents', 'CustomerNotFound'),
          BComponent.DialogType.Error,
          BComponent.DialogResponseStyle.OK,
          this.getMessage('BusinessComponents', 'CustomerNotFound')
        );
      });
    }
  }

  clearButtonClicked() {
    //  this.resetValue();
    this.onCustomerNotFound();
    this.processCount = 0;
  }

  customer360ButtonClicked() {
    // TODO
  }

  search(customerNumber, defaultAccountSuffix, customerAllInfoResponse) {
    if (!customerAllInfoResponse) {
      let request = {
        requestClass: 'BOA.Types.BusinessComponents.AccountComponentCustomerAllInfoRequest',
        requestBody: {
          MethodName: 'CheckSelfAccountNumber',
          AccountNumber: customerNumber,
          MainAccountNumber: customerNumber
        },
        key: 'CHECK_SELF_ACCOUNT_NUMBER',
        params: { customerNumber: customerNumber, defaultAccountSuffix: defaultAccountSuffix }
      };
      this.executer(request);
      return;
    }

    if (!customerAllInfoResponse.success) {
      if (customerAllInfoResponse.results && customerAllInfoResponse.results.length > 0) {
        for (var i = 0; i < customerAllInfoResponse.results.length; i++) {
          if (customerAllInfoResponse.results[i].errorCode == 'AccountComponentSelfAccountError') {
            BFormManager.showStatusMessage(
              customerNumber.toString() + ' : ' + this.getMessage('BusinessComponents', 'AccountComponentSelfAccountError')
            );
            this.onCustomerNotFound();
            return;
          }
        }
      }
      this.onCustomerNotFound();
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'AccountComponentError'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK,
        this.getMessage('BusinessComponents', 'Warning')
      );
      return;
    }
    this.executeSearch(customerNumber, defaultAccountSuffix);
  }

  executeSearch(customerNumber, defaultAccountSuffix, customerAllInfoResponse) {
    if (!customerAllInfoResponse) {
      this.dialogMessages = [];

      var stateNoList = this.props.stateNoList;
      if (stateNoList == null) stateNoList = this.props.stateNo ? [this.props.stateNo] : [];

      if (this.state.customerInfo && this.state.customerInfo.customerid == customerNumber) {
        // prevent round-trip
        return;
      }

      var checkCustomerAgreementVersion = this.checkAgreementAvailable
        ? this.checkAgreementAvailable && this.props.canCheckCustomerAgreementVersion
        : this.props.canCheckCustomerAgreementVersion;
      var requestBody = {
        AccountNumber: customerNumber,
        StateNoList: stateNoList,
        Status: this.props.status,
        UseDefaultPersonOnMernisControl: this.props.useDefaultCustomerOnMernisControl,
        UseDefaultPersonOnTaxNumberControl: this.props.useDefaultPersonOnTaxNumberControl,
        IsBlackListInfoNeeded: this.props.isBlackListInfoNeeded,
        //	ResourceCode: ParentForm!: null? ParentForm.ResourceInfo.ResourceCode : null,
        //	BranchId: this.getBranchRequestParameter(),
        CreditCardNumber: this.props.creditCardNumber,
        IsAllCreditCardNumberAccounts: this.props.isAllCreditCardNumberAccounts,
        IsInFreeZone: this.props.isInFreeZone,
        ActiveType: this.props.accountActiveState,
        CheckCustomerAgreementVersion: checkCustomerAgreementVersion,
        FECGroupList: this.props.fECGroupList,
        FECList: this.props.fECList,
        FECListBanned: this.props.fECListBanned,
        ProductCodeList: this.props.productCodeList,
        ProductCodeListBanned: this.props.productCodeListBanned,
        ProductGroupList: this.props.productGroupList,
        MinBalanceFilter: this.props.minBalanceFilter,
        MethodName: 'GetAllCustomerInfo',
        MainAccountNumber: customerNumber,
        IsEfficiencyInfoIncluded: this.props.isEfficiencyInfoIncluded,
        IsAddressCheckNeeded: this.props.isAddressCheckNeeded
      };

      let request = {
        requestClass: 'BOA.Types.BusinessComponents.AccountComponentCustomerAllInfoRequest',
        requestBody: requestBody,
        key: 'GET_ALL_CUSTOMER_INFO',
        params: {
          customerNumber: customerNumber,
          defaultAccountSuffix: defaultAccountSuffix
        }
      };
      this.executer(request);
      return;
    }

    if (!customerAllInfoResponse.success && customerAllInfoResponse.results.length > 0) {
      this.onCustomerNotFound();
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'AccountComponentError'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK,
        this.getMessage('BusinessComponents', 'Warning')
      );
      return;
    }

    this.searchFinished(customerNumber, defaultAccountSuffix, customerAllInfoResponse);
  }

  searchFinished(accountNumber, defaultAccountSuffix, customerAllInfoResponse) {
    //	Çalışanın kendi ortak hesapları üzerinde işlem yapmaması gerekiyor, teftiş bulgusu.(mesutg)
    for (let i = 0; i < customerAllInfoResponse.results.length; i++) {
      if (customerAllInfoResponse.results[i].errorCode == this.getMessage('BusinessComponents', 'AccountComponentSelfSharedAccountError')) {
        BFormManager.showStatusMessage(
          accountNumber.toString() + ' : ' + this.getMessage('BusinessComponents', 'AccountComponentSelfSharedAccountError')
        );
        this.onCustomerNotFound();
        return;
      }
    }
    //	Müşteri bulunamadı
    if (customerAllInfoResponse.value.customerInfo == null) {
      BFormManager.showStatusMessage(accountNumber.toString() + ' : ' + this.getMessage('BusinessComponents', 'CustomerNotFound'));
      this.onCustomerNotFound();
      return;
    }
    //	Personel hesapları görülemez
    if (
      customerAllInfoResponse.value.customerInfo != null &&
      customerAllInfoResponse.value.customerInfo.isEmployee &&
      !this.props.continueIfCustomerIsPersonnel
    ) {
      BFormManager.showStatusMessage(this.getMessage('BusinessComponents', 'CustomerIsPersonnelMessage'));
      this.onCustomerNotFound();
      return;
    }
    //	Komisyon Sözleşme Kontrolü
    var agreementInfo = customerAllInfoResponse.value.agreementVersionInfo;
    if (this.state.showDialogMessages && agreementInfo != null && agreementInfo.severity == 0) {
      var sb = this.getMessage('BusinessComponents', 'CustomerAgreementVersionWarning') + '\n' + agreementInfo.message;
      BDialogHelper.show(
        this.props.context,
        sb,
        BComponent.DialogType.Warning,
        BComponent.DialogResponseStyle.OK,
        this.getMessage('BusinessComponents', 'Warning')
      );
      this.onCustomerNotFound();
      return;
    }
    //	Adres Kotrolü
    if (customerAllInfoResponse.value.customerAddressQueryList && customerAllInfoResponse.value.customerAddressQueryList.length > 0) {
      // var sb2 = this.getMessage('BusinessComponents', 'MernisAddressWarning');BOAda dialog ile gösterilen mesajlara style verilip bold vs yapılabiliyor.
      // TO DO BOA One da bu yok. yapılana kadar bu mesaj hard coded verilecektir.
      var sb2 =
        "Aşağıdaki kişi/kişilerin Mernis'ten gelen adresleri değişmiştir. İşlem yapan kişi müşterinin kendisi ise Gerçek Kişi Tanımlama ekranından ev adreslerini güncelleyiniz.";
      for (let i = 0; i < customerAllInfoResponse.value.customerAddressQueryList.length; i++) {
        sb2 =
          sb2 +
          '\n' +
          customerAllInfoResponse.value.customerAddressQueryList[i].personid +
          ' - ' +
          customerAllInfoResponse.value.customerAddressQueryList[i].personName;
      }
      BDialogHelper.show(
        this.props.context,
        sb2,
        BComponent.DialogType.Warning,
        BComponent.DialogResponseStyle.OK,
        this.getMessage('BusinessComponents', 'Warning')
      );
    }

    this.isCustomerMernisVerified = true;
    this.isCustomerTaxNumberVerified = true;
    this.isMernisServiceHealty = true;
    this.isCustomerMernisRegistrationOutOfDate = false;
    for (var index = 0; index < customerAllInfoResponse.results.length; index++) {
      // getmessagecode yazılana kadar errorcode u bu şekilde kontrol edelim.
      if (customerAllInfoResponse.results[index].errorCode == '70366#CustomerMernisVerificationError') {
        this.isCustomerMernisVerified = false;
      }
      if (customerAllInfoResponse.results[index].errorCode == '70367#CustomerTaxNumberVerificationError') {
        this.isCustomerTaxNumberVerified = false;
      }
      if (customerAllInfoResponse.results[index].errorCode == this.getMessage('BOA', 'Constants.MernisServiceUnHealty')) {
        this.isMernisServiceHealty = false;
      }
    }

    if (customerAllInfoResponse.value.customerInfo.systemRegistrationDate) {
      var diff = this.getDateDiff(Date.now(), customerAllInfoResponse.value.customerInfo.systemRegistrationDate);
      this.isCustomerMernisRegistrationOutOfDate = diff.TotalDays > 180;
      //	= (((TimeSpan)(DateTime.Now - result.Value.CustomerInfo.SystemRegistrationDate)).TotalDays > MernisRegistrationDateControlDayCount);
    }

    var customerInfo = customerAllInfoResponse.value.customerInfo;
    if (customerInfo.individualStatus == 'KapaliOlum')
      customerAllInfoResponse.results.push({ errorCode: customerInfo.individualStatusInfo });
    if (this.state.showDialogMessages == true) {
      if (customerInfo.isInLegitimateProceeding == true)
        customerAllInfoResponse.results.push({ errorCode: this.getMessage('BusinessComponents', 'LegitimateProceedingWarning') });
      if (this.props.allowDoubleSignatureControl && customerInfo.personType == 1 && customerInfo.authorizationType == 2)
        customerAllInfoResponse.results.push({ errorCode: this.getMessage('BusinessComponents', 'DoubleSignatureControlWarning') });
      if (this.props.allowSharedAccountControl && customerInfo.sharedCustomerType == 1)
        customerAllInfoResponse.results.push({ errorCode: this.getMessage('BusinessComponents', 'SharedAccountControlWarning1') });
      else if (this.props.allowSharedAccountControl && customerInfo.sharedCustomerType == 2)
        customerAllInfoResponse.results.push({ errorCode: this.getMessage('BusinessComponents', 'SharedAccountControlWarning2') });
      if (this.props.allow18AgeControl && customerInfo.isUnder18Age)
        customerAllInfoResponse.results.push({ errorCode: this.getMessage('BusinessComponents', 'EighteenAgeControlWarning') });
      //	if (customerInfo.RecordingChannel == BusinessComponentsConstants.YourBank) {
      //	customerAllInfoResponse.results.push({ errorCode: this.getMessage('BusinessComponents', 'CustomerYourBank') });
      //	}
      if (this.props.canCheckCustomerAgreementVersion) {
        let agreementInfo = customerAllInfoResponse.value.agreementVersionInfo;
        if (agreementInfo != null && agreementInfo.severity == 1) {
          customerAllInfoResponse.results.push({
            errorCode: this.getMessage('BusinessComponents', 'CustomerAgreementVersionWarning'),
            errorMessage: agreementInfo.message
          });
        }
      }
    }

    if (this.state.showDialogMessages == false || this.props.showTaxNumberAndMernisVerifiedDialogMessage == false) {
      if (this.isCustomerMernisVerified == false) {
        for (let index = 0; index < customerAllInfoResponse.results.length; index++) {
          var element = customerAllInfoResponse.results[index];
          if (element.errorCode == '70366#CustomerMernisVerificationError') {
            customerAllInfoResponse.results.splice(index, 1);
            index--;
          }
        }
      }
      if (this.isCustomerTaxNumberVerified == false) {
        for (let index = 0; index < customerAllInfoResponse.results.length; index++) {
          let element = customerAllInfoResponse.results[index];
          if (element.errorCode == '70367#CustomerTaxNumberVerificationError') {
            customerAllInfoResponse.results.splice(index, 1);
            index--;
          }
        }
      }
    }
    if (this.state.showDialogMessages == false || this.props.showMernisServiceHealtyDialogMessage == false) {
      //	if (this.isMernisServiceHealty == false)
      //	result.Results.Remove(result.Results.Find(x => x.errorCode == Constants.MernisServiceUnHealty));
    }

    if (customerAllInfoResponse.results.length > 0) {
      this.addDialogMessages(false, customerAllInfoResponse.results);
    }

    if (!this.isCustomerVerified(customerAllInfoResponse.value.customerInfo)) {
      this.onDialogMessagesShow(false);
      this.onCustomerNotFound();
      return;
    }

    this.isInBlackList(accountNumber, defaultAccountSuffix, customerAllInfoResponse);

    if (this.props.context.applicationContext.isBOALogin == true) {
      BDevice.transferToBOAContainer('FillCustomerPane', {
        AccountNumber: accountNumber,
        CustomerInfo: customerInfo
      });
    }
  }

  showBlackListDialog(accountNumber, blackListContract) {
    let dialog = (
      <BBlackListComponent
        context={this.props.context}
        isIndividual={blackListContract.isIndividual}
        blackListContract={blackListContract.isIndividual ? blackListContract.individualBlackList : blackListContract.corporateBlackList}
        fromAccountComponent={true}
        accountNumber={parseInt(accountNumber)}
        disableActions={this.props.isBlackListReadonly}
        ref={r => (this.blackListComponent = r)}
      />
    );
    BDialogHelper.showWithResourceCode(this.props.context, null, dialog, 0, 0, '', this.handleBlackListClose.bind(this));
  }

  afterGetBalance(account, customerInfo) {
    this.setState(
      {
        customerInfo: customerInfo.customerInfo,
        accountNumber: account ? account.accountNumber : customerInfo.customerInfo.customerid,
        selectedAccount: account,
        suffixListVisible: true
      },
      () => {
        this.onCustomerSelect(customerInfo);
        this.onAccountSelect(account);
      }
    );
  }

  hasGetBalancePermission(account, selectedCustomer) {
    // todo globalaccess
    if (selectedCustomer.isEmployee) {
      return false;
    }
    if (this.getBranchId() != null && account.BranchId != this.getBranchId() && account.ProductType == 2) {
      // BOA.Common.Constant.ProductGroups.Participation
      // if (!ApplicationContext.GlobalAccess.IsPermitted(GlobalAuthorizationConstants.BSKBGY))
      // {
      //     return false;
      // }
    }
    return true;
  }

  validateAccountNumber() {
    return this.state.accountNumber != null && this.state.accountNumber > 0;
  }

  arrangeBalancePropertiesAndBalanceFields(accountList, selectedCustomer) {
    // bu kontrolün burada olmaması lazım (coral)
    // todo globalaccess
    if (selectedCustomer.isEmployee) {
      accountList.forEach(item => {
        item.BalanceDisplay = null;
        item.WithHoldingAmountDisplay = null;
        item.AvailableBalanceDisplay = null;
      });
      return;
    }
  }

  filterListSortList(accountList, filterList) {
    if (accountList != null && this.props.removeAccountSuffixList) {
      for (var index = 0; index < accountList.length; index++) {
        var element = accountList[index];
        if (this.props.removeAccountSuffixList.includes(element.accountSuffix)) {
          accountList.splice(index, 1);
          index--;
        }
      }
    }

    //	Filter
    if (filterList != null && filterList.length > 0 && accountList != null && accountList.length > 0) {
      var newContractList = [];
      for (let index = 0; index < filterList.length; index++) {
        for (let indexAccount = 0; indexAccount < accountList.length; indexAccount++) {
          var accountListElement = accountList[indexAccount];
          if (accountListElement.productType == filterList[index]) {
            newContractList.push(accountListElement);
          }
        }
      }
      accountList = newContractList;
    }
    //	Sort
    if (accountList != null && accountList.length > 0) {
      if (this.props.accountOrder == 0 || this.props.accountOrder == 'OrderByBranchNameAndAccountSuffix') {
        //	OrderByBranchNameAndAccountSuffix
        accountList = accountList.sort(function(a, b) {
          return a.branchName - b.branchName;
        });
        accountList = accountList.sort(function(a, b) {
          return a.accountSuffix - b.accountSuffix;
        });
      } else if (this.props.accountOrder == 1 || this.props.accountOrder == 'OrderByAccountSuffix') {
        //	order by suffix
        accountList = accountList.sort(function(a, b) {
          return a.accountSuffix - b.accountSuffix;
        });
      } else if (this.props.accountOrder == 2 || this.props.accountOrder == 'OrderByBranchName') {
        //	OrderByBranchName
        var temp = [];
        for (let indexAccount = 0; indexAccount < accountList.length; indexAccount++) {
          let accountListElement = accountList[indexAccount];
          if (accountListElement.branchName == this.props.context.applicationContext.user.branchName) {
            temp.push(accountListElement);
          }
        }
        if (temp.length > 0) {
          var temp2 = [];
          for (let indexAccount = 0; indexAccount < accountList.length; indexAccount++) {
            let accountListElement = accountList[indexAccount];
            if (accountListElement.branchName != this.props.context.applicationContext.user.branchName) {
              temp2.push(accountListElement);
            }
          }
          temp2 = temp2.sort(function(a, b) {
            return a.branchName < b.branchName ? -1 : 1;
          });
          accountList = temp;
          if (temp2.length > 0) {
            temp2.forEach(function(element) {
              accountList.push(element);
            }, this);
          }
        }
      } else if (this.props.accountOrder == 3 || this.props.accountOrder == 'OrderByFEC') {
        //	OrderByFEC
        accountList = accountList.sort(function(a, b) {
          return a.fEC - b.fEC;
        });
      } else if (this.props.accountOrder == 4 || this.props.accountOrder == 'OrderByAvailableBalance') {
        //	OrderByAvailableBalance
        accountList = accountList.sort(function(a, b) {
          return a.availableBalance - b.availableBalance;
        });
      }
      //	AfterAccountListOrder(accountList);
    }
    return accountList == null ? null : accountList;
  }

  addDialogMessages(isSuffixMessage, messages) {
    for (var index = 0; index < messages.length; index++) {
      var element = messages[index];
      if (element.errorMessage) {
        var messsageFromCode = this.getMessageFromCode(element.errorCode);
        this.dialogMessages.push({
          errorCode: element.errorCode,
          message: messsageFromCode + '\n ' + element.errorMessage,
          isSuffixMessage: isSuffixMessage
        });
      } else {
        this.dialogMessages.push({ errorCode: element.errorCode, message: element.errorCode, isSuffixMessage: isSuffixMessage });
      }
    }
  }

  addDialogMessage(isSuffixMessage, message) {
    this.dialogMessages.push({ message: message, isSuffixMessage: isSuffixMessage });
  }

  afterSetCustomerBranchName(selectedAccount) {
    if (this.props.onAccountSelect) {
      this.props.onAccountSelect(
        selectedAccount,
        this.props.enableShowDialogMessagesInCallback
          ? () => {
            if (this.state.showDialogMessages && selectedAccount != null && this.props.showOrderReminder) {
              this.getAccountOrder(selectedAccount.accountNumber, selectedAccount.accountSuffix);
            } else {
              this.onDialogMessagesShow(false);
            }
          }
          : null
      );
    }
    if (this.props.enableShowDialogMessagesInCallback == false) {
      if (this.state.showDialogMessages && selectedAccount != null && this.props.showOrderReminder) {
        this.getAccountOrder(selectedAccount.accountNumber, selectedAccount.accountSuffix);
      } else {
        this.onDialogMessagesShow(false);
      }
    }
  }
  
  showCrossMarketingInfo(crossMarketingResponse) {
    if (!crossMarketingResponse) {
      var CrossMarketingData = {
        UserId: this.props.context.applicationContext.user.userid,
        ChannelId: this.props.context.applicationContext.channel.channelId,
        ResourceCode: this.props.pageParams && this.props.pageParams.resourceInfo.resourceCode,
        AccountNumber: this.state.accountNumber,
        LanguageId: this.props.context.language
      };
      this.crossMarketingData = CrossMarketingData;
      if (
        BAccountComponent.openCrossMarketingMessageList != null &&
        BAccountComponent.openCrossMarketingMessageList.length > 0 &&
        BAccountComponent.openCrossMarketingMessageList.find(
          c =>
            c.UserId == CrossMarketingData.UserId &&
            c.ChannelId == CrossMarketingData.ChannelId &&
            c.ResourceCode == CrossMarketingData.ResourceCode &&
            c.AccountNumber == CrossMarketingData.AccountNumber
        )
      ) {
        return;
      }

      let request = {
        requestClass: 'BOA.Types.BusinessComponents.CrossMarketingMessageRequest',
        requestBody: {
          MethodName: 'Select',
          DataContract: CrossMarketingData
        },
        key: 'SHOW_CROSS_MARKETING_INFO'
      };
      this.executer(request);
      return;
    }

    if (!crossMarketingResponse.success && crossMarketingResponse.results.length > 0) {
      // TODO
    } else {
      var newData = {};
      if (crossMarketingResponse.value && crossMarketingResponse.value.length > 0) {
        crossMarketingResponse.value.forEach(function(element) {
          newData = {
            UserId: CrossMarketingData.UserId,
            ChannelId: CrossMarketingData.ChannelId,
            ResourceCode: CrossMarketingData.ResourceCode,
            AccountNumber: CrossMarketingData.AccountNumber,
            LanguageId: CrossMarketingData.LanguageId,
            CrossMarketingInfo: element.crossMarketingInfo,
            CrossMarketingId: element.crossMarketingId,
            State: element.state,
            ResourceToOpen: element.resourceToOpen
          };
          if (BAccountComponent.openCrossMarketingMessageList == null) BAccountComponent.openCrossMarketingMessageList = [];
          BAccountComponent.openCrossMarketingMessageList.push(newData);
        }, this);

        let dialog = (
          <CrossMarketingInfo
            context={this.props.context}
            crDate={CrossMarketingData}
            selectList={BAccountComponent.openCrossMarketingMessageList}
          />
        );
        BDialogHelper.showWithResourceCode(
          this.props.context,
          'CRMTCPRBIL',
          dialog,
          null,
          null,
          null,
          this.handleCrossMarketingClose.bind(this),
          { width: '30%', height: '40%' }
        );
      }
    }
  }

  refreshStyle() {
    this.informationLabelStyle = { fontSize: '12px', paddingRight: '5px', color: this.getTheme().boaPalette.base300 };
    this.informationValueStyle = { fontSize: '14px', color: this.getTheme().boaPalette.base450 };
    this.customerNameLabelStyle = { fontSize: '14px', fontWeight: 'bold', color: this.getTheme().boaPalette.base500 };
    this.informationRowStyle =
      this.props.context.deviceSize >= BComponent.Sizes.MEDIUM
        ? { float: 'left', width: '100%', margin: '0px 0px 6px 0px' }
        : { float: 'left', width: '100%', margin: '0px 0px' };
  }

  initializeState() {
    var accountNumber = this.props.defaultAccountNumber || this.props.accountNumber || '';
    this.state = {
      accountNumber: accountNumber,
      customerInfo: null,
      selectedAccount: null,
      accountList: [],
      errorText: null,
      selectedCriteriaIndex: 0,
      activeBranchName: null,
      showDialogMessages: this.props.showDialogMessages,
      suffixListVisible: false,
      renderCount: 1,
      hasInput: false
    };
  }

  resetValue() {
    var accountNumber = this.props.defaultAccountNumber || '';
    this.setState({
      accountNumber: accountNumber,
      customerInfo: null,
      accountList: [],
      selectedAccount: null,
      errorText: null,
      activeBranchName: null,
      suffixListVisible: false,
      hasInput: false
    });
    this.dialogMessages = [];
  }

  componentWillReceiveProps(nextProps) {
    var isAccountNumberChanged = nextProps.accountNumber != this.props.accountNumber;

    if (isAccountNumberChanged && this.state.customerInfo != null && nextProps.accountNumber == this.state.customerInfo.customerid) {
      isAccountNumberChanged = false;
    }

    this.setState(
      {
        errorText: nextProps.errorText,
        showDialogMessages: nextProps.showDialogMessages
      },
      () => {
        if (isAccountNumberChanged) {
          var nextAccountNumber = nextProps.accountNumber || this.props.defaultAccountNumber;
          var nextAccountSuffix = nextProps.accountSuffix ? nextProps.accountSuffix : null;
          if (nextAccountNumber) this.search(nextAccountNumber, nextAccountSuffix);
          else this.setState({ accountNumber: '' });
        }
      }
    );
  }

  componentDidMount() {
    super.componentDidMount();

    var accountNumber = this.props.accountNumber || this.props.defaultAccountNumber;
    var accountSuffix = this.props.accountSuffix ? this.props.accountSuffix : null;
    if (accountNumber) this.search(accountNumber, accountSuffix);
  }

  validateConstraint() {
    return this.accountInput ? this.accountInput.validateConstraint() : true;
  }

  /* ------------------------------------------------------------------------
	Render methods
--------------------------------------------------------------------------*/

  render() {
    let { context } = this.props;
    let isRightToLeft = this.props.context.localization.isRightToLeft;

    this.refreshStyle();

    return (
      <BGridSection context={context} style={this.props.style}>
        {this.renderMainComponent(context)}
        {this.state.selectedAccount &&
          (isRightToLeft ? (
            <BGridRow context={context} columnCount={2} verticalAlign={'top'}>
              {this.renderAccountSuffixDetail(context)}
              {this.renderAccountDetail(context)}
            </BGridRow>
          ) : (
            <BGridRow context={context} columnCount={2} verticalAlign={'top'}>
              {this.renderAccountDetail(context)}
              {this.renderAccountSuffixDetail(context)}
            </BGridRow>
          ))}
        {this.state.accountNumber &&
          this.dialogMessages &&
          this.dialogMessages.length > 0 && (
            <StatusPanel context={context} accountNumber={this.state.accountNumber} panelMessages={this.dialogMessages} />
          )}
      </BGridSection>
    );
  }

  renderMainComponent(context) {
    let isRightToLeft = this.props.context.localization.isRightToLeft;
    let accountSuffix = this.state.selectedAccount ? [this.state.selectedAccount.accountSuffix] : [];
    let accountNumberInput = (
      <div style={{ position: 'relative' }}>
        <BInputAction
          ref={r => (this.accountInput = r)}
          context={context}
          format="D"
          hintText="123456789"
          type={'numeric'}
          value={this.state.accountNumber}
          floatingLabelText={this.props.label || this.getMessage('BOAOne', 'CustomerIdentityTax')}
          bottomRightInfoEnable={false}
          maxLength={20}
          onChange={(e, value) => {
            this.handleOnTextChange(value);
          }}
          onKeyDown={e => {
            if (e.keyCode == 9||e.keyCode == 13) this.setAccountNumber(); // tab or enter
          }}
          onBlur={() => {
            this.setAccountNumber();
          }}
          errorText={this.props.errorText || this.state.errorText}
          leftIconList={[]}
          rightIconList={this.getActionList()}
          disabled={this.props.disabled || this.props.isDisableAccountNumber}
          valueConstraint={this.props.valueConstraint}
        />
        {this.isLoading() && this.loadingIcon}
      </div>
    );

    let accountSuffixCombo = (
      <BComboBox
        ref={r => (this.bComboBoxAccountSuffix = r)}
        context={context}
        columns={this.getAccountSuffixColumnSet()}
        labelText={this.getMessage('BusinessComponents', 'AccountSuffix')}
        value={[accountSuffix]}
        dataSource={this.state.accountList}
        displayLabelSeperator={'-'}
        displayLabelMemberPath={['accountSuffix', 'fecDesc']}
        multiColumn={true}
        valueMemberPath={'accountSuffix'}
        onSelect={(index) => {
          this.handleOnAccountSelect(index);
        }}
        disabled={this.props.disabled}
        fullWidth={true}
      />
    );

    if (!this.props.isVisibleAccountSuffix) {
      return (
        <BGridRow context={context} columnCount={1}>
          {accountNumberInput}
        </BGridRow>
      );
    } else if (isRightToLeft) {
      return (
        <BGridRow context={context} columnCount={2}>
          {this.state.suffixListVisible && accountSuffixCombo}
          {accountNumberInput}
        </BGridRow>
      );
    } else {
      return (
        <BGridRow context={context} columnCount={2}>
          {accountNumberInput}
          {this.state.suffixListVisible && accountSuffixCombo}
        </BGridRow>
      );
    }
  }

  renderAccountSuffixDetail(context) {
    var renderChild = [];
    if (!this.props.isVisibleAccountSuffix) return null;

    if (this.props.isVisibleBalance && this.state.selectedAccount) {
      let availableBalanceDisplay = this.state.selectedAccount.availableBalanceDisplay;
      let ab = BLocalization.formatCurrency(availableBalanceDisplay, 'M') + ' ' + this.state.selectedAccount.fecDesc;
      renderChild.push(
        <BInformationText context={context} labelText={this.getMessage('BusinessComponents', 'AvailableBalance')} infoText={ab} />
      );

      let balance = BLocalization.formatCurrency(this.state.selectedAccount.balanceDisplay, 'M') + ' ' + this.state.selectedAccount.fecDesc;
      renderChild.push(
        <BInformationText context={context} labelText={this.getMessage('BusinessComponents', 'Balance')} infoText={balance} />
      );

      let withHoldingAmountDisplay = this.state.selectedAccount.withHoldingAmountDisplay;
      let whb = BLocalization.formatCurrency(withHoldingAmountDisplay, 'M') + ' ' + this.state.selectedAccount.fecDesc;
      renderChild.push(
        <BInformationText context={context} labelText={this.getMessage('BusinessComponents', 'BlockedBalance')} infoText={whb} />
      );
    }

    if (this.props.isVisibleTaxNumber && this.state.customerInfo && this.state.customerInfo.taxNumber) {
      renderChild.push(
        <BInformationText
          context={context}
          labelText={this.getMessage('BOA', 'TCIdentityNumberTaxNumber')}
          infoText={this.state.customerInfo.taxNumber}
        />
      );
    }
    if (this.props.isVisibleIBAN && this.state.selectedAccount && this.state.selectedAccount.iban) {
      renderChild.push(
        <BInformationText
          context={context}
          labelText={this.getMessage('BusinessComponents', 'IBAN')}
          infoText={BLocalization.formatIban(this.state.selectedAccount.iban)}
        />
      );
    }

    return <div style={{ marginTop: '-6px' }}>{renderChild}</div>;
  }

  renderAccountDetail(context) {
    if (this.state.customerInfo && this.props.isVisibleAccountInfo) {
      let customerClassIcon;
      switch (this.state.customerInfo.customerClassCode) {
        // case 'OPR': customerClassIcon = 'ToggleStar'; break; //	Operasyon
        // case 'KUR': customerClassIcon = 'ToggleStar'; break; //	Kurumsal
        // case 'BIR': customerClassIcon = 'ToggleStar'; break; //	Bireysel
        // case 'ISL': customerClassIcon = 'ToggleStar'; break; //	Isletme
        // case 'TIC': customerClassIcon = 'ToggleStar'; break; //	Ticari
        case 'OZL':
          customerClassIcon = 'ToggleStar';
          break; //	Özel
        // case 'FIN': customerClassIcon = 'ToggleStar'; break; //	Finansal Kurum
        // case 'YSM': customerClassIcon = 'ToggleStar'; break; //	Yurtdisi Sube Müsterisi
        // case 'MIC': customerClassIcon = 'ToggleStar'; break; //	Mikro
        // case 'UAB': customerClassIcon = 'ToggleStar'; break; //	Uluslararasi Bankacilik
        // case 'BRY': customerClassIcon = 'ToggleStar'; break; //	Bireysel Yeni
        // case 'ESN': customerClassIcon = 'ToggleStar'; break; //	Esnaf
        // case 'KI1': customerClassIcon = 'ToggleStar'; break; //	Küçük Isletme 1
        // case 'KI2': customerClassIcon = 'ToggleStar'; break; //	Küçük Isletme 2
        // case 'OBI': customerClassIcon = 'ToggleStar'; break; //	Orta Büyük Isletme
        // case 'TCR': customerClassIcon = 'ToggleStar'; break; //	Ticari Yeni
      }

      return (
        <div>
          <div style={this.informationRowStyle}>
            <BLabel
              context={context}
              style={this.customerNameLabelStyle}
              text={this.getUnsafeText(this.state.customerInfo.customerName, 50)}
            />
          </div>
          <div style={this.informationRowStyle}>
            {customerClassIcon ? (
              <BThemeProvider theme={context.theme}>
                {BIcon.getIcon(context, { dynamicIcon: customerClassIcon, iconProperties: { color: 'red' } })}
              </BThemeProvider>
            ) : (
              <div />
            )}
            <BLabel
              context={context}
              style={Object.assign(this.informationValueStyle, { display: 'inline', verticalAlign: 'super' })}
              text={this.state.customerInfo.customerClassName.toUpperCase()}
            />
          </div>
          <div style={this.informationRowStyle}>
            <BLabel context={context} style={this.informationValueStyle} text={this.state.activeBranchName} />
          </div>
          {this.props.isVisibleLedger ? (
            <div style={this.informationRowStyle}>
              <BLabel
                context={context}
                style={this.informationValueStyle}
                text={this.getUnsafeText(this.state.selectedAccount ? this.state.selectedAccount.ledgerId : null)}
              />
            </div>
          ) : (
            <div />
          )}
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default BAccountComponent;
