
declare namespace __BSelectListBox {
    interface BSelectListBoxProps extends __BComponent.BComponentProps {
        name?: string;
        hintText?: string;
        dataSource: any;
        disabled?: boolean;
        minHeight?: string;
        maxHeight?: string;
        defaultChecked?: boolean;
        isDynamicSearch?: boolean;
        defaultLoadedDataSize?: number;
        onKeyPress?: (e: any, t: string) => void; // aram işleminde enter ile aramayı gerçeklşetirir. 
        onChange?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
    }

    interface BSelectListBoxInstance extends __BComponent.BComponentInstance {

        /// Aranan metni döndürü
        getSearchText(): string;

        /// seçili dataları döndürü
        getCheckedBoxList(): any[];

        /// reset all component
        reset(): void;

        /// reset search text
        resetSearchText(): void;

        /// reset checkbox list
        resetCheckBoxList(): void;

        setCheckBoxList(list: any[]): void;
    }

    export class BSelectListBox extends __BComponent.BComponetBase<BSelectListBoxProps, BSelectListBoxInstance> { }
}

declare module 'b-select-list-box' {
    export import BSelectListBox = __BSelectListBox.BSelectListBox;
    export default BSelectListBox;
}