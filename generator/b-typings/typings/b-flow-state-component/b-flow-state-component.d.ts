
declare namespace __BFlowStateComponent {
    interface BFlowStateComponentProps extends __BComponent.BComponentProps {
        selectedStateId?: number;
        selectedFlowId?: number;
        stateVisible?: boolean;
    }

    interface BFlowStateComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BFlowStateComponent extends __BComponent.BComponetBase<BFlowStateComponentProps, BFlowStateComponentInstance> { }
}

declare module 'b-flow-state-component' {
    export import BFlowStateComponent = __BFlowStateComponent.BFlowStateComponent;
    export default BFlowStateComponent;
}