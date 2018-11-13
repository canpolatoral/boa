import ComponentBase,
{
  ComponentBaseInstance,
  ComponentBaseProps
} from '../../base/ComponentBase';

export interface TreeViewGridProps extends ComponentBaseProps {
  style?: object;
  data: any;
  selectedNodeId: number;
  disabled: boolean;
  onItemChanged: (selectedNode: any) => void;
}

export default class TreeViewGrid extends ComponentBase<TreeViewGridProps, ComponentBaseInstance> { }
