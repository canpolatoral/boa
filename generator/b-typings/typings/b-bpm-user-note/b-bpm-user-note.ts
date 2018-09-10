
declare namespace __BUserNote {
    interface BUserNoteProps extends __BComponent.BComponentProps {
        resourceInfo?: any;
        resourceCode?: string;
        instanceId?: any;
    }

    interface BUserNoteInstance extends __BComponent.BComponetBase<BUserNoteProps> {
    }

    export class BUserNote extends __BComponent.BComponetBase<BUserNoteProps, BUserNoteInstance> {
        static showNote: (context: any, instanceId?: number) => void;
    }
}


declare module 'b-bpm-user-note' {
    export import BUserNote = __BUserNote.BUserNote;
    export default BUserNote;
}