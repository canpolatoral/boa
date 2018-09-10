import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import { BComponent, BComponentComposer } from 'b-component';
import PdfViewerComponent from './PdfViewerComponent';
import Cropper from './Cropper';
import { b64toBlob, isMobileDevice } from './Constants';
// import ZoomableImage from 'react-zoomable-image';
import { PinchView } from 'react-pinch-zoom-pan';
// import { ReactPinchPanZoom } from 'react-pinch-zoom-pan';

@BComponentComposer
export default class DocumentViewer extends BComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BComponent.props,
    /**
     * Indicates the file content.
     */
    fileContent: PropTypes.string,
    /**
     * Indicates the file content.
     */
    mimeType: PropTypes.string,
    /**
     * Indicates the file extension.
     */
    fileExtension: PropTypes.string,
    /**
     * Indicates the file server object id.
     */
    fileServerObjectId: PropTypes.string,
    /**
     * Indicates the document container height.
     */
    documentContainerHeight: PropTypes.number,
    /**
     * The event to handle status changing on crop.
     */
    onCropSuccess: PropTypes.func
  };

  static defaultProps = {
    /**
     * Base default properties from BComponent.
     */
    ...BComponent.defaultProps
  };

  state = {
    objectDataUrl: null,
    documentContainerHeight: null,
    exDocumentContainerHeight: null,
    zoomed: false
  };

  /**
   * returns base64 string content of cropped picture.
   */
  getCroppedImageData() {
    return this.cropper.getInstance().getCroppedBase64Image();
  }

  handleCropSuccess(args) {
    this.props.onCropSuccess && this.props.onCropSuccess({
      success: args.success
    });
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.fileServerObjectId !== this.props.fileServerObjectId && (/\.(pdf)$/i).test(nextProps.fileExtension)) {
      if (this.state.objectDataUrl) {
        URL.revokeObjectURL(this.state.objectDataUrl);
      }

      let blobData = b64toBlob(nextProps.fileContent, nextProps.mimeType);
      this.setState({ objectDataUrl: URL.createObjectURL(blobData) });
    }
    this.setState({ exDocumentContainerHeight: this.props.documentContainerHeight });
    if (nextProps.documentContainerHeight !== this.props.documentContainerHeight) {
      this.setState({ documentContainerHeight: nextProps.documentContainerHeight });
    }
  }

  shouldComponentUpdate(nextProps) {
    super.shouldComponentUpdate(nextProps);

    return nextProps.fileServerObjectId !== this.props.fileServerObjectId || nextProps.documentContainerHeight !== this.props.documentContainerHeight;
  }

  /* Use the css padding-top to make the container as high as inner content */
  getContainerStyle(ratio) {
    return {
      paddingTop: ratio.toFixed(2) + '%',
      overflow: 'hidden',
      position: 'relative'
    };
  }

  /* Position inner content absolute */
  getInnerStyle() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
  }

  onDblClick = (e) => {
    e.preventDefault();
    this.setState({ zoomed: !this.state.zoomed });
  }

  renderPinchview(base64Content) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto 1em' }}>
        <PinchView backgroundColor='#ddd' initalScale={2} maxScale={4} containerRatio={100}>
          <img src={base64Content} style={{
            margin: 'auto',
            width: '100%',
            height: '100%'
          }} />
        </PinchView>
      </div>
    );
  }

  render() {
    const { fileContent, mimeType, fileExtension, fileServerObjectId, context } = this.props;
    if (fileContent && fileExtension) {
      if ((/\.(gif|jpg|jpeg|png)$/i).test(fileExtension)) {
        let base64Content = 'data:image/jpeg;base64,' + fileContent;
        return (
          isMobileDevice(this.props.context) ?
            this.renderPinchview(base64Content)
            :
            <Cropper ref={r => this.cropper = r} imgUrl={base64Content}
              onCropSuccess={this.handleCropSuccess.bind(this)} />
        );
      }

      if ((/\.(pdf)$/i).test(fileExtension)) {
        if (!this.state.objectDataUrl) {
          let blobData = b64toBlob(fileContent, mimeType);
          this.state.objectDataUrl = URL.createObjectURL(blobData);
        }

        return (<PdfViewerComponent context={context} fileUrl={this.state.objectDataUrl}
          pdfContainerHeight={this.state.documentContainerHeight} />);
      }

      let blobData = b64toBlob(fileContent, mimeType);

      if ((/\.(txt)$/i).test(fileExtension) && (this.state.exDocumentContainerHeight == this.props.documentContainerHeight))
        FileSaver.saveAs(blobData, fileServerObjectId + fileExtension);
    }

    return null;
  }
}
