
declare namespace __BTreeView {
    interface BTreeViewProps extends __BComponent.BComponentProps {

        /**
        * Tree data structure, or a collection of tree data structures.
        */
        data: any,

        /**
        * Width of the tree.
        */
        width?: string,

        /**
        * Height of the tree.
        */
        height?: number,

        /**
        * Either a fixed height, an array containing the heights of all the rows.
        */
        rowHeight?: number,

        /**
        * Tree data structure, or a collection of tree data structures.
        */
        selectedNode?: any,

        selectedNodeId?: any;

        hintText?: string;

        showFooter?: boolean;

        /**
        * Whether to open all nodes when tree is loaded.
        */
        expandAll?: boolean,

        expandFirstNode?: boolean,

        /**
        * Whether or not a node is selectable in the tree.
        */
        selectable?: boolean,

        isMultiSelect?: boolean
        /**
        * Whether or not a node is selectable in the tree.
        */
        caseSensitive?: boolean,

        /**
        // Whether or not a node is selectable in the tree.
        */
        exactMatch?: boolean,

        /**
        * Whether or not a node is selectable in the tree.
        */
        includeAncestors?: boolean,

        /**
        * Whether or not a node is selectable in the tree.
        */
        includeDescendants?: boolean,

        /**
        * Whether or not a node is checkable in the tree.
        */
        isCheckable?: boolean,

        /**
        // Whether or not a node is checkable in the tree.
        */
        isMultiCheckable?: boolean,

        /**
        * Whether or not a node is only leaf nodes checakble in the tree.
        */
        isLeafCheckable?: boolean,

        /**
        * Whether or not a node is selectable in the tree.
        */
        showIcons?: boolean,

        /**
        * Whether or not a node is selectable in the tree.
        */
        showSearch?: boolean,

        indeterminate?: boolean,

        /**
        * Specifies the tab order to make tree focusable.
        */
        tabIndex?: number,

        /**
        * Provides a function to determine if a node can be selected or deselected. The function must return `true` or `false`.
        * This function will not take effect if `selectable` is not `true`.
        */
        shouldSelectNode?: (node: any) => void;

        loadNodes?: () => void;
        /**
        * Controls the scroll offset.
        */
        scrollOffset?: number,

        /**
        * Node index to scroll to.
        */
        scrollToIndex?: number,

        /**
        * Callback invoked whenever the scroll offset changes.
        */
        onScroll?: (scrollOffset: any, event: any) => void;

        /**
        * Callback invoked when a node is opened.
        */
        onOpenNode?: (node: any) => void;

        /**
        * Callback invoked when a node is closed.
        */
        onCloseNode?: (node: any) => void;

        /**
        * Callback invoked when a node is selected or deselected.
        */
        onSelectNode?: (node: any) => void;

        /**
        * Callback invoked when a node is selected or deselected.
        */
        onCheckNode?: (node: Object, toggled: boolean) => void,

        /**
        * Callback invoked before opening a node.
        */
        onWillOpenNode?: (node: any) => void;

        /**
        * Callback invoked before closing a node.
        */
        onWillCloseNode?: (node: any) => void;

        /**
        * Callback invoked before selecting or deselecting a node.
        */
        onWillSelectNode?: (node: any) => void;

        /**
        * Callback invoked before updating the tree.
        */
        onContentWillUpdate?: () => void;

        /**
        * Callback invoked when the tree is updated.
        */
        onContentDidUpdate?: () => void;

        /**
        * Callback invoked when the tree is updated.
        */
        onKeyDown?: (event: any) => void;

        /**
        * Callback invoked when the tree is updated.
        */
        onKeyUp?: (event: any) => void;


        style?: Object;

        footerStyle?: Object; 
    }

    interface BTreeViewInstance extends __BComponent.BComponentInstance {
        getValue(): any;

        /**
        * Serializes the current state of a node to a JSON string.
        * @param {Node} node The Node object. If null, returns the whole tree.
        * @return {string} Returns a JSON string represented the tree.
        */
        toString(): string;

