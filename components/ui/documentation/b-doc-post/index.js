import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';

export class BDocPost extends BComponent {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    title: PropTypes.string,
    titleHint: PropTypes.string,
    subTitle: PropTypes.string,
    content: PropTypes.string,
    documentLinkElement: PropTypes.node,
    imgUrl: PropTypes.string
  }

  static defaultProps = {
    title: 'Title',
    titleHint: 'Title Hint',
    subTitle: 'Sub Title',
    content: 'Content',
    documentLinkElement: null,
    imgUrl: ''
  }

  getLinkStyle() {
    return {
      textDecoration: 'none',
      textOverflow: 'ellipsis',
      fontWeight: 'bold',
      fontSize: 14,
      color: this.props.context.theme.palette.textColor,
      overflow: 'hidden',
      userSelect: 'none',
      lineHeight: '16px',
      cursor: 'pointer'
    };
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', whiteSpace: 'pre-wrap', flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-block', flex: 1, minWidth: 300 }}>
          <div style={{ fontSize: 16 }}><label>{this.props.subTitle}</label></div>
          <h1 style={{ marginTop: 10, marginBottom: 10, marginRight: this.props.titleHint ? 10 : 0, fontSize: 40, fontWeight: 'bold', display: 'inline-block' }}>
            {this.props.title}
          </h1>
          {this.props.titleHint &&
            <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 24, fontWeight: 'bold', color: this.props.context.theme.boaPalette.base300, display: 'inline-block' }}>
              {this.props.titleHint}
            </h1>
          }
          <div style={{ display: 'block', fontSize: 14 }}>
            <div>
              <label>{this.props.content}</label>
            </div>
            <div style={{ marginTop: 20 }} >
              <label style={this.getLinkStyle()} >
                {this.props.documentLinkElement} </label>
            </div>
          </div>
        </div>
        <div style={{ display: 'inline-block', margin: 10, flex: 0 }}>
          <img src={this.props.imgUrl} style={{ maxWidth: 300, maxHeight: 300 }} />
        </div>
      </div>
    );
  }
}

export default BDocPost;
