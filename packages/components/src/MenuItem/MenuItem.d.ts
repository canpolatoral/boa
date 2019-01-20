import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface MenuItemProps extends ComponentBaseProps {
  checked?: boolean;
  disabled?: boolean;
  focusState?: any; // tip handle edilemedi. özelleştirilebilir
  insetChildren?: boolean;
  leftIcon?: React.ReactElement<any>;
  menuItems?: React.ReactNode;
  onTouchTap?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  itemSelected?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  primaryText?: React.ReactNode;
  rightIcon?: React.ReactElement<any>;
  secondaryText?: React.ReactNode;
  style?: React.CSSProperties;
  innerDivStyle?: any;
  value?: any;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface MenuItemInstance extends ComponentBaseInstance {
// }

export default class MenuItem extends ComponentBase<MenuItemProps, ComponentBaseInstance> {}
