declare namespace __BFlowDoc {
    interface BFlowDocProps extends __BComponent.BComponentProps {
        content?: any;
    }

    interface BFlowDocInstance extends __BComponent.BComponentInstance {

    }

    export class BFlowDoc extends __BComponent.BComponetBase<BFlowDocProps, BFlowDocInstance> { }
}

declare module 'b-flow-doc' {
    export import BFlowDoc = __BFlowDoc.BFlowDoc;
    export default BFlowDoc;
}