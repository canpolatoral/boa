declare namespace __BMoney {
    interface BMoneyProps extends __BComponent.BComponentProps {
        maxLength?: any;
        onFocus?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onBlur?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onChange?: (e: Object, value: number) => void;
        onKeyDown?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        errorText?: string;
        floatingLabelText?: string;
        disabled?: boolean;
        showBankNoteButton?: boolean;
        isReadOnly?: boolean;
        isChoosable?: boolean;
        useGOVIfPossible?: boolean;
        FEC?: number;
        canChangeTotalValue?: boolean;
        totalValue?: number;
        totalMaximumValue?: number;
        behaviourType?: "Deposit" | "Withdrawal";
        canTellerWorkWithoutSafeDefiniton?: boolean;
        tellerTransactionList?: any;
        hasTellerTransactionListValue?: boolean;
        showWarnings?: boolean;
        format?: any;
        canEnterZeroValue?: boolean;
        isVisibleChangeTotal?: boolean;
    }
    interface BMoneyContract {
        value: any,
        FEC: number,
        tellerTransactionList: BOA.Common.Types.TellerTransactionContract[],
        hasTellerProcessInfo: boolean
    }
    interface BMoneyInstance extends __BComponent.BComponentInstance {
        getValue(): BMoneyContract;
        resetValue(): void;
    }

    export class BMoney extends __BComponent.BComponetBase<BMoneyProps, BMoneyInstance> { }
}

declare module 'b-money' {
    export import BMoney = __BMoney.BMoney;
    export default BMoney;
}