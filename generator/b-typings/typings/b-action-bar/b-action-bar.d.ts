
declare namespace __BActionBar {
    interface BActionBarProps extends __BComponent.BComponentProps {
        actionList?: any; // tip handle edilemedi. özelleştirilebilir
        canExecuteDelegates?: any;
        onActionClick?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onHelpClick?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onOptionClick?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onCloseClick?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
    }

    interface BActionBarInstance extends __BComponent.BComponentInstance {
    }

    export class BActionBar extends __BComponent.BComponetBase<BActionBarProps, BActionBarInstance> { }
}

declare module 'b-action-bar' {
    export import BActionBar = __BActionBar.BActionBar;
    export default BActionBar;
}