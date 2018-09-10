
declare namespace __BScroll {
    interface BScrollProps extends __BComponent.BComponentProps {
        allowOuterScroll?: boolean;
        heightRelativeToParent?: string;
        onScroll?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        addScrolledClass?: boolean;
        freezePosition?: boolean;
        handleClass?: string;
        minScrollHandleHeight?: number;
        flex?: string;
        rtl?: boolean;
    }

    interface BScrollInstance extends __BComponent.BComponetBase<BScrollProps> {
    }

    export class BScroll extends __BComponent.BComponetBase<BScrollProps, BScrollInstance> { }
}

declare module 'b-scroll' {
    export import BScroll = __BScroll.BScroll;
    export default BScroll;
}