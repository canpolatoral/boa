import React from 'react';
import PropTypes from 'prop-types';
import { VelocityTransitionGroup } from 'velocity-react';
import NodeHeader from './header';

class TreeNode extends React.Component {
  static propTypes = {
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]).isRequired,
    column1: PropTypes.string,
    column2: PropTypes.string,
    column3: PropTypes.string,
    column4: PropTypes.string,
    columnsMaxLenght: PropTypes.number,
    decorators: PropTypes.object.isRequired,
    editableColumn1: PropTypes.bool,
    editableColumn2: PropTypes.bool,
    editableColumn3: PropTypes.bool,
    editableColumn4: PropTypes.bool,
    isRightToLeft: PropTypes.bool,
    node: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onToggle: PropTypes.func,
    style: PropTypes.object.isRequired,
    type: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const toggled = !this.props.node.toggled;
    const onToggle = this.props.onToggle;
    if (onToggle) {
      onToggle(this.props.node, toggled);
    }
  }

  animations() {
    const props = this.props;
    if (props.animations === false) {
      return false;
    }
    const anim = Object.assign({}, props.animations, props.node.animations);
    return {
      toggle: anim.toggle(this.props),
      drawer: anim.drawer(this.props),
    };
  }

  decorators() {
    // Merge Any Node Based Decorators Into The Pack
    const props = this.props;
    const nodeDecorators = props.node.decorators || {};
    return Object.assign({}, props.decorators, nodeDecorators);
  }

  eventBubbles() {
    return { onToggle: this.props.onToggle };
  }

  renderDrawer(decorators, animations) {
    const toggled = this.props.node.toggled;
    if (!animations && !toggled) {
      return null;
    }
    if (!animations && toggled) {
      return this.renderChildren(decorators, animations);
    }
    return (
      <VelocityTransitionGroup {...animations.drawer} ref="velocity">
        {toggled ? this.renderChildren(decorators, animations) : null}
      </VelocityTransitionGroup>
    );
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
        onChange={this.props.onChange}
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
      <ul style={subTreeStyle} ref="subtree">
        {children.map((child, index) =>
          <TreeNode
            context={this.props.context}
            {...this.eventBubbles()}
            key={child.id || index}
            node={child}
            decorators={this.props.decorators}
            animations={this.props.animations}
            style={this.props.style}
            index={index}
            onChange={this.props.onChange}
            isRightToLeft={this.props.isRightToLeft} />,
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
          <decorators.Loading style={this.props.style.loading} />
        </li>
      </ul>
    );
  }

  render() {
    const decorators = this.decorators();
    const animations = this.animations();
    const theme = this.props.context.theme;
    return (
      <li
        style={Object.assign({
          borderTop: this.props.index === 0 ? '0 px' : `1px solid ${theme.boaPalette.base200}`,
          borderLeft: this.props.isRightToLeft ? null : `1px solid ${theme.boaPalette.base200}`,
          borderRight: this.props.isRightToLeft ? `1px solid ${theme.boaPalette.base200}` : null,
        }, this.props.style.base)}
        ref="topLevel">
        {this.renderHeader(decorators, animations)}
        {this.renderDrawer(decorators, animations)}
      </li>
    );
  }
}

export default TreeNode;
