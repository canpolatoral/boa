import React from 'react';
import PropTypes from 'prop-types';
import { ComponentBase, ComponentComposer, Utils } from 'b-component';

@ComponentComposer
class LinearPanel extends ComponentBase {

  static propTypes = {
    /**
     * Child elements that will be in Linear Panel.
     */
    children: PropTypes.node,
    /**
     * disable or not for child elements.
     */
    disabled: PropTypes.bool,
    /**
     * Number of px for the padding/spacing between items.
     */
    padding: PropTypes.number,
    /**
     * Orientation of child elements in panel.
     */
    orientation: PropTypes.oneOf(['vertical', 'horizontal']),
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    padding: 4,
    orientation: 'vertical'
  };

  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    super.componentWillMount();
    this.setState({ value: this.props.value, disabled: this.props.disabled });
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.setState({ disabled: nextProps.disabled });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  getStyles(props) {
    return {
      root: {
        display: 'flex',
        flexDirection : props.orientation === 'vertical' ? 'column' : 'row',
        margin: -props.padding / 2,
        overflow: 'hidden',
        // height: 'auto'
      },
      item: {
        boxSizing: 'border-box',
        padding: props.padding / 2,
      },
    };
  }

  render() {
    const styles = this.getStyles(this.props, this.context);
    const mergedRootStyles = Object.assign(styles.root, this.props.style);

    const childs = Utils.getFormChildren(this.props.children, this.state.disabled);
    const wrappedChildren = React.Children.map(childs, (currentChild) => {
      if (React.isValidElement(currentChild) && currentChild.type.muiName === 'Subheader') {
        return currentChild;
      }
      const itemStyle = Object.assign({}, styles.item, {
        width: 'auto',
        height: 'auto',
        display: 'inline-table'
      });

      return <div style={itemStyle}>{currentChild}</div>;
    });

    return (
      <div style={mergedRootStyles}>
        {wrappedChildren}
      </div>
    );
  }
}

export default LinearPanel;
