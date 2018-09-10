
declare namespace __BCard {
    interface BCardProps extends __BComponent.BComponentProps {
        column?: number;
        children?: React.ReactNode;
        containerStyle?: any;
        expandable?: boolean;
        expanded?: boolean;
        initiallyExpanded?: boolean;
        onExpandChange?: (expanded:boolean) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        style?: any;
        disabled?: boolean;
        disableGridBehaviour?: boolean;
        title?: string,
        isTitleVisible?: boolean,
        actionList?: Array<any>,
        padding?: any,
        headerContent?: any;
        mobileSortOrder?: number;
    }

    interface BCardInstance extends __BComponent.BComponentInstance {
    }

    export class BCard extends __BComponent.BComponetBase<BCardProps, BCardInstance> { }
}

declare module 'b-card' {
    export import BCard = __BCard.BCard;
    export default BCard;
}