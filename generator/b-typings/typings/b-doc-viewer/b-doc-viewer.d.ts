declare namespace __BDocViewer {
    interface BDocViewerProps extends __BComponent.BComponentProps {
        content?: any;
    }
    interface BDocViewerInstance extends __BComponent.BComponentInstance {

    }

    export class BDocViewer extends __BComponent.BComponetBase<BDocViewerProps, BDocViewerInstance> { }
}

declare module 'b-doc-viewer' {
    export import BDocViewer = __BDocViewer.BDocViewer;
    export default BDocViewer;
}