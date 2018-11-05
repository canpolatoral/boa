import ComponentBase,
{
  ComponentBaseProps,
  ComponentBaseInstance
} from '../base/ComponentBase'

interface ButtonProps extends ComponentBaseProps {
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

interface ButtonInstance extends ComponentBaseInstance {
}

export class Button extends ComponentBase<ButtonProps, ButtonInstance> { }

