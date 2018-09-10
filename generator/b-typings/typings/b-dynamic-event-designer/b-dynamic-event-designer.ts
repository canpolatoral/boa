
declare namespace __BDynamicEventDesigner {
    interface BDynamicEventDesignerProps extends __BComponent.BComponentProps {
        eventData?: any;
        onEventDataChanged?: (eventData: any) => void;
        componentPropertySource?: any;
    }


    interface BDynamicEventDesignerInstance extends __BComponent.BComponentInstance {

    }

    export class BDynamicEventDesigner extends __BComponent.BComponetBase<BDynamicEventDesignerProps, BDynamicEventDesignerInstance> { }
}


declare module 'b-dynamic-event-designer' {
    export import BDynamicEventDesigner = __BDynamicEventDesigner.BDynamicEventDesigner;
    export default BDynamicEventDesigner;
}