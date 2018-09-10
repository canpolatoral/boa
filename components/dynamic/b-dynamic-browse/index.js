import React from 'react';
import extend from 'lodash/extend';
import camelCase from 'lodash/camelCase';

const resourceInfo = require('./assets/data/resourceInfo.json');

import { BCard } from 'b-card';
import { BBrowseForm } from 'b-browse-form';
import { BProgress } from 'b-progress';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { BDynamic } from 'b-dynamic';
import * as BDynamicComponents from 'b-dynamic-components';

export class BDynamicBrowse extends BDynamic {
  criteriaComponents;

  constructor(props, context) {
    super(props, context);
    this.onActionClick = this.onActionClick.bind(this);
    this.resourceInfo = resourceInfo;
  }

  render() {
    if (this.state.isActionsLoaded && this.state.isComponentsLoaded) {
      return this.renderForm();
    } else {
      if (this.state.hasError) {
        return this.renderError();
      } else {
        return this.renderLoading();
      }
    }
  }

  renderLoading() {
    return (
      <BBrowseForm
        context={this.props.context}
        dataSource={this.props.dataSource}
        columns={this.state.columns}
        onActionClick={this.onActionClick}
        resourceInfo={this.resourceInfo}
        onClosing={this.props.onClosing}>
        <BCard context={this.props.context}>
          <BProgress context={this.props.context} />
          <h5>{this.state.message}</h5>
        </BCard>
      </BBrowseForm>
    );
  }

  renderForm() {
    this.criteriaComponents = this.getCriteriaComponents();
    const rows = this.criteriaComponents.map((component) => {
      return (
        <BGridRow context={this.props.context}>
          {component}
        </BGridRow>
      );
    });

    return (
      <BBrowseForm
        context={this.props.context}
        dataSource={this.props.dataSource}
        columns={this.state.columns}
        onActionClick={this.onActionClick}
        resourceInfo={this.resourceInfo}
        onClosing={this.props.onClosing}>
        <BGridSection context={this.props.context}>
          {rows}
        </BGridSection>
      </BBrowseForm>
    );
  }

  renderError() {
    return (
      <BBrowseForm
        context={this.props.context}
        dataSource={this.state.dataList}
        columns={this.state.columns}
        onActionClick={this.onActionClick}
        resourceInfo={this.resourceInfo}
        onClosing={this.props.onClosing}>
        <BCard context={this.props.context}>
          <h5>{this.state.message}</h5>
        </BCard>
      </BBrowseForm>
    );
  }

  getCriteriaComponents() {
    const criteriaComponents = [];

    this.components.forEach((component) => {
      if (component.boaOneComponentName && component.packageName) {
        const cmpProps = this.generateProps(component);
        const defaultProps = { ref: r => this[component.componentName] = r, params: this.props.params, key: component.componentName, context: this.props.context };
        const props = extend({}, defaultProps, cmpProps);
        const cmp = BDynamicComponents.getModule(component.packageName);
        if (cmp) {
          const element = React.createElement(cmp, props, null);
          criteriaComponents.push(element);
        }
      }
    });

    return criteriaComponents;
  }

  afterActionsReceived() {
    const getInfoAction = this.actions.filter((action) => {
      if (action.returnColumnKeyValueList && action.returnColumnKeyValueList.length > 0) {
        return action;
      }
    });

    if (getInfoAction && getInfoAction.length == 1) {
      const columns = {};
      getInfoAction[0].returnColumnKeyValueList.forEach((prop) => {
        columns[camelCase(prop.key)] = prop.value;
      });
      this.setState({ columns: columns });
    }
  }
}

BDynamicBrowse.defaultProps = {
  resourceCode: 'YONTKMTPLS', // YONTOKRTOY
  onError: (err) => {
    alert(err);
  },
  onExecuteAction: (request) => {
    this.debugLog.log(request);
  }
};

export default BDynamicBrowse;
