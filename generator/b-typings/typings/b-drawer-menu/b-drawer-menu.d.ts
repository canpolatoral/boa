
declare namespace __BDrawerMenu {
    interface BDrawerMenuProps extends __BComponent.BComponentProps {
        autoWidth?: boolean;
        disableAutoFocus?: boolean;
        initiallyKeyboardFocused?: boolean;
        listStyle?: any;
        maxHeight?: number;
        multiple?: boolean;
        value?: any;
        width?: any; // tip handle edilemedi. özelleştirilebilir
        items?: any; // tip handle edilemedi. özelleştirilebilir
        onChange: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
    }

    interface BDrawerMenuInstance extends __BComponent.BComponentInstance {
    }

    export class BDrawerMenu extends __BComponent.BComponetBase<BDrawerMenuProps, BDrawerMenuInstance> { }
}

declare module 'b-drawer-menu' {
    export import BDrawerMenu = __BDrawerMenu.BDrawerMenu;
    export default BDrawerMenu;
}