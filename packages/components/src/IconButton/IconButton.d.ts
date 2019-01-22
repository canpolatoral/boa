import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

export interface IconButtonProps extends ComponentBaseProps {
  tooltip?: string;
  fontIcon?: string;
  svgIcon?: string;
  onClick?: (event: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  iconStyle?: any;
  style?: React.CSSProperties;
  dynamicIcon?: any;
  iconProperties?: any;
  disabled?: any;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface IconButtonInstance extends ComponentBaseInstance {
// }

export default class IconButton extends ComponentBase<IconButtonProps, ComponentBaseInstance> {}
