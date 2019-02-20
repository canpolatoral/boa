import React from 'react';
import { action } from '@storybook/addon-actions';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { ComponentBase } from '@kuveytturk/boa-base';
import { DocViewer } from '@kuveytturk/boa-components/DocViewer';
import { DocCode } from '@kuveytturk/boa-components/DocCode';
import PropsPanel from './props-panel';
import * as Utils from './utils';
// import BaseProps from './doc.json';

export default class Preview extends ComponentBase {
  constructor(props, context) {
    super(props, context);
    this.componentPropertySource = [];
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
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
          values: Utils.getAvailableValues(prop),
          default: Utils.getDefaultValue(prop),
        };

        availableProperties.push(property);
        const defaultValue = Utils.getDefaultValue(prop);
        if (defaultValue) {
          currentProperties[key] = defaultValue;
        }
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

    // currentProperties.data = this.props.sampleData;
    Object.assign(currentProperties, this.props.defaultProps);

    this.setState({ availableProperties, currentProperties }, () => {
      const code = self.getComponentString();
      this.setState({ code });
    });
  }

  getName() {
    return this.props.doc.displayName;
  }

  propertyChanged(property, val) {
    let value = val;
    /*
     * If component propType is oneOf([..]) and values are not string
     * The NativeSelect component (on the props-panel.js) returns selected value as string,
     * So we are find the correct value from doc.json
     */
    if (typeof value === 'string') {
      const values = Utils.getAvailableValues(this.props.doc.props[property]);
      if (values && values.length > 0) {
        value = values.find(x => x.toString() === val);
      }
    }

    this.setState((prevState) => {
      const newCurrentProperties = Object.assign({}, prevState.currentProperties);
      newCurrentProperties[property] = value;
      return { currentProperties: newCurrentProperties };
    }, () => {
      const code = this.getComponentString();
      this.setState({ code });
    });
  }

  onPropertyChanged(property, value) {
    this.propertyChanged(property, value);
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
              availableProperties={availableProperties}
              currentProperties={currentProperties}
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
      <RenderedComponent {...this.state.currentProperties} />,
      {
        displayName: this.getName.bind(this),
        filterProps: [
          'context',
          'doc',
          'data',
          'componentSize',
          'newLine',
        ],
      },
    );

    const strings = RenderedComponentString.split('\n');
    strings.splice(1, 0, '  context={context}');
    return `import ${this.getName()} from '@kuveytturk/boa-components/${this.getName()}';

${strings.join('\n')}`;
  }
}
