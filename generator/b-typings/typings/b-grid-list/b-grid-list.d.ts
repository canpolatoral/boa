
declare namespace __BGridList {
    interface BGridListProps extends __BComponent.BComponentProps {
        cellHeight?: any; // tip handle edilemedi. özelleştirilebilir
        children?: React.ReactNode;
        cols?: number;
        padding?: number;
        style?: React.CSSProperties;
    }

    interface BGridListInstance extends __BComponent.BComponentInstance {
    }

    export class BGridList extends __BComponent.BComponetBase<BGridListProps, BGridListInstance> { }
}

declare module 'b-grid-list' {
    export import BGridList = __BGridList.BGridList;
    export default BGridList;
}