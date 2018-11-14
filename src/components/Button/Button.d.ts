import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface ButtonProps extends ComponentBaseProps {
  type: string;
  text?: string;
  textPosition?: string;
  mini?: boolean;
  textStyle?: any;
  tooltip?: string;
  fontIcon?: string;
  svgIcon?: string;
  iconProperties?: any;
  colorType?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  dynamicIcon?: string;
  allowLabelCase?: boolean;
  buttonSize?: string;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface ButtonInstance extends ComponentBaseInstance {
// }

export default class Button extends ComponentBase<ButtonProps, ComponentBaseInstance> {}
