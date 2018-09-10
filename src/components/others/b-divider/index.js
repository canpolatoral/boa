import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';

import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BDivider extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    absolute: PropTypes.bool,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The component used for the root node.
     * Either a string to use a DOM element or a component.
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * If `true`, the divider will be indented.
     */
    inset: PropTypes.bool,
    /**
     * If `true`, the divider will have a lighter color.
     */
    light: PropTypes.bool
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    absolute: false,
    component: 'hr',
    inset: false,
    light: false
  }
  constructor(props, context) {
    super(props, context);
  }

  render() {
    var innerStyle = {
      width: 'calc(100% -24)',
      marginBottom: 12,
      marginLeft: 12,
      marginRight: 12,
      marginTop: 12
    };

    const { style, ...props } = this.props;
    innerStyle = Object.assign(innerStyle, style);

    return (
      <Divider
        style={innerStyle}
        {...props}
      />
    );
  }
}

export default BDivider;
