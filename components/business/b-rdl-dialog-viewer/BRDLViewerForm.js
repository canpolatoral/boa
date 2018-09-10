import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';

import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BTransactionForm } from 'b-transaction-form';
import { BRDLViewer } from 'b-rdl-viewer';
import { BDevice } from 'b-device';
import { BCard } from 'b-card';
import { BConst } from 'b-const';

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

@BComponentComposer
export class BRDLViewerForm extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    handleClose: PropTypes.func,
    reportPath: PropTypes.string.isRequired,
    reportParameters: PropTypes.array,
    reportDatasources: PropTypes.array,
    dialogResponseStyle: PropTypes.any
  };

  static defaultProps = {
    resourceCode: 'YONTRDLDLG'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      resourceInfo: this.props.resourceInfo,
      reportPath: this.props.reportPath,
      reportParameters: this.props.reportParameters,
      reportDatasources: this.props.reportDatasources,
      isLoaded: false
    };
  }

  componentWillMount() {
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  actionBarButtonClick(e) {
    if (this.state.isLoaded) {
      if (e.commandName == BConst.ActionCommand.Download) {
        let blobData = b64toBlob(this.state.resultData);
        FileSaver.saveAs(blobData, 'document.pdf');
      }
      else if (e.commandName == BConst.ActionCommand.Print) {
        var devices = BDevice.getDeviceByFunctionality(this.props.context.applicationContext.availableDevices, 4); // 4 yazıcı
        var promise = BDevice.printerPrint(devices, 'Agreement', this.state.resultData); // resultdata : base64data
        /* eslint-disable no-console */
        promise.done((response) => {
          console.log(response);
        }).fail((error) => {
          console.log(error);
        });
        /* eslint-enable no-console */
      }
    }
    else {
      BDialogHelper.show(this.props.context, this.getMessage('BOA', 'PDFDidNotLoaded'), BComponent.DialogType.INFO, BComponent.DialogResponseStyle.OK);
    }
  }

  getRDLDialog() {
    var customCardStyle = {
      padding:'0px',
      minWidth: '100px',
      maxWidth: 'none',
      maxHeight: 'none',
    };
    return (
      <BTransactionForm
        {...this.props}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.handleClose}
        onActionClick={this.actionBarButtonClick.bind(this)}
        disableCardWidth={true}>
        <BCard style={customCardStyle} context={this.props.context} expandable={false} initiallyExpanded={false}>
          <BRDLViewer
            context={this.props.context}
            ref={(r) => this.BRDLViewer = r}
            isOpenFromDialog={true}
            reportPath={this.state.reportPath}
            reportParameters={this.state.reportParameters}
            reportDatasources={this.state.reportDatasources}
            onComplete={(loadedBinary) => this.setState({ resultData: loadedBinary, isLoaded: true })} />
        </BCard>
      </BTransactionForm>
    );
  }

  render() {
    return this.getRDLDialog();
  }

  close(dialogResponse) {
    BDialogHelper.close(this, dialogResponse);
  }
}

export default BRDLViewerForm;
