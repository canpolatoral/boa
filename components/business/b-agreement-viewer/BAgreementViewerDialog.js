import React from 'react';
import PropTypes from 'prop-types';
import PDF from './PdfViewer';
import Page from './PdfPage';
import styled from 'styled-components';
import FileSaver from 'file-saver';
import { BComponent, BComponentComposer, Utils } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BDevice } from 'b-device';
import { BLoading } from 'b-loading';
import { BBaseForm } from 'b-base-form';

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

// const Loading = styled.div`
//   color: #aaa;
// `;

// const PageContainer = styled.div`
//   margin: 0 auto 10px;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//   @media (max-width: 700px) {
//     width: 100%;
//   }
// `;

const Error = styled.div`
  background-color: #bb0000;
  border: 1px solid #aa0000;
  border-radius: 3px;
  padding: 10px;
  display: inline-block;
  color: #fff;
`;
@BComponentComposer
export class BAgreementViewerDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    handleClose: PropTypes.func,
    fileUrl: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTSOZDLG'
  };

  state = {
    resultData: '',
    url: this.props.fileUrl,
    codeProp: this.props.code,
    pages: null,
    loaded: 0,
    total: 0,
    error: null,
    documentContractList: this.props.documentContractList
  };

  constructor(props, context) {
    super(props, context);
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  getAgreementBase64() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Agreement.AgreementListRequest',
      requestBody: {
        MethodName: 'SelectAgreementWithRtftext',
        code: this.state.codeProp,
        documentContractList: this.state.documentContractList,
        resourceCode: this.props.resourceCode
      },
      key: 'SelectAgreementWithRtftext'
    };
    this.proxyExecute(proxyRequest);


    // let promise = this.proxyCall('BOA.Types.Agreement.AgreementListRequest', {
    //   MethodName: 'SelectAgreementWithRtftext',
    //   code: this.state.codeProp,
    //   documentContractList: this.state.documentContractList,
    //   resourceCode: this.props.resourceCode
    // });
    // promise.then((result) => {
    //   if (result.success) {
    //     let pictureData = b64toBlob(result.value);
    //     this.setState({ url: URL.createObjectURL(pictureData) });
    //     this.setState({ resultData: result.value }); // indirme için dönen base64 data
    //   } else {
    //     this.debugLog(result.results[0].errorMessage, 3);
    //   }
    // }, (error) => {
    //   this.debugLog(error, 3);
    // });
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'SelectAgreementWithRtftext':
        if (response.success) {
          let pictureData = b64toBlob(response.value);
          this.setState({ url: URL.createObjectURL(pictureData) });
          this.setState({ resultData: response.value }); // indirme için dönen base64 data
        }
        else {
          this.debugLog(response.results[0].errorMessage, 3);
        }
        break;
      default:
        break;
    }
  }

  actionBarButtonClick(e) {
    if (e.actionId == 1) {
      let blobData = b64toBlob(this.state.resultData, 'application/pdf');
      FileSaver.saveAs(blobData, 'document.pdf');
    }
    if (e.actionId == 3) {
      var devices = BDevice.getDeviceByFunctionality(this.props.context.applicationContext.availableDevices, 4); // 4 yazıcı
      var promise = BDevice.printerPrint(devices, 'Agreement.pdf', this.state.resultData); // resultdata : base64data
      /* eslint-disable no-console */
      promise.done((response) => {
        console.log(response);
      }).fail((error) => {
        console.log(error);
      });
      /* eslint-enable no-console */
    }
  }

  getAgreementDialog() {
    // let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;

    // var customCardStyle = {
    //   width: '1000px', height: '100%'
    // };

    // if (isMobileOrTablet) {
    //   customCardStyle = { width: '100%', height: '100%' };
    // }

    let isMobile = Utils.isMobile(this.props);
    let hideManager = false;

    if (isMobile) {
      hideManager = true;
    }

    return (
      <BBaseForm
        {...this.props}
        ref={form => this.mainForm = form}
        isWideCardEnabled={true}
        inDialog={true}
        hideActionManager = {hideManager}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.handleClose}
        onActionClick={this.actionBarButtonClick.bind(this)}>
        {/* <BCard style={customCardStyle} context={this.props.context} expandable={false} initiallyExpanded={false}> */}
        {this.state.url ?
          <PDF url={this.state.url}
            onProgress={({ loaded, total }) => this.setState({ loaded, total })}
            onComplete={(pages) => this.setState({ error: null, pages })}
            onError={(error) => this.setState({ error })}>
            {this.state.error
              ? <Error>
                {this.state.error.message}
              </Error>
              : this.state.pages
                ? <div>
                  {this.state.pages.map((page) =>
                    // <PageContainer key={page.key}>
                    <Page page={page} />
                    // </PageContainer>
                  )}
                </div>
                : <BLoading context={this.props.context} />
            }
          </PDF>
          :
          <BLoading context={this.props.context} />
        }
        {/* </BCard> */}
      </BBaseForm>
    );

  }

  render() {
    return this.getAgreementDialog();
  }

  close(dialogResponse) {
    BDialogHelper.close(this, dialogResponse);
  }

  componentWillMount() { 

    this.getAgreementBase64();
  }

  componentDidMount() {
   // var isMobile = Utils.isMobile(this.props);
   // if (isMobile) {
    //  this.mainForm.getInstance().actionManager && this.mainForm.getInstance().actionManager.hideAction("Print");
      // this.mainForm.getInstance().actionManager && this.mainForm.getInstance().actionManager.hideAction("Save");
    // }
  }
}

export default BAgreementViewerDialog;
