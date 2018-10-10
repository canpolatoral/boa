import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { ComponentBase, ComponentComposer } from 'b-component';
import { IconButton } from 'b-icon-button';
import { Input } from 'b-input';
import { InputNumeric } from 'b-input-numeric';

@ComponentComposer
class InputAction extends ComponentBase {

  static propTypes = {
    ...ComponentBase.propTypes,
    ...Input.propTypes,
    inputDisabled: PropTypes.bool,
    leftIconList: PropTypes.array,
    rightIconList: PropTypes.array,
    type: PropTypes.oneOf(['password', 'text', 'numeric']),
    hideLeftIcons: PropTypes.bool,
    hideRightIcons: PropTypes.bool
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    ...Input.defaultProps,
    inputDisabled: false,
    floatingLabelFixed: false,
    fullWidth: true,
    type: 'text',
    hideLeftIcons: false,
    hideRightIcons: false
  };

  _iconSize = 20;
  _iconContainerSize = 24;
  _iconMargin = 4;

  state = {
    floatingLabelStyle: this.getFloatingLabelStyle(true),
    value: this.props.value,
    showPassword: false,
    disabled: this.props.disabled,
    inputDisabled: this.props.disabled ? this.props.disabled : this.props.inputDisabled,
    hideLeftIcons: this.props.hideLeftIcons,
    hideRightIcons: this.props.hideRightIcons
  };

  constructor(props, context) {
    super(props, context);

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.setFloatingLabelStyle = this.setFloatingLabelStyle.bind(this);
    this.getFloatingLabelStyle = this.getFloatingLabelStyle.bind(this);
  }

  // If floatinglabel are not provided, padding will be given to leftIconList.
  // If value is not null, padding will be removed on onBlur.

  getValue() {
    return this.binput.getInstance().getValue();
  }

  resetValue() {
    this.setState({ value: this.props.defaultValue });
    return this.binput.getInstance().resetValue();
  }