        /**
        * Adds an array of new child nodes to a parent node at the specified index.
        * * If the parent is null or undefined, inserts new childs at the specified index in the top-level.
        * * If the parent has children, the method adds the new child to it at the specified index.
        * * If the parent does not have children, the method adds the new child to the parent.
        * * If the index value is greater than or equal to the number of children in the parent, the method adds the child at the end of the children.
        * @param {Array} newNodes An array of new child nodes.
        * @param {number} [index] The 0-based index of where to insert the child node.
        * @param {Node} parentNode The Node object that defines the parent node.
        * @return {boolean} Returns true on success, false otherwise.
        */
        addChildNodes(newNodes: any, index: number, parentNode: any): boolean;

        /**
        * Adds a new child node to the end of the list of children of a specified parent node.
        * * If the parent is null or undefined, inserts the child at the specified index in the top-level.
        * * If the parent has children, the method adds the child as the last child.
        * * If the parent does not have children, the method adds the child to the parent.
        * @param {object} newNode The new child node.
        * @param {Node} parentNode The Node object that defines the parent node.
        * @return {boolean} Returns true on success, false otherwise.
        */
        appendChildNode(newNode: any, parentNode: any): boolean;

        /**
        * Checks or unchecks a node.
        * @param {Node} node The Node object.
        * @param {boolean} [checked] Whether to check or uncheck the node. If not specified, it will toggle between checked and unchecked state.
        * @return {boolean} Returns true on success, false otherwise.
        * @example
        *
        * tree.checkNode(node); * toggle checked and unchecked state
        * tree.checkNode(node, true); * checked=true, indeterminate=false
        * tree.checkNode(node, false); * checked=false, indeterminate=false
        *
        * @doc
        *
        * state.checked | state.indeterminate | description
        * ------------- | ------------------- | -----------
        * false         | false               | The node and all of its children are unchecked.
        * true          | false               | The node and all of its children are checked.
        * true          | true                | The node will appear as indeterminate when the node is checked and some (but not all) of its children are checked.
        */
        checkNode(node: any, checked: boolean): boolean;

        /**
        * Closes a node to hide its children.
        * @param {Node} node The Node object.
        * @param {object} [options] The options object.
        * @param {boolean} [options.silent] Pass true to prevent "closeNode" and "selectNode" events from being triggered.
        * @return {boolean} Returns true on success, false otherwise.
        */
        closeNode(node: any, options: any): boolean;

        /**
        * Gets a list of child nodes.
        * @param {Node} [parentNode] The Node object that defines the parent node. If null or undefined, returns a list of top level nodes.
        * @return {array} Returns an array of Node objects containing all the child nodes of the parent node.
        */
        getChildNodes(parentNode: any): any[];

        /**
        * Gets a node by its unique id. This assumes that you have given the nodes in the data a unique id.
        * @param {string|number} id An unique node id. A null value will be returned if the id doesn't match.
        * @return {Node} Returns a node the matches the id, null otherwise.
        */
        getNodeById(id: number): any;

        /**
        * Returns the node at the specified point. If the specified point is outside the visible bounds or either coordinate is negative, the result is null.
        * @param {number} x A horizontal position within the current viewport.
        * @param {number} y A vertical position within the current viewport.
        * @return {Node} The Node object under the given point.
        */
        getNodeFromPoint(x: number, y: number): any;

        /**
        * Gets an array of open nodes.
        * @return {array} Returns an array of Node objects containing open nodes.
        */
        getOpenNodes(): any[];

        /**
        * Gets the root node.
        * @return {Node} Returns the root node, or null if empty.
        */
        getRootNode(): any;

        /**
        * Gets the selected node.
        * @return {Node} Returns the selected node, or null if not selected.
        */
        getSelectedNode(): any;

        /**
        * Gets the index of the selected node.
        * @return {any} Returns the index of the selected node, or -1 if not selected.
        */
        getSelectedIndex(): any;

        /**
        * Gets an array of checked nodes.
        * @return {array} Returns an array of Node objects containing checked nodes.
        */
        getCheckedNodes(): any[];

        /**
        * Gets an array of checked node Ids.
        * @return {array} Returns an array of Id integers containing checked node ids.
        */
        getCheckedNodeIds(): any[];

