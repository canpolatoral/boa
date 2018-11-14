import React, { Component } from 'react';
import InfiniteTree from './core';
import VirtualList from './virtual-list';
import _ from 'lodash';

const lcfirst = str => {
  str += '';
  return str.charAt(0).toLowerCase() + str.substr(1);
};

export default class extends Component {
  static displayName = 'InfiniteTree';

  tree = null;

  eventHandlers = {
    onContentWillUpdate: null,
    onContentDidUpdate: null,
    onOpenNode: null,
    onCloseNode: null,
    onSelectNode: null,
    onWillOpenNode: null,
    onWillCloseNode: null,
    onWillSelectNode: null,
  };

  componentDidMount() {
    const { r } = this.state;
    this.generateTree();
    this.setState({ r: !r }); // dialogtaki bugdan dolayı eklendi.
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isMultiSelect !== this.props.isMultiSelect ||
      nextProps.isLeafCheckable !== this.props.isLeafCheckable ||
      nextProps.canCheckChildsByParent !== this.props.canCheckChildsByParent ||
      nextProps.isSingleCheckable !== this.props.isSingleCheckable
    ) {
      this.tree.options.isMultiSelect = nextProps.isMultiSelect;
      this.tree.options.isLeafCheckable = nextProps.isLeafCheckable;
      this.tree.options.canCheckChildsByParent = nextProps.canCheckChildsByParent;
      this.tree.options.isSingleCheckable = nextProps.isSingleCheckable;
      this.tree.loadData(this.tree.nodes);
    } else if (nextProps.expandAll !== this.props.expandAll) {
      this.tree.options.expandAll = nextProps.expandAll;
      this.expandOrCollapse(nextProps.expandAll);
    }
    if (nextProps.data !== this.props.data) {
      this.tree.loadData(nextProps.data);
    }
  }

  componentWillUnmount() {
    Object.keys(this.eventHandlers).forEach(key => {
      if (!this.eventHandlers[key]) {
        return;
      }

      const eventName = lcfirst(key.substr(2)); // e.g. onUpdate -> update
      this.tree.removeListener(eventName, this.eventHandlers[key]);
      this.eventHandlers[key] = null;
    });

    this.tree.destroy();
    this.tree = null;
  }

  expandOrCollapse(isExpand) {
    const expander = node => {
      node.forEach(element => {
        element.isExpanded = isExpand;
        if (element.children && element.children.length > 0) {
          expander(element.children);
        }
      });
    };

    const nodes = this.tree.nodes;
    expander(nodes);
    this.tree.loadData(nodes);
  }

  generateTree() {
    const { ...props } = this.props;

    if (props.el !== undefined) delete props.el;

    props.rowRenderer = () => '';
    this.tree = new InfiniteTree(_.cloneDeep(props));

    // Filters nodes.
    const treeFilter = this.tree.filter.bind(this.tree);
    this.tree.filter = (...args) => {
      setTimeout(() => {
        this.virtualList.recomputeSizes(0);
      }, 0);
      return treeFilter(...args);
    };

    // Unfilter nodes.
    const treeUnfilter = this.tree.unfilter.bind(this.tree);
    this.tree.unfilter = (...args) => {
      setTimeout(() => {
        this.virtualList.recomputeSizes(0);
      }, 0);
      return treeUnfilter(...args);
    };

    // Sets the current scroll position to this node.
    // @param {Node} node The Node object.
    // @return {boolean} Returns true on success, false otherwise.
    this.tree.scrollToNode = node => {
      if (!this.tree || !this.virtualList) {
        return false;
      }

      const nodeIndex = this.tree.nodes.indexOf(node);
      if (nodeIndex < 0) {
        return false;
      }

      const offset = this.virtualList.getOffsetForIndex(nodeIndex);
      this.virtualList.scrollTo(offset);

      return true;
    };

    // Gets (or sets) the current vertical position of the scroll bar.
    // @param {number} [value] If the value is specified,
    // indicates the new position to set the scroll bar to.
    // @return {number} Returns the vertical scroll position.
    this.tree.scrollTop = value => {
      if (!this.tree || !this.virtualList) {
        return undefined;
      }

      if (value !== undefined) {
        this.virtualList.scrollTo(Number(value));
      }

      return this.virtualList.getNodeOffset();
    };

    // Updates the tree.
    this.tree.update = () => {
      this.tree.emit('contentWillUpdate');
      this.setState(
        () => ({
          nodes: this.tree.nodes,
        }),
        () => {
          this.tree.emit('contentDidUpdate');
        },
      );
    };

    Object.keys(this.eventHandlers).forEach(key => {
      if (!this.props[key]) {
        return;
      }

      const eventName = lcfirst(key.substr(2)); // e.g. onContentWillUpdate -> contentWillUpdate
      this.eventHandlers[key] = this.props[key];
      this.tree.on(eventName, this.eventHandlers[key]);
    });

    this.tree.expandOrCollapse = this.expandOrCollapse.bind(this);
    this.tree.generateTree = this.generateTree.bind(this);
  }

  render() {
    const {
      tabIndex,
      data,
      width,
      height,
      rowHeight,
      rowRenderer,
      scrollOffset,
      scrollToIndex,
      onScroll,
      style,
      children,
      onKeyDown,
      onKeyUp,
    } = this.props;

    const render = typeof children === 'function' ? children : rowRenderer;
    const count = this.tree ? this.tree.nodes.length : 0;

    // VirtualList
    const virtualListProps = {};
    if (scrollOffset !== undefined && count > 0) {
      virtualListProps.scrollOffset = scrollOffset;
    }
    if (scrollToIndex !== undefined && scrollToIndex >= 0 && scrollToIndex < count) {
      virtualListProps.scrollToIndex = scrollToIndex;
    }
    if (typeof onScroll === 'function') {
      virtualListProps.onScroll = this.onScroll;
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions, max-len */
    return (
      <div style={{ ...style }} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={tabIndex}>
        <VirtualList
          ref={node => {
            this.virtualList = node;
          }}
          data={data}
          className="b-treeview"
          width={width}
          height={height}
          itemCount={count}
          itemSize={index => {
            const node = this.tree.nodes[index];
            if (node && node.state.filtered === false) return 0;
            return node.isHidden ? 0 : rowHeight; // Number or Array
          }}
          renderItem={({ index, style }) => { // eslint-disable-line
            let row = null;

            if (typeof render === 'function') {
              const node = this.tree.nodes[index];
              if (node && node.state.filtered !== false && !node.isHidden) {
                row = render({
                  node: this.tree.nodes[index],
                  tree: this.tree,
                });
              }
            }

            return (
              <div key={index} style={style}>
                {row}
              </div>
            );
          }}
          {...virtualListProps}
        />
        <style>
          {`
            .b-treeview { -ms-overflow-style: block!important; font-weight: 400;}
            .b-treeview::-webkit-scrollbar { display: block!important; }
            .b-treeview > div { overflow:initial!important }
            .b-treeview-search-input div:before { border-bottom-color: ${
              this.props.context.theme.boaPalette.base200
            }!important; }
            .b-treeview span.highlighted { color: ${
              this.props.context.theme.boaPalette.pri500
            }; background-color: #b618ce29; }
          `}
        </style>
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions,max-len */
  }
}
