import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

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

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface CheckBoxInstance extends ComponentBaseInstance {
// }

export default class CheckBox extends ComponentBase<CheckBoxProps, ComponentBaseInstance> {}
