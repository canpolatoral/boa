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
  menuItem: {
    paddingBottom: '6px',
    paddingTop: '6px',
    paddingLeft: '0px',
    paddingRight: '0px',
    height: 'auto',
  },
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
    multiple: false,
    isMenuItemList: false,
    primaryTextPadding: '0px 24px 0px 24px',
    items: [],
  };

  static propTypes = {
    ...ComponentBase.propTypes,
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     *
     */
    isMenuItemList: PropTypes.bool,
    /**
     * Item list
     */
    items: PropTypes.array.isRequired,
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
     * ItemList Parents Info
     */
    parentMenuItem: PropTypes.object,
    /**
     *
     */
    primaryTextPadding: PropTypes.any,
    /**
     * Override the inline-styles of the underlying `List` element.
     */
    style: PropTypes.object,
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
  };

  state = {
    value: this.props.value,
  };

  constructor(props) {
    super(props);
    this.menuItemSelected = this.menuItemSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  menuItemSelected(parameters) {
    this.setState({ value: parameters.value });
    if (this.props.menuItemSelected) {
      this.props.menuItemSelected(parameters);
    }
  }

  getIcon(iconProp) {
    const isRightToLeft = this.props.context.localization.isRightToLeft;

    if (iconProp) {
      let iconProperties = null;
      if (iconProp.svgIcon || iconProp.fontIcon || iconProp.dynamicIcon) {
        iconProperties = merge(
          {
            style: {
              height: '20px',
              width: '20px',
              margin: !isRightToLeft ? 'auto 0px auto 24px' : 'auto 24px auto 12px',
              right: 0,
              top: '50%',
              color: this.props.context.theme.boaPalette.base400,
              // transform:'translate(0%, -50%)'
            },
          },
          iconProp.iconProperties || {},
        );
      }
      if (iconProperties) {
        iconProp.iconProperties = iconProperties;
      }

      const icon = Icon.getIcon(iconProp);
      return icon || iconProp;
    }
    return null;
  }

  render() {
    let menuItems = null;
    const isRightToLeft = this.props.context.localization.isRightToLeft;
    if (this.props.isMenuItemList && this.props.items) {
      menuItems = this.props.items.map(item => {
        if (item.props.menuItems && item.props.menuItems.length > 0) {
          return React.cloneElement(item, {
            itemSelected: parameters => {
              this.menuItemSelected(parameters);
            },
            items: item.props.menuItems,
          });
        }
        if (!item.props.primaryText) {
          return (
            <MuiDivider
              style={{
                marginBottom: '12px',
                marginTop: '12px',
              }}
              key={Math.random()}
            />
          );
        }

        return item;
      });
    } else {
      menuItems = this.props.items.map(item => {
        // eğer ekran ise aktif mi değil mi!
        if (
          item &&
          item.allProperties &&
          item.allProperties.typeId &&
          !(item.allProperties.typeId === 1 || item.allProperties.typeId === 2)
        ) {
          return <div />;
        }

        const rightIcon =
          item.items && item.items.length
            ? this.getIcon({
              dynamicIcon: !this.props.context.localization.isRightToLeft
                ? 'ChevronRight'
                : 'ChevronLeft',
            })
            : this.getIcon(item.rightIcon);
        const leftIcon = this.getIcon(item.leftIcon);
        let itemStyle = merge(
          {
            lineHeight: null,
            whiteSpace: 'normal',
            minHeight: 24,
            fontSize: 14,
            paddingleft: !this.props.context.localization.isRightToLeft ? '12px' : '0px',
            paddingRight: !this.props.context.localization.isRightToLeft ? '12px' : '0px',
          },
          item.style || {},
        );
        if (item && item.leftIcon && item.leftIcon.dynamicIcon === 'ChevronLeft') {
          itemStyle = merge(
            {
              lineHeight: null,
              whiteSpace: 'normal',
              minHeight: 24,
              fontSize: 16,
              paddingleft: !this.props.context.localization.isRightToLeft ? '0px' : '12px',
              paddingRight: !this.props.context.localization.isRightToLeft ? '0px' : '12px',
            },
            item.style || {},
          );
        }
        const innerDivStyle = merge(
          {
            padding: !isRightToLeft ? '10px 40px 10px 72px' : '10px 72px 10px 40px',
          },
          item.innerDivStyle || {},
        );
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
            itemSelected={this.menuItemSelected}
            width={this.props.width}
            allProperties={item.allProperties}
          />
        ) : (
            <MuiDivider style={{ marginBottom: '12px', marginTop: '12px' }} key={Math.random()} />
          );
      });
    }

    return (
      <MuiMenuList
        multiple={this.props.multiple}
        onChange={this.props.onChange}
        value={this.state.value}
        width={this.props.width}
      >
        {menuItems}
      </MuiMenuList>
    );
  }
}

export default Menu;
