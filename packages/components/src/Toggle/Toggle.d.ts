import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

export interface ToggleProps extends ComponentBaseProps {
  defaultToggled?: boolean;
  disabled?: boolean;
  elementStyle?: any;
  iconStyle?: any;
  inputStyle?: any;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'right';
  labelStyle?: any;
  onToggle?: (event: object, value: boolean) => void;
  rippleStyle?: any;
  style?: React.CSSProperties;
  thumbStyle?: any;
  thumbSwitchedStyle?: any;
  toggled?: boolean;
  trackStyle?: any;
  trackSwitchedStyle?: any;
  valueLink?: any;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface ToggleInstance extends ComponentBaseInstance {
// }

export default class Toggle extends ComponentBase<ComponentBaseProps, ComponentBaseInstance> {}
