
declare namespace __BProductBrowser {
    interface BProductBrowserProps extends __BComponent.BComponentProps {
        productType?: string;
        fec?: number;
        channelId?: number;
        customerType?: string;
        ignoreBeginAndEndDates?: boolean;
        accountNumber?: number;
        parentProductCodeList?: Array<any>;
        parentProductCode?: string;
        ignoreProductSegmentBeginAndEndDates?: boolean;
        productTypeList?: Array<any>;
        selectedItemChange?: (node: any, toggled: any) => void;
        selectedProductCode?: string;
        disabled?: boolean;
        errorText?: string;
    }

    interface BProductBrowserInstance extends __BComponent.BComponentInstance {
    }

    export class BProductBrowser extends __BComponent.BComponetBase<BProductBrowserProps, BProductBrowserInstance> { }
}

declare module 'b-product-browser-component' {
    export import BProductBrowser = __BProductBrowser.BProductBrowser;
    export default BProductBrowser;
}