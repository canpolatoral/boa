import React from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import shallowEqual from 'shallowequal';

class NodeHeader extends React.Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    node: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    isRightToLeft: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
  }

  shouldComponentUpdate(nextProps) {
    const props = this.props;
    const nextPropKeys = Object.keys(nextProps);
    for (let i = 0; i < nextPropKeys.length; i++) {
      const key = nextPropKeys[i];
      if (key === 'animations') {
        continue;
      }
      const isEqual = shallowEqual(props[key], nextProps[key]);
      if (!isEqual) {
        return true;
      }
    }
    return !deepEqual(props.animations, nextProps.animations, {strict: true});
  }

  render() {
    const {style, decorators} = this.props;
    const terminal = !this.props.node.children;
    const active = this.props.node.active;
    const container = [style.link, active ? style.link : null];
    const headerStyles = Object.assign({container}, this.props.style);

    return (
      <decorators.Container
        context={this.props.context}
        style={headerStyles}
        decorators={decorators}
        terminal={terminal}
        onClick={this.props.onClick}
        animations={this.props.animations}
        node={this.props.node}
        isRightToLeft={this.props.isRightToLeft}
      />
    );
  }
}

export default NodeHeader;
