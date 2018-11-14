/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import { ComponentBase } from '@boa/base';
import styles from './styles';

/**
 * Code documentation component
 */
class DocCode extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    /**
     * Code that will be highlighted.
     */
    content: PropTypes.string.isRequired,
    /**
     * Editor type that will be colored
     */
    editorType: PropTypes.oneOf([
      'androidStudio',
      'atomOneDark',
      'atomOneLight',
      'github',
      'monokaiSublime',
      'raiinbow',
      'vs',
      'xcode',
    ]),
    /**
     * If `true`, the code will be highlighted.
     */
    highlight: PropTypes.bool,
    /**
     * Code language.
     */
    lang: PropTypes.string,
  };

  static defaultProps = {
    content: "console.log('Hello world');",
    lang: 'js',
    highlight: true,
    editorType: 'github',
  };

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.getMarkup() }} />;
  }

  getMarkup() {
    const { lang, highlight, content } = this.props;
    const language = hljs.getLanguage(lang);
    let contentHighlighted;
    if (highlight && language) {
      contentHighlighted = hljs.highlight(lang, content).value;
    } else if (highlight) {
      contentHighlighted = hljs.highlightAuto(this.props.content).value;
    } else {
      contentHighlighted = content;
    }

    const css = this.props.highlight ? this.getHighlightCSS() : null;

    return `
      <pre>
        <code class="hljs">${contentHighlighted}</code>
      </pre>
      ${css}
    `;
  }

  getHighlightCSS() {
    const codeStyle = styles[this.props.editorType] || styles.xcode;
    return `
      <style>
        ${codeStyle}
      </style>
    `;
  }
}

export default DocCode;
