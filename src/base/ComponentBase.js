import { Component } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { CHANNEL } from '@material-ui/core/styles/themeListener';
import { getMessage } from 'b-messaging';
import { Sizes, ComponentSize } from './types';
import { Utils } from './utils';

export class ComponentBase extends Component {
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
