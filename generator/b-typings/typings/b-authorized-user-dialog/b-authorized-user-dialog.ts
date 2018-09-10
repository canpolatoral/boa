
declare namespace __AuthorizedUserDialog {
    interface AuthorizedUserDialogProps extends __BComponent.BComponentProps {
        resourceInfo?: any;
        resourceCode?: string;
        instanceId?: any;
    }


    export class AuthorizedUserDialog extends __BComponent.BComponetBase<AuthorizedUserDialogProps> {
        static showAuthorizedUser: (context: any, instanceStateId?: number, stateName?: string, workflowResourceId?: number, transactionWorkgroupId?: number, ownerWorkgroupId?: number) => void;
    }

}


declare module 'b-authorized-user-dialog' {
    export import AuthorizedUserDialog = __AuthorizedUserDialog.AuthorizedUserDialog;
    export default AuthorizedUserDialog;
}