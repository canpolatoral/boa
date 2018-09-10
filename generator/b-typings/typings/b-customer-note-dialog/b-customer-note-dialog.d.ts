
declare namespace __BCustomerNote {
    interface BCustomerNoteProps extends __BComponent.BComponentProps {
        note?: any;
    }

    interface BCustomerNoteInstance extends __BComponent.BComponentInstance {
    }

    export class BCustomerNote extends __BComponent.BComponetBase<BCustomerNoteProps, BCustomerNoteInstance> { }
}

declare module 'b-customer-note-dialog' {
    export import BCustomerNote = __BCustomerNote.BCustomerNote;
    export default BCustomerNote;
}