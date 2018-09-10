import React from 'react'; import PropTypes from 'prop-types';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import { getFrameworkMessage } from 'b-messaging';
import { BCard } from 'b-card';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BDataGrid } from 'b-data-grid-dx';
import { BDialogHelper } from 'b-dialog-box';
import { BTransactionForm } from 'b-transaction-form';
let ElementResizeDetectorMaker = require('element-resize-detector');
@BComponentComposer
export class AuthorizedUserDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    instanceStateId: PropTypes.number,
    stateName: PropTypes.string,
    workflowResourceId: PropTypes.number,
    transactionWorkgroupId: PropTypes.number,
    ownerWorkgroupId: PropTypes.number
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLRYETKUL'
  };

  datagrid: BDataGrid[] = []
  dataSource: any[] = [];
  columns: any;
  actionList: any[] = [];
  dataSourceList: any[][] = [];
  datagridDiv = [];

  constructor(props, context) {
    super(props, context);
    this.resizeDetector = ElementResizeDetectorMaker();
    this.gridWidth = 500;
    this.gridHeight = 300;
    this.columns = [
      { 'key': 'name', 'name': this.getMessage('BusinessComponents', 'UserName'), 'width': 200 },
      { 'key': 'userCode', 'name': this.getMessage('BusinessComponents', 'UserCodeLabel_2'), 'width': 200 },
      { 'key': 'workgroupName', 'name': this.getMessage('BusinessComponents', 'BusinessUnit'), 'width': 300 },
      { 'key': 'roleName', 'name': this.getMessage('BusinessComponents', 'Role'), 'width': 200 },
      { 'key': 'resourceName', 'name': this.getMessage('BusinessComponents', 'ScreenName'), 'width': 200 },
      { 'key': 'actionName', 'name': this.getMessage('BusinessComponents', 'labelActions'), 'width': 200 }
    ];
  }

  close(dialogResponse) {
    BDialogHelper.close(this, dialogResponse);
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  static showAuthorizedUser(context: any, instanceStateId: number, stateName, workflowResourceId, transactionWorkgroupId, ownerWorkgroupId) {
    let dialog = (
      <AuthorizedUserDialog
        context={context}
        instanceStateId={instanceStateId}
        stateName={stateName}
        workflowResourceId={workflowResourceId}
        transactionWorkgroupId={transactionWorkgroupId}
        ownerWorkgroupId={ownerWorkgroupId}
      />
    );
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: '90%', height: '75%' };
    }
    BDialogHelper.showWithResourceCode(context, '',
      dialog, 0, 0, getFrameworkMessage('BOA', 'ScreenToAuthorizedUsers'), null, dialogStyle);
  }

  generateTabItem(actionName, index) {
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    let marginTop=isMobileOrTablet ? 8 : 24;
    const divStyle = {
      margin: isMobileOrTablet ? 0 : 24,
      marginBottom:0,
      marginTop:marginTop,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      position: 'absolute'
    };

    var tmpTabItem =
      {
        text: actionName,
        content:
  <div style={divStyle} ref={r => this.datagridDiv[index] = r} >
    <BCard
              context={this.props.context}
              disableGridBehaviour={true}>
      <BDataGrid context={this.props.context}
                ref={r => this.datagrid[index] = r}
                context={this.props.context}
                columns={this.columns}
                dataSource={this.dataSourceList[index]}
                isInsideTheCard={false}
              />
    </BCard>
  </div>
      };
    return tmpTabItem;
  }

  generateTabs() {
    var tabs = [];
    this.actionList.forEach((actionName: any, index: number) => {
      tabs.push(this.generateTabItem(actionName, index));
    });
    return tabs;
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'Call':
        if (response.success) {
          this.form.getInstance().hideProgress();
          this.state.isDataLoaded = true;

          if (response.value) {
            response.value.forEach((item: any) => {

              let findIndexx = findIndex(this.actionList, function (x) { return x == item.actionName; });
              if (findIndexx == -1)
                this.actionList.push(item.actionName);

            });

            this.actionList.forEach((actionName: any, index: number) => {
              let actionList = filter(response.value, function (x) { return x.actionName == actionName; });
              this.dataSourceList[index] = actionList;
            });
            this.forceUpdate(() => {
              if (this.datagridDiv && this.datagridDiv[0]) {
                this.resizeDetector.listenTo(this.datagridDiv[0], this.onResizeParent.bind(this));
              }
              this.onResizeParent();
            }); // TODO: değerler state üzerinde taşınıp state güncellenmeli
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

  componentDidMount() {
    super.componentDidMount();
    if (this.state && this.state.isDataLoaded == true) {
      return;
    }

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.ResourceActionAuthorizedUserForWorkflowRequest',
      requestBody: {
        methodName: 'Call',
        stateName: this.props.stateName,
        workflowResourceId: this.props.workflowResourceId,
        transactionWorkgroupId: this.props.transactionWorkgroupId,
        ownerWorkgroupId: this.props.ownerWorkgroupId,
        instanceStateId: this.props.instanceStateId,
        resourceId: 153,
        actionId: 11
      },
      key: 'Call'
    };
    this.form.getInstance().showProgress();
    this.proxyExecute(proxyRequest);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.datagridDiv && this.datagridDiv[0]) {
      this.resizeDetector.uninstall(this.datagridDiv[0]);
    }
  }

  onResizeParent() {
    if (this.datagridDiv && this.datagridDiv[0]) {
      if (this.datagrid && this.datagrid[0]) {
        this.datagrid.forEach((grid: any, index: number) => {
          this.gridHeight = this.datagridDiv[index].offsetHeight;
          grid.getInstance().setMaxSize( null, this.gridHeight);
        });
      }
    }
  }

  render() {
    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    return (
      <BTransactionForm
        {...this.props}
        ref={r => this.form = r}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.handleClose.bind(this)}
        onClosing={this.handleClose.bind(this)}
        cardSectionThresholdColumn={1}
        cardSectionThresholdWidth={isMobileOrTablet ? undefined : 750}
        tabEnabled={true} >
        {this.generateTabs()}
      </BTransactionForm>
    );
  }
}
export default AuthorizedUserDialog;
