
declare namespace __BAutoComplete {
    interface BAutoCompleteProps extends __BComponent.BComponentProps {
        animated?: boolean;
        open?: boolean;
        fullWidth?: boolean;
        hintText?: string;
        floatingLabelText?: string;
        dataSource?: any;
        listStyle?: any;
        maxSearchResults?: number;
        textFieldStyle?: any;
        animation?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        filter?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onNewRequest?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onUpdateInput?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        errorText?: string;
        errorStyle?: any;
    }

    interface BAutoCompleteInstance extends __BComponent.BComponentInstance {
    }

    export class BAutoComplete extends __BComponent.BComponetBase<BAutoCompleteProps, BAutoCompleteInstance> { }
}

declare module 'b-auto-complete' {
    export import BAutoComplete = __BAutoComplete.BAutoComplete;
    export default BAutoComplete;
}