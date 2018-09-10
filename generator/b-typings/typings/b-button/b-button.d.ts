
declare namespace __BButton {
    interface BButtonProps extends __BComponent.BComponentProps {
        type: string;
        text?: string;
        textPosition?: string;
        mini?: boolean;
        textStyle?: any;
        tooltip?: string;
        fontIcon?: string;
        svgIcon?: string;
        iconProperties?: any;
        colorType?: string;
        style?: React.CSSProperties;
        backgroundColor?: string;
        disabled?: boolean;
        onClick?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli;
        fullWidth?: boolean;
        dynamicIcon?: string;
        allowLabelCase?: boolean;
        buttonSize?: string;
    }

    interface BButtonInstance extends __BComponent.BComponentInstance {
    }

    export class BButton extends __BComponent.BComponetBase<BButtonProps, BButtonInstance> { }
}

declare module 'b-button' {
    export import BButton = __BButton.BButton;
    export default BButton;
}
