
declare namespace __BTimePicker {
    interface BTimePickerProps extends __BComponent.BComponentProps {
        value?: any;
        onChange?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        hintText?: string;
        mode?: any; // tip handle edilemedi. özelleştirilebilir
        errorText?: string;
        floatingLabelText?: string;
        disabled?: boolean;
        format?: any; // tip handle edilemedi. özelleştirilebilir
        autoOk?: boolean;
        cancelLabel?: string;
        okLabel?: string;
    }

    interface BTimePickerInstance extends __BComponent.BComponentInstance {
    }

    export class BTimePicker extends __BComponent.BComponetBase<BTimePickerProps, BTimePickerInstance> { }
}

declare module 'b-time-picker' {
    export import BTimePicker = __BTimePicker.BTimePicker;
    export default BTimePicker;
}