  setDisable(value) {
    this.setState({ disabled: value, inputDisabled: value });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.leftIconList && this.props.leftIconList.length > 0) {
      this.setFloatingLabelStyle();
    }
    if (nextProps.value != null) {
      this.setState({ value: nextProps.value });
    }
    if (nextProps.disabled !== this.props.disabled || nextProps.inputDisabled !== this.props.inputDisabled) {
      let inputDisabled = nextProps.disabled ? nextProps.disabled : nextProps.inputDisabled;
      this.setState({ disabled: nextProps.disabled, inputDisabled: inputDisabled });
    }
  }

  onChange(e, v) {
    this.setState({
      value: v
    });
    this.props.onChange && this.props.onChange(e, v);
  }

  onKeyDown(e) {
    this.props.onKeyDown && this.props.onKeyDown(e);
  }

  onFocus(e) {
    this.props.onFocus && this.props.onFocus(e);
  }

  onBlur(e) {


    if ( /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      console.log('safari');
    } else {
      this.setFloatingLabelStyle();
    }

    // Zaten event yok
    if (!this.props.onBlur) {
      return;
    }

    // Zaten yeniden bizim inputa focus edilmisse
    if (this.binput && this.binput.getInstance() && this.binput.getInstance().textField && e.relatedTarget == this.binput.getInstance().textField) {
      return;
    }

    let focusedButton = this.refs.buttons.filter(item => {
      let buttonDom = ReactDOM.findDOMNode(item);
      return e.relatedTarget == buttonDom;
    });
    // Bizim butonlardan birine mi focus edilmis
    if (focusedButton && focusedButton.length > 0 && focusedButton[0]) {
      return;
    }

    this.props.onBlur(e);
  }

  setFloatingLabelStyle() {
    this.setState({ floatingLabelStyle: this.getFloatingLabelStyle() });
  }

  getFloatingLabelStyle(usePropValue) {

    var hideRightIcons = usePropValue ? this.props.hideRightIcons : this.state.hideRightIcons;
    let paddingRight = 0;
    if (this.props.rightIconList && !hideRightIcons) {
      paddingRight = this.props.rightIconList.length * this._iconSize + this.props.rightIconList.length * this._iconMargin;
    }

    const isRtl = this.props.context.localization.isRightToLeft;
    var value = usePropValue ? this.props.value : this.getValue();
    const paddingLeft = value ? 0 : this.props.leftIconList && (this.props.leftIconList.length * this._iconSize + this.props.leftIconList.length * this._iconMargin);

    return Object.assign(isRtl ? { paddingRight: paddingLeft, paddingLeft: paddingRight } : { paddingLeft: paddingLeft, paddingRight: paddingRight }, this.props.floatingLabelStyle);
  }

  passwordClicked() {
    this.setState((prevState) => {
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

    var baseIconStyle =
      {
        width: this._iconContainerSize,
        height: this._iconContainerSize,
        padding: 0,
        // transform: 'scale(0.83)' // icon boyutları 20 px olması için diğer türlü olmuyor.
      };
    var baseIconContainerStyle =
      {
        width: this._iconContainerSize,
        height: this._iconContainerSize,
        display: 'inline-block'
      };

    /* iconProperties={{width: '20px', height:'20px'}} */
    let rightIcons = [];

    var { type } = this.props;

    if (this.props.type == 'password') {
      var showPasswordColor;
      if (this.state.showPassword) {
        showPasswordColor = this.props.context.theme.boaPalette.pri500;
        type = 'text';
      } else {
        showPasswordColor = this.props.context.theme.boaPalette.base400;
        type = 'password';
      }
      !this.state.hideRightIcons && rightIcons.push(
        <div style={baseIconContainerStyle}>
          <IconButton
            style={baseIconStyle}
            ref={r => this.refs.buttons.push(r)}
            context={this.props.context}
            disabled={this.state.disabled}
            key={'right0'}
            dynamicIcon='RemoveRedEye'
            iconProperties={{ style: { color: showPasswordColor, width: this._iconSize, height:  this._iconSize  } }}
            onClick={this.passwordClicked.bind(this)}
            onBlur={this.onBlur}
            tabIndex='-1' />
        </div>
      );
    } else if (this.props.rightIconList && !this.state.hideRightIcons) {
      rightIcons = this.props.rightIconList.map((icon, index) => {
        return (
          <div style={Object.assign(baseIconContainerStyle, { marginLeft: this._iconMargin }, icon.iconContainerStyle)}>
            <IconButton
              {...icon}
              style={baseIconStyle}
              ref={r => this.refs.buttons.push(r)}
              context={this.props.context}
              // iconProperties={{ style: {  width: this._iconSize, height:  this._iconSize  } }}
              disabled={this.state.disabled}
              key={'right' + index}
              onBlur={this.onBlur}
              tabIndex='-1'
            />
          </div>
        );
      });
    }

    let leftIcons = [];
    if (this.props.leftIconList && !this.state.hideLeftIcons) {
      leftIcons = this.props.leftIconList.map((icon, index) => {
        return (
          <div style={Object.assign(baseIconContainerStyle, { marginRight: this._iconMargin }, icon.iconContainerStyle)}>
            <IconButton
              {...icon}
              style={baseIconStyle}
              ref={r => this.refs.buttons.push(r)}
              context={this.props.context}
              disabled={this.state.disabled}
              // iconProperties={{ style: {  width: this._iconSize, height:  this._iconSize  } }}
              key={'left' + index}
              onBlur={this.onBlur}
              tabIndex='-1'
            />
          </div>
        );
      });
    }

    var bInput = (this.props.type == 'numeric') ? this.renderBInputNumeric(type, leftIcons, rightIcons) : this.renderBInput(type, leftIcons, rightIcons);

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <div>
          {bInput}
        </div>
      </div>
    );
  }

  renderBInput(type, leftIcons, rightIcons) {
    const { context, ...others } = this.props;
    return <Input
      ref={r => this.binput = r}
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
    />;
  }

  renderBInputNumeric(type, leftIcons, rightIcons) {
    const { context, ...others } = this.props;
    return <InputNumeric
      ref={r => this.binput = r}
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
    />;
  }
}

export default InputAction;
