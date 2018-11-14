import React from 'react';
import { action } from '@storybook/addon-actions';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { ComponentBase } from '@boa/base';
import { DocViewer } from '@boa/components/DocViewer';
import { DocCode } from '@boa/components/DocCode';
import PropsPanel from './props-panel';
import * as Utils from './utils';

export default class Preview extends ComponentBase {
  constructor(props, context) {
    super(props, context);
    this.componentPropertySource = [];
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
    this.onApplyClick = this.onApplyClick.bind(this);
    this.componentRef = React.createRef();
  }

  state = {
    availableProperties: [],
    currentProperties: {},
    selectedTheme: 'violet',
    selectedLanguage: 1,
  };

  componentWillMount() {
    this.prepareData();
  }

  prepareData() {
    const self = this;
    const propMetaData = self.props.doc.props;

    const availableProperties = [];
    const currentProperties = {};

    Object.keys(propMetaData)
      .sort()
      .forEach(key => {
        const prop = propMetaData[key];

        if (prop.description && prop.description.includes('@ignore')) return;
        const property = {
          name: key,
          type: Utils.getPropType(prop),
          value: Utils.getPropValue(prop),
          values: Utils.getAavailableValues(prop),
          default: Utils.getDefaultValue(prop),
        };
        availableProperties.push(property);
        const defaultValue = Utils.getDefaultValue(prop);
        if (defaultValue) currentProperties[key] = defaultValue;
      });

    if (availableProperties && availableProperties.length > 0) {
      availableProperties.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
    }

    currentProperties.data = this.props.sampleData;
    this.setState({ availableProperties, currentProperties }, () => {
      const code = self.getComponentString();
      this.setState({ code });
    });
  }

  getName() {
    return this.props.doc.displayName;
  }

  propertyChanged(property, value) {
    const self = this;
    const { currentProperties } = this.state;
    const newCurrentProperties = Object.assign({}, currentProperties);
    newCurrentProperties[property] = value;
    this.setState({ currentProperties: newCurrentProperties }, () => {
      const code = self.getComponentString();
      self.setState({ code });
    });
  }

  onPropertyChanged(property, value) {
    if (this.props.applyRequired) {
      if (!this.waitingChanges) {
        this.waitingChanges = [];
      }
      this.waitingChanges.push({ property, value });
    } else {
      this.propertyChanged(property, value);
    }
  }

  onApplyClick() {
    const self = this;
    self.waitingChanges.forEach(change => {
      self.propertyChanged(change.property, change.value);
    });
  }

  render() {
    const self = this;
    const RenderedComponent = this.props.component;
    const { availableProperties, currentProperties } = this.state;

    if (!availableProperties || availableProperties.length === 0) {
      return null;
    }

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '100%' }}>
            <DocViewer content={'## Props'} editorType="github" />
            <PropsPanel
              onApplyClick={this.onApplyClick}
              availableProperties={availableProperties}
              onPropertyChanged={this.onPropertyChanged}
              {...this.props}
            />
          </div>
          <div style={{ marginLeft: 100, width: '100%' }}>
            <DocViewer content="## Preview" editorType="github" />
            {this.props.sample}
            {!this.props.sample && (
              <RenderedComponent
                {...currentProperties}
                ref={this.componentRef}
                onChange={action(`${self.getName()}-onChange`)}
                onClick={action(`${self.getName()}-onClick`)}
                context={this.props.context}
              />
            )}
          </div>
        </div>
        {this.state.code && (
          <DocCode content={this.state.code} highlight lang={'js'} editorType="github" />
        )}
      </div>
    );
  }

  getComponentString() {
    const RenderedComponent = this.props.component;
    const RenderedComponentString = reactElementToJSXString(
      <RenderedComponent {...this.props} {...this.state.currentProperties} />,
      {
        displayName: this.getName.bind(this),
        filterProps: ['context', 'maxFontSize', 'minFontSize', 'doc'],
      },
    );
    return `import ${this.getName()} from '@boa/components/${this.getName()}';

${RenderedComponentString}`;
  }
}
