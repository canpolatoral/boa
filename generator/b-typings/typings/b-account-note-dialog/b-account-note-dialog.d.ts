
declare namespace __BAccountNote {
    interface BAccountNoteProps extends __BComponent.BComponentProps {
        accountNumber?: any;
    }

    interface BAccountNoteInstance extends __BComponent.BComponentInstance {
    }

    export class BAccountNote extends __BComponent.BComponetBase<BAccountNoteProps, BAccountNoteInstance> { }
}

declare module 'b-account-note-dialog' {
    export import BAccountNote = __BAccountNote.BAccountNote;
    export default BAccountNote;
}
