
declare namespace __BInputAction {
    interface BInputActionProps extends __BComponent.BComponentProps {
        type?: string;
        defaultValue?: string;
        value?: string;
        maxLength?: any;
        onFocus?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onBlur?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onChange?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onKeyDown?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        isError?: boolean;
        hintText?: string;
        errorText?: string;
        floatingLabelText?: string;
        rightIconList?: any; // tip handle edilemedi. özelleştirilebilir
        leftIconList?: any; // tip handle edilemedi. özelleştirilebilir
        rightIconEvents?: any; // tip handle edilemedi. özelleştirilebilir
        timerDuration?: number;
        onTimerFinished?: () => void;
        valueConstraint?: any;
        inputDisabled?:boolean;
    }

    interface BInputActionInstance extends __BComponent.BComponentInstance {
        getValue(): string;
        resetValue(): void;
        focus?: () => void;
    }

    export class BInputAction extends __BComponent.BComponetBase<BInputActionProps, BInputActionInstance> { }
}

declare module 'b-input-action' {
    export import BInputAction = __BInputAction.BInputAction;
    export default BInputAction;
}
