import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface ListItemProps extends ComponentBaseProps {
  button?: boolean;
  children?: any;
  classes: any;
  className?: string;
  component?: any;
  ContainerComponent?: any;
  ContainerProps?: any;
  dense?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  divider?: boolean;
  selected?: boolean;
  primaryText: string;
  secondaryText?: string;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface ListItemInstance extends ComponentBaseInstance {
// }

export default class ListItem extends ComponentBase<ListItemProps, ComponentBaseInstance> {}
