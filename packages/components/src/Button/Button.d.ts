import * as React from 'react';
import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

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

export default class Button extends ComponentBase<ButtonProps, ComponentBaseInstance> { }
