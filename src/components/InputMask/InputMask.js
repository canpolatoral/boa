import React from 'react';
import PropTypes from 'prop-types';
import PredefinedMask from './constants';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { Input } from '@boa/components/Input';
import detectCopyPaste from './detectCopyPaste';

@ComponentComposer
class InputMask extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    ...Input.propTypes,
    bottomRightInfo: PropTypes.string,
    bottomRightInfoEnable: PropTypes.bool,
    counterLabelShow: PropTypes.bool,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    inputType: PropTypes.string,
    mask: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    type: PropTypes.oneOf(['CreditCard', 'IBAN', 'MobilePhoneNumber', 'Custom']).isRequired,
    value: PropTypes.string,
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
    mask: 'aa nnn',
    inputType: 'text',
  };

  constructor(props, context) {
    super(props, context);
    this.setProps(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.currentMask = '';
    this.errorText = '';
    this.helperText = '';
    this.isShowErrorText = false;
    this.maxLength = -1;
    this.maskedMaxLength = -1;
    this.specialKey = false;
    this.isCorrectFormat = false;
    this.disabledCounterCharacter = ' ';
    this.hintText = '';
  }

  state = {
    value: this.props.value,
    saltValue: '',
    disabled: this.props.disabled,
    focussed: false,
  };

  setMaskProp(props) {
    if (props.type === 'Custom') {
      this.currentMask = props.mask;
    } else {
      this.currentMask = PredefinedMask.Type[props.type];
    }
  }

  setProps(props) {
    this.setMaskProp(props);

    if (props.helperText !== '') {
      this.helperText = props.helperText;
    } else {
      this.helperText = this.generateHelperText(this.currentMask);
    }

    // errorText verilmemiş ise infoText atanıyor.
    if (props.errorText !== '') {
      this.errorText = props.errorText;
    } else {
      this.errorText = this.helperText;
    }
  }

  // ComponentWillReceiveProps
  componentWillReceiveProps(nextProps) {
    if ((nextProps.mask != null || nextProps.type != null) && nextProps !== this.props) {
      this.setProps(nextProps);
    }

    if (nextProps.value != null && nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  // onchange event
  onChange(e) {
    const { currentMask, isCorrectFormat } = this;
    const value = e.target.value;
    const result = this.isCorrectFormatText(this.currentMask, value);

    const compareValue = this.snapshotValue || result.value;

    if (isCorrectFormat === true && compareValue && compareValue.length !== currentMask.length) {
      this.isCorrectFormat = false;
    }

    this.setState({ value: result.value, saltValue: result.saltValue }, () => this.runRender());

    if (this.props.onChange) {
      this.props.onChange(e, result.value, result.saltValue, this.isCorrectFormat);
    }
    if (this.props.onDynamicChange) {
      this.props.onDynamicChange(e);
    }
  }

  // Render force after added item to the text.
  runRender() {
    if (this.specialKey === false) {
      this.forceUpdate();
    }
  }

  // To Check Input Text Matches The Mask
  isCorrectFormatText(mask, text) {
    let newText = '';
    let saltText = '';
    let count = 0;
    this.isCorrectFormat = text.length > 0;

    for (let i = 0; i < mask.length; i++) {
      const m = mask[i];
      const isExist = PredefinedMask.Regex[m] !== undefined;

      const t = text[i - count];

      if (isExist === true && t !== undefined) {
        saltText += t;
      }

      if (isExist === false) {
        if (t !== undefined && t !== m) {
          newText += m;
          count += 1;
          // break;
          if (PredefinedMask.AllowSpecialKeys.indexOf(m) >= 0) {
            continue; // eslint-disable-line
          }
          this.isCorrectFormat = false;
        } else if (t !== undefined) {
          newText += t;
        }
      } else if (t !== undefined) {
        newText += t;
      }
    }

    return { value: newText, saltValue: saltText };
  }

  // onKeyDown Event.
  onKeyDown(e) {
    const key = e.key;
    const keyCode = e.keyCode || e.which;
    this.specialKey = PredefinedMask.AllowKeys.indexOf(keyCode) !== -1;

    const pressShortcut = detectCopyPaste(keyCode, e);

    if (pressShortcut === true) {
      return;
    }

    const currentValue = this.binput.getInstance().getValue();
    let currentValueLength = currentValue.length;

    if (this.currentMask.length === currentValueLength && this.specialKey === false) {
      e.preventDefault();
      return;
    }

    let typeOfMask = this.currentMask[currentValueLength];
    for (let i = currentValueLength; i < this.currentMask.length; i++) {
      typeOfMask = this.currentMask[i];
      const isExist = PredefinedMask.Regex[typeOfMask] !== undefined;
      if (isExist) {
        currentValueLength = i;
        break;
      }
    }
    const regex = PredefinedMask.Regex[typeOfMask];

    if (regex != null && regex.test(key) === false && this.specialKey === false) {
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
    const { state } = snapshot;
    this.setState({ ...state });
    // this.snapshotValue = snapshot;
  }

  // onFocus
  onFocus(e) {
    this.setState({ focussed: true });
    if (this.props.type === 'IBAN' && (this.state.value === '' || this.state.value.length === 0)) {
      this.setState({ value: 'TR' });
    }
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  // onBlur
  onBlur(e) {
    this.setState({ focussed: false });
    if (this.props.type === 'IBAN' && this.state.value === 'TR') {
      this.setState({ value: '' });
    }
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  validateConstraint() {
    return this.binput ? this.binput.getInstance().validateConstraint() : true;
  }

  setCounter() {
    if (this.props.type === 'MobilePhoneNumber') {
      this.maxLength = undefined;
      return;
    }

    if (this.props.maxLength === -1) {
      let text = '';
      if (this.currentMask !== '') {
        text = this.currentMask.split(this.disabledCounterCharacter);
        text = text.join('');
      }
      this.maxLength = this.currentMask.length;
      this.maskedMaxLength = text.length;
    } else {
      this.maxLength = this.props.maxLength;
    }
  }

  /**
   * generateHelperText
   * @param {*} text
   */
  generateHelperText(text) {
    if (text == null || text.length === 0) {
      return null;
    }
    if (this.currentMask !== '') {
      text = this.currentMask;
      PredefinedMask.MaskCharacter.forEach(element => {
        text = text.split(element);
        text = text.join('#');
      });
    }
    return text;
  }

  // render
  render() {
    const { context, inputStyle, type, ...other } = this.props;
    const { value, focussed } = this.state;

    let inputValue = this.snapshotValue || this.state.value;
    let errorTextResult;

    const result = this.isCorrectFormatText(this.currentMask, inputValue);
    const compareValue = this.snapshotValue || result.value;

    inputValue = result.value || inputValue;

    if (this.isCorrectFormat && compareValue && compareValue.length !== this.currentMask.length) {
      this.isCorrectFormat = false;
    }

    if (this.isCorrectFormat === false && value !== '' && focussed === false) {
      errorTextResult = this.errorText;
    }

    let inputStyle2 = Object.assign({}, inputStyle);

    if (type === 'IBAN' && this.state.value !== '' && this.isCorrectFormat === true) {
      const filledTextSize = 13;
      inputStyle2 = Object.assign({ fontSize: filledTextSize }, inputStyle);
    }

    // iban ve kredi kartı için bilgi metni olmayacak.
    if (type === 'IBAN' || (type === 'CreditCard' && this.props.helperText === '')) {
      this.helperText = '';
    }

    // hint verilmemiş ise floating label değeri atanıyor.
    if (this.props.hintText) {
      this.hintText = this.props.hintText;
    } else {
      this.hintText = this.props.floatingLabelText;
    }

    this.setCounter();

    return (
      <Input
        context={context}
        ref={r => (this.binput = r)}
        {...other}
        type={this.props.inputType}
        disabled={this.state.disabled}
        errorText={this.props.errorText || errorTextResult}
        helperText={this.state.focussed ? this.helperText : ''}
        hintText={this.hintText}
        inputStyle={inputStyle2}
        maxLength={this.maxLength}
        maskedMaxLength={this.maskedMaxLength}
        value={inputValue}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        validationMessageStyleActive
        disabledCounterCharacter=" "
        showCounter
      />
    );
  }
}

export default InputMask;
