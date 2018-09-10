
declare namespace __BLinearPanel {
    interface BLinearPanelProps extends __BComponent.BComponentProps {
        children?: React.ReactNode;
        padding?: number;
        orientation?: any; // tip handle edilemedi. özelleştirilebilir
        style?: React.CSSProperties;
    }

    interface BLinearPanelInstance extends __BComponent.BComponentInstance {
    }

    export class BLinearPanel extends __BComponent.BComponetBase<BLinearPanelProps, BLinearPanelInstance> { }
}

declare module 'b-linear-panel' {
    export import BLinearPanel = __BLinearPanel.BLinearPanel;
    export default BLinearPanel;
}