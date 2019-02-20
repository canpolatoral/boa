import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface DocCodeProps extends ComponentBaseProps {
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
  highlight: boolean;
  lang: string;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DocCodeInstance extends ComponentBaseInstance {
// }

export default class DocCode extends ComponentBase<DocCodeProps, ComponentBaseInstance> {}
