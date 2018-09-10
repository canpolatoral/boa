
declare namespace __BDivider {
    interface BDividerProps extends __BComponent.BComponentProps {
        inset?: boolean;
        style?: React.CSSProperties;
    }

    interface BDividerInstance extends __BComponent.BComponentInstance {
    }

    export class BDivider extends __BComponent.BComponetBase<BDividerProps, BDividerInstance> { }
}

declare module 'b-divider' {
    export import BDivider = __BDivider.BDivider;
    export default BDivider;
}