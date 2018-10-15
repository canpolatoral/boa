import React from 'react';
import { DocViewer } from '@boa/components/DocViewer';

export default class ComponentInfo extends React.Component {

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

      doc = doc + '\n' + `|${self.getPropName(prop, key)}|${self.getPropType(prop).replace('|', '&#124; ')}|${prop.defaultValue ? prop.defaultValue.value : ''}|${prop.description ? prop.description.split('\n').join('<br>') : ''}|`;
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
}