        /**
        * Inserts the specified node after the reference node.
        * @param {object} newNode The new sibling node.
        * @param {Node} referenceNode The Node object that defines the reference node.
        * @return {boolean} Returns true on success, false otherwise.
        */
        insertNodeAfter(newNode: object, referenceNode: any): boolean;

        /**
        * Inserts the specified node before the reference node.
        * @param {object} newNode The new sibling node.
        * @param {Node} referenceNode The Node object that defines the reference node.
        * @return {boolean} Returns true on success, false otherwise.
        */
        insertNodeBefore(newNode: object, referenceNode: any): boolean;

        /**
        * Moves a node from its current position to the new position.
        * @param {Node} node The Node object.
        * @param {Node} parentNode The Node object that defines the parent node.
        * @param {number} [index] The 0-based index of where to insert the child node.
        * @return {boolean} Returns true on success, false otherwise.
        */
        moveNodeTo(node: object, parentNode: any, index: number): boolean;

        /**
        * Opens a node to display its children.
        * @param {Node} node The Node object.
        * @param {object} [options] The options object.
        * @param {boolean} [options.silent] Pass true to prevent "openNode" event from being triggered.
        * @return {boolean} Returns true on success, false otherwise.
        */
        openNode(node: object, options?: any): boolean;

        /**
        * Removes a node and all of its child nodes.
        * @param {Node} node The Node object.
        * @param {object} [options] The options object.
        * @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered.
        * @return {boolean} Returns true on success, false otherwise.
        */
        removeNode(node: object, options?: any): boolean;

        /**
        * Removes all child nodes from a parent node.
        * @param {Node} parentNode The Node object that defines the parent node.
        * @param {object} [options] The options object.
        * @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered.
        * @return {boolean} Returns true on success, false otherwise.
        */
        removeChildNodes(parentNode: any, options?: any): boolean;

        /**
        * Sets the current scroll position to this node.
        * @param {Node} node The Node object.
        * @return {boolean} Returns true on success, false otherwise.
        */
        scrollToNode(node: any): boolean;

        /**
        * Selects a node.
        * @param {Node} node The Node object. If null or undefined, deselects the current node.
        * @param {object} [options] The options object.
        * @param {boolean} [options.autoScroll] Pass true to automatically scroll to the selected node. Defaults to true.
        * @param {boolean} [options.silent] Pass true to prevent "selectNode" event from being triggered. Defaults to false.
        * @return {boolean} Returns true on success, false otherwise.
        */
        selectNode(node: any): boolean;

        /**
        * Swaps two nodes.
        * @param {Node} node1 The Node object.
        * @param {Node} node2 The Node object.
        * @return {boolean} Returns true on success, false otherwise.
        */
        swapNodes(node1: any, node2: any): boolean;

        /**
        * Toggles a node to display or hide its children.
        * @param {Node} node The Node object.
        * @param {object} [options] The options object.
        * @param {boolean} [options.silent] Pass true to prevent "closeNode", "openNode", and "selectNode" events from being triggered.
        * @return {boolean} Returns true on success, false otherwise.
        */
        toggleNode(node: any): boolean;

        /**
        * Updates the tree.
        */
        update(): void;

        /**
        * Updates the data of a node.
        * @param {Node} node The Node object.
        * @param {object} data The data object.
        * @param {object} [options] The options object.
        * @param {boolean} [options.shallowRendering] True to render only the parent node, false to render the parent node and all expanded child nodes. Defaults to false.
        */
        updateNode(node: any, data: any, options?: any): boolean;

        /**
        * Get the filtered nodes
        * @return {array} Returns an array of Node objects.
        */
        getFilteredNodes(): any[];

        /**
        * Clears the tree.
        */
        clear(): void;

        /**
        * expand all nodes
        */
        expandAll(): void;

        /**
        * collapse all nodes
        */
        collapseAll(): void;

        /**
        * get all nodes
        */
        getAllNodes(): void;

        /**
        * reset value
        */
        resetValue(): void;
    }

    export class BTreeView extends __BComponent.BComponetBase<BTreeViewProps, BTreeViewInstance> { }
}

declare module 'b-treeview' {
    export import BTreeView = __BTreeView.BTreeView;
    export default BTreeView;
}