import React, { Component } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
import { BLocalization } from 'b-localization';
import { setFrameworkMessage, setFrameworkMessageCode, getFrameworkMessage, getFrameworkMessageCode } from 'b-messaging';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CHANNEL } from '@material-ui/core/styles/themeListener';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CssBaseline } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
Array.prototype.findIndex = Array.prototype.findIndex || function (callback) {
  if (this === null) {
    throw new TypeError('Array.prototype.findIndex called on null or undefined');
  } else if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }
  var list = Object(this);
  var length = list.length >>> 0;
  var thisArg = arguments[1];
  for (var i = 0; i < length; i++) {
    if (callback.call(thisArg, list[i], i, list)) {
      return i;
    }
  }
  return -1;
};

var oldToJson = Date.prototype.toJSON;
Date.prototype.toJSON = function () {
  var date = new Date(this.getTime() - (this.getTimezoneOffset() * 60000));
  var json = oldToJson.call(date);
  return json;
};

export var Sizes;
(function (Sizes) {
  Sizes[Sizes['XSMALL'] = 1] = 'XSMALL';
  Sizes[Sizes['SMALL'] = 2] = 'SMALL';
  Sizes[Sizes['MEDIUM'] = 3] = 'MEDIUM';
  Sizes[Sizes['LARGE'] = 4] = 'LARGE';
})(Sizes || (Sizes = {}));

export var ComponentSize;
(function (ComponentSize) {
  ComponentSize[ComponentSize['SMALL'] = 1] = 'SMALL';
  ComponentSize[ComponentSize['MEDIUM'] = 2] = 'MEDIUM';
  ComponentSize[ComponentSize['LARGE'] = 3] = 'LARGE';
})(ComponentSize || (ComponentSize = {}));

export var ContentAlignMode;
(function (ContentAlignMode) {
  ContentAlignMode[ContentAlignMode['MOBILE'] = 1] = 'MOBILE';
  ContentAlignMode[ContentAlignMode['SINGLE'] = 2] = 'SINGLE';
  ContentAlignMode[ContentAlignMode['MULTI'] = 3] = 'MULTI';
})(ContentAlignMode || (ContentAlignMode = {}));

export var DialogResponseStyle;
(function (DialogResponseStyle) {
  DialogResponseStyle[DialogResponseStyle['OK'] = 0] = 'OK';
  DialogResponseStyle[DialogResponseStyle['YESCANCEL'] = 1] = 'YESCANCEL';
  DialogResponseStyle[DialogResponseStyle['YESNO'] = 2] = 'YESNO';
  DialogResponseStyle[DialogResponseStyle['YESNOCANCEL'] = 3] = 'YESNOCANCEL';
  DialogResponseStyle[DialogResponseStyle['OKCANCEL'] = 4] = 'OKCANCEL';
})(DialogResponseStyle || (DialogResponseStyle = {}));

export var DialogResponse;
(function (DialogResponse) {
  DialogResponse[DialogResponse['NONE'] = 0] = 'NONE';
  DialogResponse[DialogResponse['OK'] = 1] = 'OK';
  DialogResponse[DialogResponse['YES'] = 2] = 'YES';
  DialogResponse[DialogResponse['NO'] = 3] = 'NO';
  DialogResponse[DialogResponse['CANCEL'] = 4] = 'CANCEL';
})(DialogResponse || (DialogResponse = {}));

export var DialogType;
(function (DialogType) {
  DialogType[DialogType['INFO'] = 0] = 'INFO';
  DialogType[DialogType['ERROR'] = 1] = 'ERROR';
  DialogType[DialogType['WARNING'] = 2] = 'WARNING';
  DialogType[DialogType['QUESTION'] = 3] = 'QUESTION';
  DialogType[DialogType['SUCCESS'] = 4] = 'SUCCESS';
})(DialogType || (DialogType = {}));

export var Platforms;
(function (Platforms) {
  Platforms[Platforms['MOBILE'] = 1] = 'MOBILE';
  Platforms[Platforms['TABLET'] = 2] = 'TABLET';
  Platforms[Platforms['DESKTOP'] = 3] = 'DESKTOP';
})(Platforms || (Platforms = {}));

export var FormHeaderTransactionTypes;
(function (FormHeaderTransactionTypes) {
  FormHeaderTransactionTypes[FormHeaderTransactionTypes['TransactionalInput'] = 0] = 'TransactionalInput';
  FormHeaderTransactionTypes[FormHeaderTransactionTypes['TransactionalOutput'] = 1] = 'TransactionalOutput';
  FormHeaderTransactionTypes[FormHeaderTransactionTypes['TransactionalInputOutput'] = 2] = 'TransactionalInputOutput';
})(FormHeaderTransactionTypes || (FormHeaderTransactionTypes = {}));

