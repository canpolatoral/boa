import React from 'react'; import PropTypes from 'prop-types';
import { getFrameworkMessage } from 'b-messaging';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BCard } from 'b-card';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCheckBox } from 'b-check-box';
import { BInput } from 'b-input';
@BComponentComposer
export class BPMActionReasonDialog
  extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceId: PropTypes.number,
    resourceCode: PropTypes.string,
    actionReasonList: PropTypes.array
  };
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'ISATACTRES'
  };
  checkBoxList: any[] = [];
  inputList: any[] = [];
  generatedReasonList: any[] = [];
  constructor(props, context) {
    super(props, context);
  }

  static showActionReasonDialog(context, list, callBack) {

    let dialog = (
      <BPMActionReasonDialog
        context={context}
        actionReasonList={list}
      />
    );
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: 600, height: '60%' };
    }
    BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, getFrameworkMessage('BusinessComponents', 'ActionReason'), callBack, dialogStyle);
  }

  actionClick(command) {
    switch (command.commandName) {
      case 'Ok':
        {
          var success = true;
          var returnList = [];
          this.checkBoxList.forEach((element, index) => {
            // TODO: diğer seçildiğinde açıklama zorunlu
            if (element.getInstance().getValue()) {
              var activeReason = {};
              if (this.props.actionReasonList.length == index) {
                activeReason.description = this.inputList[index].getInstance().getValue();
                activeReason.reasonCode = '-1';
                if ((activeReason.description == undefined || activeReason.description == '')) {
                  this.setState({ errorOther: this.getMessage('BusinessComponents', 'PleaseEnterADescription') });
                  success = false;
                }
              }
              else {
                activeReason = this.props.actionReasonList[index];
                activeReason.description = this.inputList[index].getInstance().getValue();
              }
              returnList.push(activeReason);
            }

          }, this);
          if (success)
            this.close(BComponent.DialogResponse.YES, returnList);
          break;
        }
    }
  }
  close(dialogResponse, data) {
    BDialogHelper.close(this, dialogResponse, data);
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  generateReasonList(list) {
    var checkList = [];
    list.forEach((element, index) => {
      checkList.push(this.generateReason(element, index));
    }, this);
    var otherReason = { reasonName: this.getMessage('BusinessComponents', 'Other'), reasonCode: '-1' };
    checkList.push(this.generateReason(otherReason, checkList.length));
    return checkList;
  }

  generateReason(reason, index) {
    var tmpReason =
      (
        <div>
          <BCheckBox context={this.props.context}
            ref={r => this.checkBoxList[index] = r}
            label={reason.reasonName}
            defaultChecked={false}
            key={reason.reasonCode + '_1'}
            onCheck={(e, isInputChecked) => this.onChecked(isInputChecked, index)}
          />
          <div style={{marginLeft:48}}>
            <BInput context={this.props.context}
              ref={r => this.inputList[index] = r}
              floatingLabelText={this.getMessage('BusinessComponents', 'Description')}
              key={reason.reasonCode + '_2'}
              onChange={reason.reasonCode == '-1' ? () => { this.setState({ errorOther: '' }); } : null}
              errorText={reason.reasonCode == '-1' ? this.state.errorOther : null}
              isVisible={this.state['isVisible_' + index] == undefined ? false : this.state['isVisible_' + index]}
            />
          </div>
        </div>
      );
    return tmpReason;
  }

  onChecked(isInputChecked, index) {
    this.setState({ ['isVisible_' + index]: isInputChecked }, () => {
      if (isInputChecked && this.inputList[index]) {
        this.inputList[index].getInstance().focus();
      }
    });
  }

  render() {
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    if (this.props.actionReasonList) {
      this.generatedReasonList = this.generateReasonList(this.props.actionReasonList);
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
        <BCard
          title={this.getMessage('BusinessComponents', 'ActionReason')}
          context={this.props.context}>
          {this.generatedReasonList}
        </BCard>
      </BTransactionForm>
    );
  }
}

export default BPMActionReasonDialog;
