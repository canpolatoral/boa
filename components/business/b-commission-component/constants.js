var CommonConstant = {

  CommissionTaxType: {
    TaxFree: 0,
    BITT: 1,
    VAT: 2
  },
  Ledger: {
    BSMVLedgerId: 380005,
    BSMVRatio: 0.05,
    KDVLedgerId: 380121
  },
  CommissionType: {
    FromBox: 1,
    FromAccount: 2,
    FromGeneralLedger: 3
  },

  CommissionPaymentType:
  {
    WithEntirePayment: 1,
    WithPartialPayment:2,
    WithoutPayment: 3
  },

  CommissionDimension : 'Komisyon Boyut',
  AutoPrice           : 'Otomatik Fiyat',
  CampaignPrice       : 'Kampanya Fiyatı',
  PackagePrice        : 'Paket Fiyatı',
  CustomerDimension   : 'Müşteriye Özel Komisyon',
  GeneralCommission   : 'Genel Komisyon'
};

export default CommonConstant;

