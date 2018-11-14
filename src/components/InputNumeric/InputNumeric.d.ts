import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface InputNumericProps extends ComponentBaseProps {
  defaultValue?: number;
  value?: number;
  format?: string;
  maxLength?: any;
  onFocus?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onBlur?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onChange?: (e: any, value: any) => void;
  hintText?: string;
  errorText?: string;
  floatingLabelText?: string;
  setValue?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  timerDuration?: number;
  onTimerFinished?: () => void;
  disabled?: boolean;
  suffixText?: string;
  maxValue?: number;
  minValue?: number;
  style?: React.CSSProperties;
  valueConstraint?: any;
  fullWidth?: boolean;
  outerStyle?: any;
  inputStyle?: any;
}

export interface InputNumericInstance extends ComponentBaseInstance {
  getValue(): any;
  resetValue(): void;
  focus?: () => void;
}

export default class InputNumeric extends ComponentBase<InputNumericProps, InputNumericInstance> {}
