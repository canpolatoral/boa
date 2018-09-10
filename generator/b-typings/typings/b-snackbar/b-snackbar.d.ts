
declare namespace __BSnackbar {
    interface BSnackbarProps extends __BComponent.BComponentProps {
        action?: React.ReactNode;
        autoHideDuration?: number;
        bodyStyle?: any;
        className?: string;
        contentStyle?: any;
        message: React.ReactNode;
        onActionTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onRequestClose?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        open: boolean;
        style?: React.CSSProperties;
    }

    interface BSnackbarInstance extends __BComponent.BComponentInstance {
    }

    export class BSnackbar extends __BComponent.BComponetBase<BSnackbarProps, BSnackbarInstance> {
        static clearManagementInstance?: () => void;
    }
}

declare module 'b-snackbar' {
    export import BSnackbar = __BSnackbar.BSnackbar;
    export default BSnackbar;
}