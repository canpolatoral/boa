import React from 'react';
import { BAgreementViewer } from 'b-agreement-viewer';
import { BButton } from 'b-button';
import { BComponentComposer } from 'b-component';


@BComponentComposer
export class BAgreementViewerTestGenerator {


  static context;

  onClick() {
    let documentContractList = [
      {
        documentType: 'Table',
        fieldCode: 'SampleTable',
        RowCount: 3,
        ColumnCount: 2,
        documentContractList: [{ // tablo ise kolonların set edilmesi
          DocumentType: 'Text',
          FieldCode: 'SampleText',
          Text: 'html',
        },
        {
          DocumentType: 'Text',
          FieldCode: 'SampleText',
          Text: 'html',
        },
        {
          DocumentType: 'QRCode',
          FieldCode: 'SampleQRCode',
          Text: 'html',
        },
        {
          DocumentType: 'Text',
          FieldCode: 'SampleText',
          Text: 'html',
        },
        {
          DocumentType: 'Text',
          FieldCode: 'SampleText',
          Text: 'html',
        },
        {
          DocumentType: 'QRCode',
          FieldCode: 'SampleQRCode',
          Text: 'html',
        }
        ]
      },
      {
        documentType: 'Text',
        fieldCode: 'SampleText',
        text: 'boaone tamam'
      }];

    BAgreementViewer.showAgreement(this.context, documentContractList, 'TestCode', 'Test Önizleme');
  }


  generate(context) {

    this.context = context;

    return [
      {
        'text': 'Show Agreement',
        'component': <BButton context={context} type="raised"
          text={'Show Agreement'}
          onClick={this.onClick.bind(this)} />
      }
    ];
  }
}
export default BAgreementViewerTestGenerator;
