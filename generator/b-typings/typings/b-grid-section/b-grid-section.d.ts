
declare namespace __BGridSection {
    interface BGridSectionProps extends __BComponent.BComponentProps {
        children?: any;
        columnPadding?: number;
        rowPadding?: number;
    }

    interface BGridSectionInstance extends __BComponent.BComponentInstance {
    }

    export class BGridSection extends __BComponent.BComponetBase<BGridSectionProps, BGridSectionInstance> { }
}

declare module 'b-grid-section' {
    export import BGridSection = __BGridSection.BGridSection;
    export default BGridSection;
}