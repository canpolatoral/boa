import * as React from 'react';
import PropTypes from 'prop-types';
import PanelAvailableComponentItem from './PanelAvailableComponentItem';
import Components from '../../src/components/catalog';
import * as TreeHelper from '../helpers/tree/tree';
import _ from 'lodash';

export default class PanelAvailableComponents extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.findDescriptions = this.findDescriptions.bind(this);
    this.renderCategoryTree = this.renderCategoryTree.bind(this);
    this.createCategoryTree = this.createCategoryTree.bind(this);

    this.state = {
      filter: '',
      selectedComponentName: ''
    };
    this.index = 0;
  }

  handleClick(type, data, name) {

    var typeFunc = this.findComponent(Components, type, 0);

    this.props.onClick(typeFunc, data);

    this.setState({
      selectedComponentName: name
    });
  }

  findComponent(index, componentName, level) {
    let result = null;
    if (index && _.isObject(index) && level <= 2) {
      level++;
      _.forOwn(index, (value, key) => {
        if (!result) {
          if (key === componentName) {
            result = value;
          } else if (value && _.isObject(value)) {
            result = this.findComponent(value, componentName, level);
          }
        }
      }, this);
    }
    return result;
  }


  findDescriptions(componentList, modelCollection, level) {
    if (componentList && _.isObject(componentList) && level <= 1) {
      level++;

      _.forOwn(componentList, value => {
        if (value.Description) {
          modelCollection.push(value.Description);
        }
        else if (value && _.isObject(value) && !_.has(value, 'render')) {
          this.findDescriptions(value, modelCollection, level);
        }
      }, this);
    }

    return modelCollection;
  }

  renderCategoryTree(node) {
    if (node) {
      if (node.ChildrenCount < 1) {
        return (
          <PanelAvailableComponentItem
            onClick={this.handleClick}
            key={`item${node.Properties.displayName}${node.ChildrenCount}`}
            componentName={node.Properties.displayName}
            selectedComponentName={this.state.selectedComponentName}
            componentType={node.Properties.type}
            data={node.Properties.data}

            snaps={this.props.snaps}
          />
        );
      }
      else {
        const Menu = node.Children.map((child) => {
          return this.renderCategoryTree(child);
        });

        const id = node.Value.toString().replace(/ /g, '');
        const anchorId = `${id}_anchor`;
        const stylish = {
          paddingLeft: 15
        };

        return (
          <div key={id}>
            <a id={anchorId} data-toggle="collapse" aria-expanded="false" href={`#${id}`}
              onClick={() => this.handleMenuClick(anchorId, node.Value)} style={{ display: 'block', padding: '5px 15px' }}>
              {`+ ${node.Value}`}
            </a>
            <div id={id} style={stylish} className={'collapse'}>
              {Menu}
            </div>
          </div>
        );
      }
    }
  }

  handleMenuClick(id, innerText) {
    let item = document.getElementById(id);

    if (item.getAttribute('aria-expanded') === 'true') {
      item.innerText = `- ${innerText}`;
    } else {
      item.innerText = `+ ${innerText}`;
    }
  }

  createCategoryTree(categories, properties) {
    if (!this.categoryTree) {
      this.categoryTree = new TreeHelper.TreeModule.Tree('Components', null);
    }

    categories.map((nodeCandidate) => {
      const nodeIndex = categories.indexOf(nodeCandidate);
      const parentVal = nodeIndex > 0 ? categories[nodeIndex - 1] : this.categoryTree.Root.Value;
      const isLeaf = nodeIndex == categories.length - 1;

      if (!this.categoryTree.FindNode(nodeCandidate, this.categoryTree.Root)) {
        const node = isLeaf ? new TreeHelper.TreeModule.TreeNode(nodeCandidate, properties) : new TreeHelper.TreeModule.TreeNode(nodeCandidate);
        const parent = this.categoryTree.FindNode(parentVal, this.categoryTree.Root);
        parent.AddChild(node);
      }
    });
  }

  render() {
    this.index=0;
    const componentTreeModel = this.findDescriptions(Components, [], 0);
    let counter = 0;

    _.forEach(componentTreeModel, (desObj) => {
      let components = [];

      components.push(
        <PanelAvailableComponentItem
          onClick={this.handleClick}
          key={`item${desObj.properties.type}${counter}`}
          componentName={desObj.properties.displayName}
          ref={desObj.properties.displayName}
          selectedComponentName={this.state.selectedComponentName}
          componentType={desObj.properties.type}
          data={desObj.properties.data}

        />
      );

      if (components.length > 0) {
        let categoriesArray = desObj.category.split('/');
        categoriesArray.push(desObj.properties.displayName);
        this.props.allrefs[this.index] =  {
          'text': desObj.properties.displayName,
          'value': desObj.properties.displayName};
        this.index++;
        this.createCategoryTree(categoriesArray, desObj.properties);
      }

      counter++;
    });

    const accordionContent = this.categoryTree.Root.Children.map(this.renderCategoryTree, this);

    const panelAdditionalStyle = {
    };

    return (
      <div style={panelAdditionalStyle}>
        {accordionContent}
      </div>
    );
  }
}

PanelAvailableComponents.propTypes = {
  onClick: PropTypes.func.isRequired
};
