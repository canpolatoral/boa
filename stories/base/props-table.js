/* eslint-disable no-useless-concat */
import React from 'react';
import PropTypes from 'prop-types';
import { DocViewer } from '@boa/components/DocViewer';
import * as Utils from './utils';

export default class PropsTable extends React.Component {
  static propTypes = {
    doc: PropTypes.any,
  };

  prepareData() {
    let doc = '## Props';

    if (this.props.doc.composes && this.props.doc.composes.length > 0) {
      doc += '\n';
      doc = `${doc}The ${this.props.doc.displayName} propTypes have spread attribute from: `;
      const composes = this.props.doc.composes.map(compose => {
        return `\`${Utils.parseComponent(compose)}\``;
      });
      doc = `${doc + composes.join(', ')}\n`;
    }

    doc = `${doc}\n` + '| gray |' + '\n' + '| Name | Type  |  Default | Description |';
    doc = `${doc}\n` + '|---|----|----|----:|';

    const propMetaData = this.props.doc.props;

    Object.keys(propMetaData)
      .sort()
      .forEach(key => {
        const prop = propMetaData[key];

        if (prop.description && prop.description.includes('@ignore')) return;

        if (prop.type && prop.type.name === 'func') return;

        // eslint-disable-next-line max-len
        doc =
          `${doc}\n` +
          `|${Utils.getPropName(prop, key)}|${Utils.getPropType(
            prop,
          )}|${Utils.getDefaultValueForMarkdown(prop)}|${Utils.getPropDescription(prop)}|`;
      });

    return doc;
  }

  render() {
    const data = this.prepareData();
    return <DocViewer content={data} editorType="github" />;
  }
}
