/* eslint-disable react/no-unused-prop-types */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { CHANNEL } from '@material-ui/core/styles/themeListener';
import { getMessage } from '@boa/utils';
import { ComponentSize } from './types';
import { shallowEqual } from './utils';

export default class ComponentBase extends Component {
  static propTypes = {
    context: PropTypes.object,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    isVisible: PropTypes.bool,
    newLine: PropTypes.bool,
    persistState: PropTypes.bool,
    size: PropTypes.instanceOf(ComponentSize),
    snapKey: PropTypes.string,
    snapshot: PropTypes.object,
    style: PropTypes.object,
    valueConstraint: PropTypes.object,
  }

  static defaultProps = {
    disabled: false,
    size: ComponentSize.LARGE,
    newLine: false,
    isVisible: true,
  }

  static contextTypes = {
    [CHANNEL]: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.unMounted = false;
    this.state = this.props.persistState;

    if (this.props.context && context && context[CHANNEL]) {
      this.props.context.theme = context[CHANNEL].getState();
    }
  }

  componentWillMount() {
    if (this.props.snapshot) this.setSnapshot(this.props.snapshot);
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshot) this.setSnapshot(nextProps.snapshot);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }

  // eslint-disable-next-line no-unused-vars
  componentWillUpdate(nextProps, nextState) { }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) { }

  componentWillUnmount() {
    this.unMounted = true;
    // eslint-disable-next-line no-underscore-dangle
    const disposeMethod = this.__dispose || this._dispose;
    if (disposeMethod) {
      try {
        disposeMethod.bind(this)();
      } catch (e) {
        /* eslint-disable no-console */
        console.error(`An error occured while component disposing: ${JSON.stringify(e)}`);
        /* eslint-enable no-console */
      }
    }
  }

  getInstance() {
    return this;
  }

  getMessage(groupName, propertyName) {
    return getMessage(groupName, propertyName, this.props.context.language).Description;
  }

  getMessageCode(groupName, propertyName) {
    return getMessage(groupName, propertyName, this.props.context.language).Code;
  }

  getSnapKey(childSnapKey) {
    return this.props.snapKey ? `${this.props.snapKey}_${childSnapKey}` : childSnapKey;
  }

  getChildId(childName) {
    let id = this.props.id;
    if (!id) {
      // eslint-disable-next-line no-useless-escape
      id = `bcmp_ ${Math.random().toString().replace(/[\.,]/g, '')}`;
    }
    return `${id}_${(childName || 'child')}`;
  }

  getSnapshot() {
    return this.state;
  }

  setSnapshot(snapshot) {
    // eslint-disable-next-line react/no-direct-mutation-state
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

  // eslint-disable-next-line class-methods-use-this
  validateConstraint() {
    return true;
  }
}
