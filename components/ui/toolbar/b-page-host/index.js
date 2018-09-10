import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';

export class BPageHost extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    leftDrawerWidth: PropTypes.number,
    rightDrawerWidth: PropTypes.number
  };

  static defaultProps = {
    ...BComponent.defaultProps
  };

  constructor(props, context) {
    super(props, context);
    if (props.content) {
      this.state = { content: Object.assign({}, props.content), style: Object.assign({}, props.style) };
    } else {
      this.state = { content: null, style: Object.assign({}, props.style) };
    }
    this.changePage = this.changePage.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.leftDrawerWidth != this.props.leftDrawerWidth || nextProps.rightDrawerWidth != this.props.rightDrawerWidth) {
      let formStyle = { position: 'fixed', left: nextProps.leftDrawerWidth, right: nextProps.rightDrawerWidth, top: 120, bottom: 0 };
      this.changeStyle(formStyle);
    }

    if (nextProps.content != this.props.content) {
      this.changePage(nextProps.content);
    }
  }

  changePage(children) {
    this.setState({ content: children });
  }

  changeStyle(style) {
    if (!this.props.context.localization.isRightToLeft) {
      this.setState({ style: Object.assign({}, style) });
    } else {
      this.setState({ style: Object.assign({}, style, { textAlign: 'right' }) });
    }
  }

  render() {
    return (
      <div>
        <div style={this.state.style}>{this.state.content}</div>
        <div id="snack-bar-element-instance" />
      </div>
    );
  }
}

BPageHost.propTypes = {
  content: PropTypes.object,
  style: PropTypes.object
};

export default BPageHost;
