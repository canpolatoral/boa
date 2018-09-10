import React from 'react'; import PropTypes from 'prop-types';
import { getFrameworkMessage } from 'b-messaging';

var InfoCircle = require('b-icon').Actions.InfoCircle;

import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BCard } from 'b-card';
import { BLabel } from 'b-label';
import { BBusinessComponent } from 'b-business-component';
import { AuthorizedUserDialog } from 'b-authorized-user-dialog';
import { BTransactionForm } from 'b-transaction-form';
import { BFlexPanel } from 'b-flex-panel';
import { BRadioButtonGroup } from 'b-radio-button-group';
import { BLocalization } from 'b-localization';
import { BInformationText } from 'b-information-text';

@BComponentComposer
export class BSendApproveDialog extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceId: PropTypes.number,
    resourceCode: PropTypes.string,
    sendStateList: PropTypes.array,
    flowName: PropTypes.string,
    ownerWorkgroupId: PropTypes.number,
    transactionWorkGroupId: PropTypes.number,
    selectedStateIndex: PropTypes.string
  };
  dataSource: any[] = [];
  stateList: any[] = [];

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    selectedStateIndex: '0',
    resourceCode: 'IBLTONYGND'
  };

  state = {
    selectedStateIndex: this.props.selectedStateIndex,
  };
  /**
   * Creates an instance of SendApproveDialog.
   * @param {any} props
   * @memberof SendApproveDialog
   */
  constructor(props, context) {
    super(props, context);

    if (this.props.sendStateList) {
      this.props.sendStateList.forEach((item: any) => {
        this.dataSource.push({
          state: item.stateName,
          reason: this.getReasonString(item.saveStates),
          workgroup: item.workgroupName,
          duration: this.getDurationString(item.avgDuration)
        });
      });

      this.dataSource.forEach((item: any, index: number) => {
        this.stateList.push({
          label: this.generateStateInfo(item),
          value: index.toString(),
          iconStyle: { 'align-self': 'center' }, // ikonun ortalı olması için
          style: { 'margin-top': index > 0 ? '24px' : '0px' }

        });
      });
    }
  }

  /**
   * show send approve dialog
   *
   * @static
   * @param {any} context
   * @param {any} sendStateList
   * @param {any} flowName
   * @param {any} resourceId
   * @param {any} ownerWorkgroupId
   * @param {any} transactionWorkGroupId
   * @param {any} callBack
   * @memberof SendApproveDialog
   */
  static showApproveDialog(context, sendStateList, flowName, resourceId, ownerWorkgroupId, transactionWorkGroupId, callBack) {
    let dialog = (
      <BSendApproveDialog
        context={context}
        sendStateList={sendStateList}
        flowName={flowName}
        resourceId={resourceId}
        ownerWorkgroupId={ownerWorkgroupId}
        transactionWorkGroupId={transactionWorkGroupId} />
    );
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: 600, height: '60%' };
    }
    BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, getFrameworkMessage('BusinessComponents', 'WorkFlowSendApprove'), callBack, dialogStyle);
  }

  /**
   * actionClick
   *
   * @param {any} command
   * @memberof SendApproveDialog
   */
  actionClick(command) {
    switch (command.commandName) {
      case 'Ok':
        {
          this.close(BComponent.DialogResponse.YES);
          break;
        }
      case 'Cancel':
        {
          this.close(BComponent.DialogResponse.NO);
          break;
        }
      case 'Report':
        {
          var selectedObject = this.dataSource[BLocalization.getIntegerValue(this.state.selectedStateIndex)];
          if (selectedObject) {
            this.showAuthorizedUser(selectedObject);
          }
          break;
        }
    }
  }

  /**
   * getDialogStye
   *
   * @static
   * @param {any} context
   * @returns
   * @memberof SendApproveDialog
   */
  static getDialogStye(context) {
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: '600', height: '60%' };
    }
    return dialogStyle;
  }

  /**
   *
   *
   * @param {any} selected
   * @memberof SendApproveDialog
   */
  showAuthorizedUser(selected) {
    AuthorizedUserDialog.showAuthorizedUser(this.props.context, null, selected.state, this.props.resourceId, this.props.transactionWorkGroupId, this.props.ownerWorkgroupId);
  }

  /**
   *
   *
   * @param {any[]} saveStates
   * @returns
   * @memberof SendApproveDialog
   */
  getReasonString(saveStates: any[]) {
    var reason = '';
    if (saveStates) {
      reason = saveStates.toString();
    }
    return reason;
  }


  getDurationString(duration) {
    // TODO: Bu daha sonra dk ya çevrilecek.
    return duration + ' ' + this.getMessage('Deployment', 'Minute');
  }

  close(dialogResponse) {
    BDialogHelper.close(this, dialogResponse);
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  generateTextInfo(label, info) {
    if (info == '' || info == undefined) {
      info = '-';
    }

    var returnInfo =
      (
        <BFlexPanel
          alignment='left'
          direction='horizontal'
          alignItems='left'
          responsive={false}
          context={this.props.context}>
          {/* <BLabel context={this.props.context} style={labelStyle} text={label}></BLabel>
          <BLabel context={this.props.context} style={labelStyle} text=': '></BLabel>
          <BLabel context={this.props.context} style={infoStyle} text={info}></BLabel> */}
          <BInformationText context={this.props.context} labelText={label} infoText={info}></BInformationText>
        </BFlexPanel>
      );
    return returnInfo;
  }
  generateStateInfo(state) {
    var tmpState =
      (
        <BFlexPanel alignment='left'
          direction='vertical'
          alignItems='left'
          responsive={false}
          context={this.props.context}>
          {this.generateTextInfo(this.getMessage('BusinessComponents', 'Status'), state.state)}
          {this.generateTextInfo(this.getMessage('BusinessComponents', 'SaveStateName'), state.reason)}
          {this.generateTextInfo(this.getMessage('BusinessComponents', 'BusinessUnit'), state.workgroup)}
          {this.generateTextInfo(this.getMessage('BusinessComponents', 'AverageTime'), state.duration)}
        </BFlexPanel>
      );
    return tmpState;
  }

  onStateChange(event, newSelection) {
    this.state.selectedStateIndex = newSelection.toString();
  }


  render() {
    let iconStyle;
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      iconStyle = { height: 36, width: 36, marginRight: 16 };
    }
    else {
      iconStyle = { height: 48, width: 48, marginRight: 16 };
    }
    return (
      <BTransactionForm
        ref={r => this.form = r}
        {...this.props}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.actionClick.bind(this)}
        onClosing={this.handleClose.bind(this)}
        cardSectionThresholdColumn={1}
        cardSectionThresholdWidth={isMobileOrTablet ? undefined : 600}
      >

        <BCard context={this.props.context}>
          <BFlexPanel alignment='left'
            direction='horizontal'
            alignItems='center'
            responsive={false}
            context={this.props.context}>
            <InfoCircle style={iconStyle}
              context={this.props.context}
              nativeColor={this.props.context.theme.boaPalette.info500}  >
            </InfoCircle>
            <BLabel context={this.props.context}
              text={this.props.flowName + ' ' + this.getMessage('BusinessComponents', 'TransactionWillGoToApprove')} // TODO: TransactionSentToApprove:onaya gönderildi
              style={{ 'font-size': 16 }} >
            </BLabel>
          </BFlexPanel>
        </BCard>
        <BCard context={this.props.context}
          expandable={false}
          title={this.getMessage('BusinessComponents', 'StatesToBeSentToApproval')}
          // style={{ 'display': 'block', paddingBottom: '48px', paddingTop:24 }}
        >
          <div style={{marginTop:50, marginBottom:40}}>
            <BRadioButtonGroup context={this.props.context}
              // defaultSelected={'0'}
              items={(this.stateList == undefined) ? [] : this.stateList}
              valueSelected={this.state.selectedStateIndex}
              name='radioState'
              labelPosition='right'
              onChange={this.onStateChange.bind(this)} />
          </div>
        </BCard>
      </BTransactionForm>
    );
  }
}
export default BSendApproveDialog;
