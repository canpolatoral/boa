
declare namespace __BTransactionForm {
    interface BTransactionFormProps extends __BBaseForm.BBaseFormProps {
        resourceInfo: any;
        content?: any;
        leftPaneContent?: any;
        onActionClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onClosing?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        style?: React.CSSProperties;
    }

    interface BTransactionFormInstance extends __BBaseForm.BBaseFormInstance {
    }

    export class BTransactionForm extends __BBaseForm.BBaseForm<BTransactionFormProps, BTransactionFormInstance> { }
}

declare module 'b-transaction-form' {
    export import BTransactionForm = __BTransactionForm.BTransactionForm;
    export default BTransactionForm;
}