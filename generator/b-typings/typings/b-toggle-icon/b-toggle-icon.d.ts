
declare namespace __BToggleIcon {
    interface BToggleIconProps extends __BComponent.BComponentProps {
        defaultToggled?: boolean;
        disabled?: boolean;
        elementStyle?: any;
        iconStyle?: any;
        inputStyle?: any;
        label?: React.ReactNode;
        labelPosition?: "left" | "right";
        labelStyle?: any;
        onToggle?: (event: Object, value: boolean) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        rippleStyle?: any;
        style?: React.CSSProperties;
        thumbStyle?: any;
        thumbSwitchedStyle?: any;
        toggled?: boolean;
        trackStyle?: any;
        trackSwitchedStyle?: any;
        valueLink?: any;
        title?: string;
        iconPath?: string;
    }

    interface BToggleIconInstance extends __BComponent.BComponetBase<BToggleIconProps> {
    }

    export class BToggleIcon extends __BComponent.BComponetBase<BToggleIconProps, BToggleIconInstance> { }
}

declare module 'b-toggle-icon' {
    export import BToggleIcon = __BToggleIcon.BToggleIcon;
    export default BToggleIcon;
}