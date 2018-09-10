
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import BAutoComplete from 'b-auto-complete';
import Search from '@material-ui/icons/Search';
import cloneDeep from 'lodash/cloneDeep';
import { BComponent, BComponentComposer } from 'b-component';
import { BPopover } from 'b-popover';
import { BButton } from 'b-button';
import { BIcon } from 'b-icon';
import { ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

var Lock = require('b-icon').Others.Lock;

// const leftIconDesktop = {
//   top: '8px'
// };

// const menuItemStyle = {
//   float: 'left',
//   width: '100%',
//   height: '40px'
// };

const styles = () => ({
  root: {
    paddingLeft: '4px'
  },
  primary: {
    float: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#212121',
    paddingTop: '4px',
    paddingTLeft: '4px',
    lineHeight: '20px',
    height: '24px',
    width: '100%',
    display: 'inline-table'
  },
  secondary: {
    float: 'left',
    width: '100%',
    fontSize: '12px',
    height: '16px',
    color: '#707070',
    paddingBottom: '4px',
    paddingTLeft: '4px',
    lineHeight: '12px'
  },
  pri: {

  }
});

@BComponentComposer
@withStyles(styles)
export class BInputSearch extends BComponent {
  static defaultProps = {
    maxSearchResults: 20
  };

  static propTypes = {
    ...BComponent.propTypes,
    animated: PropTypes.bool,
    open: PropTypes.bool,
    fullWidth: PropTypes.bool,
    hintText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    dataSource: PropTypes.any,
    listStyle: PropTypes.object,
    maxSearchResults: PropTypes.number,
    textFieldStyle: PropTypes.object,
    animation: PropTypes.func,
    filter: PropTypes.func,
    onNewRequest: PropTypes.func,
    onUpdateInput: PropTypes.func,
    onItemClick: PropTypes.func,
    errorText: PropTypes.string,
    errorStyle: PropTypes.object,
    hintStyle: PropTypes.object,
    style: PropTypes.object
  };

  static rootStyle = {
    minHeight: '40px',
    opacity: 1
  };

  static innerDivStyle = {
    float: 'left',
    width: '100%',
    paddingLeft: '48px',
    margin: '0px'
  };

  static iconContainerStyle = {
    margin: '0px',
    width: '48px'
  };

  static leftIconStyle = {
    margin: '0px',
    width: '48px'
  };

  static leftUnauthorizedIconStyle = {
    margin: '0px',
    width: '28px',
    left: '48px',
    float: 'left'
  };

  static menuItemPrimaryTextStyle = {
    float: 'left',
    fontWeight: 500,
    fontSize: '14px',
    color: '#212121',
    paddingTop: '4px',
    lineHeight: '20px',
    height: '24px',
    width: '100%'
  };

  static menuItemSecondaryTextStyle = {
    float: 'left',
    width: '100%',
    fontSize: '12px',
    height: '16px',
    color: '#707070',
    paddingBottom: '4px',
    lineHeight: '12px'
  };

  constructor(props, context) {
    super(props, context);
    this.dataSource = [];
    this.animation = this.animation.bind(this);
    this.filter = this.filter.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.eclipseWidth = null;
    this.underlineShow = false;
    this.closeSearchBarClick = this.closeSearchBarClick.bind(this);
    this.micSearchBarClick = this.micSearchBarClick.bind(this);
    this.updateSearchDataSource = this.updateSearchDataSource.bind(this);
    this.setDataSource = this.setDataSource.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCloseSearch = this.onCloseSearch.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);

    if (props.dataSource) {
      this.updateSearchDataSource(props.dataSource, true);
    }
    let boaPalette = this.props.context.theme.boaPalette;
    let _paperStyle = { backgroundColor: boaPalette.comp250, height: 40, maxWidth: 640, marginTop: 15, marginLeft: 'auto', marginRight: 'auto', borderRadius: '2px', boxShadow: 'none' };
    let _popoverStyle = {
      backgroundColor: boaPalette.comp500,
      // position: 'absolute',
      // height: '48px',
      // maxWidth: '100%',
      // width: '100%',
      // marginLeft: 'auto',
      zIndex: 10000,
      // marginRight: 'auto'
    };
    if (props.context.deviceSize < BComponent.Sizes.MEDIUM) {
      this.state = {
        micVisibilty: true,
        isSearching: false,
        openSearchBar: false,
        searchDataSource: props.dataSource,
        popoverStyle: _popoverStyle,
        paperStyle: _paperStyle,
        hintStyle: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 'auto', color: boaPalette.base450, bottom: '0px', height: '48px', lineHeight: '48px' },
        searchTextFieldStyle: { height: '48px', color: boaPalette.base450, boxShadow: '0px 0px 5px gray', position: 'relative', zIndex: '0' },
        searchIconStyle: { position: 'absolute', zIndex: '1', marginTop: '0px', marginLeft: '0px', fill: 'grey' },
        searchTextInputStyle: { position: 'absolute', color: boaPalette.base300 },
        suffixButtonStyle: { color: boaPalette.comp500 }
      };
    }
    else {
      this.state = {
        micVisibilty: true,
        isSearching: false,
        openSearchBar: false,
        searchDataSource: props.dataSource,
        popoverStyle: _popoverStyle,
        paperStyle: _paperStyle,
        hintStyle: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: boaPalette.comp450, marginRight: 'auto', bottom: '0px', height: '40px', lineHeight: '40px', width: 'calc(100% - 100px)' },
        searchTextFieldStyle: { height: '40px' },
        searchIconStyle: { margin: '8px 12px' },
        // searchIconStyle: { float: 'left', zIndex: '1', marginTop: '8px', marginLeft: !this.props.context.localization.isRightToLeft ? '12px' : '0px', marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px', fill: 'white' },
        searchTextInputStyle: { color: boaPalette.comp500 },
        suffixButtonStyle: { color: boaPalette.comp500 }
      };
    }
  }

  dataSourceConfig = {
    text: 'text',
    value: 'value',
    render: 'render'
  };

  openSearchBar() {
    this.setState((prevState) => {
      return { openSearchBar: !prevState.openSearchBar };
    });
  }

  closeSearchBarClick() {
    this.setState((prevState) => {
      return { openSearchBar: !prevState.openSearchBar };
    });
    this.binputsearch.getInstance().clearValue();
  }

  micSearchBarClick() {
    alert('TO DO: Search with microphone');
  }
  onCloseSearch() {
    this.binputsearch.getInstance().clearValue();
    this.setState({ isSearching: false, openSearchBar: false });
  }

  onClearSearch() {
    this.binputsearch.getInstance().clearValue();
    this.setState({ isSearching: false });
  }


  resetValue() {
    this.dataSource = [];
    this.setState({ searchDataSource: [] });
  }

  updateSearchDataSource(dataSource, isClear) {
    if (isClear) {
      this.dataSource = [];
    }
    var searchDataSource = cloneDeep(dataSource);
    if (searchDataSource && searchDataSource.length > 0) {
      for (var i = 0; i < searchDataSource.length; i++) {
        var obj = searchDataSource[i];
        this.setDataSource(obj);
      }
    }
    this.setState({ searchDataSource: searchDataSource });
  }

  setDataSource(obj) {
    const { classes } = this.props;

    if (obj.items && obj.items.length > 0) {
      for (var i = 0; i < obj.items.length; i++) {
        var innerObj = obj.items[i];
        if (obj.leftIcon)
          innerObj.leftIcon = obj.leftIcon;
        this.setDataSource(innerObj);
      }
    }
    else {
      if (!(obj && obj.allProperties)) {
        return;
      }
      let boaPalette = this.props.context.theme.boaPalette;
      let resourceType = 'Page';
      if (obj && obj.allProperties && obj.allProperties.resourceCode && obj.allProperties.resourceCode.toString().substr(0, 3) === 'RPT')
        resourceType = 'Report';

      let leftIcon;
      if (!obj.allProperties.isAuthorizedResource || obj.allProperties.isHidden) {
        let lockIcon = {
          height: '24px',
          width: '24px',
          margin: !this.props.context.localization.isRightToLeft ? '8px 4px 8px 0px' : '8px 0px 8px 4px'
        };
        this.rootStyle = Object.assign({}, this.rootStyle, { opacity: '1' });
        this.iconContainerStyle = Object.assign({}, this.iconContainerStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', right: 'auto', display: 'flex' } : { left: 'auto', right: '0px', display: 'flex' });
        this.innerDivStyle = Object.assign({}, this.innerDivStyle,
          {
            float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
            paddingLeft: !this.props.context.localization.isRightToLeft ? '76px' : '0px',
            paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '76px'
          });
        this.leftIconStyle = Object.assign({}, this.leftIconStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', float: 'left' } : { right: '0px', float: 'right' });
        this.menuItemPrimaryTextStyle = Object.assign({}, this.menuItemPrimaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base250 });
        this.menuItemSecondaryTextStyle = Object.assign({}, this.menuItemSecondaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base250 });

        leftIcon =
          <div style={this.iconContainerStyle}>
            <div style={this.leftIconStyle}>
              {this.getIcon(obj.leftIcon, 1)}</div>
            <div style={this.leftUnauthorizedIconStyle}>
              <Lock nativeColor={boaPalette.sec350} context={this.props.context} style={lockIcon}></Lock></div>
          </div>;
      }
      else {
        this.rootStyle = Object.assign({}, this.rootStyle, { opacity: '1' });
        this.iconContainerStyle = Object.assign({}, this.iconContainerStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', right: 'auto' } : { left: 'auto', right: '0px' });
        this.innerDivStyle = Object.assign({}, this.innerDivStyle,
          {
            float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
            paddingLeft: !this.props.context.localization.isRightToLeft ? '48px' : '0px',
            paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '48px'
          });
        this.leftIconStyle = Object.assign({}, this.leftIconStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', float: 'left' } : { right: '0px', float: 'right' });
        this.menuItemPrimaryTextStyle = Object.assign({}, this.menuItemPrimaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base450 });
        this.menuItemSecondaryTextStyle = Object.assign({}, this.menuItemSecondaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base350 });

        leftIcon = <div style={this.iconContainerStyle}><div style={this.leftIconStyle}>{this.getIcon(obj.leftIcon)}</div></div>;
      }

      // List item dense özelliği kullanılabilir (coral)
      this.dataSource.push({
        allProperties: obj.allProperties,
        items: obj.items,
        leftIcon: leftIcon,
        text: obj.text,
        value: obj.value,
        render: (
          <ListItem
            button
            disabled={!obj.allProperties.isAuthorizedResource || obj.allProperties.isHidden}
            // dense={true}
            style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0 }}>
            {/* <ListItemIcon> */}
            {leftIcon}
            {/* </ListItemIcon> */}
            <ListItemText
              primary={obj.text}
              secondary={resourceType}
              classes={{
                root: classes.root,
                primary: classes.primary,
                secondary: classes.secondary
              }} />
          </ListItem>
          // <div style={this.innerDivStyle} >
          //   {leftIcon}
          //   <div style={menuItemStyle}><span style={this.menuItemPrimaryTextStyle}>{obj.text}</span><span style={this.menuItemSecondaryTextStyle}>{resourceType}</span></div>
          // </div>
        )
      });

      // this.dataSource.push({
      //   text: obj.text,
      //   render: <MenuItem
      //     hoverColor='rgba(255,255,255,0.15)'
      //     selectedObj={obj}
      //     style={this.rootStyle}
      //     leftIconDesktop={leftIconDesktop}
      //     innerDivStyle={this.innerDivStyle}
      //     secondaryText={<div style={menuItemStyle}><span style={this.menuItemPrimaryTextStyle}>{obj.text}</span><span style={this.menuItemSecondaryTextStyle}>{resourceType}</span></div>}
      //     disabled={!obj.allProperties.isAuthorizedResource || obj.allProperties.isHidden}
      //     leftIcon={leftIcon} />
      // });
    }
  }

  componentWillMount() {
    Object.assign(this.state.paperStyle, this.props.style);

    // this.state.searchTextFieldStyle.paddingLeft = 45;
    // this.state.searchTextFieldStyle.paddingRight = 45;
    // this.state.searchTextFieldStyle.paddingTop = 1;
    // this.state.searchTextFieldStyle.paddingBottom = 1;
    // this.state.searchTextFieldStyle.color = this.props.context.theme.boaPalette.comp450;
    this.state.searchTextInputStyle.backgroundColor = 'rgba(0,0,0,0.0)';

    // this.state.searchTextInputStyle.color = 'white';
    this.props.context.deviceSize < BComponent.Sizes.MEDIUM ? this.state.searchTextInputStyle.fontSize = 15 : this.state.searchTextInputStyle.fontSize = 14;
    (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? this.state.searchTextInputStyle.marginTop = 10 : this.state.searchTextInputStyle.marginTop = 7;
    // this.props.context.deviceSize < BComponent.Sizes.MEDIUM ? this.state.searchTextInputStyle.marginLeft = '48px' : {};

    if (this.props.context.localization.isRightToLeft) {
      Object.assign(this.state.searchIconStyle, { textAlign: 'right' });
      Object.assign(this.state.hintStyle, { textAlign: 'right' });
      Object.assign(this.state.searchTextFieldStyle, { textAlign: 'right' });
      Object.assign(this.state.searchTextInputStyle, { textAlign: 'right' });
    }
    else {
      Object.assign(this.state.searchIconStyle, { textAlign: 'left' });
      Object.assign(this.state.hintStyle, { textAlign: 'left' });
      Object.assign(this.state.searchTextFieldStyle, { textAlign: 'left' });
      Object.assign(this.state.searchTextInputStyle, { textAlign: 'left' });
    }
  }
  componentDidUpdate(prevProp, prevState) {
    super.componentDidUpdate(prevProp, prevState);

    this.props.context.deviceSize > BComponent.Sizes.SMALL &&
      this.binputsearch && this.binputsearch.getInstance().state.value.length <= 0 &&
      this.setState({ isSearching: false });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.context !== this.props.context) ||
      (nextState.searchDataSource !== this.state.searchDataSource) ||
      (nextState.searchIconStyle !== this.state.searchIconStyle) ||
      (nextState.hintStyle !== this.state.hintStyle) ||
      (nextState.searchTextFieldStyle !== this.state.searchTextFieldStyle) ||
      (nextState.searchTextInputStyle !== this.state.searchTextInputStyle) ||
      (nextState.openSearchBar !== this.state.openSearchBar) ||
      (nextState.isSearching !== this.state.isSearching) ||
      (nextState.suffixButtonStyle !== this.state.suffixButtonStyle) ||
      (nextState.micVisibilty !== this.state.micVisibilty) ||
      (nextState.value !== this.state.value);
  }

  getIcon(iconProp, isLock = 0) {
    if (iconProp) {
      if (iconProp && iconProp.iconProperties) {
        iconProp.iconProperties.style = {
          height: '24px',
          width: '24px',
          margin: '8px 12px',
          color: iconProp.iconProperties.color,
        };
        if (isLock == 1) {
          let boaPalette = this.props.context.theme.boaPalette;
          iconProp.iconProperties.style.color = boaPalette.pri350;
        }
      }
      let icon = BIcon.getIcon(iconProp);
      return icon ? icon : iconProp;
    }
    return null;
  }

  render() {
    let _searchBar = {};
    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      _searchBar = this.renderDesktop();
    }
    else {
      _searchBar = this.renderMobile();
    }
    return _searchBar;
  }

  renderMobile() {

    let s = <BButton context={this.props.context}
      type='icon'
      dynamicIcon='ArrowBack'
      iconProperties={{ style: { width: '24px', height: '24px', color: this.props.context.theme.boaPalette.base400 } }}
      style={this.state.searchIconStyle}
      onClick={this.closeSearchBarClick} />;

    let r = <BButton context={this.props.context}
      type='icon'
      dynamicIcon='Close'
      iconProperties={{ style: { width: '24px', height: '24px', color: this.props.context.theme.boaPalette.base400, visibility: this.state.isSearching ? 'visible' : 'collapse' } }}
      style={{ float: 'right', zIndex: 10 }}
      onClick={this.onClearSearch} />;


    return (
      <div style={{ backgroundColor: '#fff' }}>
        <BPopover style={this.state.popoverStyle} context={this.props.context} open={this.state.openSearchBar}
          PaperProps={{
            style: {
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              maxHeight: 'initial',
              maxWidth: 'initial',
              position: 'initial',
              // boxShadow: '0px 0px 5px grey',
              // borderRadius: 0
            }
          }}>
          <style type="text/css">
            {`
          #autoCompleteInput::placeholder { /* Chrome/Opera/Safari */
            opacity: 1 !important;
          }
          #autoCompleteInput::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            opacity: 1 !important;
          }
          #autoCompleteInput::-moz-placeholder { /* Firefox 19+ */
            opacity: 1 !important;
          }
          #autoCompleteInput:-ms-input-placeholder { /* IE 10+ */
            opacity: 1 !important;
          }
          #autoCompleteInput:-moz-placeholder { /* Firefox 18- */
            opacity: 1 !important;
          }
          `}
          </style>
          <BAutoComplete
            id="binputsearchId"
            context={this.props.context}
            ref={r => this.binputsearch = r}
            animated={this.props.animated}
            open={this.props.open}
            hintText={this.props.hintText}
            dataSource={this.dataSource}
            dataSourceConfig={this.dataSourceConfig}
            floatingLabelText={this.props.floatingLabelText}
            fullWidth={this.props.fullWidth}
            listStyle={this.props.listStyle}
            maxSearchResults={this.props.maxSearchResults}
            animation={this.props.animation}
            filter={this.filter}
            onNewRequest={this.onNewRequest}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onUpdateInput={this.props.onUpdateInput}
            errorText={this.props.errorText}
            errorStyle={this.props.errorStyle}
            outerStyle={this.state.searchTextFieldStyle}
            underlineShow={this.underlineShow}
            hintStyle={this.state.hintStyle}
            prefixText={s}
            suffixText={r}
            inputStyle={this.state.searchTextInputStyle}
            onChange={this.onChange}
          // renderSuggestion={this.renderSuggestion}
          />

        </BPopover>
      </div>
    );
  }

  renderDesktop() {
    let s = <Search style={this.state.searchIconStyle} />;
    let r =
      <BButton context={this.props.context}
        type='icon'
        dynamicIcon={'Close'}
        iconProperties={{ style: this.state.suffixButtonStyle }}
        style={{ width: '48px', height: '40px', zIndex: 123, visibility: this.state.isSearching ? 'visible' : 'collapse' }}
        onClick={this.state.isSearching ? this.onClearSearch : this.micSearchBarClick}
      />;

    return (
      <Paper style={this.state.paperStyle} zDepth={1}>
        <style type="text/css">
          {`
          #autoCompleteInput::placeholder { /* Chrome/Opera/Safari */
            opacity: 1 !important;
          }
          #autoCompleteInput::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            opacity: 1 !important;
          }
          #autoCompleteInput::-moz-placeholder { /* Firefox 19+ */
            opacity: 1 !important;
          }
          #autoCompleteInput:-ms-input-placeholder { /* IE 10+ */
            opacity: 1 !important;
          }
          #autoCompleteInput:-moz-placeholder { /* Firefox 18- */
            opacity: 1 !important;
          }
          `}
        </style>
        <BAutoComplete
          id="binputsearchId"
          context={this.props.context}
          ref={r => this.binputsearch = r}
          animated={this.props.animated}
          open={this.props.open}
          hintText={this.props.hintText}
          dataSource={this.dataSource}
          dataSourceConfig={this.dataSourceConfig}
          floatingLabelText={this.props.floatingLabelText}
          fullWidth={this.props.fullWidth}
          listStyle={this.props.listStyle}
          maxSearchResults={this.props.maxSearchResults}
          animation={this.props.animation}
          filter={this.filter}
          onNewRequest={this.onNewRequest}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onUpdateInput={this.props.onUpdateInput}
          errorText={this.props.errorText}
          errorStyle={this.props.errorStyle}
          outerStyle={this.state.searchTextFieldStyle}
          underlineShow={this.underlineShow}
          hintStyle={this.state.hintStyle}
          inputStyle={this.state.searchTextInputStyle}
          prefixText={s}
          suffixText={r}
          onChange={this.onChange}
          renderSuggestion={this.renderSuggestion}
        />
      </Paper>
    );
  }

  onChange(newValue) {
    const boaPalette = this.props.context.theme.boaPalette;
    let newStyle = Object.assign({}, this.state.suffixButtonStyle, { color: this.props.context.theme.boaPalette.base400 });
    let _searchTextInputFocusStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base450 }) : this.state.searchTextInputStyle;
    let _searchTextInputStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base300 }) : this.state.searchTextInputStyle;

    if (newValue.length > 0) {
      this.setState({
        suffixButtonStyle: newStyle,
        isSearching: true,
        value: newValue,
        searchTextInputStyle: _searchTextInputFocusStyle,
      });
    } else {
      // newStyle = Object.assign({}, this.state.suffixButtonStyle, { color: this.props.context.theme.boaPalette.comp500 });
      this.setState({
        suffixButtonStyle: newStyle,
        isSearching: false,
        value: '',
        searchTextInputStyle: _searchTextInputStyle,
      });
    }
  }

  renderSuggestion(suggestion, query) {

    const { classes } = this.props;

    let boaPalette = this.props.context.theme.boaPalette;
    let resourceType = 'Page';
    if (suggestion && suggestion.allProperties && suggestion.allProperties.resourceCode && suggestion.allProperties.resourceCode.toString().substr(0, 3) === 'RPT')
      resourceType = 'Report';

    let leftIcon;
    if (!suggestion.allProperties.isAuthorizedResource || suggestion.allProperties.isHidden) {
      this.rootStyle = Object.assign({}, this.rootStyle, { opacity: '1' });
      this.iconContainerStyle = Object.assign({}, this.iconContainerStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', right: 'auto', display: 'flex' } : { left: 'auto', right: '0px', display: 'flex' });
      this.innerDivStyle = Object.assign({}, this.innerDivStyle,
        {
          float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
          paddingLeft: !this.props.context.localization.isRightToLeft ? '76px' : '0px',
          paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '76px'
        });
      this.leftIconStyle = Object.assign({}, this.leftIconStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', float: 'left' } : { right: '0px', float: 'right' });
      this.menuItemPrimaryTextStyle = Object.assign({}, this.menuItemPrimaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base250 });
      this.menuItemSecondaryTextStyle = Object.assign({}, this.menuItemSecondaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base250 });

      leftIcon =
        <div style={this.iconContainerStyle}>
          <div style={this.leftIconStyle}>
            {this.getIcon(suggestion.leftIcon, 1)}</div>
        </div>;
    }
    else {
      this.rootStyle = Object.assign({}, this.rootStyle, { opacity: '1' });
      this.iconContainerStyle = Object.assign({}, this.iconContainerStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', right: 'auto' } : { left: 'auto', right: '0px' });
      this.innerDivStyle = Object.assign({}, this.innerDivStyle,
        {
          float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
          paddingLeft: !this.props.context.localization.isRightToLeft ? '48px' : '0px',
          paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '48px'
        });
      this.leftIconStyle = Object.assign({}, this.leftIconStyle, !this.props.context.localization.isRightToLeft ? { left: '0px', float: 'left' } : { right: '0px', float: 'right' });
      this.menuItemPrimaryTextStyle = Object.assign({}, this.menuItemPrimaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base450 });
      this.menuItemSecondaryTextStyle = Object.assign({}, this.menuItemSecondaryTextStyle, { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right', color: boaPalette.base350 });

      leftIcon = <div style={this.iconContainerStyle}><div style={this.leftIconStyle}>{this.getIcon(suggestion.leftIcon)}</div></div>;
    }

    // const matches = match(suggestion[this.dataSourceConfig.text].toLowerCase(), query);
    const matches = match(suggestion[this.dataSourceConfig.text], query);
    let parts = parse(suggestion[this.dataSourceConfig.text], matches);
    let suggesionText = BComponent.Localization.stringLowerCase(suggestion.text);
    let queryText = BComponent.Localization.stringLowerCase(query);

    // BComponent.Localization.stringLowerCase(text).includes(BComponent.Localization.stringLowerCase(searchText));
    if (Array.isArray(matches) && matches.length < 1) {
      let indexOfQuery = suggesionText.indexOf('' + queryText);
      let matchesNotBeginnigIndex = [{ 0: indexOfQuery, 1: indexOfQuery + query.length }];
      parts = parse(suggestion[this.dataSourceConfig.text], matchesNotBeginnigIndex);
    }

    let menuItem = (
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ color: boaPalette.pri500 }}>
              {part.text}
            </span>
          ) : (
            <span key={String(index)}>
              {part.text}
            </span>
            );
        })}
      </div>
    );

    if (suggestion.allProperties.typeId == 4)
      return null;

    let item =
      <ListItem
        button
        disabled={!suggestion.allProperties.isAuthorizedResource || suggestion.allProperties.isHidden}
        // dense={true}
        style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0,  }}>
        {/* <ListItemIcon> */}
        {leftIcon}
        {/* </ListItemIcon> */}
        <ListItemText
          primary={menuItem}
          secondary={resourceType}
          classes={{
            root: classes.root,
            primary: classes.primary,
            secondary: classes.secondary
          }} />
      </ListItem>;

    return item;
  }

  getMenuName(text) {
    let obj = ReactDOM.findDOMNode(this.binputsearch.refs.searchTextField);
    if (obj.value && BComponent.Localization.stringLowerCase(text).indexOf(BComponent.Localization.stringUpperCase(obj.value)) !== -1) {
      return React.createElement('span', { style: { color: 'blue' } }, obj.value) + BComponent.Localization.stringUpperCase(text).replace(obj.value, '');
    }
    else {
      return text;
    }
  }

  openPopover() {
    this.bPopover.openPopover();
  }

  animation() {
    if (this.props.animation) {
      this.props.animation();
    }
  }

  filter(searchText, key) {
    if (this.props.filter) {
      this.props.filter(searchText, key);
    }
    else {
      if (searchText.length > 2)
        return BComponent.Localization.stringLowerCase(key).indexOf(BComponent.Localization.stringLowerCase(searchText)) !== -1;
    }
  }

  onNewRequest(event, suggestion) {
    if (suggestion &&
      suggestion.suggestion &&
      suggestion.suggestion.render &&
      suggestion.suggestion.render.props &&
      suggestion.suggestion.render.props.disabled)
      return;
    if (this.props.onNewRequest) {
      this.props.onNewRequest();
    }

    if (suggestion.suggestionIndex != -1) { // && suggestion.suggestion && suggestion.suggestion.allProperties && !suggestion.suggestion.allProperties.isHidden) {
      if (this.props.onItemClick) {
        this.props.onItemClick(suggestion);
      }
    }

    // if (suggestion.suggestion && suggestion.suggestion.allProperties && !suggestion.suggestion.allProperties.isHidden) {
    this.onCloseSearch();
    // }
    // var resource = chosenRequest.value.props.selectedObj;
    // if (index != -1) {
    //   if (resource.items) {
    //     resource.items = [];
    //   }
    //   if (this.props.onItemClick) {
    //     this.props.onItemClick(resource);
    //   }
    //   this.closeSearchBarClick();
    // }
  }

  onUpdateInput() {
    if (this.props.onUpdateInput) {
      this.props.onUpdateInput();
    }
  }

  onFocus() {
    let boaPalette = this.props.context.theme.boaPalette;
    let _searchTextInputStyle = {};
    let _searchTextFieldStyle = {};
    // let _suffixButtonStyle ={};
    let _hintStyle = {};
    let _searchIconStyle = {};
    let _paperStyle = Object.assign({}, this.state.paperStyle, { backgroundColor: boaPalette.comp500 });
    let _suffixButtonStyle = {};

    // _paperStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.paperStyle, { color: boaPalette.base450 }) : Object.assign({}, this.state.paperStyle, { color: boaPalette.base450 });

    if (this.state.openSearchBar) {
      _searchTextInputStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base300 }) : Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base450 });
      _searchTextFieldStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp500, borderRadius: '0px', boxShadow: '0px 0px 5px gray' }) : {}; // Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp500, color: boaPalette.base450, borderRadius: '2px' });
      _hintStyle = Object.assign({}, this.state.hintStyle, { color: boaPalette.base350 });
      _searchIconStyle = Object.assign({}, this.state.searchIconStyle, { fill: boaPalette.base400 });
      _suffixButtonStyle = Object.assign({}, this.state.suffixButtonStyle, { color: this.props.context.theme.boaPalette.base400 });
    }
    else {
      _searchTextInputStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base300 }) : Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base450 });
      _searchTextFieldStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp500, borderRadius: '0px' }) : Object.assign({}, this.state.searchTextFieldStyle, { boxShadow: '0px 0px 5px gray', position: 'relative', zIndex: '0' }); // Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp500, color: boaPalette.base350, borderRadius: '2px' });
      _hintStyle = Object.assign({}, this.state.hintStyle, { color: boaPalette.base350 });
      _searchIconStyle = Object.assign({}, this.state.searchIconStyle, { fill: boaPalette.base400 });
      _suffixButtonStyle = Object.assign({}, this.state.suffixButtonStyle, { color: this.props.context.theme.boaPalette.base400 });
    }

    this.setState({
      searchIconStyle: _searchIconStyle,
      hintStyle: _hintStyle,
      paperStyle: _paperStyle,
      searchTextFieldStyle: _searchTextFieldStyle,
      searchTextInputStyle: _searchTextInputStyle,
      suffixButtonStyle: _suffixButtonStyle
    });
  }

  onBlur() {
    let boaPalette = this.props.context.theme.boaPalette;
    let _searchTextInputStyle = {};
    let _searchTextFieldStyle = {};
    let _suffixButtonStyle = {};
    let _hintStyle = {};
    let _searchIconStyle = {};
    let _paperStyle = Object.assign({}, this.state.paperStyle, { backgroundColor: boaPalette.comp250 });

    // _paperStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.paperStyle, { color: boaPalette.base450 }) : Object.assign({}, this.state.paperStyle, { color: boaPalette.base450 });

    if (this.state.openSearchBar) {
      _searchTextInputStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base300 }) : Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.comp450 });
      // _searchTextInputStyle = Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base450 });
      _searchTextFieldStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp500, borderRadius: '0px' }) : {}; // Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp500, color: boaPalette.base450, borderRadius: '2px' });
      _hintStyle = Object.assign({}, this.state.hintStyle, { color: boaPalette.base400 });
      _searchIconStyle = Object.assign({}, this.state.searchIconStyle, { fill: 'grey' });
      _suffixButtonStyle = Object.assign({}, this.state.suffixButtonStyle, { color: this.props.context.theme.boaPalette.comp500 });
    }
    else {
      _searchTextInputStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base300 }) : Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.comp450 });
      // _searchTextInputStyle = Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.comp450 });
      _searchTextFieldStyle = (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) ? Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: boaPalette.comp250, borderRadius: '0px' }) : Object.assign({}, this.state.searchTextFieldStyle, { boxShadow: '0px 0px 0px gray' }); // Object.assign({}, this.state.searchTextFieldStyle, { backgroundColor: 'rgba(255,255,255,0.05)', color: boaPalette.comp450, borderRadius: '2px' });
      _hintStyle = Object.assign({}, this.state.hintStyle, { color: boaPalette.comp450 });
      _searchIconStyle = Object.assign({}, this.state.searchIconStyle, { fill: 'white' });
      _suffixButtonStyle = Object.assign({}, this.state.suffixButtonStyle, { color: this.props.context.theme.boaPalette.comp500 });
    }

    this.setState({
      searchIconStyle: _searchIconStyle,
      hintStyle: _hintStyle,
      paperStyle: _paperStyle,
      searchTextFieldStyle: _searchTextFieldStyle,
      searchTextInputStyle: _searchTextInputStyle,
      isSearching: this.binputsearch && this.binputsearch.getInstance().state.value && this.binputsearch.getInstance().state.value.length > 0 ? true : false,
      suffixButtonStyle: _suffixButtonStyle
    });
    this.binputsearch.getInstance().onBlur();
  }
}

export default BInputSearch;
