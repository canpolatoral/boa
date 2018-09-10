
declare namespace __BCardSection {
    interface BCardSectionProps extends __BComponent.BComponentProps {
        cardPadding?: number;
        thresholdColumnCount?: number;
        contentAlignMode?: number;
        thresholdWidth?: number;
        disableCardWidth?: boolean;
        cellStyles?: any;
        enableSortOnMobile?: boolean;
    }

    interface BCardSectionInstance extends __BComponent.BComponentInstance {
    }

    export class BCardSection extends __BComponent.BComponetBase<BCardSectionProps, BCardSectionInstance> { }
}

declare module 'b-card-section' {
    export import BCardSection = __BCardSection.BCardSection;
    export default BCardSection;
}