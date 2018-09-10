import PropTypes from 'prop-types';

var defaultProps = {
  isInWorkFlow: false,
  ispaymentInfoDisabled: false,
  iscommissionInfoDisabled: false,

  visibilityPaymentInformation:  true,
  visibilityPaymentInformationOptions: true,
  isSafeOptionChecked: false,
  isAccountOptionChecked: true,
  isAccountComponentAccountNumberReadonly: false,
  fEC:null,
  showAccountComponentDialogMessages: false,
  showAccountComponentBlackListDialogMessages:false,
  showAccountComponentCustomerBranchAccountMessage:false,
  showAccountComponentCustomerRecordingBranchWarning:false,
  showAccountComponentMernisServiceHealtyDialogMessage:false,
  showAccountComponentTaxNumberAndMernisVerifiedDialogMessage:false,

  isAccountComponentAlwaysCollapsed: false,
  isCommissionRateReadonly: true,
  visibilityCommissionRate: true,
  visibilitySpecialCommissionRate: false, 
  visibilityCommissionAmount: true, 

  visibilityBSMV: true,
  bSMVIncluded:false,
  visibilityAutoCalculatedAmount: true,
  isFECListEnabled: false, 

  isCommissionAmountReadOnly: false,
  isAutoPriceEnabled: false,

  visibilityFECAmount:true,
  visibilityFECList: true,
  visibilityControlBanknoteInfo: false,
  
  commissionSerializeId:0,
  canLoadDataOnSerialize:true,
  canLoadDataOnWorkFlow:false,

  requestedCommissionFER: 0,
  requestedCommissionFEC: 0,
  transactionAmount:0,
  transactionAmountFEC: 0,
  calculateFromTotalAmount: false,
  requestedCommissionAmount:0,
  useTransactionAccountSuffix:false,
  // ------------------------------------------------------------------ TEST ------------------------------------------------------------------
  // commissionJournalBusinessKey: '201101110099003130030000003',
  canCalculateCommission:true,
  // commissionPaymentTypeParameter: 3, // def 1,
  // commissionKey:'FKICPTSIZISLETME',
  // ------------------------------------------------------------------
  bsmvRatio: 0,
  commissionInfo: {},
  commissionCount: 0,   
  commissionBaseCount:1, 
  commissionCountLabel: 'Sayfa Sayısı',
  isBanknoteInfoRequiredForSafeOption: false,
  // isPayBackDisable: false,
  // isEligibleForCommissionDiscountMessageSet: false,
  isEligibleForCommissionDiscountControlEnabled: true,
  isMinCommissionAmountMultipliedByCommissionCount: true,
  manageAccountComponentMessages: true,
  // visibilityCommissionCount: false,
  visibilityInformation: true,
  // visibilityPaidCommissionAmount: false,
  withCustomer: true,
  // visibilityMinMaxAmount: false,
  visibilityDescription: false,
  // visibilityPayBackPlan: false,
    
};

