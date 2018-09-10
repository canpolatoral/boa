/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import BInput from 'b-input';
import Search from '@material-ui/icons/Search';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer

export class CustomerInputSearch extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    name:PropTypes.string,
    hintText: PropTypes.string,
    disabled: PropTypes.bool,
    textFieldStyle: PropTypes.object,
    style: PropTypes.object,
    onKeyPress: PropTypes.func
  };

  _divContainer :any;

  constructor(props, context) {
    super(props, context);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.underlineShow = false;

    let boaPalette = this.props.context.theme.boaPalette;
     
    let _mainStyle = { 
      backgroundColor: 'rgba(255,255,255,0.25)', 
      height: '32px', 
      maxWidth: '640px', 
      borderWidht: '0px',
      fontSize: '14px'
    };

    this.state = {

      customerId: 0,
      disabled: this.props.disabled,
      paperStyle: Object.assign({}, _mainStyle, this.props.style),
      dataSourceFiltered: [],
      searchIconStyle: {
        position: 'absolute', 
        zIndex: 1, 
        marginTop: '6px', 
        marginLeft: !this.props.context.localization.isRightToLeft ? '8px' : '0px', 
        marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '8px', 
        fill: '#D2EFF9'
      },

      searchTextInputStyle: {
        marginTop:'-8px',
        color: boaPalette.base250,
        height: '26px',
        lineHeight: '26px'
      }
    };

    this._divContainer = {
      paddingLeft: '32px',
      marginTop: '4px'
    };
  }

  componentWillReceiveProps(nextProps) { 
    if (nextProps.disabled !== this.props.disabled)
    {
      this.setState({ 
        disabled: nextProps.disabled
      });
    }
  }
 
  onFocus() {
    let boaPalette = this.props.context.theme.boaPalette;
    let _searchIconStyle = Object.assign({}, this.state.searchIconStyle, { fill: '#1C9ECA' });
    let _searchTextInputStyle = Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base450 });

    this.setState({
      searchIconStyle: _searchIconStyle,
      searchTextInputStyle: _searchTextInputStyle
    });
  }


  onKeyPress(event) {

    if (event.keyCode == 13) {
      if (this.props.onKeyPress) {
        let id = Number.parseInt(this.binputsearch.getInstance().getValue());
        if (!Number.isNaN(id)) {
          this.props.onKeyPress(id);
        }
      }
    }
  }

  onBlur() {
    let boaPalette = this.props.context.theme.boaPalette;
    let _searchIconStyle = Object.assign({}, this.state.searchIconStyle, { fill: '#D2EFF9' });
    let _searchTextInputStyle = Object.assign({}, this.state.searchTextInputStyle, { color: boaPalette.base250 });

    this.setState({
      searchIconStyle: _searchIconStyle,
      searchTextInputStyle: _searchTextInputStyle
    });
  }
  
  componentWillMount() {

    Object.assign(this.state.paperStyle, this.props.style);

    if (this.props.context.localization.isRightToLeft) {
      Object.assign(this.state.searchIconStyle, { textAlign: 'right' });
      Object.assign(this.state.searchTextInputStyle, { textAlign: 'right' });
    } else {
      Object.assign(this.state.searchIconStyle, { textAlign: 'left' });
      Object.assign(this.state.searchTextInputStyle, { textAlign: 'left' });
    }
  }

  resetValue() {
    this.binputsearch.resetValue();
  }

  render() {
    let _searchBar = {};
    _searchBar = this.renderDesktop();
    return _searchBar;
  }

  renderDesktop() {
    return (
      <div style={this.state.paperStyle} zdepth={1}>
        <Search style={this.state.searchIconStyle} viewBox={'0 0 30 30'} />
        <div style={this._divContainer}>
          <BInput
            id="binputsearchId"
            context={this.props.context}
            ref={r => this.binputsearch = r}
            hintText={this.props.hintText}
            disabled={this.state.disabled}
            name={this.props.name}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyPress}
            inputStyle={this.state.searchTextInputStyle}
            underlineShow={this.underlineShow}
          />
        </div>
      </div>
    );
  }
}

export default CustomerInputSearch;
