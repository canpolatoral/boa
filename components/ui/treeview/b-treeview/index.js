import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer, BComponent } from 'b-component';
import Footer from './components/Footer';
import BDivider from 'b-divider';
import { BInputAction } from 'b-input-action';
import Tree from './Tree';

@BComponentComposer
export class BTreeView extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,

    // Tree data structure, or a collection of tree data structures....
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,

    // Width of the tree.
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    // Height of the tree.
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

    // Either a fixed height, an array containing the heights of all the rows.
    rowHeight: PropTypes.oneOfType([PropTypes.number]),

    // Tree data structure, or a collection of tree data structures.
    selectedNode: PropTypes.object,

    selectedNodeId: PropTypes.number,

    hintText: PropTypes.string,

    // Whether to open all nodes when tree is loaded.
    expandAll: PropTypes.bool,

    isMultiSelect: PropTypes.bool,

    showFooter: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    selectable: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    caseSensitive: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    exactMatch: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    includeAncestors: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    includeDescendants: PropTypes.bool,

    // Whether or not a node is checkable in the tree.
    isCheckable: PropTypes.bool,

    // Whether or not a node is only leaf nodes checakble in the tree.
    isLeafCheckable: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    showIcons: PropTypes.bool,

    // Whether or not a node is selectable in the tree.
    showSearch: PropTypes.bool,

    canCheckChildsByParent: PropTypes.bool,

    // Specifies the tab order to make tree focusable.
    tabIndex: PropTypes.number,

    // Loads nodes on demand.
    loadNodes: PropTypes.func,

    // Provides a function to determine if a node can be selected or deselected. The function must return `true` or `false`.
    // This function will not take effect if `selectable` is not `true`.
    shouldSelectNode: PropTypes.func,

    // Controls the scroll offset.
    scrollOffset: PropTypes.number,

    // Node index to scroll to.
    scrollToIndex: PropTypes.number,

    // Callback invoked whenever the scroll offset changes.
    onScroll: PropTypes.func,

    // Callback invoked when a node is opened.
    onOpenNode: PropTypes.func,

    // Callback invoked when a node is closed.
    onCloseNode: PropTypes.func,

    // Callback invoked when a node is selected or deselected.
    onSelectNode: PropTypes.func,

    // Callback invoked when a node is selected or deselected.
    onCheckNode: PropTypes.func,

    // Callback invoked before opening a node.
    onWillOpenNode: PropTypes.func,

    // Callback invoked before closing a node.
    onWillCloseNode: PropTypes.func,

    // Callback invoked before selecting or deselecting a node.
    onWillSelectNode: PropTypes.func,

    // Callback invoked before updating the tree.
    onContentWillUpdate: PropTypes.func,

    // Callback invoked when the tree is updated.
    onContentDidUpdate: PropTypes.func,

    // Callback invoked when the tree is updated.
    onKeyDown: PropTypes.func,

    // Callback invoked when the tree is updated.
    onKeyUp: PropTypes.func,

    style: PropTypes.object,
    footerStyle: PropTypes.object,
    isSingleCheckable: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    data: [],
    expandAll: false,
    selectable: true,
    tabIndex: 0,
    width: '100%',
    height: 400,
    rowHeight: 36,
    caseSensitive: false,
    exactMatch: false,
    includeAncestors: true,
    includeDescendants: true,
    isCheckable: true,
    showFooter: true,
    isMultiSelect: true,
    isLeafCheckable: false,
    showIcons: true,
    showSearch: true,
    canCheckChildsByParent: true,
    isSingleCheckable: false
  };

  searchActionButton = {
    dynamicIcon: 'Search',
    iconProperties: { color: 'primary' },
    onClick: () => {
      this.filterTree();
    }
  };

  clearActionButton = {
    dynamicIcon: 'Clear',
    iconProperties: { color: this.props.context.theme.boaPalette.pri500 },
    onClick: () => {
      this.filterTree(null);
    }
  };

  state = {
    filterText: '',
    footerText: this.getMessage('BOA', 'TreeviewItemNotSelected'),
    selectedNode: this.props.selectedNodeId ? { id: this.props.selectedNodeId } : this.props.selectedNode
  };

  constructor(props, context) {
    super(props, context);
  }

  tree = null;
  searchTextTimer;
  checkedNodesFromDataSource = [];

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if (nextProps.data !== this.props.data) {
        this.filterTree(null);
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.state.selectedNode) {
      let node = this.getNodeById(this.state.selectedNode.id);
      this.selectNode(node);
    }
  }

  getFooterText() {
    let footerText = this.getMessage('BOA', 'TreeviewItemNotSelected');

    if (this.state.filterText) {
      let nodes = this.getFilteredNodes();
      footerText = this.getMessage('BOA', 'TreeviewItemNotFound');
      if (nodes.length > 0) {
        footerText = nodes.length + ' ' + this.getMessage('BOA', 'TreeviewItemFound');
      }
      return footerText;
    }

    let nodes = this.getCheckedNodes();
    if (nodes.length > 0) {
      footerText = nodes.length + ' ' + this.getMessage('BOA', 'TreeviewItemSelected');
    }
    return footerText;
  }

  // Get the selected value
  getValue() {
    let props = this.props;
    if (props.isCheckable) {
      return this.getCheckedNodes();
    }
    return this.getSelectedNode();
  }

  resetValue() {
    this.tree.state.checkedNodes = [];
    this.setState({ filterText: '' });
  }

  // Adds an array of new child nodes to a parent node at the specified index.
  // * If the parent is null or undefined, inserts new childs at the specified index in the top-level.
  // * If the parent has children, the method adds the new child to it at the specified index.
  // * If the parent does not have children, the method adds the new child to the parent.
  // * If the index value is greater than or equal to the number of children in the parent, the method adds the child at the end of the children.
  // @param {Array} newNodes An array of new child nodes.
  // @param {number} [index] The 0-based index of where to insert the child node.
  // @param {Node} parentNode The Node object that defines the parent node.
  // @return {boolean} Returns true on success, false otherwise.
  addChildNodes(newNodes, index, parentNode) {
    return this.tree.addChildNodes(newNodes, index, parentNode);
  }

  // Adds a new child node to the end of the list of children of a specified parent node.
  // * If the parent is null or undefined, inserts the child at the specified index in the top-level.
  // * If the parent has children, the method adds the child as the last child.
  // * If the parent does not have children, the method adds the child to the parent.
  // @param {object} newNode The new child node.
  // @param {Node} parentNode The Node object that defines the parent node.
  // @return {boolean} Returns true on success, false otherwise.
  appendChildNode(newNode, parentNode) {
    return this.tree.appendChildNode(newNode, parentNode);
  }

  // Checks or unchecks a node.
  // @param {Node} node The Node object.
  // @param {boolean} [checked] Whether to check or uncheck the node. If not specified, it will toggle between checked and unchecked state.
  // @return {boolean} Returns true on success, false otherwise.
  // @example
  //
  // tree.checkNode(node); // toggle checked and unchecked state
  // tree.checkNode(node, true); // checked=true, indeterminate=false
  // tree.checkNode(node, false); // checked=false, indeterminate=false
  //
  // @doc
  //
  // state.checked | state.indeterminate | description
  // ------------- | ------------------- | -----------
  // false         | false               | The node and all of its children are unchecked.
  // true          | false               | The node and all of its children are checked.
  // true          | true                | The node will appear as indeterminate when the node is checked and some (but not all) of its children are checked.
  checkNode(node, checked) {
    return this.tree.checkNode(node, checked);
  }

  // Closes a node to hide its children.
  // @param {Node} node The Node object.
  // @param {object} [options] The options object.
  // @param {boolean} [options.silent] Pass true to prevent "closeNode" and "selectNode" events from being triggered.
  // @return {boolean} Returns true on success, false otherwise.
  closeNode(node, options) {
    return this.tree.closeNode(node, options);
  }

  // Gets a list of child nodes.
  // @param {Node} [parentNode] The Node object that defines the parent node. If null or undefined, returns a list of top level nodes.
  // @return {array} Returns an array of Node objects containing all the child nodes of the parent node.
  getChildNodes(parentNode) {
    return this.tree.getChildNodes(parentNode);
  }

  // Gets a node by its unique id. This assumes that you have given the nodes in the data a unique id.
  // @param {string|number} id An unique node id. A null value will be returned if the id doesn't match.
  // @return {Node} Returns a node the matches the id, null otherwise.
  getNodeById(id) {
    return this.tree && this.tree.getNodeById(id);
  }

  // Returns the node at the specified point. If the specified point is outside the visible bounds or either coordinate is negative, the result is null.
  // @param {number} x A horizontal position within the current viewport.
  // @param {number} y A vertical position within the current viewport.
  // @return {Node} The Node object under the given point.
  getNodeFromPoint(x, y) {
    return this.tree.getNodeFromPoint(x, y);
  }

  // Gets an array of open nodes.
  // @return {array} Returns an array of Node objects containing open nodes.
  getOpenNodes() {
    return this.tree.getOpenNodes();
  }

  // Gets the root node.
  // @return {Node} Returns the root node, or null if empty.
  getRootNode() {
    return this.tree.getRootNode();
  }

  // Gets the selected node.
  // @return {Node} Returns the selected node, or null if not selected.
  getSelectedNode() {
    return this.tree.getSelectedNode();
  }

  // Gets the index of the selected node.
  // @return {number} Returns the index of the selected node, or -1 if not selected.
  getSelectedIndex() {
    return this.tree.getSelectedIndex();
  }

  // Gets an array of checked nodes.
  // @return {array} Returns an array of Node objects containing checked nodes.
  getCheckedNodes() {
    if (this.tree) 
      return this.tree.getCheckedNodes();    
    return [];
  }

  // Gets an array of checked node Ids.
  // @return {array} Returns an array of Id integers containing checked node ids.
  getCheckedNodeIds() {
    let checkedNodes = this.getCheckedNodes();
    let checkedNodeId = [];
    checkedNodes.forEach(node => {
      checkedNodeId.push(node.id);
    }, this);

    return checkedNodeId;
  }

  // Inserts the specified node after the reference node.
  // @param {object} newNode The new sibling node.
  // @param {Node} referenceNode The Node object that defines the reference node.
  // @return {boolean} Returns true on success, false otherwise.
  insertNodeAfter(newNode, referenceNode) {
    return this.tree.insertNodeAfter(newNode, referenceNode);
  }

  // Inserts the specified node before the reference node.
  // @param {object} newNode The new sibling node.
  // @param {Node} referenceNode The Node object that defines the reference node.
  // @return {boolean} Returns true on success, false otherwise.
  insertNodeBefore(newNode, referenceNode) {
    return this.tree.insertNodeBefore(newNode, referenceNode);
  }

  // Moves a node from its current position to the new position.
  // @param {Node} node The Node object.
  // @param {Node} parentNode The Node object that defines the parent node.
  // @param {number} [index] The 0-based index of where to insert the child node.
  // @return {boolean} Returns true on success, false otherwise.
  moveNodeTo(node, parentNode, index) {
    return this.tree.moveNodeTo(node, parentNode, index);
  }

  // Opens a node to display its children.
  // @param {Node} node The Node object.
  // @param {object} [options] The options object.
  // @param {boolean} [options.silent] Pass true to prevent "openNode" event from being triggered.
  // @return {boolean} Returns true on success, false otherwise.
  openNode(node) {
    return this.tree.openNode(node);
  }

  // Removes a node and all of its child nodes.
  // @param {Node} node The Node object.
  // @param {object} [options] The options object.
  // @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered.
  // @return {boolean} Returns true on success, false otherwise.
  removeNode(node, options) {
    return this.tree.removeNode(node, options);
  }

  // Removes all child nodes from a parent node.
  // @param {Node} parentNode The Node object that defines the parent node.
  // @param {object} [options] The options object.
  // @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered.
  // @return {boolean} Returns true on success, false otherwise.
  removeChildNodes(parentNode, options) {
    return this.tree.removeChildNodes(parentNode, options);
  }

  // Sets the current scroll position to this node.
  // @param {Node} node The Node object.
  // @return {boolean} Returns true on success, false otherwise.
  scrollToNode(node) {
    return this.tree.scrollToNode(node);
  }

  // Selects a node.
  // @param {Node} node The Node object. If null or undefined, deselects the current node.
  // @param {object} [options] The options object.
  // @param {boolean} [options.autoScroll] Pass true to automatically scroll to the selected node. Defaults to true.
  // @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered. Defaults to false.
  // @return {boolean} Returns true on success, false otherwise.
  selectNode(node) {
    if (this.tree) {
      let success = this.tree.selectNode(node);
      if (success && node) {
        // this.scrollToNode(node);
        this.setState({ selectedNode: node });
      }
      return success;
    }
    return false;
  }

  // Swaps two nodes.
  // @param {Node} node1 The Node object.
  // @param {Node} node2 The Node object.
  // @return {boolean} Returns true on success, false otherwise.
  swapNodes(node1, node2) {
    return this.tree.swapNodes(node1, node2);
  }

  // Toggles a node to display or hide its children.
  // @param {Node} node The Node object.
  // @param {object} [options] The options object.
  // @param {boolean} [options.silent] Pass true to prevent "closeNode", "openNode", and "selectNode" events from being triggered.
  // @return {boolean} Returns true on success, false otherwise.
  toggleNode(node) {
    return this.tree.toggleNode(node);
  }

  // Updates the tree.
  update() {
    // return this.tree.update();
  }

  // Updates the data of a node.
  // @param {Node} node The Node object.
  // @param {object} data The data object.
  // @param {object} [options] The options object.
  // @param {boolean} [options.shallowRendering] True to render only the parent node, false to render the parent node and all expanded child nodes. Defaults to false.
  updateNode(node, data, options) {
    return this.tree.updateNode(node, data, options);
  }

  // Get the filtered nodes
  // @return {array} Returns an array of Node objects.
  getFilteredNodes() {
    if (this.tree) {
      return this.tree.nodes.filter(s => s.state.filtered);
    }
    return [];
  }

  // Clears the tree.
  clear() {
    this.tree.clear();
  }

  // Serializes the current state of a node to a JSON string.
  // @param {Node} node The Node object. If null, returns the whole tree.
  // @return {string} Returns a JSON string represented the tree.
  toString() {
    return this.tree.toString();
  }

  isLeafSelected() {
    let selectedNode = this.getSelectedNode();
    if (selectedNode) {
      if (selectedNode.children && Array.isArray(selectedNode.children) && selectedNode.children.length > 0) {
        return false;
      }
    }
    return true;
  }

  expandAll() {
    this.tree.expandOrCollapse(true);
  }

  collapseAll() {
    this.tree.expandOrCollapse(false);
  }

  /**
   * Get Snapshot
   */
  getSnapshot() {
    return { state: this.state };
  }

  /**
   * Set Snapshot
   * @param {*} snapshot
   */
  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  // Filter the tree by node.name
  filterTree(keyword) {
    if (!this.tree) {
      return;
    }

    if (keyword === null) {
      this.tree.unfilter();
      this.setState({ filterText: keyword });
      return;
    }

    let filterText = this.searchInput.getInstance().getValue();
    keyword = filterText || keyword || '';

    if (!keyword) {
      this.tree.unfilter();
      this.setState({ filterText: keyword });
      return;
    }

    this.tree.filter(keyword, {
      filterPath: 'name',
      caseSensitive: this.props.caseSensitive,
      exactMatch: this.props.exactMatch,
      includeAncestors: this.props.includeAncestors,
      includeDescendants: this.props.includeDescendants
    });

    this.setState({ filterText: keyword });
  }

  handleOnSearchChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleOnCheckNode(node, checked) {
    if (this.props.onCheckNode) this.props.onCheckNode(node, checked);
  }

  handleOnselectNode(node) {
    this.state.selectedNode = node;
    this.props.onSelectNode && this.props.onSelectNode(node);
  }

  handleOnKeyDown(event) {
    event.preventDefault();

    const node = this.getSelectedNode();
    const nodeIndex = this.getSelectedIndex();

    if (event.keyCode === 37) {
      // Left
      this.closeNode(node);
    } else if (event.keyCode === 38) {
      // Up
      const prevNode = this.tree.nodes[nodeIndex - 1] || node;
      this.selectNode(prevNode);
    } else if (event.keyCode === 39) {
      // Right
      this.openNode(node);
    } else if (event.keyCode === 40) {
      // Down
      const nextNode = this.tree.nodes[nodeIndex + 1] || node;
      this.selectNode(nextNode);
    } else if (this.props.isCheckable && event.keyCode === 13) {
      // Enter
      let isCheckable = node.isCheckable === undefined ? true : node.isCheckable;
      if (isCheckable) {
        this.checkNode(node);
        this.handleOnCheckNode(node, node.isSelected); 
      }
    }
    this.props.onKeyDown && this.props.onKeyDown(event);
  }

  handleOnSearchTextKeyDown(event) {
    clearTimeout(this.searchTextTimer);

    const { keyCode } = event;
    const ENTER = 13;

    if (keyCode == ENTER) {
      this.filterTree();
      clearTimeout(this.searchTextTimer);
    } else {
      this.searchTextTimer = setTimeout(() => {
        this.filterTree();
      }, 1000);
    }
  }

  getStyle() {
    let mainDiv = {
      outline: 'none',
      background: 'white',
      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
      ...this.props.style
    };

    let width = typeof this.props.width === 'string' ? this.props.width : this.props.width + 'px';

    let startAdornmentStyle = { paddingLeft: '24px', marginLeft: '0', paddingBottom: '12px', marginTop: '6px' };
    if (this.props.context.localization.isRightToLeft) {
      startAdornmentStyle.paddingLeft = '0px';
      startAdornmentStyle.paddingRight = '24px';
    }

    let endAdornmentStyle = { paddingBottom: '12px', marginTop: '6px', paddingRight: '12px' };
    if (this.props.context.localization.isRightToLeft) {
      endAdornmentStyle.paddingLeft = '12px';
      endAdornmentStyle.paddingRight = '0px';
    }

    let inputDiv = {
      marginTop: '0px',
      marginBottom: '18px',
      height: '30px'
    };

    return {
      mainDiv: mainDiv,
      width: width,
      startAdornmentStyle: startAdornmentStyle,
      endAdornmentStyle: endAdornmentStyle,
      inputDiv: inputDiv
    };
  }

  render() {
    let style = this.getStyle();

    return (
      <div style={style.mainDiv}>
        {this.props.showSearch && (
          <div className="b-treeview-search-input" style={style.inputDiv}>
            <BInputAction
              ref={r => (this.searchInput = r)}
              style={{ width: style.width }}
              startAdornmentStyle={style.startAdornmentStyle}
              endAdornmentStyle={style.endAdornmentStyle}
              context={this.props.context}
              rightIconList={this.state.filterText ? [this.clearActionButton] : []}
              leftIconList={[this.searchActionButton]}
              hintText={this.props.hintText || this.getMessage('BOA', 'Search')}
              value={this.state.filterText === null ? '' : this.state.filterText}
              type={'text'}
              onKeyDown={event => {
                this.handleOnSearchTextKeyDown(event);
              }}
            />
          </div>
        )}
        <Tree
          ref={c => {
            this.tree = c ? c.tree : null;
          }}
          {...this.props}
          width={style.width}
          context={this.props.context}
          data={this.props.data}
          isCheckable={this.props.isCheckable}
          isMultiSelect={this.props.isMultiSelect}
          isLeafCheckable={this.props.isLeafCheckable}
          expandAll={this.props.expandAll}
          selectable={this.props.selectable}
          tabIndex={this.props.tabIndex}
          height={this.props.height}
          rowHeight={this.props.rowHeight}
          showIcons={this.props.showIcons}
          canCheckChildsByParent={this.props.canCheckChildsByParent}
          loadNodes={this.props.loadNodes}
          shouldSelectNode={this.props.shouldSelectNode}
          scrollOffset={this.props.scrollOffset}
          scrollToIndex={this.props.scrollToIndex}
          onScroll={this.props.onScroll}
          onOpenNode={this.props.onOpenNode}
          onCloseNode={this.props.onCloseNode}
          onCheckNode={(node, checked) => {
            this.handleOnCheckNode(node, checked);
          }}
          onSelectNode={node => {
            this.handleOnselectNode(node);
          }}
          onWillOpenNode={this.props.onWillOpenNode}
          onWillCloseNode={this.props.onWillCloseNode}
          onWillSelectNode={this.props.onWillSelectNode}
          onContentWillUpdate={this.props.onContentWillUpdate}
          onContentDidUpdate={this.props.onContentDidUpdate}
          onKeyDown={event => {
            this.handleOnKeyDown(event);
          }}
          onKeyUp={this.props.onKeyUp}
          filterText={this.state.filterText}
        />

        {this.props.isCheckable &&
          this.props.showFooter && (
            <div>
              <BDivider style={{ margin: 0 }} />
              <Footer style={this.props.footerStyle} context={this.props.context}>
                {this.getFooterText()}
              </Footer>
            </div>
          )}
      </div>
    );
  }
}

export default BTreeView;
