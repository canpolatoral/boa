
declare namespace __BDataTable {
    interface BDataTableProps extends __BComponent.BComponentProps {
        columns?: any;
        dataSource?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        allRowsSelected?: boolean;
        bodyStyle?: any;
        children?: React.ReactNode;
        className?: string;
        fixedFooter?: boolean;
        fixedHeader?: boolean;
        footerStyle?: any;
        headerStyle?: any;
        height?: string;
        multiSelectable?: boolean;
        onCellClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onCellHover?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onCellHoverExit?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onRowHover?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onRowHoverExit?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onRowSelection?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        selectable?: boolean;
        style?: React.CSSProperties;
        wrapperStyle?: any;
        showRowHover?: boolean;
    }

    interface BDataTableInstance extends __BComponent.BComponentInstance {
    }

    export class BDataTable extends __BComponent.BComponetBase<BDataTableProps, BDataTableInstance> { }
}

declare module 'b-data-table' {
    export import BDataTable = __BDataTable.BDataTable;
    export default BDataTable;
}