
declare namespace __BFinancialSegmentBrowser {
    interface BFinancialSegmentBrowserProps extends __BComponent.BComponentProps {
        labelText?: string;
        hintText?: string;
        isMultiSelection?: boolean;
    }

    interface BFinancialSegmentBrowserInstance extends __BComponent.BComponentInstance {
    }

    export class BFinancialSegmentBrowser extends __BComponent.BComponetBase<BFinancialSegmentBrowserProps, BFinancialSegmentBrowserInstance> { }
}

declare module 'b-financial-segment-browser' {
    export import BFinancialSegmentBrowser = __BFinancialSegmentBrowser.BFinancialSegmentBrowser;
    export default BFinancialSegmentBrowser;
}