import React, { Component } from 'react';
import { getTheme } from '../src/base/b-theme';
import { BAppProvider } from '../src/base/b-component';


var context = {};
context.theme = getTheme({ themeName: 'violet' });
context.localization = [];
context.localization.isRightToLeft = false;

export default class Container extends Component {
  render() {
    const { story } = this.props;
    return (
      <BAppProvider theme={context.theme}>
        {story()}
      </BAppProvider>
    );
  }
}

