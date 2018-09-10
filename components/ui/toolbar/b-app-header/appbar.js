import React from 'react'; import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import Paper from '@material-ui/core/Paper';

import { BComponent } from 'b-component';
import { BInputSearch } from 'b-input-search';
import { BButton } from 'b-button';
import { BIconMenu } from 'b-icon-menu';
import { BMenuItem } from 'b-menu-item';

class BAppHeaderInner extends BComponent {
  static muiName = 'AppBar';
  static propTypes = {
    children: PropTypes.node,
    logo: PropTypes.any,
    onTitleTouchTap: PropTypes.func,
    title: PropTypes.node,
    titleStyle: PropTypes.object,
    zDepth: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
    searchBarHintText: PropTypes.string,
    showSearchBar: PropTypes.bool,
    onItemClick: PropTypes.any,
    userLoginClick: PropTypes.any,
    userRegisterClick: PropTypes.any,
    userMenuClick: PropTypes.any,
    userMenuList: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object
  };
  static defaultProps = {
    title: '',
    zDepth: 1
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleTitleTouchTap = this.handleTitleTouchTap.bind(this);
    this.openUserProfileMenu = this.openUserProfileMenu.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.onActionSearchClick = this.onActionSearchClick.bind(this);
    this.state = {
      popoverStyle: { position: 'absolute', maxWidth: '100%', width: 'calc(100% - 16px)', margin: '8px', zIndex: 10000 }
    };
    this.appBarContent = null;
    this._userElement = null;
  }

