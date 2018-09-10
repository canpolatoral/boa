
declare namespace __BTab {
    interface BTabProps extends __BComponent.BComponentProps {
        className?: string;
        icon?: React.ReactNode;
        index?: any;
        label?: React.ReactNode;
        onActive?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        selected?: boolean;
        style?: React.CSSProperties;
        value?: any;
        width?: string;
    }

    interface BTabInstance extends __BComponent.BComponentInstance {
    }

    export class BTab extends __BComponent.BComponetBase<BTabProps, BTabInstance> { }
}

declare module 'b-tab' {
    export import BTab = __BTab.BTab;
    export default BTab;
}