import find from 'lodash/find';
import indexOf from 'lodash/indexOf';
import cloneDeep from 'lodash/cloneDeep';
import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import BDesignerProperties from './pane/properties';
import DropableCard from './drag-drop/card';
 
import { BTransactionForm } from 'b-transaction-form';
import { BIconButton } from 'b-icon-button';
import { BCard } from 'b-card';
import { BInput } from 'b-input';
import * as BDragDrop from 'b-drag-drop';
import { getModule } from 'b-dynamic-components';
import { BComponent } from 'b-component';

import { getFrameworkMessage } from 'b-messaging';

var composeDragSource = BDragDrop.composeDragSource;

@DragDropContext(HTML5Backend)
export class BDesignerBoard extends Component {
  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
    this.onCardClicked = this.onCardClicked.bind(this);
    this.generateElementKey = this.generateElementKey.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.onDropToTrash = this.onDropToTrash.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onDropCartToCard = this.onDropCartToCard.bind(this);
    this.onDropComponentToCard = this.onDropComponentToCard.bind(this);
    this.getModel = this.getModel.bind(this);
    this.onClosing = this.onClosing.bind(this);
    this.onPropertiesExpandChanged = this.onPropertiesExpandChanged.bind(this);
    this.state = {
      cards: [],
      children: {}
    };
  }

  componentWillMount() {
    this.counts = [];
    this.lastSelectedElement = null;
    this.ownerOfLastSelectedElement = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.model != nextProps.model)
      this.setModel(nextProps.model);
  }

  onCardClicked(column) {
    this.generateCard(column);
  }

  onClick(item) {
    this[item.props.itemKey].decoratedComponentInstance.setSelected();
    if (!this.state[this.lastSelectedElement] || (this.state[this.lastSelectedElement] && this.state[this.lastSelectedElement].className !== 'BCard') ) {
      if (this.lastSelectedElement && this.lastSelectedElement !== item.props.itemKey)
        this[this.lastSelectedElement].decoratedComponentInstance.clearSelected();
    } else {
       // clean card title style
      let cards = this.state.cards;
      if (cards && cards.length > 0) {
        let item = cards.find(x => x.itemKey === this.lastSelectedElement);
        if (item) {
          item.titleStyle = {};
          this.setState({ cards : cards });
        }
      }
    } 
      
    var availableProperties = this.properties.getProperties(item.props.className);
    this.lastSelectedElement = item.props.itemKey;
    this.ownerOfLastSelectedElement = item.props.owner;
    this.properties.showProperties(item.props, availableProperties, item.props.owner);
    this.properties.updateComponentPropertySource(this.getComponentValues());
  }

  onDropCartToCard(card1, card2) {
    let childrenCopy = cloneDeep(this.state.children);
    let childrenOfCard1 = childrenCopy[card1];
    let childrenOfCard2 = childrenCopy[card2];

    let children;
    childrenOfCard1.forEach((child) => {
      children = this.addElement(card2, child.props);
      children = this.removeElement(card1, child.key);
    });

    childrenOfCard2.forEach((child) => {
      children = this.addElement(card1, child.props);
      children = this.removeElement(card2, child.key);
    });

    this.setState({ children }, () => {
      if (this.lastSelectedElement)
        this[this.lastSelectedElement].decoratedComponentInstance.setSelected();
    });
  }

  onDropComponentToCard(card, component) {
    let children = this.addElement(card, component);
    if (component.owner) {
      children = this.removeElement(component.owner, component.itemKey);
    }
    if (children) {
      this.setState({ children }, () => {
        if (this.lastSelectedElement && this.lastSelectedElement === component.itemKey)
          this[this.lastSelectedElement].decoratedComponentInstance.setSelected();
      });
    }
  }

  onDropToTrash(dropped) {
    let children;
    if (dropped.className !== 'BCard') {
      children = this.removeElement(dropped.owner, dropped.itemKey);
      this.setState({ children });
    } else {
      let cards = this.state.cards;
      const index = indexOf(cards, find(cards, item => item.key === dropped.itemKey));
      cards.splice(index, 1);
      children = this.state.children;
      children[dropped.itemKey] = [];
      this.setState({ cards, children });
    }

    if (this.ownerOfLastSelectedElement === dropped.itemKey || this.lastSelectedElement === dropped.itemKey) {
      this[this.lastSelectedElement] = null;
      this.lastSelectedElement = null;
      this.ownerOfLastSelectedElement = null;
      this.properties.cleanProperties();
    }
  }

  onPropertyChanged(property, value) {

    // card title property update
    let cards = this.state.cards;
    let item = this.state[this.lastSelectedElement];
    if (cards && cards.length > 0 && item) {
      const index = indexOf(cards, item);
      cards[index][property] =  value;
      this.setState({ cards });
      return;
    }

    if (property == 'updateProperties' && value == 'updateProperties') {
      if (this.lastSelectedElement) {
        let lastSelectedElement = this.state.children[this.ownerOfLastSelectedElement].find(x => x.key === this.lastSelectedElement);
        if (lastSelectedElement) {
          this.properties.updateProperties(lastSelectedElement.props, this.ownerOfLastSelectedElement);
        }
      }
      return;
    }

    let itemKey = this.lastSelectedElement;
    let owner = this.ownerOfLastSelectedElement;
    let children = this.state.children;
    const child = children[owner].find(x => x.key === itemKey);
    const props = child.props;

    if (property.indexOf('.') === -1 && props[property] === value)
      return;

    if (property === 'itemKey') {
      this.lastSelectedElement = value;
    }

    let newProps = {};
    if (property.indexOf('.') > -1) {
      var pieces = property.split('.');
      var objectName = pieces[0];
      var propertyName = pieces[1];
      if (!newProps[objectName]) {
        newProps[objectName] = {};
      }
      newProps[objectName][propertyName] = value;
    }

    if (property === 'dynamicSource') {
      newProps[property] = Object.assign({}, value);
    }
    else if (child.props.className === 'BGridActionPanel' && (property === 'buttonOpenScreen')) {
      if (property === 'buttonOpenScreen') {
        newProps['buttonOpenScreen'] = {
          resourceData: value.resourceData
        };
      }
    }
    else {
      newProps[property] = value;
    }

    const key = property === 'itemKey' ? value : child.key;
    newProps.key = key;
    newProps.itemKey = key;
    newProps.ref = r => this[key] = r;
    newProps.context = this.props.context;
    const bModule = getModule(props.packageName);
    const dragableElement = composeDragSource(bModule);

    let availableProperties = this.properties.getAvailableProperties();

    if (child.props.className === 'BComboBox' && property === 'columns') {
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

    var isEditable = false;
    if (child.props.className === 'BGridActionPanel' && property === 'editable') {
      isEditable = value;
      props.columns && props.columns.map((column) => {
        if (isEditable && column.key && column.key != 'isSelected') {
          column.reactTemplate =
            (dataitem, innerContext) =>{
              return (
                <BInput
                  context={innerContext}
                  value={dataitem && dataitem[column.key]}
                  hintText={'Giriniz'}
                  inlineGridMode={true}
                  onChange={(e, v)=>{
                    dataitem[column.key]=v;
                  }}
                />
              );
            };
        }
        else {
          column.template = undefined;
          column.reactTemplate = undefined;
        }
      });
    }
    else if (child.props.className === 'BGridActionPanel' && property === 'dynamicSource') {
      isEditable = props.editable;
      newProps['columns'] = [];
      value.returnColumnList && value.returnColumnList.map((column) => {
        if (column.isShow) {
          var columnKey : String = '';
          var columnVisibleName : String = '';
          if (column.returnColumnName && column.returnColumnName.length > 0) {
            columnKey = column.returnColumnName.toLowerCase();
          }
          else {
            columnKey = 'c' + column.order;
          }
          if (column.returnColumnLabel && column.returnColumnLabel.indexOf('.') > -1) {
            var pieces = column.returnColumnLabel.split('.');
            var messagingGroupName = pieces[1];
            var messagingPropertyName = pieces[2];
            if (messagingGroupName && messagingPropertyName) {
              columnVisibleName = getFrameworkMessage(messagingGroupName, messagingPropertyName);
            }
            else {
              columnVisibleName = column.returnColumnName;
            }
          }
          else {
            columnVisibleName = column.returnColumnName;
          }

          if (isEditable) {
            newProps['columns'].push({
              key : columnKey,
              name: columnVisibleName,
              reactTemplate:
                (dataitem, innerContext) =>{
                  return (
                    <BInput
                      context={innerContext}
                      value={dataitem && dataitem[columnKey]}
                      hintText={'Giriniz'}
                      inlineGridMode={true}
                      onChange={(e, v)=>{
                        dataitem[columnKey]=v;
                      }}
                    />
                  );
                }
            });
          }
          else {
            newProps['columns'].push({
              key : columnKey,
              name: columnVisibleName
            });
          }
        }
      });
    }

    const newElement = React.createElement(dragableElement, Object.assign({}, props, newProps), null);
    const index = indexOf(children[owner], find(children[owner], item => item.key === child.key));
    children[owner].splice(index, 1, newElement);

    if (Array.isArray(value)) {
      this.properties.showProperties(newElement.props, availableProperties, this.ownerOfLastSelectedElement);
    }
    this.setState({ children }, () => {
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

  onClosing() {
    if (this.props.onClosing) {
      this.props.onClosing();
    }
  }

  onPropertiesExpandChanged(isExpanded) {
    this.transactionForm.updateRightPane(isExpanded);
    if (this.lastSelectedElement) {
      let lastSelectedElement = this.state.children[this.ownerOfLastSelectedElement].find(x => x.key === this.lastSelectedElement);
      if (lastSelectedElement) {
        this.properties.updateProperties(lastSelectedElement.props, this.ownerOfLastSelectedElement);
      }
    }
  }

  render() {
    let isSingleColumn = this.isSingleColumn();
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
      <BTransactionForm
        ref={r => this.transactionForm = r}
        context={this.props.context}
        rightPaneContent={rightPaneContent}
        rightPaneWidth={300}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.onClosing}
        onActionClick={this.onActionClick}>
        {this.state.cards.map((card) => {
          return (
            <DropableCard {...card}>
              {
                this.state.children[card.itemKey].map((child) => {
                  return child;
                })
              }
            </DropableCard>
          );
        })}
        <BCard context={this.props.context} column={0} style={{ opacity: 0.3, minHeight: 96, textAlign: 'center' }}>
          <BIconButton key='AddCard1' onClick={() => { this.onCardClicked(0); }} context={this.props.context} dynamicIcon='AddBox' />
        </BCard>
        {
          !isSingleColumn &&
          <BCard context={this.props.context} column={1} style={{ opacity: 0.3, minHeight: 96, textAlign: 'center' }}>
            <BIconButton key='AddCard2' onClick={() => { this.onCardClicked(1); }} context={this.props.context} dynamicIcon='AddBox' />
          </BCard>
        }
      </BTransactionForm>
    );
  }

  isSingleColumn() {
    if (this.transactionForm) {
      let alignMode = this.transactionForm.state.contentAlignMode;
      let isTransactionFormSingle = (alignMode == BComponent.ContentAlignMode.MOBILE || alignMode == BComponent.ContentAlignMode.SINGLE);
      if (isTransactionFormSingle) {
        return true;
      } else {
        if (this.state.cards && this.state.cards.length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  changeTitle(key) {
    let cards = this.state.cards;
  
    if (cards && cards.length > 0) {
      let item = cards.find(x => x.itemKey === key);
      if (item) {
      
        item.titleStyle = {  
          border : '3px dotted rgb(182, 24, 206)',
          margin: '-3px -3px',
          overflow: 'hidden',
        };

        // clean unselected cards titleStyle
        let unSelectedCards = [];
        cards.forEach((card) => {
          if (card.itemKey != item.itemKey)
            card.titleStyle = {};
          unSelectedCards.push(card);  
        });

        this.setState({ cards : cards });

        // onPropertyChanged can access after click header 
        this.state[item.key] = item;
        
        if (!this.state[this.lastSelectedElement] || (this.state[this.lastSelectedElement] && this.state[this.lastSelectedElement].className !== 'BCard') )
          if (this.lastSelectedElement && this.lastSelectedElement !== item.itemKey)
            this[this.lastSelectedElement].decoratedComponentInstance.clearSelected();
       
        var availableProperties = this.properties.getProperties(item.className);
        this.lastSelectedElement = item.itemKey;
        this.ownerOfLastSelectedElement = this.lastSelectedElement;
        this.properties.showProperties(item, availableProperties, 'BDataCard');
        this.properties.updateComponentPropertySource(this.getComponentValues()); 
      }   
    }
  }

  generateCard(column, itemKey, style, title) {
    title = title || 'header';
    const key = itemKey || this.generateElementKey('BCard');
    const properties = {
      context: this.props.context,
      column: column,
      key: key,
      itemKey: key,
      className: 'BCard',
      packageName: 'b-card',
      title : title,
      onClickTitle: this.changeTitle.bind(this, key),
      // onMouseDownCard: this.changeTitle.bind(this, key),
      style: style || { minHeight: 96 },
      generateElementKey: this.generateElementKey,
      removeElement: this.removeElement,
      onDropCartToCard: this.onDropCartToCard,
      onDropComponentToCard: this.onDropComponentToCard,
      beginDrag: this.showTrash.bind(this),
      endDrag: this.hideTrash.bind(this),
    };
    var cards = this.state.cards;
    cards.push(properties);
    var children = this.state.children;
    children[key] = [];
    this.setState({ cards, children });
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
    let cards = this.state.cards;
    if (cards && cards.length > 0) {
      let item = cards.find(x => x.itemKey === key);
      if (item)
        return true;
    }

    let isExists = false;
    cards.forEach(x => {
      var children = this.state.children[x.itemKey];
      if (children && children.length > 0) {
        let item = find(children, item => item.key === key);
        if (item)
          isExists = true;
      }
    });

    return isExists;
  }

  addElement(card, component) {
    const bModule = getModule(component.packageName);
    if (bModule) {
      let children = this.state.children;
      const key = component.itemKey || this.generateElementKey(component.className);
      const properties = {
        ref: r => this[key] = r,
        context: this.props.context,
        key: key,
        itemKey: key,
        owner: card,
        onClick: this.onClick,
        beginDrag: this.showTrash.bind(this),
        endDrag: this.hideTrash.bind(this),
      };
      const dragableElement = composeDragSource(bModule);
      const props = Object.assign({}, component, properties);
      const element = React.createElement(dragableElement, props, null);
      children[card].push(element);

      if (this.lastSelectedElement && this.lastSelectedElement === component.itemKey) {
        this.ownerOfLastSelectedElement = card;
        this.properties.updateProperties(props, card);
      }
      this.properties.setAvailableComponents(this.getValues());
      this.properties.updateComponentPropertySource(this.getComponentValues());
      return children;
    }
  }

  removeElement(card, component) {
    let children = this.state.children;
    const index = indexOf(children[card], find(children[card], item => item.key === component));
    children[card].splice(index, 1);
    this.properties.updateComponentPropertySource(this.getComponentValues());
    return children;
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
    this.state.cards.forEach((card) => {
      if (card.key !== 'BDataCard') {
        let cardObject = {};
        cardObject.key = card.key;
        cardObject.props = this.getProps(card);
        cardObject.children = this.getChildren(this.state.children[card.itemKey]);
        components.push(cardObject);
      }
    });

    let dataCard = {
      key: 'BDataCard',
      props: {
        column: 0,
        key: 'BDataCard',
        itemKey: 'BDataCard',
        className: 'BCard',
        packageName: 'b-card',
        style: { display: 'none' }
      },
      children: [
        {
          key: 'DataId',
          props: {
            packageName: 'b-input',
            className: 'BInput',
            itemKey: 'DataId',
            owner: 'BDataCard'
          }
        }
      ]
    };
    components.push(dataCard);
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
        if (item.props.className === 'BCard') {
          this.generateCard(item.props.column, item.props.itemKey, item.props.style, item.props.title);
          item.children.forEach((child) => {
            this.addElement(item.props.itemKey, child.props);
          });
        }
      });
    }
  }

  getValues() {
    let values = [];
    if (this.state.children && Object.keys(this.state.children).length > 0) {
      Object.keys(this.state.children).forEach((key) => {
        let children = this.state.children[key];
        if (children && children.length > 0) {
          children.forEach((child) => {
            let componentValues = this.properties.getValues(child.props.className);
            if (componentValues) {
              componentValues.forEach((componentValue) => {
                let valueString = `${child.key}.${componentValue}`;
                values.push(valueString);
              });
            }
          });
        }
      });
    }
    return values;
  }

  getComponentValues() {
    let values = [];
    if (this.state.children && Object.keys(this.state.children).length > 0) {
      Object.keys(this.state.children).forEach((key) => {
        let children = this.state.children[key];
        if (children && children.length > 0) {
          children.forEach((child) => {
            var componentName = child.props.itemKey;
            let propertyList = Object.assign([], this.properties.getValues(child.props.className));
            if (child.props.dynamicSource
              && child.props.dynamicSource.parameterList
              && child.props.dynamicSource.parameterList.length > 0) {
              child.props.dynamicSource.parameterList.forEach((parameter) => {
                propertyList.push('dynamicSource.spParameters.' + parameter.parameterName);
              });
            }
            values.push({ 'componentName': componentName, 'propertyList': propertyList });
          });
        }
      });
    }
    return values;
  }
}
export default  BDesignerBoard;
