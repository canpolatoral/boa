/* eslint-disable react/no-unused-prop-types */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { CHANNEL } from '@material-ui/core/styles/themeListener';
import { getMessage } from '@boa/utils';
import { ComponentSize } from './types';
import { shallowEqual } from './utils';

export default class ComponentBase extends Component {
  static propTypes = {
    componentSize: PropTypes.oneOf([
      ComponentSize.LARGE,
      ComponentSize.MEDIUM,
      ComponentSize.SMALL,
      ComponentSize['1'],
      ComponentSize['2'],
      ComponentSize['3'],
    ]),
    context: PropTypes.object,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    isVisible: PropTypes.bool,
    newLine: PropTypes.bool,
    persistState: PropTypes.bool,
    snapKey: PropTypes.string,
    snapshot: PropTypes.object,
    style: PropTypes.object,
    valueConstraint: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    componentSize: ComponentSize.LARGE,
    newLine: false,
    isVisible: true,
  };

  static contextTypes = {
    [CHANNEL]: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.props.persistState;

    if (this.props.context && context && context[CHANNEL]) {
      this.props.context.theme = context[CHANNEL].getState();
    }
  }

  componentWillMount() {
    if (this.props.snapshot) {
      this.setSnapshot(this.props.snapshot);
    }
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshot) {
      this.setSnapshot(nextProps.snapshot);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }

  // eslint-disable-next-line no-unused-vars
  componentWillUpdate(nextProps, nextState) { }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) { }

  componentWillUnmount() { }

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

  getSnapshot() {
    return this.state;
  }

  setSnapshot(snapshot) {
    this.setState({ ...snapshot });
  }

  // eslint-disable-next-line class-methods-use-this
  validateConstraint() {
    return true;
  }
}
