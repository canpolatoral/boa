import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { BComponent, BComponentComposer } from 'b-component';
import { BMenu } from 'b-menu';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

/* eslint-disable no-unused-vars */
const styles = theme => ({
  primary: {},
  leftIconClass: {},
  rightIconClass: {}
});
/* eslint-enable no-unused-vars */
@BComponentComposer
@withStyles(styles)
export class BDrawerMenu extends BComponent {

  static propTypes = {
    /**
    * Base properties from BComponent.
    */
    ...BComponent.propTypes,
    /**
    * Auto Width property for BMenu Component.
    */
    autoWidth: PropTypes.bool,
    /**
     * Disable auto focus Width property for BMenu Component.
     */
    disableAutoFocus: PropTypes.bool,
    /**
    * Initially keyboard focused property for BMenu Component.
    */
    initiallyKeyboardFocused: PropTypes.bool,
    /**
    * List style property for BMenu Component.
    */
    listStyle: PropTypes.object,
    /**
    * Max height property for BMenu Component.
    */
    maxHeight: PropTypes.number,
    /**
    * Multiple property for BMenu Component.
    */
    multiple: PropTypes.bool,
    /**
    * Width property for BMenu Component.
    */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
    * The items in the menu.
    */
    items: PropTypes.array.isRequired,
    /**
    * OnChange event of component.
    */
    onChange: PropTypes.func.isRequired,
    /**
    * OnDrawerMenuUpdate event of component.
    */
    onDrawerMenuUpdate: PropTypes.func,

    isMenuItemList: PropTypes.bool
  }

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps,
    autoWidth: true,
    disableAutoFocus: false,
    initiallyKeyboardFocused: false,
    maxHeight: null,
    multiple: false,
    isMenuItemList: false
  };

  constructor(props, context) {
    super(props, context);
    this.state = { menuChain: [] };
    this.pushNewMenu(props.items, true);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.pushNewMenu(nextProps.items, false);
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    if (this.props.onDrawerMenuUpdate) {
      this.props.onDrawerMenuUpdate();
    }
  }

  menuItemSelected(parameters) {
    if (parameters.value && (typeof parameters.value === 'string') && parameters.value.startsWith('MenuSubMenuBackItem_')) {
      this.onBackButtonClick();
    }
    else {
      this.setState({ value: parameters.value });
      if (!this.pushNewMenu(parameters.items, false, parameters, true)) {
        this.onChange(parameters);
      }
    }
  }

  pushNewMenu(items, isConstructing = false, parentMenuItem = null, mainMenu) {
    if (items && items.length) {
      this.clearBlankItems(items);
      var newItem = {
        items: items,
        menu: (<div style={{ marginTop: 12 }}>  {this.createBMenu(items, parentMenuItem, mainMenu)} </div>)
      };

      if (isConstructing) {
        this.state.menuChain.push(newItem);
      }
      else {
        var newMenuChain = this.state.menuChain ? this.state.menuChain.slice(0) : [];
        newMenuChain.push(newItem);
        this.setState({ menuChain: newMenuChain });
      }
      return true;
    }
    return false;
  }

  clearBlankItems(items) {
    if (items && items.length > 0) {
      let isThereASubItem = false;
      for (let i = items.length - 1; i >= 0; i--) {
        var menuItem = items[i];

        if (this.props.isMenuItemList) {
          menuItem = items[i].props;
        }


        if (menuItem.allProperties && menuItem.allProperties.typeId === 1 && menuItem.items && menuItem.items.length > 0) {
          let willClear = this.clearBlankItems(menuItem.items);
          if (willClear) {
            items.splice(i, 1);
          }
          else {
            isThereASubItem = true;
          }
        }
        else if (menuItem.allProperties && menuItem.allProperties.typeId === 2) {
          isThereASubItem = true;
        }
      }
      if (!isThereASubItem) {
        return true;
      }
    }
    else {
      return true;
    }
  }

  onChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  createBMenu(menuItems, parentMenuItem = null, mainMenu) {
    let backButton = null;
    let innerDivStyle = { padding: !this.props.context.localization.isRightToLeft ? '10px 40px 10px 24px' : '10px 24px 10px 40px' };
    let listStyle = { padding: '0px', paddingTop: '0px', paddingBottom: '0px' };
    if (menuItems && menuItems.length && parentMenuItem && mainMenu) {
      let iconStyle = {
        width: 24,
        height: 24,
        left: 0,
        marginLeft: 24
      };
      if (this.props.context.localization.isRightToLeft) {
        iconStyle = {
          width: 24,
          height: 24,
          right: 0,
          marginRight: 24
        };
      }

      let backButtonMenuItem = [
        {
          'text': parentMenuItem.text,
          'value': 'MenuSubMenuBackItem_' + parentMenuItem.value,
          'leftIcon': { dynamicIcon: !this.props.context.localization.isRightToLeft ? 'ArrowBack' : 'ArrowForward', iconProperties: { style: iconStyle }, iconStyle: iconStyle },
          'style': {
            color: this.props.context.theme.boaPalette.base400,
            backgroundColor: this.props.context.theme.boaPalette.base150,
            borderBottom: '0px solid',
            minHeight: 28,
            marginTop: -12,
            fontSize: 16,
            // height: 0,
            // position: 'fixed',
            // zIndex: '10',
            // minWidth: 258
          },
        }
      ];
      backButton =
        <BMenu
          classes={this.props.classes}
          context={this.props.context}
          autoWidth={this.props.autoWidth}
          style={{ padding: '0px 0px 0px 0px' }}
          listStyle={listStyle}
          width={this.props.width}
          items={backButtonMenuItem}
          menuItemSelected={this.menuItemSelected.bind(this)}>
        </BMenu>;
    }
    if (mainMenu) {
      let menuList = [];
      let backButtondiv = (<div className="b-drawer-menu" style={{position:'sticky', top:0, zIndex:1}}>{backButton}</div>);
      menuList.push(backButtondiv);
      if (menuItems != null && menuItems.length > 0) {
        let itemList = [];

        if (this.props.isMenuItemList) {

          let item = (

            this.createBMenu(menuItems, parentMenuItem, false)
          );
          menuList.push(item);

        }


        for (let i = 0; i < menuItems.length; i++) {

          var menuItem = menuItems[i];

          if (this.props.isMenuItemList) {
            menuItem = menuItems[i].props;

          }


          if (menuItem.allProperties && menuItem.allProperties.typeId === 1 &&
            menuItem.items && menuItem.items.length > 0) {
            let subItemList = [];
            menuItem.items.map((subItem) => {

              var subMenuItem = subItem;

              if (this.props.isMenuItemList) {
                subMenuItem = subItem.props;
              }


              // ekran ise aktif mi değil mi kontrolü
              if (!(!subMenuItem || !subMenuItem.allProperties ||
                !(subMenuItem.allProperties.typeId === 1 ||
                  subMenuItem.allProperties.typeId === 2))) {
                subMenuItem.innerDivStyle = innerDivStyle;
                subItemList.push(subMenuItem);
              }
            });
            if (subItemList && subItemList.length > 0) {
              let item = (
                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                  {
                    this.headItem(menuItem)
                  }
                  {
                    this.createBMenu(subItemList, parentMenuItem, false)
                  }
                  <Divider style={{ marginBottom: '12px', marginTop: '12px' }} />
                </div>);
              menuList.push(item);
            }

          }
          else if (menuItem.allProperties && menuItem.allProperties.typeId === 2) {
            menuItem.innerDivStyle = innerDivStyle;
            itemList.push(menuItem);
          }
        }
        if (itemList && itemList.length > 0) {
          let item = (
            <div style={{ marginTop: '12px', marginBottom: '12px' }}>
              {
                this.headItem(parentMenuItem)
              }
              {
                this.createBMenu(itemList, parentMenuItem, false)
              }
              <Divider style={{ marginBottom: '12px', marginTop: '12px' }} />
            </div>);
          menuList.push(item);
        }
      }
      return menuList;
    }
    else {
      return (
        <div  >{backButton}
          <BMenu
            classes={this.props.classes}
            context={this.props.context}
            autoWidth={this.props.autoWidth}
            disableAutoFocus={this.props.disableAutoFocus}
            initiallyKeyboardFocused={this.props.initiallyKeyboardFocused}
            style={{ padding: '0px' }}
            listStyle={merge(listStyle, this.props.listStyle ? this.props.listStyle : {})}
            maxHeight={this.props.maxHeight}
            multiple={this.props.multiple}
            width={this.props.width}
            items={menuItems}
            isMenuItemList={this.props.isMenuItemList}
            parentMenuItem={parentMenuItem}
            menuItemSelected={this.menuItemSelected.bind(this)}>
          </BMenu>
        </div>
      );
    }
  }
  headItem(item) {
    // const { menu } = this.props.context.theme;

    // let alignment = !this.props.context.localization.isRightToLeft ? 'left' : 'right';
    if (item && ((this.props.isMenuItemList) ? item.primaryText : item.text)) {
      return (

        <div style={{
          minHeight: '36px',
          color: this.props.context.theme.boaPalette.pri500,
          fontSize: '11px',
          fontWeight: '700',
          display: 'flex',
          height: '0px',
          alignItems: 'center',
          textAlign: this.props.context.localization.isRightToLeft ? 'right' : 'left',
          padding: !this.props.context.localization.isRightToLeft ? '0px 0px 0px 24px' : '0px 24px 0px 0px',

        }}>
          {BComponent.Localization.stringUpperCase(((this.props.isMenuItemList) ? item.primaryText : item.text))}
        </div>
      );
    }
    else {
      return (
        <span></span>
      );
    }
  }

  onBackButtonClick() {
    if (this.state.menuChain.length > 1) {
      var newMenuChain = this.state.menuChain.slice(0);
      newMenuChain.pop();
      this.setState({ menuChain: newMenuChain });
    }
  }

  render() {
    if (this.state.menuChain.length > 0) {
      let last = this.state.menuChain[this.state.menuChain.length - 1];
      let lastMenu = last.menu;
      return (<div>{lastMenu}</div>);
    }
    else {
      return <div></div>;
    }
  }
}

export default BDrawerMenu;
