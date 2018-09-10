declare namespace __BBusinessDateTimeComponent {
    interface BBusinessDateTimeComponentProps extends __BComponent.BComponentProps {
        minDate?: any; // TODO: propType handle edilemedi.
        maxDate?: any; // TODO: propType handle edilemedi.
        value?: any; // TODO: propType handle edilemedi.
        defaultValue?: any; // TODO: propType handle edilemedi.
        canSelectOldDates?: boolean;
        canSelectWeekendDays?: boolean;
        canSelectSpecialDays?: boolean;
        disabled?: boolean;
        mode?: string;
        onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        dateOnChange?: (event: any, value: any) => void;
        timeOnChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        errorTextDate?: string;
        errorTextTime?: string;
        floatingLabelTextDate?: string;
        floatingLabelTextTime?: string;
        hintTextDate?: string;
        hintTextTime?: string;
        cancelLabel?: string;
        okLabel?: string;
        format?: string;
        pageType?: "browse" | "transactional";
        valueConstraint?: any;

    }

    interface BBusinessDateTimeComponentInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        resetValue(): void;
    }

    export class BBusinessDateTimeComponent extends __BComponent.BComponetBase<BBusinessDateTimeComponentProps, BBusinessDateTimeComponentInstance> { }
}

declare module 'b-business-datetime-component' {
    export import BBusinessDateTimeComponent = __BBusinessDateTimeComponent.BBusinessDateTimeComponent;
    export default BBusinessDateTimeComponent;
}