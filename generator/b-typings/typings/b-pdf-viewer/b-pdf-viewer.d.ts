declare namespace _BPdfViewer {
    interface BPdfViewerProps extends __BComponent.BComponentProps {
        fileUrl: string,
        pdfContainerHeight: number
    }

    interface BPdfViewerInstance extends __BComponent.BComponentInstance {
    }

    export class BPdfViewer extends __BComponent.BComponetBase<BPdfViewerProps, BPdfViewerInstance> { }
}

declare module "b-pdf-viewer" {
    export import BPdfViewer = _BPdfViewer.BPdfViewer;
    export default BPdfViewer;
}