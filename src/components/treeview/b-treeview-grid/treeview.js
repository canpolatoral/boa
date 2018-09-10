import React from 'react';
import PropTypes from 'prop-types';
import TreeNode from './node';
import defaultDecorators from './decorators';
import defaultStyle from './styles/default';
import defaultAnimations from './styles/animations';
import defaultAnimationsAr from './styles/animations-ar';

class TreeView extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    animations: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    onToggle: PropTypes.func,
    onChange: PropTypes.func,
    decorators: PropTypes.object,
    isRightToLeft: PropTypes.bool
  };

  static defaultProps = {
    style: defaultStyle,
    animations: defaultAnimations,
    decorators: defaultDecorators
  };

  constructor(props, context) {
    super(props, context);
    if (this.props.isRightToLeft) {
      this.animations = defaultAnimationsAr;
    }
    else {
      this.animations = defaultAnimations;
    }
  }

  getValues() {
    return this.props.data;
  }

  render() {
    let data = this.props.data;
    if (!Array.isArray(data)) {
      data = [data];
    }
    let baseTreeStyle = Object.assign({}, this.props.style.tree.base);
    if (this.props.isRightToLeft) {
      baseTreeStyle = Object.assign({ textAlign: 'right' }, this.props.style.tree.base);
    }

    return (
      <ul style={baseTreeStyle} ref="treeBase">
        {
          data.map((node, index) =>
            <TreeNode
              context={this.props.context}
              key={node.id || index}
              node={node}
              onToggle={this.props.onToggle}
              onChange={this.props.onChange}
              animations={this.animations}
              decorators={this.props.decorators}
              style={this.props.style.tree.node}
              isRightToLeft={this.props.isRightToLeft}
            />
        )}
      </ul>
    );
  }
}

export default TreeView;
