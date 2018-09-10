
declare namespace __BThirdPartySaveDialog {
    interface BThirdPartySaveDialogProps extends __BComponent.BComponentProps {
        onCloseDialog: () => void;
    }

    interface BThirdPartySaveDialogInstance extends __BComponent.BComponentInstance {
    }

    export class BThirdPartySaveDialog extends __BComponent.BComponetBase<BThirdPartySaveDialogProps, BThirdPartySaveDialogInstance> { }
}

declare module 'b-third-party-save-dialog' {
    export import BThirdPartySaveDialog = __BThirdPartySaveDialog.BThirdPartySaveDialog;
    export default BThirdPartySaveDialog;
}