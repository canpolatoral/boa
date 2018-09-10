
declare namespace __BList {
    interface BListProps extends __BComponent.BComponentProps {
        children?: any,
        /**
         * Useful to extend the style applied to components.
         */
        classes: Object,
        /**
         * @ignore
         */
        className?: string,
        /**
         * The component used for the root node.
         * Either a string to use a DOM element or a component.
         */
        component?: any,
        /**
         * If `true`, compact vertical padding designed for keyboard and mouse input will be used for
         * the list and list items. The property is available to descendant components as the
         * `dense` context.
         */
        dense?: boolean,
        /**
         * If `true`, vertical padding will be removed from the list.
         */
        disablePadding?: boolean,

                /**
         * @ignore
         */
        disabled?: boolean,
        
        /**
         * The content of the subheader, normally `ListSubheader`.
         */
        subheader?: any,
        items?: any[],
        onItemClick?: (item: any) => void; 
    }

    interface BListInstance extends __BComponent.BComponentInstance {
 
    }

    export class BList extends __BComponent.BComponetBase<BListProps, BListInstance> { }
}

declare module 'b-list' {
    export import BList = __BList.BList;
    export default BList;
}