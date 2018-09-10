
declare namespace __BSidebar {
    interface BSidebarProps extends __BComponent.BComponentProps {
        children: React.ReactNode;
        styles?: any; // tip handle edilemedi. özelleştirilebilir
        rootClassName?: string;
        sidebarClassName?: string;
        contentClassName?: string;
        overlayClassName?: string;
        sidebar: React.ReactNode;
        docked?: boolean;
        open?: boolean;
        transitions?: boolean;
        touch?: boolean;
        touchHandleWidth?: number;
        pullRight?: boolean;
        shadow?: boolean;
        dragToggleDistance?: number;
        onSetOpen?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
    }

    interface BSidebarInstance extends __BComponent.BComponentInstance {
    }

    export class BSidebar extends __BComponent.BComponetBase<BSidebarProps, BSidebarInstance> { }
}

declare module 'b-side-bar' {
    export import BSidebar = __BSidebar.BSidebar;
    export default BSidebar;
}