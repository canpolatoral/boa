import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BSpan extends BComponent {
  constructor(props, context) {
    super(props, context);

    let minFontSize = this._parseFontSize(this.props.minFontSize);
    let maxFontSize = this._parseFontSize(this.props.maxFontSize);
    let fontSize = 12;
    if (minFontSize && minFontSize > fontSize) {
      fontSize = minFontSize;
    }
    if (maxFontSize && maxFontSize < fontSize) {
      fontSize = maxFontSize;
    }

    this.state = {
      fontSize: fontSize + 'px'
    };
  }

  static propTypes = {
    ...BComponent.propTypes,
    text: PropTypes.string,
    style: PropTypes.object,
    maxWidth: PropTypes.number,
    minFontSize: PropTypes.number,
    maxFontSize: PropTypes.number,
    textAlign: PropTypes.string
  };

  static defaultProps = {
    minFontSize: Number.NEGATIVE_INFINITY,
    maxFontSize: Number.POSITIVE_INFINITY
  };

  _parseFontSize(fontSize) {
    if (fontSize && (typeof fontSize === 'number' || (typeof fontSize === 'string' && fontSize.length > 0))) {
      if (typeof fontSize === 'string') {
        return parseFloat(fontSize.replace(/[a-zA-Z\s]/gi, ''));
      }

      return fontSize;
    }

    return null;
  }

  // componentDidMount() {
  //   this._checkLabelFontSize(this.props);
  // }

  // componentWillReceiveProps(nextProps) {
  //   this._checkLabelFontSize(nextProps);
  // }

  // _checkLabelFontSize(props) {
  //   if (props.maxWidth && this.label && this.label.offsetWidth > props.maxWidth) {
  //     let currentFontSize = this._parseFontSize(this.label.style && this.label.style.fontSize) || 12;
  //     let minFontSize = this._parseFontSize(props.minFontSize);
  //     let maxFontSize = this._parseFontSize(props.maxFontSize);

  //     let newFontSize = currentFontSize * props.maxWidth / this.label.offsetWidth;
  //     newFontSize = Math.max(Math.min(newFontSize, maxFontSize), minFontSize);
  //     this.setState({ fontSize: newFontSize + 'px' });
  //   }
  // }

  render() {
    let styleDiv;
    let style = Object.assign({ fontSize: this.state.fontSize }, this.props.context.theme.label, this.props.style);
    if (!this.props.context.localization.isRightToLeft) {
      if (this.props.maxWidth) {
        styleDiv = { textAlign: 'left', width: this.props.maxWidth + 'px' };
      } else {
        styleDiv = { textAlign: 'left' };
      }
    } else {
      if (this.props.maxWidth) {
        styleDiv = { textAlign: 'right', width: this.props.maxWidth + 'px' };
      } else {
        styleDiv = { textAlign: 'right' };
      }
    }

    this.props.textAlign && Object.assign(styleDiv, { textAlign: this.props.textAlign });

    return (
      <span style={Object.assign(styleDiv, style)}>{this.props.text}</span>
      // <div style={Object.assign(styleDiv, style)}>
      //   <label ref={r => (this.label = r)}>{this.props.text}</label>
      // </div>
    );
  }
}
export default BSpan;
