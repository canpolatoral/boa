
declare namespace __BVirtualizedList {
    interface BVirtualizedListProps extends __BComponent.BComponentProps {

      /** An array containing custom data. A user defines the access to this data. Refer to Data Accessors for details. */
      dataSource: Array<any>;


       /** fixedWidth prop. defualt 3*/
      overscanRowCount?: number,

       /** A React node used to render row detail content. */
      rowRenderer: (activeRow: any, otherProps: any, context: any) => React.ReactNode;

      /**
      * Used to estimate the total height of a List before all of its rows have actually been measured.
      * The estimated total height is adjusted as rows are rendered.
      * default 36
      */
      estimatedRowSize: number,

      /** rowHeight properties.. https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md#cellmeasurercache  */
      cacheProperties?: any,
    }

    interface BVirtualizedListInstance extends __BComponent.BComponentInstance {
    }

    export class BVirtualizedList extends __BComponent.BComponetBase<BVirtualizedListProps, BVirtualizedListInstance> {

      /** Clear cached row height and forceUpdate */
      clearAllRowHeight?: () => void;
    }
}

declare module 'b-virtualized-list' {
    export import BVirtualizedList = __BVirtualizedList.BVirtualizedList;
    export default BVirtualizedList;
}
