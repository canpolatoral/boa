import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { ErrorBoundary } from './ErrorBoundary';

export class AppProvider extends Component {
  static propTypes = {
    theme: PropTypes.object,
  };

  render() {
    let muiTheme = this.props.theme || createMuiTheme();
    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          {this.props.children}
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}
