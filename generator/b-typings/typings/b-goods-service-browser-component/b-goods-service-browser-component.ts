
declare namespace __BGoodsServiceBrowser {
  interface BGoodsServiceBrowserProps extends __BComponent.BComponentProps {
      accountNumber?: number;
      ignoreBeginAndEndDates?: boolean;
      goodsServiceType?: string;
      channelId?: number;
      customerType?: string;
      parentGoodsServiceCodeList?: Array<any>;
      parentGoodsServiceCode?: string;
      ignoreGoodsServiceSegmentBeginAndEndDates?: boolean;
      goodsServiceCodeList?: Array<any>;
      selectedGoodsService?: any;
      selectedGoodsServiceName?: string;
      height?: number;
      selectedItemChange?: (node: any, toggled: any) => void;
      checkedNodeChange?: (node: any, checked: any) => void;
      selectedGoodsServiceCode?: string;
      isMultiSelect?: boolean;
      showWarningRiskIcon?: boolean;
  }

  interface BGoodsServiceBrowserInstance extends __BComponent.BComponentInstance {
      getSelectedItemsOrItem?: () => any;
      removeSelectedNode?:()=>void;
      addtoSelectedNode?: (newNode:any) => void;
      updateSelcetedNode?: (newNode:any) => void;
      setSelectNode?:(selectingNode:any) => void;
      setOpenNode?: (selectingNode:any) => void;

  }

  export class BGoodsServiceBrowser extends __BComponent.BComponetBase<BGoodsServiceBrowserProps, BGoodsServiceBrowserInstance> { }
}

declare module 'b-goods-service-browser-component' {
  export import BGoodsServiceBrowser = __BGoodsServiceBrowser.BGoodsServiceBrowser;
  export default BGoodsServiceBrowser;
}
