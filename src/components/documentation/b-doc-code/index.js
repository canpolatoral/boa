import React from 'react'; import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import styles from './highlight-styles';
import { BComponent } from 'b-component';

export class BDocCode extends BComponent {

  static propTypes = {
    content: PropTypes.string.isRequired,
    lang: PropTypes.string,
    highlight: PropTypes.bool,
    editorType: PropTypes.string
  };

  static defaultProps = {
    highlight: true,
    editorType: 'atomOneDark'
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.getMarkup()}} />
    );
  }

  getMarkup() {
    const language = hljs.getLanguage(this.props.lang);
    const content = this.props.highlight ?  language ? hljs.highlight(this.props.lang, this.props.content).value : hljs.highlightAuto(this.props.content).value : this.props.content;
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

export default BDocCode;
