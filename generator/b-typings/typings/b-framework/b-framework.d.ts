
interface IRouteManager {
  generateRoutes: (routemodel: Object) => any,
  setPageParams: (params: Object) => void,
  getPageParams: () => any,
  getCurrentPageId: () => number,
  setCurrentDialogId: (dialogId: number) => void;
  setDialogParams: (dialogParams?: any) => void;
  setCurrentPageId: (pageId: number) => void;
}

interface ServiceCallRequest {
  servicePath: string,
  data: Object,
  baseUrl?: string,
  method?: string,
  timeout?: number,
  dataType?: string,
  headers?: Object
}

interface ProxyRequest<T> {
  requestClass: string;
  requestBody: T;
  key?: string;
  showProgress?: boolean;
  params?: any;
  path?: string;
}

interface ProxyMultipleRequest {
  requestList: any[];
  key?: string;
  showProgress?: boolean;
  //pageId?: number;  //framework yönetiyor
  //snapKey?: string; //framework yönetiyor
}

interface ProxyResponseBase {
  requestClass: string;
  requestBody: BOA.Common.Types.RequestBase;
  key?: string;
  showProgress?: boolean;
  //pageId?: number;  //framework yönetiyor
  //snapKey?: string; //framework yönetiyor
}

interface ProxyResponse extends ProxyResponseBase {
  response: BOA.Common.Types.ResponseBase;
}

interface GenericProxyResponse<T> extends ProxyResponseBase {
  response: BOA.Common.Types.GenericResponse<T>;
}


declare namespace BFramework {


  export interface BState {
      context: BContext;
      pageParams: BPageParams;
      tabParams: any;
      pageInstance: any;
      errors: any;
  }

  export interface BContext {
      deviceSize: any;
      platform: any;
      theme: any;
      language: any;
      messagingContext: any;
      localization: any;
      applicationContext: BOA.Common.Types.ApplicationContext;
  }

  export interface GridOptions {

      /** Specifies for which row fields columns are created. */
      columns?: Array<__BDataGridDX.Column>;

      /** An array containing custom data. A user defines the access to this data. Refer to Data Accessors for details. */
      dataSource?: Array<any>;

      /** Grid editing data options */
      editingDataOptions?: __BDataGridDX.EditingDataOptions;

      /** Grid tree data options */
      treeDataOptions?: __BDataGridDX.TreeDataOptions;

      /** Specifies the applied filters. */
      filters?: Array<__BDataGridDX.ColumnFiltering>;

      /** Specifies the applied expandedGroups. A string value that consists of values by which rows are grouped, separated by the | character. For example, the expanded group ‘Male’ is described as Male and ‘Male’/’Audi’ as Male|Audi and so on. */
      expandedGroups?: Array<string>;

      /** Specifies the applied grouping. */
      grouping?: Array<__BDataGridDX.ColumnFiltering>;

      /** Specifies the applied sorting. */
      sorting?: Array<__BDataGridDX.ColumnSorting>;

      /** todo. */
      aggregate?: any;

      /** Grid selectable prop. default none
       *  none              : none
       *  multiple          : multiple selection
       *  single            : single selection with radio button
       *  singleNonPointer  : single selection without radio button
      */
      selectable?: 'none' | 'single' | 'multiple' | 'singleNonPointer';

  }

  export interface BPageParams {
      resourceInfo: BOA.Common.Types.ResourceNode;
      data: any;
  }

  interface BasePageProps extends React.Props<any> {
      modal?: any,
      snapshot?: any
  }

