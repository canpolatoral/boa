import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

export interface PopoverProps extends ComponentBaseProps {
  anchorEl?: any;
  isOriginSetted?: boolean;
  anchorOrigin?: any;
  animated?: boolean;
  animation?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  autoCloseWhenOffScreen?: boolean;
  canAutoPosition?: boolean;
  children?: any;
  className?: string;
  onRequestClose?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  open?: boolean;
  style?: React.CSSProperties;
  targetOrigin?: any;
  useLayerForClickAway?: boolean;
  zDepth?: 0 | 1 | 2 | 3 | 4 | 5;
  isResizable?: boolean;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface PopoverInstance extends ComponentBaseInstance {
// }

export default class Popover extends ComponentBase<PopoverProps, ComponentBaseInstance> {}
