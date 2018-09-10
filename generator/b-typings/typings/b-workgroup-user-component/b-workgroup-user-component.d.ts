
declare namespace __BWorkgroupUserComponent {
    interface BWorkgroupUserComponentProps extends __BComponent.BComponentProps {
        /**
         * Determines the workgroup that is currently selected.
         */
        selectedWorkgroupId?: number;

        /**
         * Determines the branch that is currently selected
         */
        workgroupFilterIdList?: any;

        /**
         * Determines the workgroup user that is currently selected.
         */
        selectedWorkgroupUserId?: number;

        /**
         * Filter the workgroups by workgroup types.
         */
        workgroupTypeList?: any;
        showSelfWorkgroup?: boolean;
        isDepartmentAndServiceTogether?: boolean;
        showSelfWorkgroupWithChildList?: boolean;
        showSubWorkgroupUsers?: boolean,
        workWithBranchComponent?: boolean;
        workgroupListManual?: Object;

        /**
         * If true, the workgroup will be disabled. Default valuse is false
         */
        workgroupDisabled?: boolean;

        /**
         * The hint content to display.
         */
        workgroupHintText?: string;

        /**
         * The content of the floating label.
         */
        workgroupLabelText?: string;

        /**
         * The hint content to display.
         */
        workgroupUserHintText?: string;

        /**
         * The content of the floating label.
         */
        workgroupUserLabelText?: string;

        /**
         * If true, the workgroup user will be disabled. Default valuse is false
         */
        workgroupUserDisabled?: boolean;
        workgroupUserDisableSearch?: boolean;

        /**
         * If true, the workgroup will be visible. Default valuse is true.
         */
        workgroupVisible?: boolean;

        /**
         * If true, the workgroup user will be visible. Default valuse is true.
         */
        workgroupUserVisible?: boolean;

        /**
         * If true an item will push to the first row of the parameter list. Default is value is false.
         */
        isAllOptionIncluded?: boolean;

        /**
         * If isAllOptionIncluded is true. Default value is 'Hepsi'
         */
        allOptionDescription?: string;

        /**
         * Callback function fires when the fec has been selected.
         */
        onWorkgroupSelect?: (workgroup: any) => void;

        /**
         * Callback function fires when the fec has been selected.
         */
        onWorkgroupUserSelect?: (workgroupUser: any) => void;

        /**
         * If true, use first element as default
         */
        useFirstElementAsDefault?: boolean;

        /**
         * Determines the workgroup that is currently selected.
         */
        defaultSelectedWorkgroupId?: number;
    }

    interface BWorkgroupUserComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BWorkgroupUserComponent extends __BComponent.BComponetBase<BWorkgroupUserComponentProps, BWorkgroupUserComponentInstance> { }

}

declare module 'b-workgroup-user-component' {
    export import BWorkgroupUserComponent = __BWorkgroupUserComponent.BWorkgroupUserComponent;
    export default BWorkgroupUserComponent;
}