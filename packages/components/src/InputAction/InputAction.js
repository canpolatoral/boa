import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { IconButton } from '@boa/components/IconButton';
import { Input } from '@boa/components/Input';
import { InputNumeric } from '@boa/components/InputNumeric';

@ComponentComposer
class InputAction extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    ...Input.propTypes,
    hideLeftIcons: PropTypes.bool,
    hideRightIcons: PropTypes.bool,
    inputDisabled: PropTypes.bool,
    leftIconList: PropTypes.array,
    rightIconList: PropTypes.array,
    type: PropTypes.oneOf(['password', 'text', 'numeric']),
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    ...Input.defaultProps,
    inputDisabled: false,
    floatingLabelFixed: false,
    fullWidth: true,
    type: 'text',
    hideLeftIcons: false,
    hideRightIcons: false,
  };

  state = {
    floatingLabelStyle: this.getFloatingLabelStyle(true),
    value: this.props.value,
    showPassword: false,
    disabled: this.props.disabled,
    inputDisabled: this.props.disabled ? this.props.disabled : this.props.inputDisabled,
    hideLeftIcons: this.props.hideLeftIcons,
    hideRightIcons: this.props.hideRightIcons,
  };

  constructor(props, context) {
    super(props, context);

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.setFloatingLabelStyle = this.setFloatingLabelStyle.bind(this);
    this.getFloatingLabelStyle = this.getFloatingLabelStyle.bind(this);
    this.passwordClicked = this.passwordClicked.bind(this);
    this.iconSize = 20;
    this.iconContainerSize = 24;
    this.iconMargin = 4;
  }

  componentWillReceiveProps(nextProps) {
    const { disabled, inputDisabled, value, rightIconList, leftIconList } = nextProps;

    if (this.props.rightIconList !== rightIconList || this.props.leftIconList !== leftIconList) {
      this.setFloatingLabelStyle(nextProps.rightIconList, nextProps.leftIconList);
    }

    if (value != null) {
      this.setState({ value });
    }

    if (disabled !== this.props.disabled || inputDisabled !== this.props.inputDisabled) {
      this.setState({ disabled, inputDisabled: disabled || inputDisabled });
    }
  }

  getValue() {
    return this.binput.getInstance().getValue();
  }

  setValue(value) {
    return this.binput.getInstance().setValue(value);
  }

  resetValue() {
    this.setState({ value: this.props.defaultValue });
    return this.binput.getInstance().resetValue();
  }

  setDisable(value) {
    this.setState({ disabled: value, inputDisabled: value });
  }

  onChange(e, v) {
    this.setState({ value: v });

    /* istanbul ignore else */
    if (this.props.onChange) {
      this.props.onChange(e, v);
    }
  }

  onBlur(e) {
    /* istanbul ignore else */
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      this.setFloatingLabelStyle();
    }

    if (this.props.onBlur) {
      const textField = this.binput.getInstance().textField;
      if (textField === e.relatedTarget) {
        return;
      }

      const focusedButton = this.refs.buttons.filter(item => {
        const buttonDom = ReactDOM.findDOMNode(item);
        return e.relatedTarget == buttonDom; // eslint-disable-line
      });

      if (focusedButton && focusedButton.length > 0 && focusedButton[0]) {
        return;
      }

      this.props.onBlur(e);
    }
  }

  setFloatingLabelStyle(rightIconList, leftIconList) {
    this.setState({
      floatingLabelStyle: this.getFloatingLabelStyle(false, rightIconList, leftIconList),
    });
  }

  getFloatingLabelStyle(usePropValue, rightIconList, leftIconList) {
    if (!rightIconList) {
      rightIconList = this.props.rightIconList;
    }

    if (!leftIconList) {
      leftIconList = this.props.leftIconList;
    }

    const hideRightIcons = usePropValue ? this.props.hideRightIcons : this.state.hideRightIcons;
    let paddingRight = 0;
    if (rightIconList && !hideRightIcons) {
      paddingRight = rightIconList.length * this.iconSize + rightIconList.length * this.iconMargin;
    }

    const isRtl = this.props.context.localization.isRightToLeft;
    const value = usePropValue ? this.props.value : this.getValue();
    const paddingLeft = value
      ? 0
      : leftIconList && leftIconList.length * this.iconSize + leftIconList.length * this.iconMargin;

    return Object.assign(
      isRtl
        ? {
            paddingRight: paddingLeft,
            paddingLeft: paddingRight,
          }
        : {
            paddingLeft,
            paddingRight,
          },
      this.props.floatingLabelStyle,
    );
  }

  passwordClicked() {
    this.setState(prevState => {
      return { showPassword: !prevState.showPassword };
    });
  }

  focus() {
    this.binput.getInstance().focus();
  }

  hideLeftIcons() {
    this.setState({ hideLeftIcons: true });
  }

  hideRightIcons() {
    this.setState({ hideRightIcons: true });
  }

  showLeftIcons() {
    this.setState({ hideLeftIcons: false });
  }

  showRightIcons() {
    this.setState({ hideRightIcons: false });
  }

  validateConstraint() {
    return this.binput ? this.binput.getInstance().validateConstraint() : true;
  }

  render() {
    this.refs = { buttons: [] };

    const baseIconStyle = {
      width: this.iconContainerSize,
      height: this.iconContainerSize,
      padding: 0,
      // transform: 'scale(0.83)' // icon boyutları 20 px olması için diğer türlü olmuyor.
    };

    const baseIconContainerStyle = {
      width: this.iconContainerSize,
      height: this.iconContainerSize,
      display: 'inline-block',
    };

    /* iconProperties={{width: '20px', height:'20px'}} */
    let rightIcons = [];

    let { type } = this.props;

    if (this.props.type === 'password') {
      let showPasswordColor;
      if (this.state.showPassword) {
        showPasswordColor = this.props.context.theme.boaPalette.pri500;
        type = 'text';
      } else {
        showPasswordColor = this.props.context.theme.boaPalette.base400;
        type = 'password';
      }
      if (!this.state.hideRightIcons) {
        rightIcons.push(
          <div key="right0div" style={baseIconContainerStyle}>
            <IconButton
              style={baseIconStyle}
              ref={r => this.refs.buttons.push(r)}
              context={this.props.context}
              disabled={this.state.disabled}
              key={'right0'}
              dynamicIcon="RemoveRedEye"
              iconProperties={{
                style: {
                  color: showPasswordColor,
                  width: this.iconSize,
                  height: this.iconSize,
                },
              }}
              onClick={this.passwordClicked}
              onBlur={this.onBlur}
              tabIndex="-1"
            />
          </div>,
        );
      }
    } else if (this.props.rightIconList && !this.state.hideRightIcons) {
      rightIcons = this.props.rightIconList.map((icon, index) => {
        return (
          <div
            key={icon.key || `rightIcon${index}`}
            style={Object.assign(
              baseIconContainerStyle,
              {
                marginLeft: this.iconMargin,
              },
              icon.iconContainerStyle,
            )}
          >
            <IconButton
              {...icon}
              style={baseIconStyle}
              ref={r => this.refs.buttons.push(r)}
              context={this.props.context}
              // iconProperties={{ style: {  width: this.iconSize, height:  this.iconSize  } }}
              disabled={this.state.disabled}
              key={`right${index}`} // eslint-disable-line
              onBlur={this.onBlur}
              tabIndex="-1"
            />
          </div>
        );
      });
    }

    let leftIcons = [];
    if (this.props.leftIconList && !this.state.hideLeftIcons) {
      leftIcons = this.props.leftIconList.map((icon, index) => {
        return (
          <div
            key={icon.key || `leftIcon${index}`}
            style={Object.assign(
              baseIconContainerStyle,
              {
                marginRight: this.iconMargin,
              },
              icon.iconContainerStyle,
            )}
          >
            <IconButton
              {...icon}
              style={baseIconStyle}
              ref={r => this.refs.buttons.push(r)}
              context={this.props.context}
              disabled={this.state.disabled}
              // iconProperties={{ style: {  width: this.iconSize, height:  this.iconSize  } }}
              key={`left${index}`} // eslint-disable-line
              onBlur={this.onBlur}
              tabIndex="-1"
            />
          </div>
        );
      });
    }

    const bInput =
      this.props.type === 'numeric'
        ? this.renderBInputNumeric(type, leftIcons, rightIcons)
        : this.renderBInput(type, leftIcons, rightIcons);

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <div>{bInput}</div>
      </div>
    );
  }

  renderBInput(type, leftIcons, rightIcons) {
    const { context, ...others } = this.props;
    return (
      <Input
        ref={r => (this.binput = r)}
        context={context}
        {...others}
        disabled={this.state.inputDisabled}
        type={type}
        value={this.state.value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.props.onFocus}
        onKeyDown={this.props.onKeyDown}
        prefixText={leftIcons.length ? leftIcons : null}
        suffixText={rightIcons.length ? rightIcons : null}
      />
    );
  }

  renderBInputNumeric(type, leftIcons, rightIcons) {
    const { context, ...others } = this.props;
    return (
      <InputNumeric
        ref={r => (this.binput = r)}
        context={context}
        {...others}
        disabled={this.state.inputDisabled}
        type={type}
        value={this.state.value}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        prefixText={leftIcons.length ? leftIcons : null}
        suffixText={rightIcons.length ? rightIcons : null}
      />
    );
  }
}

export default InputAction;
