import React from 'react';
import { DocViewer } from '@boa/components/DocViewer';

export default class PropsTable extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const data = this.prepareData();
    return (
      <DocViewer content={data} editorType='github' />
    );
  }

  prepareData() {
    let self = this;
    let doc = '## Props';

    if (this.props.doc.composes && this.props.doc.composes.length > 0) {
      doc = doc + '\n';
      doc = doc + 'The ' + this.props.doc.displayName + ' propTypes have spread attribute from: ';
      let composes = this.props.doc.composes.map((compose) => {
        return `\`${self.parseComponent(compose)}\``;
      });
      doc = doc + composes.join(', ') + '\n';
    }

    doc = doc + '\n' + '| gray |' + '\n' + '| Name | Type  |  Default | Description |';
    doc = doc + '\n' + '|---|----|----|----:|';

    const propMetaData = this.props.doc.props;

    Object.keys(propMetaData).sort().forEach((key) => {
      var prop = propMetaData[key];

      if (prop.description && prop.description.includes('@ignore'))
        return;

      if (prop.type && prop.type.name === 'func')
        return;

      doc = doc + '\n' + `|${self.getPropName(prop, key)}|${self.getPropType(prop)}|${self.getDefaultValue(prop)}|${self.getPropDescription(prop)}|`;
    });

    return doc;
  }

  parseComponent(component) {
    const paths = component.split('/');
    if (paths.length < 3)
      return 'ComponentBase';
    return paths[paths.length - 1];
  }

  getPropName(prop, key) {
    return prop.required ? `${key}*` : key;
  }

  getPropType(prop) {
    let propType = '';
    if (prop && prop.type) {
      propType = prop.type.name;

      if (prop.type.raw)
        propType = prop.type.raw;

      if (prop.type.name === 'shape') {
        propType = prop.type.name;
      } else if (prop.type.name === 'enum') {
        propType = prop.type.name + ' &#124;';
        prop.type.value.forEach((item) => {
          propType = propType + ` \`${item.value}\`, `;
        });
      } else if (prop.type.name === 'union') {
        propType = prop.type.name + ' &#124;';
        prop.type.value.forEach((item) => {
          propType = propType + ` \`${item.name}${item.value || ''}\`, `;
        });
      } else if (typeof prop.type.value === 'object') {
        propType = prop.type.name + '(' + prop.type.value.name + ')';
      }
    }

    return propType.replace('|', '&#124; ');
  }

  getDefaultValue(prop) {
    return (prop.defaultValue && prop.defaultValue.value && prop.defaultValue.value.split) ? prop.defaultValue.value.split('\n').join('<br>') : '';
  }

  getPropDescription(prop) {
    return prop.description ? prop.description.split('\n').join('<br>') : '';
  }
}
