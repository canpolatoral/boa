import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BLabel } from 'b-label';
import { BGridRow } from 'b-grid-row';
import { BIconButton } from 'b-icon-button';

export class StatusPanel extends BBusinessComponent {
  static propTypes = {
    panelMessages: PropTypes.array,
    accountNumber: PropTypes.number
  };

  MernisServiceUnHealty = 'Mernis servisi ile bağlantı sağlanamadı!';
  CustomAccountComponentDialogMessage = 'CustomAccountComponentDialogMessage';

  constructor(props, context) {
    super(props, context);
    this.state = {
      panelMessages: []
    };

    if (StatusPanel.StaticMessageList.length === 0) {
      this.FillDialogMessage();
    }
  }

  AddToDialogMessages(messageKey, icon) {
    let message = {};

    message.key = messageKey;
    message.icon = icon;

    StatusPanel.StaticMessageList.push(message);
  }

  FillDialogMessage() {
    let CustomerClassSpecial = <BIconButton style={this.getStyle().icon} dynamicIcon={'Info'} iconProperties={{ color: 'primary' }} />;
    let ContractWarn = <BIconButton style={this.getStyle().icon} dynamicIcon={'AccountBox'} iconProperties={{ color: 'primary' }} />;
    let YourBank = <BIconButton style={this.getStyle().icon} dynamicIcon={'AccountBalance'} iconProperties={{ color: 'primary' }} />;

    let CustomerAgreementVersionWarning = <BIconButton style={this.getStyle('#8bc34a').icon} dynamicIcon={'LibraryBooks'} />;

    let CustomerMernisVerificationError = <BIconButton style={this.getStyle('#e94236').icon} dynamicIcon={'SyncProblem'} />;
    let CustomerTaxNumberVerificationError = <BIconButton style={this.getStyle('#e94236').icon} dynamicIcon={'SyncProblem'} />;
    let CustomerIsDead = <BIconButton style={this.getStyle('#000000').icon} dynamicIcon={'Person'} />;
    let LegitimateProceedingWarning = <BIconButton style={this.getStyle('#424cb5').icon} dynamicIcon={'ChromeReaderMode'} />;
    let DoubleSignatureControlWarning = (
      <BIconButton style={this.getStyle().icon} dynamicIcon={'AccountBalance'} iconProperties={{ color: 'primary' }} />
    );
    let SharedAccountControlWarning1 = <BIconButton style={this.getStyle('#ff5722').icon} dynamicIcon={'PeopleOutline'} />;
    let SharedAccountControlWarning2 = <BIconButton style={this.getStyle('#ff8c00').icon} dynamicIcon={'People'} />;
    let EighteenAgeControlWarning = (
      <BIconButton style={this.getStyle().icon} dynamicIcon={'AccountBalance'} iconProperties={{ color: 'primary' }} />
    );
    let CustomerMernisRegistrationDateWarning2 = <BIconButton style={this.getStyle('#0299dc').icon} dynamicIcon={'Event'} />;
    let CustomerInBlackList = <BIconButton style={this.getStyle('#000000').icon} dynamicIcon={'AccountBalance'} />;
    let CustomerBranchAccountWarning = <BIconButton style={this.getStyle('#00a99d').icon} dynamicIcon={'Store'} />;
    let RecordingBranchIdWarning = <BIconButton style={this.getStyle('#00a99d').icon} dynamicIcon={'Store'} />;
    let CustomerBranchAccountBalanceWarning = <BIconButton style={this.getStyle('#00a99d').icon} dynamicIcon={'Store'} />;
    let HasAccountBalanceDisplayConstraintWarning = <BIconButton style={this.getStyle('#ffb800').icon} dynamicIcon={'VisibilityOff'} />;
    let NoSuffixFound = <BIconButton style={this.getStyle('#f15a24').icon} dynamicIcon={'ErrorOutline'} />;
    let EmailNotFound = <BIconButton style={this.getStyle('#666666').icon} dynamicIcon={'Mail'} />;
    let EmailNotActual = <BIconButton style={this.getStyle('#666666').icon} dynamicIcon={'Mail'} />;
    let MobilePhoneNotFound = <BIconButton style={this.getStyle('#666666').icon} dynamicIcon={'StayCurrentPortrait'} />;
    let MobilePhoneNotActual = <BIconButton style={this.getStyle('#666666').icon} dynamicIcon={'StayCurrentPortrait'} />;
    let AccountNote_2 = <BIconButton style={this.getStyle('#ffb800').icon} dynamicIcon={'Chat'} />;

    // let EventError = <BIconButton {socialIcon} />;
    // let UserRedInfo =<BIconButton {socialIcon} />;
    // let UserBlack = <BIconButton {socialIcon} />;
    // let CustomerInfo = <BIconButton {socialIcon} />;
    // let UserGroupEdit = <BIconButton {socialIcon} />;
    // let UserGroupDesign = <BIconButton {socialIcon} />;
    // let UserGroupError = <BIconButton {socialIcon} />;
    // let Eighteen = <BIconButton {socialIcon} />;
    // let UserUnknown = <BIconButton {socialIcon} />;
    // let UserBlackList = <BIconButton {socialIcon} />;
    let Info = <BIconButton style={this.getStyle().icon} dynamicIcon={'Info'} iconProperties={{ color: 'primary' }} />;
    // let BranchInfo = <BIconButton {socialIcon} />;
    // let EyeBlock = <BIconButton {socialIcon} />;
    // let FindError = <BIconButton {socialIcon} />;
    // let Email = <BIconButton {socialIcon} />;
    // let SmartPhone = <BIconButton {socialIcon} />;
    // let Notes = <BIconButton {socialIcon} />;

    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'CustomerSpecialClass'), CustomerClassSpecial, true, 0);
    this.AddToDialogMessages(
      this.getMessage('BusinessComponents', 'CustomerAgreementVersionWarning'),
      CustomerAgreementVersionWarning,
      true,
      0
    );
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'CustomerYourBank'), YourBank, true, 0);
    this.AddToDialogMessages(this.MernisServiceUnHealty, ContractWarn, true, 0);
    this.AddToDialogMessages(this.getMessage('BOA', 'CustomerMernisVerificationError'), CustomerMernisVerificationError, true, 0);
    this.AddToDialogMessages(this.getMessage('BOA', 'CustomerTaxNumberVerificationError'), CustomerTaxNumberVerificationError, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'CustomerIsDead'), CustomerIsDead, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'LegitimateProceedingWarning'), LegitimateProceedingWarning, true, 0);
    this.AddToDialogMessages(
      this.getMessage('BusinessComponents', 'DoubleSignatureControlWarning'),
      DoubleSignatureControlWarning,
      true,
      0
    );
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'SharedAccountControlWarning1'), SharedAccountControlWarning1, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'SharedAccountControlWarning2'), SharedAccountControlWarning2, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'EighteenAgeControlWarning'), EighteenAgeControlWarning, true, 0);
    this.AddToDialogMessages(
      this.getMessage('BusinessComponents', 'CustomerMernisRegistrationDateWarning2'),
      CustomerMernisRegistrationDateWarning2,
      true,
      0
    );
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'CustomerInBlackList'), CustomerInBlackList, false, 0);
    this.AddToDialogMessages(this.CustomAccountComponentDialogMessage, Info, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'CustomerBranchAccountWarning'), CustomerBranchAccountWarning, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'RecordingBranchIdWarning'), RecordingBranchIdWarning, true, 0);
    this.AddToDialogMessages(
      this.getMessage('BusinessComponents', 'HasAccountBalanceDisplayConstraintWarning'),
      HasAccountBalanceDisplayConstraintWarning,
      true,
      0
    );
    this.AddToDialogMessages(
      this.getMessage('BusinessComponents', 'CustomerBranchAccountBalanceWarning'),
      CustomerBranchAccountBalanceWarning,
      true,
      0
    );
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'NoSuffixFound'), NoSuffixFound, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'EmailNotFound'), EmailNotFound, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'EmailNotActual'), EmailNotActual, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'MobilePhoneNotFound'), MobilePhoneNotFound, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'MobilePhoneNotActual'), MobilePhoneNotActual, true, 0);
    this.AddToDialogMessages(this.getMessage('BusinessComponents', 'AccountNote_2'), AccountNote_2, true, 130);
  }

  FillMessagesToStackPanel() {
    let defaultMessages = StatusPanel.StaticMessageList;
    let customerMessages = this.props.panelMessages || [];
    let messagesToDisplay = [];
    customerMessages.forEach(item => {
      let errorCode = item.errorCode;
      if (!errorCode) {
        errorCode = item.message;
      }
      let message = undefined;
      if (errorCode) {
        errorCode = errorCode.replace('BusinessComponents.', '');
        errorCode = errorCode.replace('BOA.', '');
        if (errorCode.indexOf('#')) {
          errorCode = errorCode.slice(errorCode.indexOf('#') + 1, errorCode.length);
        }
        let m = defaultMessages.find(s => s.key === errorCode);
        if (m) {
          message = { icon: m.icon, message: item.message };
        } else {
          let s = defaultMessages.find(s => s.key.includes(errorCode));
          if (s) {
            message = { icon: s.icon, message: item.message };
          }
        }
      }
      if (!message) {
        let m = defaultMessages.find(s => s.key === this.CustomAccountComponentDialogMessage);
        message = { icon: m.icon, message: item.message };
      }

      messagesToDisplay.push(message);
    });

    this.setState({ panelMessages: messagesToDisplay });
  }

  componentDidMount() {
    this.FillMessagesToStackPanel(false);
  }

  render() {
    let { context, accountNumber } = this.props;
    let messages = this.state.panelMessages || [];
    let style = this.getStyle();

    let icons = messages.map(item => {
      return <BIconButton {...item.icon.props} tooltipPosition="top" tooltip={item.message} />;
    });

    return (
      <BGridRow context={context} columnCount={1}>
        <div style={style.divider}>
          <BLabel ref={r => (this.panel = r)} context={context} text={accountNumber} style={style.accountNumber} />
          {icons}
        </div>
      </BGridRow>
    );
  }

  getStyle(color) {
    let _color = color || this.props.context.theme.boaPalette.obli500;
    const accountNumber = {
      color: _color,
      display: 'inline-block',
      fontSize: '14px',
      lineHeight: '24px',
      height: '24px',
      verticalAlign: 'middle',
      marginRight: '12px'
    };

    const divider = {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: this.props.context.theme.boaPalette.base200,
      paddingTop: '20px',
      height: '36px',
      marginRight:'-24px',
      marginLeft: '-24px',
      paddingLeft: '24px',
      paddingRight: '24px'
    };

    const icon = {
      padding: '0px',
      width: '24px',
      height: '24px',
      marginRight: '8px',
      color: _color
    };

    return {
      accountNumber,
      divider,
      icon
    };
  }
}

StatusPanel.StaticMessageList = [];
export default StatusPanel;
