
declare namespace __BGridRow {
    interface BGridRowProps extends __BComponent.BComponentProps {
        children?: any;
        columnPadding?: number;
        rowPadding?: number;
        columnCount?: number;
        rowIndex?: number;
    }

    interface BGridRowInstance extends __BComponent.BComponentInstance {
    }

    export class BGridRow extends __BComponent.BComponetBase<BGridRowProps, BGridRowInstance> { }
}

declare module 'b-grid-row' {
    export import BGridRow = __BGridRow.BGridRow;
    export default BGridRow;
}