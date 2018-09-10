import React from 'react';
import PropTypes from 'prop-types';

import { BComponent } from 'b-component';
import { getProxy } from 'b-proxy';
import * as BUIProxy from 'b-ui-proxy';
import { BProgress } from 'b-progress';

function ServiceCallAbortSignal() { }

export class BBusinessComponent extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    serviceCallLoader: PropTypes.string
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    serviceCallLoader: 'circular'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false
    };
    this.serviceCalls = [];
  }

  /* eslint-disable no-unused-vars */
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
  }

  componentWillMount() {
    super.componentWillMount();
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate(nextProps, nextState);
  }
  /* eslint-enable no-unused-vars */

  componentWillUnmount() { }


  getLoader() {
    if (this.props.serviceCallLoader && this.state.isLoading) {
      if (this.props.serviceCallLoader === 'linear') {
        return (
          <BProgress context={this.props.context}
            size={20}
            progressType={'linear'}
            mode={'indeterminate'} />
        );
      }
      else if (this.props.serviceCallLoader === 'circular') {
        return (
          <BProgress context={this.props.context}
            size={20}
            progressType={'circular'}
            mode={'indeterminate'} />
        );
      }
    }
    return null;
  }

  /* Proxy Executer */

  getSnapKey(childSnapKey) {
    return this.props.snapKey ? `${this.props.snapKey}_${childSnapKey}` : childSnapKey;
  }

  prepareRequestBag(proxyRequest) {
    proxyRequest.componentRef = this;
    proxyRequest.snapKey = this.props.snapKey;
    if (this.props.dialogKey) {
      proxyRequest.showProgress = false;
      proxyRequest.dialogKey = this.props.dialogKey;
    }
    // this.setState({ isLoading: true });
  }

  inProd() { return process.env.NODE_ENV == 'production'; }

  proxyExecute(proxyRequest, callback) {
    this.prepareRequestBag(proxyRequest);
    if (callback) {
      proxyRequest.params = proxyRequest.params || {}; // params üzerinde callback tutuldu. params taşındığından.
      proxyRequest.params.callback = callback;
    }
    this.inProd() ? BUIProxy.proxyExecute(proxyRequest) : this._proxyCallDev(proxyRequest);
  }

  proxyFreeExecute(proxyRequest) {
    this.prepareRequestBag(proxyRequest);
    this.inProd() ? BUIProxy.proxyExecute(proxyRequest) : this._proxyCallDev(proxyRequest);
  }

  proxyMultipleExecute(proxyRequest) {
    this.prepareRequestBag(proxyRequest);
    this.inProd() ? BUIProxy.proxyMultipleExecute(proxyRequest) : this._proxyCallDev(proxyRequest);
  }

  proxyReportExecute(proxyRequest) {
    this.prepareRequestBag(proxyRequest);
    this.inProd() ? BUIProxy.proxyReportExecute(proxyRequest) : this._proxyCallDev(proxyRequest);
  }

  proxyTransactionExecute(proxyRequest, callback) {
    this.prepareRequestBag(proxyRequest);
    if (callback) {
      proxyRequest.params = proxyRequest.params || {}; // params üzerinde callback tutuldu. params taşındığından.
      proxyRequest.params.callback = callback;
    }
    this.inProd() ? BUIProxy.proxyTransactionExecute(proxyRequest) : this._proxyCallDev(proxyRequest);
  }

  /* For Development environment only. Do not use! */
  _proxyCallDev(proxyRequest) {
    this.proxyCallDev(proxyRequest.requestClass, proxyRequest.requestBody).then((result) => {
      const { key, ...others } = proxyRequest;
      var proxyResponse = {
        key: key,
        response: result,
        ...others
      };

      this.proxyDidRespond(proxyResponse);
      this.proxyDidRespondCallback(this, proxyResponse);
    });
  }

  // eslint-disable-next-line no-unused-vars
  proxyDidRespond(proxyResponse) { }

  proxyDidRespondCallback(superRef, propxyResponse) {
    if (propxyResponse.params && propxyResponse.params.callback) {
      const callback = propxyResponse.params.callback.bind(superRef);
      callback(propxyResponse.response);
      delete propxyResponse.params.callback;
    }
  }

  __render() {
    if (!this.unMounted) {
      let loader = this.getLoader();
      let element = this._render ? this._render() : null;
      return loader ? (<div>{loader}{element}</div>) : element;
    }

    return null;
  }

  __dispose() {
    if (this.serviceCalls) {
      for (let index in this.serviceCalls) {
        let promise = this.serviceCalls[index];
        this.serviceCalls[index] = null;
        if (promise) {
          try {
            promise.abort();
          }
          catch (e) {
            /* eslint-disable no-console */
            if (!(e && e.constructor && e.constructor.name === 'ServiceCallAbortSignal')) {
              console.error('An error occured while proxy service call disposing' + (e ? (': ' + JSON.stringify(e)) : ''));
            }
            /* eslint-enable no-console */
          }
        }
      }
    }

    if (this._dispose) {
      this._dispose();
    }
  }

  proxyCall(requestClass, requestBody) {
    // alert(`Deprecated. Please convert to proxyExecute()! RequestOwner:${this.getDisplayName && this.getDisplayName()}`);
    if (process.env.NODE_ENV == 'production') {
      return this._proxyCallInternal(false, null, requestClass, requestBody);
    } else {
      return this.proxyCallDev(requestClass, requestBody);
    }
  }

  proxyCallDev(requestClass, requestBody) {
    var request = {
      servicePath: 'development/Generic',
      data: {
        type: requestClass,
        body: requestBody
      },
      method: 'POST'
    };
    return this._proxyCallInternal(true, request);
  }

  proxyCallManual(request) {
    return this._proxyCallInternal(true, request);
  }

  _setCallFinished(promiseIndex) {
    if (this) {
      if (this.serviceCalls && this.serviceCalls.length && promiseIndex < this.serviceCalls.length) {
        this.serviceCalls[promiseIndex] = null;
      }
      if (!this.unMounted) {
        if (this.setState) {
          this.setState({ isLoading: false });
        }
      }
      else {
        if (this.state) {
          this.state.isLoading = false;
        }
      }
    }
  }

  _proxyCallInternal(isManual, request, requestClass, requestBody) {
    let proxy = getProxy();
    if (proxy) {
      this.setState({ isLoading: true });
      let _that = this;
      let promise = isManual ? proxy.callManual(request) : proxy.call(requestClass, requestBody);
      if (promise) {
        let promiseIndex = _that.serviceCalls.push(promise) - 1;
        return promise
          .fail((error) => {
            if (error && error.statusText === 'abort') {
              _that._setCallFinished(promiseIndex);
              throw new ServiceCallAbortSignal();
            }
            else {
              _that.debugLog('Service call error: ' + (error ? (': ' + JSON.stringify(error)) : ''));
            }
          })
          .always(() => { _that._setCallFinished(promiseIndex); });
      }
    }
    else {
      let err = 'proxy object is null';
      this.debugLog(err, 3/* always show */);
      if (!this.unMounted) {
        this.setState({ isLoading: false });
        return Promise.reject(err);
      }
    }
  }
}

export default BBusinessComponent;
