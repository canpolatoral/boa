declare namespace __BDataGrid {
    interface BDataGridProps extends __BComponent.BComponentProps {
        columns?: any; // TODO: propType handle edilemedi.
        dataSource?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        rowGetter?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
        rowsCount?: number;
        enableRowSelect?: boolean;
        showCheckbox?: boolean;
        enableCellSelect?: boolean;
        rowHeight?: number;
        minHeight?: number;
        editable?: boolean;
        rowScrollTimeout?: number;
        onRowUpdated?: (updateInfo: UpdatedInfo) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
        onRowSelectionChanged?: (dataItem:any, selectedIndex:number,isSelected:boolean) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
        multiSelection?: boolean;
        headerBarOptions?: any; // TODO: propType handle edilemedi.
        height?: any;
        selectable?: string;
        columnMenu?: boolean;
        scrollable?: any;
        subGridProperties?: any;
        group?: any[];
        aggregate?: any[];
        autoFit?: boolean;
        userSettings?: any;
    }

    interface BDataGridInstance extends __BComponent.BComponentInstance {
        getSelectedRowIndexes: () => number[];
        addNewRow?: (row?: any) => void;
        getDataSource?: () => any[];
        deleteRows?: (row?: any[]) => void;
        getSelectedItems?: () => any[];
        refreshGrid?: () => void;
        getUserSettings?: () => any;
    }

    export class BDataGrid extends __BComponent.BComponetBase<BDataGridProps, BDataGridInstance> {
      getDataSource?: () => any[];
    }
}

interface UpdatedInfo {
    rowIdx: number,
    updated: Object
}

declare module 'b-data-grid' {
    export import BDataGrid = __BDataGrid.BDataGrid;
    export default BDataGrid;
}
