import React from 'react';
import { PropTypes } from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import Autosuggest from 'react-autosuggest';
import { MenuItem } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {Input, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { BLocalization } from 'b-localization';

const styles = ({
  input: {
    paddingLeft: '48px'
  }

});

@BComponentComposer
@withStyles(styles)
export class BAutoComplete extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    underlineStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintStyle: PropTypes.object,
    underlineShow: PropTypes.bool,
    outerStyle: PropTypes.object,
    hintText: PropTypes.string,
    dataSourceConfig: PropTypes.object,
    dataSource: PropTypes.array.isRequired,
    maxSearchResults: PropTypes.number.isRequired,
    onNewRequest: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onUpdateInput: PropTypes.func,
    searchText: PropTypes.string,
    // animated: PropTypes.bool,
    // open: PropTypes.bool,
    // fullWidth: PropTypes.bool,
    // underlineShow: PropTypes.bool,
    // hintText: PropTypes.string,
    // floatingLabelText: PropTypes.string,
    // dataSource: PropTypes.any,
    // dataSourceConfig: PropTypes.any, // {text,value,searchkeys}
    // listStyle: PropTypes.object,
    // maxSearchResults: PropTypes.number,
    // textFieldStyle: PropTypes.object,
    // onUpdateInput: PropTypes.func,
    // onKeyDown: PropTypes.func,
    // errorText: PropTypes.string,
    // errorStyle: PropTypes.object,
    // inlineGridMode: PropTypes.bool
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    dataSourceConfig: { text: 'text', value: 'value', searchData: 'text', render: 'render' },
    searchText: ''
  }

  state = {
    value: this.props.searchText,
    suggestions: [],
    focused: false,
    noSuggestions: false
  };

  constructor(props, context) {
    super(props, context);
    this.onBlur = this.onBlur.bind(this);
  }

  clearValue() {
    this.setState({ value: '', focused: true });
    this.inputRender.focus();
  }

  renderInput(inputProps) {
    const {
      baseContext,
      onChange,
      // ref,
      value,
      disableUnderline,
      hintStyle,
      hintText,
      outerStyle,
      inputStyle,
      prefixText,
      suffixText,
      ...other
    } = inputProps;

    const { classes } = this.props;

    return (
      <div style={outerStyle}>
        <Input
          id={'autoCompleteInput'}
          context={baseContext}
          fullWidth
          inputRef={r => this.inputRender = r}
          onChange={onChange}
          value={value}
          disableUnderline={disableUnderline}
          placeholder={hintText}
          hintStyle={hintStyle}
          {...other}
          startAdornment={
            prefixText &&
            <InputAdornment
              style={{
                // marginTop:-11,
                marginRight: '0px' // this.props.context.localization.isRightToLeft ? -4 : 0
              }}
              position="start">
              {prefixText}
            </InputAdornment>
          }
          endAdornment={
            suffixText &&
            <InputAdornment
              style={{
                // marginTop:-11,
                marginLeft: '0px' // this.props.context.localization.isRightToLeft ? -4 : 0
              }}
              position="end">
              {suffixText}
            </InputAdornment>
          }
          style={inputStyle}
          classes={{
            input: (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) && classes.input
          }}
        />
      </div>
    );
  }
  onBlur() {
    this.setState({ focused: false, noSuggestions: false });
  }

  onFocus() {
    this.setState({ focused: true });
  }

  render() {
    var {
      context,
      underlineFocusStyle,
      underlineDisabledStyle,
      floatingLabelStyle,
      floatingLabelFocusStyle,
      textareaStyle,
      listStyle,
      menuStyle,
      errorStyle,
      floatingLabelShrinkStyle
    } = this.props;

    // const labelTextColor = context.theme.boaPalette.pri500;
    const strokeColor = context.theme.boaPalette.base250;
    const strokeSize = 1;
    const textColor = context.theme.boaPalette.base450;
    const textSize = 14;
    const suggestionsListStyle = {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    };
    const suggestionsContainerOpen = {
      maxHeight: '600px',
      overflowY: 'auto',
      zIndex: 999,
      boxShadow: '0px 4px 5px -3px grey'
    };

    let underlineStyle = Object.assign({ borderBottom: 'solid ' + strokeSize, borderColor: strokeColor }, this.props.underlineStyle);
    // let style = Object.assign({ color: labelTextColor }, this.props.style);
    let inputStyle = Object.assign(
      {
        color: textColor,
        fontSize: textSize,
        caretColor: context.theme.boaPalette.pri500
      }, this.props.inputStyle);
    let hintStyle = Object.assign({ fontSize: textSize }, this.props.hintStyle);
    if (!context.localization.isRightToLeft) {
      underlineFocusStyle && Object.assign(underlineFocusStyle, { textAlign: 'left' });
      underlineStyle && Object.assign(underlineStyle, { textAlign: 'left' });
      underlineDisabledStyle && Object.assign(underlineDisabledStyle, { textAlign: 'left' });
      floatingLabelStyle && Object.assign(floatingLabelStyle, { textAlign: 'left' });
      floatingLabelFocusStyle && Object.assign(floatingLabelFocusStyle, { textAlign: 'left' });
      textareaStyle && Object.assign(textareaStyle, { textAlign: 'left' });
      // style && Object.assign(style, { textAlign: 'left' });
      suggestionsListStyle && Object.assign(listStyle ? listStyle : {}, { textAlign: 'left' });
      menuStyle && Object.assign(menuStyle, { textAlign: 'left' });
      inputStyle && Object.assign(inputStyle, { textAlign: 'left' });
      errorStyle && Object.assign(errorStyle, { textAlign: 'left' });
      hintStyle && Object.assign(hintStyle, { textAlign: 'left' });
      floatingLabelShrinkStyle && Object.assign(floatingLabelShrinkStyle, { transformOrigin: 'left top' });
    }
    else {
      underlineFocusStyle && Object.assign(underlineFocusStyle, { textAlign: 'right' });
      underlineStyle && Object.assign(underlineStyle, { textAlign: 'right' });
      underlineDisabledStyle && Object.assign(underlineDisabledStyle, { textAlign: 'right' });
      floatingLabelStyle && Object.assign(floatingLabelStyle, { width: '100%', textAlign: 'right' });
      floatingLabelFocusStyle && Object.assign(floatingLabelFocusStyle, { width: '100%', textAlign: 'right' });
      textareaStyle && Object.assign(textareaStyle, { textAlign: 'right' });
      // style && Object.assign(style, { textAlign: 'right' });
      suggestionsListStyle && Object.assign(listStyle ? listStyle : {}, { textAlign: 'right' });
      menuStyle && Object.assign(menuStyle, { textAlign: 'right' });
      inputStyle && Object.assign(inputStyle, { textAlign: 'right' });
      errorStyle && Object.assign(errorStyle, { textAlign: 'right' });
      hintStyle && Object.assign(hintStyle, { width: '100%', textAlign: 'right' });
      floatingLabelShrinkStyle && Object.assign(floatingLabelShrinkStyle, { transformOrigin: 'right top' });
    }

    const inputProps = {
      // ref: r => this.inputRender = r,
      baseContext: this.props.context,
      value: this.state.value,
      onChange: this.handleChange,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
      disableUnderline: !this.props.underlineShow,
      hintStyle: hintStyle,
      outerStyle: this.props.outerStyle,
      inputStyle: inputStyle,
      hintText: this.props.hintText,
      prefixText: this.props.prefixText,
      suffixText: this.props.suffixText
    };

    let noSuggestionStyle = {
      backgroundColor: 'white',
      height: '40px',
      color: context.theme.boaPalette.base300,
      paddingLeft: '20px',
      paddingTop: '11px'
    };
    return (
      <div>
        <Autosuggest
          ref={r => this.autosuggest = r}
          theme={{
            suggestionsList: suggestionsListStyle,
            suggestionsContainerOpen: suggestionsContainerOpen,
          }}
          renderInputComponent={this.renderInput.bind(this)}
          suggestions={this.state.suggestions}
          focusInputOnSuggestionClick={false}
          onSuggestionSelected={this.props.onNewRequest}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue.bind(this)}
          renderSuggestion={this.renderSuggestion.bind(this)}
          inputProps={inputProps}
        />
        {
          this.state.noSuggestions &&
          <div style={noSuggestionStyle}>
            {this.getMessage('BusinessComponents', 'ResultNotFound')}
          </div>
        }
      </div>
    );
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {

    if (suggestion[this.props.dataSourceConfig.render]) {
      if (this.props.renderSuggestion)
        return this.props.renderSuggestion(suggestion, query, this.props.dataSource);
      else
        return suggestion[this.props.dataSourceConfig.render];
    } else {

      const matches = match(suggestion[this.props.dataSourceConfig.text], query);
      let parts = parse(suggestion[this.props.dataSourceConfig.text], matches);
      let suggesionText = BLocalization.stringLowerCase(suggestion.text);
      let queryText = BLocalization.stringLowerCase(query);

      if (Array.isArray(matches) && matches.length < 1) {
       // let indexOfQuery = suggestion.text.toLocaleLowerCase().indexOf('' + query.toLocaleLowerCase());
        let indexOfQuery = suggesionText.indexOf('' + queryText);
        let matchesNotBeginnigIndex = [{ 0: indexOfQuery, 1: indexOfQuery + query.length }];
        parts = parse(suggestion[this.props.dataSourceConfig.text], matchesNotBeginnigIndex);
      }

      let menuItem = (
        <MenuItem selected={isHighlighted} component="div">
          <div>
            {parts.map((part, index) => {
              return part.highlight ? (
                <strong key={String(index)} style={{ fontSize: '15px', color: this.props.context.theme.boaPalette.pri500 }}>
                  {part.text}
                </strong>
              ) : (
                <span key={String(index)}>
                  {part.text}
                </span>
                );
            })}
          </div>
        </MenuItem>
      );

      return menuItem;
    }
  }

  getSuggestionValue(suggestion) {
    return suggestion[this.props.dataSourceConfig.text];
  }

  getSearchedValue(suggestion, inputValue) {
    // return suggestion[this.props.dataSourceConfig.searchData].toLowerCase().includes(inputValue.toLowerCase());
    // return suggestion[this.props.dataSourceConfig.text] && suggestion[this.props.dataSourceConfig.text].toLowerCase().includes(inputValue.toLowerCase());
    if (suggestion[this.props.dataSourceConfig.text]) {
      // let sourceItem = suggestion[this.props.dataSourceConfig.text].toUpperCase();
      // let inputItem = inputValue.toUpperCase();
      // let convertedSource = helpers.convertString(sourceItem);
      // let convertedInput = helpers.convertString(inputItem);
      let convertedSource = BLocalization.stringLowerCase(suggestion[this.props.dataSourceConfig.text]);
      let convertedInput = BLocalization.stringLowerCase(inputValue);
      convertedSource = convertedSource.replace('i̇', 'i');
      convertedInput = convertedInput.replace('i̇', 'i');
      // let result = convertedSource.indexOf(convertedInput) < 0 ? false : true;
      let result = convertedSource.includes(convertedInput);
      return result;
    }
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.props.dataSource.filter(suggestion => {

        if (this.props.maxSearchResults) {
          const keep = count < this.props.maxSearchResults && this.getSearchedValue(suggestion, inputValue);

          if (keep) {
            count += 1;
          }

          return keep;
        } else {
          return this.getSearchedValue(suggestion, inputValue);
        }


      });
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    let list = this.getSuggestions(value);
    const isInputBlank = value.trim() === '';
    const noSuggestions = !isInputBlank && list.length === 0;
    this.setState({
      suggestions: list,
      noSuggestions: noSuggestions
    });
  };

  handleSuggestionsClearRequested = () => {
    //   let suggestionsList = this.state.suggestions;
    //   var isHidden = false;
    //   for (var i = 0; i < suggestionsList.length; i++) {
    //     if (suggestionsList[i].allProperties && suggestionsList[i].allProperties.name) {
    //       if (this.state.value == suggestionsList[i].allProperties.name && suggestionsList[i].allProperties.isHidden) {
    //         isHidden = true;
    //       }
    //     }
    //   }
    //   if (!isHidden) {
    this.setState({
      suggestions: [],
    });
    //   }
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });

    this.props.onChange && this.props.onChange(newValue);
    this.props.onUpdateInput && this.props.onUpdateInput(newValue); // for backward compatibility
  };

  focus() {
    this.props.onBlur && this.props.onBlur();
  }
}

export default BAutoComplete;
