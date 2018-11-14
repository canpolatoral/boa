import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

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
}

export interface InputMaskInstance extends ComponentBaseInstance {
  getValue(): any;
  resetValue(): void;
  focus?: () => void;
}

export default class InputMask extends ComponentBase<InputMaskProps, InputMaskInstance> {}
