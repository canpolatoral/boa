
declare namespace __BTransactionComponent {
    interface BTransactionComponentProps extends __BComponent.BComponentProps {
        labelText?: string;
        hintText?: string;
        canMultipleSelect?: boolean;
        selectedTransactionNodes?: any[];
        rootTransactionGroupIds?: any[];
        canSelectOwnTransactionGroupRoot?: boolean;
        showOnlyAuthorized?: boolean;
        onResetValue?: () => void;
        onTransactionSelect?: (value: any) => void;
        transactionCodeVisibility?: boolean;
    }

    interface BTransactionComponentInstance extends __BComponent.BComponetBase<BTransactionComponentProps> {
        getValue(): any;
    }

    export class BTransactionComponent extends __BComponent.BComponetBase<BTransactionComponentProps, BTransactionComponentInstance> { }
}

declare module 'b-transaction-component' {
    export import BTransactionComponent = __BTransactionComponent.BTransactionComponent;
    export default BTransactionComponent;
}