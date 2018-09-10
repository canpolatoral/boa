
declare namespace __BImage {
    interface BImageProps extends __BComponent.BComponentProps {
        src?: string;
        style?: React.CSSProperties;
    }

    interface BImageInterface extends __BComponent.BComponentInstance {
    }

    export class BImage extends __BComponent.BComponetBase<BImageProps, BImageInterface> { }
}

declare module 'b-image' {
    export import BImage = __BImage.BImage;
    export default BImage;
}