
declare namespace __BStoredProcedureViewer {
    interface BStoredProcedureViewerProps extends __BComponent.BComponentProps {
        selectedSpName: string,
        selectedParameters: any[]
    }

    interface BStoredProcedureViewerInstance extends __BComponent.BComponetBase<BStoredProcedureViewerProps> {
        getValue(): any;
    }

    export class BStoredProcedureViewer extends __BComponent.BComponetBase<BStoredProcedureViewerProps, BStoredProcedureViewerInstance> { }
}

declare module 'b-stored-procedure-viewer' {
    export import BStoredProcedureViewer = __BStoredProcedureViewer.BStoredProcedureViewer;
    export default BStoredProcedureViewer;
}