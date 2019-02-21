import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface LabelProps extends ComponentBaseProps {
  text?: string;
  style?: React.CSSProperties;
  textPosition?: string;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface LabelInstance extends ComponentBaseInstance {
// }

export default class Label extends ComponentBase<LabelProps, ComponentBaseInstance> {}
