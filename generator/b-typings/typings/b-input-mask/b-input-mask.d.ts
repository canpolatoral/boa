
declare namespace __BInputMask {
    interface BInputMaskProps extends __BComponent.BComponentProps {
        defaultValue?: string;
        value?: string;
        onFocus?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onBlur?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onChange?: (e: Object, value: string) => void;
        hintText?: string;
        mask?: string;
        type?: string;
        errorText?: string;
        floatingLabelText?: string;
        valueConstraint?: any;
		maxLength?: number;
		disabled?: boolean;
    }

    interface BInputMaskInstance extends __BComponent.BComponentInstance {
    }

    export class BInputMask extends __BComponent.BComponetBase<BInputMaskProps, BInputMaskInstance> { }
}

declare module 'b-input-mask' {
    export import BInputMask = __BInputMask.BInputMask;
    export default BInputMask;
}