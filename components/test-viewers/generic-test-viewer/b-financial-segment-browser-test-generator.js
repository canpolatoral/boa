import React from 'react';
var BFinancialSegmentBrowser = require('b-financial-segment-browser').BFinancialSegmentBrowser;

export class BFinancialSegmentBrowserTestGenerator {
  constructor() {
  }

  generate(context) {

    return [
      {
        'text': 'BFinancialSegmentBrowser',
        'component': <BFinancialSegmentBrowser
                        context={context}
                        sequenceVisible ={true}
                      />
      }
    ];
  }
}
export default BFinancialSegmentBrowserTestGenerator;

