
declare namespace __BFileInput {
    interface BFileInputProps extends __BComponent.BComponentProps {
        as?: "binary" | "buffer" | "text" | "url";
        children?: any;
        onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        id?: string;
        multiple?: boolean;
    }

    interface BFileInputInstance extends __BComponent.BComponentInstance {
    }

    export class BFileInput extends __BComponent.BComponetBase<BFileInputProps, BFileInputInstance> { }
}

declare module 'b-file-input' {
    export import BFileInput = __BFileInput.BFileInput;
    export default BFileInput;
}