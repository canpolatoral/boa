declare namespace __BDateTimePicker {
    interface BDateTimePickerProps extends __BComponent.BComponentProps {
        minDate?: any; // TODO: propType handle edilemedi.
        maxDate?: any; // TODO: propType handle edilemedi.
        value?: any; // TODO: propType handle edilemedi.
        defaultValue?: any; // TODO: propType handle edilemedi.
        onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        dateOnChange?: (event: any, value: any) => void;
        timeOnChange?: (event: any, value: any) => void;
        hintTextDate?: string;
        hintTextTime?: string;
        floatingLabelTextDate?: string;
        floatingLabelTextTime?: string;
        firstDayOfWeek?: number;
        mode?: string;
        cancelLabel?: string;
        okLabel?: string;
        isBusiness?: boolean;
        format?: string;
        canSelectOldDates?: boolean;
        canSelectWeekendDays?: boolean;
        canSelectSpecialDays?: boolean;
        disabled?: boolean;
        errorTextDate?: string;
        errorTextTime?: string;
        pageType?: "browse" | "transactional";
        valueConstraint?: any;
    }

    interface BDateTimePickerInstance extends __BComponent.BComponentInstance {
        getValue(): any
    }

    export class BDateTimePicker extends __BComponent.BComponetBase<BDateTimePickerProps, BDateTimePickerInstance> { }
}

declare module 'b-datetime-picker' {
    export import BDateTimePicker = __BDateTimePicker.BDateTimePicker;
    export default BDateTimePicker;
}