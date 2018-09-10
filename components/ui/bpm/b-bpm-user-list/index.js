import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer, Utils } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BDataGrid } from 'b-data-grid-dx';
import { BCard } from 'b-card';

let ElementResizeDetectorMaker = require('element-resize-detector');
@BComponentComposer
export class BUserList
  extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceId: PropTypes.number,
    resourceCode: PropTypes.string,
    selectedItems: PropTypes.array
  };
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'ISATUSRLST'
  };

  constructor(props, context) {
    super(props, context);
    this.resizeDetector = ElementResizeDetectorMaker();
    this.gridWidth = 500;
    this.gridHeight = 300;
  }

  static showUserList(context, selectedItems, callBack) {

    let dialog = (
      <BUserList
        context={context}
        selectedItems={selectedItems}
      />
    );
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '95%', height: '95%' };
    }
    else {
      dialogStyle = { width: '50%', height: '75%' };
    }
    BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, this.getMessage('Workflow', 'UserList'), callBack, dialogStyle);
  }

  getColumns() {
    return [
      { key: 'userCode', name: this.getMessage('Workflow', 'UserKod'), 'width': 200 },
      { key: 'name', name: this.getMessage('Workflow', 'Name'), 'width': 200 },
      { key: 'workgroup', name: this.getMessage('Workflow', 'WorkingGroup'), 'width': 200 },
      { key: 'role', name: this.getMessage('Workflow', 'Role'), 'width': 200 }
    ];
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.datagridDiv) {
      this.resizeDetector.uninstall(this.datagridDiv);
    }
  }

  onResizeParent() {
    if (this.datagridDiv) {
      this.gridWidth = this.datagridDiv.offsetWidth;
      this.gridHeight = this.datagridDiv.offsetHeight - 60;
      this.datagrid.setSize(this.gridWidth, this.gridHeight);
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.datagridDiv) {
      this.resizeDetector.listenTo(this.datagridDiv, this.onResizeParent.bind(this));
    }
    this.onResizeParent();
    this.getUserList();
  }

  actionClick(command) {
    switch (command.commandName) {
      case 'Ok':
        {
          this.close(BComponent.DialogResponse.YES, this.datagrid.getSelectedItems());
          break;
        }
    }
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetUserList':
        if (response.success) {
          this.form.getInstance().hideProgress();
          if (response.value) {
            this.setState({
              dataSource: response.value.map(item => {
                if (this.props.selectedItems && this.props.selectedItems.length > 0) {
                  if (this.props.selectedItems.find(x => x.userCode == item.userCode)) {
                    item.isSelected = true;
                    return item;
                  }
                }
                return item;
              })
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


  getUserList() {

    let proxyRequest = {
      requestClass: 'BOA.Types.Workflow2.UserListRequest',
      requestBody: {
        methodName: 'GetUserList',
        resourceId: this.props.resourceInfo && this.props.resourceInfo.id ? this.props.resourceInfo.id : 153,
        actionId: 11,
        fromTransactionalExecute: true
      },
      key: 'GetUserList'
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
    let isMobile = Utils.isMobile(this.props);

    const divStyle = {
      marginTop: 24,
      marginBottom: 24,
      marginLeft: isMobile ? 0 : 24,
      marginRight: isMobile ? 0 : 24,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      position: 'absolute'
    };


    return (
      <BTransactionForm
        {...this.props}
        ref={r => this.form = r}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.actionClick.bind(this)}
        onClosing={this.handleClose.bind(this)}>

        <div ref={r => this.datagridDiv = r} style={divStyle} >
          <BCard context={this.props.context} disableGridBehaviour={true}>
            <BDataGrid context={this.props.context}
              ref={r => this.datagrid = r}
              context={this.props.context}
              columns={this.getColumns()}
              dataSource={this.state.dataSource}
              selectable='multiple'
              isInsideTheCard={false}
            />
          </BCard>
        </div>

      </BTransactionForm>
    );
  }
}

export default BUserList;