  export class BasePageBase<T> extends React.Component<T, any> {
      state: any;
      //componentWillMount(): void;
      //componentDidMount(): void;
      //componentWillReceiveProps(nextProps: T, nextContext?: any): void;
      //shouldComponentUpdate(nextProps: T, nextState: any, nextContext: any): boolean;
      //componentWillUpdate(nextProps: T, nextState: any, nextContext: any): void;
      //componentDidUpdate(prevProps: T, prevState: any, prevContext: any): void;
      //componentWillUnmount(): void;
  }
  export class BasePage extends BasePageBase<BasePageProps> {
      snaps: any;
      pageId: number;
      hideActionManager: boolean;
      enableAction: (commandName: string) => void;
      disableAction: (commandName: string) => void;
      hideAction: (commandName: string) => void;
      addAction: (action: any) => void;
      findSchema: (parameter: any) => any;
      validate(request: any, parameter: any): boolean;
      validateAsync(request: any, parameter: any, callback?: (isValid: boolean, errors: any) => void): any;
      validateAsyncTest(request: any, callback?: (isValid: boolean, errors: any) => void): any;
      connect: (target: Object, reducers?: Array<Object>, initialState?: Object) => void;
      push: (args?: any) => void;
      replace: (args?: any) => void;
      getWindowRequest(): any;
      setWindowRequest(model: any): void;
      addExtraBpmAction(commandName: string): void;
      getBpmDescription(): string;
      onPageCloseClick(): void;
      proxyExecute(proxyRequest: ProxyRequest<BOA.Common.Types.RequestBase>, callback?: (response: BOA.Common.Types.ResponseBase) => void): any;
      proxyMultipleExecute(proxyRequest: ProxyMultipleRequest): any;
      proxyReportExecute(proxyRequest: ProxyRequest<BOA.Common.Types.RequestBase>): any;
      proxyTransactionExecute(proxyRequest: ProxyRequest<BOA.Common.Types.TransactionRequestBase>, callback?: (response: BOA.Common.Types.ResponseBase) => void): any;
      proxyDidRespond(proxyResponse: ProxyResponse): void;

      showDialogMessage(text: string, dialogType?: number, dialogResponseStyle?: number, title?: string, onClose?: any): void;
      showStatusMessage(text: string, closeText?: string, onClose?: any, type?: string, timeout?: number, color?: string): void;
      clearStatusMessage(): void;
      renderTab(): any;
      setDisable(isDisabled: boolean): any;
      validateConstraint(): boolean;

  }
  export class BrowsePage extends BasePage {
      getSelectedRowIndexes(): Array<number>;
      getSelectedRows(): Array<Object>;
      rightPaneWidth: number;
      rightPaneContent: any;
      print(): void;
      onRowSelectionChanged(selectedItems: any[], lastSelectionChangedRow?: any): void;

      setDataSource(dataSource: Array<any>): void;
      setColumns(columns: Array<__BDataGridDX.Column>): void;
      setGridOptions(options: GridOptions): void;
  }
  export class TransactionPage extends BasePage {
      tabEnabled: boolean;
      isWideCardEnabled: boolean;
      disableCardWidth: boolean;
      leftPaneContent: any;
      leftPaneWidth: number;
      rightPaneWidth: number;
      rightPaneContent: any;
      criteriaPanelHeader: any;
      enableCardSortOnMobile: boolean;
      print(): void;
  }

  export class TransactionWizardPage extends BasePage {
      isWideCardEnabled: boolean;
      disableCardWidth: boolean;
      leftPaneContent: any;
      leftPaneWidth: number;
      rightPaneWidth: number;
      rightPaneContent: any;
      criteriaPanelHeader: any;
      enableCardSortOnMobile: boolean;
      print(): void;
      onPageFinishClick(e: any, c: any): void;
      onWizardActionClick(action: any, callback: any): void;
      showActionManager(state: boolean): void;
      isFormUpdated(objectF: any, objectS: any): Boolean;
  }

  const store: Redux.Store;
  const configure: (options: Object) => void;
  const reducerRegistery: any;
  const routeManager: IRouteManager;
  const routeReducer: any;
  const initResponsive: (target: Object) => void;
  const BrowsePageComposer: (target: any) => any;
  const TransactionPageComposer: (target: any) => any;
  const TransactionWizardPageComposer: (target: any) => any;
  const BasePageComposer: (target: any) => any;
  const updateDeviceSize: any;
  const updateTheme: any;
  const changeLanguage: any;
  const updatePlatform: any;
  const updateLoadingState: any;
  const transferDataToAction: any;
  const changeApplicationContext: (applicationContext: any) => void;
  const hasPendingRequest: (pageId: number, isTransactional?: boolean) => boolean;
  const serviceCall: (
      requestClass: string,
      requestBody: Object,
      transferActions?: any[],
      transferOptions?: any) => any;
  const serviceCallManual: (
      request: ServiceCallRequest,
      transferActions?: any[],
      transferOptions?: any) => any;
  const serviceMultipleCall: (
      requestList: BOA.Common.Types.RequestBase[],
      transferActions?: any[],
      transferOptions?: any) => any;
  const getResourceInfo: (
      resourceId: number,
      resourceCode: string,
      callback: ((data: Object) => void)) => any;
  const getMessage: (
      groupName: string,
      propertyName: string) => string;
  const getProxy: () => BProxy.ServiceProxy;
  const routeActions: any;
  const resetStore: () => void;
}

declare module "b-framework" {
  export = BFramework;
}
