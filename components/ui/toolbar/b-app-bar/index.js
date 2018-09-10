import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
// import BAppBarInner from './appbar';
import { BLocalization } from 'b-localization';
import ViewCarousel from '@material-ui/icons/ViewCarousel';
import Menu from '@material-ui/icons/Menu';
import Fullscreen from '@material-ui/icons/Fullscreen';
import cloneDeep from 'lodash/cloneDeep';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent, BComponentComposer } from 'b-component';
import { BDrawer } from 'b-drawer';
import { BIconButton } from 'b-icon-button';
import { BTabBar } from 'b-tab-bar';
import { BMainMenu } from 'b-main-menu';
import { BMenuHelper } from 'b-main-menu';
import { BPageHost } from 'b-page-host';
import { BFormManager } from 'b-form-manager';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { BInputSearch } from 'b-input-search';
import { BFavoriteMenu } from 'b-favorite-menu';
import { BUserProfile } from 'b-user-profile';
import { BAvatar } from 'b-avatar';
import { BButton } from 'b-button';
import { BMenuItem } from 'b-menu-item';
import List from '@material-ui/core/List';
import { BPopover } from 'b-popover';
import { BDivider } from 'b-divider';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { BSettings } from 'b-settings';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import { BListItem } from 'b-list-item';

var DoubleChevronRight = require('b-icon').Actions.DoubleChevronRight;
var DoubleChevronLeft = require('b-icon').Actions.DoubleChevronLeft;
var BOALogo = require('b-icon').Logos.BOALogo;
var User = require('b-icon').Others.User;

const styles = {
  root: {
    width: '100%',
    maxWidth: '100%',
    right: 12,
  },
  iconRoot: { fontSize: '20px' }
};

