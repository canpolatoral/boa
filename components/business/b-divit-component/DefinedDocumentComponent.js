import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { BDevice } from 'b-device';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent, BComponentComposer } from 'b-component';
import moment from 'moment/moment';
import Flexbox from 'flexbox-react';
import BFileReaderInput from 'b-file-input';
import { BRadioButton } from 'b-radio-button';
import { BMenuItem } from 'b-menu-item';
import { BIconButton } from 'b-icon-button';
// import { BLabel } from 'b-label';
import {List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import AddDescriptionComponent from './AddDescriptionComponent';
import AddValidityDateComponent from './AddValidityDateComponent';
import { generateGUID, isMobileDevice, showToastMessage } from './Constants';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import { BButton } from 'b-button';
import BFlexPanel from 'b-flex-panel';


const styles = theme => ({
  labelLTR: {
    marginLeft: 0
  },
  labelRTL: {
    marginRight: 0
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  primary: { color: 'red', fontSize: '14px' },

});
@BComponentComposer
@withStyles(styles)
export default class DefinedDocumentComponent extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.props,
    /**
     * Indicates the defined document.
     */
    definedDocument: PropTypes.any,


    /**
     * Indicates the selected defined document id.
     */
    selectedDefinedDocumentId: PropTypes.number,
    /**
     * Indicates the mime type array.
     */
    mimeTypeArray: PropTypes.arrayOf(PropTypes.any),
    /**
     * Indicates the file server document array.
     */
    fileServerDocumentArray: PropTypes.arrayOf(PropTypes.any),
    /**
     * Indicates the file server object id.
     */
    fileServerObjectId: PropTypes.string,
    /**
     * Indicates the crop is success or not.
     */
    cropSuccess: PropTypes.bool,
    /**
     * The event to handle document adding.
     */
    onDocumentAdded: PropTypes.func,
    /**
     * The event to handle document selection.
     */
    onDocumentSelected: PropTypes.func,
    /**
     * The event to handle document deletion.
     */
    onDocumentDeleted: PropTypes.func,
    /**
     * The event to handle full deletion.
     */
    onDeleteAll: PropTypes.func,
    /**
     * The event to handle document download process.
     */
    onDocumentDownload: PropTypes.func,
    /**
     * The event to handle document menu click.
     */
    onDocumentMenuClick: PropTypes.func,
    /**
     * The event to handle document paste click.
     */
    onDocumentPasteClick: PropTypes.func,
    /**
     * The event to handle document file info click.
     */
    onFileInfoClick: PropTypes.func,
    /**
     * The event to handle document print click.
     */
    onPrintClick: PropTypes.func
  };

  static defaultProps = {
    /**
     * Base default properties from BBusinessComponent.
     */
    ...BBusinessComponent.defaultProps
  };

  state = {
    fileServerDocumentArray: this.props.fileServerDocumentArray,
    showNestedFileItems: this.props.showNestedFileItems ? this.props.showNestedFileItems : false,
    changeBackgroundColor: this.props.changeBackgroundColor ? this.props.changeBackgroundColor : false,
    anchorMenu: null,
    anchorFileMenu: null,
    fsdid: null,
    buttonVisiable: 'hidden',
    isMouseOver: false,
    clickList: this.props.clickListFlag ? this.props.clickListFlag : false,
    anchorEl: null
  };

  constructor(props, context) {
    super(props, context);
  }

  isValidityDateRequired() {
    let selectedDefinedDocument = this.props.definedDocument;
    return selectedDefinedDocument.validityPeriodInDays && selectedDefinedDocument.validityPeriodInDays > 0;
  }

  checkAndSetValidityDate(documentArray, fileServerDocument, resultCallback) {

    if (!this.isValidityDateRequired()) {
      resultCallback({ success: true, value: fileServerDocument });
    } else {
      let dialog = (<AddValidityDateComponent context={this.props.context}
        validityBeginDate={fileServerDocument.validityBeginDate}
        validityEndDate={fileServerDocument.validityEndDate} />);
      let dialogStyle = isMobileDevice(this.props.context) ? { width: '90%', height: '50%' } : {
        width: '25%',
        height: '35%'
      };
      BDialogHelper.showWithResourceCode(this.props.context, null, dialog, 0, 0, this.getMessage('DocumentManagement', 'AddValidityDate'),
        (dialogResponse, data) => {
          if (dialogResponse === BComponent.DialogResponse.OK) {
            if (fileServerDocument.fileId > 0) {
              let requestBody = {
                methodName: 'UpdateFileValidityDate',
                fileId: fileServerDocument.fileId,
                validityBeginDate: data.validityBeginDate,
                validityEndDate: data.validityEndDate,
                resourceId: 482
              };

              let proxyRequest = {
                requestClass: 'BOA.Types.DocumentManagement.Divit.DivitEditorRequest',
                requestBody: requestBody,
                params: { documentArray: documentArray, data: data, fileServerDocument: fileServerDocument.fileId },
                key: 'UpdateFileValidityDate'
              };
              this.proxyExecute(proxyRequest);

            } else {
              fileServerDocument.validityBeginDate = data.validityBeginDate;
              fileServerDocument.validityEndDate = data.validityEndDate;
              resultCallback({ success: true, value: fileServerDocument });
            }
          } else {
            resultCallback({ success: false, value: null });
          }
        }, dialogStyle);
    }
  }

  /**
   * handle document radiobutton check event.
   */
  handleSelectFile(fileServerObjectId) {
    this.props.onDocumentSelected && this.props.onDocumentSelected({
      selectedDefinedDocumentId: this.props.definedDocument.docId,
      fileServerObjectId: fileServerObjectId
    });
  }

  // #region MenuClickOperations
  handleDocumentMenuClick() {
    this.props.onDocumentMenuClick && this.props.onDocumentMenuClick({
      selectedDefinedDocumentId: this.props.definedDocument.docId
    });
  }

  // #region FileMenuClickOperations
  handleFileMenuClicked(key) {
    this.setState({ anchorFileMenu: null });
    let fileServerObjectId = this.state.fsdid;

    switch (key) {
      case 'handleAddDescription':
        this.handleAddDescription(fileServerObjectId);
        break;
      case 'handleDownloadFile':
        this.handleDownloadFile(fileServerObjectId);
        break;
      case 'handleDeleteFile':
        this.handleDeleteFile(fileServerObjectId);
        break;
      case 'handlePrintFile':
        this.handlePrintFile(fileServerObjectId);
        break;
      case 'handleAddValidityDate':
        this.handleAddValidityDate(fileServerObjectId);
        break;
      default:
        break;
    }
  }

  handleAddDescription(fileServerObjectId) {
    this.setState({ anchorFileMenu: null });
    let dialogStyle = isMobileDevice(this.props.context) ? { width: '90%', height: '50%' } : {
      width: '25%',
      height: '35%'
    };

    let documentArray = Object.assign([], this.state.fileServerDocumentArray);
    let fileServerDocument = documentArray.find(f => f.id === fileServerObjectId);
    let dialog = (<AddDescriptionComponent context={this.props.context} description={fileServerDocument.description} />);
    BDialogHelper.showWithResourceCode(this.props.context, null, dialog, 0, 0, this.getMessage('DocumentManagement', 'AddDescription'),
      (dialogResponse, data) => {
        if (dialogResponse === BComponent.DialogResponse.OK) {
          if (fileServerDocument.fileId > 0) {
            let requestBody = {
              methodName: 'UpdateDocumentDescription',
              fileServerObjectId: fileServerDocument.id,
              documentDescription: data.description,
              resourceId: 482
            };

            let proxyRequest = {
              requestClass: 'BOA.Types.Kernel.BusinessHelper.DocumentSaveRequest',
              requestBody: requestBody,
              params: { fileServerObjectId: fileServerObjectId, documentArray: documentArray, data: data },
              key: 'UpdateDocumentDescription'
            };
            this.proxyTransactionExecute(proxyRequest);

          } else {
            fileServerDocument.description = data.description;
            this.setState({ fileServerDocumentArray: documentArray });
          }
        }
      }, dialogStyle);
  }

  handleDownloadFile(fileServerObjectId) {
    this.setState({ anchorMenu: null });

    this.props.onDocumentDownload && this.props.onDocumentDownload({
      selectedDefinedDocumentId: this.props.definedDocument.docId,
      fileServerObjectId: fileServerObjectId
    });
  }

  handleDeleteFile(fileServerObjectId) {
    let msg = this.getMessage('DocumentManagement', 'ChosenDocWillDelete') + this.getMessage('DocumentManagement', 'DoYouWanttoContinue');
    BDialogHelper.show(this.props.context, msg, BComponent.DialogType.QUESTION, BComponent.DialogResponseStyle.YESNO, '?',
      (dialogResponse) => {
        if (dialogResponse === BComponent.DialogResponse.YES) {
          this.props.onDocumentDeleted && this.props.onDocumentDeleted({
            selectedDefinedDocumentId: this.props.definedDocument.docId,
            fileServerObjectId: fileServerObjectId
          });
        }
      }
    );
  }

  handlePrintFile(fileServerObjectId) {
    this.props.onPrintClick && this.props.onPrintClick({
      selectedDefinedDocumentId: this.props.definedDocument.docId,
      fileServerObjectId: fileServerObjectId
    });


    var mywindow = window.open('', 'PRINT', 'height=600,width=600');

    mywindow.document.write('<img src="' + $('.ReactCrop__image').attr('src') + '" />');


    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  }

  handleAddValidityDate(fileServerObjectId) {
    let documentArray = Object.assign([], this.state.fileServerDocumentArray);
    let fileServerDocument = documentArray.find(f => f.id === fileServerObjectId);
    this.checkAndSetValidityDate(documentArray, fileServerDocument, (result) => {
      if (result.success) {
        this.setState({ fileServerDocumentArray: documentArray });
      }
    });
  }


  // #endregion
  // #region MenuItemClickOperations
  handleMenuItemClicked(key) {
    this.setState({ anchorMenu: null });

    switch (key) {
      case 'handleScan':
        this.handleScan();
        break;
      case 'handleDocumentPaste':
        this.handleDocumentPaste();
        break;
      case 'handlePrintAggreement':
        this.handlePrintAggreement();
        break;
      default:
        break;
    }
  }

  handleAddFile(e, results) {
    this.setState({ anchorMenu: null });
    let selectedDefinedDocument = this.props.definedDocument;

    results.forEach(result => {
      const [e, file] = result;

      if (selectedDefinedDocument.maxFileSize && file.size > selectedDefinedDocument.maxFileSize * 1024) {
        showToastMessage(this.getMessage('DocumentManagement', 'UpMaxDocSize'));
        return;
      }

      if (selectedDefinedDocument.minFileSize && file.size < selectedDefinedDocument.minFileSize * 1024) {
        showToastMessage(this.getMessage('DocumentManagement', 'UpMinDocSize'));
        return;
      }

      let fileExtension = '.' + file.name.split('.').pop();
      let mimeTypeDefinition = this.props.mimeTypeArray.find(m => m.extension === fileExtension.toLowerCase());
      if (mimeTypeDefinition) {
        let fileGuid = generateGUID();

        let newDocument = {
          documentType: selectedDefinedDocument.docId.toString(),
          mimeType: mimeTypeDefinition.mimeType,
          documentName: selectedDefinedDocument.docName,
          extension: fileExtension,
          fileSize: file.size,
          fileId: -1,
          validityBeginDate: null,
          validityEndDate: null,
          id: fileGuid // UI tarafı seçim için eklendi. server'da düzgün bir guid alacaktır.
        };

        this.checkAndSetValidityDate([], newDocument, (result) => {
          if (result.success) {
            let newDocumentArray = [];
            let newContentArray = [];

            newDocumentArray.push(result.value);

            let fileData = e.target.result.split(',').pop();
            newContentArray.push({ key: fileGuid, value: fileData });

            this.props.onDocumentAdded && this.props.onDocumentAdded({
              selectedDefinedDocumentId: this.props.definedDocument.docId,
              fileServerDocumentArray: newDocumentArray,
              fileContentDictionary: newContentArray
            });

            this.setState({
              showNestedFileItems: true,
              changeBackgroundColor: true
            });
          }
        });
      } else {
        showToastMessage(this.getMessage('BusinessComponents', 'DivitExtensionNotDefined').replace('{0}', fileExtension));
      }
    });
  }

  handleDeleteAll() {
    this.setState({ anchorMenu: null });
    this.props.onDeleteAll && this.props.onDeleteAll({
      selectedDefinedDocumentId: this.props.definedDocument.docId
    });
  }

  handleScan() {
    let promise = BDevice.scannerScanToTemp(null, 200, 1);
    promise.done((response) => {
      if (!response.HasError) {
        let promiseTiff = BDevice.scannerGetScannedTiff(null, response.FolderGuid, 0);
        promiseTiff.done((responseTif) => {
          let selectedDefinedDocument = this.props.definedDocument;
          let fileGuid = generateGUID();

          // todo add fileserverdocument
          let newDocument = {
            documentType: selectedDefinedDocument.docId.toString(),
            mimeType: 'image/tiff',
            documentName: selectedDefinedDocument.docName,
            extension: '.tif',
            fileId: -1,
            id: fileGuid // UI tarafı seçim için eklendi. server'da düzgün bir guid alacaktır.
          };

          let newDocumentArray = [newDocument];

          // todo son ekleneni gösterme mevzusu yapılmalı mı?
          this.setState({
            fileServerDocumentArray: this.state.fileServerDocumentArray.concat(newDocumentArray),
            showNestedFileItems: true,
            changeBackgroundColor: true
          });

          // inform parent about new documents and contents
          this.props.onDocumentAdded && this.props.onDocumentAdded({
            selectedDefinedDocumentId: this.props.definedDocument.docId,
            fileServerDocumentArray: newDocumentArray,
            fileContentDictionary: [{key: fileGuid, value: responseTif}]
          });

        }).fail((error) => {
          // todo: error on fail
          this.debugLog(error, 3);
        });
      }
      else {
        // todo: error while scan popup
        alert('todo:error while scan popup');
      }
    }).fail((error) => {
      // todo: error on fail
      alert('todo:error fail');
      this.debugLog(error, 3);
    });
  }

  handleDocumentPaste() {
    let fileExtension = '.jpeg';
    let mimeTypeDefinition = this.props.mimeTypeArray.find(m => m.extension === fileExtension.toLowerCase());
    if (!mimeTypeDefinition) {
      showToastMessage(this.getMessage('BusinessComponents', 'DivitExtensionNotDefined').replace('{0}', fileExtension));
      return;
    }

    let croppedDocument = {
      documentType: this.props.definedDocument.docId.toString(),
      mimeType: mimeTypeDefinition.mimeType,
      documentName: this.props.definedDocument.docName,
      extension: fileExtension,
      fileId: -1,
      id: generateGUID()
    };

    this.props.onDocumentPasteClick && this.props.onDocumentPasteClick({
      selectedDefinedDocumentId: this.props.definedDocument.docId,
      croppedDocument: croppedDocument
    });
  }

  handlePrintAggreement() {
    let selectedDefinedDocument = this.props.definedDocument;
    let requestBody1 = {
      methodName: 'IsYourCornerDocument',
      flowId: selectedDefinedDocument.flowId,
      docId: selectedDefinedDocument.docId
    };

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.OnlineAgreementRequest',
      requestBody: requestBody1,
      params: {
        selectedDefinedDocument: selectedDefinedDocument
      },
      key: 'IsYourCornerDocument'
    };
    this.proxyExecute(proxyRequest);
  }

  // #endregion
  // #region OpenCloseMenuOperations
  handleMenuIconClick = event => {

    this.props.onDocumentMenuClick && this.props.onDocumentMenuClick({
      selectedDefinedDocumentId: this.props.definedDocument.docId
    });
    this.setState({ anchorMenu: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorMenu: null });
  };

  handleFileMenuClick = (event, fsdid) => {
    this.props.onDocumentSelected && this.props.onDocumentSelected({
      selectedDefinedDocumentId: this.props.definedDocument.docId,
      fileServerObjectId: fsdid
    });
    this.setState({
      anchorFileMenu: event.currentTarget,
      fsdid
    });
  };

  handleFileMenuClose = () => {
    this.setState({ anchorFileMenu: null });
  };
  // #endregion
  // #endregion

  handleNestedListToggle() {
    this.setState(prevState => ({
      showNestedFileItems: !prevState.showNestedFileItems
    }));

    this.props.onDocumentMenuClick && this.props.onDocumentMenuClick({
      selectedDefinedDocumentId: this.props.definedDocument.docId
    });
  }

  handleFileInfo(e, fsd) {
    this.props.onFileInfoClick && this.props.onFileInfoClick({
      selectedDefinedDocumentId: this.props.definedDocument.docId,
      fileServerObjectId: fsd.id
    });

    let name =  fsd.creator ? fsd.creator :  this.props.context.applicationContext.user.name;
    let version = fsd.version ? fsd.version : 1;
    let creatorInfo = this.getMessage('DocumentManagement', 'AddedUser') + ': ' + name;
    let versionInfo = this.getMessage('DocumentManagement', 'Version')  + ': ' + version;

    let infoMessage = [creatorInfo, versionInfo];

    BDialogHelper.show(
      this.props.context,
      infoMessage,
      BComponent.DialogType.Error,
      BComponent.DialogResponseStyle.OK
    );

  }
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleMouseover() {
    if (!isMobileDevice(this.props.context) )
      this.setState({ buttonVisiable: 'visible', isMouseOver: true });
  }
  handleMouseout() {
    if (!isMobileDevice(this.props.context) )
      this.setState({ buttonVisiable: 'hidden', isMouseOver: false });
  }

  generateTextInfo(context, label, info, labelColor, infoColor) {

    labelColor = labelColor || context.theme.boaPalette.base400;
    infoColor = infoColor || context.theme.boaPalette.base450;

    var isRightToLeft = this.props.context.localization.isRightToLeft;
    if (info === '' || info === undefined) {
      info = '-';
    }
    // <p style={{ margin: 0, lineHeight: '16px' }}>
    /* </p> */
    return (
      <div style={{ display: 'flex', 'flex-direction': null }}>
        <div style={{ overflow: 'hidden', wordWrap: 'break-word' }}>
          <span style={{ fontSize: '12px', display: 'inline', color: labelColor }}>
            {isRightToLeft ? (' :' + '\u00A0' + label)
              : (label + ':' + '\u00A0')}
          </span>
          <span style={{ fontSize: '14px', display: 'inline', color: infoColor }}>
            {info}
          </span>
        </div>
      </div>
    );
  }


  getFileServerDocumentDefinition(context, fsd) {
    const extensionStyle = {
      background: context.theme.boaPalette.base250,
      borderStyle: 'rounded',
      borderWidth: '2px',
      borderColor: context.theme.boaPalette.base300,
      borderRadius: '2px',
      fontSize: 9,
      fontWeight: 'bold',
      color: this.props.context.theme.boaPalette.comp500,
      // marginLeft: 8,
      height: 16,
      width: 'auto',
      // lineHeight: '18px',
      paddingLeft: 2,
      paddingRight: 2,
      paddingBottom: 2,
      paddingTop: 2,
      marginRight: 5
    };
    // let defDocName = asd.length > 41 ? asd.substr(0, 41) + '...' : asd;

    return (
      <Flexbox alignSelf='center' flexDirection='column'>
        <Flexbox style={{ lineHeight: '18px' }}>
          <Flexbox alignContent='flex-start'>
            <div style={{ fontSize: 14 }}>
              <span style={extensionStyle}>
                {fsd.extension.split('.').pop().toUpperCase()}
              </span>
              {fsd.documentName}
            </div>

            {/* <BLabel context={context} text={fsd.documentName} style={{ fontSize: 14, overflow: 'hidden', textOverflow:'ellipsis' }} />  */}
            {/* <BLabel context={context} text={defDocName} style={{ fontSize: 14, whiteSpace: 'nowrap' }} /> */}
          </Flexbox>
          {/* <Flexbox alignContent='flex-end'>
            <div style={extensionStyle}>
              {fsd.extension.split('.').pop().toUpperCase()}
            </div>
          </Flexbox> */}
        </Flexbox  >
        <div style={{maxWidth : this.props.descriptionWidth}}>
          {this.generateTextInfo(context, this.getMessage('DocumentManagement', 'AdditionTime'), moment(fsd.dateCreated).format('DD.MM.YYYY hh:mm'))}
          {fsd.validityBeginDate && fsd.validityEndDate
            ? this.generateTextInfo(context, this.getMessage('BusinessComponents', 'ValidityDate'), moment(fsd.validityBeginDate).format('DD.MM.YYYY') + ' - ' + moment(fsd.validityEndDate).format('DD.MM.YYYY'))
            : null}
          {fsd.description ?
            this.generateTextInfo(context, this.getMessage('BusinessComponents', 'Description'), fsd.description) : null}
        </div>
      </Flexbox>
    );
  }

  getMenuItems(context, documentTypeId, subDocCount, imageCount) {
    let menuItemArray = [
      <BFileReaderInput context={context} id={documentTypeId.toString()} as='url'
        onChange={this.handleAddFile.bind(this)}
        multiple={true}>
        <BMenuItem
          context={context}
          primaryText={this.getMessage('DocumentManagement', 'AddDoc')} />
      </BFileReaderInput>,
      <BMenuItem context={context} primaryText={this.getMessage('DocumentManagement', 'DeleteAll')}
        itemSelected={this.handleDeleteAll.bind(this)} />
    ];


    if (!isMobileDevice(context))
      menuItemArray.push(<BMenuItem context={context} primaryText={this.getMessage('DocumentManagement', 'Scan')}
        itemSelected={this.handleMenuItemClicked.bind(this, 'handleScan')} />);
    if (!isMobileDevice(context) && subDocCount && imageCount > 0) {
      menuItemArray.push(<BMenuItem context={context} primaryText={this.getMessage('DocumentManagement', 'Paste')}
        itemSelected={this.handleMenuItemClicked.bind(this, 'handleDocumentPaste')} />);
    }
    else {
      menuItemArray.push(<BMenuItem context={context} disabled={true} primaryText={this.getMessage('DocumentManagement', 'Paste')}
      />);
    }
    if (!isMobileDevice(context) && subDocCount)
      menuItemArray.push(<BMenuItem context={context}
        primaryText={this.getMessage('DocumentManagement', 'PrintAggreement')}
        itemSelected={this.handleMenuItemClicked.bind(this, 'handlePrintAggreement')} />);

    return menuItemArray;

  }

  getFileMenuItems(context, fsdid) {
    let menuItemArray = [
      <BMenuItem key={fsdid + 1} context={context}
        primaryText={this.getMessage('DocumentManagement', 'AddDescription')}
        itemSelected={this.handleFileMenuClicked.bind(this, 'handleAddDescription')} />,
      <BMenuItem key={fsdid + 2} context={context}
        primaryText={this.getMessage('DocumentManagement', 'Download')}
        itemSelected={this.handleFileMenuClicked.bind(this, 'handleDownloadFile')} />,
      <BMenuItem key={fsdid + 3} context={context}
        primaryText={this.getMessage('BOA', 'Delete')}
        itemSelected={this.handleFileMenuClicked.bind(this, 'handleDeleteFile')} />
    ];

    if (!isMobileDevice(context)) {
      menuItemArray.push(<BMenuItem key={fsdid + 4} context={context}
        primaryText={this.getMessage('BOA', 'PrintView')}
        itemSelected={this.handleFileMenuClicked.bind(this, 'handlePrintFile')} />);
    }

    if (this.isValidityDateRequired()) {
      menuItemArray.push(<BMenuItem key={fsdid + 5} context={context}
        primaryText={this.getMessage('DocumentManagement', 'AddValidityDate')}
        itemSelected={this.handleFileMenuClicked.bind(this, 'handleAddValidityDate')} />);
    }

    return menuItemArray;
  }

  renderServerDocumentList(serverDocumentArray) {
    const { context } = this.props;
    const { anchorFileMenu } = this.state;

    return (
      <Flexbox key={this.props.definedDocument.docId} flexDirection='column' style={{ marginTop: '0px', marginBottom: '0px' }}>
        {
          serverDocumentArray.map((fsd, index) => {
            return (
              <Flexbox key={fsd.id} flexDirection='column'>
                <Flexbox >
                  <Flexbox flexGrow={1} alignSelf='center' onClick={this.handleSelectFile.bind(this, fsd.id)}>
                    {
                      isMobileDevice(context) ?
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', marginBottom: '12px' }}>
                          {this.getFileServerDocumentDefinition(context, fsd)}
                        </div>
                        :
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', marginBottom: '12px' }}>
                          <div>
                            <BRadioButton context={context}
                              label=''
                              style={{ marginBottom: 0 }}
                              iconStyle={{ alignSelf: 'center' }}
                              inputStyle={{ height: 38 }}
                              checked={this.props.fileServerObjectId === fsd.id} />
                          </div>
                          <div style={{ maxWidth: '600px' }}>
                            {this.getFileServerDocumentDefinition(context, fsd)}
                          </div>
                        </div>
                    }
                  </Flexbox>
                  <Flexbox alignSelf='center' justifyContent='flex-end'>
                    <BIconButton context={context} dynamicIcon='InfoOutline'
                      iconStyle={{ color: context.theme.boaPalette.base400 }}
                      onClick={(e) => this.handleFileInfo(e, fsd)}
                      tooltip =
                        {
                          <div style={{ padding: '5px' }}>
                            {fsd.creator ?
                              this.generateTextInfo(context, this.getMessage('DocumentManagement', 'AddedUser'), fsd.creator,
                              context.theme.boaPalette.base200, context.theme.boaPalette.base250) :  this.generateTextInfo(context, this.getMessage('DocumentManagement', 'AddedUser'), context.applicationContext.user.name,
                              context.theme.boaPalette.base200, context.theme.boaPalette.base250)}
                            {fsd.version ?
                              this.generateTextInfo(context, this.getMessage('DocumentManagement', 'Version'), fsd.version,
                              context.theme.boaPalette.base200, context.theme.boaPalette.base250) : this.generateTextInfo(context, this.getMessage('DocumentManagement', 'Version'), 1,
                              context.theme.boaPalette.base200, context.theme.boaPalette.base250)}
                          </div>
                        }
                    />

                  </Flexbox>
                  <Flexbox alignSelf='center' justifyContent='flex-end'>
                    <IconButton
                      aria-label="More"
                      aria-haspopup="true"
                      style={{marginRight:'4px'}}
                      onClick={(event) => this.handleFileMenuClick(event, fsd.id)}

                    >
                      <MoreVertIcon
                        style={{ color: context.theme.boaPalette.base400 }} />
                    </IconButton>
                    <Menu
                      anchorEl={this.state.anchorFileMenu}
                      open={Boolean(anchorFileMenu)}
                      onClose={this.handleFileMenuClose}
                      PaperProps={{
                        style: {
                          width: 'auto'
                        },
                      }}
                    >
                      {this.getFileMenuItems(context, fsd.id)}
                    </Menu>
                  </Flexbox>
                </Flexbox>
                <Flexbox>
                  {
                    index === serverDocumentArray.length - 1
                      ? null
                      : <hr style={{
                        marginTop: 0,
                        marginBottom: 0,
                        height: 1,
                        border: 'none',
                        width: '100%',
                        backgroundColor: context.theme.boaPalette.base200
                      }} />
                  }
                </Flexbox>
              </Flexbox>
            );
          })
        }
      </Flexbox>
    );
  }

  isFileServerDocumentEqual(f1, f2) {
    return f1.id === f2.id && f1.description === f2.description
      && f1.validityBeginDate === f2.validityBeginDate && f1.validityEndDate === f2.validityEndDate;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.clickList != nextProps.clickListFlag) {
      this.setState({ clickList: nextProps.clickListFlag });
    }

    let isSelectedDefinedDocument = this.props.definedDocument.docId === nextProps.selectedDefinedDocumentId;

    // if clicked other defined document toggle off current
    if ( !isSelectedDefinedDocument && this.state.showNestedFileItems) {
      this.setState(prevState => ({
        showNestedFileItems: !prevState.showNestedFileItems
      }));
    }

    this.setState({ changeBackgroundColor: isSelectedDefinedDocument });

    if (!isSelectedDefinedDocument) {
      this.setState({
        anchorMenu: null,
        anchorFileMenu: null
      });
    }

    let documentArray = nextProps.fileServerDocumentArray;
    if (this.state.fileServerDocumentArray.length !== documentArray.length
      || documentArray.some(d => !this.state.fileServerDocumentArray.find(f => this.isFileServerDocumentEqual(f, d)))) {
      this.setState({
        fileServerDocumentArray: documentArray,
        anchorMenu: null,
        anchorFileMenu: null
      });
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'UpdateFileValidityDate':
        if (response.success) {
          let fileServerDocument = params.documentArray.find(f => f.id === params.fileServerDocument.fileId);
          fileServerDocument.validityBeginDate = params.data.validityBeginDate;
          fileServerDocument.validityEndDate = params.data.validityEndDate;
          this.setState({ fileServerDocumentArray: params.documentArray });
        }
        break;
      case 'UpdateDocumentDescription':
        if (response.success) {
          let fileServerDocument = params.documentArray.find(f => f.id === params.fileServerObjectId);
          fileServerDocument.description = params.data.description;
          this.setState({ fileServerDocumentArray: params.documentArray });
        }
        break;
      case 'IsYourCornerDocument':
        if (response.success) {
          if (response.value.item1) {
            let requestBody2 = {
              methodName: 'GetYourCornerDocument',
              flowId: params.selectedDefinedDocument.flowId,
              docId: params.selectedDefinedDocument.docId,
              documentLanguageId: 1
            };

            let proxyRequest = {
              requestClass: 'BOA.Types.Kernel.BusinessHelper.OnlineAgreementRequest',
              requestBody: requestBody2,
              params: {
                selectedDefinedDocument: params.selectedDefinedDocument
              },
              key: 'GetYourCornerDocument'
            };
            this.proxyExecute(proxyRequest);

          }
        }
        break;
      case 'GetYourCornerDocument':
        if (response.success) {
          this.showLoadingProgress();
          let printPromise = BDevice.printerPrint(null, params.selectedDefinedDocument.docName + '.docx', response.value);
          printPromise.then(() => {
            this.hideLoadingProgress();
          }).fail((error) => {
            this.hideLoadingProgress();
            this.debugLog(error, 3);
          });
        }
        break;
      default:
        break;
    }
  }

  render() {
    let documentTypeId = this.props.definedDocument.docId;
    let definedDocumentName = this.props.definedDocument.docName;
    let serverDocumentArray = this.state.fileServerDocumentArray;
    let serverDocumentItems = serverDocumentArray && serverDocumentArray.length > 0
      ? [this.renderServerDocumentList(serverDocumentArray)]
      : [];
    let imageCount = 0;
    serverDocumentArray.map(function (type) {
      if ((/\.(gif|jpg|jpeg|png)$/i).test(type.extension)) {
        imageCount = imageCount + 1;
      }
    });
    let subDocCount = serverDocumentItems.length;
    const { context } = this.props;
    const { anchorMenu } = this.state;

    let fontColor = this.props.definedDocument.isMandatory > 0
      ? (this.state.fileServerDocumentArray.length <= 0 ? this.props.context.theme.boaPalette.obli500 : this.props.context.theme.boaPalette.success500)
      : this.props.context.theme.boaPalette.base450;

    let defDocName;
    if (this.props.definedDocument.isMandatory > 0) {
      defDocName = <p style={{
        margin: 0,
        fontWeight: this.state.fileServerDocumentArray.length > 0 ? 'bold' : 'normal'
      }}>{definedDocumentName.length > 41 && this.state.isMouseOver == true ? definedDocumentName.substr(0, 39) + '...' : definedDocumentName}&nbsp;<span style={{ color: this.props.context.theme.boaPalette.base300 }}>*</span></p>;
    } else {
      defDocName = <p style={{
        margin: 0,
        fontWeight: this.state.fileServerDocumentArray.length > 0 ? 'bold' : 'normal'
      }}>{definedDocumentName.length > 41 && this.state.isMouseOver == true ? definedDocumentName.substr(0, 41) + '...' : definedDocumentName}</p>;
    }

    let itemStyle = this.state.changeBackgroundColor
      ? {
        color: fontColor,
        fontSize: '14px',
        backgroundColor: context.theme.boaPalette.pri250,
        minHeight: '48px',
        paddingBottom: '0px',
        paddingTop: '0px'
      }
      : {
        color: fontColor,
        fontSize: '14px',
        background: 'none',
        minHeight: '48px',
        paddingBottom: '0px',
        paddingTop: '0px'
      };
    var visibility = false;
    var mouseButtonStye = null;


    if (this.state.buttonVisiable == 'visible' || this.state.clickList) {
      visibility = 'visible';
      mouseButtonStye = { visibility: visibility, marginRight: '30px' };
    }
    else {
      visibility = 'hidden';
      mouseButtonStye = { visibility: visibility, marginRight: '30px', width: '0px', height: '0px' };
    }

    if (this.state.isMouseOver == true) {
      mouseButtonStye = { visibility: visibility, marginRight: '30px' };
    }
    else if (this.state.clickList == false) {
      mouseButtonStye = { visibility: visibility, marginRight: '30px', width: '0px', height: '0px' };
    }
    var mouseButtonStyleMobile = Object.assign(mouseButtonStye, { marginRight: '0px' });

    if (isMobileDevice(this.props.context)) {
      mouseButtonStyleMobile.backgroundColor  = this.state.changeBackgroundColor ? context.theme.boaPalette.pri250 : 'none';
    }

    return (

      <Flexbox flexDirection='column' >
        <List style={{ padding: 0, marginTop: '0px', marginBottom: '0px' }} onClick={this.props.onhandleListClick}>

          <div onMouseOver={this.handleMouseover.bind(this, documentTypeId)} onMouseOut={this.handleMouseout.bind(this)} >
            <ListItem button
              onClick={this.handleNestedListToggle.bind(this)} style={this.state.isMouseOver == true ? Object.assign(itemStyle, { backgroundColor: context.theme.boaPalette.base150 }) : itemStyle}>
              <ListItemText
                disableTypography
                primary={defDocName}
              />
              {!isMobileDevice(context) &&
                <BFlexPanel direction='horizontal' style={mouseButtonStye}>
                  <BFileReaderInput context={context} id={documentTypeId.toString()} as='url'
                    onChange={this.handleAddFile.bind(this)}
                    multiple={true}>
                    <BButton
                      context={context}
                      type="flat"
                      text={this.getMessage('DocumentManagement', 'AddDoc')}
                      style={{ overflow: 'hidden', marginRight: '12px' }}
                      colorType="primary"
                    />
                  </BFileReaderInput>
                  <BButton context={context} type="flat"
                    style={{ overflow: 'hidden' }}
                    colorType="primary"
                    text={this.getMessage('DocumentManagement', 'Scan')}
                    onClick={this.handleMenuItemClicked.bind(this, 'handleScan')} />
                </BFlexPanel>
              }
            </ListItem>

            {isMobileDevice(context) && this.state.showNestedFileItems &&
              <div style={mouseButtonStyleMobile}>
                <BFileReaderInput context={context} id={documentTypeId.toString()} as='url'
                    onChange={this.handleAddFile.bind(this)}
                    multiple={true}>
                  <ListItem button style={{ color: this.props.context.theme.boaPalette.pri500 }}>
                    <ListItemText
                      disableTypography
                      primary={this.getMessage('DocumentManagement', 'AddDoc')}
                    />
                  </ListItem>
                </BFileReaderInput>

                </div>
              }
          </div>
          <ListItemSecondaryAction style = {isMobileDevice(context) ? { top : '24px'} : {}}>
            <IconButton
              aria-label="More"
              aria-owns={anchorMenu ? 'menu' : null}
              aria-haspopup="true"
              onClick={this.handleMenuIconClick}
            >
              <MoreVertIcon style={{ color: context.theme.boaPalette.pri500 }} />
            </IconButton>
            <Menu
              id={'menu'}
              onEnter={this.handleDocumentMenuClick.bind(this)}
              anchorEl={this.state.anchorMenu}
              open={Boolean(anchorMenu)}
              onClose={this.handleMenuClose}
              PaperProps={{
                style: {
                  width: 'auto'
                },
              }}
            >
              {this.getMenuItems(context, documentTypeId, subDocCount, imageCount)}
            </Menu>
          </ListItemSecondaryAction>
        </List>
        <Divider style={{ margin: 0, visibility: this.state.showNestedFileItems && serverDocumentItems.length > 0 ? 'hidden' : 'visible'}} />
        <Collapse in={this.state.showNestedFileItems && mouseButtonStye.visibility == 'visible'} timeout="auto" unmountOnExit style={{ height: 'auto' }}>

          <div>
            <List component="div"
              style={{ marginLeft: 22, paddingTop: '0px', paddingBottom: '0px' }}>
              {serverDocumentItems}

            </List>
            {serverDocumentItems.length > 0 ? <Divider style={{ margin: 0 }} /> : ''
            }
          </div>
        </Collapse>
      </Flexbox>


      // <ListItem
      //   style={itemStyle}
      //   primaryText={defDocName}
      //   rightIconButton={rightIconButton}
      //   open={this.state.showNestedFileItems}
      //   primaryTogglesNestedList={true}
      //   nestedItems={serverDocumentItems}
      //   nestedListStyle={!this.props.context.localization.isRightToLeft ? { padding: 0, marginLeft: 22 } : {
      //     padding: 0,
      //     marginRight: 22
      //   }}
      //   onNestedListToggle={this.handleNestedListToggle.bind(this)} />
      // <Divider style={{ margin: 0 }} />
    );
  }
}
