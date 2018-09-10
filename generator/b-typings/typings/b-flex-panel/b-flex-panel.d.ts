
declare namespace __BFlexPanel {
    interface BFlexPanelProps extends __BComponent.BComponentProps {
        style?: any; // TODO: propType handle edilemedi.
        children?: any; // TODO: propType handle edilemedi.
        responsive?: any; // TODO: propType handle edilemedi.
        alignContent?: "center" | "flex-end" | "flex-start" | "space-around" | "space-between" | "stretch";
        alignItems?: "baseline" | "center" | "flex-end" | "flex-start" | "stretch";
        direction?: "horizontal" | "vertical";
        alignment?: "center" | "left" | "right" | "spaceBetween" | "spaceAround";
        isVisible?: boolean;
    }

    interface BFlexPanelInstance extends __BComponent.BComponentInstance {
    }

    export class BFlexPanel extends __BComponent.BComponetBase<BFlexPanelProps, BFlexPanelInstance> { }
}

declare module 'b-flex-panel' {
    export import BFlexPanel = __BFlexPanel.BFlexPanel;
    export default BFlexPanel;
}