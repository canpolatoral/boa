import React from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BBrowseForm } from 'b-browse-form';
import { BConst } from 'b-const';
import { BDialogHelper } from 'b-dialog-box';
import { BTreeView } from 'b-treeview';
import _ from 'lodash';
import DataLoader from './DataLoader';
import { AuthorizationAccessPointNode } from './model';

interface state {
  accessPointNodeList: Array<AuthorizationAccessPointNode>;
}

@BComponentComposer
export class AccessPointDialog extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.props,
    /**
     * The close event.
     */
    handleClose: PropTypes.func,
    /**
     * If true, user can select multiple resource.
     */
    isMultiSelection: PropTypes.bool,
    /**
     * If true, user must be select at least one user resource.
     */
    userMustBeSelected: PropTypes.bool,
    /**
     * If true, user must be select at least one work group resource.
     */
    workgroupMustBeSelected: PropTypes.bool,
    /**
     * If true, user must be select at least one role resource.
     */
    roleMustBeSelected: PropTypes.bool,
    /**
     * If true, all item will be expanded.
     */
    expandAll: PropTypes.bool,
    /**
     * Height of component.
     */
    height: PropTypes.number,
    /**
     * If true, icons will be show.
     */
    showIcons: PropTypes.bool,

    rootWorkgroupId: PropTypes.number,

    selectedNodeList: PropTypes.array,
    accessPointNodeList: PropTypes.array
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLRERNKAR', // 'YONTEXCELD',
    isMultiSelection: false,
    expandAll: true,
    height: 484,
    showIcons: true,
    selectedNodeList: [],
    accessPointNodeList: []
  };

  state: state;

  constructor(props, context) {
    super(props, context);
    this.gridColumns = [
      { key: 'id', name: this.getMessage('BusinessComponents', 'AccessPoint') },
      { key: 'workgroupName', name: this.getMessage('BusinessComponents', 'Workgroup') },
      { key: 'roleName', name: this.getMessage('BusinessComponents', 'Role') },
      { key: 'orgName', name: this.getMessage('BusinessComponents', 'User') },
      { key: 'userCode', name: this.getMessage('BusinessComponents', 'UserCodeLabel') },
      { key: 'path', name: this.getMessage('BusinessComponents', 'Path') }
    ];

    this.state = {
      workgroupList: [],
      roleList: [],
      userList: [],
      accessPointNodeList: this.props.accessPointNodeList,
      selectedNodeList: this.props.selectedNodeList
    };
    this.dataLoader = new DataLoader(this, this.state.selectedNodeList);
  }

  componentDidMount() {
    super.componentDidMount();
    this.dataLoader.loadData();
  }

  proxyDidRespond(proxyResponse) {
    this.dataLoader && this.dataLoader.proxyDidRespond(proxyResponse);
  }

  getTreeHeight(obj) {
    var node = ReactDOM.findDOMNode(obj);
    if (node) {
      var calculatedHeight = node.clientHeight;
      return calculatedHeight - 137;
    }
  }

  determineActionEnables() {
    if (this.browseForm) {
      if ((this.state.selectedNodeList || []).length > 0) {
        this.browseForm.enableAction(BConst.ActionCommand.Ok);
        this.browseForm.enableAction(BConst.ActionCommand.Clean);
        let hasSelected = this.state.selectedNodeList.find(s => s.isSelected);
        if (hasSelected) {
          this.browseForm.enableAction(BConst.ActionCommand.Delete);
        } else {
          this.browseForm.disableAction(BConst.ActionCommand.Delete);
        }
      } else {
        this.browseForm.disableAction(BConst.ActionCommand.Ok);
        this.browseForm.disableAction(BConst.ActionCommand.Clean);
        this.browseForm.disableAction(BConst.ActionCommand.Delete);
      }
    }
  }

  getPathString(node, pathString) {
    if (node.parent) {
      if (node.parent.id) pathString = node.parent.name + ' > ' + pathString;
      if (node.parent.parent) pathString = this.getPathString(node.parent, pathString);
    }
    return pathString;
  }

  handleClose = () => {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE);
  };

  handleOnCheckNode() {
    let treeView = this.treeView.getInstance();
    var selectedNodeList: any[] = _.cloneDeep(treeView.getCheckedNodes()) || [];
    selectedNodeList.forEach(node => {
      node.isSelected = false;
      node.path = this.getPathString(node, node.name);
    });
    this.setState({ selectedNodeList: selectedNodeList });
  }

  handleOnGridRowSelectionChanged() {
    this.determineActionEnables();
  }

  setNodeSelected(arr: any, selected: boolean) {
    arr.forEach(node => {
      node.isSelected = selected;
      if (node.children)
        this.setNodeSelected(node.children, selected);
    });
  }

  handleOnActionClick(e) {
    switch (e.commandName) {
      case BConst.ActionCommand.Ok: {
        if ((this.state.selectedNodeList || []).length == 0) {
          BDialogHelper.show(
            this.props.context,
            this.getMessage('BusinessComponents', 'ExpectedWorkgroupSelection'),
            BComponent.DialogType.WARNING
          );
          return;
        }
        BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.selectedNodeList || []);
        break;
      }

      case BConst.ActionCommand.Clean: {
        var tempaccessPointNodeList: any[] = _.cloneDeep(this.state.accessPointNodeList) || [];
        this.setNodeSelected(tempaccessPointNodeList, false);

        this.setState({
          accessPointNodeList: tempaccessPointNodeList,
          selectedNodeList: []
        });
        break;
      }

      case BConst.ActionCommand.Delete: {
        let checkedNodes = this.browseForm.getInstance().getSelectedRows();
        if (checkedNodes && checkedNodes.length > 0) {
          checkedNodes.forEach(element => {
            let treeInstance = this.treeView.getInstance();
            var node = treeInstance.getNodeById(element.id);
            treeInstance.checkNode(node, false);
          });
          var arr = [];
          var selectedNodeList = this.state.selectedNodeList;
          for (var i = 0; i < selectedNodeList.length; i++) {
            let isEqual = false;
            for (var j = 0; j < checkedNodes.length; j++) {
              if (selectedNodeList[i].id == checkedNodes[j].id) {
                isEqual = true;
              }
            }
            if (!isEqual) {
              arr.push(selectedNodeList[i]);
            }
          }
          this.setState({ selectedNodeList: arr });
        } else {
          BDialogHelper.show(
            this.props.context,
            this.getMessage('BusinessComponents', 'ExpectedWorkgroupSelection'),
            BComponent.DialogType.WARNING
          );
        }
        break;
      }
      default:
        break;
    }
  }

  render() {
    this.determineActionEnables();

    let style = {
      borderColor: this.props.context.theme.boaPalette.base200,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    return (
      <BBrowseForm
        {...this.props}
        context={this.props.context}
        ref={r => (this.browseForm = r)}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.handleClose}
        cardSectionThresholdColumn={1}
        style={{ padding: 0, overflow: 'hidden' }}
        leftPaneWidth={BBrowseForm.defaultProps.leftPaneMaxWidth}
        onGridRowSelectionChanged={this.handleOnGridRowSelectionChanged.bind(this)}
        onActionClick={this.handleOnActionClick.bind(this)}
        columns={this.gridColumns}
        dataSource={this.state.selectedNodeList}
      >
        {(this.state.accessPointNodeList || []).length > 0 ? (
          <BTreeView
            context={this.props.context}
            ref={r => (this.treeView = r)}
            data={this.state.accessPointNodeList}
            expandAll={this.props.expandAll}
            height={this.browseForm && this.getTreeHeight(this.browseForm)}
            showIcons={this.props.showIcons}
            isOnlyLeafCheckable={this.props.isOnlyLeafCheckable}
            isMultiSelect={this.props.isMultiSelection}
            onCheckNode={this.handleOnCheckNode.bind(this)}
            isCheckable={true}
            isSingleCheckable={true}
            caseSensitive={this.props.caseSensitive}
            exactMatch={this.props.exactMatch}
            includeAncestors={this.props.includeAncestors}
            includeDescendants={this.props.includeDescendants}
            style={style}
          />
        ) : (
            this.state.isLoading && this.dataLoader && this.dataLoader.loadingIcon(true)
          )}
      </BBrowseForm>
    );
  }
}

AccessPointDialog.StaticWorkgroupList = [];
AccessPointDialog.StaticRoleList = [];
AccessPointDialog.StaticUserList = [];
export default AccessPointDialog;
