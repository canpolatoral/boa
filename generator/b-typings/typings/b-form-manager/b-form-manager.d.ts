declare namespace _BFormManager {
    export class BFormManager {
        static getResourceInfo: (resourceId?: number, resourceCode?: string, callback?: any) => any;
        static getResourceInfoByPath: (path: string, callback?: any) => any;
        static getNewPageId: () => any;
        static getTabList: () => any;
        static isOneResource: (resourceCode: string) => boolean;
        static show: (resourceCode: string, data?: any, showAsNewPage?: boolean, menuItemSuffix?: string, openType?: number) => any;
        static showDialog: (resourceCode: string, data?: any, title?: string, onClose?: any, style?: any) => any;
        static showStatusMessage: (text: string, closeText?: string, closeCallback?: any, type?: string, timeout?: number, color?: string) => any;
        static showStatusErrorMessage: (message: string, results: any, closeText?: string, closeCallback?: any, type?: string, timeout?: number, color?: string) => any;
        static showStatusMessageOnOther: (uniqueId: string, text: string, closeText?: string, closeCallback?: any, type?: string, timeout?: number, color?: string) => any;
        static clearStatusMessage: () => any;
        static getCachedResourceInfo: (resourceId: number, resourceCode: string, resourcePath: string, getLightInfo?: boolean) => any;
        static cacheResourceInfo: (_resourceInfo: any) => void;
        static getAllResourceLightInfo: (language: number, callback?: any) => void;
        static getResourceTree: (language: number) => any;
        static staticConstructor(_masterPageInstance: any, _showDelegate: any, _showDialogDelegate: any, _setOpenedLinkTabValue: any): void;
        static clearManagementInstance: () => any;
        static fullScreen: (makeFull: boolean) => any;
        static setRequestInfo: (channelId: number) => void;
        static showStatusDeleteMessage: (message: string, undoText: string, deleteCallback: any, undoCallback?: any, timeout?: number, type?: string) => any;
    }
}

declare module "b-form-manager" {
    export import BFormManager = _BFormManager.BFormManager;
}