var propTypes = {
  isInWorkFlow:PropTypes.bool,
  ispaymentInfoDisabled:PropTypes.bool,
  iscommissionInfoDisabled:PropTypes.bool,
  visibilityPaymentInformation: PropTypes.bool,
  visibilityPaymentInformationOptions: PropTypes.bool,
  isSafeOptionChecked: PropTypes.bool,
  isAccountOptionChecked: PropTypes.bool,
  isAccountComponentAccountNumberReadonly: PropTypes.bool,
  isAccountComponentAlwaysCollapsed: PropTypes.bool, // Müşteri bileşeninin sürekli Collapsed olup olmayacağını belirler. Eğer müşteri bileşeni Collapsed yapıldı ise müşteri bileşeninin normalde göstereceği mesajlar gösterilmez. Varsayılan False.
  accountComponentFECGroupList: PropTypes.array, // Müşteri bileşeninde döviz cinsi gruplarının filtrelenmesi istendiğinde liste halinde verilebilir.
  accountComponentFECList: PropTypes.array,      // Müşteri bileşeninde döviz cinsinin filtrelenmesi istendiğinde liste halinde verilebilir.
  accountNum: PropTypes.number,
  selectedAccount: PropTypes.any,
  selectedCustomer: PropTypes.any,
  accountComponentProductTypeList: PropTypes.array, // Müşteri bileşeni ürün tipi filtresi.
  accountComponentMinBalanceFilter: PropTypes.number, // Hesap listesinde bakiye filtresi atmak için kullanılır. Verilen tutardan büyük bakiyeli hesaplar gelir. Varsayılan null.
  
  // branchId: PropTypes.number,
  isCustomerMernisVerified: PropTypes.bool,
  showAccountComponentDialogMessages: PropTypes.bool,
  showAccountComponentBlackListDialogMessages:PropTypes.bool,
  showAccountComponentCustomerBranchAccountMessage: PropTypes.bool,
  showAccountComponentCustomerRecordingBranchWarning: PropTypes.bool,
  showAccountComponentMernisServiceHealtyDialogMessage: PropTypes.bool,
  showAccountComponentTaxNumberAndMernisVerifiedDialogMessage: PropTypes.bool,
  // showAccountComponentNoAccountSuffixFoundWarningAndClearData: PropTypes.bool,
  accountComponentIsVisibleAccountSuffix : PropTypes.bool,
  accountComponentIsVisibleIBAN : PropTypes.bool,
  accountComponentIsVisibleBalance : PropTypes.bool,
  accountComponentIsVisibleAccountInfo : PropTypes.bool,
  accountComponentIsVisibleTaxNumber : PropTypes.bool,
  accountComponentIsVisibleLedger : PropTypes.bool,
  accountComponentIsDisableAccountNumber : PropTypes.bool,

  isCommissionRateReadonly: PropTypes.bool,
  visibilityCommissionRate: PropTypes.bool,
  visibilitySpecialCommissionRate: PropTypes.bool,
  visibilityCommissionAmount: PropTypes.bool,
  visibilityBSMV: PropTypes.bool,
  bSMVIncluded: PropTypes.bool,

  visibilityAutoCalculatedAmount: PropTypes.bool,

  isFECListEnabled: PropTypes.bool,
  requestedCommissionFEC: PropTypes.number,

  fEC: PropTypes.number,

  isCommissionAmountReadOnly: PropTypes.bool,
  isAutoPriceEnabled: PropTypes.bool,

  visibilityFECAmount: PropTypes.bool,
  visibilityControlBanknoteInfo: PropTypes.bool,

  commissionKey: PropTypes.string.isRequired, // OnCommissionParamsChanged Bileşene verilen CommissionKey filtresi. Komisyon bilgilerinin yüklenmesi için CommissionKey değeri atanmış olmalı. Bu değer değiştiği zaman komisyon bilgileri yeniden yüklenir.
  
  /* Eğer komisyon bilgilerinin saklanması istenildi ise BOA.Business.Kernel.Commission.AddCommissionSerializeInfo
  metodu vasıtasıyla CommissionContract kaydedilir ve buradan dönen SerializeId ilgili işlem tablosuna kaydedilir.
  Ekranda aynı komisyon bilgilerinin tekrar getirilmesi istendiği zaman ise bileşende Load öncesi SerializeId değeri atanarak
  bileşenin saklanmış CommissionContract ı getirmesi sağlanır.*/
  commissionSerializeId: PropTypes.number,
  canLoadDataOnSerialize: PropTypes.bool,
  canLoadDataOnWorkFlow: PropTypes.bool,
  canCalculateCommission: PropTypes.bool,

  
  bsmvRatio: PropTypes.number,
  calculateFromTotalAmount: PropTypes.bool,

  comment: PropTypes.string,
  commissionBaseCount: PropTypes.number, // OnCommissionBaseCountChanged yazılacak
  commissionCount: PropTypes.number,
  commissionCountLabel: PropTypes.string,
  
  commissionInfo: PropTypes.any,
  commissionJournalBusinessKey: PropTypes.string,
  
  /*
        WithEntirePayment = 1,
        WithPartialPayment = 2,
        WithoutPayment = 3
  */
  commissionPaymentTypeParameter: PropTypes.number,
  dayCountOfMaturity: PropTypes.number, // OnDayCountOfMaturityChanged eklenecek
  
  // isAccountComponentAcountNumberReadonly: PropTypes.bool,
  // isAccountComponentAccountSuffixListReadonly: PropTypes.bool,
  isBanknoteInfoRequiredForSafeOption: PropTypes.bool,
  isEligibleForCommissionDiscountControlEnabled: PropTypes.bool,
  // isEligibleForCommissionDiscountMessageSet: PropTypes.bool,
  // isGeneralAccountOptionsChecked: PropTypes.bool,
  isMinCommissionAmountMultipliedByCommissionCount: PropTypes.bool,
  manageAccountComponentMessages: PropTypes.bool,

  
  // paidCommissionAmount: PropTypes.bool,
  portfolioClass: PropTypes.number,
  requestedCommissionAmount: PropTypes.number, 
  requestedCommissionFER: PropTypes.number,

  taxRate: PropTypes.number,
  transactionAccountSuffix: PropTypes.number,
  useTransactionAccountSuffix: PropTypes.bool,
  transactionAmount: PropTypes.number,
  transactionAmountFEC: PropTypes.number,
  // visibilityCommissionCount: PropTypes.bool,
  visibilityDescription: PropTypes.bool,
  visibilityFECList: PropTypes.bool,
  visibilityInformation: PropTypes.bool,
  // visibilityMinMaxAmount: PropTypes.bool,
  // visibilityPaidCommissionAmount: PropTypes.bool,
  // visibilityPayBackPlan: PropTypes.bool,
  withCustomer: PropTypes.bool,
  afterSelectedFECChanged: PropTypes.func,
  afterCommissionInfoLoaded: PropTypes.func,
  onCommissionAmountChanged: PropTypes.func,
  onLoadCompleted: PropTypes.func,
  onPaymentInformationOptionsChanged:PropTypes.func
};

export {propTypes, defaultProps};