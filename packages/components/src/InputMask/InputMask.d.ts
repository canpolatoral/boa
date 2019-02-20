import * as React from 'react';
import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface InputMaskProps extends ComponentBaseProps {
  defaultValue?: string;
  value?: string;
  onFocus?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onBlur?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onChange?: (e: object, value: string) => void;
  hintText?: string;
  mask?: string;
  type?: string;
  errorText?: string;
  floatingLabelText?: string;
  valueConstraint?: any;
  maxLength?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

export interface InputMaskInstance extends ComponentBaseInstance {
  getValue(): any;
  resetValue(): void;
  focus?: () => void;
}

export default class InputMask extends ComponentBase<InputMaskProps, InputMaskInstance> {}
