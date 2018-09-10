
declare namespace __IIBComponent {
    import React = __React;
    interface IIBComponentProps extends __BComponent.BComponentProps {
        context: any;
        snapshot?: any;
        disabled?: boolean;
        valueConstraint?: any;
        size?: any; // TODO: propType handle edilemedi.
        newLine?: boolean;
        isVisible?: boolean;
        style?: React.CSSProperties;
        defaultValue?: any[];
        value?: any[];
        text?: any; // TODO: propType handle edilemedi.
        name?: string;
        hintText?: string;
        labelText?: string;
        multiSelect?: boolean;
        multiColumn?: boolean;
        disableSearch?: boolean;
        displayMemberPath?: string;
        valueMemberPath?: string;
        displayLabelMemberPath?: string[];
        displayLabelSeperator?: string;
        isAllOptionIncluded?: boolean;
        allOptionText?: string;
        allOptionValue?: any;
        fullWidth?: boolean;
        errorText?: string;
        columns?: any[];
        dataSource: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        autocompleteFilter?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        displaySelectionsRenderer?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onSelect?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onClose?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onCheck?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        showCheckBox?: boolean;
        isCheckBoxChecked?: boolean;
        inputOnBlur?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        inputValue?: string;
    }

    export class IIBComponent extends  __BComponent.BComponetBase<IIBComponentProps> {
    }
}

declare module 'b-combo-box' {
    export import IIBComponent = __IIBComponent.IIBComponent;
    export default IIBComponent;
}