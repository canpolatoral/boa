import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface LinearPanelProps extends ComponentBaseProps {
  children?: React.ReactNode;
  padding?: number;
  orientation?: any; // tip handle edilemedi. özelleştirilebilir
  style?: React.CSSProperties;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface LinearPanelInstance extends ComponentBaseInstance {
// }

export default class LinearPanel extends ComponentBase<LinearPanelProps, ComponentBaseInstance> {}
