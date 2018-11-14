import ComponentBase,
{
  ComponentBaseInstance,
  ComponentBaseProps
} from '../../base/ComponentBase';

export interface InputActionProps extends ComponentBaseProps {
  type?: string;
  defaultValue?: string;
  value?: string;
  maxLength?: any;
  onFocus?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onBlur?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onChange?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  onKeyDown?: (e: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  isError?: boolean;
  hintText?: string;
  errorText?: string;
  floatingLabelText?: string;
  rightIconList?: any; // tip handle edilemedi. özelleştirilebilir
  leftIconList?: any; // tip handle edilemedi. özelleştirilebilir
  rightIconEvents?: any; // tip handle edilemedi. özelleştirilebilir
  timerDuration?: number;
  onTimerFinished?: () => void;
  valueConstraint?: any;
  inputDisabled?: boolean;

}

export interface InputActionInstance extends ComponentBaseInstance {
  getValue(): any;
  resetValue(): void;
  focus?: () => void;
}

export default class InputAction extends ComponentBase<InputActionProps, InputActionInstance> { }
