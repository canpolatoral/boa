declare namespace __BAccessPointBrowser {
  interface BAccessPointBrowserProps extends __BComponent.BComponentProps {
    labelText?: string;
    /**
     * The hint text of the label.
     */
    hintText?: string;
    /**
     * If true, user can select multiple resource.
     */
    isMultiSelection?: boolean;
    /**
     * The error content to display.
     */
    errorText?: string;
    /**
     * If true, user must be select at least one user resource.
     */
    userMustBeSelected?: boolean;
    /**
     * If true, user must be select at least one work group resource.
     */
    workgroupMustBeSelected?: boolean;
    /**
     * If true, user must be select at least one role resource.
     */
    roleMustBeSelected?: boolean;
    /**
     * If true, all item will be expanded.
     */
    expandAll?: boolean;
    /**
     * Height of component.
     */
    height?: number;
    /**
     * If true, icons will be show.
     */
    showIcons?: boolean;

    isChoosable?: boolean;
    canSelectOwnWorkgroupRoot?: boolean;
    rootWorkgroupId?: number; 
    showDetailedAccessPointName?: boolean;
    selectedAccessPointIds?: any[];
    accessPointDialogClosedByApprove?: () => void;
    onResetValue?: () => void;
  }

  interface BAccessPointBrowserInstance extends __BComponent.BComponetBase<BAccessPointBrowserProps> {
    getValue(): any;
    getData(): any;
    resetValue(): void; 
  }

  export class BAccessPointBrowser extends __BComponent.BComponetBase<BAccessPointBrowserProps, BAccessPointBrowserInstance> {}
}

declare module 'b-access-point-browser' {
  export import BAccessPointBrowser = __BAccessPointBrowser.BAccessPointBrowser;
  export default BAccessPointBrowser;
}
