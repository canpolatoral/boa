
declare namespace __BProgress {
    interface BProgressProps extends __BComponent.BComponentProps {
        progressType?: any; // tip handle edilemedi. özelleştirilebilir
        color?: 'primary' | 'secondary' | 'inherit';
        max?: number;
        min?: number;
        mode?: any; // tip handle edilemedi. özelleştirilebilir
        size?: number;
        style?: React.CSSProperties;
        thickness?: number;
        value?: number;
    }

    interface BProgressInstance extends __BComponent.BComponentInstance {
    }

    export class BProgress extends __BComponent.BComponetBase<BProgressProps, BProgressInstance> { }
}

declare module 'b-progress' {
    export import BProgress = __BProgress.BProgress;
    export default BProgress;
}