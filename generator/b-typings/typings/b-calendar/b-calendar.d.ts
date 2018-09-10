
declare namespace __BCalendarPicker {
    interface BCalendarPickerProps extends __BComponent.BComponentProps {
        value?: any; // TODO: propType handle edilemedi.
        defaultValue?: any; // TODO: propType handle edilemedi.
        disabled?: boolean;
        mode?: string;
        onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        floatingLabelTextDate?: string;
        format?: string;
        pageType?: "browse" | "transactional";
        valueConstraint?: any;
    }

    interface BCalendarPickerInstance extends __BComponent.BComponentInstance {
        getValue(): any;
    }

    export class BCalendarPicker extends __BComponent.BComponetBase<BCalendarPickerProps, BCalendarPickerInstance> { }
}

declare module 'b-calendar-picker' {
    export import BCalendarPicker = __BCalendarPicker.BCalendarPicker;
    export default BCalendarPicker;
}