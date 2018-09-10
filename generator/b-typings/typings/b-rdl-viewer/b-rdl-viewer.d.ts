declare namespace _BRDLViewer {
    interface BRDLViewerProps extends __BComponent.BComponentProps {
        isOpenFromDialog?: Boolean,
        reportPath: string,
        reportParameters: any,
        reportDatasources: any,
        onComplete?: Function
    }

    interface BRDLViewerInstance extends __BComponent.BComponentInstance {
    }

    export class BRDLViewer extends __BComponent.BComponetBase<BRDLViewerProps, BRDLViewerInstance> { }
}

declare module "b-rdl-viewer" {
    export import BRDLViewer = _BRDLViewer.BRDLViewer;
    export default BRDLViewer;
}