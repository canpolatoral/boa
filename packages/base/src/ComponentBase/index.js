/* eslint-disable react/no-unused-prop-types */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { CHANNEL } from '@material-ui/core/styles/themeListener';
import { getMessage } from '@kuveytturk/boa-utils';
import { ComponentSize, Sizes } from '../enums';
import { shallowEqual } from '../helpers';

export default class ComponentBase extends Component {
  static propTypes = {
    /**
     * Defines the size of the component. The ComponentSize constant exported from enums.
     */
    componentSize: PropTypes.oneOf([
      ComponentSize.LARGE,
      ComponentSize.MEDIUM,
      ComponentSize.SMALL,
      ComponentSize['1'],
      ComponentSize['2'],
      ComponentSize['3'],
    ]),
    /**
     * Defines application requirements such as localization, theme, platform.
     */
    context: PropTypes.object,
    /**
     * If true, all of the component functionality will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * All components should be have id prop.
     */
    id: PropTypes.string,
    /**
     * As described in componentSize prop, if any components take part in the new line
     * on a card we're using this prop.
     */
    newLine: PropTypes.bool,
    /**
     * The snapKey property is used to manage snapshots of the child components.
     */
    snapKey: PropTypes.string,
    /**
     * In our SPA, we want to keep the state of each component when a page will unmount.
     * And the same page will mount again, the component mounts with snapshot prop and
     * it should get the previous state.
     */
    snapshot: PropTypes.object,
    /**
     * All components should be have style prop.
     */
    style: PropTypes.object,
    /**
     * The valueConstraint is used to some validation on components like limit, required etc.
     */
    valueConstraint: PropTypes.object,
    /**
     * In ComponentComposer, we change the visibility of the component with this prop.
     */
    visible: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    componentSize: ComponentSize.LARGE,
    newLine: false,
    visible: true,
  };

  static contextTypes = {
    [CHANNEL]: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

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

  getSnapKey(childSnapKey) {
    return this.props.snapKey ? `${this.props.snapKey}_${childSnapKey}` : childSnapKey;
  }

  getSnapshot() {
    return this.state;
  }

  setSnapshot(snapshot) {
    this.setState({ ...snapshot });
  }

  isMobile() {
    return this.props.context.deviceSize <= Sizes.SMALL;
  }

  isMobileOrTablet() {
    return this.props.context.deviceSize <= Sizes.MEDIUM;
  }

  // eslint-disable-next-line class-methods-use-this
  validateConstraint() {
    return true;
  }

  // eslint-disable-next-line
  render() { return; }
}
