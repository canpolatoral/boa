
declare namespace __BMenuItem {
    interface BMenuItemProps extends __BComponent.BComponentProps {
        checked?: boolean;
        disabled?: boolean;
        focusState?: any; // tip handle edilemedi. özelleştirilebilir
        insetChildren?: boolean;
        leftIcon?: React.ReactElement<any>;
        menuItems?: React.ReactNode;
        onTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        itemSelected?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        primaryText?: React.ReactNode;
        rightIcon?: React.ReactElement<any>;
        secondaryText?: React.ReactNode;
        style?: React.CSSProperties;
        innerDivStyle?: any;
        value?: any;
    }

    interface BMenuItemInstance extends __BComponent.BComponentInstance {
    }

    export class BMenuItem extends __BComponent.BComponetBase<BMenuItemProps, BMenuItemInstance> { }
}

declare module 'b-menu-item' {
    export import BMenuItem = __BMenuItem.BMenuItem;
    export default BMenuItem;
}