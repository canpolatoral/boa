
declare namespace __BExpander {
    interface BExpanderProps extends __BComponent.BComponentProps {
        headerStyle?: any;
        contentStyle?: any;
        icon?: string;
        header?: any;
        children?: any;
        isExpanded?: boolean;
        onChange?: (event: object, expanded: boolean) => void;
    }

    interface BExpanderInstance extends __BComponent.BComponentInstance {
        expand(): void;
        collapse(): void;
    }

    export class BExpander extends __BComponent.BComponetBase<BExpanderProps, BExpanderInstance> { }
}

declare module 'b-expander' {
    export import BExpander = __BExpander.BExpander;
    export default BExpander;
}