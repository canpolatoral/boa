
declare namespace __BBranchComponent {
    interface BBranchComponentProps extends __BComponent.BComponentProps {

        /**
         * Determines the branch that is currently selected
         */
        selectedBranchId?: number;

        /**
         * If isUnitsSelectable is true sub branches will be show.
         */
        isUnitsSelectable?: boolean;

        /**
         * The sub branch that is currently selected.
         */
        selectedBranchUnitId?: number;

        /**
         * If true an item will push to the first index of the branch list. Default is value is false.
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
        labelText?: string;

        /**
         * The hint content to display of the unit branches.
         */
        hintTextUtil?: string;

        /**
         * The content of the floating label of the unit branches.
         */
        labelTextUtil?: string;

        /**
         * If true; the Branch component will be disabled.
         */
        disabled?: boolean;
        disableSearch?: boolean;

        /**
         * Display your chosen column on branch component. Default column is 'name'
         */
        displayMemberPath?: string;

        /**
         * Display your chosen column on sub branch. Default column is 'name'
         */
        displayMemberPathUtil?: string;

        /**
         * Kullanıcı diğer şubeleri normalde seçebilir; ancak bu değer false olursa
         * 99 nolu şubedeki kişiler HARİÇ (Eğer IsOtherBranchesChooseableForGM = true ise)
         */
        isOtherBranchesChooseable?: boolean;

        /**
         * Şube serbest bölge filtresi atmak için kullanılır. null: hepsi;
         * 0: Serbest bölge harici şubeler; 1: Serbest bölge şubeleri. Varsayılan null.
         */
        isInFreeZone?: number;

        /**
         * Bileşende kullanılan şube listesinde BranchRegion filtresi atmak için kullanılan değişken. Varsayılan null.
         */
        branchRegion?: number;

        /**
         * Bileşende kullanılan şube listesinde ReginalOffice filtresi atmak için kullanılan değişken.
         * Varsayılan null.
         */
        reginalOffice?: number;

        /**
         * Bu değer eğer true olarak atanırsa kullanıcının yetkili olduğu şubeler bileşende gösterilmektedir.
         * Default değer false.
         */
        branchType?: string;

        /**
         * Bu değer eğer true olarak atanırsa kullanıcının yetkili olduğu şubeler bileşende gösterilmektedir.
         * Default değer false.
         */
        workGroupSync?: boolean;

        /**
         * Determines the branches of the selected customer.
         */
        customerId?: number;

        /**
         * Determines whether the information will be read from the cache when the information is fetched.
         * Default value is true.
         */
        isCacheEnabled?: boolean;

        /**
         * IsOtherBranchesChooseable = false olduğu durumlarda bu değer true ise şube combosu değiştirilebilir;
         * false ise şube combosu değiştirilemez.
         */
        isOtherBranchesChooseableForGM?: boolean;

        /**
         * Callback function fired when the branch item is selected
         */
        onBranchSelect?: (selectedBranch: BOA.Common.Types.BranchContract) => void;


        /**
         * Callback function fired when the sub branch item is selected
         */
        onSubBranchSelect?: (value: BOA.Common.Types.BranchUnitContract) => void;

        /**
         * Sort the branchs. Available options is BBranchComponent.SortOption.Code; BBranchComponent.SortOption.Name
         * @type {string, number}
         */
        sortOption?: any;
        /**
         * Horizontal or vetical mode of component.
         * @type {'horizontal', 'vertical'}
         */
        mode?: string;
    }

    interface BBranchComponentInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        resetValue(): void;
    }

    export class BBranchComponent extends __BComponent.BComponetBase<BBranchComponentProps, BBranchComponentInstance> { }
}

declare module 'b-branch-component' {
    export import BBranchComponent = __BBranchComponent.BBranchComponent;
    export default BBranchComponent;
}