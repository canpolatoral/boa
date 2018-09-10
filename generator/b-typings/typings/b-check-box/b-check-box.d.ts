
declare namespace __BCheckBox {
    interface BCheckBoxProps extends __BComponent.BComponentProps {
        label?: string;
        defaultChecked?: boolean;
        disabled?: boolean;
        checked?: boolean;
        labelPosition?: any; // tip handle edilemedi. özelleştirilebilir
        style?: React.CSSProperties;
        checkedIcon?: any;
        iconStyle?: any;
        inputStyle?: any;
        labelStyle?: any;
        uncheckedIcon?: any;
        onCheck?: (event: Object, isInputChecked: boolean) => void;
    }

    interface BCheckBoxInstance extends __BComponent.BComponentInstance {
    }

    export class BCheckBox extends __BComponent.BComponetBase<BCheckBoxProps, BCheckBoxInstance> { }
}

declare module 'b-check-box' {
    export import BCheckBox = __BCheckBox.BCheckBox;
    export default BCheckBox;
}