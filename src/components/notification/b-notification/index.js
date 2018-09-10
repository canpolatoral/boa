import React from 'react'; import PropTypes from 'prop-types';
import { BComponent } from 'b-component';
import { BButton } from 'b-button';

import ReactDOM from 'react-dom';
const PERMISSION_GRANTED = 'granted';
const PERMISSION_DENIED = 'denied';

const seqGen = () => {
  let i = 0;
  return () => {
    return i++;
  };
};
const seq = seqGen();

export class BNotification extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    notSupported: PropTypes.func,
    onPermissionGranted: PropTypes.func,
    onPermissionDenied: PropTypes.func,

    timeout: PropTypes.number,
    title: PropTypes.string.isRequired,
    options: PropTypes.object,
    onActionClick: PropTypes.func
  }

  static defaultProps = {
    ...BComponent.defaultProps
  }

  constructor(props, context) {
    super(props, context);

    let supported = false;
    let granted = false;
    if (('Notification' in window) && Notification) {
      supported = true;
      if (Notification.permission === PERMISSION_GRANTED) {
        granted = true;
      }
    }

    this.state = {
      supported: supported,
      granted: granted
    };
    // Do not save Notification instance in state
    this.notifications = {};
  }

  _askPermission() {
    Notification.requestPermission((permission) => {
      let result = permission === PERMISSION_GRANTED;
      this.setState({
        granted: result
      }, () => {
        if (result) {
          this.props.onPermissionGranted && this.props.onPermissionGranted();
        } else {
          this.props.onPermissionDenied && this.props.onPermissionDenied();
        }
      });
    });
  }

  componentDidMount() {
    if (!this.state.supported && this.props.notSupported) {
      this.props.notSupported();
    } else if (this.state.granted && this.props.onPermissionGranted) {
      this.props.onPermissionGranted();
    } else {
      if (Notification.permission === PERMISSION_DENIED) {
        if (this.props.askAgain) {
          this._askPermission();
        } else {
          this.props.onPermissionDenied && this.props.onPermissionDenied();
        }
      } else {
        this._askPermission();
      }
    }
    navigator.serviceWorker.ready.then(function (registration) {
      registration.getNotifications().then(() => {
      });
    });
    /* eslint-disable no-unused-vars */
    window.addEventListener('onstatechange', function (event) {
      this.debugLog('[Service Worker] Notification click Received.');

    });
    /* eslint-enable no-unused-vars */
    navigator.serviceWorker.onstatechange = function () {
      this.debugLog('[Service Worker] Notification click Received.');
    };
  }
  componentDidUpdate() {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.getNotifications().then(() => {
      });
    });
  }
  componentWillUnmount() {
    /* if (this.props.disableActiveWindow) {
       if (window.removeEventListner) {
         window.removeEventListener('focus', this.onWindowFocus);
         window.removeEventListener('blur', this.onWindowBlur);
       } else if (window.detachEvent) {
         window.detachEvent('focus', this.onWindowFocus);
         window.detachEvent('blur', this.onWindowBlur);
       }
     }*/
  }

  getTag() {
    return this.inpt.value;
  }
  render() {
    Notification.onclick = (e) => {
      this.debugLog('log');
      this.onClick(e);
    };
    let opt = this.props.options;
    if (this.props.title && this.state.supported && this.state.granted) {

      if (typeof opt.tag !== 'string') {
        opt.tag = 'one-notification-' + seq();

        opt.onclick = () => {
          this.debugLog('opt log');
        };
      }
      var title = this.props.title;

      if (!this.notifications[opt.tag]) {
        Notification.requestPermission(function (result) {
          if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.showNotification(title, opt);
              registration.getNotifications().then(
                (ns) => {
                  ns.forEach(function (element) {
                    element.onclick = () => {
                      this.debugLog(' onclick  log');
                    };
                  }, this);
                }
              );
              navigator.serviceWorker.onnotificationclick = () => {
                this.debugLog('log');
              };
              navigator.serviceWorker.oncontrollerchange = () => {
                this.debugLog('log');
              };
              navigator.serviceWorker.addEventListener('notificationclick', () => {
                this.debugLog('notificationclick log');
              });

              /*  ServiceWorkerGlobalScope.onnotificationclick = () => {
                  console.log('log');
                };*/
            });
          }
        }
        );
        // let n = new window.Notification(this.props.title, opt);
        /* n.onshow = (e) => {
         //  this.props.onShow(e, opt.tag);
           setTimeout(() => {
             this.close(n);
           }, this.props.timeout);
         };*/
      }
    }

    // return null cause
    // Error: Invariant Violation: Notification.render(): A valid ReactComponent must be returned. You may have returned undefined, an array or some other invalid object.
    return (
      <div>
        <input type='hidden' ref={r => this.inpt = r} style={{ display: 'none' }} />
        <BButton context={this.props.context} text={'test'} />
      </div>
    );
  }

  onClick() {
    /* var options = { tag: e.notification.options.tag };
     this.props.onActionClick(options.tag);*/
  }

  close(n) {
    if (n && typeof n.close === 'function') {
      n.close();
    }
  }

  // for debug
  _getNotificationInstance(tag) {
    return this.notifications[tag];
  }
}

export default BNotification;

export class BNotificationHelper {
  static dialogRefs = {};

  static staticConstructor() {
    navigator.serviceWorker.register('./js/service-worker.js');
  }

  static show(notificationParams) {
    let notifyDiv = document.createElement('div');
    document.body.appendChild(notifyDiv);

    let notifyElement = (
      <BNotification
        context={notificationParams.context}
        title={notificationParams.title}
        timeout={notificationParams.timeout}
        options={notificationParams.options}
        onActionClick={this.onActionClick.bind(this)}
        notSupported={this.notSupported.bind(this)}
        onPermissionGranted={this.onPermissionGranted.bind(this)}
        onPermissionDenied={this.onPermissionDenied.bind(this)}
      />
    );
    ReactDOM.render(notifyElement, notifyDiv, () => {
      // this.dialogRefs[thisRef.getTag()] = { notification: thisRef, params: notificationParams };
    });
  }

  static notSupported() {

  }
  static onPermissionGranted() {

  }

  static onPermissionDenied() {

  }

  static onActionClick(action, tag) {
    let n = this.dialogRefs[tag];
    n.params.onActionClick(action);
  }
}

BNotificationHelper.staticConstructor();
