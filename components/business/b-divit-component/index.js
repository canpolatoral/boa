import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import { BBusinessComponent } from 'b-business-component';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBaseForm } from 'b-base-form';
import { BTabBar } from 'b-tab-bar';
import { BCard } from 'b-card';
import { BDevice } from 'b-device';
import { BFormManager } from 'b-form-manager';
import DocumentViewer from './DocumentViewer';
import { b64toBlob, showToastMessage, isMobileDevice } from './Constants';
import DefinedDocumentListComponent from './DefinedDocumentListComponent';
import MobileDocumentViewDialog from './MobileDocumentViewDialog';
import { findDOMNode } from 'react-dom';

let elementResizeDetectorMaker = require('element-resize-detector');
import { withStyles } from '@material-ui/core/styles';

const divitResourceCode = 'YONTDMSEDT';

class CommandNames {
  static save = 'Save';
  static saveAndClose = 'SaveAndClose';
  static refresh = 'Refresh';
  static openOnBOA = 'OpenOnBOA';
}

const styles = () => ({
  labelLTR: {
    marginLeft: 0
  },
  labelRTL: {
    marginRight: 0
  },
  root: {
    maxWidth: 'none',
  }
});

@BComponentComposer
@withStyles(styles)
export class BDivitComponent extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.propTypes,
    /**
     * The divitId for the operation.
     */
    divitId: PropTypes.string,
    /**
     * The instanceId for the operation.
     */
    instanceId: PropTypes.string,
    /**
     * The personId for the operation.
     */
    personId: PropTypes.number,
    /**
     * The customerId for the operation.
     */
    customerId: PropTypes.number,
    /**
     * Indicates the mode that read of write.
     */
    editorMode: PropTypes.oneOf(['Read', 'Write']).isRequired,
    /**
     * the classess for the material ui style.
     */
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    editorMode: 'Write', // todo editormode bakılacak!!!
    serviceCallLoader: 'circular',
    resourceCode: 'YONTDMSEDT'
  };

  state = {
    selectedFileServerObjectId: null,
    definedDocumentArray: [],
    mimeTypeArray: [],
    fileServerDocumentArray: [],
    fileContentDictionary: [],
    flowId: null,
    fileContent: null,
    fileExtension: null,
    fileMimeType: null,
    cardBackgroundColor: this.props.context.theme.boaPalette.base10,
    divitParametersContract: null,
    canRunOnClosingFunction: true,
    cropSuccess: false,
    documentContainerHeight: null,
    scrollHeight: 640,
    descriptionWidth : 220
  };

  constructor(props, context) {
    super(props, context);
    this.resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  isUnSavedFileExits() {
    return this.state.fileServerDocumentArray.some(fd => fd.fileId <= 0);
  }

  canRunOnClosingFunction() {
    return this.state.canRunOnClosingFunction;
  }

  loadDivitDefinitionHelper(divitId, instanceId, applicationName = null,
    flowId = null, flowStepId = null, profileId = null, loadCompleteCallback = null) {

    const customerFlowId = 'ef89e45f-5d11-4c48-9367-ab5e45510c47';
    const customerApplicationName = 'KT.Musteri';

    // Divit ekranını BOA'da açmak için kullanılacak, ekran etkileşimi yoktur.
    this.state.divitParametersContract = {
      divitId: divitId,
      instanceId: instanceId,
      applicationName: applicationName,
      flowId: flowId,
      flowStepId: flowStepId,
      profileId: profileId,
      customerId: -1,
      personId: -1
    };

    let requestBody;

    if (divitId) {
      requestBody = {
        methodName: 'SelectDatabaseData',
        divitId: divitId,
        instanceId: instanceId,
        relationalDivitList: [],
        validityBeginDate: null,
        validityEndDate: null,
        loadCustomerFiles: false, // todo müşteri evrakları ne olacak?
        resourceId: 482,
        resourceCode: divitResourceCode,
        customerId: this.props.customerId ? this.props.customerId : -1
      };
    } else {
      requestBody = {
        methodName: 'SelectDatabaseData',
        divitId: null,
        instanceId: instanceId,
        applicationName: applicationName,
        flowId: flowId,
        flowStepId: flowStepId,
        profileId: profileId,
        flowIdList: [flowId, customerFlowId],
        applicationNameList: [applicationName, customerApplicationName],
        relationalDivitList: [],
        validityBeginDate: null,
        validityEndDate: null,
        loadCustomerFiles: false, // todo müşteri evrakları ne olacak?
        resourceId: 482,
        resourceCode: divitResourceCode,
        customerId: this.props.customerId ? this.props.customerId : -1
      };
    }

    let proxyRequest = {
      requestClass: 'BOA.Types.DocumentManagement.Divit.DivitEditorRequest',
      requestBody: requestBody,
      params: {
        flowId: flowId,
        loadCompleteCallback: loadCompleteCallback
      },
      key: 'SelectDatabaseData'
    };
    this.proxyExecute(proxyRequest);
  }

  loadData(loadCompleteCallback = null) {
    let divitId = this.props.divitId;
    let instanceId = this.props.instanceId;

    if (divitId && instanceId) {
      this.loadDivitDefinitionHelper(divitId, instanceId, null, null, null, null, loadCompleteCallback);
    } else {
      let personInfoRequest = {
        methodName: 'GetPersonDocumentInfo',
        personId: this.props.personId,
        resourceId: 482,
        resourceCode: divitResourceCode
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.PersonInfoRequest',
        requestBody: personInfoRequest,
        params: {
          divitId: divitId,
          loadCompleteCallback: loadCompleteCallback
        },
        key: 'GetPersonDocumentInfo'
      };
      this.proxyExecute(proxyRequest);
    }
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillUnmount() {
    if (this.documentCardDiv) {
      this.resizeDetector.uninstall(this.documentCardDiv);
    }
  }

  onResizeDocumentCard() {
    if (this.documentCardDiv) {
      this.setState({ documentContainerHeight: this.documentCardDiv.offsetHeight });
    }
    this.calculateDescriptionWidth();
  }

  calculateDescriptionWidth() {
    var node = findDOMNode(this.mainForm.getInstance());
    if (node) {
      let width = node.children[1].clientWidth - 160;
      this.setState({ descriptionWidth: width });
    }
  }

  componentDidMount() {
    const { context } = this.props;

    this.calculateDescriptionWidth();

    if (isMobileDevice(context)) {
      this.mainForm.getInstance().actionManager.hideAction(CommandNames.openOnBOA);
    }

    if (this.documentCardDiv) {
      this.resizeDetector.listenTo(this.documentCardDiv, this.onResizeDocumentCard.bind(this));
    }
    this.mainForm.getInstance().disableAction(CommandNames.save);

    this.setState({ cardBackgroundColor: context.theme.boaPalette.base10 });

    var node = findDOMNode(this.mainForm.getInstance());
    if (node) {
      var h = node.children[1].clientHeight;
      if (isMobileDevice(context))
        this.setState({ scrollHeight: h - 88 });
      else
        this.setState({ scrollHeight: h - 48 });
    }
  }

  handleAddFile(args) {
    let newServerDocumentArray = this.state.fileServerDocumentArray.concat(args.fileServerDocumentArray);
    let newContentArray = this.state.fileContentDictionary.concat(args.fileContentDictionary);
    this.setState({ fileServerDocumentArray: newServerDocumentArray, fileContentDictionary: newContentArray });
    this.mainForm.getInstance().enableAction(CommandNames.save);
  }

  handleFileInfo(args) {
    let fileServerObjectId = args.fileServerObjectId;

    if (fileServerObjectId !== this.state.selectedFileServerObjectId) {
      this.setState({
        selectedFileServerObjectId: fileServerObjectId,
        fileContent: null,
        fileExtension: null
      });
    }
  }

  showFileOnMobileDevice(fileContent, mimeType, fileExtension, fileServerObjectId, selectedDefinedDocumentId) {
    if ((/\.(gif|jpg|jpeg|png|pdf)$/i).test(fileExtension)) {
      let definedDocument = this.state.definedDocumentArray.find(dd => dd.docId === selectedDefinedDocumentId);
      let dialog = (
        <MobileDocumentViewDialog context={this.props.context} fileContent={fileContent} fileExtension={fileExtension}
          fileServerObjectId={fileServerObjectId} mimeType={mimeType} />);
      BDialogHelper.showWithResourceCode(this.props.context, null, dialog, 0, 0, definedDocument.docName, null, {
        width: '95%',
        height: '95%'
      });
    } else {
      let blobData = b64toBlob(fileContent, mimeType);
      FileSaver.saveAs(blobData, fileServerObjectId + fileExtension);
    }
  }

  downloadFile(fileContent, mimeType, fileExtension, fileServerObjectId) {
    let blobData = b64toBlob(fileContent, mimeType);
    FileSaver.saveAs(blobData, fileServerObjectId + fileExtension);
  }

  handleSelectFile(args) {
    const { context } = this.props;
    let fileServerObjectId = args.fileServerObjectId;
    let selectedDefinedDocumentId = args.selectedDefinedDocumentId;
    let fileServerDocument = this.state.fileServerDocumentArray.find(fsd => fsd.id === fileServerObjectId);
    let documentContent = this.state.fileContentDictionary.find(c => c.key === fileServerObjectId);
    let fileExtension = fileServerDocument.extension;
    let convertTiffToPdf = (/\.(tif|tiff)$/i).test(fileExtension) && fileServerDocument.fileId > 0;
    let mimeType = fileServerDocument.mimeType;
    this.mainForm.getInstance().enableAction(CommandNames.save);

    if (documentContent) {
      const content = documentContent.value;
      const extension = convertTiffToPdf ? '.pdf' : fileExtension;

      this.setState({
        cardBackgroundColor: context.theme.boaPalette.base400,
        selectedFileServerObjectId: fileServerObjectId,
        fileContent: content,
        fileExtension: extension,
        fileMimeType: mimeType
      }, () => {
        if (isMobileDevice(context)) {
          this.showFileOnMobileDevice(content, mimeType, extension, fileServerObjectId, selectedDefinedDocumentId);
        }
      });
      if ((/\.(txt)$/i).test(fileExtension) && !isMobileDevice(context) && fileServerObjectId == this.state.selectedFileServerObjectId) {
        this.downloadFile(content, mimeType, extension, fileServerObjectId);
      }
    } else {
      this.showLoadingProgress();

      let requestBody = {
        methodName: 'GetFileContentByObjectId',
        fileServerObjectId: fileServerObjectId,
        convertTiffToPdf: convertTiffToPdf,
        resourceId: 482,
        resourceCode: divitResourceCode
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentGetRequest',
        requestBody: requestBody,
        params: {
          convertTiffToPdf: convertTiffToPdf,
          fileExtension: fileExtension,
          fileServerObjectId: fileServerObjectId,
          selectedDefinedDocumentId: selectedDefinedDocumentId,
          mimeType: mimeType
        },
        key: 'GetFileContentByObjectId'
      };
      this.proxyExecute(proxyRequest);

    }
  }

  handleDocumentDownload(args) {
    let fileServerObjectId = args.fileServerObjectId;
    let fileServerDocument = this.state.fileServerDocumentArray.find(fsd => fsd.id === fileServerObjectId);
    let documentContent = this.state.fileContentDictionary.find(c => c.key === fileServerObjectId);
    let fileExtension = fileServerDocument.extension;
    let mimeType = fileServerDocument.mimeType;

    if (documentContent) {
      let blobData = b64toBlob(documentContent.value, mimeType);
      FileSaver.saveAs(blobData, fileServerObjectId + fileExtension);
    } else {
      this.showLoadingProgress();

      let requestBody = {
        methodName: 'GetFileContentByObjectId',
        fileServerObjectId: fileServerObjectId,
        resourceId: 482,
        resourceCode: divitResourceCode
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentGetRequest',
        requestBody: requestBody,
        params: {
          fileServerObjectId: fileServerObjectId,
          fileExtension: fileExtension,
          mimeType: mimeType
        },
        key: 'HandleDocumentDownload'
      };
      this.proxyExecute(proxyRequest);
    }
  }

  informStateAboutFileDelete(fileServerObjectId) {
    // delete file content
    let deleteIndex = this.state.fileContentDictionary.findIndex(c => c.key === fileServerObjectId);
    this.state.fileContentDictionary.splice(deleteIndex, 1);

    let selectedFileServerObjectId = this.state.selectedFileServerObjectId;
    if (selectedFileServerObjectId && selectedFileServerObjectId === fileServerObjectId) {
      this.setState(prevState => ({
        selectedFileServerObjectId: null,
        fileContent: null,
        fileExtension: null,
        fileServerDocumentArray: prevState.fileServerDocumentArray.filter(fsd => fsd.id !== fileServerObjectId)
      }));
    } else {
      this.setState(prevState => ({
        fileServerDocumentArray: prevState.fileServerDocumentArray.filter(fsd => fsd.id !== fileServerObjectId)
      }));
    }
  }

  handleDocumentDelete(args) {

    let fileServerObjectId = args.fileServerObjectId;
    let fileServerDocument = this.state.fileServerDocumentArray.find(fsd => fsd.id === fileServerObjectId && fsd.fileId > 0);
    if (fileServerDocument) {
      this.showLoadingProgress();

      let requestBody = {
        methodName: 'UpdateState',
        fileServerObjectId: fileServerObjectId,
        documentState: 1,
        fromTransactionalExecute: true,
        resourceId: 482,
        resourceCode: divitResourceCode
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentSaveRequest',
        requestBody: requestBody,
        params: { fileServerObjectId: fileServerObjectId },
        key: 'HandleDocumentDeleteUpdateState'
      };
      this.proxyTransactionExecute(proxyRequest);
    } else {
      this.informStateAboutFileDelete(fileServerObjectId);
    }
  }

  handleDeleteAll(args) {
    let selectedDefinedDocumentId = args.selectedDefinedDocumentId.toString();
    let fileServerDocuments = this.state.fileServerDocumentArray.filter(fsd => fsd.documentType === selectedDefinedDocumentId);

    this.showLoadingProgress();

    fileServerDocuments.map(document => {
      if (document.fileId > 0) {
        let requestBody = {
          methodName: 'UpdateState',
          fileServerObjectId: document.id,
          documentState: 1,
          fromTransactionalExecute: true,
          resourceId: 482,
          resourceCode: divitResourceCode
        };

        let proxyRequest = {
          requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentSaveRequest',
          requestBody: requestBody,
          params: { fileServerDocuments: fileServerDocuments },
          key: 'UpdateState'
        };
        this.proxyTransactionExecute(proxyRequest);
      }
    });
  }

  handleDocumentPaste(args) {
    let croppedDocument = args.croppedDocument;
    let imgData = this.documentViewer.getInstance().getCroppedImageData();
    if (imgData) {
      let documentArray = Object.assign([], this.state.fileServerDocumentArray);
      documentArray.push(croppedDocument);
      this.state.fileContentDictionary.push({ key: croppedDocument.id, value: imgData });
      this.setState({
        fileServerDocumentArray: documentArray
      });
    }
  }

  handlePrint(args) {
    let fileServerObjectId = args.fileServerObjectId;
    let fileServerDocument = this.state.fileServerDocumentArray.find(fsd => fsd.id === fileServerObjectId);
    let documentContent = this.state.fileContentDictionary.find(c => c.key === fileServerObjectId);
    let fileExtension = fileServerDocument.extension;
    let fileName = fileServerObjectId + fileExtension;

    this.showLoadingProgress();

    if (documentContent) {
      let promise = BDevice.printerPrint(null, fileName, documentContent.value);
      promise.done(() => {
        this.hideLoadingProgress();
      }).fail((error) => {
        this.hideLoadingProgress();
        this.debugLog(error, 3);
      });
    } else {
      let requestBody = {
        methodName: 'GetFileContentByObjectId',
        fileServerObjectId: fileServerObjectId,
        resourceId: 482,
        resourceCode: divitResourceCode
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentGetRequest',
        requestBody: requestBody,
        params: {
          fileName: fileName
        },
        key: 'HandlePrintGetFileContentByObjectId'
      };
      this.proxyExecute(proxyRequest);
    }
  }

  handleFormClosing() {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE, { documentArray: this.state.fileServerDocumentArray });
  }

  handleCropSuccess(args) {
    this.setState({ cropSuccess: args.success });
  }

  /**
   * Save documents.
   */
  saveDocuments(closeDialog = false, saveSuccessCallback = null) {
    let unSavedDocuments = this.state.fileServerDocumentArray.filter(fsd => fsd.fileId < 0);
    if (unSavedDocuments && unSavedDocuments.length <= 0) return;

    this.showLoadingProgress();

    this.errorMessageShowed = false;

    unSavedDocuments.map(fsd => {
      let documentContent = this.state.fileContentDictionary.find(c => c.key === fsd.id);
      if (documentContent) {
        let emptyGuidStr = '00000000-0000-0000-0000-000000000000';
        let flowId = this.state.flowId ? this.state.flowId : emptyGuidStr;
        let divitId = this.props.divitId ? this.props.divitId : null;
        let instanceId = this.props.instanceId ? this.props.instanceId : this.props.personId.toString();

        let requestBody = {
          methodName: 'CreateDocument',
          divitId: divitId,
          flowId: flowId,
          instanceId: instanceId,
          fileServerObjectId: emptyGuidStr,
          documentType: fsd.documentType,
          documentName: fsd.documentName,
          documentMimeType: fsd.mimeType,
          documentExtension: fsd.extension,
          documentState: 0,
          documentDescription: fsd.description,
          documentContent: documentContent.value,
          readFromPath: false,
          customerId: null,
          validityBeginDate: fsd.validityBeginDate,
          validityEndDate: fsd.validityEndDate,
          resourceId: 482,
          actionId: 3,
          languageId: 1,
          fromTransactionalExecute: true
        };

        let proxyRequest = {
          requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentSaveRequest',
          requestBody: requestBody,
          proxyTimeout: 1200000,
          params: {
            closeDialog: closeDialog,
            saveSuccessCallback: saveSuccessCallback
          },
          key: 'CreateDocument'
        };
        this.proxyTransactionExecute(proxyRequest);
      }
    });
  }

  refreshScreen() {
    let msg = this.getMessage('DocumentManagement', 'ScreenWillClean') + this.getMessage('DocumentManagement', 'DoYouWanttoContinue');
    BDialogHelper.show(this.props.context, msg, BComponent.DialogType.QUESTION, BComponent.DialogResponseStyle.YESNO, '?',
      (dialogResponse) => {
        if (dialogResponse === BComponent.DialogResponse.YES) {
          this.setState(prevState => ({
            fileServerDocumentArray: prevState.fileServerDocumentArray.filter(f => f.fileId > 0),
            selectedFileServerObjectId: null,
            fileContent: null,
            fileExtension: null
          }));
        }
      }
    );
  }

  actionBarButtonClick(e) {
    switch (e.actionId) {
      case 3: {
        this.saveDocuments();
        break;
      }
      case 11: {
        let divitParametersContract = this.state.divitParametersContract;
        BFormManager.show(divitResourceCode, divitParametersContract, true, divitParametersContract.instanceId, 2, true);

        // todo kapanırken mesaj verip kapatalım.
        this.handleFormClosing();
        break;
      }
      case 22: {
        this.refreshScreen();
        break;
      }
      case 39: {
        this.saveDocuments(true);
        break;
      }
      default:
        break;
    }
  }

  showLoadingProgress() {
    this.mainForm.getInstance().showProgress();
  }

  hideLoadingProgress() {
    this.mainForm.getInstance().hideProgress();
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    const { context } = this.props;
    switch (key) {
      case 'SelectDatabaseData':
        if (params.loadCompleteCallback) {
          params.loadCompleteCallback();
        }
        if (response.success) {
          this.setState({
            selectedFileServerObjectId: null,
            definedDocumentArray: response.value.definedDocumentList,
            fileServerDocumentArray: response.value.fileServerDocumentList.filter(fsd => !fsd.isDeleted),
            mimeTypeArray: response.value.mimeTypeList,
            flowId: params.flowId ? params.flowId : null
          });
        }
        break;
      case 'GetPersonDocumentInfo':
        if (response.success) {
          // let response = response.value;
          this.loadDivitDefinitionHelper(params.divitId, this.props.personId.toString(), response.value.applicationName,
            response.value.flowID, response.value.flowStepID, response.value.profileID, params.loadCompleteCallback);
        }
        break;
      case 'GetFileContentByObjectId':
        this.hideLoadingProgress();

        if (response.success) {
          const content = response.value.content;
          const extension = params.convertTiffToPdf ? '.pdf' : params.fileExtension;

          let documentContentArray = [{ key: params.fileServerObjectId, value: content }];
          this.setState({
            cardBackgroundColor: context.theme.boaPalette.base400,
            selectedFileServerObjectId: params.fileServerObjectId,
            fileContent: content,
            fileExtension: extension,
            fileMimeType: params.mimeType,
            fileContentDictionary: this.state.fileContentDictionary.concat(documentContentArray)
          }, () => {
            if (isMobileDevice(context)) {
              this.showFileOnMobileDevice(content, params.mimeType, extension, params.fileServerObjectId, params.selectedDefinedDocumentId);
            }
          });
        }
        break;
      case 'HandleDocumentDownload':
        this.hideLoadingProgress();

        if (response.success) {
          let blobData = b64toBlob(response.value.content, params.mimeType);
          FileSaver.saveAs(blobData, params.fileServerObjectId + params.fileExtension);

          this.state.fileContentDictionary.push({ key: params.fileServerObjectId, value: response.value.content });
        }
        break;
      case 'HandleDocumentDeleteUpdateState':
        this.hideLoadingProgress();
        if (response.success) {
          this.informStateAboutFileDelete(params.fileServerObjectId);
        }
        break;
      case 'HandlePrintGetFileContentByObjectId':
        if (response.success) {
          let promise = BDevice.printerPrint(null, params.fileName, response.value.content);
          promise.done(() => {
            this.hideLoadingProgress();
          }).fail((error) => {
            this.hideLoadingProgress();
            this.debugLog(error, 3);
          });
        } else {
          this.hideLoadingProgress();
        }
        break;
      case 'CreateDocument':
        this.hideLoadingProgress();
        if (!response.success) {
          if (!this.errorMessageShowed) {
            showToastMessage(this.getMessage('BOA', 'UnexpectedErrorOccured'));
            this.errorMessageShowed = true;
          }

        } else {
          this.mainForm.getInstance().disableAction(CommandNames.save);
          this.mainForm.getInstance().disableAction(CommandNames.saveAndClose);
          if (params.closeDialog) {
            this.state.canRunOnClosingFunction = !params.closeDialog;
            this.handleFormClosing();
          } else {
            if (params.saveSuccessCallback == null) {
              this.loadData(() => {
                this.mainForm.getInstance().enableAction(CommandNames.save);
                this.mainForm.getInstance().enableAction(CommandNames.saveAndClose);
                showToastMessage(this.getMessage('BusinessComponents', 'Saved'));
              });
            } else {
              params.saveSuccessCallback();
            }
          }
        }
        break;
      case 'UpdateState':
        this.hideLoadingProgress();

        if (!response.success) {
          if (!this.errorMessageShowed) {
            showToastMessage(this.getMessage('BOA', 'UnexpectedErrorOccured'));
            this.errorMessageShowed = true;
          }
        } else {
          // delete content
          this.state.fileContentDictionary = this.state.fileContentDictionary.filter(item => !params.fileServerDocuments.some(f => f.id === item.key));

          // delete filearray
          let selectedFileServerObjectId = this.state.selectedFileServerObjectId;
          if (selectedFileServerObjectId && params.fileServerDocuments.some(f => f.id === selectedFileServerObjectId)) {
            this.setState(prevState => ({
              selectedFileServerObjectId: null,
              fileContent: null,
              fileExtension: null,
              fileServerDocumentArray: prevState.fileServerDocumentArray.filter(fsd => !params.fileServerDocuments.some(f => f.id === fsd.id))
            }));
          } else {
            this.setState(prevState => ({
              fileServerDocumentArray: prevState.fileServerDocumentArray.filter(fsd => !params.fileServerDocuments.some(f => f.id === fsd.id))
            }));
          }
        }
        break;
      default:
        break;
    }
  }

  render() {
    const { context, classes } = this.props;

    if (this.mainForm) {
      if (this.state.fileServerDocumentArray && this.state.fileServerDocumentArray.length > 0) {
        this.mainForm.getInstance().enableAction(CommandNames.save);
      }
      else {
        this.mainForm.getInstance().disableAction(CommandNames.save);
      }
    }

    return (
      <div className={classes.root} style={{ width: '100%', height: '100%' }}>
        {
          isMobileDevice(context) ?
            <BBaseForm {...this.props}
              resourceInfo={this.props.resourceInfo}
              ref={form => this.mainForm = form}
              onClosing={this.handleFormClosing.bind(this)}
              onActionClick={this.actionBarButtonClick.bind(this)}>

              <BTabBar
                value={0}
                className={classes.root}
                indicatorColor={context.theme.boaPalette.pri500}
                tabItemContainerStyle={{ background: 'none' }}
                context={context}
                mode={'secondary'}
                centered={true}
                style={{
                  // width: 'calc(100% - 50px)',
                  marginRight: this.props.context.deviceSize > BComponent.Sizes.SMALL ? 48 : null
                }}
                tabItems={
                [
                  {
                    text: this.getMessage('BusinessComponents', 'DocumentsAdded'),
                    value: 0,
                    content: (
                        this.state.definedDocumentArray && this.state.definedDocumentArray.length ?
                          <DefinedDocumentListComponent context={context}
                            style={{height:this.state.scrollHeight}}
                            descriptionWidth = {this.state.descriptionWidth}
                            definedDocumentArray={this.state.definedDocumentArray}
                            mimeTypeArray={this.state.mimeTypeArray}
                            fileServerDocumentArray={this.state.fileServerDocumentArray}
                            selectedFileServerObjectId={this.state.selectedFileServerObjectId}
                            onDocumentSelected={this.handleSelectFile.bind(this)}
                            onDocumentAdded={this.handleAddFile.bind(this)}
                            onDocumentDownload={this.handleDocumentDownload.bind(this)}
                            onDocumentDeleted={this.handleDocumentDelete.bind(this)}
                            onDeleteAll={this.handleDeleteAll.bind(this)}
                            onDocumentPasteClick={this.handleDocumentPaste.bind(this)}
                            onPrintClick={this.handlePrint.bind(this)}
                            existOpenlist={false} />
                          : <div />
                      )
                  }
                ]
                }
                initialSelectedIndex={0} />
            </BBaseForm>
            :
            <BBaseForm {...this.props}
              resourceInfo={this.props.resourceInfo}
              ref={form => this.mainForm = form}
              onClosing={this.handleFormClosing.bind(this)}
              onActionClick={this.actionBarButtonClick.bind(this)}
              rightPaneWidth={570}
              rightPaneMaxWidth={700}
              rightPaneMinWidth={350}
              rightPaneContent={
                <BTabBar
                  className={classes.root}
                  value={0}
                  indicatorColor={context.theme.boaPalette.pri500}
                  tabItemContainerStyle={{ background: 'none' }}
                  context={context}
                  mode={'secondary'}
                  style={{ maxWidth: 'none', height: '40px', minHeight: '40px' }}
                  tabItems={
                  [
                    {
                      text: this.getMessage('BusinessComponents', 'DocumentsAdded'),
                      value: 0,
                      content: (
                          this.state.definedDocumentArray && this.state.definedDocumentArray.length ?
                            <DefinedDocumentListComponent context={context}
                              descriptionWidth = {this.state.descriptionWidth}
                              style={{height:this.state.scrollHeight}}
                              definedDocumentArray={this.state.definedDocumentArray}
                              mimeTypeArray={this.state.mimeTypeArray}
                              fileServerDocumentArray={this.state.fileServerDocumentArray}
                              selectedFileServerObjectId={this.state.selectedFileServerObjectId}
                              cropSuccess={this.state.cropSuccess}
                              onDocumentSelected={this.handleSelectFile.bind(this)}
                              onDocumentAdded={this.handleAddFile.bind(this)}
                              onDocumentDownload={this.handleDocumentDownload.bind(this)}
                              onDocumentDeleted={this.handleDocumentDelete.bind(this)}
                              onDeleteAll={this.handleDeleteAll.bind(this)}
                              onDocumentPasteClick={this.handleDocumentPaste.bind(this)}
                              onPrintClick={this.handlePrint.bind(this)}
                              onFileInfoClick={this.handleFileInfo.bind(this)}
                              existOpenlist={false} />
                            : <div />
                        )
                    }
                  ]
                  }
                  initialSelectedIndex={0} />
              }>
              <div ref={r => this.documentCardDiv = r} style={{ width: '100%', height: '100%' }}>
                <BCard context={context}
                  style={{
                    backgroundColor: this.state.cardBackgroundColor,
                    padding: '8px',
                    height: '100%',
                    overflowY: 'scroll'
                  }}
                  disableGridBehaviour={true}>
                  <DocumentViewer ref={r => this.documentViewer = r} context={context}
                    fileServerObjectId={this.state.selectedFileServerObjectId}
                    fileContent={this.state.fileContent}
                    fileExtension={this.state.fileExtension}
                    mimeType={this.state.fileMimeType}
                    documentContainerHeight={this.state.documentContainerHeight}
                    onCropSuccess={this.handleCropSuccess.bind(this)} />
                </BCard>
              </div>
            </BBaseForm>
        }

        <div id='snack-bar-element-instance'></div>
      </div>
    );
  }
}

export default BDivitComponent;
