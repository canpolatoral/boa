
declare namespace __BDialog {
    interface BDialogProps extends __BComponent.BComponentProps {
        actions?: React.ReactNode;
        actionsContainerClassName?: string;
        actionsContainerStyle?: any;
        autoDetectWindowHeight?: boolean;
        autoScrollBodyContent?: boolean;
        bodyClassName?: string;
        bodyStyle?: any;
        children?: React.ReactNode;
        className?: string;
        contentClassName?: string;
        contentStyle?: any;
        modal?: boolean;
        onRequestClose?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        open: boolean;
        overlayClassName?: string;
        overlayStyle?: any;
        repositionOnUpdate?: boolean;
        style?: React.CSSProperties;
        title?: React.ReactNode;
        titleClassName?: string;
        titleStyle?: any;
    }

    interface BDialogInstance extends __BComponent.BComponentInstance {
    }

    export class BDialog extends __BComponent.BComponetBase<BDialogProps, BDialogInstance> { }

    export class BDialogHelper {
        static show(context: any, content: any, dialogType?: number, dialogResponseStyle?: number, title?: string, onClose?: any, style?: any): void;
        static showWithResourceCode(context: any, resourceCode: string, content: any, dialogType?: number, dialogResponseStyle?: number, title?: string, onClose?: any, style?: any, onClosing?: any): void;
        static showError(context: any, message: string, results: any, dialogType?: number, dialogResponseStyle?: number, title?: string, onClose?: any, style?: any): void;
        static close(component: any, dialogResponse?: number, returnValue?: any): void;
    }
}

declare module 'b-dialog-box' {
    export import BDialog = __BDialog.BDialog;
    export import BDialogHelper = __BDialog.BDialogHelper;
    export default BDialog;
}
