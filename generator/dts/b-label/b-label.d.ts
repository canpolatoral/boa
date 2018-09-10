
declare namespace __BLabel {
    import React = __React;
    interface BLabelProps extends __BComponent.BComponentProps {
        text?: string;
        style?: React.CSSProperties;
        maxWidth?: number;
        minFontSize?: number;
        maxFontSize?: number;
    }

    export class BLabel extends  __BComponent.BComponetBase<BLabelProps> {
    }
}

declare module 'b-label' {
    export import BLabel = __BLabel.BLabel;
    export default BLabel;
}