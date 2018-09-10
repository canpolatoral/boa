import React from 'react';
import PropTypes from 'prop-types';
import {VelocityTransitionGroup} from 'velocity-react';
import NodeHeader from './header';
import {Platforms} from 'b-component';

class TreeNode extends React.Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    onToggle: PropTypes.func,
    isRightToLeft: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    let toggled = !this.props.node.toggled;
    let onToggle = this.props.onToggle;
    if (onToggle) {
      onToggle(this.props.node, toggled);
    }
  }

  animations() {
    const props = this.props;
    if (props.animations === false) {
      return false;
    }
    let anim = Object.assign({}, props.animations, props.node.animations);
    return {
      toggle: anim.toggle(this.props),
      drawer: anim.drawer(this.props)
    };
  }

  decorators() {
    // Merge Any Node Based Decorators Into The Pack
    const props = this.props;
    let nodeDecorators = props.node.decorators || {};
    return Object.assign({}, props.decorators, nodeDecorators);
  }

  render() {
    const decorators = this.decorators();
    const animations = this.animations();
    return (
      <li style={Object.assign({},  this.props.style.base)} ref="topLevel">
        {this.renderHeader(decorators, animations)}
        {this.renderDrawer(decorators, animations)}
      </li>
    );
  }

  renderDrawer(decorators, animations) {
    const toggled = this.props.node.toggled;
    if (!animations && !toggled) {
      return null;
    }
    if (!animations && toggled) {
      return this.renderChildren(decorators, animations);
    }
    if (this.props.context.platform == Platforms.MOBILE) { // mobil versiyonda animasyon sorununu önlemek için geçici olarak konulmuştur. bileşen komple elden geçirilmelidir. (coral)
      return toggled && this.renderChildren(decorators, animations);
    } else {
      return (
        <VelocityTransitionGroup {...animations.drawer} ref="velocity">
          {toggled ? this.renderChildren(decorators, animations) : null}
        </VelocityTransitionGroup>
      );
    }
  }

  renderHeader(decorators, animations) {
    return (
      <NodeHeader
        context={this.props.context}
        decorators={decorators}
        animations={animations}
        style={this.props.style}
        node={Object.assign({}, this.props.node)}
        onClick={this.onClick}
        isRightToLeft={this.props.isRightToLeft} />
    );
  }

  renderChildren(decorators) {
    if (this.props.node.loading) {
      return this.renderLoading(decorators);
    }
    let children = this.props.node.children;
    if (!Array.isArray(children)) {
      children = children ? [children] : [];
    }
    let subTreeStyle = this.props.style.subtree;
    if (this.props.isRightToLeft) {
      subTreeStyle = this.props.style.subtreeRight;
    }
    return (
      <ul style={Object.assign({}, {marginBottom: '24px'}, subTreeStyle)} ref="subtree">
        {children.map((child, index) =>
          <TreeNode
            {...this._eventBubbles()}
            context={this.props.context}
            key={child.id || index}
            node={child}
            decorators={this.props.decorators}
            animations={this.props.animations}
            style={this.props.style}
            isRightToLeft={this.props.isRightToLeft} />
        )}
      </ul>
    );
  }

  renderLoading(decorators) {
    let subTreeStyle = this.props.style.subtree;
    if (this.props.isRightToLeft) {
      subTreeStyle = this.props.style.subtreeRight;
    }
    return (
      <ul style={subTreeStyle}>
        <li>
          <decorators.Loading style={this.props.style.loading}/>
        </li>
      </ul>
    );
  }

  _eventBubbles() {
    return {onToggle: this.props.onToggle};
  }
}

export default TreeNode;
