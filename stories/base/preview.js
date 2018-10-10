import React from 'react';

import { action } from '@storybook/addon-actions';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { ComponentBase } from 'b-component';
import { DocViewer } from 'b-doc-viewer';
import { DocCode } from 'b-doc-code';

import PropsPanel from './props-panel';

export default class Playground extends ComponentBase {

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
    selectedLanguage: 1
  };

  componentWillMount() {
    this.prepareData();
  }

  prepareData() {
    const self = this;
    const propMetaData = self.props.doc.props;

    const availableProperties = [];
    const currentProperties = {};

    Object.keys(propMetaData).sort().forEach((key) => {
      const prop = propMetaData[key];
      const property = { name: key, type: self.getPropType(prop), values: self.getAavailableValues(prop), default: self.getDefaultValue(prop) };
      availableProperties.push(property);
      const defaultValue = self.getDefaultValue(prop);
      if (defaultValue)
        currentProperties[key] = defaultValue;
    });

    if (availableProperties && availableProperties.length > 0) {
      availableProperties.sort((a, b) => {
        if (a.type < b.type)
          return -1;
        else if (a.type > b.type)
          return 1;
        else if (a.name > b.name)
          return 1;
        else if (a.name < b.name)
          return -1;
        return 0;
      });
    }

    this.setState({ availableProperties, currentProperties }, () => {
      const code = self.getComponentString();
      this.setState({ code });
    });

  }

  getPropType(prop) {
    let propType = '';
    if (prop && prop.type) {
      propType = prop.type.name;
      if (prop.type.raw)
        propType = prop.type.raw;
      if (prop.type.value) {
        if (Array.isArray(prop.type.value)) {
          if (prop.type.value[0].value) { // oneOf
            propType = 'oneOf(';
            prop.type.value.forEach((item) => {
              propType = propType + item.value + ', ';
            });
            propType = propType.slice(0, propType.length - 2) + ')';
          } else { // oneOfType
            propType = 'oneOfType(';
            prop.type.value.forEach((item) => {
              propType = propType + item.name + ', ';
            });
            propType = propType.slice(0, propType.length - 2) + ')';
          }
        } else if (typeof prop.type.value === 'object') {
          propType = prop.type.name + '(' + prop.type.value.name + ')';
        }
      }
    }
    return propType;
  }

  getAavailableValues(prop) {
    if (prop && prop.type) {
      if (prop.type.value) {
        if (Array.isArray(prop.type.value)) {
          if (prop.type.value[0].value) { // oneOf
            return prop.type.value.map((item) => {
              return item.value;
            });
          }
        }
      }
    }
  }

  getDefaultValue(prop) {
    return prop.defaultValue ? prop.defaultValue.value : null;
  }

  getName() {
    return this.props.doc.displayName;
  }

  propertyChanged(property, value) {
    const self = this;
    let currentProperties = Object.assign({}, this.state.currentProperties);
    currentProperties[property] = value;

    this.setState({ currentProperties }, () => {
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
    self.waitingChanges.forEach((change) => {
      self.propertyChanged(change.property, change.value);
    });
  }

  render() {
    const self = this;
    const RenderedComponent = this.props.component;
    const { availableProperties, currentProperties } = this.state;

    if (!availableProperties || availableProperties.length == 0) {
      return null;
    }

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '100%' }}>
            <DocViewer content={'## Props'} editorType='github' />
            <PropsPanel onApplyClick={this.onApplyClick} availableProperties={availableProperties} {...this.props} onPropertyChanged={this.onPropertyChanged} />
          </div>
          <div style={{ marginLeft: 100, width: '100%' }}>
            <DocViewer content='## Preview' editorType='github' />
            <RenderedComponent {...currentProperties} ref={this.componentRef} onChange={action(self.getName() + '-onChange')} onClick={action(self.getName() + '-onClick')} context={this.props.context}></RenderedComponent>
          </div>
        </div>
        {
          this.state.code && <DocCode content={this.state.code} highlight={true} lang={'js'} editorType='github' />
        }
      </div>);
  }

  getComponentString() {
    const RenderedComponent = this.props.component;
    const RenderedComponentString = reactElementToJSXString((<RenderedComponent context={this.props.context} {...this.state.currentProperties}></RenderedComponent>), { displayName: this.getName.bind(this), filterProps: ['context', 'maxFontSize', 'minFontSize'] });
    return `import ${this.getName()} from '@boa-components';

${RenderedComponentString}`;
  }
}
