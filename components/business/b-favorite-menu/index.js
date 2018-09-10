import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import { BBusinessComponent } from 'b-business-component';
import { BComponent, BComponentComposer } from 'b-component';
import { BPopover } from 'b-popover';
import { BMenu } from 'b-menu';
import { BMenuItem } from 'b-menu-item';
import { BButton } from 'b-button';
import { BDivider } from 'b-divider';
import { withStyles } from '@material-ui/core/styles';

const styles = ({
  root: {
    left: 0
  },
  inset: {
    '&:first-child': {
      paddingLeft: 0,
      width: '100%'
    }
  },
  paper: {
    position: 'unset'
  }

});

@BComponentComposer
@withStyles(styles)

export class BFavoriteMenu extends BBusinessComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent.
    */
    ...BBusinessComponent.props,
    /**
    * The event to handle favorite menu item clicked.
    */
    favoriteMenuItemClick: PropTypes.func,
    /**
    * Indicates the data source.
    */
    dataSource: PropTypes.any,
    /**
    * The event to handle favorite popover window closed.
    */
    onClose: PropTypes.func,
  };
  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTEXCELD'
  };

  constructor(props, context) {
    super(props, context);
    this.dataSource = [];
    this.height = document.body.scrollHeight / 2 - 90;
    let heightPopover = document.body.scrollHeight - 84 + 'px';
    this.closeFavoriteMenuClick = this.closeFavoriteMenuClick.bind(this);
    this.favoriteMenuItemClick = this.favoriteMenuItemClick.bind(this);
    this.updateDataSource = this.updateDataSource.bind(this);
    this.setDataSource = this.setDataSource.bind(this);

    this.state = {
      openFavoriteMenu: false,
      favoriteItems: [],
      menuStyle: { margin: '0px', height: this.height + 'px', overflowY: 'scroll' },
      popoverDesktopStyle: {
        // position: 'absolute',
        top: '66px',
        right: !this.props.context.localization.isRightToLeft ? '30px' : 'auto',
        left: !this.props.context.localization.isRightToLeft ? 'auto' : '30px',
        maxWidth: '340px',
        width: '320px',
        height: heightPopover,
        maxheight: heightPopover,
        transformOrigin: 'top right 0px',
        zIndex: 10000
      },
      popoverMobileStyle: {
        position: 'absolute',
        maxWidth: '100%',
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
        maxheight: 'calc(100% - 24px)',
        margin: '8px',
        zIndex: 10000
      }
    };
    if (props.dataSource) {
      this.updateDataSource(props.dataSource, true);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    super.shouldComponentUpdate(nextProps, nextState);
    return (nextProps.context !== this.props.context) ||
      (nextState.openFavoriteMenu !== this.state.openFavoriteMenu) ||
      (nextState.favoriteItems !== this.state.favoriteItems);
  }

  render() {
    const { classes } = this.props;
    let isRightToLeft = this.props.context.localization.isRightToLeft;

    let popoverStyle = {};
    let headerIcon = <div></div>;
    let anchorOrigin = {};
    let transformOrigin = {};
    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      popoverStyle = this.state.popoverDesktopStyle;
      anchorOrigin = { horizontal: !isRightToLeft ? 'left' : 'right', vertical: 'top' };
      transformOrigin = { horizontal: 'center', vertical: 'top' };
    }
    else {
      popoverStyle = this.state.popoverMobileStyle;
      transformOrigin = { horizontal: !isRightToLeft ? 'right' : 'left', vertical: 'bottom' };
      headerIcon = <div>
        <BMenuItem
          primaryText={this.getMessage('BusinessComponents', 'MyFavoritesLabel')}
          primaryTextPadding = { isRightToLeft ? '0px 16px 0px 24px' : '0px 24px 0px 16px' }
          itemSelected={this.closeFavoriteMenuClick}
          context={this.props.context}
          rightIcon={isRightToLeft ?
            null
            :
            <BButton
              context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 4px 0 0', padding: '0px' }}
              dynamicIcon='Close'
            />
          }
          leftIcon={isRightToLeft ?
            <BButton
              context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 0 0 4px', padding: '0px' }}
              dynamicIcon='Close'
            />
            :
            null
          }
        />
        <BDivider context={this.props.context} style={{ margin: 0 }} />
      </div>;
    }

    let listPage = [];
    let listReport = [];
    for (var i = 0; i < this.state.favoriteItems.length; i++) {
      var obj = this.state.favoriteItems[i];
      if (obj && obj.allProperties && obj.allProperties.resourceCode.toString().substr(0, 3) === 'RPT') {
        listReport.push(obj);
      }
      else {
        listPage.push(obj);
      }
    }

    let favoriteScreensTitle =
      <BMenuItem primaryText={this.getMessage('BusinessComponents', 'FavoritePages')}
        className={classes.inset}
        itemSelected={this.closeFavoriteMenuClick}
        context={this.props.context}
        style={{
          padding: this.props.context.deviceSize >= BComponent.Sizes.MEDIUM ? '18px 12px 12px 12px' : (isRightToLeft ? '18px 4px 12px 12px' : '18px 12px 12px 4px'),
          width: '85%' }}
        primaryTextPadding={isRightToLeft ? '0px 12px 0px 24px' : '0px 24px 0px 12px'}
        leftIcon={null}
        disabled='true'
      />;

    let favoriteReportsTitle =
      <BMenuItem primaryText={this.getMessage('BusinessComponents', 'FavoriteReports')}
        context={this.props.context}
        style={{
          padding: this.props.context.deviceSize >= BComponent.Sizes.MEDIUM ? '18px 12px 12px 12px' : (isRightToLeft ? '18px 4px 12px 12px' : '18px 12px 12px 4px'),
          width: '85%' }}
        primaryTextPadding={isRightToLeft ? '0px 12px 0px 24px' : '0px 24px 0px 12px'}
        leftIcon={null}
        rightIcon={null}
        disabled='true'
      />;


    let favoriteMenuTitleIcon =
      <BButton
        context={this.props.context}
        type='icon'
        iconProperties={{ nativeColor: 'grey' }}
        style={{
          margin: this.props.context.deviceSize >= BComponent.Sizes.MEDIUM ? (isRightToLeft ? '7px 0px 10px 12px' : '7px 12px 10px 0px') : (isRightToLeft ? '7px 0px 10px 4px' : '7px 4px 10px 0px'),
          padding: '0px' }}
        dynamicIcon='MoreVert'
      />;

    return (
      <BPopover
        anchorReference='anchorPosition'
        anchorPosition={this.props.context.localization.isRightToLeft ? {
          top: 0, left: this.props.context.deviceSize >= BComponent.Sizes.MEDIUM ? 140 : 0
        } : { top: 0, left: 160, }}
        PaperProps={{
          style: {
            maxWidth: '100%',
            width: '100%',
          },
        }}
        marginThreshold='0'
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'center',
        // }}
        className={classes.inset}
        style={popoverStyle}
        context={this.props.context}
        open={this.state.openFavoriteMenu}
        isOriginSetted={true}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onRequestClose={this.closeFavoriteMenuClick} >
        {headerIcon}
        <div style={{
          display: 'inline-flex', width: '100%', flexDirection: isRightToLeft ? 'row-reverse' : 'row', height: '48px'
        }}>
          {favoriteScreensTitle}
          {favoriteMenuTitleIcon}
        </div>
        <div style={this.state.menuStyle}>
          <BMenu
            context={this.props.context}
            style={this.state.menuStyle}
            maxHeight={this.height}
            items={listPage}
            menuItemSelected={this.favoriteMenuItemClick}>
          </BMenu>
        </div>
        <div style={{
          display: 'inline-flex', width: '100%', flexDirection: isRightToLeft ? 'row-reverse' : 'row'
        }}>
          {favoriteReportsTitle}
          {favoriteMenuTitleIcon}
        </div>
        <div style={this.state.menuStyle}>
          <BMenu
            context={this.props.context}
            style={this.state.menuStyle}
            maxHeight={this.height}
            items={listReport}
            menuItemSelected={this.favoriteMenuItemClick}>
          </BMenu>
        </div>
      </BPopover >
    );
  }

  favoriteMenuItemClick(parameters) {
    this.debugLog('favorite menu item selected: ' + JSON.stringify(parameters));
    this.closeFavoriteMenuClick();
    if (this.props.favoriteMenuItemClick) {
      this.props.favoriteMenuItemClick(parameters);
    }
  }

  updateDataSource(dataSource, isConstructor) {
    var searchDataSource = cloneDeep(dataSource);
    if (searchDataSource && searchDataSource.length > 0) {
      for (var i = 0; i < searchDataSource.length; i++) {
        var obj = searchDataSource[i];
        this.setDataSource(obj);
      }
    }
    if (isConstructor) {
      this.state.favoriteItems = this.dataSource;
    }
    else {
      this.setState({ favoriteItems: this.dataSource });
    }
  }

  setDataSource(obj) {
    if (obj.items && obj.items.length > 0) {
      for (var i = 0; i < obj.items.length; i++) {
        var innerObj = obj.items[i];
        if (obj.leftIcon)
          innerObj.leftIcon = obj.leftIcon;
        this.setDataSource(innerObj);
      }
    }
    else if (obj.allProperties && obj.allProperties.isFavorite) {
      this.dataSource.push(obj);
    }
  }

  openFavoriteMenu() {
    this.setState((prevState) => {
      return { openFavoriteMenu: !prevState.openFavoriteMenu };
    });
  }

  closeFavoriteMenuClick() {
    this.setState((prevState) => {
      return { openFavoriteMenu: !prevState.openFavoriteMenu };
    });
    this.props.onClose();
  }
}

export default BFavoriteMenu;
