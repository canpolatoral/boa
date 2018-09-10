declare namespace __BAccountComponent {
    interface BAccountComponentProps extends __BComponent.BComponentProps {
        width?: any;
        accountSuffix?: any;
        accountNumber?: any;
        isVisibleAccountSuffix?: boolean;
        isVisibleIBAN?: boolean;
        isVisibleBalance?: boolean;
        isVisibleAccountInfo?: boolean;
        isVisibleLedger?: boolean;
        isDisableAccountNumber?: boolean;
        onKeyDown?: () => void;
        onCustomerSelect?: (selectedCustomer: any) => void;
        onAccountSelect?: (selectedAccount: any, showDiloagCallback?: () => void) => void;
        onCustomerNotFound?: () => void;
        label?: string;
        allow18AgeControl?: any;
        allowDoubleSignatureControl?: any;
        allowSharedAccountControl?: any;
        blackListVerificationType?: any;
        canCheckCustomerAgreementVersion?: any;
        continueIfCustomerIsDead?: any;
        continueIfCustomerIsPersonnel?: any;
        continueIfCustomerMernisRegistrationOutOfDate?: any;
        continueIfCustomerMernisUnVerify?: any;
        continueIfCustomerTaxNumberUnVerify?: any;
        stateNo?: any;
        stateNoList?: any;
        status?: any;
        useDefaultCustomerOnMernisControl?: any;
        useDefaultPersonOnTaxNumberControl?: any;
        isBlackListInfoNeeded?: any;
        isAllCreditCardNumberAccounts?: any;
        isInFreeZone?: any;
        isEfficiencyInfoIncluded?: any;
        isAddressCheckNeeded?: any;
        isCrossMarketingEnable?: any;
        isAccountSuffixAccountAliasVisible?: boolean;
        isAccountSuffixBranchIdVisible?: boolean;
        isAccountSuffixInternalPeriodEndVisible?: boolean;
        isAccountSuffixLedgerIdVisible?: boolean;
        isAccountSuffixListInMiniMode?: boolean;
        isAccountSuffixMaturityEndVisible?: boolean;
        isAccountSuffixProductNameVisible?: boolean;
        isAccountSuffixProfitShareRatioVisible?: boolean;
        isOpenDateVisible?: boolean;
        isLastNetProfitVisible?: boolean;
        isLastRenewedDateVisible?: boolean;
        isMaturityInfoVisible?: boolean;
        accountActiveState?: any;
        minBalanceFilter?: any;
        accountOrder?: any;
        showDialogMessages?: any;
        showMernisServiceHealtyDialogMessage?: any;
        showTaxNumberAndMernisVerifiedDialogMessage?: any;
        showBlackListDialogMessages?: any;
        showCustomerAddressAsToolTip?: any;
        showCustomerBranchAccountMessage?: any;
        showCustomerEmailAsToolTip?: any;
        showCustomerGSMAsToolTip?: any;
        showCustomerPhoneNumberAsToolTip?: any;
        showCustomerRecordingBranchWarning?: any;
        showOrderReminder?: any;
        fECGroupList?: any;
        fECList?: any;
        fECListBanned?: any;
        productCodeList?: any;
        productCodeListBanned?: any;
        productTypeList?: any;
        productGroupList?: any;
        disabled?: boolean;
        style?: any;
        errorText?: string;
        enableShowDialogMessagesInCallback?: boolean;
    }

    interface AccountComponentContract {
        selectedAccount?: BOA.Types.Kernel.Account.AccountComponentAccountsContract;
        selectedCustomer?: BOA.Types.Kernel.Customer.AccountComponentCustomerInfoContract;
        blackListVerificationType?: number;
    }

    interface BAccountComponentInstance extends __BComponent.BComponentInstance {
        getValue(): AccountComponentContract;
        resetValue(): void;
        addDialogMessage(isSuffixMessage: boolean, message: string): void;
        addDialogMessages(isSuffixMessage: boolean, message: string): void;
    }

    export class BAccountComponent extends __BComponent.BComponetBase<BAccountComponentProps, BAccountComponentInstance> { }
}

declare module 'b-account-component' {
    export import BAccountComponent = __BAccountComponent.BAccountComponent;
    export default BAccountComponent;
}