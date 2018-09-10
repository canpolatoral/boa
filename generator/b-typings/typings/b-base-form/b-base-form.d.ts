
declare namespace __BBaseForm {
    interface BBaseFormProps extends __BComponent.BComponentProps {
        resourceInfo: any;
        content?: any;
        leftPaneContent?: any;
        onActionClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onClosing?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        style?: React.CSSProperties;
        isLoading?: boolean;
        visibleHelpButton?:boolean;
        visibleInfoButton?:boolean;
        visibleOptionsButton?:boolean;
        visibleCloseButton?: boolean;
        actionsOnlyMode?: boolean;
    }

    interface BBaseFormInstance extends __BComponent.BComponentInstance {
        getValue(): string;
        resetValue(): void;
        focus?: () => void;
    }

    export class BBaseForm<TProps, TInstance> extends __BComponent.BComponetBase<TProps, TInstance> { }
}

declare module 'b-base-form' {
    export import BBaseForm = __BBaseForm.BBaseForm;
    export default BBaseForm;
}