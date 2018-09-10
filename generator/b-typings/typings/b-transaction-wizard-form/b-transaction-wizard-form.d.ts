
declare namespace __BTransactionWizardForm {
    interface BTransactionWizardFormProps extends __BBaseForm.BBaseFormProps {
        resourceInfo: any;
        content?: any;
        leftPaneContent?: any;
        stepList?: any[];
        finisherPage?: any[];
        processState?: number;
        isStepper?: boolean;
        onWizardActionClick?: () => void;
        onActionClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onFinishClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onClosing?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        style?: React.CSSProperties;
    }
    interface BTransactionWizardFormInstance extends __BBaseForm.BBaseFormInstance {
    }

    export class BTransactionWizardForm extends __BBaseForm.BBaseForm<BTransactionWizardFormProps, BTransactionWizardFormInstance> { }
}

declare module 'b-transaction-wizard-form' {
    export import BTransactionWizardForm = __BTransactionWizardForm.BTransactionWizardForm;
    export default BTransactionWizardForm;
}