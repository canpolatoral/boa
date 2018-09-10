declare namespace __BCustomDataGrid {
    interface BCustomDataGridProps extends __BComponent.BComponentProps {
        dataSource?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        headerBarOptions?: any; // TODO: propType handle edilemedi.
        treeDataOptions?: any; // TODO: propType handle edilemedi.
        columns?: any;
        buttonList?: any[];
        height?: any;
        sortable?: boolean;
        groupable?: boolean;
        filterable?: boolean;
        columnMenu?: boolean;
        reordable?: boolean;
        resizable?: boolean;
        sorting?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        grouping?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        filters?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        selectable?: string ;
        multiSelection?: boolean;
        selectedIndexes?: any;
        useNotVirtualization?: boolean;
        showGrid?: boolean;
        onRowSelectionChanged?: (dataItem:any, selectedIndex:number,isSelected:boolean) => void; // TODO: method parametre ve dönüş tipi eklenmeli! // TODO: method parametre ve dönüş tipi eklenmeli!
        isInsideTheCard?: boolean;
        rowStyle?: (item: any, context: any) => any;  // TODO: method parametre ve dönüş tipi eklenmeli!
        onRowDoubleClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
        columnsDefaultWidth?: number;
        onRowUpdated?: (updateInfo: UpdatedInfo) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
        columnWidths?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        width?: number;
        scrollable?: any;
        editable?: boolean;
        autoFit?: boolean;
        rowTemplate?: any;
        group?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        aggregate?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        onFooterClicked?: (button?: any) => void;
    }

    interface BCustomDataGridInstance extends __BComponent.BComponentInstance {
        getSelectedRowIndexes: () => number[];
        addNewRow?: (row?: any) => void;
        getDataSource?: () => any[];
        deleteRows?: (row?: any[]) => void;
        getSelectedItems?: () => any[];
        setSelectedRowIndexes?:(index : number[]) => void;
        refreshGrid?: () => void;
        getUserSettings?: () => any;
    }

    export class BCustomDataGrid extends __BComponent.BComponetBase<BCustomDataGridProps, BCustomDataGridInstance> { 
        getDataSource?: () => any[];
    }
}

interface UpdatedInfo {
    rowIdx: number,
    updated: Object
  }

declare module 'b-custom-data-grid' {
    export import BCustomDataGrid = __BCustomDataGrid.BCustomDataGrid;
    export default BCustomDataGrid;
}
