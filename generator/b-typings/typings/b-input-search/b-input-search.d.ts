
declare namespace __BInputSearch {
    interface BInputSearchProps extends __BComponent.BComponentProps {
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
        hintStyle?: any;
        valueConstraint?: any;
    }

    interface BInputSearchInstance extends __BComponent.BComponentInstance {
    }

    export class BInputSearch extends __BComponent.BComponetBase<BInputSearchProps, BInputSearchInstance> { }
}

declare module 'b-input-search' {
    export import BInputSearch = __BInputSearch.BInputSearch;
    export default BInputSearch;
}