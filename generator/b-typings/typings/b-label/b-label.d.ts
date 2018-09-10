
declare namespace __BLabel {
    interface BLabelProps extends __BComponent.BComponentProps {
        text?: string;
        style?: React.CSSProperties;
        textAlign?: string;
    }

    interface BLabelInstance extends __BComponent.BComponentInstance {
    }

    export class BLabel extends __BComponent.BComponetBase<BLabelProps, BLabelInstance> { }
}

declare module 'b-label' {
    export import BLabel = __BLabel.BLabel;
    export default BLabel;
}