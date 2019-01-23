import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

export interface DialogProps extends ComponentBaseProps {
  actions?: React.ReactNode;
  actionsContainerClassName?: string;
  actionsContainerStyle?: any;
  autoDetectWindowHeight?: boolean;
  autoScrollBodyContent?: boolean;
  bodyClassName?: string;
  bodyStyle?: any;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: any;
  modal?: boolean;
  onRequestClose?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  open: boolean;
  overlayClassName?: string;
  overlayStyle?: any;
  repositionOnUpdate?: boolean;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  titleClassName?: string;
  titleStyle?: any;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DialogInstance extends ComponentBaseInstance {
// }

export default class Dialog extends ComponentBase<DialogProps, ComponentBaseInstance> {}
