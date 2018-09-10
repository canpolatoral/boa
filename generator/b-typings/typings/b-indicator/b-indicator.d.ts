
declare namespace __BIndicator {
    interface BIndicatorProps extends __BComponent.BComponentProps {
        color?: string;
        left: number;
        loadingColor?: string;
        percentage?: number;
        size?: number;
        status?: any; // tip handle edilemedi. özelleştirilebilir
        style?: React.CSSProperties;
        top: number;
    }

    interface BIndicatorInstance extends __BComponent.BComponentInstance {
    }

    export class BIndicator extends __BComponent.BComponetBase<BIndicatorProps, BIndicatorInstance> { }
}

declare module 'b-indicator' {
    export import BIndicator = __BIndicator.BIndicator;
    export default BIndicator;
}