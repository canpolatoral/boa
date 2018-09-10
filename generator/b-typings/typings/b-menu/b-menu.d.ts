
declare namespace __BMenu {
    interface BMenuProps extends __BComponent.BComponentProps {
        autoWidth?: boolean;
        disableAutoFocus?: boolean;
        initiallyKeyboardFocused?: boolean;
        style?: React.CSSProperties;
        listStyle?: any;
        maxHeight?: number;
        multiple?: boolean;
        onChange?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onEscKeyDown?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onItemTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        value?: any;
        width?: any; // tip handle edilemedi. özelleştirilebilir
        items?: any; // tip handle edilemedi. özelleştirilebilir
    }

    interface BMenuInstance extends __BComponent.BComponentInstance {
    }

    export class BMenu extends __BComponent.BComponetBase<BMenuProps, BMenuInstance> { }
}

declare module 'b-menu' {
    export import BMenu = __BMenu.BMenu;
    export default BMenu;
}