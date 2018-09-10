
declare namespace __BDynamicActionEdit {
    interface BDynamicActionEditProps extends __BComponent.BComponentProps {
        designerType: string;
        model: any;
    }

    interface BDynamicActionEditInstance extends __BComponent.BComponentInstance {
        getModel(): any;
        getValues(): any;
    }

    export class BDynamicActionEdit extends __BComponent.BComponetBase<BDynamicActionEditProps, BDynamicActionEditInstance> { }
}

declare module 'b-dynamic-action-edit' {
    export import BDynamicActionEdit = __BDynamicActionEdit.BDynamicActionEdit;
    export default BDynamicActionEdit;
}