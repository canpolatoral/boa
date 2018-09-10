import React from 'react';
import { composeDropSource } from 'b-drag-drop';

@composeDropSource
class BDropArea extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default BDropArea;
