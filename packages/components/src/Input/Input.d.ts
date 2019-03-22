import * as React from 'react';
import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface InputProps extends ComponentBaseProps {
  snapshot?: any;
  size?: any; // TODO: propType handle edilemedi.
  newLine?: boolean;
  type?: string;
  id?: string;
  defaultValue?: string;
  value?: string;
  maxLength?: any;
  onFocus?: (e: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  onBlur?: (e: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  onChange?: (e: object, value: string) => void;
  onClearClick?: (e: any) => void;
  onKeyDown?: (e: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  onBeforeInput?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  hintText?: string;
  errorText?: string;
  helperText?: string;
  floatingLabelText?: string;
  floatingLabelFixed?: boolean;
  inputStyle?: any;
  disabled?: boolean;
  fullWidth?: boolean;
  multiLine?: boolean;
  rows?: number;
  rowsMax?: number;
  textareaStyle?: any;
  noWrap?: boolean;
  isVisible?: boolean;
  errorStyle?: any;
  floatingLabelFocusStyle?: any;
  floatingLabelStyle?: any;
  hintStyle?: any;
  name?: string;
  showClearButton: boolean;
  style?: React.CSSProperties;
  underlineDisabledStyle?: any;
  underlineFocusStyle?: any;
  underlineShow?: boolean;
  underlineStyle?: any;
  setValue?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  timerDuration?: number;
  onTimerFinished?: () => void;
  valueConstraint?: any;
}

export interface InputInstance extends ComponentBaseInstance {
  getValue(): any;
  resetValue(): void;
  focus?: () => void;
}

export default class Input extends ComponentBase<InputProps, InputInstance> { }
