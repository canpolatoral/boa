import React from 'react'; import PropTypes from 'prop-types';
import BAppHeaderInner from './appbar';

import { BComponent } from 'b-component';
import { BThemeProvider } from 'b-component';
import { BTabBarDynamic } from 'b-tab-bar-dynamic';
import { BProgress } from 'b-progress';
var KTLogo = require('b-icon').Logos.KTLogo;

export class BAppHeader extends BComponent {
  static propTypes = {
    leftIconElement: PropTypes.element,
    rightIconElement: PropTypes.element,
    leftIconClick: PropTypes.func,
    rightIconClick: PropTypes.func,
    logoElement: PropTypes.element,
    title: PropTypes.node,
    titleStyle: PropTypes.object,
    onTitleTouchTap: PropTypes.func,
    showMenuIconButton: PropTypes.bool,
    footerElement: PropTypes.element,

    userLoginClick: PropTypes.func,
    userRegisterClick: PropTypes.func,
    userMenuList: PropTypes.arrayOf(PropTypes.string),
    userMenuClick: PropTypes.func,
    userAvatarElement: PropTypes.element,
    showUserElement: PropTypes.bool,
    showUserAvatar: PropTypes.bool,

    zDepth: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
    appBarStyle: PropTypes.object,
    tabBarStyle: PropTypes.object,
    pageStyle: PropTypes.object,

    tabItems: PropTypes.array,
    initialSelectedIndex: PropTypes.number,
    onTabItemChanged: PropTypes.func,
    onNewTabOpened: PropTypes.func,
    tabValue: PropTypes.any,

    hasLeftDrawer: PropTypes.bool,
    hasRightDrawer: PropTypes.bool,
    leftDrawerContent: PropTypes.any,
    rightDrawerContent: PropTypes.any,
    leftDrawerWidth: PropTypes.number,
    rightDrawerWidth: PropTypes.number,

    showSearchBar: PropTypes.bool,
    searchDataSource: PropTypes.array,
    searchBarHintText: PropTypes.string,

    onMenuDataAcquired: PropTypes.func,
    resourceList: PropTypes.any,

    progressColor: PropTypes.string
  };

  static defaultProps = {
    leftDrawerWidth: 270,
    rightDrawerWidth: 300,
    hasLeftDrawer: true,
    hasRightDrawer: true,
    zDepth: 0,
    appBarStyle: { height: 45 },
    tabBarStyle: { top: 45 },
    pageStyle: { top: 95 }
  };

  constructor(props, context) {
    super(props, context);
    this.organizeState = this.organizeState.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onTabItemChanged = this.onTabItemChanged.bind(this);
    this.organizeState(props);
    this.uniqueIncrement = 0;
    this.formStyle = { /* position: 'fixed', left: 0, right: 0, top: 120, bottom: 0, overflow: 'auto'*/ };
    this.isProgressVisible = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.context.deviceSize != this.props.context.deviceSize) {
      this.updateChildStyle();
    }
    
