
declare namespace __BActionButton {
    interface BActionButtonProps extends __BComponent.BComponentProps {
        action: any;
        disabled?: boolean;
        onClick?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
    }

    interface BActionButtonInstance extends __BComponent.BComponentInstance {
    }

    export class BActionButton extends __BComponent.BComponetBase<BActionButtonProps, BActionButtonInstance> { }
}

declare module 'b-action-button' {
    export import BActionButton = __BActionButton.BActionButton;
    export default BActionButton;
}