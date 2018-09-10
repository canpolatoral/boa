import React from 'react';
import PropTypes from 'prop-types';

import { BComponent, BComponentComposer, Utils } from 'b-component';
import { BButton } from 'b-button';
import { BPopover } from 'b-popover';
import { BMenuItem } from 'b-menu-item';
import { BIcon, Actions } from 'b-icon';
import { MenuList } from '@material-ui/core';
import { BLocalization } from 'b-localization';
@BComponentComposer
export class BActionButton extends BComponent {
  static propTypes = {
    /**
     * Base properties from BComponent
     */
    ...BComponent.propTypes,
    /**
     * Each of action in resource action list.
     */
    action: PropTypes.object.isRequired,
    /**
     * If true, the element will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * Callback function fired when the element is clicked by the mouse.
     *
     * @param {object} event targeting the element.
     */
    onClick: PropTypes.func
  }

  static defaultProps = {
    /**
     * Default prop values from BComponent
     */
    ...BComponent.defaultProps,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      anchorEl: null,
      disabled: props.disabled
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({
        disabled: nextProps.disabled
      });
    }
  }

  setDisable(value) {
    this.setState({
      disabled: value
    });
  }

  onClick(action, event) {
    this.props.onClick && this.props.onClick(action);
    this.props.action.items && this.isOpen() ? this.close() : this.open(event);
  }

  onSubActionClick(action) {
    this.props.onClick && this.props.onClick(action);
    if (this.isOpen()) this.close();
  }

  isOpen() {
    return this.state.open;
  }

  close() {
    if (!this.state.open) {
      return;
    }
    this.setState({
      open: false
    });
  }

  open(event) {
    if (event) {
      this.setState({
        open: true,
        anchorEl: event.currentTarget,
      });
      event.preventDefault();
    }
  }

  handleRequestClose = (reason) => {
    this.close(reason);
  };

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.open(event);
  };

  render() {
    const that = this;
    let isMobile = Utils.isMobile(this.props);
    const {
      action
    } = this.props;

    const iconPath = Actions[action.iconPath] ? action.iconPath : 'None';
    const IconType = Actions[iconPath];
    const iconProps = {
      context: this.props.context,
      nativeColor: this.getIconColor(iconPath, this.state.disabled)
    };
    const icon = < IconType {...iconProps}
    />;

    let subActions = null;
    if (action.items) {
      let subActionMenus = action.items.map((subAction) => {
        const rightIcon = subAction.items && subAction.items.length > 0 ? BIcon.getIcon(this.props.context, {
          dynamicIcon: 'RightArrow'
        }) : null;

        const subActionIconPath = Actions[subAction.iconPath] ? subAction.iconPath : 'None';
        const SubActionIconType = Actions[subActionIconPath];
        const subActionProperties = {
          context: that.props.context,
          style: {
            color: that.getIconColor(subActionIconPath, that.state.disabled)
          }
        };
        const leftIcon = < SubActionIconType {...subActionProperties} />;
        const leftIconStyle =
          {
            marginLeft: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
            marginRight: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
            color: that.getIconColor(subActionIconPath, subAction.disabled)
          };
        // const key = action.resourceId + '_' + action.actionId;
        return (<
          BMenuItem context={that.props.context}
          key={subAction.actionId}
          value={subAction.actionId}
          primaryText={BLocalization.stringUpperCase(subAction.name)}
          items={subAction.items}
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          leftIconStyle={leftIconStyle}
          rightIconStyle={{ marginLeft: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24), marginRight: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24) }}
          primaryTextPadding={'0px 4px 0px 4px'}
          disabled={subAction.disabled}
          itemSelected={that.onSubActionClick.bind(that, subAction)}
        />
        );
      });
      subActions = (<BPopover context={this.props.context}
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        isOriginSetted={true}
        anchorOrigin={{
          horizontal: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
          vertical: 'top'
        }
        }
        targetOrigin={
        {
          horizontal: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
          vertical: 'top'
        }
        }
        onRequestClose={
          this.handleRequestClose
        }

      >
        <MenuList
          style={{
            background: this.props.context.theme.boaPalette.base10,
            paddingTop: 4
          }}
        >
          {subActionMenus}
        </MenuList>
      </BPopover>);
    }
    let buttonDivStyle = {
      direction: 'ltr',
      display: 'inline-block'
    };

    let buttonStyle = {
      fontWeight: 500,
      paddingLeft: isMobile ? 8 : 12,
      paddingRight: isMobile ? 8 : 12,
      height: 40
    };

    return (<
      div style={
        buttonDivStyle
      } >
      <
        BButton context={
          this.props.context
        }
        type='flat'
        text={
          this.props.action.name
        }
        icon={icon}
        onClick={
          this.onClick.bind(this, this.props.action)
        }
        disabled={
          this.state.disabled
        }
        iconProperties={{
          style: {
            marginRight: !this.props.context.localization.isRightToLeft ? 4 : 0,
            marginLeft: !this.props.context.localization.isRightToLeft ? 0 : 4
          }
        }}
        style={buttonStyle}
        textStyle={{
          fontWeight: 500,
          fontSize: 13,
          color: this.state.disabled ? this.props.context.theme.boaPalette.base250 : this.props.context.theme.boaPalette.base400
        }}
      />
      {subActions}
    </div>
    );
  }


  getIconColor(iconPath, disabled) {
    if (disabled)
      return this.props.context.theme.boaPalette.base250;

    switch (iconPath) {
      case 'Folder':
        return this.props.context.theme.boaPalette.more500;
      case 'Add':
      case 'ArrowUpward':
      case 'DocumentAdd':
      case 'Done':
      case 'FileDownload':
      case 'Refresh':
        return this.props.context.theme.boaPalette.success500;
      case 'ArrowDownward':
      case 'Delete':
      case 'DocumentRemove':
      case 'DoNotDisturbAlt':
      case 'Remove':
      case 'RemoveCircle':
      case 'Cancel':
        return this.props.context.theme.boaPalette.error500;
      case 'LockOpen':
        return this.props.context.theme.boaPalette.warning500;
      default:
        return this.props.context.theme.boaPalette.pri500;
    }
  }
}


export default BActionButton;