    // if (nextProps.children != this.props.children) {
    //   this.childContainer && this.childContainer.changePage(nextProps.children);
    // }
    this.updateTabs(nextProps.tabItems, nextProps.tabValue);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.context !== this.props.context || nextProps.children !== this.props.children || nextProps.context.deviceSize !== this.props.context.deviceSize;
  }

  updateChildStyle() {
    if (this.leftDocked && this.openleft) {
      this.formStyle.left = this.leftDrawerWidth + 'px';
    }
    else {
      this.formStyle.left = '0px';
    }
    if (this.rightDocked && this.openright) {
      this.formStyle.right = this.rightDrawerWidth + 'px';
    }
    else {
      this.formStyle.right = '0px';
    }
    // this.childContainer.changeStyle(this.formStyle);
  }

  organizeState(newProps) {
    this.initialSelectedIndex = newProps.initialSelectedIndex;
    this.tabValue = newProps.tabValue;
    this.tabItems = newProps.tabItems;
    this.searchDataSource = null;
  }

  updateTabs(tabItems, value) {
    this.tabItems = tabItems;
    this.tabValue = value;
    this.tabsRoot.updateBTabBarDynamic(tabItems, value);
  }

  showProgress() {
    this.isProgressVisible = true;
  }

  hideProgress() {
    this.isProgressVisible = false;
  }

  render() {
    this.debugLog('BAppBar Render Invoke');

    const {
      context,
      logoElement,
      searchBarHintText,
      showSearchBar,
      title,
      appBarStyle,
      tabBarStyle,
      footerElement
    } = this.props;
    const { centeredLayout } = context.theme;
    const isRightToLeft = context.localization ? !!context.localization.isRightToLeft : false;

    let tabs = (
      <BTabBarDynamic
        ref={(item) => { this.tabsRoot = item; }}
        context={context}
        initialSelectedIndex={this.initialSelectedIndex}
        tabItems={this.tabItems}
        tabItemContainerStyle={{ backgroundColor: context.theme.appBar.color }}
        onTabItemChanged={this.onTabItemChanged}
        tabValue={this.tabValue}
        closeIconEnabled={false}
        contentEnabled={false}
        centerTabs={false} />);

    const tabStyle = Object.assign({
      width: '100%',
      height: 50,
      backgroundColor: this.props.context.theme.boaPalette.pri500,
      position: 'fixed',
      top: 70,
      boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
      zIndex: 1000
    }, tabBarStyle);

    var tabContent = null;
    const isMobile = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobile) {
      tabContent = this.renderMobileTab(tabs, tabStyle, isRightToLeft);
    }
    else if (context.deviceSize == BComponent.Sizes.MEDIUM) {
      tabContent = this.renderTabletTab(tabs, tabStyle, isRightToLeft);
    }
    else {
      tabContent = this.renderDesktopTab(tabs, tabStyle, isRightToLeft);
    }
    const pageStyle = Object.assign({}, this.formStyle, this.props.pageStyle);
    const titleStyle = Object.assign({ color: this.props.context.theme.boaPalette.sec500 }, this.props.titleStyle);
    const logoStyle = {
      float: !isRightToLeft ? 'left' : 'right',
      paddingLeft: !isRightToLeft ? 0 : 0,
      paddingRight: !isRightToLeft ? 0 : 12,
      marginTop: 'auto',
      marginBottom: 'auto',
      flex: 0
    };
    let logo = (
      <div style={logoStyle} onClick={this.onTitleTouchTap.bind(this)}>
        {logoElement || <KTLogo context={context} style={{ width: 'auto', height: 30, fill: 'white' }} />}
      </div>);
    let footer = footerElement ? (
      <div id="container_footer" style={{ backgroundColor: '#F0F0F0', marginTop: isMobile ? 0 : 40 }}>
        {
          centeredLayout ?
            (<div style={{ maxWidth: 1400, margin: 'auto' }}>{footerElement}</div>) :
            footerElement
        }
      </div>
    ) : null;

    return (
      <div>
        <header>
          <BThemeProvider theme={context.theme}>
            <div>
              <BAppHeaderInner
                ref={(item) => { this.appBarInner = item; }}
                context={context}
                onTitleTouchTap={this.onTitleTouchTap.bind(this)}
                title={title}
                titleStyle={titleStyle}
                searchBarHintText={searchBarHintText}
                showSearchBar={showSearchBar}
                zDepth={0}
                onItemClick={this.onItemClick}
                userLoginClick={this.props.userLoginClick}
                userRegisterClick={this.props.userRegisterClick}
                userMenuClick={this.props.userMenuClick}
                userMenuList={this.props.userMenuList}
                logo={logo}
                style={appBarStyle}>
              </BAppHeaderInner>
              {tabContent}
              {this.isProgressVisible && <BProgress context={context} color={this.props.progressColor} progressType='linear' style={{ top: 96 }} />}
            </div>
          </BThemeProvider>
        </header>
        <div id="container_root" style={pageStyle}>
          {this.props.children}
          {footer}
        </div>
      </div>
    );
    /*
      <BPageHost
          ref={(item) => { this.childContainer = item; }}
          context={context}
          content={this.props.children}
          leftDrawerWidth={this.leftDrawerWidth}
          rightDrawerWidth={this.rightDrawerWidth}
          style={pageStyle} />
          {footer}*/
  }

  onTitleTouchTap(e) {
    this.props.onTitleTouchTap && this.props.onTitleTouchTap(e);
  }

  onItemClick(menuItem) {
    this.openNewTabPage(menuItem);
  }

  onTabItemChanged(menuItemProps, index, tab) {
    var selectedTab =
      this.tabItems.filter(
        (tabItem) => {
          return tabItem.value == menuItemProps;
        }
      );

    this.props.onTabItemChanged && this.props.onTabItemChanged(menuItemProps, selectedTab[0].pageId, tab);
  }

  getPageId() {
    this.uniqueIncrement = this.uniqueIncrement + 1;
    return this.uniqueIncrement;
  }

  renderMobileTab(tabs, style) {
    return (
      <div style={style}>
        <div name={'AppHeaderDynamicTabDiv'} style={{ display: 'block', overflowX: 'auto' }}>
          {tabs}
        </div>
        <style>
          {`div[name=AppHeaderDynamicTabDiv]::-webkit-scrollbar {
            display: none;
          }`}
        </style>
      </div>
    );
  }

  renderTabletTab(tabs, style, isRightToLeft) {
    return (
      <div style={style}>
        <div name={'AppHeaderDynamicTabDiv'} style={{ float: !isRightToLeft ? 'left' : 'right', width: 'calc(100% - 0px)', overflowX: 'auto' }}>
          {tabs}
        </div>
        <style>
          {`div[name=AppHeaderDynamicTabDiv]::-webkit-scrollbar {
            display: none;
          }`}
        </style>
      </div>
    );
  }

  renderDesktopTab(tabs, style) {
    const { context } = this.props;
    const { centeredLayout } = context.theme;
    return (
      <div style={style}>
        <div style={{ width: 'calc(100% - 0px)', margin: 'auto', maxWidth: (centeredLayout ? 1400 : null) }}>
          {tabs}
        </div>
      </div>
    );
  }
}

export default BAppHeader;
