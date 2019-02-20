import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface DocViewerProps extends ComponentBaseProps {
  content: string;
  editorType?:
    | 'androidStudio'
    | 'atomOneDark'
    | 'atomOneLight'
    | 'github'
    | 'monokaiSublime'
    | 'raiinbow'
    | 'vs'
    | 'xcode';
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DocViewerInstance extends ComponentBaseInstance {
// }

export default class DocViewer extends ComponentBase<DocViewerProps, ComponentBaseInstance> {}
