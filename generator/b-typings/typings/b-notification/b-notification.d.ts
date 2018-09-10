declare namespace __BNotification {
    interface BNotificationProps extends __BComponent.BComponentProps {
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

    interface BNotificationInstance extends __BComponent.BComponentInstance {
    }

    export class BNotification extends __BComponent.BComponetBase<BNotificationProps, BNotificationInstance> { }

    export class BNotificationHelper {
        static show(context: any): void;
    }
}

declare module 'b-notification' {
    export import BNotification = __BNotification.BNotification;
    export import BNotificationHelper = __BNotification.BNotificationHelper;
    export default BNotification;
}