export function setFrameworkBaseMessage(setMessage, setMessageCode) {
  setFrameworkMessage(setMessage);
  setFrameworkMessageCode(setMessageCode);
}

export class BAppProvider extends Component {

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

export class Utils {
  static uniqueKey = 0;

  static generateUUID() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  static stringFormat(value, args) {
    var regex = new RegExp('{-?[0-9]+}', 'g');
    return value.replace(regex, function (item) {
      var intVal = parseInt(item.substring(1, item.length - 1));
      var replace;
      if (intVal >= 0) {
        replace = args[intVal];
      } else if (intVal === -1) {
        replace = '{';
      } else if (intVal === -2) {
        replace = '}';
      } else {
        replace = '';
      }
      return replace;
    });
  }

  static stringPadLeft(str, len, ch) {
    const padCache = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];

    // convert `str` to `string`
    str = str + '';
    // `len` is the `pad`'s length now
    len = len - str.length;
    // doesn't need to pad
    if (len <= 0) return str;
    // `ch` defaults to `' '`
    if (!ch && ch !== 0) ch = ' ';
    // convert `ch` to `string`
    ch = ch + '';
    // cache common use cases
    if (ch === ' ' && len < 10) return padCache[len] + str;
    // `pad` starts with an empty string
    var pad = '';
    var loop = true;
    // loop
    while (loop) {
      // add `ch` to `pad` if `len` is odd
      if (len & 1) pad += ch;
      // divide `len` by 2, ditch the remainder
      len >>= 1;
      // "double" the `ch` so this operation count grows logarithmically on `len`
      // each time `ch` is "doubled", the `len` would need to be "doubled" too
      // similar to finding a value in binary search tree, hence O(log(n))
      if (len) ch += ch;
      // `len` is 0, exit the loop
      else break;
    }
    // pad `str`!
    return pad + str;
  }

  static getShowStatusMessageReplacedText(value) {
    let text = value.replace(/\n/ig, '#00100#');
    let textArray = text.split('#00100#');
    let messages = [];
    if (textArray && textArray.length > 0) {
      if (textArray.length == 1)
        messages.push(<div>{textArray[0]}</div>);
      else
        textArray.forEach(function (item, index) {
          messages.push(<div>{item}{(index != textArray.length ? <br /> : '')}</div>);
        }, this);
    }
    return messages;
  }

  static getUniqueKey(isNumeric = false) {
    this.uniqueKey = this.uniqueKey + 1;
    return isNumeric ? this.uniqueKey : 'BUniqueKey' + this.uniqueKey;
  }

  static getFormChildren(children, isDisabled) {
    this.uniqueKey = 0;
    const childArray = [];
    if (children) {
      React.Children.map(children, (child) => {
        const newChild = this.getFormChildrenRecursive(child, isDisabled);
        newChild && childArray.push(newChild);
      });
    }
    return childArray;
  }

  static getFormChildrenRecursive(parent, isDisabled) {
    if (parent && parent != null) {
      if (parent.type == 'div') {
        const childArray = [];
        React.Children.map(parent.props.children, (child) => {
          if (child) {
            if (child.type == 'div') {
              let childDiv = this.getFormChildrenRecursive(child, isDisabled);
              childDiv && childArray.push(childDiv);
            }
            else {
              if (React.isValidElement(child)) {
                let newChild = React.cloneElement(child, { key: child.props.key ? child.props.key : this.getUniqueKey(), disabled: child.props && child.props.disabled ? true : isDisabled });
                childArray.push(newChild);
              }
              else {
                childArray.push(child);
              }
            }
          }
        });
        let divChildren = React.cloneElement(parent, { children: childArray });
        return divChildren;
      }
      else if (React.isValidElement(parent)) {
        let newChild = React.cloneElement(parent, { disabled: parent.props && parent.props.disabled ? true : isDisabled });
        return newChild;
      }
      else {
        return parent;
      }
    }
  }

  static getCardChildren(children, isDisabled) {
    this.uniqueKey = 0;
    const childArray = [];
    if (children) {
      React.Children.map(children, (child) => {
        if (child && child.props && child.props.isVisible !== false) {
          const newChild = this.getCardChildrenRecursive(child, isDisabled);
          newChild && childArray.push(newChild);
        }
      });
    }
    return childArray;
  }

