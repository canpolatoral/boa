import React from 'react';
import {CardMedia, Card, CardTitle} from '@material-ui/core';

const BFileReaderInput = require('b-file-input').BFileInput;
const BButton = require('b-button').BButton;

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
};

export class BFileInputGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.self.state = {imgUrl: '', fileName: '', isImageVisible: false};
  }

  handleFileInputChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      let fileData = e.target.result.split(',').pop();
      this.self.setState({imgUrl: URL.createObjectURL(b64toBlob(fileData)), fileName: file.name, isImageVisible: true});
    });
  }

  generate(context) {
    return (
    [
      {
        'text': 'BFileInput',
        'component':
  <Card>
    <CardMedia>
      <BFileReaderInput context={context} as="url" accept="image/*"
                                  onChange={this.handleFileInputChange.bind(this)}
                                  multiple="true">
        <BButton context={context}
                           type="raised"
                           text="Choose Picture"
                           textPosition="after"
                           colorType="primary"
                           textStyle={{color: 'white'}}
                           style={{margin: '10px'}}/>
      </BFileReaderInput>
    </CardMedia>
    <CardMedia overlay={<CardTitle title={this.self.state.fileName}/>}
                         style={{visibility: this.self.state.isImageVisible ? 'visible' : 'hidden'}}>
      <img src={this.self.state.imgUrl} style={{width: '100%'}}/>
    </CardMedia>
  </Card>
      }
    ]
    );
  }
}

export default BFileInputGenerator;

