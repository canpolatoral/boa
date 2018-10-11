import React from 'react'; import PropTypes from 'prop-types';
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
     * Code language.
     */
    lang: PropTypes.string,
    /**
     * If `true`, the code will be highlighted.
     */
    highlight: PropTypes.bool,

    /**
     * Editor type that will be colored
     */
    editorType: PropTypes.oneOf('androidStudio', 'atomOneDark', 'atomOneLight', 'github', 'monokaiSublime', 'raiinbow', 'vs', 'xcode')
  };

  static defaultProps = {
    content: 'console.log(\'Hello world\');',
    lang: 'js',
    highlight: true,
    editorType: 'github'
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.getMarkup() }} />
    );
  }

  getMarkup() {
    const language = hljs.getLanguage(this.props.lang);
    const content = this.props.highlight ? language ? hljs.highlight(this.props.lang, this.props.content).value : hljs.highlightAuto(this.props.content).value : this.props.content;
    const css = this.props.highlight ? this.getHighlightCSS() : null;

    return `
      <pre>
        <code class="hljs">${content}</code>
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
