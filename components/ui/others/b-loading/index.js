import React from 'react';

import { BComponent, BComponentComposer } from 'b-component';
import { BProgress } from 'b-progress';

@BComponentComposer
export class BLoading extends BComponent {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { boaPalette } = this.props.context.theme;
    const divStyle = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background: boaPalette.shad400,
      zIndex: 100
    };
    const progressStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: 'auto'
    };
    return (
      <div style={divStyle}>
        <BProgress context={this.props.context} style={progressStyle} color={'secondary'} size={28} thickness={3} />
      </div>
    );
  }
}

export default BLoading;
