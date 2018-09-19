import React, { Component } from 'react';
import { BAppProvider } from '../src/base/b-component';

export default class Container extends Component {
  render() {
    const { story, context } = this.props;
    return (
      <BAppProvider theme={context.theme}>
        {this.props.children}
      </BAppProvider>
    );
  }
}

