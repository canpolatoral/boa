import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { withStyles } from '@material-ui/core/styles';
import MuiMenuList from '@material-ui/core/MenuList';
import MuiDivider from '@material-ui/core/Divider';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { MenuItem } from '@boa/components/MenuItem';
import { Icon } from '@boa/components/Icon';

/* eslint-disable no-unused-vars */
const styles = theme => ({
  menuItem: { paddingBottom: '6px', paddingTop: '6px', paddingLeft: '0px', paddingRight: '0px', height: 'auto' },
  gutters: { padding: '0px' },
  primary: {},
  icon: {},
});

/* eslint-enable no-unused-vars */
@ComponentComposer
@withStyles(styles)
class Menu extends ComponentBase {

  static defaultProps = {
    ...ComponentBase.defaultProps,
    autoWidth: true,
    disableAutoFocus: false,
    initiallyKeyboardFocused: false,
    maxHeight: null,
    multiple: false,
    isMenuItemList: false,
    primaryTextPadding: '0px 24px 0px 24px',
  };

  static propTypes = {
    ...ComponentBase.propTypes,
    /**
     * If true, the width of the menu will be set automatically
     * according to the widths of its children,
     * using proper keyline increments (64px for desktop,
     * 56px otherwise).
     */
    autoWidth: PropTypes.bool,
    /**
     * If true, the menu will not be auto-focused.
     */
    disableAutoFocus: PropTypes.bool,
    /**
     * If true, the menu will be keyboard-focused initially.
     */
    initiallyKeyboardFocused: PropTypes.bool,
    /**
     * Override the inline-styles of the underlying `List` element.
     */
    style: PropTypes.object,

    listStyle: PropTypes.object,
    /**
     * The maximum height of the menu in pixels. If specified,
     * the menu will be scrollable if it is taller than the provided
     * height.
     */
    maxHeight: PropTypes.number,
    /**
     * If true, `value` must be an array and the menu will support
     * multiple selections.
     */
    multiple: PropTypes.bool,
    /**
     * Callback function fired when a menu item with `value` not
     * equal to the current `value` of the menu is touch-tapped.
     *
     * @param {object} event TouchTap event targeting the menu item.
     * @param {any}  value If `multiple` is true, the menu's `value`
     * array with either the menu item's `value` added (if
     * it wasn't already selected) or omitted (if it was already selected).
     * Otherwise, the `value` of the menu item.
     */
    onChange: PropTypes.func,
    /**
     * Callback function fired when the menu is focused and the *Esc* key
     * is pressed.
     *
     * @param {object} event `keydown` event targeting the menu.
     */
    onEscKeyDown: PropTypes.func,
    /**
     * Callback function fired when a menu item is touch-tapped.
     *
     * @param {object} event TouchTap event targeting the menu item.
     * @param {object} menuItem The menu item.
     * @param {number} index The index of the menu item.
     */
    onItemTouchTap: PropTypes.func,
    /**
     * If `multiple` is true, an array of the `value`s of the selected
     * menu items. Otherwise, the `value` of the selected menu item.
     * If provided, the menu will be a controlled component.
     * This component also supports valueLink.
     */
    value: PropTypes.any,
    /**
     * The width of the menu. If not specified, the menu's width
     * will be set according to the widths of its children, using
     * proper keyline increments (64px for desktop, 56px otherwise).
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Item list
     *
     */
    items: PropTypes.array.isRequired,
    /**
       * ItemList Parents Info
       *
       */
    parentMenuItem: PropTypes.object,

    classes: PropTypes.object.isRequired,

    isMenuItemList: PropTypes.bool,

    primaryTextPadding: PropTypes.any
  };

