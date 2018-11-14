import ComponentBase, { ComponentBaseInstance, ComponentBaseProps } from '../../base/ComponentBase';

export interface TreeViewProps extends ComponentBaseProps {
  data: any;
  width?: string;
  height?: number;
  rowHeight?: number;
  selectedNode?: any;
  selectedNodeId?: any;
  hintText?: string;
  showFooter?: boolean;
  expandAll?: boolean;
  expandFirstNode?: boolean;
  selectable?: boolean;
  isMultiSelect?: boolean;
  caseSensitive?: boolean;
  exactMatch?: boolean;
  includeAncestors?: boolean;
  includeDescendants?: boolean;
  isCheckable?: boolean;
  isMultiCheckable?: boolean;
  isLeafCheckable?: boolean;
  showIcons?: boolean;
  showSearch?: boolean;
  indeterminate?: boolean;
  tabIndex?: number;
  shouldSelectNode?: (node: any) => void;
  loadNodes?: () => void;
  scrollOffset?: number;
  scrollToIndex?: number;
  onScroll?: (scrollOffset: any, event: any) => void;
  onOpenNode?: (node: any) => void;
  onCloseNode?: (node: any) => void;
  onSelectNode?: (node: any) => void;
  onCheckNode?: (node: object, toggled: boolean) => void;
  onWillOpenNode?: (node: any) => void;
  onWillCloseNode?: (node: any) => void;
  onWillSelectNode?: (node: any) => void;
  onContentWillUpdate?: () => void;
  onContentDidUpdate?: () => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  style?: object;
  footerStyle?: object;
}

export interface TreeViewInstance extends ComponentBaseInstance {
  getValue(): any;
  toString(): string;
  addChildNodes(newNodes: any, index: number, parentNode: any): boolean;
  appendChildNode(newNode: any, parentNode: any): boolean;
  checkNode(node: any, checked: boolean): boolean;
  closeNode(node: any, options: any): boolean;
  getChildNodes(parentNode: any): any[];
  getNodeById(id: number): any;
  getNodeFromPoint(x: number, y: number): any;
  getOpenNodes(): any[];
  getRootNode(): any;
  getSelectedNode(): any;
  getSelectedIndex(): any;
  getCheckedNodes(): any[];
  getCheckedNodeIds(): any[];
  insertNodeAfter(newNode: object, referenceNode: any): boolean;
  insertNodeBefore(newNode: object, referenceNode: any): boolean;
  moveNodeTo(node: object, parentNode: any, index: number): boolean;
  openNode(node: object, options?: any): boolean;
  removeNode(node: object, options?: any): boolean;
  removeChildNodes(parentNode: any, options?: any): boolean;
  scrollToNode(node: any): boolean;
  selectNode(node: any): boolean;
  swapNodes(node1: any, node2: any): boolean;
  toggleNode(node: any): boolean;
  update(): void;
  updateNode(node: any, data: any, options?: any): boolean;
  getFilteredNodes(): any[];
  clear(): void;
  expandAll(): void;
  collapseAll(): void;
  getAllNodes(): void;
  resetValue(): void;
}

export default class TreeView extends ComponentBase<TreeViewProps, TreeViewInstance> {}
