import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BScroll } from 'b-scroll';

import Common from './common';

@BComponentComposer
export class BFileInput extends BComponent {

  static propTypes = {
    /**
    * Base properties from BComponent.
    */
    ...BComponent.props,
    /**
    * Indicates the file with format.
    */
    as: PropTypes.oneOf(['binary', 'buffer', 'text', 'url']),
    /**
    * Indicates the div style.
    */
    children: PropTypes.any,
    /**
    * Callback function after all files have been read.
    */
    onChange: PropTypes.func,
    /**
    * Indicates the input id.
    */
    id: PropTypes.string,
    /**
    * The multiple parameter for Input component
    */
    multiple: PropTypes.bool
  };

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps
  };
  constructor(props, context) {
    // FileReader compatibility warning.
    super(props, context);

    // const win = typeof window === 'object' ? window : {};
    // if ((typeof window === 'object') && (!win.File || !win.FileReader || !win.FileList || !win.Blob)) {
    //   console.log(
    //     '[react-file-reader-input] Some file APIs detected as not supported.' +
    //     ' File reader functionality may not fully work.'
    //   );
    // }
  }

  handleChange = (e) => {
    const files = [];

    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }

    // Build Promise List, each promise resolved by FileReader.onload.
    Promise.all(files.map(file => new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = result => {
        // Resolve both the FileReader result and its original file.
        resolve([result, file]);
      };

      // Read the file with format based on this.props.as.
      switch ((this.props.as || 'url').toLowerCase()) {
        case 'binary': {
          reader.readAsBinaryString(file);
          break;
        }
        case 'buffer': {
          reader.readAsArrayBuffer(file);
          break;
        }
        case 'text': {
          reader.readAsText(file);
          break;
        }
        case 'url': {
          reader.readAsDataURL(file);
          break;
        }
      }
    })))
      .then(zippedResults => {
        // Run the callback after all files have been read.
        this.props.onChange(e, zippedResults);
      });
  };

  triggerInput = () => {
    this._reactFileReaderInput.click();
  };

  render() {
    const hiddenInputStyle = this.props.children ? Common.styles.fileInput : {};

    return (
      <div>
        <BScroll ref={r => this.containerScroll = r} context={this.props.context} option={{ suppressScrollX: true }}>
          <input id={this.props.id} ref={c => this._reactFileReaderInput = c} type="file"
            onChange={(event) => {
              this.handleChange(event);
            }}
            onClick={(event) => {
              event.target.value = null;
            }}
            style={hiddenInputStyle}
          />
          <div onClick={this.triggerInput}>
            {this.props.children}
          </div>
          {/* {this.props.children} */}
          {/* <input id={this.props.id} multiple={this.props.multiple}
          children={undefined} type="file"
          // onChange={this.handleChange} ref={c => this._reactFileReaderInput = c}
          style={hiddenInputStyle} /> */}
        </BScroll>
      </div>
    );
  }
}

export default BFileInput;
