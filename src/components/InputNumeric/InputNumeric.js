/* eslint-disable no-restricted-globals, max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { Input } from '@boa/components/Input';
import { Localization } from '@boa/utils';

@ComponentComposer
class InputNumeric extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    ...Input.propTypes,
    caretPosition: PropTypes.number,
    format: PropTypes.string,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    step: PropTypes.number,
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
    step: 1,
  };

  state = {
    formattedValue: null,
    caretPosition: null,
    disabled: this.props.disabled,
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    const tempValue = this.props.value || this.props.defaultValue;
    this.state.formattedValue = this.getFormattedValue(tempValue);
  }

  componentWillReceiveProps(nextProps) {
    // null ise kasıtlı siliniyordur, silmeli.
    // undefined ise value geçilmemiştir, değişmemeli.
    // diğer durumlarda prop yada state'ten farklı gelmişse değişmeli.
    const { format, value, disabled, caretPosition } = nextProps;
    let shouldValueChange = false;

    if (value === null) {
      shouldValueChange = true;
    } else if (value !== undefined && (value !== this.props.value || value !== this.getValue())) {
      shouldValueChange = true;
    }

    if (shouldValueChange) {
      this.setValue(value, format);
    }

    if (disabled !== this.props.disabled) {
      this.setState({ disabled });
    }

    if (this.props.caretPosition !== caretPosition) {
      this.setState({ caretPosition });
    }
  }

  componentDidUpdate() {
    if (this.state.caretPosition !== null) {
      const inputElement = this.binput.getInstance().textField;
      /* istanbul ignore else */
      if (inputElement) {
        inputElement.setSelectionRange(this.state.caretPosition, this.state.caretPosition);
      }
    }
  }

  onKeyDown(e) {
    let caretPosition;
    const keyCode = e.keyCode || e.charCode || e.which;
    const delimiters = Localization.getDelimiters();
    // Home, end, left and right arrows
    const isTextCursorMoveKey = [35, 36, 37, 39].includes(keyCode);
    const isModifierKey = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
    // Ctrl-A, Ctrl-V, Ctrl-C
    const isModifierUsedForClipboard = [65, 67, 86].includes(keyCode) && (e.ctrlKey === true || e.metaKey === true);
    // shift-home, shift-end, shift-left, shift-right
    const isModifierUsedForSelection = e.shiftKey && isTextCursorMoveKey;
    // Numbers and numeric keypad
    const isNumberKey = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
    const isTextModifyKey = keyCode === 8 || keyCode === 46; // Backspace And del
    const islostFocusKey = keyCode === 9; // Tab
    const isNotAffectingValidKey = keyCode === 45; // Ins
    const isSignChangeKey = keyCode === 189 || keyCode === 109; // dash and subtract
    const isIncreaseDecreaseKey = e.keyCode === 38 || e.keyCode === 40; // upper / lower

    let isSeperatorKey = false;
    if ((keyCode === 188 || keyCode === 110) && delimiters.decimal === ',') {
      isSeperatorKey = true;
    } else if (keyCode === 190 && delimiters.decimal === '.') {
      isSeperatorKey = true;
    }
    let returnValue = false;
    let tempValue;
    let numericNewValue;

    if (isModifierKey) {
      if (isModifierUsedForClipboard || isModifierUsedForSelection) {
        returnValue = true;
      } else {
        returnValue = false;
      }
    } else if (isNumberKey) {
      const characterCode = (keyCode >= 96 && keyCode <= 105) ? keyCode - 48 : keyCode;
      const addedNumber = String.fromCharCode(characterCode);
      const oldValue = this.state.formattedValue || '';
      const newFormattedValue =
        oldValue.substring(0, e.target.selectionStart) +
        addedNumber +
        oldValue.substring(e.target.selectionEnd); // eslint-disable-line

      const formattedValue = this.getFormattedValue(this.state.formattedValue);

      if (formattedValue !== this.getFormattedValue(newFormattedValue)) {
        numericNewValue = this.getParsedValue(newFormattedValue);
        if (numericNewValue >= this.props.minValue && numericNewValue <= this.props.maxValue) {
          returnValue = true;
        }
      }
    } else if (islostFocusKey || isNotAffectingValidKey || isTextCursorMoveKey) {
      returnValue = true;
    } else if (isTextModifyKey) {
      tempValue = this.binput.getInstance().getValue();
      if (e.target.selectionStart === e.target.selectionEnd) {
        caretPosition = e.target.selectionStart;
        if (keyCode === 8) {
          // if key is Backspace
          if (caretPosition === 0) {
            // if cursor is at the first character, then do nothing
            returnValue = false;
          } else if (tempValue[caretPosition - 1] === delimiters.thousands) {
            // if the cursor on delimiters do nothing and jump cursor over it
            returnValue = false;
            this.setState({ caretPosition: caretPosition - 1 });
          } else returnValue = true;
        } else if (tempValue[caretPosition] === delimiters.thousands) {
          // if the key is delete again jump over delimiters
          returnValue = false;
          this.setState({ caretPosition: caretPosition + 1 });
        } else returnValue = true;
      } else returnValue = true;
    } else if (isSeperatorKey && this.props.format !== 'D') {
      // if format needs seperator then check it
      tempValue = this.binput.getInstance().getValue();
      if (!tempValue || tempValue.indexOf(delimiters.decimal) !== -1) {
        // seperator cannot be first character and cannot be more than one
        returnValue = false;
      } else returnValue = true;
    } else if (isSignChangeKey) {
      // if sign key pressed add it
      tempValue = null;
      if (this.state.formattedValue.indexOf('-') !== -1) {
        tempValue = this.state.formattedValue.replace('-', '');
      } else {
        tempValue = `-${this.state.formattedValue}`;
      }

      numericNewValue = this.getParsedValue(tempValue);
      caretPosition = e.target.selectionStart;
      if (numericNewValue >= this.props.minValue && numericNewValue <= this.props.maxValue) {
        if (tempValue.indexOf('-') !== -1) this.setState({ caretPosition: caretPosition + 1 });
        this.setState({ formattedValue: tempValue });
      }
    } else if (isIncreaseDecreaseKey) {
      if (this.state.formattedValue !== null && this.props.step) {
        let numericValue = this.getParsedValue(this.state.formattedValue);
        numericValue += e.keyCode === 38 ? this.props.step : -1 * this.props.step;
        if (numericValue >= this.props.minValue && numericValue <= this.props.maxValue) {
          this.setState({ formattedValue: this.getFormattedValue(numericValue) });
        }
      }
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }

    if (process.env.NODE_ENV === 'test') {
      this.onKeyDownResult = returnValue;
    }

    /* istanbul ignore else */
    if (!returnValue && e.preventDefault) {
      e.preventDefault();
    }

    return returnValue;
  }

  getValue() {
    return this.getParsedValue(this.binput.getInstance().getValue());
  }

  setValue(value, format) {
    if (!format) {
      format = this.props.format;
    }
    this.setState({ formattedValue: this.getFormattedValue(value, format) });
  }

  resetValue() {
    this.setState({
      formattedValue: this.getFormattedValue(this.props.defaultValue),
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
    const val = e.target.value;
    const caretPosition = e.target.selectionStart;
    const delimiters = Localization.getDelimiters();
    const delimitersCount = (
      val.substring(0, caretPosition).match(new RegExp(`[${delimiters.thousands}]`, 'g')) || []
    ).length; // eslint-disable-line
    let formattedValue = null;

    if (this.checkNumberFormatIsValid(val)) {
      formattedValue = this.getFormattedValue(val);
    }

    this.setState({ formattedValue });

    if (formattedValue) {
      // eslint-disable-next-line
      const delimitersCountAfterFormat = (
        formattedValue
          .substring(0, caretPosition)
          .match(new RegExp(`[${delimiters.thousands}]`, 'g')) || []
      ).length;
      const newCaretPosition = caretPosition + delimitersCountAfterFormat - delimitersCount;
      this.setState({ caretPosition: newCaretPosition });
    } else {
      // I also dont want to do this :) Bc of paste non numeric string this is done.
      this.binput.getInstance().textField.value = '';
      this.forceUpdate();
    }

    if (this.props.onChange) {
      this.props.onChange(e, this.getParsedValue(formattedValue));
    }
  }

  checkNumberFormatIsValid(value) {
    if (!value || value === '' || value === '-') return true;
    if (typeof value === 'string') {
      const delimiters = Localization.getDelimiters();
      if (value.indexOf(delimiters.thousands + delimiters.thousands) !== -1) return false;
      const tempValue = value.replace(new RegExp(`[${delimiters.thousands}]`, 'g'), '');
      if (this.props.format !== 'D' && tempValue.indexOf(delimiters.decimal) !== -1) {
        const splittedValues = tempValue.split(delimiters.decimal);
        if (
          splittedValues.length === 2 &&
          !isNaN(Number(splittedValues[0])) &&
          (splittedValues[1] === '' || !isNaN(Number(splittedValues[1])))
        ) {
          return true;
        }
        return false;
      }

      return !isNaN(Number(tempValue));
    }
    return true;
  }

  getParsedValue(value) {
    if (value) {
      const delimiters = Localization.getDelimiters();
      const tempValue =
        typeof value === 'number'
          ? value
          : value.replace(new RegExp(`[${delimiters.thousands}]`, 'g'), '');
      const numberValue =
        this.props.format === 'D'
          ? Localization.getIntegerValue(tempValue)
          : Localization.getFloatValue(tempValue);
      if (!isNaN(numberValue)) return numberValue;
    }
    return null;
  }

  getFormattedValue(value, format) {
    const nextFormat = format || this.props.format;

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
      if (!value || value === '' || value === '-') {
        return value;
      }

      const delimiters = Localization.getDelimiters();
      if (nextFormat !== 'D') {
        let tempValue = value.replace(new RegExp(`[${delimiters.thousands}]`, 'g'), '');
        if (tempValue.indexOf(delimiters.decimal) !== -1) {
          const splittedValues = tempValue.split(delimiters.decimal);
          const formatted = Localization.formatCurrency(splittedValues[0], nextFormat);
          const splittedAfterFormat = formatted.split(delimiters.decimal);
          return (
            splittedAfterFormat[0] +
            delimiters.decimal +
            (splittedAfterFormat[1].length > splittedValues[1].length
              ? splittedValues[1]
              : splittedValues[1].substring(0, splittedAfterFormat[1].length))
          );
        }

        tempValue = Localization.formatCurrency(tempValue, nextFormat);
        if (tempValue.indexOf(delimiters.decimal) !== -1) {
          return tempValue.substring(0, tempValue.indexOf(delimiters.decimal));
        }
        return tempValue;
      }

      return Localization.formatCurrency(value, nextFormat);
    }

    return Localization.formatCurrency(value, nextFormat);
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    this.state.caretPosition = null;
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  focus() {
    this.binput.getInstance().focus();
  }

  validateConstraint() {
    return this.binput && this.binput.getInstance()
      ? this.binput.getInstance().validateConstraint()
      : true;
  }

  render() {
    const { context, ...others } = this.props;
    return (
      <Input
        ref={r => (this.binput = r)}
        context={context}
        {...others}
        type="text"
        errorText={this.props.errorText}
        value={this.state.formattedValue}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        disabled={this.state.disabled}
      />
    );
  }
}

export default InputNumeric;
