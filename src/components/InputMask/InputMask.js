import React from 'react'; import PropTypes from 'prop-types';
import PredefinedMask from './constants';

import { ComponentBase, ComponentComposer } from '@boa/base';
import { Input } from '@boa/components/Input';


@ComponentComposer
class InputMask extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    ...Input.propTypes,
    counterLabelShow: PropTypes.bool,
    disabled: PropTypes.bool,
    mask: PropTypes.string,
    type: PropTypes.oneOf(['CreditCard', 'IBAN', 'MobilePhoneNumber', 'Custom']).isRequired,
    value: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    bottomRightInfoEnable: PropTypes.bool,
    bottomRightInfo: PropTypes.string,
    errorText: PropTypes.string
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    ...Input.defaultProps,
    counterLabelShow: true,
    disabled: false,
    fullWidth: true,
    // errorText: '',
    helperText: '',
    maxLength: -1,
    noWrap: true,
    value: '',
    type: 'Custom',
    mask: 'aa nnn'
  }

  constructor(props, context) {
    super(props, context);

    this._setProps(props);

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  state = {
    value: this.props.value,
    saltValue: '',
    disabled: this.props.disabled,
    focussed: false
  };

  _currentMask = '';
  _errorText = '';
  _helperText = '';
  _isShowErrorText = false;
  _maxLength = -1;
  _maskedMaxLength = -1;
  _specialKey = false;
  _isCorrectFormat = false;
  _disabledCounterCharacter = ' ';
  _hintText = '';

  _setMaskProp(props) {
    if (props.type == 'Custom') {
      this._currentMask = props.mask;
    } else {
      this._currentMask = PredefinedMask.Type[props.type];
    }
  }

  // _setProps
  _setProps(props) {
    this._setMaskProp(props);

    if (props.helperText != '') {
      this._helperText = props.helperText;
    }
    else {
      this._helperText = this.generateHelperText(this._currentMask);
    }

    // errorText verilmemiş ise infoText atanıyor.
    if (props.errorText != '') {
      this._errorText = props.errorText;
    }
    else {
      this._errorText = this._helperText;
    }

  }

  // ComponentWillReceiveProps
  componentWillReceiveProps(nextProps) {
    if ((nextProps.mask != null || nextProps.type != null) && nextProps != this.props) {
      this._setProps(nextProps);
    }

    if (nextProps.value != null && nextProps.value != this.props.value) {
      this.setState({ value: nextProps.value });
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  // onchange event
  _onChange(e) {
    let value = e.target.value;
    let result = this._isCorrectFormatText(this._currentMask, value);

    let compareValue = this.snapshotValue || result.value;
    if (this._isCorrectFormat == true && compareValue != undefined && compareValue.length != this._currentMask.length) {
      this._isCorrectFormat = false;
    }

    this.setState({ value: result.value, saltValue: result.saltValue }, () => this._runRender());

    if (this.props.onChange) {
      this.props.onChange(e, result.value, result.saltValue, this._isCorrectFormat);
    }
    this.props.onDynamicChange && this.props.onDynamicChange(e);
  }

  // Render force after added item to the text.
  _runRender() {
    if (this._specialKey == false) {
      this.forceUpdate();
    }
  }

  // To Check Input Text Matches The Mask
  _isCorrectFormatText(mask, text) {
    var newText = '';
    var saltText = '';
    var count = 0;
    this._isCorrectFormat = text.length > 0;

    for (var i = 0; i < mask.length; i++) {
      var m = mask[i];
      var isExist = PredefinedMask.Regex[m] != undefined;

      var t = text[i - count];

      if (isExist == true && t != undefined) {
        saltText += t;
      }

      if (isExist == false) {
        if (t != undefined && t != m) {
          newText += m;
          count += 1;
          // break;
          if (PredefinedMask.AllowSpecialKeys.indexOf(m) >= 0) {
            continue;
          }
          this._isCorrectFormat = false;
        }
        else if (t != undefined) {
          newText += t;
        }
      } // isExist = true
      else if (t != undefined) {
        newText += t;
      }
    }

    return { value: newText, saltValue: saltText };
  }

  // To understand special key pressed.
  _detectCopyPaste(keyCode, event) {
    let result = false;
    let charCode = String.fromCharCode(keyCode).toLowerCase();

    if (event.ctrlKey && charCode === 'c') {
      // this.debugLog('Ctrl + C pressed');
      result = true;
    } else if (event.ctrlKey && charCode === 'v') {
      // this.debugLog('Ctrl + V pressed');
      result = true;
    } else if (event.ctrlKey && charCode === 'a') {
      // this.debugLog('Ctrl + A pressed');
      result = true;
    } else if (event.metaKey && charCode === 'c') {
      // this.debugLog('Cmd + C pressed');
      result = true;
    } else if (event.metaKey && charCode === 'v') {
      // this.debugLog('Cmd + V pressed');
      result = true;
    }

    return result;
  }

  // onKeyDown Event.
  _onKeyDown(e) {
    const key = e.key;
    const keyCode = e.keyCode || e.which;
    this._specialKey = PredefinedMask.AllowKeys.indexOf(keyCode) != -1;

    var pressShortcut = this._detectCopyPaste(keyCode, e);

    if (pressShortcut == true) {
      return;
    }

    var currentValue = this.binput.getInstance().getValue();
    var currentValueLength = currentValue.length;

    if (this._currentMask.length == currentValueLength && this._specialKey == false) {
      e.preventDefault();
      // _onKeyDown > reached max number of key count.
      return;
    }
    var typeOfMask = this._currentMask[currentValueLength];
    for (let i = currentValueLength; i < this._currentMask.length; i++) {
      typeOfMask = this._currentMask[i];
      var isExist = PredefinedMask.Regex[typeOfMask] != undefined;
      if (isExist) {
        currentValueLength = i;
        break;
      }
    }
    var regex = PredefinedMask.Regex[typeOfMask];

    if (regex != null && regex.test(key) == false && this._specialKey == false) {
      e.preventDefault();
      return;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  // To get value
  getValue() {
    return { value: this.state.value, saltValue: this.state.saltValue };
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  resetValue() {
    return this.setState({ value: this.props.defaultValue });
  }


  // getSnapshot for session management.
  getSnapshot() {
    // return this.getValue();
    return { state: this.state };
  }

  // setSnapshot for session management.
  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
    // this.snapshotValue = snapshot;
  }

  // _onFocus
  _onFocus(e) {
    this.setState({ focussed: true });
    if (this.props.type == 'IBAN' && (this.state.value == '' || this.state.value.length == 0)) {
      this.setState({ value: 'TR' });
    }
    this.props.onFocus && this.props.onFocus(e);
  }

  // _onBlur
  _onBlur(e) {
    this.setState({ focussed: false });
    if (this.props.type == 'IBAN' && (this.state.value == 'TR')) {
      this.setState({ value: '' });
    }
    this.props.onBlur && this.props.onBlur(e);
  }

  validateConstraint() {
    return this.binput ? this.binput.getInstance().validateConstraint() : true;
  }

  setCounter() {

    if (this.props.type == 'MobilePhoneNumber') {
      this._maxLength = undefined;
      return;
    }

    if (this.props.maxLength == -1) {

      var text = '';
      if (this._currentMask != '') {
        text = this._currentMask.split(this._disabledCounterCharacter);
        text = text.join('');
      }
      this._maxLength = this._currentMask.length;
      this._maskedMaxLength = text.length;

    }
    else {
      this._maxLength = this.props.maxLength;
    }
  }

  /**
   * generateHelperText
   * @param {*} text
   */
  generateHelperText(text) {
    if (text == null || text.length == 0) {
      return null;
    }
    if (this._currentMask != '') {
      text = this._currentMask;
      PredefinedMask.MaskCharacter.forEach((element) => {
        text = text.split(element);
        text = text.join('#');
      });
    }
    return text;
  }


  // render
  render() {
    const {
      context,
      inputStyle,
      type,
      ...other
    } = this.props;

    let inputValue = this.snapshotValue || this.state.value;
    let result = this._isCorrectFormatText(this._currentMask, inputValue);
    inputValue = result.value || inputValue;
    let compareValue = this.snapshotValue || result.value;
    if (this._isCorrectFormat == true && compareValue != undefined && compareValue.length != this._currentMask.length) {
      this._isCorrectFormat = false;
    }

    var errorTextResult =
      (this._isCorrectFormat == false
        && this.state.value != ''
        && this.state.focussed == false
      ) ? this._errorText : '';

    var inputStyle2 = Object.assign({}, inputStyle);
    if (type == 'IBAN' && this.state.value != '' && this._isCorrectFormat == true) {
      const filledTextSize = 13;
      inputStyle2 = Object.assign({ fontSize: filledTextSize }, inputStyle);
    }

    // iban ve kredi kartı için bilgi metni olmayacak.
    if (type == 'IBAN' || type == 'CreditCard' && this.props.helperText == '') {
      this._helperText = '';
    }

    // hint verilmemiş ise floating label değeri atanıyor.
    if (this.props.hintText) {
      this._hintText = this.props.hintText;
    }
    else {
      this._hintText = this.props.floatingLabelText;
    }

    this.setCounter();

    return (
      <Input
        type='text'
        context={context}
        ref={r => this.binput = r}
        {...other}
        disabled={this.state.disabled}
        errorText={this.props.errorText ||errorTextResult}
        helperText={this.state.focussed ? this._helperText : ''}
        hintText={this._hintText}
        inputStyle={inputStyle2}
        maxLength={this._maxLength}
        maskedMaxLength={this._maskedMaxLength}
        value={inputValue}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        validationMessageStyleActive={true}
        disabledCounterCharacter=' '
        showCounter={true}
      />
    );
  }
}

export default InputMask;
