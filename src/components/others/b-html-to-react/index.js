import React from 'react'; import PropTypes from 'prop-types';

import { BComponent } from 'b-component';

export class BHtmlToReact extends BComponent {

  static propTypes = {
    html: PropTypes.string,
    style: PropTypes.object
  }

  render() {
    return (
      <div style={this.props.style} dangerouslySetInnerHTML={{__html: this.props.html}} /> 
    );
  }
}

export default BHtmlToReact;
