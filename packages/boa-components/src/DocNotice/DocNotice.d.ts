import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface DocNoticeProps extends ComponentBaseProps {
  content: string;
  fitMode: boolean;
  header: string;
  type: 'info' | 'tip' | 'warning' | 'error';
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DocNoticeInstance extends ComponentBaseInstance {
// }

export default class DocNotice extends ComponentBase<DocNoticeProps, ComponentBaseInstance> {}
