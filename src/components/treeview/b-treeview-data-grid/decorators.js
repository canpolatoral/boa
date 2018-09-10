import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
// import {ContentAdd, ContentRemove} from '@material-ui/core/svg-icons';

import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';

const Loading = (props) => {
  return (
    <div style={props.style}>
      loading...
    </div>
  );
};

Loading.propTypes = {
  style: PropTypes.object
};

const Header = (props) => {
  const style = props.style;
  return (
    <div style={style.base}>
      <div style={style.title}>
        {props.node.name}
      </div>
    </div>
  );
};

Header.propTypes = {
  style: PropTypes.object,
  node: PropTypes.object.isRequired,
  isRightToLeft: PropTypes.bool
};

@Radium
class Container extends React.Component {

  static propTypes = {
    style: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    terminal: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    node: PropTypes.object.isRequired,
    isRightToLeft: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {style, decorators, onClick, node} = this.props;

    let iconStyle;
    if (this.props.isRightToLeft) {
      iconStyle = {
        marginLeft: '5px',
        marginTop: '2px',
        color: this.props.context.theme.boaPalette.base400,
        marginBottom: '-5px',
        width: '20px',
        height: '20px'
      };
    }
    else {
      iconStyle = {
        marginRight: '5px',
        marginTop: '2px',
        color: this.props.context.theme.boaPalette.base400,
        marginBottom: '-5px',
        width: '20px',
        height: '20px'
      };
    }
    let iconType = <Add style={iconStyle}/>;
    if (node.toggled)
      iconType = <Remove style={iconStyle}/>;

    let content =
      <div>
        { iconType }
        <decorators.Header
          node={node}
          style={style.header}
          isRightToLeft={this.props.isRightToLeft}
          context={this.props.context}
        />
      </div>;

    if (!node.children)
      content =
        <div>
          <decorators.Header
            node={node}
            style={style.header}
            isRightToLeft={this.props.isRightToLeft}
            context={this.props.context}
          />
        </div>;
    if (this.props.isRightToLeft) {
      content =
        <div>
          <decorators.Header
            node={node}
            style={style.header}
            isRightToLeft={this.props.isRightToLeft}
            context={this.props.context}
          />
          { iconType }
        </div>;

      if (!node.children)
        content =
          <div>
            <decorators.Header
              node={node}
              style={style.header}
              isRightToLeft={this.props.isRightToLeft}
              context={this.props.context}
            />
          </div>;
    }

    if (node.children)
      return (
        <div
          ref="clickable"
          onClick={onClick}
          style={style.container}>
          { content }
        </div>
      );
    else
      return (
        <div
          style={style.container}>
          { content }
        </div>
      );
  }
}

export default {
  Loading,
  Header,
  Container
};
