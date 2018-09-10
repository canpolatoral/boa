
declare namespace __BMainMenu {
    interface BMainMenuProps {
        width: any;
        context: any;
        serviceCallLoader: any;
        onMenuItemSelected?: (parameters: any) => void;
    }

    interface BMainMenuInstance extends __BComponent.BComponentInstance {
    }

    export class BMainMenu extends __BComponent.BComponetBase<BMainMenuProps, BMainMenuInstance> { }
}

declare module 'b-main-menu' {
    export import BMainMenu = __BMainMenu.BMainMenu;
    export default BMainMenu;
}