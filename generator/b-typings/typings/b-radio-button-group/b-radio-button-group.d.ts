
declare namespace __BRadioButtonGroup {
    interface BRadioButtonGroupProps extends __BComponent.BComponentProps {
        children?: React.ReactNode;
        headerText?: string,
        className?: string;
        disableRipple?: string;
        defaultSelected?: any;
        labelPosition?: string;
        name: string;
        valueSelected?: any;
        onChange?: (e: any, selected: any) => void;
        style?: React.CSSProperties;
        items?: any;
        direction?: string;
    }

    interface BRadioButtonGroupInstance extends __BComponent.BComponentInstance {
    }

    export class BRadioButtonGroup extends __BComponent.BComponetBase<BRadioButtonGroupProps, BRadioButtonGroupInstance> { }
}

declare module 'b-radio-button-group' {
    export import BRadioButtonGroup = __BRadioButtonGroup.BRadioButtonGroup;
    export default BRadioButtonGroup;
}
