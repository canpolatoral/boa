
declare namespace __BTreeViewDataGrid {
    interface BTreeViewDataGridProps extends __BComponent.BComponentProps {
        style?: React.CSSProperties;
        data?: any; // TODO: propType handle edilemedi.
        selectedNodeId?: number;
        disabled?: boolean;
        height?: string;
        width?: string;
        onToggle?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
    }

    interface BTreeViewDataGridInstance extends __BComponent.BComponentInstance {
    }

    export class BTreeViewDataGrid extends __BComponent.BComponetBase<BTreeViewDataGridProps, BTreeViewDataGridInstance> { }
}

declare module 'b-treeview-data-grid' {
    export import BTreeViewDataGrid = __BTreeViewDataGrid.BTreeViewDataGrid;
    export default BTreeViewDataGrid;
}