  static getCardChildrenRecursive(parent, isDisabled) {
    if (parent && parent != null) {
      if (parent.type == 'div') {
        const childArray = [];
        React.Children.map(parent.props.children, (child) => {
          if (child) {
            if (child.type == 'div') {
              let childDiv = this.getCardChildrenRecursive(child, isDisabled);
              childDiv && childArray.push(childDiv);
            }
            else if (React.isValidElement(child)) {
              let newChild = React.cloneElement(child,
                {
                  key: child.props.key ? child.props.key : this.getUniqueKey(true),
                  size: child.props.size ? child.props.size : BComponent.ComponentSize.LARGE,
                  newLine: child.props.newLine ? child.props.newLine : false,
                  disabled: child.props && child.props.disabled ? true : isDisabled
                });
              childArray.push(newChild);
            }
            else {
              childArray.push(child);
            }
          }
        });
        let divChildren = React.cloneElement(parent, { children: childArray });
        return divChildren;
      }
      else if (React.isValidElement(parent)) {
        let newChild = React.cloneElement(parent,
          {
            key: parent.props.key ? parent.props.key : this.getUniqueKey(),
            size: parent.props.size ? parent.props.size : BComponent.ComponentSize.LARGE,
            newLine: parent.props.newLine ? parent.props.newLine : false,
            disabled: parent.props && parent.props.disabled ? true : isDisabled
          });
        return newChild;
      }
      else {
        return parent;
      }
    }
  }

  static isMobile(props) {
    return props.context.deviceSize <= Sizes.SMALL; // platform.MOBILE olarak set edilmişti değiştirildi.
  }

  static formHeaderTransactionTypesColor(formHeaderTransactionTypes, props) {
    if (formHeaderTransactionTypes == BComponent.FormHeaderTransactionTypes.TransactionalInput) {
      return props.context.theme.boaPalette.success500;
    }
    if (formHeaderTransactionTypes == BComponent.FormHeaderTransactionTypes.TransactionalOutput) {
      return props.context.theme.boaPalette.error500;
    }
    else {
      return indigo[900];
    }
  }

  static isMobileOrTablet(props) {
    return props.context.deviceSize <= Sizes.MEDIUM;
  }
}

const logLevel = ['debug', 'test', 'preprod', 'production'].findIndex((v) => v === (process.env.NODE_ENV || 'debug'));

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function BComponentComposer(WrappedComponent) {
  return class IIBComponent extends WrappedComponent {

    static displayName = `BComponentComposer(${getDisplayName(WrappedComponent)})`;

    getComponentPropTypes() {
      return this.innerRef ? this.comp.type.propTypes : WrappedComponent.propTypes;
    }

    getComponentDefaultProps() {
      return this.innerRef ? this.comp.type.defaultProps : WrappedComponent.defaultProps;
    }

    getInstance() {
      return this.innerRef || this;
    }

    getDisplayName() {
      return IIBComponent.displayName;
    }

    render() {
      if (this.props.isVisible || this.props.isVisible === undefined) {
        this.comp;
        if (IIBComponent.displayName.includes('WithStyles') || IIBComponent.prototype.__proto__.constructor.name.includes('WithStyles')) {
          let innerComp = super.render();
          let newProps = {
            ref: r => {
              this.innerRef = r;
            }
          };
          this.comp = React.cloneElement(innerComp, newProps);
        } else {
          this.innerRef = null;
          this.comp = super.render();
        }
        return (
          <ErrorBoundary>
            {this.comp}
          </ErrorBoundary>
        );
      }
      else {
        return null;
      }

      // return super.render();
    }
  };
}

export class BComponent extends Component {
  static propTypes = {
    snapshot: PropTypes.object,
    disabled: PropTypes.bool,
    valueConstraint: PropTypes.object,
    size: PropTypes.instanceOf(ComponentSize),
    newLine: PropTypes.bool,
    isVisible: PropTypes.bool,
    style: PropTypes.object
  }

  static defaultProps = {
    disabled: false,
    size: ComponentSize.LARGE,
    newLine: false,
    isVisible: true
  }

  static contextTypes = {
    [CHANNEL]: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.unMounted = false;
    this.state = this.props.persistState;

    if (this.props.context && context && context[CHANNEL]) {
      this.props.context.theme = context[CHANNEL].getState();
    }
  }

  static getMessage(groupName, propertyName) {
    return getFrameworkMessage(groupName, propertyName);
  }

  static getMessageCode(groupName, propertyName) {
    return getFrameworkMessageCode(groupName, propertyName);
  }

