import React from 'react';
import { DocViewer } from 'b-doc-viewer';

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
    let doc = '# ' + this.props.doc.displayName;
    doc = doc + '\n' + this.props.doc.description;

    return doc;
  }

}
