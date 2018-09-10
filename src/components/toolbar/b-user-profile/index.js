import React from 'react';
import PropTypes from 'prop-types';

import { BComponent, BComponentComposer } from 'b-component';
import { BPopover } from 'b-popover';
import { BDivider } from 'b-divider';
import { BMenuItem } from 'b-menu-item';
import { BButton } from 'b-button';
import { BInformationText } from 'b-information-text';
import _ from 'lodash';
import { BDialogHelper } from 'b-dialog-box';

@BComponentComposer
export class BUserProfile extends BComponent {
  static propTypes = {
    /**
    * Base properties from BComponent
    */
    ...BComponent.propTypes,
    /**
    * The event to handle user profile popover window closed.
    */
    onClose: PropTypes.func,

    isChangeUserVisible: PropTypes.bool
  };

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps,
    isChangeUserVisible: false
  }

  state = {
    openUserProfileMenu: false,
    popoverDesktopStyle: {
      position: 'absolute',
      top: '66px',
      right: !this.props.context.localization.isRightToLeft ? '30px' : 'auto',
      left: !this.props.context.localization.isRightToLeft ? 'auto' : '30px',
      maxWidth: '388px',
      width: '320px',
      minHeight: '380px',
      maxheight: '540px',
      transformOrigin: 'top right 0px',
      zIndex: 10000
    },
    popoverMobileStyle: {
      position: 'absolute',
      maxWidth: '100%',
      width: 'calc(100% - 16px)',
      height: 'calc(100% - 16px)',
      maxHeight: 'calc(100% - 24px)',
      margin: '8px',
      zIndex: 10000
    }
  };

  constructor(props, context) {
    super(props, context);
    this.closeUserProfileMenuClick = this.closeUserProfileMenuClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.context !== this.props.context) ||
      (nextState.openUserProfileMenu !== this.state.openUserProfileMenu);
  }

  openUserProfileMenu() {
    this.setState((prevState) => {
      return { openUserProfileMenu: !prevState.openUserProfileMenu };
    });
  }

  closeUserProfileMenuClick() {
    this.setState((prevState) => {
      return { openUserProfileMenu: !prevState.openUserProfileMenu };
    });
    this.props.onClose();
  }

  changeUser() {
    BDialogHelper.show(this.props.context, 'Bu özellik şu anda kullanılmamaktadır', BComponent.DialogType.INFO);
  }

  logOut() {
    BDialogHelper.show(this.props.context, 'Bu özellik şu anda kullanılmamaktadır', BComponent.DialogType.INFO);
  }

  render() {
    let isRightToLeft = this.props.context.localization.isRightToLeft;
    let popoverStyle = {};
    let headerIcon = <div></div>;
    let footerIcon = <div></div>;
    let anchorOrigin = {};
    let transformOrigin = {};

    let primaryButtonStyle = { color: this.props.context.theme.boaPalette.pri500, padding: '8px 8px'};
    let secondaryButtonStyle = { color: this.props.context.theme.boaPalette.obli500, padding: '8px 8px' };

    
    primaryButtonStyle = _.merge(primaryButtonStyle, this.props.context.theme.changeUser);
    secondaryButtonStyle = _.merge(secondaryButtonStyle, this.props.context.theme.logOut);
    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      popoverStyle = this.state.popoverDesktopStyle;
      anchorOrigin = { horizontal: !isRightToLeft ? 'left' : 'right', vertical: 'top' };
      transformOrigin = { horizontal: isRightToLeft ? 'left' : 'right', vertical: 'top' };
      footerIcon = <div>
        <BDivider context={this.props.context} style={{ margin: '6px 0px' }} />
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
      </div>;
    }
    else {
      popoverStyle = this.state.popoverMobileStyle;
      transformOrigin = { horizontal: !isRightToLeft ? 'right' : 'left', vertical: 'bottom' };
      headerIcon = <div>
        <BMenuItem
          primaryText={this.props.context.applicationContext.user.name}
          leftIcon={isRightToLeft ?
            <BButton context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 4px 0 0', padding: '0px' }}
              dynamicIcon='Close' />
            :
            <BButton context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 0 0 4px', padding: '0px' }}
              dynamicIcon='ArrowBack' />
          }
          itemSelected={this.openUserProfileMenu.bind(this)}
          context={this.props.context}
          rightIcon={!isRightToLeft ?
            <BButton context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 4px 0 0', padding: '0px' }}
              dynamicIcon='Close' />
            :
            <BButton context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 0 0 4px', padding: '0px' }}
              dynamicIcon='ArrowForward' />
          }
          primaryTextPadding={'0px 24px 0px 4px'}
        />
        {/* <BMenuItem
          primaryText={this.props.context.applicationContext.user.name}
          context={this.props.context}
          itemSelected={this.closeUserProfileMenuClick}
          leftIcon={
            <BButton
              context={this.props.context}
              type='icon'
              iconProperties={{ style: { color: 'grey' } }}
              style={{ margin: '10px 12px', padding: '0px' }}
              dynamicIcon='NavigationArrowBack'
            />}
        /> */}
        <BDivider context={this.props.context} style={{ margin: '0px' }} />
      </div>;
    }

    return (
      <BPopover
        anchorReference={'anchorPosition'}
        anchorPosition={this.props.context.localization.isRightToLeft ? { top: 0, left: 0, } : { top: 0, left: 320, }}

        PaperProps={{
          style: {
            maxWidth: '100%',
            width: '100%',
          },
        }}
        marginThreshold='0'
        style={popoverStyle}
        context={this.props.context}
        isOriginSetted={true}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        open={this.state.openUserProfileMenu}
        onRequestClose={this.closeUserProfileMenuClick}>
        {headerIcon}
        <div style={{ margin: this.props.context.deviceSize >= BComponent.Sizes.MEDIUM ? '20px 24px 12px' : '20px 16px 12px' }}>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'User')} infoText={this.props.context.applicationContext.user.name}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'Email')} infoText={this.props.context.applicationContext.user.email}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'UserName')} infoText={this.props.context.applicationContext.user.userName}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'UserId')} infoText={this.props.context.applicationContext.user.userid}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'RoleName')} infoText={this.props.context.applicationContext.user.roleName.split('.')[0].trim()}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'Group')} infoText={this.props.context.applicationContext.user.defaultWorkGroup.name}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'Branch')} infoText={this.props.context.applicationContext.user.branchName}></BInformationText>
        </div>
        {footerIcon}
      </BPopover>
    );
  }
}

export default BUserProfile;
