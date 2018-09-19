import React from 'react';
import { BDocViewer } from 'b-doc-viewer';

export default class ComponentInfo extends React.Component {

  constructor(props) {
    super(props);
  }

  getName() {
    if (this.props.content && this.props.content.length > 0) {
      return this.props.content[0].name;
    }
    return 'BComponent';
  }

  render() {
    const data = this.prepareData();
    return (
      <BDocViewer content={data} editorType='atomOneLight' />
    );
  }

  prepareData() {
    const self = this;
    let info = '# ' + this.getName();
    if (this.props.content && this.props.content.length > 0) {
      const contentInfo = this.props.content.find(x => x.name === self.getName());
      if (contentInfo && contentInfo.desc) {
        info = info + '\n' + contentInfo.desc;
      }
    }
    return info;
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
