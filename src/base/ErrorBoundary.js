import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error: error, info: info, open: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info); // client exception log
  }

  handleClose = value => {
    this.setState({ value, open: false });
  };

  showErrorDialog(error) {
    return (
      <Dialog
        open={this.state.open}
        // onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{error.message}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error.stack}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    if (this.state.hasError) {

      // You can render any custom fallback UI
      // eslint-disable-next-line no-console
      console.log('Error Occured: ', this.state.error);
      // eslint-enable-next-line no-console
      return this.showErrorDialog(this.state.error);
      // return <h1>Something went wrong. {this.state.error}</h1>;

    } else {
      return this.props.children;
    }
  }
}
