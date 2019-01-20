import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@boa/base';

export interface Content {
  id: string;
  level: number;
  content: string;
  children: Content[];
}

export interface DocTocProps extends ComponentBaseProps {
  activeItem?: string;
  content: Content[];
  linkOnClick?: (id: string) => void;
  style?: object;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DocTocInstance extends ComponentBaseInstance {
// }

export default class DocToc extends ComponentBase<DocTocProps, ComponentBaseInstance> {}
