
declare namespace __BInput {
    interface BInputProps extends __BComponent.BComponentProps {
        snapshot?: any;
        size?: any; // TODO: propType handle edilemedi.
        newLine?: boolean;
        type?: string;
        id?: string;
        defaultValue?: string;
        value?: string;
        maxLength?: any;
        onFocus?: (e: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onBlur?: (e: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onChange?: (e: Object, value: string) => void;
        onKeyDown?: (e: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        onBeforeInput?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        hintText?: string;
        errorText?: string;
        helperText?: string;
        floatingLabelText?: string;
        floatingLabelFixed?: boolean;
        inputStyle?: any;
        disabled?: boolean;
        fullWidth?: boolean;
        multiLine?: boolean;
        rows?: number;
        rowsMax?: number;
        textareaStyle?: any;
        noWrap?: boolean;
        isVisible?: boolean;
        errorStyle?: any;
        floatingLabelFocusStyle?: any;
        floatingLabelStyle?: any;
        hintStyle?: any;
        name?: string;
        style?: React.CSSProperties;
        underlineDisabledStyle?: any;
        underlineFocusStyle?: any;
        underlineShow?: boolean;
        underlineStyle?: any;
        setValue?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        timerDuration?: number;
        onTimerFinished?: () => void;
        valueConstraint?: any;
		inlineGridMode?:boolean;
    }

    interface BInputInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        resetValue(): void;
        focus?: () => void;
    }

    export class BInput extends __BComponent.BComponetBase<BInputProps, BInputInstance> { }
}
declare module 'b-input' {
    export import BInput = __BInput.BInput;
    export default BInput;
}