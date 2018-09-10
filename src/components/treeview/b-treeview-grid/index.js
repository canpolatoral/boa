import React from 'react';
import PropTypes from 'prop-types';
import TreeView from './treeview';
import decorators from './decorators';
import sampleData from './data/sampleData';
import * as helpers from './helpers';
import { BComponent, BComponentComposer } from 'b-component';
import { BButton } from 'b-button';
import { BIconButton } from 'b-icon-button';
import { BLinearPanel } from 'b-linear-panel';

@BComponentComposer
export class BTreeViewGrid extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    style: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    selectedNodeId: PropTypes.number,
    disabled: PropTypes.bool,
    onItemChanged: PropTypes.func,
    title: PropTypes.string,
    onOptionClick: PropTypes.func,
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    disabled: false,
    title: '',
  };

  state = {
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectedNode = {};
  }

  /**
   * Invoked immediately before a component is mounted
   */
  componentWillMount() {
    if (!this.state.data && !this.props.data) {
      let data = sampleData;
      // let summedData = helpers.sumNodeHeader(data, true);
      this.setValues(data);
    }
    else if (this.props.data) {
      // let summedData = helpers.sumNodeHeader(this.props.data, true);
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
   * Use the findNode method to get a node from the tree view control at the specified value path.
   * @param valuePath
   * @param value
   *  @param data
   */


  /**
   * The expandAll method provides a convenient way to open every node in the tree.
   */
  expandAll = () => {
    let data = this.state.data;
    helpers.expandAll(data);
    this.setState({ data: Object.assign({}, data) });
  }

  /**
   * The collapseAll method provides a convenient way to close every node in the tree.
   */
  collapseAll = () => {
    let data = this.state.data;
    helpers.collapseAll(data);
    this.setState({ data: Object.assign({}, data) });
  }

  /**
   * Get the node that is currently selected
   * @returns {*}
   */
  getValue() {
    let obj = this.selectedNode || {};
    return Object.assign({}, obj);
  }

  /**
   * Get the list of nodes in tree view.
   */
  getValues() {
    return this.treeView.getValues();
  }

  /**
   * Set tree view data.
   * @param dataSource
   * @param props
   */
  setValues(dataSource) {
    this.setState({ data: Object.assign({}, dataSource) });
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

  }

  findNodeItem(data, valuePath, value) {
    return helpers.findNodeItem(data, valuePath, value);
  }
  onChange(item, node) {
    let data = this.state.data;
    // var temp = data.children.find(x=>x.id == node.id);
    this.selectedNode = helpers.setSelectedNode(data, 'id', node.id);
    if (this.selectedNode) {
      this.selectedNode.active = true;
      this.selectedNode.column1 = node.column1;
      this.selectedNode.column2 = node.column2;
      this.selectedNode.column3 = node.column3;
      this.selectedNode.column4 = node.column4;
      this.selectedNode.editableColumn4 = node.editableColumn4;
      this.selectedNode.editableColumn3 = node.editableColumn3;
      this.selectedNode.editableColumn2 = node.editableColumn2;
      this.selectedNode.editableColumn1 = node.editableColumn1;
      this.selectedNode.type = node.type;
      this.selectedNode.name = node.name;
      this.selectedNode.columnsMaxLenght = node.columnsMaxLenght;
      if (this.props.onItemChanged) {
        this.props.onItemChanged(this.selectedNode);
      }
    }

    // let summedData = helpers.sumNodeHeader(data, true);
    this.setValues(data);

  }

  render() {
    let { context } = this.props;
    return (<div>
      <div style={{ paddingBottom: 12, paddingLeft: 12, paddingRight: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16, color: context.theme.boaPalette.base400 }}>{this.props.title}</div>
        <BLinearPanel orientation='horizontal'>
          <BButton context={context} text={this.getMessage('Loans', 'ExpandAll')} colorType='primary' onClick={this.expandAll} />
          <BButton context={context} text={this.getMessage('Loans', 'CollapseAll')} colorType='primary' onClick={this.collapseAll} />
          <BIconButton
            style={{ width: 34, height: 34 }}
            context={context}
            iconProperties={{ nativeColor: this.props.context.theme.boaPalette.pri500 }}
            dynamicIcon='MoreVert'
            onClick={this.props.onOptionClick} />
        </BLinearPanel>
      </div>
      <div style={{ borderBottom: '1px solid ' + this.props.context.theme.boaPalette.base200 }}>
        <TreeView
          context={context}
          ref={r => this.treeView = r}
          data={this.state.data}
          onToggle={this.handleOnToggle}
          onChange={this.onChange}
          isRightToLeft={this.props.context.localization.isRightToLeft}
          decorators={decorators} />
      </div>
    </div>);
  }
}

export default BTreeViewGrid;
