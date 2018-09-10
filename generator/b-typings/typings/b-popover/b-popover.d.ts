
declare namespace __BPopover {
    interface BPopoverProps extends __BComponent.BComponentProps {
        anchorEl?: any;
        isOriginSetted?: boolean;
        anchorOrigin?: any;
        animated?: boolean;
        animation?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        autoCloseWhenOffScreen?: boolean;
        canAutoPosition?: boolean;
        children?: any;
        className?: string;
        onRequestClose?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        open?: boolean;
        style?: React.CSSProperties;
        targetOrigin?: any;
        useLayerForClickAway?: boolean;
        zDepth?: 0 | 1 | 2 | 3 | 4 | 5;
        isResizable?: boolean;
    }

    interface BPopoverInstance extends __BComponent.BComponentInstance {
    }

    export class BPopover extends __BComponent.BComponetBase<BPopoverProps, BPopoverInstance> { }
}

declare module 'b-popover' {
    export import BPopover = __BPopover.BPopover;
    export default BPopover;
}