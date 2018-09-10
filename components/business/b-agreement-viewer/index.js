import React from 'react';
import PropTypes from 'prop-types';
import BAgreementViewerDialog from './BAgreementViewerDialog';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BAgreementViewer extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps
  };

  state = {
    openReason: true,
    url: this.props.fileUrl,
    codeProp: this.props.code,
    documentContractList: [
      {
        DocumentType: '',
        FieldCode: '',
        Text: '',
        RowCount: '',
        ColumnCount: '',
        documentContractList: [{
          DocumentType: '',
          FieldCode: '',
          Text: '',
        }]
      }]
  };

  constructor(props, context) {
    super(props, context);
    // this.handleClick = this.handleClick.bind(this);
  }

  getValue() {
    return this.state;
  }

  setValue(value) {
    this.setState({ ...value });
  }

  actionClick() {
    this.setState({
      openReason: false
    });
  }

  // showAgreementDialog() {
  //   let documentContractList = [
  //     {
  //       documentType: 'Table',
  //       fieldCode: 'SampleTable',
  //       RowCount: 3,
  //       ColumnCount: 2,
  //       documentContractList: [{ // tablo ise kolonların set edilmesi
  //         DocumentType: 'Text',
  //         FieldCode: 'SampleText',
  //         Text: 'html',
  //       },
  //       {
  //         DocumentType: 'Text',
  //         FieldCode: 'SampleText',
  //         Text: 'html',
  //       },
  //       {
  //         DocumentType: 'QRCode',
  //         FieldCode: 'SampleQRCode',
  //         Text: 'html',
  //       },
  //       {
  //         DocumentType: 'Text',
  //         FieldCode: 'SampleText',
  //         Text: 'html',
  //       },
  //       {
  //         DocumentType: 'Text',
  //         FieldCode: 'SampleText',
  //         Text: 'html',
  //       },
  //       {
  //         DocumentType: 'QRCode',
  //         FieldCode: 'SampleQRCode',
  //         Text: 'html',
  //       }
  //       ]
  //     },
  //     {
  //       documentType: 'Text',
  //       fieldCode: 'SampleText',
  //       text: 'boaone tamam'
  //     }];

  //   BAgreementViewer.showAgreement(this.props.context, documentContractList, this.AgreementCodeInput.getInstance().getValue(), 'Test Önizleme');
  // }

  // dışarıdan çağrım için
  // context
  // documentContractList : Dökümandaki değişkenler
  // code : Döküman kodu
  // displayName : Dialogbox header
  static showAgreement(context, documentContractList, code, displayName) {

    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      let dialog = (
        <BAgreementViewerDialog context={context} documentContractList={documentContractList} code={code} />
      );
      BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, displayName, 0, { width: '95%', height: '90%' });
    } else {
      let dialog = (
        <BAgreementViewerDialog context={context} documentContractList={documentContractList} code={code} />
      );
      BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, displayName, 0, { width: '1050px', height: '90%' });
    }
  }

  // handleClick() {
  //   this.showAgreementDialog();
  // }

  // handleChange(e) {
  //   this.setState({ codeProp: e.target.value });
  // }

  // render() {
  //   return (
  //     <div>
  //       <BInput ref={(r) => { this.AgreementCodeInput = r; } } context={this.props.context} value='TestCode' floatingLabelText='Sözleşme Kodu' hintText='Sözleşme Kodu' />
  //       <BButton context={this.props.context} type="raised" text={this.getMessage('BusinessComponent', 'ShowAgreement')} onClick={this.showAgreementDialog.bind(this)} />
  //     </div>
  //   );
  // }
}

export default BAgreementViewer;
