import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import WatchLater from '@material-ui/icons/WatchLater';
import { StyleRoot } from 'radium';
import TreeView from './treeview';
import sampleData from './data/sampleData';
import decorators from './decorators';
import * as filters from './filter';
import * as helpers from './helpers';

import { BComponent, BComponentComposer } from 'b-component';
import { BDataGrid } from 'b-data-grid';

let ElementResizeDetectorMaker = require('element-resize-detector');

class Header extends BComponent {

  constructor(props, context) {
    super(props, context);
    this.resizeDetector = ElementResizeDetectorMaker();
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.datagridDiv) {
      this.resizeDetector.listenTo(this.datagridDiv.parentElement.parentElement, this.onResizeParent.bind(this));
    }
    this.onResizeParent();
  }

  componentWillUnmount() {
  }

  onResizeParent() {
    if (this.datagridDiv) {
      this.gridWidth = this.datagridDiv.parentElement.parentElement.offsetWidth;
      this.datagridDiv.style.width = this.gridWidth + 'px';
      this.datagrid.setSize(this.gridWidth);
    }
  }

  render() {
    let iconStyle;

    if (this.props.isRightToLeft) {
      iconStyle = {
        marginLeft: '12px',
        marginRight: '12px',
        marginTop: '2px',
        color: 'inherit',
        marginBottom: '-5px',
        width: '20px',
        height: '20px'
      };
    }
    else {
      iconStyle = {
        marginRight: '12px',
        marginLeft: '12px',
        marginTop: '2px',
        color: 'inherit',
        marginBottom: '-5px',
        width: '20px',
        height: '20px'
      };
    }


    let style = this.props.style;
    let styleDataGrid = this.props.style.title;
    styleDataGrid = { fontSize: '12px' };

    let styleGrid = this.props.style.title;
    styleGrid = { fontSize: '14px', height: '36px' };
    if (this.props.node.level == 1) {
      styleGrid = { fontSize: '16px', height: '36px' };
    }

    let iconType = <ThumbUp style={iconStyle} />;
    if (this.props.node.resultType === 0) {
      iconStyle.color = 'green';
      iconType = <ThumbUp style={iconStyle} />;
    }
    else if (this.props.node.resultType === 1) {
      iconStyle.color = '#FFBF00';
      iconType = <WatchLater style={iconStyle} />;
    }
    else {
      iconStyle.color = 'red';
      iconType = <ThumbDown style={iconStyle} />;
    }
    let treeNode;
    if (this.props.isRightToLeft) {
      if (this.props.node.children) {
        treeNode =
          <div style={styleGrid} >
            {this.props.node.name}
            {iconType}
          </div>;
      }
      else {
        treeNode =
          <div ref={r => this.datagridDiv = r} style={{ styleDataGrid }}>
            <BDataGrid context={this.props.context}
              ref={r => this.datagrid = r}
              columns={this.props.node.columns}
              dataSource={this.props.node.datasource}
              selectable='singleNonPointer'
              columnMenu={false}
              sortable={false}
              filterable={false}
              enableRowSelect={false}
              enableCellSelect={false}
              headerBarOptions={{
                show: false,
                showTitle: false,
                showCheckBox: false,
                showFiltering: false,
                showGrouping: false,
                showMoreOptions: false
              }}
            />
          </div>;
      }
    }
    else {
      if (this.props.node.children) {
        treeNode =
          <div style={styleGrid} >
            {iconType}
            {this.props.node.name}
          </div>;
      }
      else {
        treeNode =
          <div ref={r => this.datagridDiv = r} style={{ styleDataGrid }}>
            <BDataGrid context={this.props.context}
              ref={r => this.datagrid = r}
              columns={this.props.node.columns}
              dataSource={this.props.node.datasource}
              scrollable={true}
              selectable='singleNonPointer'
              columnMenu={false}
              sortable={false}
              filterable={false}
              enableRowSelect={false}
              enableCellSelect={false}
              headerBarOptions={{
                show: false,
                showTitle: false,
                showCheckBox: false,
                showFiltering: false,
                showGrouping: false,
                showMoreOptions: false
              }} />
          </div>;
      }
    }
    return (
      <div style={style.base}>
        {treeNode}
      </div>
    );
  }
}

