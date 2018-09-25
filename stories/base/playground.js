import React from 'react';

import reactElementToJSXString from 'react-element-to-jsx-string';

import { BDocViewer } from 'b-doc-viewer';
import { BDocCode } from 'b-doc-code';

import { getReadablePropTypes } from './utils';

import { action } from '@storybook/addon-actions';
import { BComponent } from '../../src/base/b-component';
import PropsPanel from './props-panel';

export default class Playground extends BComponent {
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
    selectedLanguage: 1
  };

  componentWillMount() {
    this.prepareData();
  }

  prepareData() {
    const self = this;
    // if (this.props.component) {
    //   const RenderedComponent = this.props.component;
    //   console.log(RenderedComponent.propTypes);
    //   if (RenderedComponent.propTypes) {
    //     Object.keys(RenderedComponent.propTypes).forEach((key) => {
    //       console.log(key);
    //       const type = RenderedComponent.propTypes[key];
    //       if (type == PropTypes.string) {
    //         console.log(key + ' is a string property');
    //       }

    //     });
    //   }
    // }

    if (this.props.content && this.props.content.length > 0) {
      const availableProperties = this.props.content.find(x => x.name === 'Props');
      if (availableProperties && availableProperties.infoArray) {
        const infoArray = availableProperties.infoArray;
        if (infoArray.length > 0) {
          let currentProperties = {};
          infoArray.forEach((item) => {
            let defaultValue = self.findDefault(item.name);
            if (defaultValue) {
              currentProperties[item.name] = defaultValue;
            }
          });
          this.setState({ availableProperties: infoArray, currentProperties }, () => {
            const code = self.getComponentString();
            this.setState({ code });
          });
        }
      }
    }
  }

  componentDidUpdate() {
    if (!this.constructed) {
      let availableProperties = [];
      let currentProperties = {};

      if (this.componentRef && this.componentRef.current && this.componentRef.current.getComponentPropTypes) {
        availableProperties = getReadablePropTypes(this.componentRef.current.getComponentPropTypes());
      } else {
        availableProperties = getReadablePropTypes(this.props.component.propTypes);
      }

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

      if (this.componentRef && this.componentRef.current && this.componentRef.current.getComponentDefaultProps) {
        currentProperties = this.componentRef.current.getComponentDefaultProps();
      } else {
        currentProperties = this.props.component.defaultProps;
      }

      const self = this;
      this.setState({ availableProperties, currentProperties: Object.assign({}, this.state.currentProperties, currentProperties) }, () => {
        const code = self.getComponentString();
        self.setState({ code });
      });
      this.constructed = true;
    }

  }

  findDefault(propName) {
    if (this.props.defaults && this.props.defaults.length > 0) {
      let defaultProp = this.props.defaults[0];
      if (defaultProp && defaultProp.props && defaultProp.props[propName]) {
        return defaultProp.props[propName];
      }
    }
  }

  getName() {
    if (this.props.content && this.props.content.length > 0) {
      return this.props.content[0].name;
    }
    return 'BComponent';
  }

  onPropertyChanged(property, value) {
    const self = this;
    const availableProperties = this.state.availableProperties;
    const changedProd = availableProperties.find(x => x.name === property);

    if (changedProd && changedProd.type === 'object') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        console.log(error);
        return;
      }
    }

    let currentProperties = Object.assign({}, this.state.currentProperties);
    currentProperties[property] = value;

    this.setState({ currentProperties }, () => {
      const code = self.getComponentString();
      self.setState({ code });
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
          <div>
            <BDocViewer content={'## Props'} editorType='atomOneLight' />
            <PropsPanel availableProperties={availableProperties} {...this.props} onPropertyChanged={this.onPropertyChanged} />
          </div>
          <div style={{ marginLeft: 100, width: '100%' }}>
            <BDocViewer content='## Preview' editorType='atomOneLight' />
            <div style={{ margin: 100, width: '100%' }}><b>Messaging Test:</b> {self.getMessage('BOA', 'History')}</div>
            <RenderedComponent {...currentProperties} ref={this.componentRef} onChange={action(self.getName() + '-onChange')} onClick={action(self.getName() + '-onClick')} context={this.props.context}></RenderedComponent>
          </div>
        </div>
        <BDocViewer content='## Usage' editorType='atomOneLight' />
        {
          this.state.code && <BDocCode content={this.state.code} highlight={true} lang={'js'} editorType='atomOneDark' />
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
