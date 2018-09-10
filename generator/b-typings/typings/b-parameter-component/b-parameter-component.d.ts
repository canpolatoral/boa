
declare namespace __BParameterComponent {
    interface BParameterComponentProps extends __BComponent.BComponentProps {

        /**
         * The paramType of your component.
         */
        paramType?: string;

        /**
         * Determines the columns of the parameter component.
         */
        paramColumns?: any;

        /**
         * Determines the parameter that is currently selected.
         */
        selectedParamCode?: string;

        defaultSelectedParamCode?: string;

        /**
         * Sort the parameters. Available options is BParameterComponent.SortOption.Code,
         * BParameterComponent.SortOption.Description, BParameterComponent.SortOption.Value
         */
        sortOption?: any;

        /**
         * The collection of paramType.
         * @type {arrayOf string}
         */
        paramTypeList?: any;

        /**
         * Filter the parameters by param code
         */
        paramCode?: string;

        /**
         * Filter the parameters by param date
         */
        paramDate?: string;

        /**
         * Filter the parameters by param value
         */
        paramValue?: string;

        /**
         * Filter the parameters by param value 2
         */
        paramValue2Filter?: string;

        /**
         * Filter the parameters by param value 3
         */
        paramValue3Filter?: string;

        /**
         * Filter the parameters by param value 4
         */
        paramValue4Filter?: string;

        /**
         * Filter the parameters by param value 5
         */
        paramValue5Filter?: string;

        /**
         * Filter the parameters by param value 6
         */
        paramValue6Filter?: string;

        /**
         * Filter the parameters by param value 7
         */
        paramValue7Filter?: string;

        /**
         * If true an item will push to the first row of the parameter list. Default is value is false.
         */
        isAllOptionIncluded?: boolean;

        /**
         * If isAllOptionIncluded is true.. Default value is 'Hepsi'
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
        labelText?: string;

        errorText?: string;

        /**
         * Display the search input field top of the fec component.
         */
        disableSearch?: boolean;

        /**
         * If true; the parameter component will be disabled
         */
        disabled?: boolean;

        /**
         * Display your chosen column on parameter component. Default column is 'paramDescription'
         */
        displayMemberPath?: string;

        /**
         * Callback function fires when the parameter has been selected.
         */
        onParameterSelect?: (selectedParameter: BOA.Types.Kernel.General.ParameterContract) => void;

        inputOnBlur?: () => void;
        onCheck?: (event: Object, isInputChecked: boolean) => void;
        showCheckBox?: boolean;
        isCheckBoxChecked?: boolean;
        inputValue?: string;

        /**
        * If false; the parameter component will be collapsed. Default True
        */
        isVisible?: boolean;
    }

    interface BParameterComponentInstance extends __BComponent.BComponentInstance {
        /**
         * Set selected parameter by paramcode
         * @param {any} paramCode
         */
        setSelectedParamCodeByCode(paramCode: string): void;

        /**
         * Set the Parameters by parameterList
         * @param parameterList
         * @param props
         */
        setValues(paramList: BOA.Types.Kernel.General.ParameterContract[]): void;

        /**
         * Returns the list of parameters
         * @returns {*}
         */
        getValues(): BOA.Types.Kernel.General.ParameterContract[];

        /**
         * Sort the parameters. Available options is BParameterComponent.SortOption.Code,
         * BParameterComponent.SortOption.Description, BParameterComponent.SortOption.Value
         * @param sortOption
         */
        sortValues(sortOption: number): void;
        resetValue(): void;
    }

    export class BParameterComponent extends __BComponent.BComponetBase<BParameterComponentProps, BParameterComponentInstance> { }
}

declare module 'b-parameter-component' {
    export import BParameterComponent = __BParameterComponent.BParameterComponent;
    export default BParameterComponent;
}