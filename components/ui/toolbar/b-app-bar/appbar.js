import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {List, ListItem} from '@material-ui/core/List';

import { BComponent, BComponentComposer } from 'b-component';
import { BInputSearch } from 'b-input-search';
import { BButton } from 'b-button';
import { BDivider } from 'b-divider';
import { BFavoriteMenu } from 'b-favorite-menu';
import { BPopover } from 'b-popover';
import { BMenuItem } from 'b-menu-item';
import { BUserProfile } from 'b-user-profile';
import { BAvatar } from 'b-avatar';

var User = require('b-icon').Others.User;

@BComponentComposer
export class BAppBarInner extends BComponent {
  static muiName = 'AppBar';

  static propTypes = {
    ...BComponent.propTypes,
    children: PropTypes.node,
    customerPaneElement: PropTypes.element,
    navigationMenuElement: PropTypes.element,
    fullscreenElement: PropTypes.element,
    logo: PropTypes.any,
    onNavigationMenuClick: PropTypes.func,
    onRightIconButtonTouchTap: PropTypes.func,
    onTitleTouchTap: PropTypes.func,
    showMenuIconButton: PropTypes.bool,
    title: PropTypes.node,
    zDepth: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
    searchBarHintText: PropTypes.string,
    onItemClick: PropTypes.any,
    resourceList: PropTypes.any
  };
  static defaultProps = {
    ...BComponent.defaultProps,
    showMenuIconButton: true,
    title: '',
    zDepth: 1
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    popoverStyle : { position: 'absolute',  maxWidth: '100%', width: 'calc(100% - 16px)', margin: '8px', zIndex: 10000 }
  };

  constructor(props, context) {
    super(props, context);
    this.handleTouchTapRightIconButton = this.handleTouchTapRightIconButton.bind(this);
    this.handleTitleTouchTap = this.handleTitleTouchTap.bind(this);
    this.openSettingsMenu = this.openSettingsMenu.bind(this);
    this.openUserProfileMenu = this.openUserProfileMenu.bind(this);
    this.openFavoriteMenu = this.openFavoriteMenu.bind(this);
    this.favoriteMenuItemClick = this.favoriteMenuItemClick.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.onActionSearchClick = this.onActionSearchClick.bind(this);
  
    this.appBarContent = {};
    this._customerPaneElement = {};
    this._navigationMenuElement = {};
    this._userElement = {};
    this._favoriteElement = {};
    this._settingsElement = {};
    this._fullscreenElement = {};
  }

