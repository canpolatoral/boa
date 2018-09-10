
declare namespace __BComboBox {
    interface BComboBoxProps extends __BComponent.BComponentProps {
        style?: React.CSSProperties;
        value?: any[];
        text?: any; // TODO: propType handle edilemedi.
        name?: string;
        hintText?: string;
        labelText?: string;
        multiSelect?: boolean;
        multiColumn?: boolean;
        disableSearch?: boolean;
        disabled?: boolean;
        displayMemberPath?: any; // TODO: propType handle edilemedi.
        valueMemberPath?: string;
        displayLabelSeperator?: string;
        isAllOptionIncluded?: boolean;
        allOptionText?: string;
        allOptionValue?: any;
        fullWidth?: boolean;
        errorText?: string;
        columns?: any[];
        defaultValue?: any;
        dataSource: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        autocompleteFilter?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        displaySelectionsRenderer?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onSelect?: (selectedIndexes: any[], selectedItems: any[], selectedValues: any[]) => void;
        inputOnBlur?: () => void;
        onCheck?: (event: Object, isInputChecked: boolean) => void;
        onClose?: () => void;
        showCheckBox?: boolean;
        isCheckBoxChecked?: boolean;
        inputValue?: string;
        isVisible?: boolean;
        valueConstraint?: any;
    }

    interface BComboBoxInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        resetValue(): void;
    }

    export class BComboBox extends __BComponent.BComponetBase<BComboBoxProps, BComboBoxInstance> { }
}

declare module 'b-combo-box' {
    export import BComboBox = __BComboBox.BComboBox;
    export default BComboBox;
}