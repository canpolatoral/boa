/* eslint-disable react/prefer-stateless-function */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from './ErrorBoundary';

export default class AppProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.object,
  };

  render() {
    const muiTheme = this.props.theme || createMuiTheme();
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
