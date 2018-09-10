import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';

export class BImage extends BComponent {
  static defaultProps = {
    src: ''
  };

  static propTypes = {
    /**
     * If true, the `Divider` will be indented.
     */
    src: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <img src={this.props.src} style={this.props.style} />;
  }
}

export default BImage;
