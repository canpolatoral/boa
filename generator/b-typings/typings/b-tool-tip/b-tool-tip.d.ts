
declare namespace __BToolTip {
    interface BToolTipProps extends __BComponent.BComponentProps {
        children?: React.ReactNode;
        style?: React.CSSProperties;
        theme?: any;
        tooltip?: React.ReactNode;
        tooltipPosition?: "down" | "up" | "right" | "left";
        tooltipStyle?: any;
    }

    interface BToolTipInstance extends __BComponent.BComponentInstance {
    }

    export class BToolTip extends __BComponent.BComponetBase<BToolTipProps, BToolTipInstance> { }
}

declare module 'b-tool-tip' {
    export import BToolTip = __BToolTip.BToolTip;
    export default BToolTip;
}