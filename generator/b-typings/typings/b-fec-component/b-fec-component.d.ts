
declare namespace __BFECComponent {
    interface BFECComponentProps extends __BComponent.BComponentProps {

        /**
         * Determines the FEC that is currently selected.
         */
        selectedFECId?: number;


        /**
         * [isMultiple description]
         */
        isMultiple?: boolean;

        /**
         * [selectedFECIdList description]
         * @type {[type]}
         */
        selectedFECIdList?: any;

        /**
        * [defaultSelectedFECIdList description] nullable 
        * @type {[type]}
        */
        defaultSelectedFECIdList?: any;
        /**
         * Filter the FECs by given fec Ids.
         * @type {arrayOf number}
         */
        fECIdList?: any;

        /**
         * Filter the FECs by given fecCodes
         * @type {arrayOf string}
         */
        fECCodeList?: any;



        /**
         * Filter the FECs by given fec groups
         * @type {arrayOf number}
         */
        fECGroupList?: any;

        /**
         * If true an item will push to the first row of the FEC list. Default value is false.
         */
        isAllOptionIncluded?: boolean;

        /**
         * If isAllOptionIncluded is true. Default value is 'Hepsi'
         */
        allOptionDescription?: string;

        /**
         * If isAllOptionIncluded is true.. Default value is '-1'
         */
        allOptionValue?: any;

        /**
         * The hint content to display.
         */
        hintText?: string;

        /**
         * The content of the floating label.
         */
        labelText: string;

        /**
         * Display the search input field top of the fec component.
         */
        disableSearch?: boolean;

        /**
         * If true; the FEC component will be disabled. Default valuse is false
         */
        disabled?: boolean;

        /**
         * Display your chosen column on fec component. Default column(displayMemberPath) is 'fecName'
         */
        displayMemberPath?: string;

        /**
         * Sort the FECs. Available options is BFECComponent.SortOption.Code; BFECComponent.SortOption.Name; BFECComponent.SortOption.Id
         * @type {oneOfType([string; number])}
         */
        sortOption?: any;

        /**
         * Default value is null
         */
        inUse?: number;

        /**
         * Default value is null
         */
        timeDepositeAccount?: number;

        /**
         * Default value is null
         */
        demandDepositeAccount?: number;

        /**
         * Filter the FECs by given isForward. Default value is null.
         */
        isForward?: boolean;
        usageCode?: string;

        /**
         * Callback function fires when the fec has been selected.
         */
        onFECSelect?: (selectedFEC: any) => void;
    }

    interface BFECComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BFECComponent extends __BComponent.BComponetBase<BFECComponentProps, BFECComponentInstance> { }
}

declare module 'b-fec-component' {
    export import BFECComponent = __BFECComponent.BFECComponent;
    export default BFECComponent;
}