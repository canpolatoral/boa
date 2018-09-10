
declare namespace __BTabBar {
    interface BTabBarProps extends __BComponent.BComponentProps {
        className?: string;
        contentContainerClassName?: string;
        contentContainerStyle?: any;
        initialSelectedIndex?: number;
        inkBarStyle?: any;
        onChange?: (event: any, value: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        style?: React.CSSProperties;
        tabItemContainerStyle?: any;
        tabTemplate?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        tabTemplateStyle?: any;
        value?: any;
        tabItems?: any; // tip handle edilemedi. özelleştirilebilir
        mode?: any;
    }

    interface BTabBarInstance extends __BComponent.BComponentInstance {
    }

    export class BTabBar extends __BComponent.BComponetBase<BTabBarProps, BTabBarInstance> { }
}

declare module 'b-tab-bar' {
    export import BTabBar = __BTabBar.BTabBar;
    export default BTabBar;
}