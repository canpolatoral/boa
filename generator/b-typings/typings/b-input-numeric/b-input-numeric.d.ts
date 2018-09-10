
declare namespace __BInputNumeric {
    interface BInputNumericProps extends __BComponent.BComponentProps {
        defaultValue?: number;
        value?: number;
        format?: string;
        maxLength?: any;
        onFocus?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onBlur?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onChange?: (e: any, value: any) => void;
        hintText?: string;
        errorText?: string;
        floatingLabelText?: string;
        setValue?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
        timerDuration?: number;
        onTimerFinished?: () => void;
        disabled?: boolean;
        suffixText?: string;
        maxValue?: number;
        minValue?: number;
        style?: React.CSSProperties;
        valueConstraint?: any;
        fullWidth?: boolean;
        outerStyle?: any;
		inputStyle?: any;
    }

    interface BInputNumericInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        resetValue(): void;
        focus?: () => void;
    }

    export class BInputNumeric extends __BComponent.BComponetBase<BInputNumericProps, BInputNumericInstance> { }
}

declare module 'b-input-numeric' {
    export import BInputNumeric = __BInputNumeric.BInputNumeric;
    export default BInputNumeric;
}
