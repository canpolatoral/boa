import React from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import shallowEqual from 'shallowequal';

class NodeHeader extends React.Component {
  static propTypes = {
    animations: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    decorators: PropTypes.object.isRequired,
    isRightToLeft: PropTypes.bool,
    node: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    const props = this.props;
    const nextPropKeys = Object.keys(nextProps);
    for (let i = 0; i < nextPropKeys.length; i++) {
      const key = nextPropKeys[i];
      if (key === 'animations') {
        continue; // eslint-disable-line
      }
      const isEqual = shallowEqual(props[key], nextProps[key]);
      if (!isEqual) {
        return true;
      }
    }
    return !deepEqual(props.animations, nextProps.animations, { strict: true });
  }

  render() {
    const { style, decorators, context } = this.props; // eslint-disable-line
    const terminal = !this.props.node.children;
    const active = this.props.node.active;
    const container = [style.link, active && !this.props.node.children ? style.activeLink : null];
    const headerStyles = Object.assign({ container }, this.props.style);

    return (
      <decorators.Container
        context={context}
        style={headerStyles}
        decorators={decorators}
        terminal={terminal}
        onClick={this.props.onClick}
        onChange={this.props.onChange}
        animations={this.props.animations}
        node={this.props.node}
        isRightToLeft={this.props.isRightToLeft}
      />
    );
  }
}

export default NodeHeader;
