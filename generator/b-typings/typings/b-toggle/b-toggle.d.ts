
declare namespace __BToggle {
    interface BToggleProps extends __BComponent.BComponentProps {
        defaultToggled?: boolean;
        disabled?: boolean;
        elementStyle?: any;
        iconStyle?: any;
        inputStyle?: any;
        label?: React.ReactNode;
        labelPosition?: "left" | "right";
        labelStyle?: any;
        onToggle?: (event: Object, value: boolean) => void;
        rippleStyle?: any;
        style?: React.CSSProperties;
        thumbStyle?: any;
        thumbSwitchedStyle?: any;
        toggled?: boolean;
        trackStyle?: any;
        trackSwitchedStyle?: any;
        valueLink?: any;
    }

    interface BToggleInstance extends __BComponent.BComponentInstance {
      resetValue(): void;
    }

    export class BToggle extends __BComponent.BComponetBase<BToggleProps, BToggleInstance> { }
}

declare module 'b-toggle' {
    export import BToggle = __BToggle.BToggle;
    export default BToggle;
}
