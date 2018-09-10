import React from 'react';
import PropTypes from 'prop-types';

import { BBusinessComponent } from 'b-business-component';
import { BThemeProvider } from 'b-component';
import { getProxy } from 'b-proxy';

export class BFrame extends BBusinessComponent {
  static propTypes = {
    url: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isAuthorized: true,
      errorMessage: ''
    };
  }

  componentDidMount() {
    let promise = getProxy().callManual({
      servicePath: 'connect/report',
      data: {
        reportUrl: this.props.url
      },
      method: 'POST'
    });
    promise.then((result) => {
      if (result && result.data) {
        this.state({ isAuthorized: true, errorMessage: '' });
      } 
    }, (error) => {
      this.state({ isAuthorized: false, errorMessage: error });
    });
  }

  render() {

    return (
      <BThemeProvider theme={this.props.context.theme}>
        {
          this.state.isAuthorized ?
            <iframe url={this.props.url}></iframe> :
            <h2>Bu rapora eişim yetkiniz bulunmamaktadır. {this.state.errorMessage}</h2>
        }
      </BThemeProvider>
    );
  }
}

export default BFrame;
