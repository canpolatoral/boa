import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import { BComponent, BComponentComposer } from 'b-component';
import { BLabel } from 'b-label';
import { BScroll } from 'b-scroll';
import { isMobileDevice } from './Constants';

import DefinedDocumentComponent from './DefinedDocumentComponent';

var existOpenlist = false;
@BComponentComposer
export default class DefinedDocumentListComponent extends BComponent {

  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BComponent.props,
    /**
     * Indicates the defined document array.
     */
    definedDocumentArray: PropTypes.arrayOf(PropTypes.any).isRequired,
    /**
     * Indicates the selected mime type array.
     */
    mimeTypeArray: PropTypes.arrayOf(PropTypes.any).isRequired,
    /**
     * Indicates the selected file server document array.
     */
    fileServerDocumentArray: PropTypes.arrayOf(PropTypes.any).isRequired,
    /**
     * Indicates the selected selected file server object id.
     */
    selectedFileServerObjectId: PropTypes.string,
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
     * Base default properties from BComponent.
     */
    ...BComponent.defaultProps
  };

  state = {
    selectedDefinedDocumentId: -1,
    cropSuccess: false,
    listIndex: undefined
  };

  constructor(props, context) {
    super(props, context);

    existOpenlist= false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ cropSuccess: nextProps.cropSuccess });
  }

  handleAddFile(args) {
    this.props.onDocumentAdded && this.props.onDocumentAdded({
      fileServerDocumentArray: args.fileServerDocumentArray,
      fileContentDictionary: args.fileContentDictionary
    });

    this.setState({ selectedDefinedDocumentId: args.selectedDefinedDocumentId });
  }


  handleFileInfo(args) {
    this.props.onFileInfoClick && this.props.onFileInfoClick({
      fileServerObjectId: args.fileServerObjectId
    });

    this.setState({ selectedDefinedDocumentId: args.selectedDefinedDocumentId });
  }

  handleSelectFile(args) {
    this.props.onDocumentSelected && this.props.onDocumentSelected({
      fileServerObjectId: args.fileServerObjectId,
      selectedDefinedDocumentId: args.selectedDefinedDocumentId
    });

    this.setState({ selectedDefinedDocumentId: args.selectedDefinedDocumentId });
  }

  handleDocumentDownload(args) {
    this.props.onDocumentDownload && this.props.onDocumentDownload({
      fileServerObjectId: args.fileServerObjectId
    });
  }

  handleDocumentDelete(args) {
    this.props.onDocumentDeleted && this.props.onDocumentDeleted({
      fileServerObjectId: args.fileServerObjectId
    });
  }

  handleDeleteAll(args) {
    this.props.onDeleteAll && this.props.onDeleteAll({
      selectedDefinedDocumentId: args.selectedDefinedDocumentId
    });
  }

  handleDocumentMenuClick(args) {
    this.setState({ selectedDefinedDocumentId: args.selectedDefinedDocumentId });
  }

  handleDocumentPaste(args) {
    this.props.onDocumentPasteClick && this.props.onDocumentPasteClick({
      croppedDocument: args.croppedDocument
    });

    this.setState({ selectedDefinedDocumentId: args.selectedDefinedDocumentId });
  }

  handlePrint(args) {
    this.props.onPrintClick && this.props.onPrintClick({
      fileServerObjectId: args.fileServerObjectId
    });
  }

  handleListClick(index) {
    this.setState({ listIndex: index });

  }

  render() {
    const { context } = this.props;
    var existMandatory = this.props.definedDocumentArray.filter(x => x.isMandatory === 1).length;
    var sortDocumentArray = this.props.definedDocumentArray.sort(function (a, b) {

      if (b.isMandatory == a.isMandatory) {
        return (a.docId < b.docId) ? -1 : (a.docId > b.docId) ? 1 : 0;
      }
      else {
        return (a.isMandatory > b.isMandatory) ? -1 : 1;
      }


    });
    const definedDocumentItems = sortDocumentArray.map((dd, i) => {
      let openListstate = false;
      let serverDocumentArray = this.props.fileServerDocumentArray.filter(fsd => fsd.documentType === dd.docId.toString());
      let subDocCount = serverDocumentArray.length;
      if (existOpenlist == false && subDocCount > 0) {
        existOpenlist = true;
        openListstate = true;
      }
      else { openListstate = undefined; }


      return (
        <DefinedDocumentComponent context={context} key={dd.docId} definedDocument={dd}
          descriptionWidth = {this.props.descriptionWidth}
          selectedDefinedDocumentId={this.state.selectedDefinedDocumentId}
          mimeTypeArray={this.props.mimeTypeArray}
          fileServerDocumentArray={serverDocumentArray}
          fileServerObjectId={this.props.selectedFileServerObjectId}
          cropSuccess={this.state.cropSuccess}
          onDocumentSelected={this.handleSelectFile.bind(this)}
          onDocumentAdded={this.handleAddFile.bind(this)}
          onDocumentDownload={this.handleDocumentDownload.bind(this)}
          onDocumentDeleted={this.handleDocumentDelete.bind(this)}
          onDeleteAll={this.handleDeleteAll.bind(this)}
          onDocumentMenuClick={this.handleDocumentMenuClick.bind(this)}
          onDocumentPasteClick={this.handleDocumentPaste.bind(this)}
          onFileInfoClick={this.handleFileInfo.bind(this)}
          onPrintClick={this.handlePrint.bind(this)}
          onhandleListClick={this.handleListClick.bind(this, i)}
          clickListFlag={this.state.listIndex == i ? true : false}
          showNestedFileItems={openListstate}
          changeBackgroundColor={openListstate}/>
      );
    });

    let scrollHeight = this.props.style && this.props.style.height ? this.props.style.height : '100%';
    return (
      <div>
        <BScroll context={context} style={{ marginTop: '0px', paddingTop: '0px', height:scrollHeight }} option={{ suppressScrollX: true }}>
          <List style={{ marginBottom: '50px', marginTop: '0px', paddingTop: '0px', paddingBottom: '0px', backgroundColor: 'white' }} open={false}>
            {definedDocumentItems}
            {existMandatory > 0 ? <BLabel context={context} text={this.getMessage('BusinessComponents', 'MandatoryDocument')}
              style={{
                color: context.theme.boaPalette.base300,
                backgroundColor: isMobileDevice(context) ? context.theme.boaPalette.base100 : 'white',
                fontSize: 'small',
                paddingLeft: 16,
                paddingTop: 16
              }} /> : ''}
          </List>

        </BScroll>


      </div>
    );
  }
}
