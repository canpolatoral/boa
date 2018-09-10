
declare namespace __BIconMenu {
    interface BIconMenuProps extends __BComponent.BComponentProps {
        iconType: "vertical" | "horizontal" | "custom";
        customIcon?: any;
        items: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        anchorOrigin?: any;
        animated?: boolean;
        className?: string;
        iconStyle?: any;
        menuStyle?: any;
        multiple?: boolean;
        open?: boolean;
        style?: React.CSSProperties;
        targetOrigin?: any;
        touchTapCloseDelay?: number;
        useLayerForClickAway?: boolean;
        onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
    }

    interface BIconMenuInstance extends __BComponent.BComponentInstance {
    }

    export class BIconMenu extends __BComponent.BComponetBase<BIconMenuProps, BIconMenuInstance> { }
}

declare module 'b-icon-menu' {
    export import BIconMenu = __BIconMenu.BIconMenu;
    export default BIconMenu;
}