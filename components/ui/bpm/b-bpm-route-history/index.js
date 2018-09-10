import React from 'react'; import PropTypes from 'prop-types';
import UIHelper from './ui-helper';
import { getFrameworkMessage } from 'b-messaging';
import { BScroll } from 'b-scroll';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BFlexPanel } from 'b-flex-panel';
import { BProgress } from 'b-progress';
import { BActionManager } from 'b-action-manager';
import { BPopover } from 'b-popover';
import { BDivider } from 'b-divider';
import { BToggle } from 'b-toggle';
import { BMenuItem } from 'b-menu-item';
import { BLocalization } from 'b-localization';
@BComponentComposer
export class BRouteHistory extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    instanceId: PropTypes.any,
    inDialog: PropTypes.bool
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'ISATROTMAP',
    inDialog: false
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      headerContract: null,
      headerLoading: true,
      isloading: true,
      open: false,
      anchorEl: null,
      popoverContent: (<div></div>),
      resourceInfo: {
        'id': 934,
        'name': this.getMessage('BusinessComponents', 'WorkFlowRouteMap'),
        'description': this.getMessage('BusinessComponents', 'WorkFlowRouteMap'),
        'resourceCode': 'ISATROTMAP',
        'moduleCode': this.getMessage('BusinessComponents', 'ManagementOperation'),
        'channelId': 1,
        'sortId': 9999,
        'typeId': 0,
        'isLeaf': true,
        'isNew': false,
        'isHidden': true,
        'isRevokable': false,
        'isWorkflow': false,
        'isFavorite': false,
        'isAuthorizedResource': false,
        'bundleName': 'Main',
        'pageName': '/bpm/history-route-history',
        'openedBy': 0,
        'openState': 0,
        'uiType': 0,
        'identity': 934,
        'resourceActionList': [
          {
            'resourceId': 934,
            'actionId': 11,
            'actionType': 1,
            'name': this.getMessage('BusinessComponents', 'Refresh'),
            'commandName': 'GetInfo',
            'groupName': '',
            'description': this.getMessage('Workflow', 'GetInfo'),
            'iconPath': 'Refresh',
            'isVirtual': false,
            'isAssignable': true,
            'hasAccounting': false,
            'hasSlip': false,
            'hasCommission': false,
            'hasWorkflow': false,
            'sortId': 1,
            'systemDate': '0001-01-01T00:00:00Z',
            'hasAuthorization': false,
            'hasTellerTransaction': false,
            'hasRevokableTransaction': false,
            'hasFutureDated': false,
            'isOne': false,
            'isSelected': false,
            'isSelectable': true
          }
        ]
      }
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.getRouteHistory();
  }

  actionClick(command) {
    switch (command.commandName) {
      case 'GetInfo':
        {
          this.getRouteHistory();
          break;
        }
    }
  }


  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GetAllRouteHistory':
        this.setState({ isloading: false });
        if (response.success) {
          var allHistoryList = response.value.historyList;
          // allHistoryList = _.sortBy(allHistoryList, 'orderNumber');
          let historyItemList = UIHelper.populateHistoryItems(allHistoryList, this, false, response.value.setting);

          if (this.state.historyItemList != null) {
            this.setState({
              historyItemList: (<div></div>),
            }, () => {
              this.setState({
                firstList: response.value.historyList,
                historyItemList: Object.assign([], historyItemList),
                settingContract: response.value.setting
              });
            });
          }
          else {
            this.setState({
              firstList: response.value.historyList,
              historyItemList: Object.assign([], historyItemList),
              settingContract: response.value.setting
            });
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;
      case 'GetInstanceHeader':
        if (response.success) {
          this.state.headerContract = response.value;
          this.showHeader(params.currentTarget, response.value);
        }
        else {
          this.showHeader(params.currentTarget, null);
        }
        break;
      case 'SelectByUserCode':
        if (response.success) {
          this.state.settingContract = response.value;
          this.showUserSetting(params.currentTarget, response.value);
        }
        else {
          this.showUserSetting(params.currentTarget, null);
        }
        break;
      default:
        break;
    }
  }


  getRouteHistory(saveSetting: boolean) {

    this.setState({ isloading: true, settingsChanged: false });
    let proxyRequest = {
      requestClass: 'BOA.Types.BPM.RouteHistoryRequest',
      requestBody: {
        methodName: 'GetAllRouteHistory',
        instanceId: this.props.instanceId,
        setting: saveSetting == true ? this.state.settingContract : null,
        resourceId: this.getResourceInfo().id ? this.getResourceInfo().id : 153,
        actionId: 11
      },
      key: 'GetAllRouteHistory',
      showProgress: false
    };
    this.proxyExecute(proxyRequest);
  }

  getHeader(e) {
    if (this.state.headerContract == null) {

      let proxyRequest = {
        requestClass: 'BOA.Types.BPM.RouteHistoryRequest',
        requestBody: {
          methodName: 'GetInstanceHeader',
          instanceId: this.props.instanceId,
          resourceId: this.getResourceInfo().id ? this.getResourceInfo().id : 153,
          actionId: 11
        },
        key: 'GetInstanceHeader',
        params: { currentTarget: e.currentTarget }
      };
      this.proxyExecute(proxyRequest);
    }
    else {
      this.showHeader(e.currentTarget, this.state.headerContract);
    }
  }

  showHeader(currentTarget, header) {
    var content = (
      <BFlexPanel
        alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
        direction='vertical'
        alignItems={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
        responsive={false}
        style={{ margin: 18 }}
        context={this.props.context}>
        {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'WorkflowNo'), this.props.instanceId)}
        {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'ScreenName'), header.resourceName)}
        {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Starter'), header.starterUserName)}
        {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Start'), BLocalization.formatDateTime(header.startDate, 'LLL'))}
        {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Customer'), header.accountNumberAndSuffix)}
        {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Branch_2'), header.branchName)}
      </BFlexPanel>
    );
    this.showPopover(currentTarget, content);
  }


  showUserSetting(currentTarget, setting) {
    if (setting != null) {
      var content = (
        <BFlexPanel
          alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
          direction='vertical'
          alignItems='stretch'
          responsive={false}
          style={{ padding: 18, width: '100%' }}
          context={this.props.context}>
          <BMenuItem context={this.props.context}
            primaryText={this.getMessage('BOA', 'ExpandGroups')}
            itemSelected={(args) => {
              setTimeout(() => {
                this.hidePopover();
                this.refreshActiveList(args.value);
              }, 250);

            }}
            style={{ marginLeft: -18, width: 'calc(100% + 36px)' }}
            value={1} />
          <BMenuItem context={this.props.context}
            primaryText={this.getMessage('BOA', 'CollapseGroups')}
            itemSelected={(args) => {
              setTimeout(() => {
                this.hidePopover();
                this.refreshActiveList(args.value);
              }, 250);
            }}
            style={{ marginLeft: -18, width: 'calc(100% + 36px)' }}
            value={0} />
          <BDivider
            context={this.props.context}
            style={{
              width: 'calc(100% + 36px)',
              marginBottom: 18,
              marginLeft: -18,
              marginRight: -18,
              marginTop: 0
            }} />

          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('BOAOne', 'BringUsersTheProceeding')}
            style={{ marginBottom: 10 }}
            toggled={setting.getNonTransactionalUser == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.getNonTransactionalUser = isInputChecked == true ? 1 : 0;
              this.setState({ settingsChanged: true });
            }}
          />
          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('BOAOne', 'ShowPendingApprovalOnly')}
            style={{ marginBottom: 10 }}
            toggled={setting.showOnlyPendingApprovals == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.showOnlyPendingApprovals = isInputChecked == true ? 1 : 0;
              this.setState({ settingsChanged: true });
            }}
          />
          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('BusinessComponents', 'ShowDetails')}
            style={{ marginBottom: 10 }}
            toggled={setting.showDetail == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.showDetail = isInputChecked == true ? 1 : 0;
              this.setState({ settingsChanged: true });
            }}
          />
          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('BOAOne', 'ShowChronological')}
            toggled={setting.showChronological == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.showChronological = isInputChecked == true ? 1 : 0;
              this.setState({ settingsChanged: true });
            }}
          />

        </BFlexPanel>
      );
      this.showPopover(currentTarget, content);
    }
  }


  getUserSetting(e) {
    if (this.state.settingContract == null) {

      let proxyRequest = {
        requestClass: 'BOA.Types.BPM.RouteHistorySettingRequest',
        requestBody: {
          methodName: 'SelectByUserCode',
          resourceId: this.getResourceInfo().id ? this.getResourceInfo().id : 153,
          actionId: 11
        },
        key: 'SelectByUserCode',
        params: { currentTarget: e.currentTarget }
      };
      this.proxyExecute(proxyRequest);


    }
    else {
      this.showUserSetting(e.currentTarget, this.state.settingContract);
    }
  }

  static showRoute(context, instanceId) {
    let historyDialog = (<BRouteHistory context={context} instanceId={instanceId} inDialog={true} />);
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: 500, height: '85%' };
    }
    BDialogHelper.show(context, historyDialog, 0, 0, getFrameworkMessage('BusinessComponents', 'WorkFlowRouteMap'), this.callBack, dialogStyle);
  }

  handleClose() {
    BDialogHelper.close(this);
  }

  refreshActiveList(value: number) {
    // TODO: 0: kapalı, 1 açık
    let historyItemList = UIHelper.populateHistoryItems(this.state.firstList, this, value == 0 ? true : false, this.state.settingContract);

    this.setState({
      historyItemList: (<div></div>), //  historyItemList bunu değişmemiş gibi algılayıp değiştirmiyordu.
    }, () => {
      this.setState({
        historyItemList: Object.assign([], historyItemList)
      });
    });
  }

  generateAndShowHeader(e) {

    this.getHeader(e);

  }

  generateAndShowSetting(e) {

    this.getUserSetting(e);

  }

  hidePopover() {
    this.setState({
      open: false,
      anchorEl: null,
      popoverContent: (<div></div>)
    });
  }

  showPopover(anchorEl: any, content: any) {
    this.setState({
      open: true,
      anchorEl: anchorEl,
      popoverContent: content
    });
  }

  generatePopover() {
    return (
      <BPopover
        open={this.state.open}
        context={this.props.context}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
        }}
        zDepth={3}
        onRequestClose={() => {
          this.hidePopover();
          if (this.state.settingsChanged)
            this.getRouteHistory(true);
        }}
      >
        {this.state.popoverContent}
      </BPopover>
    );
  }

  getEmptyMessage() {
    var message = '';
    if (this.state.settingContract && this.state.settingContract.showOnlyPendingApprovals == true) {
      message = this.getMessage('BOAOne', 'NoPendingOperations');
    }
    else {
      message = this.getMessage('BOAOne', 'NotFoundTransactionDetail');
    }

    return (
      <div
        style={{
          marginTop: 48,
          color: this.props.context.theme.boaPalette.base300,
          textAlign: 'center'
        }} >
        {message}
      </div>
    );
  }

  getResourceInfo() {
    return this.props.resourceInfo ? this.props.resourceInfo : this.state.resourceInfo;
  }

  render() {

    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;

    return (
      <div style={{ height: '100%', width: '100%' }}>
        {!isMobileOrTablet && this.generatePopover()}
        <div style={{ height: 44, width: '100%' }}>
          <BActionManager
            ref={ref => (this.root = ref)}
            resourceInfo={this.getResourceInfo()}
            context={this.props.context}
            inDialog={true}
            visibleHelpButton={false}
            onInfoClick={this.generateAndShowHeader.bind(this)}
            onOptionsClick={this.generateAndShowSetting.bind(this)}
            onActionClick={this.actionClick.bind(this)}
          />
        </div>
        <div style={{ height: this.props.inDialog ? 'calc(100% - 44px)' : '100%', width: '100%' }}>
          <BScroll
            context={this.props.context}>
            <div style={{ height: this.props.inDialog ? 'calc(100% - 44px)' : '100%', width: '100%', marginTop: -4 }}>
              <BFlexPanel
                alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
                direction='vertical'
                alignItems='stretch'
                alignContent='stretch'
                responsive={false}
                style={{ padding: '18px 24px' }}
                context={this.props.context}>
                {this.state.isloading == true ?
                  (<BProgress
                    left={18}
                    top={18}
                    context={this.props.context}
                    size={24}
                    status='loading' />) : (<div></div>)
                }
                {(this.state.isloading == false && (this.state.historyItemList == undefined || this.state.historyItemList.length == 0)) ? // boş olduğu durumda
                  (this.getEmptyMessage()) :
                  (this.state.historyItemList)
                }
              </BFlexPanel>
            </div>
          </BScroll>
        </div>
      </div>
    );
  }

}

export default BRouteHistory;
