import React from 'react';
import {Card, CardMedia, CardTitle } from '@material-ui/core';
const BFileReaderInput = require('b-file-input').BFileInput;
const BButton = require('b-button').BButton;
const PdfViewer = require('b-pdf-viewer').PdfViewer;
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

  return new Blob(byteArrays, { type: contentType });
};

export class BPdfViewerGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.self.state = { imgUrl: '', fileName: '', isImageVisible: false };
  }

  handleFileInputChange(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      let fileData = e.target.result.split(',').pop();
      this.self.setState({ imgUrl: URL.createObjectURL(b64toBlob(fileData)), fileName: file.name, isImageVisible: true });
    });
  }

  generate(context) {
    return (
    [
      {
        'text': 'BPdfViewer',
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
                    backgroundColor={context.theme.boaPalette.pri500}
                    textStyle={{ color: 'white' }}
                    style={{ margin: '10px' }} />
      </BFileReaderInput>
    </CardMedia>
    <CardMedia overlay={<CardTitle title={this.self.state.fileName} />}
                >
      <PdfViewer fileUrl={'blob:http://localhost:82/4d89eb91-534d-4362-844e-60b84594eaed'} pdfContainerHeight={30} />
    </CardMedia>
  </Card>
      }
    ]
    );
  }
}

export default BPdfViewerGenerator;

