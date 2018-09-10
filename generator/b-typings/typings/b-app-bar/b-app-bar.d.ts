
declare namespace __BAppBar {
    interface BAppBarProps extends __BComponent.BComponentProps {
        iconElementLeft?: React.ReactElement<any>;
        iconElementRight?: React.ReactElement<any>;
        onLeftIconButtonTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onRightIconButtonTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onTabItemChanged?: () => void;
        onDrawerConfigurationChanged?: (configuration: any) => void;
        onNewTabOpened?: (menuItem: any, data: any) => void;
        onTitleTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        showMenuIconButton?: boolean;
        title?: React.ReactNode;
        zDepth?: any;
        tabItems?: any; // tip handle edilemedi. özelleştirilebilir
        initialSelectedIndex?: any;
        leftContent?: any;
        rightContent?: any;
        isSearchBarEnable?: boolean;
        searchDataSource?: any;
        leftDrawerWidth?: number;
        rightDrawerWidth?: number;
        profilePicture?: string;
        searchBarHintText?: string;
        tabValue: any;
        resourceList?: any;
        isChangeUserVisible?:boolean;
    }

    interface BAppBarInstance extends __BComponent.BComponentInstance {
        getPageId: () => number;
        updateTabs: (tabItems: any, value: any) => void;
        fullScreen: (makeFull: boolean) => void;
    }

    export class BAppBar extends __BComponent.BComponetBase<BAppBarProps, BAppBarInstance> { }
}

declare module 'b-app-bar' {
    export import BAppBar = __BAppBar.BAppBar;
    export default BAppBar;
}