import React from 'react'; import PropTypes from 'prop-types';
import { getFrameworkMessage } from 'b-messaging';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BBrowseForm } from 'b-browse-form';
@BComponentComposer
export class BPMActionReasonList
  extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceId: PropTypes.number,
    resourceCode: PropTypes.string,
    instanceId: PropTypes.number
  };
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'ISATACTRES'
  };

  constructor(props, context) {
    super(props, context);

  }

  static showActionReasonList(context, instanceId, callBack) {

    let dialog = (
      <BPMActionReasonList
        context={context}
        instanceId={instanceId}
      />
    );
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: '75%', height: '75%' };
    }
    BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, getFrameworkMessage('BusinessComponents', 'ActionReason'), callBack, dialogStyle);
  }

  getColumns() {
    return [
      { key: 'stateName', name: this.getMessage('Workflow', 'WFLStartDate') },
      { key: 'userName', name: this.getMessage('Workflow', 'TransactionDate') },
      { key: 'insertDate', name: this.getMessage('Workflow', 'WFLFormName'), type: 'date' },
      { key: 'actionName', name: this.getMessage('Workflow', 'TransactionType_7') },
      { key: 'reasonName', name: this.getMessage('Workflow', 'WFLCurrentStateName'), width: 250 },
      { key: 'reasonDescription', name: this.getMessage('Workflow', 'WFLMainBranchName'), width: 300 }
    ];
  }

  componentDidMount() {
    super.componentDidMount();

    this.getActionReason();
  }

  actionClick(command) {
    switch (command.commandName) {
      case 'Ok':
        {
          this.close(BComponent.DialogResponse.YES);
          break;
        }
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetActionReason':
        if (response.success) {
          this.form.getInstance().hideProgress();
          this.state.isDataLoaded = true;

          if (response.value) {
            this.setState({
              columns: this.getColumns(),
              dataSource: response.value
            });
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;

      default:
        break;
    }
  }

  getActionReason() {
    this.form.getInstance().showProgress();
    let proxyRequest = {
      requestClass: 'BOA.Types.Workflow2.ActionReasonRequest',
      requestBody: {
        methodName: 'GetActionReason',
        instanceId: this.props.instanceId,
        resourceId: this.props.resourceInfo.id,
        actionId: 11,
        fromTransactionalExecute: true
      },
      key: 'GetActionReason'
    };
    this.form.getInstance().showProgress();
    this.proxyExecute(proxyRequest);
  }

  close(dialogResponse, data) {
    BDialogHelper.close(this, dialogResponse, data);
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  render() {

    return (
      <BBrowseForm
        {...this.props}
        ref={r => this.form = r}
        resourceInfo={this.props.resourceInfo}
        inDialog={true}
        onActionClick={this.actionClick.bind(this)}
        onClosing={this.handleClose.bind(this)}
        columns={this.state.columns}
        dataSource={this.state.dataSource}
        selectable={'none'}
        >
      </BBrowseForm>
    );
  }
}

export default BPMActionReasonList;