  validateConstraint() { return true; }

  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshot) this.setSnapshot(nextProps.snapshot);
  }

  componentWillMount() {
    if (this.props.snapshot) this.setSnapshot(this.props.snapshot);
  }

  componentDidMount() { }

  /* eslint-disable no-unused-vars */
  componentDidUpdate(prevProps, prevState) { }

  componentWillUpdate(nextProps, nextState) { }
  /* eslint-enable no-unused-vars */

  componentWillUnmount() {
    this.unMounted = true;

    let disposeMethod = this.__dispose || this._dispose;
    if (disposeMethod) {
      try {
        disposeMethod.bind(this)();
      }
      catch (e) {
        /* eslint-disable no-console */
        console.error('An error occured while component disposing: ' + JSON.stringify(e));
        /* eslint-enable no-console */
      }
    }
  }

  getInstance() {
    return this;
  }

  getSnapKey(childSnapKey) {
    return this.props.snapKey ? `${this.props.snapKey}_${childSnapKey}` : childSnapKey;
  }

  setStyle(size, platform, style) {
    switch (size) {
      case Sizes.SMALL:
        return style.small;
      case Sizes.MEDIUM:
        return merge({}, style.small, style.medium);
      case Sizes.LARGE:
        return merge({}, style.small, style.medium, style.large);
    }
  }

  shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }
    if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
      return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (let i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }
    return true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.shallowEqual(this.props, nextProps) || !this.shallowEqual(this.state, nextState);
  }

  debugLog(message, level = 0) {
    /* debug=0, test=1, preprod=2, production=3*/
    if (level >= logLevel) {
      /* eslint-disable no-console */
      console.log(message);
      /* eslint-enable no-console */
    }
  }

  getChildId(childName) {
    let id = this.props.id;
    if (!id) {
      id = 'bcmp_' + Math.random().toString().replace(/[\.,]/g, '');
    }
    return id + '_' + (childName || 'child');
  }

  getMessage(groupName, propertyName) {
    return BComponent.getMessage(groupName, propertyName);
  }

  getMessageCode(groupName, propertyName) {
    return BComponent.getMessageCode(groupName, propertyName);
  }

  getLocalization() {
    return BLocalization.getLocalizationLanguage();
  }

  getSnapshot() {
    return this.state;
  }

  setSnapshot(snapshot) {
    this.state = Object.assign({}, this.state, snapshot);
  }

  resultErrorListToString(resultList) {
    let message = ' ';
    if (resultList && resultList.length > 0) {
      resultList.forEach((item) => {
        message += item.errorMessage;
      }, this);
    }
    return message;
  }
}

export class BEditorBase extends BComponent {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    ...BComponent.propTypes
  }

  static defaultProps = {
    ...BComponent.defaultProps,
  }

  validateConstraint() {
    const { valueConstraint } = this.props;
    let result = true;

    if (!valueConstraint || !this.props.isVisible) {
      return result;
    }

    const value = this.getValue ? this.getValue() : null;
    let newValidationResult = [];

    if (valueConstraint.required == true) {
      const message = ValidationHelper.isRequire(value);
      message && newValidationResult.push({ key: 'required', message: message });
    }
    if (valueConstraint.minLength) {
      const message = ValidationHelper.isLength(value, { min: valueConstraint.minLength });
      message && newValidationResult.push({ key: 'minLength', message: message });
    }
    if (valueConstraint.maxLength) {
      const message = ValidationHelper.isLength(value, { max: valueConstraint.maxLength });
      message && newValidationResult.push({ key: 'maxLength', message: message });
    }

    result = newValidationResult.length > 0 ? false : true;

    if (!this.validationResult || !isEqual(this.validationResult.sort(), newValidationResult.sort())) {
      this.validationResult = newValidationResult;
      this.forceUpdate();
    }

    return result;
  }
}

class ValidationHelper {

  static isRequire(value) {
    if (value == null || value == undefined) {
      return getFrameworkMessage('BOA', 'Nullable');
    }
    if (typeof value === 'string' && value.trim() === '') {
      return getFrameworkMessage('BOA', 'Nullable');
    }
    return null;
  }

  static isLength(value, options) {
    if (!value || typeof value !== 'string' || !options) {
      return null;
    }

    let min = options.min ? options.min < 0 ? 0 : options.min : 0;
    let max = options.max ? options.max < 0 ? 0 : options.max : 0;

    var len = value.length || 0;

    if (len < min) {
      return getFrameworkMessage('BOA', 'MinLength').replace('{0}', min);
    }
    if (max && len > max) {
      return getFrameworkMessage('BOA', 'MaxLength').replace('{0}', max);
    }
    return null;
  }
}

class ErrorBoundary extends Component {
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


BComponent.BEditorBase = BEditorBase;
BComponent.Utils = Utils;
BComponent.Sizes = Sizes;
BComponent.ComponentSize = ComponentSize;
BComponent.ContentAlignMode = ContentAlignMode;
BComponent.DialogType = DialogType;
BComponent.DialogResponseStyle = DialogResponseStyle;
BComponent.DialogResponse = DialogResponse;
BComponent.Platforms = Platforms;
BComponent.FormHeaderTransactionTypes = FormHeaderTransactionTypes;
