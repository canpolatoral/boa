import React from 'react';
import PropTypes from 'prop-types';
import { ComponentBase, ComponentComposer } from '@boa/base';
import parseFontSize from './utils';

/**
 * Label component
*/
@ComponentComposer
class Label extends ComponentBase {
  constructor(props, context) {
    super(props, context);

    const minFontSize = parseFontSize(this.props.minFontSize);
    const maxFontSize = parseFontSize(this.props.maxFontSize);
    let fontSize = 12;
    if (minFontSize && minFontSize > fontSize) {
      fontSize = minFontSize;
    }
    if (maxFontSize && maxFontSize < fontSize) {
      fontSize = maxFontSize;
    }

    this.state = {
      fontSize: `${fontSize}px`,
    };
  }

  static propTypes = {
    /**
     * Label text
     */
    maxFontSize: PropTypes.number,
    /**
     * Override style of element.
     */
    maxWidth: PropTypes.number,
    minFontSize: PropTypes.number,
    style: PropTypes.object,
    text: PropTypes.string,
    textAlign: PropTypes.string,
  };

  static defaultProps = {
    minFontSize: Number.NEGATIVE_INFINITY,
    maxFontSize: Number.POSITIVE_INFINITY,
  };

  componentDidMount() {
    this.checkLabelFontSize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkLabelFontSize(nextProps);
  }

  checkLabelFontSize(props) {
    if (props.maxWidth && this.label && this.label.offsetWidth > props.maxWidth) {
      const currentFontSize = parseFontSize(this.label.style && this.label.style.fontSize) || 12;
      const minFontSize = parseFontSize(props.minFontSize);
      const maxFontSize = parseFontSize(props.maxFontSize);

      let newFontSize = currentFontSize * props.maxWidth / this.label.offsetWidth;
      newFontSize = Math.max(Math.min(newFontSize, maxFontSize), minFontSize);
      this.setState({ fontSize: `${newFontSize}px` });
    }
  }

  render() {
    let styleDiv;
    const style = Object.assign({
      fontSize: this.state.fontSize,
    }, this.props.context.theme.label, this.props.style);
    if (!this.props.context.localization.isRightToLeft) {
      if (this.props.maxWidth) {
        styleDiv = { textAlign: 'left', width: `${this.props.maxWidth}px` };
      } else {
        styleDiv = { textAlign: 'left' };
      }
    } else if (this.props.maxWidth) {
      styleDiv = { textAlign: 'right', width: `${this.props.maxWidth}px` };
    } else {
      styleDiv = { textAlign: 'right' };
    }

    if (this.props.textAlign) {
      Object.assign(styleDiv, { textAlign: this.props.textAlign });
    }

    return (
      <div style={Object.assign(styleDiv, style)}>
        <label ref={(r) => { (this.label = r); }}>{this.props.text}</label>
      </div>
    );
  }
}
export default Label;
