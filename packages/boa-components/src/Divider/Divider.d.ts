import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface DividerProps extends ComponentBaseProps {
  inset?: boolean;
  style?: React.CSSProperties;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DividerInstance extends ComponentBaseInstance {
// }

export default class Divider extends ComponentBase<DividerProps, ComponentBaseInstance> {}
