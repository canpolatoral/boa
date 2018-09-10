
declare namespace __BDrawer {
    interface BDrawerProps extends __BComponent.BComponentProps {
        children?: React.ReactNode;
        className?: string;
        containerClassName?: string;
        containerStyle?: any;
        disableSwipeToOpen?: boolean;
        docked?: boolean;
        onRequestChange?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        open?: boolean;
        openSecondary?: boolean;
        overlayClassName?: string;
        overlayStyle?: any;
        style?: React.CSSProperties;
        swipeAreaWidth?: number;
        width?: number;
        zDepth?: any; // tip handle edilemedi. özelleştirilebilir
    }

    interface BDrawerInstance extends __BComponent.BComponentInstance {
    }

    export class BDrawer extends __BComponent.BComponetBase<BDrawerProps, BDrawerInstance> { }
}

declare module 'b-drawer' {
    export import BDrawer = __BDrawer.BDrawer;
    export default BDrawer;
}