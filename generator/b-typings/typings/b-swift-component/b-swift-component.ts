declare namespace __BSwiftBrowser {
    interface BSwiftBrowserProps extends __BComponent.BComponentProps {
        style?: Object;
        label?: string;
        fec?: number;
        channelId?: number;
        selectedItemChange?: (node: any, toggled: any) => void;
        selectedItemClear?: () => void;
        disabled?: boolean;
        selectedCorporateName?: string;
        selectedSwiftCode?: string;
        swiftLabel?: string;
        swiftCode?: string;
        corporateName?: string;
        city?: string;
        countryCode?: string;
        countryName?: string;
        bankAddress1?: string;
        bankAddress2?: string;
        selectedSwift?: Object;
    }

    interface BSwiftBrowserInstance extends __BComponent.BComponetBase<BSwiftBrowserProps> {
    }

    export class BSwiftBrowser extends __BComponent.BComponetBase<BSwiftBrowserProps, BSwiftBrowserInstance> { }
}

declare module 'b-swift-component' {
    export import BSwiftBrowser = __BSwiftBrowser.BSwiftBrowser;
    export default BSwiftBrowser;
}