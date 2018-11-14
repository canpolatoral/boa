import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import RightArrow from '@material-ui/icons/KeyboardArrowRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import { Popover } from '@boa/components/Popover';
import { ComponentBase, ComponentComposer } from '@boa/base'; //
import { MenuItem } from '@boa/components/MenuItem';
import { Icon } from '@boa/components/Icon';

/* eslint-disable no-unused-vars */
const styles = theme => ({
  menuItem: {},
  primary: {},
  icon: {},
});
/* eslint-enable no-unused-vars */
@ComponentComposer
@withStyles(styles)
class IconMenu extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    /**
     * Type of the `IconButton` to render.
     */
    anchorOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
      vertical: PropTypes.oneOf(['top', 'center', 'bottom']).isRequired,
    }),

    /*
     * to set origin from outside
     */
    animated: PropTypes.bool,

    /**
     * Custom icon for 'IconButton' to render.
     */
    classes: PropTypes.object.isRequired,

    /**
     * Item list
     *
     */
    className: PropTypes.string,

    /**
     * Menu item list
     *
     */
    customIcon: PropTypes.object,

    /**
     * This is the point on the icon where the menu
     * `targetOrigin` will attach.
     * Options:
     * vertical: [top, middle, bottom]
     * horizontal: [left, center, right].
     */
    iconStyle: PropTypes.object,

    iconType: PropTypes.oneOf(['vertical', 'horizontal', 'custom']).isRequired,
    /**
     * If true, the popover will apply transitions when
     * it gets added to the DOM.
     */
    isOriginSetted: PropTypes.bool,

    /**
     * @ignore
     */
    items: PropTypes.array,

    /**
     * Override the inline-styles of the underlying icon element.
     */
    menuItems: PropTypes.array,

    /**
     * Override the inline-styles of the menu element.
     */
    menuStyle: PropTypes.object,

    /**
     * If true, the value can an be array and allow the menu to be a multi-select.
     */
    multiple: PropTypes.bool,

    /**
     * If true, the `IconMenu` is opened.
     */
    onChange: PropTypes.func,

    /**
     * Override the inline-styles of the root element.
     */
    onClick: PropTypes.func,

    /**
     * This is the point on the menu which will stick to the menu
     * origin.
     * Options:
     * vertical: [top, middle, bottom]
     * horizontal: [left, center, right].
     */
    open: PropTypes.bool,

    /**
     * Sets the delay in milliseconds before closing the
     * menu when an item is clicked.
     * If set to 0 then the auto close functionality
     * will be disabled.
     */
    style: PropTypes.object,

    /**
     * If true, the popover will render on top of an invisible
     * layer, which will prevent clicks to the underlying elements.
     */
    targetOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
      vertical: PropTypes.oneOf(['top', 'center', 'bottom']).isRequired,
    }),

    /* Callback function fired when the menu item is selected */
    touchTapCloseDelay: PropTypes.number,

    /* Callback function fired when the IconButton element is clicked */
    transformOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
      vertical: PropTypes.oneOf(['top', 'center', 'bottom']).isRequired,
    }),

    useLayerForClickAway: PropTypes.bool,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    iconType: 'vertical',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    animated: true,
    multiple: false,
    open: null,
    targetOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    touchTapCloseDelay: 200,
    useLayerForClickAway: false,
    menuStyle: { minWidth: '240px' },
  };

  state = {
    value: '',
    anchorEl: null,
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
  }

  onChange(parameters) {
    if (parameters) {
      this.setState({ value: parameters.value });
      if (this.props.onChange) {
        this.props.onChange(parameters);
      }
      this.handleClose();
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    let menuItems = [];

    if (this.props.menuItems) {
      menuItems = this.props.menuItems.map(item => {
        return React.cloneElement(item, {
          onTouchTap: () => {
            if (!item.props.menuItems) this.handleClose();
          },
        });
      });
    } else if (this.props.items) {
      menuItems = this.props.items.map(item => {
        let rightIcon;
        if (item.items && item.items.length) {
          rightIcon = <RightArrow />;
        } else if (item.rightIcon && (item.rightIcon.fontIcon || item.rightIcon.svgIcon)) {
          Icon.getIcon(item.rightIcon);
        }

        let leftIcon;
        if (item.leftIcon && (item.leftIcon.fontIcon || item.leftIcon.svgIcon)) {
          leftIcon = Icon.getIcon(item.leftIcon);
        }

        return (
          <MenuItem
            className={this.props.classes.menuItem}
            context={this.props.context}
            key={item.value}
            value={item.value}
            primaryText={item.text}
            items={item.items}
            rightIcon={rightIcon}
            leftIcon={leftIcon}
            itemSelected={this.onChange}
          />
        );
      });
    }

    let icon = <MoreVertIcon />;
    switch (this.props.iconType) {
      case 'horizontal':
        icon = <MoreHorizIcon />;
        break;
      case 'custom':
        icon = this.props.customIcon;
        break;
      default:
        icon = <MoreVertIcon />;
        break;
    }

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          style={this.props.iconStyle}
          onClick={this.handleClick}
        >
          {icon}
        </IconButton>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={this.state.anchorEl}
          anchorOrigin={this.props.anchorOrigin} // For Popover
          transformOrigin={this.props.transformOrigin}
          onRequestClose={this.handleClose}
        >
          <MenuList
            style={this.props.menuStyle}
            multiple={this.props.multiple}
            value={this.state.value}
          >
            {menuItems}
          </MenuList>
        </Popover>
      </div>
    );
  }
}

export default IconMenu;
