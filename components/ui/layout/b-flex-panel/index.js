import PropTypes from 'prop-types';
import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';
@BComponentComposer
export class BFlexPanel extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    style: PropTypes.object,
    children: PropTypes.node,
    responsive: PropTypes.bool,
    /* Tüm nesneleri kapsayan içeriği dikey eksende hizalamak için kullanılır. */
    alignContent: PropTypes.oneOf(['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'stretch']),
    /* Sadece bir satırdaki nesneleri dikey eksende hizalamak için kullanılır. */
    alignItems: PropTypes.oneOf(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    alignment: PropTypes.oneOf(['center', 'left', 'right', 'spaceBetween', 'spaceAround']),
    isReverse: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    direction: 'horizontal',
    responsive: true,
    alignment: 'left'
  };

  constructor(props, context) {
    super(props, context);
  }

  getValue() {
    return this.state;
  }

  setValue(value) {
    this.setState({ ...value });
  }

  convertToJustifyContent(justifyContent) {
    switch (justifyContent) {
      case 'center':
        return 'center';
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      case 'spaceBetween':
        return 'space-between';
      case 'spaceAround':
        return 'space-around';
      default:
        return justifyContent;
    }
  }

  render() {
    var flexStyle = {};
    if (this.props.style) {
      flexStyle = this.props.style;
    }

    flexStyle.display = 'flex';

    flexStyle.flexDirection = 'row';
    if (this.props.direction == 'vertical') {
      flexStyle.flexDirection = 'column';
    }
    if (this.props.isReverse) {
      flexStyle.flexDirection = flexStyle.flexDirection+'-reverse';
    }

    flexStyle.flexWrap = 'wrap';
    if (!this.props.responsive) {
      flexStyle.flexWrap = 'nowrap';
    }

    flexStyle.justifyContent = this.convertToJustifyContent(this.props.alignment);
    if (this.props.alignContent) {
      flexStyle.alignContent = this.props.alignContent;
    }
    if (this.props.alignItems) {
      flexStyle.alignItems = this.props.alignItems;
    }

    return (
      <div style={flexStyle}>
        {this.props.children}
      </div>
    );
  }

}

export default BFlexPanel;
