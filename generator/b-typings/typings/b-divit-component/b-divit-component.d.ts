
declare namespace __BDivitComponent {
    interface BDivitComponentProps extends __BComponent.BComponentProps {
        divitId?: any;
        instanceId?: any;
        editorMode?: any;
    }

    interface BDivitComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BDivitComponent extends __BComponent.BComponetBase<BDivitComponentProps, BDivitComponentInstance> { }
}

declare module 'b-divit-component' {
    export import BDivitComponent = __BDivitComponent.BDivitComponent;
    export default BDivitComponent;
}