
declare namespace __BPageModule {
    interface BPageModuleProps extends __BComponent.BComponentProps {
        pageInstance: BFramework.BasePage,
        tabParams?: any,
        isWideCardEnabled?: boolean,
        isCardSectionEnabled?: boolean
    }

    export class BPageModule extends __BComponent.BComponetBase<BPageModuleProps> {
        snaps: any;
        setTabParams: (tabParams: any) => void;
        proxyDidRespond(proxyResponse: any): void;
        loadData(props?: any): void;
        resetState(props?: any): void;
    }

    const BPageModuleComposer: (target: any) => any;
}

declare module 'b-page-module' {
    export import BPageModule = __BPageModule.BPageModule;
    export import BPageModuleComposer = __BPageModule.BPageModuleComposer;
    export default BPageModule;
}
