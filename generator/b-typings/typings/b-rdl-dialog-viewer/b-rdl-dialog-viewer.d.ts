declare namespace _BRDLDialogViewer {
    export class BRDLDialogViewer {
        static showRDL: (context: any, displayName: string, reportPath: string, reportParameters: any, reportDatasources: any, dialogResponseStyle: any, onClose: any) => void;
    }
}

declare module "b-rdl-dialog-viewer" {
    export import BRDLDialogViewer = _BRDLDialogViewer.BRDLDialogViewer;
}