@BComponentComposer
@withStyles(styles)
export class BAppBar extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    navigationMenuElement: PropTypes.element,
    settingsElement: PropTypes.element,
    favoriteElement: PropTypes.element,
    onNavigationMenuClick: PropTypes.func,
    onCustomerPaneClick: PropTypes.func,
    onTitleTouchTap: PropTypes.func,
    showMenuIconButton: PropTypes.bool,
    title: PropTypes.node,
    zDepth: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
    tabItems: PropTypes.array,
    initialSelectedIndex: PropTypes.number,
    leftContent: PropTypes.any,
    rightContent: PropTypes.any,
    searchDataSource: PropTypes.array,
    leftDrawerWidth: PropTypes.number,
    rightDrawerWidth: PropTypes.number,
    profilePicture: PropTypes.string,
    searchBarHintText: PropTypes.string,
    onTabItemChanged: PropTypes.func,
    onNewTabOpened: PropTypes.func,
    onMenuDataAcquired: PropTypes.func,
    onRightIconClick: PropTypes.func,
    tabValue: PropTypes.any,
    resourceList: PropTypes.any,
    searchBarVisible: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    isChangeUserVisible: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    leftDrawerWidth: 270,
    rightDrawerWidth: 300,
    zDepth: 0,
    searchBarVisible: true,
    isChangeUserVisible: false
  };

  state = {
    userArrowDisplay: 'none',
    favoritesArrowDisplay: 'none',
  };

  constructor(props, context) {
    super(props, context);
    this.onLeftDrawerClick = this.onLeftDrawerClick.bind(this);
    this.onRightDrawerClick = this.onRightDrawerClick.bind(this);
    this.onNavigationMenuClick = this.onNavigationMenuClick.bind(this);
    this.onCustomerPaneClick = this.onCustomerPaneClick.bind(this);
    this.organizeState = this.organizeState.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onFullscreenClick = this.onFullscreenClick.bind(this);
    this.onTabItemChanged = this.onTabItemChanged.bind(this);
    this.onRightIconClick = this.onRightIconClick.bind(this);
    if (this.props.context.localization.isRightToLeft) {
      this.leftDrawerWidth = this.props.rightDrawerWidth;
      this.rightDrawerWidth = this.props.leftDrawerWidth;
    }
    else {
      this.leftDrawerWidth = this.props.leftDrawerWidth;
      this.rightDrawerWidth = this.props.rightDrawerWidth;
    }
    this.organizeState(props);
    this.leftContent = null;
    this.uniqueIncrement = 0;
    this.fullscreen = false;
    this.formStyle = { position: 'fixed', left: 0, right: 0, top: this._getFormTop(this.props.context.deviceSize), bottom: 0 };
    this.resourceList = BMenuHelper.convertResourceMenu(this.props.resourceList);
    this.setFormStyle();
    this.isUnauthorizedResourceListLoaded = false;
    this.isUnauthorizedResourceListLoading = false;
    this.closedTab = null;
    BFormManager.setRequestInfo(this.props.context.applicationContext.channel.channelId);

    
    // this._customerPaneElement = {};
    // this._navigationMenuElement = {};
    // this._userElement = {};
    // this._favoriteElement = {};
    // this._settingsElement = {};
    // this._fullscreenElement = {};
  }

  _getFormTop(deviceSize) {
    return (deviceSize >= BComponent.Sizes.MEDIUM) ? 112 : 104;
  }

  changeUser() {
    BDialogHelper.show(this.props.context, 'Bu özellik şu anda kullanılmamaktadır', BComponent.DialogType.INFO);
  }

  logOut() {
    BDialogHelper.show(this.props.context, 'Bu özellik şu anda kullanılmamaktadır', BComponent.DialogType.INFO);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.context.localization.isRightToLeft != this.props.context.localization.isRightToLeft) {
      if (this.props.context.localization.isRightToLeft) {
        this.leftDrawerWidth = this.props.rightDrawerWidth;
        this.rightDrawerWidth = this.props.leftDrawerWidth;
      }
      else {
        this.leftDrawerWidth = this.props.leftDrawerWidth;
        this.rightDrawerWidth = this.props.rightDrawerWidth;
      }
    }
    var willBeRender = false;
    if (nextProps.context.language != this.props.context.language) {
      this.isUnauthorizedResourceListLoaded = false;
      this.isUnauthorizedResourceListLoading = false;
      this.resourceList = [];
      this.resetSearchValue();
    }
    if (nextProps.context.deviceSize != this.props.context.deviceSize) {
      if (nextProps.context.deviceSize <= BComponent.Sizes.SMALL) { // mobil görünümü
        this.updateRightDocked(false, false);
        this.updateLeftDocked(false, false);
        this.updateRightOpen(false, false);
        this.updateLeftOpen(false, false);
        willBeRender = true;
      } else if (nextProps.context.deviceSize <= BComponent.Sizes.MEDIUM) { // tablet görünümü
        if (!this.props.context.localization.isRightToLeft) {
          this.updateRightDocked(true, false);
          this.updateLeftDocked(false, false);
          this.updateLeftOpen(false, false);
        }
        else {
          this.updateRightDocked(false, false);
          this.updateLeftDocked(true, false);
          this.updateRightOpen(false, false);
        }
        willBeRender = true;
      }
      else {
        this.updateRightDocked(true, false);
        this.updateLeftDocked(true, false);
        willBeRender = true;
      }
    }
    if (nextProps.children != this.props.children) {
      this.childContainer.getInstance().changePage(nextProps.children);
    }
    
    if (willBeRender) {
      this.formStyle.top = this._getFormTop(nextProps.context.deviceSize);
      this.updateChildStyle();
    } 
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.context !== this.props.context || this.state !== nextState || this.props !== nextProps);
  }

  componentDidMount() {
    if (!this.isUnauthorizedResourceListLoaded && !this.isUnauthorizedResourceListLoading) {
     
      this.loadUnauthorizedResourceList();
    }
  }

  setFormStyle() {
    if (this.props.context.deviceSize <= BComponent.Sizes.SMALL) { // mobil görünümü
      this.formStyle.left = '0px';
      this.formStyle.right = '0px';
      this.leftDocked = false;
      this.rightDocked = false;
      this.openleft = false;
      this.openright = false;
    } else if (this.props.context.deviceSize <= BComponent.Sizes.MEDIUM) { // tablet görünümü
      if (!this.props.context.localization.isRightToLeft) {
        this.formStyle.left = '0px';
        this.formStyle.right = this.rightDrawerWidth + 'px';
        this.leftDocked = false;
        this.openleft = false;
      }
      else {
        this.formStyle.left = this.leftDrawerWidth + 'px';
        this.formStyle.right = '0px';
        this.rightDocked = false;
        this.openright = false;
      }
    }
    else {
      this.formStyle.left = this.leftDrawerWidth + 'px';
      this.formStyle.right = this.rightDrawerWidth + 'px';
    }
  }

  updateLeftDocked(value, isRender) {
    this.leftDocked = value;
    this.leftDrawer.getInstance().dockDrawer(value);
    isRender && this.updateChildStyle();
  }

  updateLeftOpen(value, isRender) {
    this.openleft = value;
    this.leftDrawer.getInstance().openDrawer(value);
    isRender && this.updateChildStyle();
  }

  updateRightDocked(value, isRender) {
    this.rightDocked = value;
    this.rightDrawer.getInstance().dockDrawer(value);
    isRender && this.updateChildStyle();
  }

  updateRightOpen(value, isRender) {
    this.openright = value;
    this.rightDrawer.getInstance().openDrawer(value);
    isRender && this.updateChildStyle();
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
    this.childContainer.getInstance().changeStyle(this.formStyle);
  }

  organizeState(newProps) {
    this.leftDocked = true;
    this.rightDocked = true;
    this.openleft = true;
    this.openright = true;
    this.initialSelectedIndex = newProps.initialSelectedIndex;
    this.tabValue = newProps.tabValue;
    this.tabItems = newProps.tabItems;
    this.searchDataSource = null;
  }

  updateTabs() {
    // this.tabItems = tabItems;
    // this.tabValue = value;
    // this.tabsRoot.getInstance().updateBTabBarDynamic(tabItems, value);
  }

  onRightIconClick(value) {
    // this.props.onRightIconClick && this.props.onRightIconClick(value);
    this.props.onRightIconClick ? this.props.onRightIconClick(value) : window.dispatchEvent(new CustomEvent('pageclose', { bubbles: true, cancelable: true, detail: { value: value } }));
  }

  onCloseMobileTabClick(value) {
    this.closedTab = value;
    this.props.onRightIconClick ? this.props.onRightIconClick(value) : window.dispatchEvent(new CustomEvent('pageclose', { bubbles: true, cancelable: true, detail: { value: value } }));
  }

  handleTabItemChange(value) {
    if (!this.closedTab) {
      var selectedTab =
        this.props.tabItems.filter(
          (tabItem) => {
            return tabItem.value == value;
          }
        );

      this.props.onTabItemChanged && this.props.onTabItemChanged(selectedTab[0].pageValue, selectedTab[0].pageId);
    }
    BDialogHelper.close(this.props.context, BComponent.DialogResponse.NONE);
    this.closedTab = null;
  }

  render() {
    const { classes } = this.props;
    const { isRightToLeft } = this.props.context.localization;

    this.debugLog('BAppBar Render Invoke');
    let boaPalette = this.props.context.theme.boaPalette;
    let tabs;
    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      tabs = (
        <BTabBar
          ref={(item) => { this.tabsRoot = item; }}
          context={this.props.context}
          containerType={'appbar'}
          // initialSelectedIndex={this.initialSelectedIndex}
          tabItems={this.props.tabItems}
          value={this.props.tabValue}
          // closeIconEnabled={true}
          onChange={this.onTabItemChanged}
          onRightIconClick={this.onRightIconClick}
          isContentDisabled={true}
          centered={true}
          scrollable={true}
          scrollButtons="auto"
          rightIconButtonVisibility={true}
          style={{
            width: 'calc(100% - 50px)',
            float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
            // marginRight: this.props.context.deviceSize > BComponent.Sizes.SMALL ? 48: null
          }} />);
    } else {
      let tabContents = this.props.tabItems.map((item, i) => {
        var style = {};
        if (this.props.tabValue !== item.value) {
          style = { height: 0, overflow: 'hidden' };
        }
        style = Object.assign({}, this.props.tabTemplateStyle, style);
        return <div key={i} style={style}>{item.content}</div>;
      });
      let tValue = this.props.tabValue == undefined ? 0 : this.props.tabValue;
      let selectedTab = this.props.tabItems.find((tab) => { return tab.value == tValue; });
      if (selectedTab == undefined) {
        selectedTab = this.props.tabItems[0];
        tValue = 0;
      }
      let moreIcon = isRightToLeft ? <DoubleChevronLeft /> : <DoubleChevronRight />;
      let moreIconVisibilty = this.props.tabItems && this.props.tabItems.length > 1 ? 'visible' : 'hidden';

      let leftButton = isRightToLeft
        ? <BButton context={this.props.context}
            type="icon"
            style={{ verticalAlign: 'middle', visibility: moreIconVisibilty }}
            icon={moreIcon}
            iconProperties={{ nativeColor: boaPalette.comp500 }}
            onClick={this.showMobileTabMenu.bind(this)} />
        : <BButton context={this.props.context}
            type="icon"
            style={{ verticalAlign: 'middle', visibility: tValue == 0 ? 'hidden' : 'visible' }}
            dynamicIcon={'Close'}
            iconProperties={{ nativeColor: boaPalette.comp500, classes: { root: classes.iconRoot } }}
            onClick={this.onCloseMobileTabClick.bind(this, tValue)} />;
      let rightButton = isRightToLeft
        ? <BButton context={this.props.context}
            type="icon"
            style={{ verticalAlign: 'middle', visibility: tValue == 0 ? 'hidden' : 'visible' }}
            dynamicIcon={'Close'}
            iconProperties={{ nativeColor: boaPalette.comp500, classes: { root: classes.iconRoot } }}
            onClick={this.onCloseMobileTabClick.bind(this, tValue)} />
        : <BButton context={this.props.context}
            type="icon"
            style={{ verticalAlign: 'middle', visibility: moreIconVisibilty }}
            icon={moreIcon}
            iconProperties={{ nativeColor: boaPalette.comp500 }}
            onClick={this.showMobileTabMenu.bind(this)} />;

      tabs = (
        <div>
          <div style={{ width: '100%', float: 'left', height: '48px', position: 'absolute', backgroundColor: boaPalette.pri500 }}>
            <div style={{ float: 'left' }}>
              {leftButton}
            </div>
            <div style={{ float: 'right' }}>
              {rightButton}
            </div>
            <div style={{ width: 'calc(100% - 96px)', height: '48px', display: 'grid', verticalAlign: 'middle', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: '-webkit-box', webkitLineClamp: '2', webkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                {BLocalization.stringUpperCase(selectedTab.text)}
              </div>
            </div>
          </div>
          <div style={{ left: '0px', right: '0px', top: '104px', bottom: '0px', overflowY: 'scroll' }}>
            {tabContents}
          </div>
        </div>
      );
    }
    // let customerPaneElement = <BIconButton
    //   context={this.props.context}
    //   icon={<ViewCarousel />}
    //   iconStyle={{ color: '#ffffff' }}
    //   style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
    //   onClick={this.onRightDrawerClick} />;

    let drawerStyle = { top: 112, bottom: 0, height: 'auto', overflow: null };
    let leftDrawerStyle = Object.assign({}, drawerStyle, { width: this.props.leftDrawerWidth });
    let rightDrawerStyle = Object.assign({}, drawerStyle, { width: this.props.rightDrawerWidth });
    if (this.props.context.deviceSize <= BComponent.Sizes.SMALL) {
      leftDrawerStyle = Object.assign({}, leftDrawerStyle, { top: 0, width: '85vw' });
    }
    // if (this.props.context.deviceSize <= BComponent.Sizes.SMALL) {
    //   tabContent = this.renderMobileTab(tabs);
    // }
    // else if (this.props.context.deviceSize == BComponent.Sizes.MEDIUM) {
    //   tabContent = this.renderTabletTab(tabs);
    // }
    // else {
    //   tabContent = this.renderDesktopTab(tabs);
    // }
    if (this.leftDocked && this.openleft) {
      this.formStyle.left = this.leftDrawerWidth;
    }
    if (this.rightDocked && this.openright) {
      this.formStyle.right = this.rightDrawerWidth;
    }

    if (!this.props.context.localization.isRightToLeft) {
      if (this.props.leftContent) {
        this.leftContent = this.props.leftContent;
      }
      else {
        this.leftContent = <BMainMenu
          ref={(r) => { this.mainMenu = r; }}
          key={'b-app-bar-main-menu'}
          context={this.props.context}
          dataSource={this.resourceList}
          width={this.leftDrawerWidth}
          serviceCallLoader="linear"
          onMenuItemSelected={this.onMenuItemSelected.bind(this)}
          onMenuDataAcquired={this.onMenuDataAcquired.bind(this)} />;
      }
      if (this.props.rightContent) {
        this.rightContent = this.props.rightContent;
      }
      else {
        this.rightContent = <div></div>;
      }
    }
    else {
      if (this.props.leftContent) {
        this.rightContent = this.props.leftContent;
      }
      else {
        this.rightContent = <BMainMenu
          ref={(r) => { this.mainMenu = r; }}
          key={'b-app-bar-main-menu'}
          context={this.props.context}
          dataSource={this.resourceList}
          width={this.rightDrawerWidth}
          serviceCallLoader="linear"
          onMenuItemSelected={this.onMenuItemSelected.bind(this)}
          onMenuDataAcquired={this.onMenuDataAcquired.bind(this)} />;
      }
      if (this.props.rightContent) {
        this.leftContent = this.props.rightContent;
      }
      else {
        this.leftContent = <div></div>;
      }
    }
    this._logo = <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', paddingLeft: !this.props.context.localization.isRightToLeft ? '12px' : '0px', paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px', paddingTop: '12px' }}>
      <BOALogo context={this.props.context} style={{ width: 'auto', height: 30, fill: 'white' }} />
    </div>;

    this._searchBarVisible = (this.props.searchBarVisible ? 'visible' : 'hidden');

    this.getToolbar(this.props.context);

    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      this.toolBarContent = this.renderDesktopToolBar();
    }
    else {
      this.toolBarContent = this.renderMobileToolBar();
    }

    var rightDrawerButton = null;
    if (this.props.context.deviceSize > BComponent.Sizes.SMALL) {
      rightDrawerButton = <BIconButton context={this.props.context}
        icon={<ViewCarousel />}
        iconStyle={{ color: '#ffffff' }}
        style={{
          color: 'white',
          float: !this.props.context.localization.isRightToLeft ? 'right' : 'left'
        }}
        onClick={this.onRightDrawerClick} />;
    }

    let toolbarStyle = { zIndex: 1, paddingLeft: '12px', paddingRight: '12px' };
    (this.props.context.deviceSize <= BComponent.Sizes.SMALL) ? toolbarStyle = Object.assign({}, toolbarStyle, { paddingLeft: '4px', paddingRight: '4px' }) : null;

    let tabDivStyle = (this.props.context.deviceSize <= BComponent.Sizes.SMALL) ? null : { marginRight: 24 };

    return (
      <div>
        <BDrawer
          ref={(item) => { this.leftDrawer = item; }}
          context={this.props.context}
          docked={this.leftDocked}
          containerStyle={leftDrawerStyle}
          anchor="left"
          open={this.openleft}
          onClose={this.onLeftDrawerClick}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}>
          {this.leftContent}
        </BDrawer>
        <BDrawer
          ref={(item) => { this.rightDrawer = item; }}
          context={this.props.context}
          docked={this.props.rightDocked}
          containerStyle={rightDrawerStyle}
          anchor="right"
          open={this.openright}
          onClose={this.onRightDrawerClick}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}>
          {this.rightContent}
        </BDrawer>
        {/* <BAppBarInner
          ref={(item) => { this.appBarInner = item; }}
          customerPaneElement={customerPaneElement}
          navigationMenuElement={navigationMenuElement}
          fullscreenElement={fullscreen}
          context={this.props.context}
          onTitleTouchTap={this.props.onTitleTouchTap}
          showMenuIconButton={this.props.showMenuIconButton}
          title={this.props.title}
          searchBarHintText={this.props.searchBarHintText}
          zDepth={0}
          leftDocked={this.leftDocked}
          rightDocked={this.rightDocked}
          onItemClick={this.onItemClick}
          logo={logo}
          resourceList={this.resourceList}>
        </BAppBarInner>  */}
        <AppBar style={{ boxShadow: 'none' }}>
          <Toolbar style={toolbarStyle}>
            {this.toolBarContent}
          </Toolbar>
          <div style={tabDivStyle}>
            {tabs}
            {rightDrawerButton}
          </div>
        </AppBar>
        <BPageHost
          ref={(item) => { this.childContainer = item; }}
          context={this.props.context}
          content={this.props.children}
          leftDrawerWidth={this.leftDrawerWidth}
          rightDrawerWidth={this.rightDrawerWidth}
          style={this.formStyle} />
      </div>
    );
  }

  showMobileTabMenu() {
    let popoverTabs = [];

    for (let index = 0; index < this.props.tabItems.length; index++) {
      const item = this.props.tabItems[index];
      let contentMenu = (
        <div>
          <BButton context={this.props.context}
            type="icon"
            style={{ float: 'right', visibility: index == 0 ? 'hidden' : 'visible' }}
            dynamicIcon={'Close'}
            // iconProperties={{ classes: { root: classes.iconRoot } }}
            onClick={this.onCloseMobileTabClick.bind(this, item.value)} />
          {/* <Close style={{ float: 'right', visibility: index == 0 ? 'hidden' : 'visible' }} /> */}
          <div style={{ display: 'flex', height: '48px', alignItems: 'center', paddingLeft: '16px', fontWeight : '500' }}>{BLocalization.stringUpperCase(item.text)}</div>
        </div>
      );
      popoverTabs.push(<BListItem key={item.value} context={this.props.context}
        primaryText={contentMenu} style={{ padding: 0 }}
        onClick={this.handleTabItemChange.bind(this, item.value)} />);
    }

    let tabsMenu = <div style={{ overflowY: 'scroll' }}>{popoverTabs}</div>;

    BDialogHelper.show(this.props.context, tabsMenu,
      BComponent.DialogType.SUCCESS,
      BComponent.DialogResponseStyle.OK, null, null, { padding: '0px', maxHeight: 'fit-content', borderRadius: '2px', overflow: 'auto', width: 'calc(100vw - 16px)', height: 'calc(100% - 16px)' }, null, null, false);
  }

  loadUnauthorizedResourceList() {
    this.isUnauthorizedResourceListLoading = true;
    BFormManager.getUnauthorizedResourceLightInfo(this.props.context.language, (response) => {
      if (response && response.success) {
        this.isUnauthorizedResourceListLoading = false;
        this.isUnauthorizedResourceListLoaded = true;

        var searchDataSource = BMenuHelper.convertResourceMenu(cloneDeep(response.value));
        this.inputSearch.getInstance().updateSearchDataSource(searchDataSource, false);
      }
      else {
        this.isUnauthorizedResourceListLoading = false;
        this.isUnauthorizedResourceListLoaded = false;
      }
    });
  }

  fullScreen(makeFull) {
    this.updateLeftOpen(!makeFull, false);
    this.updateRightOpen(!makeFull, false);

    this.updateChildStyle();
    this.fullscreen = makeFull;
  }

  onFullscreenClick() {
    if (this.fullscreen) {
      this.updateRightOpen(true, false);
      this.updateLeftOpen(true, false);
    }
    else {
      this.updateLeftOpen(false, false);
      this.updateRightOpen(false, false);
    }
    this.updateChildStyle();
    this.fullscreen = !this.fullscreen;
  }

  onMenuItemSelected(menuItem) {
    (this.props.context.deviceSize <= BComponent.Sizes.SMALL) && this.updateLeftOpen(false, true);
    this.openNewTabPage(menuItem);
  }

  onItemClick(menuItem) {
    this.openNewTabPage(menuItem.suggestion);
  }

  onTabItemChanged(event, menuItemProps) {

    var selectedTab =
      this.props.tabItems.filter(
        (tabItem) => {
          return tabItem.value == menuItemProps;
        }
      );

    this.props.onTabItemChanged && this.props.onTabItemChanged(selectedTab[0].pageValue, selectedTab[0].pageId);
  }

  openNewTabPage(menuItem, data = null, showAsNewPage = false, menuItemSuffix = null) {
    this.debugLog('Acılmaya calısılan menuItem:');
    this.debugLog(menuItem);
    var tabs: Object[] = this.tabItems;
    if (showAsNewPage || menuItemSuffix) {
      menuItem = cloneDeep(menuItem); // tabItem value'larının farklı olması gerektiğinden clone'landı.
    }

    menuItem.pageId = this.getPageId();
    var newTab = {
      text: menuItem.allProperties.name,
      pageValue: menuItem.allProperties,
      value: menuItem.pageId,
      pageId: menuItem.pageId
    };

    if (menuItemSuffix) {
      newTab.text = newTab.text + ' - ' + menuItemSuffix;
    }

    if (!showAsNewPage && tabs.filter(function (element) {
      return element.pageValue.resourceCode == newTab.pageValue.resourceCode && element.pageValue.name == newTab.pageValue.name;
    }).length == 1) {
      for (var i: number = 0; i < tabs.length; ++i) {
        if (tabs[i].pageValue.resourceCode == newTab.pageValue.resourceCode && tabs[i].pageValue.resourceCode == newTab.pageValue.resourceCode) {
          menuItem.allProperties = tabs[i].pageValue;
          this.tabValue = menuItem.allProperties;
          menuItem.pageId = tabs[i].pageId;
          // this.tabsRoot.getInstance().updateBTabBarDynamic(tabs, menuItem.allProperties);
          this.props.onTabItemChanged && this.props.onTabItemChanged(menuItem.allProperties, menuItem.pageId, menuItem.allProperties);
        }
      }
    }
    else if (showAsNewPage || tabs.filter(function (element) {
      return element.value == newTab.value;
    }).length == 0) {
      this.debugLog('Acıldı.');
      tabs.push(newTab);
      this.tabValue = newTab.value;
      // this.tabsRoot.getInstance().updateBTabBarDynamic(tabs, newTab.value);
      this.props.onNewTabOpened && this.props.onNewTabOpened(menuItem, menuItem.pageId, data);
    }
    else {
      this.tabValue = newTab.value;
      // this.tabsRoot.getInstance().updateBTabBarDynamic(tabs, newTab.value);
      this.props.onTabItemChanged && this.props.onTabItemChanged(menuItem.allProperties, newTab.pageId, newTab.pageValue);
    }
  }

  getPageId() {
    this.uniqueIncrement = this.uniqueIncrement + 1;
    return this.uniqueIncrement;
  }

  onMenuDataAcquired(menuItems) {
    this.debugLog('Tüm Menü');
    this.debugLog(menuItems);
    this.updateSearchDataSource(menuItems, true);
    if (this.props.onMenuDataAcquired) {
      this.props.onMenuDataAcquired(menuItems);
    }
  }

  onLeftDrawerClick(e) {
    if (!this.props.context.localization.isRightToLeft) {
      this.onNavigationMenuClick(e);
    }
    else {
      this.onCustomerPaneClick(e);
    }
  }

  onRightDrawerClick(e) {
    if (!this.props.context.localization.isRightToLeft) {
      this.onCustomerPaneClick(e);
    }
    else {
      this.onNavigationMenuClick(e);
    }
  }

  onNavigationMenuClick(e) {
    this.updateLeftOpen(!this.openleft, true);
    if (this.props.onNavigationMenuClick) {
      this.props.onNavigationMenuClick(e);
    }
  }

  onCustomerPaneClick(e) {
    this.updateRightOpen(!this.openright, true);
    if (this.props.onCustomerPaneClick) {
      this.props.onCustomerPaneClick(e);
    }
  }

  // renderMobileTab(tabs) {
  //   return (
  //     <div style={{ width: '100%', height:50, backgroundColor: this.props.context.theme.boaPalette.pri500, position: 'fixed', top: 70 }}>
  //       <div style={{ display: 'block', overflowX: 'scroll' }}>
  //         {tabs}
  //       </div>
  //     </div>
  //   );
  // }

  // renderTabletTab(tabs) {
  //   return (
  //     <div style={{ width: '100%', height:50, backgroundColor: this.props.context.theme.boaPalette.pri500, position: 'fixed', top: 70 }}>
  //       <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '72px' }}>&nbsp;</div>
  //       <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: 'calc(100% - 144px)', overflowX: 'scroll' }}>
  //         {tabs}
  //       </div>
  //       <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '72px' }}>
  //         <div style={{ padding: '0px', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left', paddingRight: '12px', paddingLeft: '12px' }}>
  //           <BIconButton context={this.props.context}
  //             icon={<ViewCarousel />}
  //             iconStyle={{ color: '#ffffff' }}
  //             style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
  //             onClick={this.onRightDrawerClick} />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // renderDesktopTab(tabs) {
  //   return (
  //     <div style={{ width: '100%', height: 50, backgroundColor: this.props.context.theme.boaPalette.pri500, position: 'fixed', top: 70 }}>
  //       <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '72px' }}>&nbsp;</div>
  //       <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: 'calc(100% - 168px)' }}>
  //         {tabs}
  //       </div>
  //       <div style={{ float: !this.props.context.localization.isRightToLeft ? 'right' : 'left', width: '96px' }}>
  //         <div style={{ padding: '0px', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left', paddingRight: !this.props.context.localization.isRightToLeft ? '12px' : '36px', paddingLeft: !this.props.context.localization.isRightToLeft ? '36px' : '12px'}}>
  //           <BIconButton context={this.props.context}
  //             icon={<ViewCarousel />}
  //             iconStyle={{ color: '#ffffff' }}
  //             style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
  //             onClick={this.onRightDrawerClick} />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  updateSearchDataSource(searchDataSource) {
    this.inputSearch && this.inputSearch.getInstance().updateSearchDataSource(searchDataSource, true);
    this.favoriteMenu && this.favoriteMenu.getInstance().updateDataSource(searchDataSource);
  }

  updateOnlySearchDataSource(searchDataSource) {
    this.inputSearch && this.inputSearch.getInstance().updateSearchDataSource(searchDataSource, false);
  }

  openFavoriteMenu() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        userArrowDisplay: 'none',
        favoritesArrowDisplay: 'block',
      });
    }, 130);
    this.favoriteMenu && this.favoriteMenu.getInstance().openFavoriteMenu();
  }

  timer = null;

  disappearPopoverArrow() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        userArrowDisplay: 'none',
        favoritesArrowDisplay: 'none',
      });
    }, 50);
  }

  openSettingsMenu = () => {
    BSettings.show(this.props.context);
  }


  getToolbar(context) {

    let picture = null;
    if (this.props.context.applicationContext &&
      this.props.context.applicationContext.login &&
      this.props.context.applicationContext.login.customerInformation &&
      this.props.context.applicationContext.login.customerInformation.picture) {
      picture = 'data:image/png;base64,' + this.props.context.applicationContext.login.customerInformation.picture;
    }

    const iconUserStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'right' : 'left',
      cursor: 'pointer',
      // padding: '6px 7px'
    };

    const iconLeftStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      padding: '6px 0px'
    };

    const iconRightStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'right' : 'left',
      padding: '6px 0px'
    };

    let fullScreen = <BIconButton context={this.props.context}
      icon={<Fullscreen />}
      iconStyle={{ color: '#ffffff' }}
      style={{ color: 'white' }}
      onClick={this.onFullscreenClick} />;


    let navigationMenuElement = (
      <BIconButton context={this.props.context}
        icon={<Menu />}
        iconStyle={{ color: '#ffffff' }}
        style={{ color: 'white' }}
        onClick={this.onLeftDrawerClick} />);

    // if (showMenuIconButton) {
    if (navigationMenuElement) {
      const navigationMenuElementProps = {};
      this._navigationMenuElement =
        (<div style={iconLeftStyle}>
          {Object.keys(navigationMenuElementProps).length > 0 ?
            cloneElement(navigationMenuElement, navigationMenuElementProps) :
            navigationMenuElement}
        </div>);
    }
    // }

    if (context.deviceSize >= BComponent.Sizes.MEDIUM) {
      this._userElement =
        (<div style={iconUserStyle} onClick={this.openUserProfileMenu.bind(this)}>
          <BAvatar
            context={this.props.context}
            src={picture}
            style={{ margin: '12px', width: '36px', height: '36px' }}
            size={36}>
            {!picture && <User context={this.props.context} style={{ width: '36px', height: '36px', margin: '0px', opacity: 0.87 }} />}
          </BAvatar>
          <div>
            <ArrowDropUp style={{ color: 'white', width: '30px', height: '30px', display: this.state.userArrowDisplay, margin: '-18px 15px 0px 15px' }} />
            {/* <BButton context={this.props.context}
              type='icon'
              iconProperties={{ style: { color: 'white', width: '30px', height: '30px' } }}
              style={{ padding: '0px', marginTop: '-28px', marginRight, display: 'block' }}
              dynamicIcon={'ArrowDropUp'} /> */}
          </div>
        </div>);

      this._favoriteElement =
        (<div style={iconRightStyle}>
          <BButton context={context}
            type='icon'
            dynamicIcon='Apps'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white' }}
            onClick={this.openFavoriteMenu.bind(this)} />
          <div>
            <ArrowDropUp style={{ color: 'white', width: '40px', height: '40px', display: this.state.favoritesArrowDisplay, margin: '-18px 4px 0px 4px' }} />
            {/* <BButton context={this.props.context}
              type='icon'
              iconProperties={{ style: { color: 'white', width: '40px', height: '40px' } }}
              style={{ padding: '0px', marginTop: '-22px', size: '20px', display: this.state.favoritesArrowDisplay }}
              dynamicIcon={'ArrowDropUp'} /> */}
          </div>
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

      // this._userElement = (
      //   <ListItem button>
      //     <ListItemIcon>
      //       <BAvatar
      //         context={this.props.context}
      //         icon={<User context={this.props.context} style={{ width: '32px', height: '32px', margin: '0px' }} />}
      //         src={picture}
      //         style={{ margin: '6px', width: '32px', height: '32px' }}
      //         size={36} />
      //     </ListItemIcon>
      //     <ListItemText inset primary={this.props.context.applicationContext.user.name} />
      //   </ListItem>);

      // this._userElement = <ListItem
      //   primaryText={this.props.context.applicationContext.user.name}
      //   leftIcon={
      //     <BAvatar
      //       context={this.props.context}
      //       icon={<User context={this.props.context} style={{ width: '32px', height: '32px', margin: '0px' }} />}
      //       src={picture}
      //       style={{ margin: '6px', width: '32px', height: '32px' }}
      //       size={36} />
      //   } />;

      let isRightToLeft = this.props.context.localization.isRightToLeft;

      let user = <BAvatar
        context={this.props.context}
        icon={<User context={this.props.context} style={{ width: '32px', height: '32px' }} />}
        src={picture}
        style={{ width: '32px', height: '32px', margin: isRightToLeft ? '0 16px 0 0px' : '0 0 0 16px' }}
        size={36} >
        {!picture && <User context={this.props.context} style={{ width: '32px', height: '32px', opacity: 0.87 }} />}
      </BAvatar>;

      let arrow = <BButton context={context}
        type='icon'
        iconProperties={{ color: this.props.context.theme.boaPalette.base400 }}
        style={{ padding: '0px', margin: isRightToLeft ? '0 0 0 4px' : '0 4px 0 0' }}
        dynamicIcon={isRightToLeft ? 'KeyboardArrowLeft' : 'KeyboardArrowRight'} />;

      let leftIcon = isRightToLeft ? arrow : user;
      let rightIcon = !isRightToLeft ? arrow : user;

      this._userElement =
        <BMenuItem primaryText={this.props.context.applicationContext.user.name}
          leftIcon={leftIcon}
          itemSelected={this.openUserProfileMenu.bind(this)}
          context={this.props.context}
          rightIcon={rightIcon}
        />;

      let favorite = <BButton context={context}
        type='icon'
        dynamicIcon='Apps'
        iconProperties={{ color: this.props.context.theme.boaPalette.base400 }}
        style={{ margin: isRightToLeft ? '10px 4px 10px 0' : '10px 0px 10px 4px', padding: '0px', color: 'grey' }} />;

      leftIcon = isRightToLeft ? arrow : favorite;
      rightIcon = !isRightToLeft ? arrow : favorite;

      this._favoriteElement =
        <BMenuItem primaryText="Favorites"
          leftIcon={leftIcon}
          itemSelected={this.openFavoriteMenu.bind(this)}
          context={this.props.context}
          rightIcon={rightIcon}
        />;

      let settings = <BButton context={context}
        type='icon'
        dynamicIcon='Settings'
        iconProperties={{ color: this.props.context.theme.boaPalette.base400 }}
        style={{ margin: isRightToLeft ? '10px 4px 10px 0' : '10px 0px 10px 4px', padding: '0px', color: this.props.context.theme.boaPalette.base400 }} />;

      leftIcon = isRightToLeft ? null : settings;
      rightIcon = !isRightToLeft ? null : settings;

      this._settingsElement =
        <BMenuItem primaryText="Settings"
          leftIcon={leftIcon}
          itemSelected={this.openSettingsMenu}
          context={this.props.context}
          rightIcon={rightIcon}
        />;
    }
    if (context.deviceSize > BComponent.Sizes.MEDIUM) {
      if (fullScreen) {
        const fullscreenElementProps = {};

        if (fullScreen.props.onFullscreenClick) {
          fullscreenElementProps.onFullscreenClick = fullScreen.props.onFullscreenClick;
        }
        this._fullscreenElement =
          (<div style={iconRightStyle}>
            {Object.keys(fullscreenElementProps).length > 0 ?
              cloneElement(fullScreen, fullscreenElementProps) :
              fullScreen}
          </div>);
      }
    }
    else {
      this._fullscreenElement = <div></div>;
    }
  }

  openUserProfileMenu() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        userArrowDisplay: 'block',
        favoritesArrowDisplay: 'none',
      });
    }, 130);
    this.userProfileMenu.getInstance().openUserProfileMenu();
  }

  onActionSearchClick() {
    this.inputSearch.getInstance().openSearchBar();
  }

  resetSearchValue() {
    this.inputSearch.getInstance().resetValue();
  }

  openPopover() {
    this.bPopover.openPopover();
  }

  closePopover() {
    this.bPopover.manualClose();
  }

  favoriteMenuItemClick(menuItem) {
    this.openNewTabPage(menuItem);
  }

  renderDesktopToolBar() {
    return (
      <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', height: '50px', width: '100%' }}>
        <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '205px' }}>
          {this._navigationMenuElement}
          {this._logo}
        </div>
        <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: 'calc(100% - 440px)' }}>
          <BInputSearch
            ref={(item) => { this.inputSearch = item; }}
            context={this.props.context}
            fullWidth={true}
            dataSource={this.resourceList}
            hintText={this.props.searchBarHintText}
            style={{ visibility: this._searchBarVisible, marginTop: 7 }}
            onItemClick={this.onItemClick} />
        </div>
        <div style={{ float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '235px' }}>
          {this._userElement}
          {
            <div>
              <BUserProfile
                isChangeUserVisible={this.props.isChangeUserVisible}
                ref={(item) => { this.userProfileMenu = item; }}
                context={this.props.context}
                onClose={this.disappearPopoverArrow.bind(this)} />
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
                favoriteMenuItemClick={this.favoriteMenuItemClick.bind(this)}
                dataSource={this.resourceList}
                onClose={this.disappearPopoverArrow.bind(this)}
              />
            </div>
          }
        </div>
      </div>
    );
  }

  renderMobileToolBar() {
    // const { classes } = this.props;

    // let popoverStyle = { position: 'absolute', maxWidth: '100%', width: 'calc(100% - 16px)', margin: '8px', zIndex: 10000 };
    let primaryButtonStyle = { color: this.props.context.theme.boaPalette.pri500, height: '48px', padding: '8px 8px'};

    let secondaryButtonStyle = { color: this.props.context.theme.boaPalette.obli500, height: '48px', padding: '8px 8px' };
    primaryButtonStyle = _.merge(primaryButtonStyle, this.props.context.theme.changeUser);
    secondaryButtonStyle = _.merge(secondaryButtonStyle, this.props.context.theme.logOut);
    let isRightToLeft = this.props.context.localization.isRightToLeft;
    let closeIcon =
      <BButton context={this.props.context}
        type='icon'
        iconProperties={{ color: this.props.context.theme.boaPalette.base400 }}
        style={{ padding: '0px', margin: isRightToLeft ? '0 0 0 4px' : '0 4px 0 0' }}
        dynamicIcon='Close' />;
    let leftIcon = isRightToLeft ? closeIcon : null;
    let rightIcon = !isRightToLeft ? closeIcon : null;
    let rightDrawerButton = <BIconButton context={this.props.context}
      icon={<ViewCarousel />}
      iconStyle={{ color: '#ffffff' }}
      style={{
        color: 'white',
        float: !this.props.context.localization.isRightToLeft ? 'right' : 'left',
        height: '60px'
      }}
      onClick={this.onRightDrawerClick} />;

    return (
      <div style={{ width: '100%', height: '50px', backgroundColor: this.props.context.theme.boaPalette.pri500 }}>
        {this._navigationMenuElement}
        {this._logo}
        {/* {this._customerPaneElement} */}
        {rightDrawerButton}
        <div style={{ padding: '6px 0px', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}>
          <BButton context={this.props.context}
            type='icon'
            dynamicIcon='MoreVert'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
            onClick={this.openPopover.bind(this)} />
          <BPopover
            anchorReference='anchorPosition'
            anchorPosition={{ top: '8', left: '8', }}
            PaperProps={{
              style: {
                maxWidth: '100%',
                width: 'calc(100% - 16px)',
              },
            }}
            marginThreshold='8'
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            context={this.props.context} ref={(item) => { this.bPopover = item; }} >
            <List style={{ paddingTop: 0 }}>
              {/* <ListItem primaryText="Menu" rightIcon={<BButton context={this.props.context}
                type='icon'
                iconProperties={{ color: 'grey' }}
                style={{ margin: '10px 12px', padding: '0px' }}
                dynamicIcon='Close'
                onClick={this.openPopover.bind(this)} />} /> */}

              <BMenuItem
                primaryText={this.getMessage('BOAOne', 'Menu')}
                leftIcon={leftIcon}
                itemSelected={this.closePopover.bind(this)}
                context={this.props.context}
                rightIcon={rightIcon}
                primaryTextPadding={isRightToLeft ? '0px 16px 0px 24px' : '0px 24px 0px 16px'}
              />
              <BDivider context={this.props.context} style={{ margin: '0px' }} />
              {this._userElement}
              {
                <div>
                  <BUserProfile
                    ref={(item) => { this.userProfileMenu = item; }}
                    context={this.props.context}
                    onClose={this.disappearPopoverArrow.bind(this)}
                    isChangeUserVisible={this.props.isChangeUserVisible}
                  />
                </div>
              }
              {this._favoriteElement}
              {
                <div>
                  <BFavoriteMenu
                    ref={(item) => { this.favoriteMenu = item; }}
                    context={this.props.context}
                    favoriteMenuItemClick={this.favoriteMenuItemClick.bind(this)}
                    dataSource={this.resourceList}
                    onClose={this.disappearPopoverArrow.bind(this)}
                  />
                </div>
              }
              {this._settingsElement}
              <BDivider context={this.props.context} style={{ margin: '0px' }} />
              <div style={{
                float: isRightToLeft ? 'left' : 'right',
                marginBottom: '6px',
                padding: isRightToLeft ? '0 0 0 16px' : '0 16px 0 0',
                display: 'flex', 'flex-direction': isRightToLeft ? 'row-reverse' : null
              }}>
                <div>
                  {this.props.isChangeUserVisible && <BButton context={this.props.context} style={primaryButtonStyle} type="flat" text={this.getMessage('BOAOne', 'ChangeUser')} onClick={this.changeUser.bind(this)} /> } 
                </div>
                <div>
                  <BButton context={this.props.context} style={secondaryButtonStyle} type="flat" text={this.getMessage('BOAOne', 'LogOut')} onClick={this.logOut.bind(this)} />
                </div>
              </div>
              {/* <div style={this.props.context.theme.changeUser}>CHANGE USER</div>
              <div style={this.props.context.theme.logOut}>LOG OUT</div> */}
            </List>
          </BPopover>
        </div>
        <div style={{ padding: '6px 0px', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}>
          <BButton context={this.props.context}
            type='icon'
            dynamicIcon='Search'
            iconProperties={{ color: '#ffffff' }}
            style={{ color: 'white', float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
            onClick={this.onActionSearchClick.bind(this)} />
        </div>
        <BInputSearch
          ref={(item) => { this.inputSearch = item; }}
          context={this.props.context}
          fullWidth={true}
          dataSource={this.resourceList}
          hintText={this.props.searchBarHintText}
          style={{ visibility: this._searchBarVisible }}
          onItemClick={this.onItemClick} />
      </div>
    );
  }
}

export default BAppBar;
