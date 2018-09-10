import React from 'react';
import PropTypes from 'prop-types';
import {BComponent, BComponentComposer} from 'b-component';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

@BComponentComposer
export default class Cropper extends BComponent {

  static propTypes = {
    /**
     * Base properties from BComponent.
     */
    ...BComponent.props,
    /**
     * Indicate the img Url.
     */
    imgUrl: PropTypes.string,
    /**
     * The event to handle crop success status.
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
    crop: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    pixelCrop: null
  };

  /**
   * returns cropped image as Base64 string
   */
  getCroppedBase64Image() {
    let pixelCrop = this.state.pixelCrop;
    if (!pixelCrop) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = this.props.imgUrl;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    this.setState({crop: {x: 0, y: 0, width: 0, height: 0}});
    return canvas.toDataURL('image/jpeg').split(',').pop();
  }

  onChange = (crop) => {
    this.setState({crop: crop});
  };

  onCropComplete = (crop, pixelCrop) => {
    this.state.pixelCrop = pixelCrop;
    this.props.onCropSuccess && this.props.onCropSuccess({
      success: pixelCrop.width > 0 && pixelCrop.height > 0
    });
  };

  render() {
    return (
      <ReactCrop crop={this.state.crop} src={this.props.imgUrl}
                 onChange={this.onChange} onComplete={this.onCropComplete}/>
    );
  }
}
