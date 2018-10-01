import PropTypes from 'prop-types';
import React, { Component } from 'react';

import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';

import { CHANNEL } from '@material-ui/core/styles/themeListener';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { Utils } from './utils';
import { ErrorBoundary } from './boundary';
import { Sizes, ComponentSize, ContentAlignMode, DialogResponseStyle, DialogResponse, DialogType, Platforms, FormHeaderTransactionTypes } from './types';

import { BLocalization } from 'b-localization';
import { setMessagingOptions, getMessage } from 'b-messaging';

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

  getMessage(groupName, propertyName) {
    return getMessage(groupName, propertyName, this.props.context.language).Description;
  }

  getMessageCode(groupName, propertyName) {
    return getMessage(groupName, propertyName, this.props.context.language).Code;
  }

  validateConstraint() {
    return true;
  }

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
    if (level >= Utils.getLogLevel()) {
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
      const message = this.isNullOrEmpty(value);
      message && newValidationResult.push({ key: 'required', message: message });
    }

    if (valueConstraint.minLength) {
      const message = this.checkLength(value, { min: valueConstraint.minLength });
      message && newValidationResult.push({ key: 'minLength', message: message });
    }

    if (valueConstraint.maxLength) {
      const message = this.checkLength(value, { max: valueConstraint.maxLength });
      message && newValidationResult.push({ key: 'maxLength', message: message });
    }

    result = newValidationResult.length > 0 ? false : true;

    if (!this.validationResult || !isEqual(this.validationResult.sort(), newValidationResult.sort())) {
      this.validationResult = newValidationResult;
      this.forceUpdate();
    }

    return result;
  }

  isNullOrEmpty(value) {
    if (value == null || value == undefined) {
      return this.getMessage('BOA', 'Nullable');
    }
    if (typeof value === 'string' && value.trim() === '') {
      return this.getMessage('BOA', 'Nullable');
    }
    return null;
  }

  checkLength(value, options) {
    if (!value || typeof value !== 'string' || !options) {
      return null;
    }

    let min = options.min ? options.min < 0 ? 0 : options.min : 0;
    let max = options.max ? options.max < 0 ? 0 : options.max : 0;

    var len = value.length || 0;

    if (len < min) {
      return this.getMessage('BOA', 'MinLength').replace('{0}', min);
    }
    if (max && len > max) {
      return this.getChildId('BOA', 'MaxLength').replace('{0}', max);
    }
    return null;
  }
}

export function BComponentComposer(WrappedComponent) {
  return class IIBComponent extends WrappedComponent {

    static propTypes = {
      ...WrappedComponent.wrappedPropTypes,
      ...WrappedComponent.propTypes,
    }

    static displayName = `BComponentComposer(${Utils.getDisplayName(WrappedComponent)})`;

    getComponentPropTypes() {
      console.log(WrappedComponent.wrappedPropTypes);
      console.log(IIBComponent.prototype);
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

export function setLocalization(options) {
  setMessagingOptions(options);
  BLocalization.staticConstructor(options.languageId);
}

export { Utils } from './utils';

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
