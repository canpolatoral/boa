
declare namespace __BListItem {
    interface BListItemProps extends __BComponent.BComponentProps {
        button?: boolean,
        /**
         * The content of the component.
         */
        children?: any,
        /**
         * Useful to extend the style applied to components.
         */
        classes: any,
        /**
         * @ignore
         */
        className?: string,
        /**
         * The component used for the root node.
         * Either a string to use a DOM element or a component.
         * By default, it's a `li` when `button` is `false` and a `div` when `button` is `true`.
         */
        component?: any,
        /**
         * The container component. Useful when a `ListItemSecondaryAction` is rendered.
         */
        ContainerComponent?: any,
        /**
         * Properties applied to the container element when the component
         * is used to display a `ListItemSecondaryAction`.
         */
        ContainerProps?: any,
        /**
         * If `true`, compact vertical padding designed for keyboard and mouse input will be used.
         */
        dense?: boolean,
        /**
         * @ignore
         */
        disabled?: boolean,
        /**
         * If `true`, the left and right padding is removed.
         */
        disableGutters?: boolean,
        /**
         * If `true`, a 1px light border is added to the bottom of the list item.
         */
        divider?: boolean,
    
        selected?: boolean,
        primaryText: string,
        secondaryText?: string,
    }

    interface BListItemInstance extends __BComponent.BComponentInstance {
       
    }

    export class BListItem extends __BComponent.BComponetBase<BListItemProps, BListItemInstance> { }
}

declare module 'b-list-item' {
    export import BListItem = __BListItem.BListItem;
    export default BListItem;
}