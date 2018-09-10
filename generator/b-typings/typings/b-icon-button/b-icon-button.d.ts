
declare namespace __BIconButton {
    interface BIconButtonProps extends __BComponent.BComponentProps {
        tooltip?: string;
        fontIcon?: string;
        svgIcon?: string;
        onClick?: (event: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        iconStyle?: any;
        style?: React.CSSProperties;
        dynamicIcon?: any;
        iconProperties?: any;
        disabled?: any
    }

    interface BIconButtonInstance extends __BComponent.BComponentInstance {
    }

    export class BIconButton extends __BComponent.BComponetBase<BIconButtonProps, BIconButtonInstance> { }
}

declare module 'b-icon-button' {
    export import BIconButton = __BIconButton.BIconButton;
    export default BIconButton;
}