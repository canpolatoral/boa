import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BAvatar extends BComponent {
  static propTypes = {
    /**
     * Default prop types values from BComponent
     */
    ...BComponent.propTypes,

    alt: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    imgProps: PropTypes.object,
    sizes: PropTypes.string,
    src: PropTypes.string,
    srcSet: PropTypes.string,

    style: PropTypes.object
  };

  static defaultProps = {
    /**
     * Default prop values from BComponent
     */
    ...BComponent.defaultProps,

    component: 'div'
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <Avatar {...this.props}>{this.props.children}</Avatar>;
  }
}
export default BAvatar;
