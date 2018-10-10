import React from 'react'; import PropTypes from 'prop-types';
import { ComponentBase, ComponentComposer } from 'b-component';
import { Input } from 'b-input';
import { Localization } from 'b-localization';

@ComponentComposer
class InputNumeric extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    ...Input.propTypes,
    format: PropTypes.string,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    step: PropTypes.number
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    ...Input.defaultProps,
    onFocus: null,
    onBlur: null,
    onChange: null,
    hintText: '',
    format: 'D',
    // errorText: '',
    floatingLabelText: '',
    disabled: false,
    minValue: Number.NEGATIVE_INFINITY,
    maxValue: Number.MAX_VALUE,
    maxLength: null,
    step: 1
  };


  state = {
    formattedValue: null,
    caretPosition: null,
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
    var tempValue = this.props.value || this.props.defaultValue;
    this.state.formattedValue = this.getFormattedValue(tempValue);
  }

  componentWillReceiveProps(nextProps) {
    // null ise kasıtlı siliniyordur, silmeli.
    // undefined ise value geçilmemiştir, değişmemeli.
    // diğer durumlarda prop yada state'ten farklı gelmişse değişmeli.
    if ((nextProps.value === null) || (nextProps.value !== undefined && (nextProps.value !== this.props.value || nextProps.value !== this.getValue()))) {
      this.setState({ formattedValue: this.getFormattedValue(nextProps.value, nextProps.format) });
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  componentDidUpdate() {
    if (this.state.caretPosition !== null) {
      let inputElement = this.binput.getInstance().textField;
      if (inputElement) {
        inputElement.setSelectionRange(this.state.caretPosition, this.state.caretPosition);
      }
    }
  }

  onKeyDown(e) {
    const keyCode = e.keyCode || e.charCode || e.which;
    var delimiters = Localization.getDelimiters();
    var isTextCursorMoveKey = keyCode == 35 || keyCode == 36 || keyCode == 37 || keyCode == 39; // Home, end, left and right arrows
    var isModifierKey = e.shiftKey || e.altKey || e.ctrlKey;
    var isModifierUsedForClipboard = ((keyCode == 65 || keyCode == 86 || keyCode == 67) && (e.ctrlKey === true || e.metaKey === true)); // Ctrl-A, Ctrl-V, Ctrl-C
    var isModifierUsedForSelection = (e.shiftKey && isTextCursorMoveKey); // shift-home, shift-end, shift-left, shift-right
    var isNumberKey = keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105; // Numbers and numeric keypad
    var isTextModifyKey = keyCode == 8 || keyCode == 46; // Backspace And del
    var islostFocusKey = keyCode == 9; // Tab
    var isNotAffectingValidKey = keyCode == 45; // Ins
    var isSeperatorKey = ((keyCode == 188 || keyCode == 110) && delimiters.decimal == ',') || (keyCode == 190 && delimiters.decimal == '.'); // comma and point;
    var isSignChangeKey = keyCode == 189 || keyCode == 109; // dash and subtract
    var isIncreaseDecreaseKey = e.keyCode === 38 || e.keyCode === 40; // upper / lower

    var returnValue = false;
    var tempValue;
    var numericNewValue;

    if (isModifierKey) {
      if (isModifierUsedForClipboard || isModifierUsedForSelection) {
        returnValue = true;
      }
      else {
        returnValue = false;
      }
    }
    else if (isNumberKey) {
      var addedNumber = String.fromCharCode((96 <= keyCode && keyCode <= 105) ? keyCode - 48 : keyCode);
      var oldValue = this.state.formattedValue ? this.state.formattedValue : '';
      var newFormattedValue = oldValue.substring(0, e.target.selectionStart) + addedNumber + oldValue.substring(e.target.selectionEnd);
      if (this.getFormattedValue(this.state.formattedValue) != this.getFormattedValue(newFormattedValue)) {
        numericNewValue = this.getParsedValue(newFormattedValue);
        if (numericNewValue >= this.props.minValue && numericNewValue <= this.props.maxValue) returnValue = true;
      }
    }
    else if (islostFocusKey || isNotAffectingValidKey || isTextCursorMoveKey) {
      returnValue = true;
    }
    else if (isTextModifyKey) {
      tempValue = this.binput.getInstance().getValue();
      if (e.target.selectionStart == e.target.selectionEnd) {
        var caretPosition = e.target.selectionStart;
        if (keyCode == 8) { // if key is Backspace
          if (caretPosition == 0) returnValue = false; // if cursor is at the first character, then do nothing
          else if (tempValue[caretPosition - 1] == delimiters.thousands) { // if the cursor on delimiters do nothing and jump cursor over it
            returnValue = false;
            this.setState({ caretPosition: caretPosition - 1 });
          }
          else returnValue = true;
        }
        else if (tempValue[caretPosition] == delimiters.thousands) { // if the key is delete again jump over delimiters
          returnValue = false;
          this.setState({ caretPosition: caretPosition + 1 });
        }
        else returnValue = true;
      }
      else returnValue = true;
    }
    else if (isSeperatorKey && this.props.format != 'D') { // if format needs seperator then check it
      tempValue = this.binput.getInstance().getValue();
      if (!tempValue || tempValue.indexOf(delimiters.decimal) != -1) returnValue = false; // seperator cannot be first character and cannot be more than one
      else returnValue = true;
    }
    else if (isSignChangeKey) { // if sign key pressed add it
      tempValue = null;
      if (this.state.formattedValue.indexOf('-') != -1) {
        tempValue = this.state.formattedValue.replace('-', '');
      }
      else {
        tempValue = '-' + this.state.formattedValue;
      }

      numericNewValue = this.getParsedValue(tempValue);
      caretPosition = e.target.selectionStart;
      if (numericNewValue >= this.props.minValue && numericNewValue <= this.props.maxValue) {
        if (tempValue.indexOf('-') != -1) this.setState({ caretPosition: caretPosition + 1});
        this.setState({ formattedValue: tempValue });
      }
    }
    else if (isIncreaseDecreaseKey) {
      if (this.state.formattedValue !== null && this.props.step) {
        var numericValue = this.getParsedValue(this.state.formattedValue);
        numericValue += (e.keyCode == 38 ? this.props.step : -1 * this.props.step);
        if (numericValue >= this.props.minValue && numericValue <= this.props.maxValue) {
          this.setState({ formattedValue: this.getFormattedValue(numericValue) });
        }
      }
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }

    if (!returnValue && e.preventDefault) e.preventDefault();
    return returnValue;
  }

  getValue() {
    return this.getParsedValue(this.binput.getInstance().getValue());
  }

  resetValue() {

    this.setState({
      formattedValue: this.getFormattedValue(this.props.defaultValue)
    });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  getSnapshot() {
    return this.state.formattedValue;
  }

  setSnapshot(snapshot) {
    this.setState({ formattedValue: snapshot });
  }

  onChange(e) {
    var val = e.target.value;
    var caretPosition = e.target.selectionStart;
    var delimiters = Localization.getDelimiters();
    var delimitersCount = (val.substring(0, caretPosition).match(new RegExp('[' + delimiters.thousands + ']', 'g')) || []).length;
    var formattedValue = null;

    if (this.checkNumberFormatIsValid(val)) {
      formattedValue = this.getFormattedValue(val);
    }

    this.setState({ formattedValue: formattedValue });

    if (formattedValue) {
      var delimitersCountAfterFormat = (formattedValue.substring(0, caretPosition).match(new RegExp('[' + delimiters.thousands + ']', 'g')) || []).length;
      this.setState({ caretPosition: caretPosition + delimitersCountAfterFormat - delimitersCount });
    }
    else {
      this.binput.getInstance().textField.value = ''; // I also dont want to do this :) Bc of paste non numeric string this is done.
      this.forceUpdate();
    }

    this.props.onChange && this.props.onChange(e, this.getParsedValue(formattedValue));
  }

  checkNumberFormatIsValid(value) {
    if (!value || value == '' || value == '-') return true;
    if (typeof value === 'string') {
      var delimiters = Localization.getDelimiters();
      if (value.indexOf(delimiters.thousands + delimiters.thousands) != -1) return false;
      var tempValue = value.replace(new RegExp('[' + delimiters.thousands + ']', 'g'), '');
      if (this.props.format != 'D' && tempValue.indexOf(delimiters.decimal) != -1) {
        var splittedValues = tempValue.split(delimiters.decimal);
        if (splittedValues.length == 2 && !isNaN(Number(splittedValues[0])) && (splittedValues[1] == '' || !isNaN(Number(splittedValues[1])))) {
          return true;
        }
        else return false;
      }
      else {
        return !isNaN(Number(tempValue));
      }
    }
    return true;
  }

  getParsedValue(value) {
    if (value) {
      var delimiters = Localization.getDelimiters();
      var tempValue = typeof value === 'number' ? value : value.replace(new RegExp('[' + delimiters.thousands + ']', 'g'), '');
      var numberValue = this.props.format == 'D' ? Localization.getIntegerValue(tempValue) : Localization.getFloatValue(tempValue);
      if (!isNaN(numberValue)) return numberValue;
    }
    return null;
  }

  getFormattedValue(value, format) {
    let nextFormat = format ? format : this.props.format;
    if (value === undefined) {
      return null;
    }
    if (value === null || value === '') {
      if (this.binput) {
        this.binput.getInstance().textField.value = ''; // I also dont want to do this :) Bc of paste non numeric string this is done.
        this.forceUpdate();
        return '';
      }
    }

    if (typeof value === 'string') {
      if (!value || value == '' || value == '-') return value;
      var delimiters = Localization.getDelimiters();
      if (nextFormat != 'D') {
        var tempValue = value.replace(new RegExp('[' + delimiters.thousands + ']', 'g'), '');
        if (tempValue.indexOf(delimiters.decimal) != -1) {
          var splittedValues = tempValue.split(delimiters.decimal);
          var formatted = Localization.formatCurrency(splittedValues[0], nextFormat);
          var splittedAfterFormat = formatted.split(delimiters.decimal);
          return splittedAfterFormat[0] + delimiters.decimal +
            (splittedAfterFormat[1].length > splittedValues[1].length ? splittedValues[1] : splittedValues[1].substring(0, splittedAfterFormat[1].length));
        }
        else {
          tempValue = Localization.formatCurrency(tempValue, nextFormat);
          if (tempValue.indexOf(delimiters.decimal) != -1) return tempValue.substring(0, tempValue.indexOf(delimiters.decimal));
          else return tempValue;
        }
      }
      else {
        return Localization.formatCurrency(value, nextFormat);
      }
    }
    else {
      return Localization.formatCurrency(value, nextFormat);
    }
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  focus() {
    this.binput.getInstance().focus();
  }

  validateConstraint() {
    return this.binput && this.binput.getInstance() ? this.binput.getInstance().validateConstraint() : true;
  }

  render() {
    const { context, ...others } = this.props;
    return (
      <Input
        ref={r => this.binput = r}
        context={context}
        {...others}
        type='text'
        errorText={this.props.errorText}
        value={this.state.formattedValue}
        onChange={this.onChange.bind(this)}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
        disabled={this.state.disabled}
      />
    );
  }
}

export default InputNumeric;
