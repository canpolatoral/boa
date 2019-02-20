import * as React from 'react';
import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface IconMenuProps extends ComponentBaseProps {
  iconType: 'vertical' | 'horizontal' | 'custom';
  customIcon?: any;
  items: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
  anchorOrigin?: any;
  animated?: boolean;
  className?: string;
  iconStyle?: any;
  menuStyle?: any;
  multiple?: boolean;
  open?: boolean;
  style?: React.CSSProperties;
  targetOrigin?: any;
  touchTapCloseDelay?: number;
  useLayerForClickAway?: boolean;
  onChange?: (parameters?: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli!
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface IconMenuInstance extends ComponentBaseInstance {
// }

export default class IconMenu extends ComponentBase<IconMenuProps, ComponentBaseInstance> {}
