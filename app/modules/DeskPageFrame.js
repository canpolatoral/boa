import * as React from 'react';
import Components from '../../src/components/catalog';
import Events from '../../src/base/b-component/events';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { BLocalization } from '../../src/components/utils/b-localization';
import { BFormManager } from '../../src/components/utils/b-form-manager';

import { injectLocalization } from '../../src/base/b-component';

var applicationContext = require('../data/applicationContext.json');
var messagingContext = {};

export default class DeskPageFrame extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._updateDeviceSize = this._updateDeviceSize.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.state = { fullScreen: props.fullScreen, languageId: props.languageId, dynamicReload: false, dynamicContent: null };


    injectLocalization(BLocalization, null, BFormManager);
  }

  getMessage(groupName, propertyName) {
    if (messagingContext && messagingContext[groupName] && messagingContext[groupName][propertyName]) {
      return messagingContext[groupName][propertyName];
    }
    else
      return groupName + '.' + propertyName;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fullScreen: nextProps.fullScreen, dynamicReload: false, languageId: nextProps.languageId });
  }

  componentDidUpdate() {
    if (typeof this.props.componentType === 'function' &&
      this.state.dynamicReload) {
      const options = {
        type: this.props.componentType,
        props: this.props.data,
        ref: '',
        deviceSize: this.state.deviceSize,
        windowWidth: this.state.windowWidth || (window.innerWidth || document.body.clientWidth)
      };
      this.loadElement(options);
    }
  }

  componentDidMount() {
    if (typeof this.props.componentType === 'function' &&
      this.state.fullScreen) {
      const options = {
        type: this.props.componentType,
        props: this.props.data,
        ref: '',
        deviceSize: this.state.deviceSize,
        windowWidth: this.state.windowWidth || (window.innerWidth || document.body.clientWidth)
      };
      this.loadElement(options);
    }
  }

  loadElement(options) {
    var that = this;
    options.type().then(function (lazyModule) {
      options.ref = that.guid();
      const context = that.getContext(options);
      let props = _.extend({}, { params: that.props.params, key: options.ref }, options.props, { context: context });
      const self = this;
      if (_.isObject(lazyModule.default)) {
        _.forOwn(props, (prop, propName) => {
          if (prop && _.isObject(prop) && prop.type) {
            props[propName] = self.createElement(prop);
          }
        });
      }
      let result = React.createElement(lazyModule.default, props, null);
      if (result.type.prototype) {
        if (result.type.prototype.render) {
          result.type.prototype.render = (function (fn) {
            return function render() {
              return fn.apply(this, arguments);
            };
          }(result.type.prototype.render));
        }
      }
      that.setState({ dynamicContent: result, dynamicReload: false });
    }).catch(function (err) {
      // eslint-disable-next-line no-console
      console.log('Failed to load lazy module', err);
    });
  }


  _updateDeviceSize() {
    const width = window.innerWidth || document.body.clientWidth;
    var height = window.innerHeight || document.body.clientHeight;
    if (width < height) {
      height = width;
    }

    var deviceSize = 4;

    if (width < 512) {
      deviceSize = 2; /* Telefon */
    } else if (width < 1024) {
      deviceSize = 3; /* Tablet */
    } else {
      deviceSize = 4; /* Desktop */
    }
    if (this.state.deviceSize != deviceSize) {
      this.setState({ deviceSize: deviceSize });
    }
  }

  _bindResize() {
    Events.on(window, 'resize', this._updateDeviceSize);
  }

  _unbindResize() {
    Events.off(window, 'resize', this._updateDeviceSize);
  }

  componentWillMount() {
    this._updateDeviceSize();
    this._bindResize();
  }

  componentWillUnmount() {
    this._unbindResize();
  }

  guid() {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  getContext(options) {
    let language = 1;
    if (this.state.languageId != null) {
      language = this.state.languageId;
    }
    BLocalization.staticConstructor(language);

    return {
      deviceSize: options.deviceSize,
      platform: 3,
      language: language,
      windowWidth: options.windowWidth,
      localization: {
        isRightToLeft: language == 5 ? true : false
      },
      applicationContext: applicationContext,
      messagingContext: messagingContext
    };
  }

  createElement(options) {
    options.ref = this.guid();
    let type = 'div';
    if (options.type) {
      type = this.findComponent(Components, options.type.default, 0);
      if (!type) {
        type = options.type;
      } else if (!_.isObject(type)) {
        // eslint-disable-next-line no-console
        console.error(`Element type: ${options.type} is not object. Please check your catalogs file`);
        type = 'div';
      }
    }
    const context = this.getContext(options);
    let props = _.extend({}, { params: this.props.params, key: options.ref }, options.props, { context: context });
    const self = this;
    if (_.isObject(type)) {
      _.forOwn(props, (prop, propName) => {
        if (prop && _.isObject(prop) && prop.type) {
          props[propName] = self.createElement(prop);
        }
      });
    }
    let nestedElements = null;
    if (options.props && options.props.children && options.props.children.length > 0) {
      let children = [];
      options.props.children.forEach(childOptions => {
        const cOptions = {
          type: childOptions.type,
          props: childOptions,
          ref: '',
          deviceSize: this.state.deviceSize,
          windowWidth: this.state.windowWidth || (window.innerWidth || document.body.clientWidth)
        };
        children.push(self.createElement(cOptions));
      });
      nestedElements = children;

    }
    let result = React.createElement(type, props, nestedElements);
    if (result.type.prototype) {
      if (result.type.prototype.render) {
        result.type.prototype.render = (function (fn) {
          return function render() {
            return fn.apply(this, arguments);
          };
        }(result.type.prototype.render));
      }
    }
    return result;
  }

  findComponent(index, componentName, level) {
    let result = null;
    if (index && _.isObject(index) && level <= 2) {
      level++;
      _.forOwn(index, (value, key) => {
        if (!result) {
          if (key === componentName) {
            result = value;
          } else if (value && _.isObject(value)) {
            result = this.findComponent(value, componentName, level);
          }
        }
      }, this);
    }
    return result;
  }

  render() {

    let divStyle = this.state.fullScreen ? { position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 } : { position: 'absolute', marginTop: 10, marginLeft: 10, width: '90%' };
    if (_.isArray(this.props.data)) {
      let contentElements = [];
      _.forEach(this.props.data, (value) => {
        const options = {
          type: value.type,
          props: value.props,
          ref: '',
          deviceSize: this.state.deviceSize,
          windowWidth: this.state.windowWidth || (window.innerWidth || document.body.clientWidth)
        };
        const content = this.createElement(options);
        const variantName = value.variantName;
        const element = { content, variantName };
        contentElements.push(element);
      });

      if (contentElements.length > 0 && this.props.componentType != null) {
        const items = contentElements.map((value, i) => {
          return (
            <div key={i}>
              <div>{value.variantName}</div>
              <div>{value.content}</div>
              <div id='snack-bar-element-instance'></div>
            </div>
          );
        });
        return (
          <div style={divStyle}>
            {items}
            <div id='snack-bar-element-instance'></div>
          </div>
        );
      }
      else {
        return (
          <div style={divStyle}><div>Not found</div></div>
        );
      }
    } else {
      if (this.props.componentType) {
        const options = {
          type: this.props.componentType.default,
          props: this.props.data,
          ref: '',
          deviceSize: this.state.deviceSize,
          windowWidth: this.state.windowWidth || (window.innerWidth || document.body.clientWidth)
        };
        const content = this.createElement(options);
        return (
          <div style={divStyle}>
            {(this.props.componentType != null ? content : <div></div>)}
            <div id='snack-bar-element-instance'></div>
          </div>
        );
      } else {
        return <div> </div>;
      }
    }
  }
}

DeskPageFrame.propTypes = {
  componentType: PropTypes.any,
  params: PropTypes.any,
  data: PropTypes.any,
  fullScreen: PropTypes.bool
};

DeskPageFrame.defaultProps = {
  fullScreen: false
};
