import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

export interface CheckBoxProps extends ComponentBaseProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  checked?: boolean;
  labelPosition?: any; // tip handle edilemedi. özelleştirilebilir
  style?: React.CSSProperties;
  checkedIcon?: any;
  iconStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  uncheckedIcon?: any;
  onCheck?: (event: object, isInputChecked: boolean) => void;
}

export default class CheckBox extends ComponentBase<CheckBoxProps, ComponentBaseInstance> {}
