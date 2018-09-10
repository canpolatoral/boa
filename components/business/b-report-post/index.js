import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BCard } from 'b-card';
import { BTransactionForm } from 'b-transaction-form';
import { BInput } from 'b-input';
import { BCheckBox } from 'b-check-box';
import { BFormManager } from 'b-form-manager';
import { BRadioButtonGroup } from 'b-radio-button-group';
import { BAccessPointBrowser } from 'b-access-point-browser';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';
import { BConst } from 'b-const';
import { ScheduleReportContract, TimeScheduleContract } from './model';
import ScheduleComponent from './scheduleComponent';

interface state {
  dataContract: ScheduleReportContract;
  timeScheduleContract: TimeScheduleContract;
}

@BComponentComposer
export class BReportPost extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    postmanId: PropTypes.number
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLTRPTPST',
    postmanId: 350,
    activeReportReportId: null,
    activeReportResourceId: null,
    dataContract: null, // ScheduleReportContract
    isPostman: true,
    postmanRequest: null
  };

  state: state;

  constructor(props, context) {
    super(props, context);
    let dataContract: ScheduleReportContract = this.props.dataContract || { scheduleType: 1, isEnable: 1, postmanId: this.props.postmanId };
    this.state = {
      sendType: '1', // SendPersonAndGroups
      dataContract: dataContract,
      ownerUserAccessPointIds: [],
      currentUserAccessPointIds: []
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.getUserAccessPoint(this.props.context.applicationContext.user.userName, value => {
      this.setState({ currentUserAccessPointIds: [value] });
    });

    let dataContract: ScheduleReportContract = this.state.dataContract || {};
    if (dataContract.ownerUsername) {
      this.getUserAccessPoint(dataContract.ownerUsername, value => {
        this.setState({ ownerUserAccessPointIds: [value] });
      });
    }

    if (!this.props.isPostman) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('DWH', 'UpdateReportIsActive'),
        BComponent.DialogType.WARNING,
        BComponent.DialogResponseStyle.OK
      );
    }
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  showProgress() {
    this.transactionForm && this.transactionForm.showProgress();
  }

  hideProgress() {
    this.transactionForm && this.transactionForm.hideProgress();
  }

  controlSchedule() {
    let scheduleComponent = this.scheduleComponent.getInstance();
    let timeScheduleContract: TimeScheduleContract = scheduleComponent.getValue();
    let dataContract = this.state.dataContract;
    if (
      timeScheduleContract.beginDate == null ||
      timeScheduleContract.endDate == null ||
      timeScheduleContract.scheduleType < 0 ||
      !this.state.dataContract.emailSubject
    ) {
      return false;
    }
    if (this.state.sendType == '1' && !dataContract.sendUserAccessPoint) {
      return false;
    }
    return true;
  }

  validate() {
    let scheduleComponent = this.scheduleComponent.getInstance();
    let timeScheduleContract: TimeScheduleContract = scheduleComponent.getValue();

    if (!this.controlSchedule()) {
      BFormManager.showStatusMessage(this.getMessage('DWH', 'FillRequiredFields'));
      return false;
    }

    let validate = scheduleComponent.validate();
    if (!validate.returnValue) {
      BFormManager.showStatusMessage(validate.errorMessage);
      return false;
    }

    if (timeScheduleContract.beginDate > timeScheduleContract.endDate) {
      BFormManager.showStatusMessage(this.getMessage('DWH', 'CanNotBeGreaterThanEndTime'));
      return false;
    }

    return true;
  }

  objectToByte(obj) {
    if (!obj) return [];
    let str = JSON.stringify(obj);
    var myBuffer = [];
    var buffer = new Buffer(str, 'utf16le');
    for (var i = 0; i < buffer.length; i++) {
      myBuffer.push(buffer[i]);
    }
    console.log(myBuffer);
    return myBuffer;
  }

  setOwnerUsername() {
    this.showProgress();
    let id = this.ownerUserAccessPoint.getInstance().getValue();
    if (id) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.BoaUserListRequest',
        requestBody: {
          accessPointIdList: id,
          methodName: 'GetUserListOfAccessPointByAccessPointList'
        },
        params: {}
      };
      this.proxyExecute(proxyRequest);

      proxyRequest.params.get = response => {
        this.hideProgress();
        let userList: Array<any> = response.value;
        if ((userList || []).length == 1) {
          let dataContract: ScheduleReportContract = this.state.dataContract;
          dataContract.ownerUsername = userList[0].userCode;
          this.setState({ ownerUserAccessPointIds: id });
        }
      };
    }
  }

  getUserAccessPoint(username: string, callback) {
    this.showProgress();
    let proxyRequest = {
      requestClass: 'BOA.Types.DWH.Report.ScheduleReportRequest',
      requestBody: {
        dataContract: { ownerUsername: username },
        methodName: 'GetUserAccessPoint'
      },
      params: {}
    };
    this.proxyTransactionExecute(proxyRequest);

    proxyRequest.params.get = response => {
      this.hideProgress();
      if (!response.success) {
        BDialogHelper.showError(
          this.props.context,
          this.getMessage('DWH', 'ErrorTaken'),
          response.results,
          BComponent.DialogType.ERROR,
          BComponent.DialogResponseStyle.OK
        );
      } else {
        callback && callback(response.value || []);
      }
    };
  }

  deletePostman(postmanId: number) {
    let msg = this.getMessage('DWH', 'SureDelete');
    let context = this.props.context;
    BDialogHelper.show(context, msg, BComponent.DialogType.QUESTION, BComponent.DialogResponseStyle.YESNO, '?', dialogResponse => {
      if (dialogResponse === BComponent.DialogResponse.YES) {
        this.showProgress();
        let proxyRequest = {
          requestClass: 'BOA.Types.DWH.Report.ScheduleReportRequest',
          requestBody: {
            dataContract: { postmanId: postmanId },
            methodName: 'DeleteReportSchedule'
          },
          params: {}
        };
        this.proxyTransactionExecute(proxyRequest);

        proxyRequest.params.get = response => {
          this.hideProgress();
          if (!response.success) {
            BDialogHelper.showError(
              this.props.context,
              this.getMessage('DWH', 'ErrorWhenDelete'),
              response.results,
              BComponent.DialogType.ERROR,
              BComponent.DialogResponseStyle.OK
            );
          } else {
            BFormManager.showStatusMessage(this.getMessage('DWH', 'Deleted'));
            BDialogHelper.close(this, BComponent.DialogResponse.OK);
          }
        };
      }
    });
  }

  saveCommand() {
    let scheduleComponent = this.scheduleComponent.getInstance();
    let timeScheduleContract: TimeScheduleContract = scheduleComponent.getValue();
    let request = { dataContract: this.state.dataContract };
    let isNew = this.state.dataContract.postmanId > 0 ? true : false;

    if (!this.validate()) return;

    this.showProgress();
    scheduleComponent.setDateList(timeScheduleContract, responseDate => {
      if (!responseDate.success) {
        this.hideProgress();
        return;
      }

      let tempDateList = [];
      let dateList = responseDate.value || [];
      dateList.forEach((date: Date) => {
        let _date = new Date(date);
        _date.setHours(timeScheduleContract.beginDate.getHours());
        _date.setMinutes(timeScheduleContract.beginDate.getMinutes());
        tempDateList.push(_date);
      });

      if (isNew) {
        request.methodName = 'InsertReportSchedule';
        request.dataContract.ownerUsername = this.props.context.applicationContext.user.userName;
      } else {
        request.methodName = 'UpdateReportSchedule';
      }
      request.dataContract.dateList = tempDateList;
      request.dataContract.isSystem = false;
      request.dataContract.beginDate = timeScheduleContract.beginDate;
      request.dataContract.endDate = timeScheduleContract.endDate;
      request.dataContract.startTime = timeScheduleContract.beginDate.getHours() + ':' + timeScheduleContract.beginDate.getMinutes();
      request.dataContract.scheduleType = timeScheduleContract.period;
      request.dataContract.schedulePeriodType = timeScheduleContract.periodDetail;
      request.dataContract.scheduleParameter1 = timeScheduleContract.parameter1;
      request.dataContract.scheduleParameter2 = timeScheduleContract.parameter2;
      request.dataContract.scheduleParameter3 = timeScheduleContract.parameter3;
      request.dataContract.scheduleParameter4 = timeScheduleContract.parameter4;
      request.dataContract.ownerUsername = this.props.context.applicationContext.user.userName;
      request.dataContract.reportRequest = this.objectToByte(this.props.postmanRequest);

      let proxyRequest = {
        requestClass: 'BOA.Types.DWH.Report.ScheduleReportRequest',
        requestBody: request,
        params: {}
      };
      this.proxyTransactionExecute(proxyRequest);
      proxyRequest.params.get = response => {
        this.hideProgress();
        if (!response.success) {
          BDialogHelper.showError(
            this.props.context,
            this.getMessage('DWH', 'ErrorTaken'),
            response.results,
            BComponent.DialogType.ERROR,
            BComponent.DialogResponseStyle.OK
          );
        } else {
          BFormManager.showStatusMessage(this.getMessage('DWH', 'Saved'));
        }
      };
    });
  }

  determineActionEnables(dataContract: ScheduleReportContract) {
    if (this.transactionForm) {
      if (dataContract) {
        if (dataContract.postmanId > 0) {
          this.transactionForm.enableAction(BConst.ActionCommand.Delete);
        } else {
          this.transactionForm.disableAction(BConst.ActionCommand.Delete);
        }
      } else {
        this.transactionForm.disableAction(BConst.ActionCommand.Save);
        this.transactionForm.disableAction(BConst.ActionCommand.Clean);
        this.transactionForm.disableAction(BConst.ActionCommand.Delete);
      }

      if (!this.props.isPostman) {
        this.transactionForm.disableAction(BConst.ActionCommand.Clean);
        this.transactionForm.disableAction(BConst.ActionCommand.Delete);
      }
    }
  }

  onActionClick(e) {
    switch (e.commandName) {
      case 'Save': {
        this.saveCommand();
        break;
      }
      case 'Clean': {
        break;
      }
      case 'Delete': {
        if (this.state.dataContract.postmanId > 0) {
          this.deletePostman(this.state.dataContract.postmanId);
        }
        break;
      }
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, params } = proxyResponse;
    params.get && params.get(response);
  }

  render() {
    let dataContract: ScheduleReportContract = this.state.dataContract || {};
    this.determineActionEnables(dataContract);

    return (
      <BTransactionForm
        {...this.props}
        ref={r => (this.transactionForm = r)}
        enableCardSortOnMobile={true}
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.onActionClick.bind(this)}
      >
        <BCard context={this.props.context} title={this.getMessage('DWH', 'MailerParameter')} expandable={true} expanded={true} column={0}>
          <BCheckBox
            context={this.props.context}
            label={this.getMessage('DWH', 'Active')}
            checked={dataContract.isEnable === 0 ? false : true}
            onCheck={(event, val) => {
              dataContract.isEnable = val === false ? 0 : 1;
            }}
          />
          <BAccessPointBrowser
            context={this.props.context}
            ref={r => (this.ownerUserAccessPoint = r)}
            disabled={!this.props.isPostman}
            showDetailedAccessPointName={true}
            isMultiSelection={false}
            roleMustBeSelected={false}
            workgroupMustBeSelected={false}
            userMustBeSelected={true}
            selectedAccessPointIds={this.state.ownerUserAccessPointIds}
            labelText={this.getMessage('DWH', 'PostmanOwner')}
            hintText={this.getMessage('DWH', 'PostmanOwner')}
            accessPointDialogClosedByApprove={() => {
              this.setOwnerUsername();
            }}
          />
        </BCard>

        <BCard
          context={this.props.context}
          disabled={!this.props.isPostman}
          title={this.getMessage('DWH', 'ScheduleParameter')}
          expandable={true}
          expanded={true}
          column={0}
        >
          <ScheduleComponent
            context={this.props.context}
            ref={r => (this.scheduleComponent = r)}
            disabled={!this.props.isPostman}
            timeScheduleContract={this.state.timeScheduleContract}
          />
        </BCard>

        <BCard context={this.props.context} title={this.getMessage('DWH', 'PostParameter')} expandable={true} expanded={true} column={1}>
          <BRadioButtonGroup
            context={this.props.context}
            disabled={!this.props.isPostman}
            direction={'horizontal'}
            valueSelected={this.state.sendType}
            onChange={(e, value) => this.setState({ sendType: value })}
            items={[
              { value: '0', label: this.getMessage('DWH', 'SendOnlyMe') },
              { value: '1', label: this.getMessage('DWH', 'SendPersonAndGroups') }
            ]}
          />
          {this.state.sendType == '1' && (
            <div>
              <BAccessPointBrowser
                context={this.props.context}
                ref={r => (this.sendUsers = r)}
                disabled={!this.props.isPostman}
                isMultiSelection={true}
                showDetailedAccessPointName={true}
                labelText={this.getMessage('DWH', 'To')}
                hintText={this.getMessage('DWH', 'To')}
                selectedAccessPointIds={
                  dataContract.sendUserAccessPoint &&
                  dataContract.sendUserAccessPoint.split(',').map(s => {
                    return Number(s);
                  })
                }
                accessPointDialogClosedByApprove={() => {
                  let id = this.sendUsers.getInstance().getValue();
                  dataContract.sendUserAccessPoint = id && id.toString();
                }}
              />
              <BAccessPointBrowser
                context={this.props.context}
                ref={r => (this.sendUsersCC = r)}
                disabled={!this.props.isPostman}
                isMultiSelection={true}
                showDetailedAccessPointName={true}
                labelText={this.getMessage('DWH', 'CC')}
                hintText={this.getMessage('DWH', 'CC')}
                selectedAccessPointIds={
                  dataContract.sendUserAccessPointCC &&
                  dataContract.sendUserAccessPointCC.split(',').map(s => {
                    return Number(s);
                  })
                }
                accessPointDialogClosedByApprove={() => {
                  let id = this.sendUsersCC.getInstance().getValue();
                  dataContract.sendUserAccessPointCC = id && id.toString();
                }}
              />
            </div>
          )}
          <BInput
            context={this.props.context}
            disabled={!this.props.isPostman}
            floatingLabelText={this.getMessage('DWH', 'Header')}
            hintText={this.getMessage('DWH', 'Header')}
            value={dataContract.emailSubject}
            onChange={(o, val) => (dataContract.emailSubject = val)}
          />
          <BInput
            context={this.props.context}
            disabled={!this.props.isPostman}
            floatingLabelText={this.getMessage('DWH', 'Content')}
            hintText={this.getMessage('DWH', 'Content')}
            value={dataContract.emailBody}
            onChange={(o, val) => (dataContract.emailBody = val)}
            multiLine={true}
            rows={5}
            rowsMax={10}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}
export default BReportPost;
