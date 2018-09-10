
declare namespace __BTreeViewGrid {
    interface BTreeViewGridProps extends __BComponent.BComponentProps {
        style?: Object,
        data: any,
        selectedNodeId: number,
        disabled: boolean,
        onItemChanged: (selectedNode: any) => void

    }

    interface BTreeViewGridInstance extends __BComponent.BComponentInstance {
    }

    export class BTreeViewGrid extends __BComponent.BComponetBase<BTreeViewGridProps, BTreeViewGridInstance> { }
}

declare module 'b-treeview-grid' {
    export import BTreeViewGrid = __BTreeViewGrid.BTreeViewGrid;
    export default BTreeViewGrid;
}