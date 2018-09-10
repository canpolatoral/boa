
declare namespace __BCommissionComponent {
    interface BCommissionComponentProps extends __BComponent.BComponentProps {
        isInWorkFlow?: boolean;
        commissionInfo?: any;
        ispaymentInfoDisabled?: boolean;
        iscommissionInfoDisabled?: boolean;
        accountComponentFECGroupList?: number[];
        accountComponentFECList?: number[];
        accountComponentMinBalanceFilter?: number;
        accountComponentProductTypeList?: number[];
        // branchId?: number;
        accountNum?: number;
        calculateFromTotalAmount?: boolean;
        canCalculateCommission?: boolean;
        canLoadDataAutomatically?: boolean;
        canLoadDataOnSerialize?: boolean;
        canLoadDataOnWorkFlow?: boolean;
        comment?: string;
        commissionBaseCount?: number;
        commissionCount?: number;
        commissionCountLabel ?: string;
        commissionJournalBusinessKey?: string;
        commissionKey?: string;
        commissionPaymentTypeParameter?: number; 
        commissionSerializeId?: number;
        // dayCountOfMaturity?: number;
        fEC?: number;
        isAccountComponentAcountNumberReadonly?: boolean;
        // isAccountComponentAccountSuffixListReadonly?: boolean;
        isAccountComponentAlwaysCollapsed?: boolean;
        isAccountOptionChecked?: boolean;
        isSafeOptionChecked?: boolean;
        isAutoPriceEnabled?: boolean;
        isBanknoteInfoRequiredForSafeOption?: boolean;
        isCommissionAmountReadonly?: boolean;
        isCommissionRateReadonly?: boolean;
        isCustomerMernisVerified?: boolean;
        isEligibleForCommissionDiscountControlEnabled?: boolean;
        isFECListEnabled?: boolean;
        // isGeneralAccountOptionsChecked?: boolean;
        isMinCommissionAmountMultipliedByCommissionCount?: boolean;
        manageAccountComponentMessages?: boolean;
        isAccountComponentAccountNumberReadonly?: boolean;
        portfolioClass?: number;
        requestedCommissionAmount?: number;
        requestedCommissionFEC?: number;
        requestedCommissionFER?: number;
        selectedAccount?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        selectedCustomer?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        showAccountComponentBlackListDialogMessages?: boolean;
        showAccountComponentCustomerBranchAccountMessage?: boolean;
        showAccountComponentCustomerRecordingBranchWarning?: boolean;
        showAccountComponentDialogMessages?: boolean;
        showAccountComponentMernisServiceHealtyDialogMessage?: boolean;
        // showAccountComponentNoAccountSuffixFoundWarningAndClearData?: boolean;
        showAccountComponentTaxNumberAndMernisVerifiedDialogMessage?: boolean;
        taxRate?: number;
        transactionAccountSuffix?: number;
        transactionAmount?: number;
        transactionAmountFEC?: number;
        useTransactionAccountSuffix?: boolean;
        visibilityAutoCalculatedAmount?: boolean;
        visibilityBSMV?: boolean;
        visibilityCommissionAmount?: boolean;
        // visibilityCommissionCount?: boolean;
        visibilityCommissionRate?: boolean;
        visibilityDescription?: boolean;
        visibilityFECAmount?: boolean;
        visibilityFECList?: boolean;
        visibilityInformation?: boolean;
        // visibilityMinMaxAmount?: boolean;
        // visibilityPaidCommissionAmount?: boolean;
        // visibilityPayBackPlan?: boolean;
        visibilityPaymentInformation?: boolean;
        visibilityPaymentInformationOptions?: boolean;
        withCustomer?: boolean;
        afterSelectedFECChanged?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        afterCommissionInfoLoaded?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onCommissionAmountChanged?: (value: any) => void;
        onLoadCompleted?: () => void;
        onPaymentInformationOptionsChanged?: () => void;
    }

    interface BCommissionComponentInstance extends __BComponent.BComponentInstance {
        setRequestedCommissionAmount(amount: any): void;
        setTransactionAmount(amount: any): void;
        setAccountNumber(accNum: any): void;
        setCommissionBaseCount(baseCount: any): void;
        getCommissionInfo(): any;
        clearData(): void;
    }

    export class BCommissionComponent extends __BComponent.BComponetBase<BCommissionComponentProps, BCommissionComponentInstance> { }
}

declare module 'b-commission-component' {
    export import BCommissionComponent = __BCommissionComponent.BCommissionComponent;
    export default BCommissionComponent;
}