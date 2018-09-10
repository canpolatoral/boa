
declare namespace __BExcelBrowser {
    interface BExcelBrowserProps extends __BComponent.BComponentProps {
        floatingLabelText?: string;
        hintText?: string;
        errorText?: string;
        disabled?: boolean;
        style?: React.CSSProperties;
        isNumeric?: boolean;
        valueType?: string;
    }

    interface BExcelBrowserInstance extends __BComponent.BComponentInstance {
    }

    export class BExcelBrowser extends __BComponent.BComponetBase<BExcelBrowserProps, BExcelBrowserInstance> { }
}

declare module 'b-excel-browser' {
    export import BExcelBrowser = __BExcelBrowser.BExcelBrowser;
    export default BExcelBrowser;
}