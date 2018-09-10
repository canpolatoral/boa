import React from 'react'; import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import marked from './marked';
import CodeStyles from './code-style';
import { BComponent } from 'b-component';
let editorTypes = ['androidStudio', 'atomOneDark', 'atomOneLight', 'github', 'monokaiSublime', 'rainbow', 'vs', 'xcode'];

export class BDocViewer extends BComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    editorType: PropTypes.oneOf(editorTypes)
  };

  static defaultProps = {
    content: '',
    editorType: 'atomOneDark'
  };

  static getTableOfContent(source) {
    var cap;
    var src = source.replace(/^ +$/gm, '');
    var exp = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/;
    var tokens = [];
    while (src) {
      cap = exp.exec(src);
      if (cap) {
        src = src.substring(cap[0].length);
        tokens.push({
          level: cap[1].length,
          content: cap[2],
          id: cap[2].toString().toLowerCase().trim().replace(/&/g, '-and-').replace(/[\s\W-]+/g, '-')
          // id: cap[2].trim().toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s/g, '-').replace(/\-+$/, '')
          // id: cap[2].toLowerCase().replace(/[^\w]+/g, '-')
        });
        continue;
      }
      src = src.replace(/.*/, '').substr(1);
    }
    return tokens;
  }

  state = {
    editorType: this.props.editorType
  }

  constructor(props, context) {
    super(props, context);
    marked.setOptions({
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, str).value;
        } else {
          return hljs.highlightAuto(str).value;
        }
      },
      context: props.context
    });
    this.changeEditorType = this.changeEditorType.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editorType !== nextProps.editorType) {
      this.setState({ editorType: nextProps.editorType });
    }
  }

  changeEditorType(event) {
    this.setState({ editorType: event.target.value });
  }

  render() {
    marked.setOptions({
      context: this.props.context
    });
    marked.setEditorTypes(editorTypes);
    marked.setEditorType(this.state.editorType);
    let rawMarkup = marked(this.props.content);
    rawMarkup = this.getStyle() + rawMarkup;
    return (
      <div style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: rawMarkup }}
        onInput={this.changeEditorType} />
    );
  }

  getStyle() {
    return `
    <style>
      ${CodeStyles[this.state.editorType]}
      .customPre{display:block;position:relative;background-color:transparent;border:0px solid #ccc;border-radius:0px; padding:0px; margin:0px;}
    </style>
    `;
  }

  getTableOfContent() {
    return marked.getTableOfContent();
  }

}

export default BDocViewer;
