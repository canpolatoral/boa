
declare namespace __BResourceBrowser {
    interface BResourceBrowserProps extends __BComponent.BComponentProps {
        isAuthorizedResourcesOnly?: boolean;
        canMultipleSelect?: boolean;
        maxSelectionCount?: number;
        showParentsHaveNoChildren?: false;
        labelText?: string;
        hintText?: string;
        actionListVisibility?: boolean;
        selectedResourceAction?: any;
        selectedResourceId?: number;
        selectedResourceIdList?: number[];
        selectedResourceCode?: string;
        selectedResourceCodeList?: string[];
        channelId?: number;
        channelIdList?: number[];
        isChoosable?: boolean;
        showHiddenResources?: boolean;
        showDetails?: boolean;
        tagFilter?: string;
        typeIdFilterList?: any;
        canCheckChildsByParent?: boolean;
        onResetValue?: () => void;
        onResourceSelect?: (values: any[], data: any[]) => void;
        onResourceActionSelect?: (selectedAction: any) => void;
    }

    interface BResourceBrowserInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        getData(): any;
        resetValue(): void; 
    }

    export class BResourceBrowser extends __BComponent.BComponetBase<BResourceBrowserProps, BResourceBrowserInstance> { }
}

declare module 'b-resource-browser' {
    export import BResourceBrowser = __BResourceBrowser.BResourceBrowser;
    export default BResourceBrowser;
}