decorators.Header = Header;
@BComponentComposer
export class BTreeViewDataGrid extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    style: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    selectedNodeId: PropTypes.number,
    disabled: PropTypes.bool,
    height: PropTypes.string,
    width: PropTypes.string,
    onToggle: PropTypes.func
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    height: '400px',
    disabled: false
  };

  state = {
    disabled: this.props.disabled,
    data: this.props.data
  };

  constructor(props, context) {
    super(props, context);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.selectedNode = {};
  }

  /**
   * Invoked immediately before a component is mounted
   */
  componentWillMount() {
    super.componentWillMount();
    if (!this.state.data && !this.props.data) {
      let data = sampleData;
      this.setValues(data);
    }
    else if (this.props.data) {
      this.setValues(this.props.data);
    }
  }

  /**
   * Invoked before a mounted component receives new props
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.props.data) {
      this.setValues(nextProps.data);
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  /**
   * Use the findNode method to get a node from the tree view control at the specified value path.
   * @param valuePath
   * @param value
   */
  findNode(valuePath, value) {
    let data = this.getValues();
    return helpers.findNode(data, valuePath, value);
  }

  /**
 * The expandAll method provides a convenient way to open every node in the tree.
 */
  expandAll() {
    let data = this.treeViewdatagrid.getValues();
    helpers.expandAll(data);
    this.setState({ data: data });
  }

  /**
   * The collapseAll method provides a convenient way to close every node in the tree.
   */
  collapseAll() {
    let data = this.treeViewdatagrid.getValues();
    helpers.collapseAll(data);
    this.setState({ data: data });
  }

  /**
   * Get the node that is currently selected
   * @returns {*}
   */
  getValue() {
    let obj = this.selectedNode || {};
    return Object.assign({}, obj);
  }

  setValue(value) {
    this.setState({ ...value });
  }

  /**
   * Get the list of nodes in tree view.
   */
  getValues() {
    return this.treeViewdatagrid.getValues();
  }

  /**
   * Set tree view data.
   * @param dataSource
   * @param props
   */
  setValues(dataSource, props) {
    props = props || this.props;
    if (props.selectedNodeId) {
      helpers.unSelectAll(dataSource);
      if (this.selectedNode) {
        this.selectedNode.active = false;
      }
      this.selectedNode = helpers.setSelectedNode(dataSource, 'id', props.selectedNodeId);
      if (this.selectedNode) {
        this.selectedNode.active = true;
      }
    }
    this.setState({ data: dataSource });
  }

  /**
   * Handle function when a node is toggled / clicked. Passes 2 attributes: the data node and it's toggled boolean state.
   * @param node
   * @param toggled
   */
  handleOnToggle(node, toggled) {
    if (this.selectedNode) {
      this.selectedNode.active = false;
    }
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.selectedNode = node;
    this.setState({ cursor: Object.assign({}, node) });
    if (this.props.onToggle) {
      this.props.onToggle(node, toggled);
    }
  }

  /**
   * Handle function that is fired when the search value changes.
   * @param e
   * @param v
   */
  handleOnChange(e, v) {
    let data = this.props.data;
    const filter = v.trim();
    if (!filter) {
      return this.setState({ data });
    }
    let filtered = filters.filterTree(data, filter);
    filtered = filters.expandFilteredNodes(filtered, filter);
    this.setState({ data: filtered });
  }

  render() {
    let context = this.props.context;

    return (
      <StyleRoot>
        <div >
          <TreeView ref={r => this.treeViewdatagrid = r}
            context={context}
            data={this.state.data}
            onToggle={this.handleOnToggle}
            isRightToLeft={this.props.context.localization.isRightToLeft}
            decorators={decorators} />
        </div>
      </StyleRoot>
    );
  }
}

export default BTreeViewDataGrid;
