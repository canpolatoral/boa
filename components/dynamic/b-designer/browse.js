import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import find from 'lodash/find';
import indexOf from 'lodash/indexOf';
import { DragDropContext } from 'react-dnd';
import BDesignerProperties from './pane/properties';
import BDropArea from './drag-drop/area';

import { BBrowseForm } from 'b-browse-form';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import * as BDragDrop from 'b-drag-drop';
import { getModule } from 'b-dynamic-components';
import { BComponent } from 'b-component';
import _ from 'lodash';

var composeDragSource = BDragDrop.composeDragSource;

@DragDropContext(HTML5Backend)
export class BDesignerBoard extends BComponent {
  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
    this.generateElementKey = this.generateElementKey.bind(this);
    this.onDropToTrash = this.onDropToTrash.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onDropToCriteria = this.onDropToCriteria.bind(this);
    this.getModel = this.getModel.bind(this);
    this.onClosing = this.onClosing.bind(this);
    this.onPropertiesExpandChanged = this.onPropertiesExpandChanged.bind(this);
    this.state = {
      components: [],
      columns: [{ key: 'column1', name: this.getMessage('BusinessComponents', 'UnSelectedColumn'), width: 500 }],
      renderCount: 1
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this.counts = [];
    this.lastSelectedElement = null;
    this.ownerOfLastSelectedElement = null;
    const properties = {
      key: 'dropArea',
      context: this.props.context,
      onDrop: this.onDropToCriteria,
      hoverColor: 'chartreuse',
      canDrop: (props, monitor) => {
        if (monitor.getItem().owner)
          return false;
        return true;
      }
    };
    let area = (<div style={{ minHeight: 100 }}></div>);
    this.dropArea = React.createElement(BDropArea, Object.assign({}, properties), area);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.model != nextProps.model) {
      this.setModel(nextProps.model);
    }
  }

  onClosing() {
    if (this.props.onClosing) {
      this.props.onClosing();
    }
  }

  onClick(item) {
    this[item.props.itemKey].decoratedComponentInstance.setSelected();
    if (this.lastSelectedElement && this.lastSelectedElement !== item.props.itemKey)
      this[this.lastSelectedElement].decoratedComponentInstance.clearSelected();

    var availableProperties = this.properties.getProperties(item.props.className);
    this.lastSelectedElement = item.props.itemKey;
    this.ownerOfLastSelectedElement = item.props.owner;
    this.properties.showProperties(item.props, availableProperties, item.props.owner);
  }

  onDropToCriteria(component) {
    this.addElement(component);
  }

  onDropToTrash(dropped) {
    let components = this.state.components;
    const index = indexOf(components, find(components, item => item.key === dropped.itemKey));
    components.splice(index, 1);
    this.setState({
      components,
      renderCount : this.state.renderCount+1
    });

    if (this.lastSelectedElement === dropped.itemKey) {
      this[this.lastSelectedElement] = null;
      this.lastSelectedElement = null;
      this.ownerOfLastSelectedElement = null;
      this.properties.cleanProperties();
    }
  }

  onPropertyChanged(property, value) {
    let itemKey = this.lastSelectedElement;
    let components = this.state.components;
    const component = components.find(x => x.key === itemKey);
    const props = component.props;

    if (props[property] === value)
      return;

    if (property === 'itemKey') {
      this.lastSelectedElement = value;
    }

    let newProps = {};
    newProps[property] = value;
    const key = property === 'itemKey' ? value : component.key;
    newProps.key = key;
    newProps.itemKey = key;
    newProps.ref = r => this[key] = r; newProps.context = this.props.context;
    const bModule = getModule(props.packageName);
    const dragableElement = composeDragSource(bModule);

    let availableProperties = this.properties.getAvailableProperties();

    if (props.className === 'BComboBox' && property === 'columns') {
      var dataGridKeys = [];
      if (!value || !Array.isArray(value) || value.length == 0) {
        dataGridKeys = [
          {
            key: 'text',
            name: 'text',
            type: 'string',
            editable: true
          },
          {
            key: 'value',
            name: 'value',
            type: 'string',
            editable: true
          }
        ];
      } else {
        value.forEach((item) => {
          let dataSourceKey = { key: item.key, name: item.key, type: 'string', editable: true };
          dataGridKeys.push(dataSourceKey);
        });
      }

      let dataSourceProperty = availableProperties.find(x => x.name === 'dataSource');
      dataSourceProperty.dataGridKeys = dataGridKeys;
    }

    const newElement = React.createElement(dragableElement, Object.assign({}, props, newProps), null);
    const index = indexOf(components, find(components, item => item.key === component.key));
    components.splice(index, 1, newElement);

    if (Array.isArray(value)) {
      this.properties.showProperties(newElement.props, availableProperties, this.ownerOfLastSelectedElement);
    }

    components = _.cloneDeep(components);
    this.setState({ components }, () => {
      if (this.lastSelectedElement && this.lastSelectedElement === key)
        this[this.lastSelectedElement].decoratedComponentInstance.setSelected();
    });
  }

  onActionClick(e) {
    if (this.props.onActionClick) {
      this.props.onActionClick(e);
    }
    // eslint-disable-next-line
    console.log(JSON.stringify(this.getModel()));
    // eslint-disable-next-line
    console.log(JSON.stringify(this.getValues()));
  }

  onPropertiesExpandChanged(isExpanded) {
    this.browseForm.updateRightPane(isExpanded);
    if (this.lastSelectedElement) {
      let lastSelectedElement = this.state.components.find(x => x.key === this.lastSelectedElement);
      if (lastSelectedElement) {
        this.properties.updateProperties(lastSelectedElement.props, this.ownerOfLastSelectedElement);
      }
    }
  }

  render() {
    let rightPaneContent = (
      <div style={{ width: '100%' }}>
        <BDesignerProperties
          ref={r => this.properties = r}
          context={this.props.context}
          menuItems={this.props.menuItems}
          onPropertyChanged={this.onPropertyChanged}
          onExpandChange={this.onPropertiesExpandChanged}
          onDropToTrash={this.onDropToTrash} />
      </div>
    );

    return (
      <BBrowseForm
        ref={r => this.browseForm = r}
        context={this.props.context}
        rightPaneContent={rightPaneContent}
        rightPaneWidth={300}
        resourceInfo={this.props.resourceInfo}
        dataSource={[]}
        columns={this.state.columns}
        onClosing={this.onClosing}
        onActionClick={this.onActionClick}>
        <BGridSection context={this.props.context}>
          {
            this.state.components.map((component) => {
              return (
                <BGridRow context={this.props.context}>
                  {component}
                </BGridRow>
              );
            })
          }
          <BGridRow key='DropAreaRow' context={this.props.context}>
            {this.dropArea}
          </BGridRow>
        </BGridSection>
      </BBrowseForm>
    );
  }

  addElement(component) {
    const bModule = getModule(component.packageName);
    if (bModule) {
      const key = component.itemKey ? component.itemKey : this.generateElementKey(component.className);
      const properties = {
        context: this.props.context,
        ref: r => this[key] = r,
        key: key,
        itemKey: key,
        dragableStyle: {
          border: '1px dotted gray',
          borderRadius: 2
        },
        owner: 'criteria',
        onClick: this.onClick,
        beginDrag: this.showTrash.bind(this),
        endDrag: this.hideTrash.bind(this),
      };
      const dragableElement = composeDragSource(bModule);
      const props = Object.assign({}, component, properties);
      const element = React.createElement(dragableElement, props, null);
      let components = this.state.components;
      components.push(element);
      this.properties.updateProperties(props, props.owner);
      this.setState({
        components,
        renderCount: this.state.renderCount + 1
      });
    }
  }

  generateElementKey(type) {
    var element = this.counts.find(x => x.type == type);
    let key = null;
    if (element) {
      element.count++;
      key = `${type}${element.count}`;
    } else {
      this.counts.push({ type: type, count: 1 });
      key = `${type}1`;
    }

    if (this.checkKeyIsExsists(key))
      return this.generateElementKey(type);
    return key;
  }

  checkKeyIsExsists(key) {
    let components = this.state.components;
    let isExists = false;
    if (components && components.length > 0) {
      let item = components.find(x => x.itemKey === key);
      if (item)
        isExists = true;
    }
    return isExists;
  }

  showTrash() {
    this.properties.showTrash();
  }

  hideTrash() {
    this.properties.hideTrash();
  }

  getModel() {
    let form = {};
    let components = [];
    this.state.components.forEach((cmp) => {
      let component = {};
      component.key = cmp.key;
      component.props = this.getProps(cmp.props);
      components.push(component);
    });
    form.components = components;
    return form;
  }

  getProps(element) {
    let props = {};
    Object.keys(element).forEach((key) => {
      if (element[key] !== null && !key.toLowerCase().includes('style') && key !== 'context' && typeof element[key] !== 'function') {
        props[key] = element[key];
      }
    });
    return props;
  }

  getChildren(elements) {
    var children = [];
    elements.forEach((child) => {
      let childObject = {};
      childObject.key = child.key;
      childObject.props = this.getProps(child.props);
      children.push(childObject);
    });
    return children;
  }

  setModel(model) {
    if (model) {
      model.components.forEach((item) => {
        this.addElement(item.props);
      });
    }
  }

  getValues() {
    let values = [];
    if (this.state.components && this.state.components.length > 0) {
      this.state.components.forEach((child) => {
        let componentValues = this.properties.getValues(child.props.className);
        if (componentValues) {
          componentValues.forEach((componentValue) => {
            let valueString = `${child.key}.${componentValue}`;
            values.push(valueString);
          });
        }
      });
    }
    return values;
  }
}
export default BDesignerBoard;
