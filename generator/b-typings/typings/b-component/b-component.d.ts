declare namespace __BComponent {
    interface BThemeProviderProps {
        theme?: any, // TODO: özelleştir
    }
    interface Utils {
        getIcon: (cmpProps: any) => React.ReactElement<any>;
        stringFormat: (value: string, args: any) => string;
    }
    interface BComponentProps {
        context?: Object, // TODO: özelleştir  
        pageParams?: Object, // TODO: özelleştir  
        snapshot?: Object,
        size?: number,
        newLine?: boolean,
        isVisible?: boolean
    }

    export class BComponentInstance extends React.Component<any, any> {
        state: any;
        static Utils: Utils;
        constructor(props: any, state?: any);
        debugLog(message: any, ...args: any[]): void;
        setStyle(size: any, platform: any, style: any): any;
        shallowEqual(objA: any, objB: any): any;
        shouldComponentUpdate(nextProps: any, nextState: any): any;
        getSnapshot(): Object;
        setSnapshot(): Object;
        getValue(): any;
        resetValue(): any;
        getSelectedRowIndexes?: () => any;
    }

    //export class BComponetBase<TProps> extends React.Component<TProps, any> {
    //    state: any;
    //    static Utils: Utils;
    //    constructor(props: any, state?: any);

    //    getInstance(): any;
    //}

    export class BComponetBase<TProps = any, TInstance = any> extends React.Component<TProps, any> {
        state: any;
        static Utils: Utils;
        constructor(props: any, state?: any);

        getInstance(): TInstance;

        // todo kaldırılacak
        debugLog(message: any, ...args: any[]): void;
        setStyle(size: any, platform: any, style: any): any;
        shallowEqual(objA: any, objB: any): any;
        shouldComponentUpdate(nextProps: any, nextState: any): any;
        getSnapshot(): Object;
        setSnapshot(): Object;
        getValue(): any;
        resetValue(): any;
    }


    export const Platforms: {
        "1": string;
        "2": string;
        "3": string;
        DESKTOP: number;
        MOBILE: number;
        TABLET: number;
    };
    export const Sizes: {
        "1": string;
        "2": string;
        "3": string;
        "4": string;
        LARGE: number;
        MEDIUM: number;
        SMALL: number;
        XSMALL: number;
    };
    export const ComponentSize: {
        "1": string;
        "2": string;
        "3": string;
        SMALL: number;
        MEDIUM: number;
        LARGE: number;
    };
    export const ContentAlignMode: {
        "1": string;
        "2": string;
        "3": string;
        MOBILE: number;
        SINGLE: number;
        MULTI: number;
    };
    export const DialogResponseStyle: {
        "0": string;
        "1": string;
        "2": string;
        "3": string;
        "4": string;
        OK: number;
        YESCANCEL: number;
        YESNO: number;
        YESNOCANCEL: number;
        OKCANCEL: number;
    };
    export const DialogResponse: {
        "0": string;
        "1": string;
        "2": string;
        "3": string;
        "4": string;
        NONE: number;
        OK: number;
        YES: number;
        NO: number;
        CANCEL: number;
    };
    export const DialogType: {
        "0": string;
        "1": string;
        "2": string;
        "3": string;
        INFO: number;
        ERROR: number;
        WARNING: number;
        QUESTION: number;
    };

    export class BAppProvider extends React.Component<BThemeProviderProps, {}> {
        constructor(...args: any[]);
        getChildContext(): any;
    }

    export class BComponent extends BComponetBase<BComponentProps> {
    }

}

declare module "b-component" {
    export import BAppProvider = __BComponent.BAppProvider;
    export import BComponent = __BComponent.BComponent;
    export import Platforms = __BComponent.Platforms;
    export import Sizes = __BComponent.Sizes;
    export import ComponentSize = __BComponent.ComponentSize;
    export import ContentAlignMode = __BComponent.ContentAlignMode;
    export import DialogResponseStyle = __BComponent.DialogResponseStyle;
    export import DialogResponse = __BComponent.DialogResponse;
    export import DialogType = __BComponent.DialogType;
    export import Utils = __BComponent.Utils;
}