
declare namespace __BToolkit {
    interface BToolkitProps extends __BComponent.BComponentProps {
        onClosing?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        isSingleElement?: boolean;
    }

    interface BToolkitInstance extends __BComponent.BComponentInstance {
    }

    export class BToolkit extends __BComponent.BComponetBase<BToolkitProps, BToolkitInstance> { }
}

declare module 'b-toolkit' {
    export import BToolkit = __BToolkit.BToolkit;
    export default BToolkit;
}