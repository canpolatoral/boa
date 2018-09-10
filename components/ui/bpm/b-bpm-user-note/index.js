import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import UIHelper from './ui-helper';
import { BScroll } from 'b-scroll';
import { getFrameworkMessage } from 'b-messaging';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BFlexPanel } from 'b-flex-panel';
import { BProgress } from 'b-progress';
import { BActionManager } from 'b-action-manager';
import { BPopover } from 'b-popover';
import { BToggle } from 'b-toggle';
import { BLocalization } from 'b-localization';
import { BInput } from 'b-input';
import { BComboBox } from 'b-combo-box';
import { BIconButton } from 'b-icon-button';
import { BUserList } from 'b-bpm-user-list';
import { BDivider } from 'b-divider';
@BComponentComposer
export class BUserNote extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    instanceId: PropTypes.number,
    inDialog: PropTypes.bool,
    disabledForm: PropTypes.bool,
    isloadingSendMail: PropTypes.bool,
    height: PropTypes.number
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'ISATROTMAP',
    inDialog: false,

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
      instanceUserList: [],
      allUserList: [],
      disabledForm: true,
      isloadingSendMail: false,
      addedUserList: [],
      contentHeight: null,
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
    this.getNote();
    this.getInstanceUserList();
  }

  resizeComponenet() {
    if (this.header && this.footer && this.root) {
      var height = (this.props.height ? this.props.height : ReactDOM.findDOMNode(this.header).offsetHeight) - this.root.offsetHeight - this.footer.offsetHeight;
      this.setState({ contentHeight: height + 'px' });
    }

  }


  actionClick(command) {
    switch (command.commandName) {
      case 'GetInfo':
        {
          this.getNote();
          break;
        }
    }
  }


  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GetNote':
        if (response.success) {
          this.setState({ contentHeight: '100%' });
          this.setState({ isloading: false });
          var allItemList = response.value.noteList;
          let itemList = UIHelper.populateItems(allItemList, this, false);

          if (this.state.itemList != null) {
            this.setState({
              itemList: (<div></div>),
            }, () => {
              this.setState({
                firstList: response.value.noteList,
                itemList: Object.assign([], itemList),
                settingContract: response.value.setting,
                disabledForm: false
              });
            });
          }
          else {
            this.setState({
              firstList: response.value.noteList,
              itemList: Object.assign([], itemList),
              settingContract: response.value.setting,
              disabledForm: false
            });
          }
          this.resizeComponenet();
          this.setScrollBottom();
        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;
      case 'GetInstanceUserList':
        if (response.success) {
          this.setState({ contentHeight: '100%' });
          this.setState({ instanceUserList: response.value });
          this.resizeComponenet();
        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;
      case 'InsertUserNote':
        if (response.success) {
          this.setState({ isloadingSendMail: false });
          this.addNoteList({
            userCode: this.props.context.applicationContext.user.userName,  // sadece ui da gösteriliyor.
            userName: this.props.context.applicationContext.user.name,
            description: this.inputNote.getInstance().getInstance().getValue(),
            workgroupName: this.props.context.applicationContext.user.defaultWorkGroup.name,
            insertDate: Date(),
            isMainInstanceNote: true
          });
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

        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;
      case 'SelectByUserCode':
        if (response.success) {
          this.state.settingContract = response.value;
          this.showUserSetting(params.currentTarget, response.value);

        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          // eslint-enable-next-line no-console
        }
        break;
      default:
        break;
    }
    this.resizeComponenet();
  }


  getNote(saveSetting: boolean) {

    this.setState({ isloading: true, settingsChanged: false });
    let proxyRequest = {
      requestClass: 'BOA.Types.BPM.UserNoteRequest',
      requestBody: {
        methodName: 'GetNote',
        instanceId: this.props.instanceId,
        setting: saveSetting == true ? this.state.settingContract : null,
        resourceId: this.getResourceInfo().id,
        actionId: 11
      },
      key: 'GetNote'
    };
    this.proxyExecute(proxyRequest);
  }


  showHeader(currentTarget, header) {
    if (header != null) {
      var content = (
        <BFlexPanel
          alignment='left'
          direction='vertical'
          alignItems='left'
          responsive={false}
          style={{ margin: 18 }}
          context={this.props.context}>
          {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'WorkflowNo'), this.props.instanceId)}
          {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'ScreenName'), header.resourceName)}
          {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Starter'), header.starterUserName)}
          {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Start'), BLocalization.formatDateTime(header.startDate, 'LLL'))}
          {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Customer'), header.accountNumberAndSuffix)}
          {UIHelper.generateTextInfo(this.props.context, this.getMessage('Workflow', 'Branch'), header.branchName)}
        </BFlexPanel>
      );
      this.showPopover(currentTarget, content);
    }
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

  getInstanceUserList() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Workflow2.UserListRequest',
      requestBody: {
        methodName: 'GetInstanceUserList',
        instanceId: this.props.instanceId,
        resourceId: this.getResourceInfo().id ? this.getResourceInfo().id : 153,
        actionId: 11,
        fromTransactionalExecute: true
      },
      key: 'GetInstanceUserList'
    };
    this.proxyTransactionExecute(proxyRequest);
  }

  AddNodeClick() {

    if (this.inputNote.getInstance().getValue() == null || this.inputNote.getInstance().getValue() == '') {
      this.setState({ errorText: this.getMessage('BOAOne', 'EnterNote') });
    }
    else {
      this.addNote();
    }

  }

  addNote() {
    this.setState({ isloadingSendMail: true });
    let proxyRequest = {
      requestClass: 'BOA.Types.Workflow2.UserNoteRequest',
      requestBody: {
        methodName: 'InsertUserNote',
        instanceId: this.props.instanceId,
        contract: { description: this.inputNote.getInstance().getValue() },
        assignUsers: this.state.addedUserList.concat(this.cmbUser.getInstance().getSelectedItems()),
        isBranchInfo: this.state.settingContract.sendMailCustomerBranch == 1 ? true : false,
        resourceId: this.getResourceInfo().id ? this.getResourceInfo().id : 153,
        actionId: 11,
        fromTransactionalExecute: true
      },
      key: 'InsertUserNote'
    };
    this.proxyTransactionExecute(proxyRequest);

  }

  setScrollBottom() {
    this.scroll.getInstance().setScrollTop(this.scroll.getInstance()._container.scrollHeight);
  }


  showUserSetting(currentTarget, setting) {
    if (setting != null) {
      var content = (
        <BFlexPanel
          alignment='left'
          direction='vertical'
          alignItems='stretch'
          responsive={false}
          style={{ padding: 18, width: '100%' }}
          context={this.props.context}>
          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('Workflow', 'CustomerOfBranchInfo')}
            style={{ marginBottom: 10 }}
            toggled={setting.sendMailCustomerBranch == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.sendMailCustomerBranch = isInputChecked == true ? 1 : 0;
              this.setState({ settingsChanged: true });
            }}
          />
          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('BOAOne', 'ShowRelatedWorkflowNote')}
            style={{ marginBottom: 10 }}
            toggled={setting.showRelationalInstance == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.showRelationalInstance = isInputChecked == true ? 1 : 0;
              this.setState({ settingsChanged: true });
            }}
          />
          <BToggle
            context={this.props.context}
            labelPosition={'left'}
            label={this.getMessage('BOAOne', 'OrderByDate')}
            style={{ marginBottom: 10 }}
            toggled={setting.sortByDate == 1 ? true : false}
            onToggle={(event, isInputChecked) => {
              setting.sortByDate = isInputChecked == true ? 1 : 0;
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

  static showNote(context, instanceId) {
    let dialog = (<BUserNote context={context} instanceId={instanceId} inDialog={true} />);
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '90%', height: '90%' };
    }
    else {
      dialogStyle = { width: 500, height: '85%' };
    }
    BDialogHelper.show(context, dialog, 0, 0, getFrameworkMessage('BusinessComponents', 'WFNotes'), this.callBack, dialogStyle);
  }

  handleClose() {
    BDialogHelper.close(this);
  }

  addNoteList(noteItem: any) {
    this.state.firstList.push(noteItem);
    let itemList = UIHelper.populateItems(this.state.firstList, this);

    this.setState({
      itemList: (<div></div>), //  itemList bunu değişmemiş gibi algılayıp değiştirmiyordu.
    }, () => {
      this.setState({
        itemList: Object.assign([], itemList)
      });
    });
    this.setScrollBottom();
    this.inputNote.getInstance().resetValue();
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
        zDepth={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
        }}
        onRequestClose={() => {
          this.hidePopover();
          if (this.state.settingsChanged)
            this.getNote(true);
        }}
      >
        {this.state.popoverContent}
      </BPopover>
    );
  }

  generateSendMessage() {

    var columns = [
      { key: 'userCode', name: this.getMessage('BusinessComponents', 'UserCodeLabel'), 'width': 200 },
      { key: 'name', name: this.getMessage('Workflow', 'Name'), 'width': 200 },
      { key: 'workgroup', name: this.getMessage('Workflow', 'WorkingGroup'), 'width': 200 },
      { key: 'role', name: this.getMessage('Workflow', 'Role'), 'width': 200 }
    ];

    var comboValueList = [];

    this.state.instanceUserList.filter(u => u.isSelected).forEach(item => {
      comboValueList.push(item.userCode);
    });

    return (
      <div ref={ref => (this.footer = ref)}>
        <div style={{
          backgroundColor: this.props.context.theme.boaPalette.base50, height: 85,
          borderBottom: '1px solid',
          borderColor: this.props.context.theme.boaPalette.base200
        }}>
          <BFlexPanel
            alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
            isReverse={!this.props.context.localization.isRightToLeft ? false : true}
            direction='horizontal'
            alignItems='stretch'
            alignContent='stretch'
            responsive={false}
            context={this.props.context}
            style={{
              marginLeft: !this.props.context.localization.isRightToLeft ? '18px' : '0px',
              marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '18px'
            }}
          >

            <BInput
              ref={r => this.inputNote = r}
              context={this.props.context}
              type="text"
              multiLine={true}
              rows={2}
              rowsMax={2}
              underlineShow={false}
              noWrap={false}
              hintText={this.getMessage('BusinessComponents', 'AddNote')}
              inputStyle={{
                height: 85,
                marginTop: -3
              }}
              formControlStyle={{
                height: 85,
                margin: '0px 0px 0px 0px'
              }}
              errorText={this.state.errorText}
              onChange={() => {
                this.setState({ errorText: '' });
              }}
            />


            {this.state.isloadingSendMail == true ?
              (
                <div style={{
                  borderRight: this.props.context.localization.isRightToLeft && '1px solid',
                  borderLeft: !this.props.context.localization.isRightToLeft && '1px solid',
                  borderColor: this.props.context.theme.boaPalette.base200,
                  height:85,
                  width:85,
                  padding:31
                }}>
                  <BProgress
                    left={!this.props.context.localization.isRightToLeft ? 18 : 0}
                    right={!this.props.context.localization.isRightToLeft ? 0 : 18}
                    top={18}
                    context={this.props.context}
                    size={24}
                    status='loading'
                    style={{
                      alignSelf: 'center'
                    }}
                  />
                </div>
              ) :
              (
                <div style={{
                  borderRight: this.props.context.localization.isRightToLeft && '1px solid',
                  borderLeft: !this.props.context.localization.isRightToLeft && '1px solid',
                  borderColor: this.props.context.theme.boaPalette.base200
                }}>
                  <BIconButton
                    disabled={this.state.disabledForm}
                    iconProperties={{
                      nativeColor: this.props.context.theme.boaPalette.pri500
                    }}
                    context={this.props.context}
                    dynamicIcon='Send'
                    tooltip={this.getMessage('BOAOne', 'Send')}
                    style={{
                      alignSelf: 'center', height: 85, width: 85
                    }}
                    onClick={this.AddNodeClick.bind(this)}
                  />
                </div>
              )
            }
          </BFlexPanel>


        </div>

        <BFlexPanel
          alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
          isReverse={!this.props.context.localization.isRightToLeft ? false : true}
          direction='horizontal'
          alignItems='stretch'
          alignContent='stretch'
          responsive={false}
          context={this.props.context}
          style={{
            marginLeft: !this.props.context.localization.isRightToLeft ? '18px' : '0px',
            marginRight: !this.props.context.localization.isRightToLeft ? '0px' : '18px'
          }}
        >
          <div
            style={{
              width: '100%'
            }}
          >
            <BComboBox
              ref={r => this.cmbUser = r}
              disabled={this.state.disabledForm}
              context={this.props.context}
              dataSource={this.state.instanceUserList}
              columns={columns}
              multiSelect={true}
              multiColumn={true}
              style={{
                width: '100%',
                marginBottom: 0,
                marginRight: 0,
                marginTop: 0
              }}
              inlineGridMode={true}
              isAllOptionIncluded={false}
              displayMemberPath='name'
              valueMemberPath='userCode'
              value={comboValueList}
              labelText=''
              hintText={this.getMessage('BOAOne', 'SendNoteUser')}
            />
          </div>

          <BIconButton
            disabled={this.state.disabledForm}
            iconProperties={{
              nativeColor: this.props.context.theme.boaPalette.pri500
            }}
            context={this.props.context}
            dynamicIcon='AddCircleOutline'

            onClick={() => {
              BUserList.showUserList(this.props.context, this.state.instanceUserList, ((dialogResponse, data) => {
                if (dialogResponse == BComponent.DialogResponse.YES
                  && data != null
                  && data.length != 0) {

                  this.state.addedUserList = this.state.addedUserList.concat(data);


                  this.setState({
                    instanceUserList: data
                  });
                }
              }).bind(this));

            }}
          />
        </BFlexPanel>

      </div>
    );
  }

  getEmptyMessage() {
    return (
      <div
        style={{
          marginTop: 48,
          color: this.props.context.theme.boaPalette.base300,
          textAlign: 'center'
        }} >
        {this.getMessage('BOAOne', 'NotFoundTransactionNote')}
      </div>
    );
  }


  getResourceInfo() {
    return this.props.resourceInfo ? this.props.resourceInfo : this.state.resourceInfo;
  }

  render() {

    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;

    return (
      <BFlexPanel
        ref={ref => (this.header = ref)}
        alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
        direction='vertical'
        alignItems='stretch'
        alignContent='stretch'
        responsive={false}
        context={this.props.context}
        style={{ height: '100%' }}
      >
        {!isMobileOrTablet && this.generatePopover()}
        <div ref={ref => (this.root = ref)}>
          <BActionManager
            resourceInfo={this.getResourceInfo()}
            context={this.props.context}
            inDialog={true}
            visibleHelpButton={false}
            onInfoClick={this.generateAndShowHeader.bind(this)}
            onOptionsClick={this.generateAndShowSetting.bind(this)}
            onActionClick={this.actionClick.bind(this)}
          />
        </div>

        <BFlexPanel
          alignment={!this.props.context.localization.isRightToLeft ? 'left' : 'right'}
          direction='vertical'
          alignItems='stretch'
          alignContent='stretch'
          responsive={false}
          style={{ height: this.state.contentHeight }}
          context={this.props.context}>
          <BScroll
            ref={ref => (this.scroll = ref)}
            style={{ marginTop: 24 }}
            context={this.props.context}>
            {this.state.isloading == true ?
              (<BProgress
                left={18}
                top={18}
                context={this.props.context}
                size={24}
                status='loading' />) : (<div></div>)
            }
            {(this.state.isloading == false && (this.state.itemList == undefined || this.state.itemList.length == 0)) ? // boş olduğu durumda
              (this.getEmptyMessage()) :
              (this.state.itemList)
            } </BScroll>
        </BFlexPanel>


        <BDivider
          context={this.props.context}
          style={{
            width: '100%',
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0
          }} />
        {
          this.generateSendMessage()
        }
      </BFlexPanel>
    );
  }
}

export default BUserNote;
