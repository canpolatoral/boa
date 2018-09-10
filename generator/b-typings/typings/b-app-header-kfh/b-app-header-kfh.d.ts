
declare namespace __BAppHearderKFH {
    interface BAppHearderKFHProps extends __BComponent.BComponentProps {
      
        onTabItemChanged?: () => void;
        onDrawerConfigurationChanged?: (configuration: any) => void;
        onNewTabOpened?: (menuItem: any, data: any) => void;
        onTitleTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        showMenuIconButton?: boolean;
        title?: React.ReactNode;
        zDepth?: any;
        tabItems?: any; // tip handle edilemedi. özelleştirilebilir
        initialSelectedIndex?: any;
        isSearchBarEnable?: boolean;
        searchDataSource?: any;
        searchBarHintText?: string;
        tabValue: any;
        resourceList?: any;
		onEditProfile?: any;
        onLogOut?: any;
    }

    interface BAppHearderKFHInstance extends __BComponent.BComponentInstance {
        getPageId: () => number;
        updateTabs: (tabItems: any, value: any) => void;
        fullScreen: (makeFull: boolean) => void;
    }

    export class BAppHeaderKFH extends __BComponent.BComponetBase<BAppHearderKFHProps, BAppHearderKFHInstance> { }
}

declare module 'b-app-header-kfh' {
    export import BAppHeaderKFH = __BAppHearderKFH.BAppHeaderKFH;
    export default BAppHeaderKFH;
}