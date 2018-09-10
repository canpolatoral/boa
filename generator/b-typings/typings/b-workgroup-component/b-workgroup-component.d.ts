
declare namespace __BWorkgroupComponent {
    interface BWorkgroupComponentProps extends __BComponent.BComponentProps {
        selectedWorkgroupId?: number;
        defaultSelectedWorkgroupId?: number;
        workgroupFilterIdList?: number[];
        workgroupTypeList?: string[];
        showSelfWorkgroup?: boolean;
        isDepartmentAndServiceTogether?: boolean;
        showSelfWorkgroupWithChildList?: boolean;
        workWithBranchComponent?: boolean;
        workgroupListManual?: any[];
        disabled?: boolean;
        hintText?: string;
        labelText?: string;
        isAllOptionIncluded?: boolean;
        allOptionDescription?: string;
        onWorkgroupSelect?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        errorTextWorkgroup?: string;
    }

    interface BWorkgroupComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BWorkgroupComponent extends __BComponent.BComponetBase<BWorkgroupComponentProps, BWorkgroupComponentInstance> { }

}

declare module 'b-workgroup-component' {
    export import BWorkgroupComponent = __BWorkgroupComponent.BWorkgroupComponent;
    export default BWorkgroupComponent;
}