  getStyles(props) {
    // const {
    //   appBar,
    //   button: {
    //     iconButtonSize,
    //   },
    //   zIndex,
    // } = context.muiTheme;

    const styles = {
      root: {
        position: 'fixed',
        zIndex: 1100,
        width: '100%',
        display: 'flex',
        backgroundColor: props.context.theme.boaPalette.pri500,
        paddingLeft: '12px',
        paddingRight:'12px',
        top: 0,
        height: '70px'
      },
      title: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: 0,
        paddingTop: 0,
        letterSpacing: 0,
        fontSize: 24,
        fontWeight: 400,
        color: props.context.theme.boaPalette.comp500,
        height: 64,
        lineHeight: '$64px',
      },
      mainElement: {
        boxFlex: 1,
        flex: '1',
      },
      iconButtonStyle: {
        marginTop: 18,
        marginRight: 8,
        marginLeft: -16,
      },
      iconButtonIconStyle: {
        fill: props.context.theme.boaPalette.comp500,
        color: props.context.theme.boaPalette.comp500,
      },
      flatButton: {
        color: props.context.theme.boaPalette.comp500,
        marginTop: 16,
      },
    };
    return styles;
  }

  resetSearchValue() {
    this.inputSearch.resetValue();
  }

  updateSearchDataSource(searchDataSource) {
    this.inputSearch.updateSearchDataSource(searchDataSource, true);
    this.favoriteMenu.updateDataSource(searchDataSource);
  }

  updateOnlySearchDataSource(searchDataSource) {
    this.inputSearch.updateSearchDataSource(searchDataSource, false);
  }

  openFavoriteMenu() {
    this.favoriteMenu.openFavoriteMenu();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.context !== this.props.context;
  }

  openSettingsMenu() {
    this.settingsMenu.openSettingsMenu();
  }

  openUserProfileMenu() {
    this.userProfileMenu.openUserProfileMenu();
  }

  handleTouchTapRightIconButton(event) {
    if (this.props.onRightIconButtonTouchTap) {
      this.props.onRightIconButtonTouchTap(event);
    }
  }

  handleTitleTouchTap(event) {
    if (this.props.onTitleTouchTap) {
      this.props.onTitleTouchTap(event);
    }
  }

  favoriteMenuItemClick(parameters) {
    if (this.props.onItemClick) {
      this.props.onItemClick(parameters);
    }
  }

  openPopover() {
    this.bPopover.openPopover();
  }

  onActionSearchClick() {
    this.inputSearch.openSearchBar();
  }

  render() {
    const {
      showMenuIconButton,
      navigationMenuElement,
      customerPaneElement,
      fullscreenElement, // eslint-disable-line no-unused-vars
      zDepth,
      children,
      resourceList, // eslint-disable-line no-unused-vars
      leftDocked, // eslint-disable-line no-unused-vars
      rightDocked, // eslint-disable-line no-unused-vars
      logo, // eslint-disable-line no-unused-vars
      context,
      onItemClick, // eslint-disable-line no-unused-vars
      searchBarHintText, // eslint-disable-line no-unused-vars
      onTitleTouchTap, // eslint-disable-line no-unused-vars
      onNavigationMenuClick, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props;

    const styles = this.getStyles(this.props, this.context);

    const iconUserStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'right' : 'left',
      cursor: 'pointer',
      padding: '11px 7px'
    };

    const iconLeftStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      padding: '11px 0px'
    };

    const iconRightStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'right' : 'left',
      padding: '11px 0px'
    };

    if (showMenuIconButton) {
      if (navigationMenuElement) {
        const navigationMenuElementProps = {};
        this._navigationMenuElement =
          (<div style={iconLeftStyle}>
            {Object.keys(navigationMenuElementProps).length > 0 ?
              cloneElement(navigationMenuElement, navigationMenuElementProps) :
              navigationMenuElement}
          </div>);
      }
    }

    if (customerPaneElement) {
      const customerPaneElementProps = {};
      this._customerPaneElement =
        (<div style={iconRightStyle}>
          {Object.keys(customerPaneElementProps).length > 0 ?
            cloneElement(customerPaneElement, customerPaneElementProps) :
            customerPaneElement}
        </div>);
    }
    let picture = null;
    if (this.props.context.applicationContext &&
      this.props.context.applicationContext.login &&
      this.props.context.applicationContext.login.customerInformation &&
      this.props.context.applicationContext.login.customerInformation.picture) {
      picture = 'data:image/png;base64,' + this.props.context.applicationContext.login.customerInformation.picture;
    }

    if (context.deviceSize >= BComponent.Sizes.MEDIUM) {
      this._userElement =
        (<div style={iconUserStyle} onClick={this.openUserProfileMenu}>
          <BAvatar
            context={this.props.context}
            icon={<User context={this.props.context} style={{ width: '36px', height: '36px', margin: '0px' }} />}
            src={picture}
            style={{ margin: '6px', width: '36px', height: '36px'}}
            size={36} />
        </div>);

      this._favoriteElement =
        (<div style={iconRightStyle}>
          <BButton context={context}
            type='icon'
            dynamicIcon='Apps'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white' }}
            onClick={this.openFavoriteMenu} />
        </div>);

      this._settingsElement =
        (<div style={iconRightStyle}>
          <BButton context={context}
            type='icon'
            dynamicIcon='Settings'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white' }}
            onClick={this.openSettingsMenu} />
        </div>);
    }
    else {
      this._userElement = <ListItem
        primaryText={this.props.context.applicationContext.user.name}
        leftIcon={
          <BAvatar
            context={this.props.context}
            icon={<User context={this.props.context} style={{ width: '32px', height: '32px', margin: '0px' }} />}
            src={picture}
            style={{ margin: '6px', width: '32px', height: '32px' }}
            size={36} />
        } />;

      let favorite = <BButton context={context}
            type='icon'
            dynamicIcon='Apps'
            iconProperties={{ color: 'grey' }}
            style={{ margin: '10px 12px', padding: '0px', color: 'grey' }}
      />;

      this._favoriteElement =
        <BMenuItem primaryText="Favorites"
          leftIcon={favorite}
          itemSelected={this.openFavoriteMenu}
          context={this.props.context}
          rightIcon={<BButton context={context}
            type='icon'
            iconProperties={{ color: 'grey' }}
            style={{ margin: '10px 12px', padding: '0px'  }}
            dynamicIcon='KeyboardArrowRight' />}
        />;

      let settings = <BButton context={context}
          type='icon'
          dynamicIcon='Settings'
          iconProperties={{ color: 'grey' }}
          style={{ margin: '10px 12px', padding: '0px', color: 'grey' }}/>;
      this._settingsElement =
        <BMenuItem primaryText="Settings"
          leftIcon={settings}
          itemSelected={this.openSettingsMenu}
          context={this.props.context}
          rightIcon={<BButton context={context}
            type='icon'
            iconProperties={{ color: 'grey' }}
            style={{ margin: '10px 12px', padding: '0px'  }}
            dynamicIcon='KeyboardArrowRight'/>}
        />;
    }
    if (context.deviceSize > BComponent.Sizes.MEDIUM) {
      if (fullscreenElement) {
        const fullscreenElementProps = {};

        if (fullscreenElement.props.onFullscreenClick) {
          fullscreenElementProps.onFullscreenClick = fullscreenElement.props.onFullscreenClick;
        }
        this._fullscreenElement =
          (<div style={iconRightStyle}>
            {Object.keys(fullscreenElementProps).length > 0 ?
              cloneElement(fullscreenElement, fullscreenElementProps) :
              fullscreenElement}
          </div>);
      }
    }
    else {
      this._fullscreenElement = <div></div>;
    }

    let searchBarVisible = (this.state.openSearchForMobile ? 'hidden' : 'visible');
    if (context.deviceSize >= BComponent.Sizes.MEDIUM) {
      this.appBarContent = this.renderDesktopBar(searchBarVisible);
    }
    else {
      this.appBarContent = this.renderMobileBar(searchBarVisible);
    }

    return (
      <Paper
        {...other}
        rounded={false}
        style={Object.assign({}, styles.root)}
        zDepth={zDepth}>
        {this.appBarContent}
        {children}
      </Paper>
    );
  }

  renderMobileBar() {
    return (
      <div style={{ width: '100%', height: '50px', backgroundColor: this.props.context.theme.boaPalette.pri500 }}>
        {this._navigationMenuElement}
        {this._logo}
        {this._customerPaneElement}
        <div style={{ padding: '11px 0px', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}>
          <BButton context={this.props.context}
            type='icon'
            dynamicIcon='MoreVert'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
            onClick={this.openPopover} />
          <BPopover style={this.state.popoverStyle} context={this.props.context} ref={(item) => { this.bPopover = item; }} >
            <List>
              <ListItem primaryText="Menu" rightIcon={<BButton context={this.props.context}
                                                        type='icon'
                                                        iconProperties={{ color: 'grey' }}
                                                        style={{ margin: '10px 12px', padding: '0px'  }}
                                                        dynamicIcon='NavigationClose'
                                                        onClick={this.openPopover} />} />
              <BDivider context={this.props.context} />
              {this._userElement}
              {
                <div>
                  <BUserProfile
                    ref={(item) => { this.userProfileMenu = item; }}
                    context={this.props.context}
                  />
                </div>
              }
              {this._favoriteElement}
              {
                <div>
                  <BFavoriteMenu
                    ref={(item) => { this.favoriteMenu = item; }}
                    context={this.props.context}
                    favoriteMenuItemClick={this.favoriteMenuItemClick}
                    dataSource={this.props.resourceList}
                  />
                </div>
              }
              {this._settingsElement}
              <BDivider context={this.props.context} />
              <div style={this.props.context.theme.changeUser}>CHANGE USER</div>
              <div style={this.props.context.theme.logOut}>LOG OUT</div>
            </List>
          </BPopover>
        </div>
        <div style={{ padding: '11px 0px', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}>
          <BButton context={this.props.context}
            type='icon'
            dynamicIcon='Search'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
            onClick={this.onActionSearchClick} />
        </div>
        <BInputSearch
          ref={(item) => { this.inputSearch = item; }}
          context={this.props.context}
          fullWidth={true}
          dataSource={this.props.resourceList}
          hintText={this.props.searchBarHintText}
          style={{ visibility: this._searchBarVisible }}
          onItemClick={this.props.onItemClick} />
      </div>
    );
  }

  renderDesktopBar(searchBarVisible) {
    return (
      <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', height: '50px', width: '100%' }}>
        <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '205px' }}>
          {this._navigationMenuElement}
          {this.props.logo}
        </div>
        <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: 'calc(100% - 440px)' }}>
          <BInputSearch
            ref={(item) => { this.inputSearch = item; }}
            context={this.props.context}
            fullWidth={true}
            dataSource={this.props.resourceList}
            hintText={this.props.searchBarHintText}
            style={{ visibility: searchBarVisible }}
            onItemClick={this.props.onItemClick} />
        </div>
        <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '235px' }}>
          {this._userElement}
          {
            <div>
              <BUserProfile
                ref={(item) => { this.userProfileMenu = item; }}
                context={this.props.context} />
            </div>
          }
          {this._settingsElement}
          {this._favoriteElement}
          {this._fullscreenElement}
          {
            <div>
              <BFavoriteMenu
                ref={(item) => { this.favoriteMenu = item; }}
                context={this.props.context}
                favoriteMenuItemClick={this.favoriteMenuItemClick}
                dataSource={this.props.resourceList}
              />
            </div>
          }
        </div>
      </div>
    );
  }

}

export default BAppBarInner;
