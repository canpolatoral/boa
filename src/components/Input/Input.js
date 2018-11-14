import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { findDOMNode } from 'react-dom';
import MuiInput from '@material-ui/core/Input';
import MuiInputLabel from '@material-ui/core/InputLabel';
import MuiInputAdornment from '@material-ui/core/InputAdornment';
import MuiFormControl from '@material-ui/core/FormControl';
import MuiFormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import { ComponentComposer, EditorBase } from '@boa/base';
import { getTimeInfo, hasValue } from './utils';

function baseStyles(theme) {
  return {
    input: {
      color: theme.boaPalette.base450,
      fontSize: 14,
      caretColor: theme.boaPalette.pri500,
      padding: 0,
      marginBottom: 3,
      minHeight: 19,
    },
    inputLabel: {
      fontSize: 14,
      width: '100%',
    },

    inputLabeRootBase: {
      fontSize: 14,
      width: '100%',
      marginTop: -4,
      paddingTop: 2,
      transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'}`,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  };
}

const styles = theme => ({
  input: Object.assign(baseStyles(theme).input, {
    marginRight: theme.direction === 'rtl' ? 0 : null,
    marginLeft: theme.direction === 'ltr' ? 0 : null,
  }),
  multiline: Object.assign(baseStyles(theme).input, {
    padding: '3px 0 3px',
  }),

  inputDisabled: {
    // underline da kullandığı için içi boş olsa da gerekli
  },

  inputfocused: {
    // underline da kullandığı için içi boş olsa da gerekli
  },

  inputError: Object.assign(baseStyles(theme).input, {}),

  inputUnderline: {
    '&:after': {
      borderBottom: `2px solid ${theme.boaPalette.pri500}`,
    },

    '&:before': {
      borderBottom: `1px solid ${theme.boaPalette.base250}`,
    },

    '&:hover:not($inputDisabled):not($inputfocused):not($inputError):before': {
      borderBottom: `2px solid ${theme.boaPalette.base250}`,
    },
  },

  inputUnderlineRequired: {
    '&:after': {
      borderBottom: `2px solid ${theme.boaPalette.pri500}`,
    },

    '&:before': {
      borderBottom: `1px solid ${theme.boaPalette.obli300}`,
    },

    '&:hover:not($inputDisabled):not($inputfocused):not($inputError):before': {
      borderBottom: `2px solid ${theme.boaPalette.obli300}`,
    },
  },

  inputType: {
    height: 'auto', // pasword fix
  },

  inputLabelShink: Object.assign(baseStyles(theme).inputLabel, {
    paddingTop: '2px !important',
    marginTop: '0px !important',
    color: theme.boaPalette.pri500,
  }),

  inputLabelRoot: Object.assign(baseStyles(theme).inputLabeRootBase, {}),

  inputLabelRootTransparent: Object.assign(baseStyles(theme).inputLabeRootBase, {
    color: 'transparent',
  }),
  inputLabelRootDisabled: Object.assign(baseStyles(theme).inputLabeRootBase, {
    color: theme.boaPalette.base250,
  }),
});

@ComponentComposer
@withStyles(styles)
class Input extends EditorBase {
  static propTypes = {
    ...EditorBase.propTypes,
    bottomLeftInfo: PropTypes.string,
    bottomLeftInfoEnable: PropTypes.bool,
    bottomRightInfo: PropTypes.string,
    bottomRightInfoEnable: PropTypes.bool,
    defaultValue: PropTypes.any,
    disabledCounterCharacter: PropTypes.string,
    errorStyle: PropTypes.object,
    errorText: PropTypes.string,
    floatingLabelFixed: PropTypes.bool,
    floatingLabelFocusStyle: PropTypes.object,
    floatingLabelShrinkStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    floatingLabelText: PropTypes.string,
    formControlStyle: PropTypes.object,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.string,
    hintStyle: PropTypes.object,
    hintText: PropTypes.string,
    id: PropTypes.string,
    inlineGridMode: PropTypes.bool,
    inputAlign: PropTypes.oneOf(['left', 'right', 'center']),
    inputProps: PropTypes.object,
    inputStyle: PropTypes.object,
    maskedMaxLength: PropTypes.number,
    maxLength: PropTypes.number,
    multiLine: PropTypes.bool,
    name: PropTypes.string,
    noWrap: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    /**
     * onchange setState bitmeden tetikleniyor.
     * SetState callbacinde fırlatılan bir evente ihtiyacımız oldu.
     * Kullanan yerlerin etkilenmemesi için bu prop ayrı olarak eklendi.
     */
    onChangeSync: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onTimerFinished: PropTypes.func,
    outerStyle: PropTypes.object,
    prefixText: PropTypes.any,
    rows: PropTypes.number,
    rowsMax: PropTypes.number,
    showCounter: PropTypes.bool,
    style: PropTypes.object,
    suffixText: PropTypes.any,
    textareaStyle: PropTypes.object,
    timerDuration: PropTypes.number,
    type: PropTypes.oneOf(['password', 'text']),
    validationMessageStyleActive: PropTypes.bool,
    value: PropTypes.any,
  };

  static defaultProps = {
    ...EditorBase.defaultProps,
    floatingLabelFixed: false,
    fullWidth: true,
    multiLine: false,
    rows: 1,
    type: 'text',
    defaultValue: '',
    bottomLeftInfoEnable: true,
    bottomRightInfoEnable: true,
    validationMessageStyleActive: false,
    disabledCounterCharacter: '',
    showCounter: false,
    inlineGridMode: false,
    underlineShow: true,
  };

  state = {
    value: this.props.defaultValue ? this.props.defaultValue : this.props.value,
    disabled: this.props.disabled,
  };

  constructor(props, context) {
    super(props, context);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.setTimer = this.setTimer.bind(this);

    // todo will be removed
    if (props.type === 'number') {
      throw 'If you want b-input as numeric, you have to use b-input-numeric component'; // eslint-disable-line
    } else if (props.type === 'password') {
      throw 'If you want b-input as password, you have to use b-input-action component'; // eslint-disable-line
      // this.debugLog('If you want b-input as password, you have to use b-input-action component');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, disabled } = nextProps;

    this.counterUpdate(nextProps);
    // null ise kasıtlı siliniyordur, silmeli.
    // undefined ise value geçilmemiştir, değişmemeli.
    // diğer durumlarda prop yada state'ten farklı gelmişse değişmeli.
    if (
      value === null ||
      (value !== undefined && (value !== this.props.value || value !== this.state.value))
    ) {
      this.setState({ value: value === null ? '' : value });
    }
    if (disabled !== this.props.disabled) {
      this.setState({ disabled });
    }
  }

  counterUpdate(props, value) {
    const bottomRightInfoSpan = findDOMNode(this.bottomRightInfoSpan);
    if (bottomRightInfoSpan && props.maxLength && !props.bottomRightInfo && !props.timerDuration) {
      let counterText = 0;
      let text = '';
      if (value) {
        text = value;
      } else if (props.value) {
        text = props.value.toString();
      }
      if (text !== '') {
        if (this.props.disabledCounterCharacter !== '') {
          // bazı karakterleri sayaca eklememesi için
          text = text.split(this.props.disabledCounterCharacter);
          text = text.join('');
        }
      }
      counterText = text.length;

      findDOMNode(this.bottomRightInfoSpan).innerText = counterText;
    }
  }

  componentDidUpdate() {
    const textSelection = this.state.textSelection;
    if (textSelection) {
      if (this.textField) {
        this.textField.setSelectionRange(textSelection.start, textSelection.end);
      }
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  componentDidMount() {
    this.counterUpdate(this.props, this.props.defaultValue);
    if (this.props.timerDuration) {
      this.setTimer(this.props.timerDuration);
    }
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value });
  }

  resetValue() {
    this.setState({ value: this.props.defaultValue });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  onBlur(e) {
    this.setState({ focussed: false });
    // this.validateConstraint();
    // her blur oluşunda value constraint mesajlarının temizlenmesi için.
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onChange(e, v) {
    v = e.target.value;
    this.counterUpdate(this.props, v);
    this.setState({ value: v }, () => {
      if (this.props.onChangeSync) {
        this.props.onChangeSync(e, v);
      }
    });
    if (this.props.onChange) {
      this.props.onChange(e, v);
    }
    if (this.props.onDynamicChange) {
      this.props.onDynamicChange(e);
    }
  }

  onFocus(e) {
    this.setState({ focussed: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  onKeyUp(e) {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  }

  setTimer(duration) {
    let timer = duration;
    const self = this;

    if (this.intervalId) {
      clearInterval(self.intervalId);
    }

    this.intervalId = setInterval(() => {
      const bottomSpan = findDOMNode(self.bottomRightInfoSpan);
      if (bottomSpan) {
        bottomSpan.innerText = getTimeInfo(timer);
        if (--timer < 0) {
          clearInterval(self.intervalId);
          if (self.props.onTimerFinished) {
            self.props.onTimerFinished();
          }
        }
      }
    }, 1000);
  }

  focus() {
    this.textField.focus();
  }

  validationToString() {
    // TODO: burada tüm mesajlar mı basılacak ?
    return this.validationResult[0].message;
  }

  render() {
    const {
      name,
      context,
      timerDuration,
      bottomLeftInfo,
      bottomLeftInfoEnable,
      bottomRightInfo,
      bottomRightInfoEnable,
      floatingLabelText,
      helperText,
      inputAlign,
      maxLength,
      fullWidth,
      rows,
      rowsMax,
      type,
      prefixText,
      suffixText,
      showCounter,
      inputProps,
      underlineShow,
    } = this.props;

    let { errorText, hintText } = this.props;

    const bottomTextSize = 11;
    const disabledLabelColor = context.theme.boaPalette.base250;
    const infoTextColor = context.theme.boaPalette.base300;
    const errorTextColor = context.theme.boaPalette.error500;

    if (this.validationResult && this.validationResult.length > 0) {
      errorText = this.validationToString();
    }

    const isRtl = this.props.context.localization.isRightToLeft;

    const textAlignStyle = inputAlign || (isRtl ? 'right' : 'left');
    const inputStyleProp = this.props.inputStyle ? Object.assign({}, this.props.inputStyle) : {};
    const inputStyle = Object.assign(inputStyleProp, { textAlign: textAlignStyle });

    // hint değeri atanmamış ise floating atanıyor.
    if (hintText == null) {
      hintText = floatingLabelText;
    }

    // bottomInfo section
    let bottomLeftInfoSpace;
    const lastBottomLeftInfo = bottomLeftInfo || helperText;
    if (bottomLeftInfoEnable && lastBottomLeftInfo && this.state.disabled === false) {
      const bottomLeftInfoStyle = {
        fontSize: bottomTextSize,
        color: this.state.disabled ? disabledLabelColor : infoTextColor,
        display: errorText ? 'none' : '', // error var ise helper görünmeyecek
        marginTop: 1,
      };
      if (!isRtl) {
        bottomLeftInfoStyle.left = 0;
        bottomLeftInfoStyle.float = 'left';
      } else {
        bottomLeftInfoStyle.right = 0;
        bottomLeftInfoStyle.float = 'right';
      }
      bottomLeftInfoSpace = (
        <span style={bottomLeftInfoStyle}>
          <span ref={r => (this.bottomLeftInfoSpan = r)}>{lastBottomLeftInfo}</span>
        </span>
      );
    }

    let bottomRightInfoSpace;
    if (bottomRightInfoEnable && this.state.disabled === false) {
      const bottomRightInfoStyle = {
        fontSize: bottomTextSize,
        color: this.state.disabled ? disabledLabelColor : infoTextColor,
        marginTop: errorText ? -9 : 3,
      };
      if (!isRtl) {
        bottomRightInfoStyle.right = 0;
        bottomRightInfoStyle.float = 'right';
      } else {
        bottomRightInfoStyle.left = 0;
        bottomRightInfoStyle.float = 'left';
      }
      if (bottomRightInfo) {
        bottomRightInfoSpace = (
          <span style={bottomRightInfoStyle}>
            <span ref={r => (this.bottomRightInfoSpan = r)}>{bottomRightInfo}</span>
          </span>
        );
      } else if (timerDuration) {
        bottomRightInfoSpace = (
          <span style={bottomRightInfoStyle}>
            <span ref={r => (this.bottomRightInfoSpan = r)}>
              {getTimeInfo(this.props.timerDuration)}
            </span>
          </span>
        );
      } else if (showCounter && maxLength) {
        bottomRightInfoSpace = (
          <span style={bottomRightInfoStyle}>
            {/* masked editörde maxLength ile değil maskedMaskLength görülecek  */}
            <span ref={r => (this.bottomRightInfoSpan = r)}>0</span>/
            {this.props.maskedMaxLength ? this.props.maskedMaxLength : maxLength}
          </span>
        );
      }
    }

    const errorStyle = {
      color: errorTextColor,
      fontSize: bottomTextSize,
      marginTop: 6,
      marginBottom: 10,
      textAlign: isRtl ? 'right' : 'left',
    };

    const bottomInfoStyle = {
      marginTop: 2,
    };

    // inline grid style
    // if (this.props.inlineGridMode) {
    //   inputStyle = Object.assign(inputStyle, {
    //     marginLeft: 12,
    //     marginRight: 12
    //   });
    // }

    // inputProps.style && delete inputProps.style; // todo geçici
    const inputPropsMerged = Object.assign(
      {},
      {
        ref: r => {
          this.textField = r;
        },
        maxLength,
        style: inputStyle,
      },
      inputProps,
    );
    const id = uniqueId();

    // error validation
    let error = false;
    if (errorText) {
      error = true;
    }

    const baseRootStyle = {
      width: '100%',
      display: 'inline-block',
      position: 'relative',
      paddingTop: 10,
      marginTop: 0,
      // this.props.inlineGridMode ? (this.props.multiLine ? 10 : hideshowMarginTop ? 0 : 12) : 0
    };
    const rootStyle = Object.assign(baseRootStyle, this.props.inputStyle);
    const { focussed, value } = this.state;

    let shink = false;
    if (focussed) {
      shink = true;
    } else if (value != null && value !== undefined && value !== '') {
      shink = true;
    }

    const floatingLabelRootStyle = Object.assign(
      {},
      this.props.floatingLabelStyle ? this.props.floatingLabelStyle : {},
      hasValue(value) === false ? { textAlign: textAlignStyle } : {},
      isRtl ? { transformOrigin: 'top right' } : { transformOrigin: 'top left' },
    );

    const { classes } = this.props;

    // zorunlu alanlar eğer veri grilmemiş ise underline rengi farklı olacak.
    let underlineClass = classes.inputUnderline;
    if (
      this.props.valueConstraint &&
      this.props.valueConstraint.required &&
      (this.getValue() == null || this.getValue() === undefined || this.getValue() === '')
    ) {
      underlineClass = classes.inputUnderlineRequired;
    }

    const { inputLabelRootDisabled, inputLabelRoot } = classes;
    return (
      <div style={rootStyle}>
        <MuiFormControl
          disabled={this.state.disabled}
          fullWidth={this.props.fullWidth}
          style={this.props.formControlStyle}
        >
          {floatingLabelText && !this.props.inlineGridMode && (
            <MuiInputLabel
              classes={{
                shrink: classes.inputLabelShink,
                root: this.state.disabled ? inputLabelRootDisabled : inputLabelRoot,
              }}
              margin={'dense'}
              htmlFor={id}
              // gelen style inline olarak uygulanır, sınıflardan geleni ezer.
              style={floatingLabelRootStyle}
              disabled={this.state.disabled}
              shrink={shink}
            >
              {this.props.floatingLabelText}
            </MuiInputLabel>
          )}
          <MuiInput
            classes={{
              input: classes.input,
              underline: underlineClass,
              multiline: classes.multiline,
              inputType: classes.inputType,
              disabled: classes.inputDisabled,
            }}
            name={name}
            id={id}
            rows={rows}
            rowsMax={rowsMax}
            inputProps={inputPropsMerged}
            inputRef={this.props.inputRef}
            fullWidth={fullWidth}
            type={type}
            // gelen style inline olarak uygulanır, sınıflardan geleni ezer.
            style={this.props.inputStyle}
            value={this.state.value}
            disabled={this.state.disabled}
            disableUnderline={!underlineShow}
            multiline={this.props.multiLine}
            // margin={'dense'}
            error={!this.state.disabled && error}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            placeholder={hintText}
            startAdornment={
              prefixText && (
                <MuiInputAdornment
                  style={{
                    marginTop: -11,
                    marginRight: this.props.context.localization.isRightToLeft ? -4 : 0,
                    ...this.props.startAdornmentStyle,
                  }}
                  position="start"
                >
                  {prefixText}
                </MuiInputAdornment>
              )
            }
            endAdornment={
              suffixText && (
                <MuiInputAdornment
                  style={{
                    marginTop: -11,
                    marginLeft: this.props.context.localization.isRightToLeft ? -4 : 0,
                    ...this.props.endAdornmentStyle,
                  }}
                  position="end"
                >
                  {suffixText}
                </MuiInputAdornment>
              )
            }
          />
          {!this.props.inlineGridMode && (
            <MuiFormHelperText // margin={'dense'}
              style={{ marginTop: 0 }}
              disabled={this.state.disabled}
            >
              {error && <div style={errorStyle}>{errorText}</div>}
              {bottomLeftInfoSpace || bottomRightInfoSpace ? (
                <div style={bottomInfoStyle}>
                  {bottomLeftInfoSpace}
                  {bottomRightInfoSpace}
                </div>
              ) : null}
            </MuiFormHelperText>
          )}
        </MuiFormControl>
      </div>
    );
  }
}

export default Input;
