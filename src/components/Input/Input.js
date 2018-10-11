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
import { ComponentComposer, Utils, EditorBase } from '@boa/base';

function baseStyles(theme) {
  return {
    input: {
      color: theme.boaPalette.base450,
      fontSize: 14,
      caretColor: theme.boaPalette.pri500,
      padding: 0,
      marginBottom: 3,
      minHeight: 19
    },
    inputLabel: {
      fontSize: 14,
      width: '100%'
    },

    inputLabeRootBase: {
      fontSize: 14,
      width: '100%',
      marginTop: -4,
      paddingTop: 2,
      transformOrigin: `top ${theme.direction == 'ltr' ? 'left' : 'right'}`,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  };
}

const styles = theme => ({
  input: Object.assign(baseStyles(theme).input, {
    marginRight: theme.direction == 'rtl' ? 0 : null,
    marginLeft: theme.direction == 'ltr' ? 0 : null
  }),
  multiline: Object.assign(baseStyles(theme).input, {
    padding: '3px 0 3px'
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
      borderBottom: `2px solid ${theme.boaPalette.pri500}`
    },

    '&:before': {
      borderBottom: `1px solid ${theme.boaPalette.base250}`
    },

    '&:hover:not($inputDisabled):not($inputfocused):not($inputError):before': {
      borderBottom: `2px solid ${theme.boaPalette.base250}`
    },
  },

  inputUnderlineRequired: {

    '&:after': {
      borderBottom: `2px solid ${theme.boaPalette.pri500}`
    },

    '&:before': {
      borderBottom: `1px solid ${theme.boaPalette.obli300}`
    },

    '&:hover:not($inputDisabled):not($inputfocused):not($inputError):before': {
      borderBottom: `2px solid ${theme.boaPalette.obli300}`
    },
  },

  inputType: {
    height: 'auto' // pasword fix
  },

  inputLabelShink: Object.assign(baseStyles(theme).inputLabel, {
    paddingTop: '2px !important',
    marginTop: '0px !important',
    color: theme.boaPalette.pri500,

  }),

  inputLabelRoot: Object.assign(baseStyles(theme).inputLabeRootBase, {}),

  inputLabelRootTransparent: Object.assign(baseStyles(theme).inputLabeRootBase, {
    color: 'transparent'
  }),
  inputLabelRootDisabled: Object.assign(baseStyles(theme).inputLabeRootBase, {
    color: theme.boaPalette.base250
  })
});

@ComponentComposer
@withStyles(styles)
class Input extends EditorBase {
  static propTypes = {
    ...EditorBase.propTypes,
    inputProps: PropTypes.object,
    errorStyle: PropTypes.object,
    errorText: PropTypes.string,
    floatingLabelFixed: PropTypes.bool,
    floatingLabelFocusStyle: PropTypes.object,
    floatingLabelShrinkStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    floatingLabelText: PropTypes.string,
    helperText: PropTypes.string,
    hintStyle: PropTypes.object,
    hintText: PropTypes.string,
    id: PropTypes.string,
    inputAlign: PropTypes.oneOf(['left', 'right', 'center']),
    inputStyle: PropTypes.object,
    outerStyle: PropTypes.object,
    maxLength: PropTypes.number,
    multiLine: PropTypes.bool,
    fullWidth: PropTypes.bool,
    name: PropTypes.string,
    noWrap: PropTypes.bool,
    rows: PropTypes.number,
    rowsMax: PropTypes.number,
    style: PropTypes.object,
    textareaStyle: PropTypes.object,
    formControlStyle: PropTypes.object,
    type: PropTypes.oneOf(['password', 'text']),
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    bottomLeftInfoEnable: PropTypes.bool,
    bottomLeftInfo: PropTypes.string,
    bottomRightInfoEnable: PropTypes.bool,
    bottomRightInfo: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    timerDuration: PropTypes.number,
    onTimerFinished: PropTypes.func,
    prefixText: PropTypes.any,
    suffixText: PropTypes.any,
    validationMessageStyleActive: PropTypes.bool,
    disabledCounterCharacter: PropTypes.string,
    maskedMaxLength: PropTypes.number,
    showCounter: PropTypes.bool,
    inlineGridMode: PropTypes.bool,
    /* onchange setState bitmeden tetikleniyor. SetState callbacinde fırlatılan bir evente ihtiyacımız oldu.
    Kullanan yerlerin etkilenmemesi için bu prop ayrı olarak eklendi.
     */
    onChangeSync: PropTypes.func
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
    underlineShow: true
  };

  state = {
    value: this.props.defaultValue ? this.props.defaultValue : this.props.value,
    disabled: this.props.disabled
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
    if (props.type == 'number') {
      throw 'If you want b-input as numeric, you have to use b-input-numeric component';
    } else if (props.type == 'password') {
      this.debugLog('If you want b-input as password, you have to use b-input-action component');
    }
  }

  componentWillReceiveProps(nextProps) {
    this.counterUpdate(nextProps);
    // null ise kasıtlı siliniyordur, silmeli.
    // undefined ise value geçilmemiştir, değişmemeli.
    // diğer durumlarda prop yada state'ten farklı gelmişse değişmeli.
    if (
      nextProps.value === null ||
      (nextProps.value !== undefined && (nextProps.value !== this.props.value || nextProps.value !== this.state.value))
    ) {
      this.setState({ value: nextProps.value === null ? '' : nextProps.value });
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  counterUpdate(props, value) {
    var bottomRightInfoSpan = findDOMNode(this.bottomRightInfoSpan);
    if (bottomRightInfoSpan && props.maxLength && !props.bottomRightInfo && !props.timerDuration) {
      var counterText = 0;
      var text = '';
      if (value) {
        text = value;
      } else if (props.value) {
        text = props.value.toString();
      }
      if (text != '') {
        if (this.props.disabledCounterCharacter != '') {
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
    let textSelection = this.state.textSelection;
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
    this.setState({ value: value });
  }

  resetValue() {
    this.setState({ value: this.props.defaultValue });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  onBlur(e) {
    this.setState({ focussed: false });
    // this.validateConstraint(); // her blur oluşunda value constraint mesajlarının temizlenmesi için.
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onChange(e, v) {
    v = e.target.value;
    this.counterUpdate(this.props, v);
    this.setState({ value: v }, () => {
      this.props.onChangeSync && this.props.onChangeSync(e, v);
    });
    if (this.props.onChange) {
      this.props.onChange(e, v);
    }
    this.props.onDynamicChange && this.props.onDynamicChange(e);
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
    var timer = duration;
    var that = this;

    if (this.intervalId) {
      clearInterval(that.intervalId);
    }

    this.intervalId = setInterval(function () {
      let bottomSpan = findDOMNode(that.bottomRightInfoSpan);
      if (bottomSpan) {
        bottomSpan.innerText = that.setTimeInfo(timer);
        if (--timer < 0) {
          clearInterval(that.intervalId);
          that.props.onTimerFinished && that.props.onTimerFinished();
        }
      }
    }, 1000);
  }

  setTimeInfo(duration) {
    var minutes = Utils.stringPadLeft(parseInt(duration / 60, 10), 2, '0');
    var seconds = Utils.stringPadLeft(parseInt(duration % 60, 10), 2, '0');

    return minutes + ':' + seconds;
  }

  focus() {
    this.textField.focus();
  }

  hasValue(value) {
    if (value) return true;
    else if (value == '' || value == undefined || value == null) return false;
  }

  validationToString() {
    // TODO: burada tüm mesajlar mı basılacak ?
    return this.validationResult[0].message;
  }

  render() {
    var {
      name,
      context,
      timerDuration,
      bottomLeftInfo,
      bottomLeftInfoEnable,
      bottomRightInfo,
      bottomRightInfoEnable,
      errorText,
      floatingLabelText,
      helperText,
      hintText,
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
      underlineShow
    } = this.props;

    const bottomTextSize = 11;
    const disabledLabelColor = context.theme.boaPalette.base250;
    const infoTextColor = context.theme.boaPalette.base300;
    const errorTextColor = context.theme.boaPalette.error500;

    if (this.validationResult && this.validationResult.length > 0) {
      errorText = this.validationToString();
    }

    const isRtl = this.props.context.localization.isRightToLeft;

    let textAlignStyle = inputAlign ? inputAlign : isRtl ? 'right' : 'left';
    var inputStyleProp = this.props.inputStyle ? Object.assign({}, this.props.inputStyle) : {};
    let inputStyle = Object.assign(inputStyleProp, { textAlign: textAlignStyle });

    // hint değeri atanmamış ise floating atanıyor.
    if (hintText == null) {
      hintText = floatingLabelText;
    }

    // bottomInfo section
    var bottomLeftInfoSpace;
    const lastBottomLeftInfo = bottomLeftInfo || helperText;
    if (bottomLeftInfoEnable && lastBottomLeftInfo && this.state.disabled == false) {
      var bottomLeftInfoStyle = {
        fontSize: bottomTextSize,
        color: this.state.disabled ? disabledLabelColor : infoTextColor,
        display: errorText ? 'none' : '', // error var ise helper görünmeyecek
        marginTop: 1
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

    var bottomRightInfoSpace;
    if (bottomRightInfoEnable && this.state.disabled == false) {
      var bottomRightInfoStyle = {
        fontSize: bottomTextSize,
        color: this.state.disabled ? disabledLabelColor : infoTextColor,
        marginTop: errorText ? -9 : 3
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
            <span ref={r => (this.bottomRightInfoSpan = r)}>{this.setTimeInfo(this.props.timerDuration)}</span>
          </span>
        );
      } else if (showCounter && maxLength) {
        bottomRightInfoSpace = (
          <span style={bottomRightInfoStyle}>
            {/* masked editörde maxLength ile değil maskedMaskLength görülecek  */}
            <span ref={r => (this.bottomRightInfoSpan = r)}>0</span>/{this.props.maskedMaxLength ? this.props.maskedMaxLength : maxLength}
          </span>
        );
      }
    }

    let errorStyle = {
      color: errorTextColor,
      fontSize: bottomTextSize,
      marginTop: 6,
      marginBottom: 10,
      textAlign: isRtl ? 'right' : 'left',
    };


    var bottomInfoStyle = {
      marginTop: 2
    };

    // inline grid style
    // if (this.props.inlineGridMode) {
    //   inputStyle = Object.assign(inputStyle, {
    //     marginLeft: 12,
    //     marginRight: 12
    //   });
    // }

    // inputProps.style && delete inputProps.style; // todo geçici
    let inputPropsMerged = Object.assign(
      {},
      {
        ref: r => {
          this.textField = r;
        },
        maxLength: maxLength,
        style: inputStyle
      },
      inputProps
    );
    let id = uniqueId();

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
      marginTop: 0 // this.props.inlineGridMode ? (this.props.multiLine ? 10 : hideshowMarginTop ? 0 : 12) : 0

    };
    var rootStyle = Object.assign(baseRootStyle, this.props.inputStyle);

    let shink = false;
    if (this.state.focussed) {
      shink = true;
    } else if (this.state.value != null && this.state.value != undefined && this.state.value != '') {
      shink = true;
    }

    let floatingLabelRootStyle = Object.assign(
      {},
      this.props.floatingLabelStyle ? this.props.floatingLabelStyle : {},
      this.hasValue(this.state.value) == false ? { textAlign: textAlignStyle } : {},
      isRtl ? { transformOrigin: 'top right' } : { transformOrigin: 'top left' }
    );

    const { classes } = this.props;

    // zorunlu alanlar eğer veri grilmemiş ise underline rengi farklı olacak.
    let underlineClass = classes.inputUnderline;
    if (this.props.valueConstraint
      && this.props.valueConstraint.required
      && (this.getValue() == null || this.getValue() == undefined || this.getValue() == '')
    )
      underlineClass = classes.inputUnderlineRequired;

    // (this.props.valueConstraint  &&  this.props.valueConstraint.required) ? classes.inputUnderlineRequired: classes.inputUnderline,

    return (
      <div style={rootStyle}>
        <MuiFormControl
          disabled={this.state.disabled}
          fullWidth={this.props.fullWidth}
          // margin={'dense'}
          style={this.props.formControlStyle}>
          {floatingLabelText &&
            // this.state.value && this.state.value!='' &&

            !this.props.inlineGridMode && (
              <MuiInputLabel
                classes={{
                  // root:  (this.state.value && this.state.value!='' ) ? classes.inputLabelRoot: classes.inputLabelRootTransparent,
                  // classes.inputLabelRoot,
                  shrink: classes.inputLabelShink,
                  root: this.state.disabled ? classes.inputLabelRootDisabled : classes.inputLabelRoot

                }}
                margin={'dense'}
                htmlFor={id}
                style={floatingLabelRootStyle} // gelen style inline olarak uygulanır, sınıflardan geleni ezer.
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
              disabled: classes.inputDisabled
            }}
            name={name}
            id={id}
            rows={rows}
            rowsMax={rowsMax}
            inputProps={inputPropsMerged}
            inputRef={this.props.inputRef}
            fullWidth={fullWidth}
            type={type}
            style={this.props.inputStyle} // gelen style inline olarak uygulanır, sınıflardan geleni ezer.
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
                    ...this.props.startAdornmentStyle
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
                    ...this.props.endAdornmentStyle
                  }}
                  position="end"
                >
                  {suffixText}
                </MuiInputAdornment>
              )
            }
          />
          {!this.props.inlineGridMode && (
            <MuiFormHelperText  // margin={'dense'}
              style={{ marginTop: 0 }}
              disabled={this.state.disabled}>
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