  state = { value: this.props.value };

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }
  constructor(props, context) {
    super(props, context);
  }

  menuItemSelected(parameters) {
    this.setState({ value: parameters.value });
    if (this.props.menuItemSelected) {
      this.props.menuItemSelected(parameters);
    }
  }

  getIcon(iconProp) {
    if (iconProp) {
      let iconProperties = null;
      if (iconProp.svgIcon || iconProp.fontIcon || iconProp.dynamicIcon) {
        iconProperties = merge({
          style: {
            height: '20px',
            width: '20px',
            margin: !this.props.context.localization.isRightToLeft ? 'auto 0px auto 24px' : 'auto 24px auto 12px',
            right: 0,
            top: '50%',
            color: this.props.context.theme.boaPalette.base400
            // transform:'translate(0%, -50%)'
          }
        }, iconProp.iconProperties || {});
      }
      if (iconProperties) {
        iconProp.iconProperties = iconProperties;
      }

      let icon = Icon.getIcon(iconProp);
      return icon ? icon : iconProp;
    }
    return null;
  }

  render() {
    let menuItems = null;

    if (this.props.isMenuItemList && this.props.items) {

      menuItems = this.props.items.map((item) => {
        if ((item.props.menuItems && item.props.menuItems.length > 0)) {
          return React.cloneElement(item, {
            itemSelected: (parameters) => {
              this.menuItemSelected(parameters);
            },
            items: item.props.menuItems
          });
        }
        if (!item.props.primaryText) {
          return (<MuiDivider style={{ marginBottom: '12px', marginTop: '12px' }} key={Math.random()} />);
        }

        return item;
      });
    }
    else {
      menuItems = this.props.items.map((item) => {
        // eğer ekran ise aktif mi değil mi!
        if (item && item.allProperties && item.allProperties.typeId &&
          !(item.allProperties.typeId === 1 || item.allProperties.typeId === 2)) {
          return (<div></div>);
        }

        let rightIcon = item.items && item.items.length ?
          this.getIcon({
            dynamicIcon: !this.props.context.localization.isRightToLeft ?
              'ChevronRight' : 'ChevronLeft'
          }) :
          this.getIcon(item.rightIcon);
        let leftIcon = this.getIcon(item.leftIcon);
        let itemStyle = merge({
          lineHeight: null,
          whiteSpace: 'normal',
          minHeight: 24,
          fontSize: 14,
          paddingleft: !this.props.context.localization.isRightToLeft ? '12px' : '0px',
          paddingRight: !this.props.context.localization.isRightToLeft ? '12px' : '0px'
        }, item.style || {});
        if (item && item.leftIcon && item.leftIcon.dynamicIcon === 'ChevronLeft') {
          itemStyle = merge({
            lineHeight: null,
            whiteSpace: 'normal',
            minHeight: 24,
            fontSize: 16,
            paddingleft: !this.props.context.localization.isRightToLeft ? '0px' : '12px',
            paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px'
          }, item.style || {});
        }
        let innerDivStyle = merge({
          padding: !this.props.context.localization.isRightToLeft ? '10px 40px 10px 72px' : '10px 72px 10px 40px'
        }, item.innerDivStyle || {});
        return item.value || item.text ? (
          <MenuItem
            classes={this.props.classes}
            context={this.props.context}
            key={item.value}
            value={item.value}
            primaryText={item.text}
            items={item.items}
            rightIcon={rightIcon}
            leftIcon={leftIcon}
            style={itemStyle}
            primaryTextPadding={this.props.primaryTextPadding}
            innerDivStyle={innerDivStyle}
            itemSelected={this.menuItemSelected.bind(this)}
            width={this.props.width}
            allProperties={item.allProperties} />
        ) : <MuiDivider style={{ marginBottom: '12px', marginTop: '12px' }} key={Math.random()} />;
      });
    }


    return (
      <MuiMenuList
        autoWidth={this.props.autoWidth}
        disableAutoFocus={this.props.disableAutoFocus}
        initiallyKeyboardFocused={this.props.initiallyKeyboardFocused}
        style={this.props.style}
        listStyle={this.props.listStyle}
        maxHeight={this.props.maxHeight}
        multiple={this.props.multiple}
        onChange={this.props.onChange}
        onEscKeyDown={this.props.onEscKeyDown}
        onItemTouchTap={this.props.onItemTouchTap}
        value={this.state.value}
        width={this.props.width}
      >
        {menuItems}
      </MuiMenuList>
    );
  }
}

export default Menu;
