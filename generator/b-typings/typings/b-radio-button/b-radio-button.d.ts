
declare namespace __BRadioButton {
    interface BRadioButtonProps extends __BComponent.BComponentProps {
        label?: string;
        labelPosition?:string;
        iconStyle?: React.CSSProperties;
        labelStyle?: React.CSSProperties;
        content?: React.ReactElement<any>;
        checked: boolean,
        defaultChecked: boolean,
        disabled?: boolean;
        style?: React.CSSProperties;
        checkedIcon?: React.ReactElement<any>;
        uncheckedIcon?: React.ReactElement<any>;
        id?:string;
        value?: any;
        disableRipple?: string;
        onChange?: (event: object, checked: boolean) => void;
        name?:string;
    }

    interface BRadioButtonInstance extends __BComponent.BComponentInstance {
    }

    export class BRadioButton extends __BComponent.BComponetBase<BRadioButtonProps, BRadioButtonInstance> { }
}

declare module 'b-radio-button' {
    export import BRadioButton = __BRadioButton.BRadioButton;
    export default BRadioButton;
}