  getStyles(props, context) {
    let {
      appBar,
      button: {
        iconButtonSize,
      },
      zIndex,
    } = context.muiTheme;
    appBar = Object.assign(appBar, props.style);
    const { centeredLayout } = props.context.theme;

    const flatButtonSize = 36;
    const styles = {
      root: {
        position: 'fixed',
        zIndex: zIndex.appBar,
        width: '100%',
        display: 'flex',
        backgroundColor: appBar.color,
        paddingLeft: centeredLayout ? 0 : appBar.padding,
        paddingRight: centeredLayout ? 0 : appBar.padding,
        top: 0,
        height: appBar.height || '70px'
      },
      title: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: 0,
        paddingTop: 0,
        letterSpacing: 0,
        fontSize: 24,
        fontWeight: appBar.titleFontWeight,
        color: appBar.textColor,
        height: appBar.height,
        lineHeight: `${appBar.height}px`,
        flex: 1
      },
      mainElement: {
        boxFlex: 1,
        flex: '1',
      },
      iconButtonStyle: {
        marginTop: (appBar.height - iconButtonSize) / 2,
        marginRight: 8,
        marginLeft: -16,
      },
      iconButtonIconStyle: {
        fill: appBar.textColor,
        color: appBar.textColor,
      },
      flatButton: {
        color: appBar.textColor,
        marginTop: (iconButtonSize - flatButtonSize) / 2 + 1,
      },
    };
    return styles;
  }

  updateSearchDataSource(searchDataSource) {
    this.inputSearch.getInstance().updateSearchDataSource(searchDataSource, true);
  }

  updateOnlySearchDataSource(searchDataSource) {
    this.inputSearch.getInstance().updateSearchDataSource(searchDataSource, false);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.context !== this.props.context;
  }

  openUserProfileMenu() {
    this.userProfileMenu.openUserProfileMenu();
  }

  handleTitleTouchTap(event) {
    this.props.onTitleTouchTap && this.props.onTitleTouchTap(event);
  }

  openPopover() {
    this.bPopover.openPopover();
  }

  onActionSearchClick() {
    this.inputSearch.getInstance().openSearchBar();
  }

  onLoginClick(e) {
    this.props.userLoginClick && this.props.userLoginClick(e);
  }

  onRegisterClick(e) {
    this.props.userRegisterClick && this.props.userRegisterClick(e);
  }

  onUserMenuClick(e) {
    this.props.userMenuClick && this.props.userMenuClick(e);
  }

  render() {
    const {
      fullscreenElement, // eslint-disable-line no-unused-vars
      zDepth,
      children,
      title,
      titleStyle,
      resourceList, // eslint-disable-line no-unused-vars
      leftDocked, // eslint-disable-line no-unused-vars
      rightDocked, // eslint-disable-line no-unused-vars
      logo, // eslint-disable-line no-unused-vars
      context,
      onItemClick, // eslint-disable-line no-unused-vars
      searchBarHintText, // eslint-disable-line no-unused-vars
      showSearchBar,
      onTitleTouchTap, // eslint-disable-line no-unused-vars
      onNavigationMenuClick, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props;

    const { prepareStyles } = this.context.muiTheme;
    const styles = this.getStyles(this.props, this.context);

    let user = null;
    if (this.props.context.applicationContext && this.props.context.applicationContext.user) {
      user = this.props.context.applicationContext.user;
    }
    // let user = {
    //   userName: 'mesutg',
    //   userId: '26f94687-707c-4046-93d3-2be9b00f0937',
    //   firstName: 'Mesut',
    //   lastName: 'Gümüş',
    //   isActive: 1,
    //   languageId: 1,
    //   email: 'mesut_gumus@kuveytturk.com.tr'
    // };

    if (context.deviceSize >= BComponent.Sizes.MEDIUM) {
      // this._userElement = showUserAvatar ?
      //   (<div style={prepareStyles(iconUserStyle)} onClick={this.openUserProfileMenu}>
      //     <BAvatar
      //       context={this.props.context}
      //       icon={<User context={this.props.context} style={{ width: '32px', height: '32px', margin: '0px' }} />}
      //       src={picture}
      //       style={{ margin: '6px', width: '32px', height: '32px' }}
      //       size={36} />
      //   </div>) : null;
    }
    else {
      // this._userElement = showUserAvatar ?
      //   (<ListItem
      //     primaryText={this.props.context.applicationContext.user.name}
      //     leftIcon={
      //       <BAvatar
      //         context={this.props.context}
      //         icon={<User context={this.props.context} style={{ width: '32px', height: '32px', margin: '0px' }} />}
      //         src={picture}
      //         style={{ margin: '6px', width: '32px', height: '32px' }}
      //         size={36} />
      //     } />) : null;
    }

    const isMobile = context.deviceSize < BComponent.Sizes.MEDIUM;

    const titleComponent = typeof title === 'string' || title instanceof String ? 'h1' : 'div';
    const titleElement = React.createElement(titleComponent, {
      onTouchTap: this.handleTitleTouchTap,
      style: Object.assign(prepareStyles(Object.assign(styles.title, styles.mainElement, titleStyle)), { cursor: 'pointer' }),
    }, title);
    const logoStyle = { cursor: 'pointer' };
    if (isMobile) {
      logoStyle.padding = 0;
    }
    const logoElement = React.cloneElement(logo, merge(logo.props, {
      style: logoStyle
    }));

    let searchBarVisible = showSearchBar ? (this.state.openSearchForMobile ? 'hidden' : 'visible') : 'hidden';

    if (isMobile) {
      this.appBarContent = this.renderMobileBar(searchBarVisible, logoElement, titleElement, user);
    }
    else {
      this.appBarContent = this.renderDesktopBar(searchBarVisible, logoElement, titleElement, user);
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

  renderMobileBar(searchBarVisible, logo, title, user) {
    const { context } = this.props;
    let menuItemList =
      user ?
        (
          (this.props.userMenuList || []).map((menu, index) => {
            return (<BMenuItem
              context={context}
              key={index}
              primaryText={menu}
              itemSelected={this.onUserMenuClick.bind(this, index)} />);
          })
        ) :
      [
          (<BMenuItem
            context={context}
            key={1}
            primaryText={'Login'}
            itemSelected={this.onLoginClick.bind(this)} />),
          (<BMenuItem
            context={context}
            key={2}
            primaryText={'Register'}
            itemSelected={this.onRegisterClick.bind(this)} />)
      ];
    user && menuItemList.unshift(<BMenuItem
      context={context}
      key={-1}
      disabled={true}
      primaryText={user.email} />);
    return (
      <div style={{ width: '100%', display: 'flex', paddingLeft: 24 }}>
        {logo}
        {title}
        {user ?
          (
            <div style={{ margin: 'auto', color: 'white' }}>
              <BIconMenu
                context={context}
                iconType={'vertical'}
                iconStyle={{ color: 'white' }}
                style={{ width: 40 }}
                // anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                // targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                menuItems={menuItemList}
                style={{ float: !context.localization.isRightToLeft ? 'right' : 'left', marginTop: -4 }}>
              </BIconMenu>
            </div>
          ) : (
            <BIconMenu
              context={context}
              iconType={'vertical'}
              iconStyle={{ color: 'white' }}
              style={{ width: 40 }}
              // anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              // targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              menuItems={menuItemList}
              style={{ float: !context.localization.isRightToLeft ? 'right' : 'left', marginTop: -4 }}>
            </BIconMenu>
          )}
        {searchBarVisible == 'visible' ?
          <BButton context={context}
            type='icon'
            dynamicIcon='ActionSearch'
            iconProperties={{ color: '#ffffff' }}
            style={{ width: 40, color: 'white', float: !this.isRightToLeft ? 'right' : 'left' }}
            onClick={this.onActionSearchClick} /> : null}
        <BInputSearch
          ref={(item) => { this.inputSearch = item; }}
          context={context}
          fullWidth={true}
          dataSource={this.props.resourceList}
          hintText={this.props.searchBarHintText}
          style={{ visibility: searchBarVisible }}
          onItemClick={this.props.onItemClick} />
      </div>
    );
  }

  renderDesktopBar(searchBarVisible, logo, title, user) {
    const { context } = this.props;
    const { centeredLayout } = context.theme;

    let menuItemList =
      user ?
        (
          (this.props.userMenuList || []).map((menu, index) => {
            return (<BMenuItem
              context={context}
              key={index}
              primaryText={menu}
              itemSelected={this.onUserMenuClick.bind(this, index)} />);
          })
        ) : [];

    return (
      <div style={{ width: '100%', height: '100%', margin: 'auto', maxWidth: (centeredLayout ? 1400 : null), paddingLeft: centeredLayout ? 24 : 0, paddingRight: centeredLayout ? 24 : 0 }}>
        <div style={{ float: !this.isRightToLeft ? 'left' : 'right', width: 275, height: '100%', display: 'flex', alignItems: 'center' }}>
          {logo}
          {title}
        </div>
        <div style={{ float: !this.isRightToLeft ? 'left' : 'right', width: 'calc(100% - 550px)', height: '100%', position: 'relative' }}>
          <BInputSearch
            ref={(item) => { this.inputSearch = item; }}
            context={context}
            fullWidth={true}
            dataSource={this.props.resourceList}
            hintText={this.props.searchBarHintText}
            style={{ visibility: searchBarVisible, margin: 'auto', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            onItemClick={this.props.onItemClick} />
        </div>
        <div style={{ float: !this.isRightToLeft ? 'left' : 'right', width: 275, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* {this._userElement} */}
          {user ?
            (
              <div style={{ color: 'white', display: 'flex', alignSelf: 'flex-end' }}>
                <div style={{ margin: 'auto' }}>{user.email}</div>
                <BIconMenu
                  context={context}
                  iconType={'vertical'}
                  iconStyle={{ color: 'white' }}
                  style={{ width: 40 }}
                  // anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  // targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  menuItems={menuItemList}
                  style={{ float: !context.localization.isRightToLeft ? 'right' : 'left', marginTop: -4 }}>
                </BIconMenu>
              </div>
            ) : (
              <div style={{ alignSelf: 'flex-end' }}>
                <BButton
                  context={context}
                  onClick={this.onLoginClick.bind(this)}
                  text={'Login'}
                  type={'flat'}
                  style={{ color: 'white' }} />
                <BButton
                  context={context}
                  onClick={this.onRegisterClick.bind(this)}
                  text={'Register'}
                  type={'flat'}
                  style={{ color: 'white' }} />
              </div>
            )}
          {/* {
            <div>
              <BUserProfile
                ref={(item) => { this.userProfileMenu = item; }}
                context={context} />
            </div>
          }*/}
        </div>
      </div>
    );
  }

}

export default BAppHeaderInner;
