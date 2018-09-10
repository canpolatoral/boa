declare namespace __BDynamicComponents {
    export function getModule(string: any): any;
}

declare module "b-dynamic-components" {
    export import getModule = __BDynamicComponents.getModule;
}