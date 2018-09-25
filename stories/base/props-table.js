import React from 'react';
import { BDocViewer } from 'b-doc-viewer';

export default class PropsViewer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const data = this.prepareData();
    return (
      <BDocViewer content={data} editorType='atomOneLight' />
    );
  }

  prepareData() {
    const self = this;
    let properties = '## Properties';
    if (this.props.content && this.props.content.length > 0) {
      const contentProps = this.props.content.find(x => x.name === 'Props');
      if (contentProps && contentProps.infoArray && contentProps.infoArray.length > 0) {
        properties = properties + '\n' + '| gray |' + '\n' + '| Name | Type  | Required | Description |';
        properties = properties + '\n' + '|----------|---------------|------:|';
        contentProps.infoArray.forEach((info) => {
          info.default = self.findDefault(info.name);
          properties = properties + '\n' + `|${info.name}|${info.type.replace('|', '&#124; ')}|${info.header}|${info.desc}|`;
        });
      }
    }

    return properties;

  }

  findDefault(propName) {
    if (this.props.defaults && this.props.defaults.length > 0) {
      let defaultProp = this.props.defaults[0];
      if (defaultProp && defaultProp.props && defaultProp.props[propName]) {
        return defaultProp.props[propName];
      }
    }
    return '-';
  }
}
