import React from 'react';
import { BDialogHelper } from 'b-dialog-box';
import AccessPointDialog from './AccessPointDialog';
import { BComponent } from 'b-component';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import teal from '@material-ui/core/colors/teal';
import deepPurple from '@material-ui/core/colors/deepPurple';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { BProgress } from 'b-progress';
import _ from 'lodash';
import { AuthorizationAccessPointNode, AuthorizationRoleContract, AuthorizationUserContract } from './model';

export default class DataLoader {
  parent = {};
  constructor(parent, selectedNodeList) {
    this.parent = parent;
    this.props = this.parent.props;
    this.state = this.parent.state;
    this.selectedNodeList = selectedNodeList || [];
  }

  loadingIcon(isBig) {
    return (
      <BProgress
        context={this.props.context}
        size={isBig ? 50 : 20}
        progressType={'circular'}
        mode={'indeterminate'}
        style={{
          color: this.props.context.theme.boaPalette.base400,
          position: !isBig && 'absolute',
          top: !isBig && '30.5%',
          right: !isBig && (!this.props.context.localization.isRightToLeft ? '5px' : 'auto')
        }}
      />
    );
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'Get_Authorization_Workgroup': {
        this.loadWorkGroupData(response);
        break;
      }
      case 'Get_Authorization_Roles': {
        this.loadRoleData(response);
        break;
      }
      case 'Get_Authorization_User_List': {
        this.loadUserData(response);
        break;
      }
      default:
        break;
    }
  }

  loadData() {
    if ((AccessPointDialog.StaticWorkgroupList || []).length == 0) this.loadWorkGroupData();
    else if ((AccessPointDialog.StaticRoleList || []).length == 0) this.loadRoleData();
    else if ((AccessPointDialog.StaticUserList || []).length == 0) this.loadUserData();
    else this.setValues();
  }

  loadWorkGroupData(response) {
    if (!response) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.AuthorizationWorkgroupTreeRequest',
        requestBody: {
          MethodName: 'GetAuthorizationWorkgroupTree'
        },
        key: 'Get_Authorization_Workgroup'
      };
      this.parent.proxyExecute(proxyRequest);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        this.parent.getMessage('BusinessComponents', 'WorkgroupGetInfoError'),
        BComponent.DialogType.ERROR
      );
    } else {
      AccessPointDialog.StaticWorkgroupList = response.value;
      if ((AccessPointDialog.StaticRoleList || []).length == 0) this.loadRoleData();
    }
  }

  loadRoleData(response) {
    if (!response) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.AuthorizationRoleListRequest',
        requestBody: {
          MethodName: 'GetAuthorizationRoleListWithWorkGroup'
        },
        key: 'Get_Authorization_Roles'
      };
      this.parent.proxyExecute(proxyRequest);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        this.parent.getMessage('BusinessComponents', 'WorkgroupGetInfoError'),
        BComponent.DialogType.ERROR
      );
    } else {
      AccessPointDialog.StaticRoleList = response.value;
      if ((AccessPointDialog.StaticUserList || []).length == 0) this.loadUserData();
    }
  }

  loadUserData(response) {
    if (!response) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.AuthorizationUserListRequest',
        requestBody: {
          MethodName: 'GetAuthorizationUserList'
        },
        key: 'Get_Authorization_User_List'
      };
      this.parent.proxyExecute(proxyRequest);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(this.props.context, this.parent.getMessage('BusinessComponents', 'UserGetInfoError'), BComponent.DialogType.ERROR);
    } else {
      AccessPointDialog.StaticUserList = response.value;
    }
    this.setValues();
  }

  getIcon(id) {
    switch (id) {
      case 631:
        return { dynamicIcon: 'LocationCity', iconProperties: { style: { color: green[900] } } };
      case 233815:
        return { dynamicIcon: 'LightbulbOutline', iconProperties: { style: { color: amber[800] } } };
      case 887:
        return { dynamicIcon: 'Domain', iconProperties: { style: { color: teal[700] } } };
      case 781:
        return { dynamicIcon: 'Store', iconProperties: { style: { color: deepPurple[800] } } };
      case 183928:
        return { dynamicIcon: 'People', iconProperties: { style: { color: blueGrey[700] } } };
      case 134187:
        return { dynamicIcon: 'PersonOutline', iconProperties: { style: { color: brown[500] } } };
      case 229769:
        return { dynamicIcon: 'VideoLabel', iconProperties: { style: { color: deepOrange[900] } } };
      default:
        return { dynamicIcon: 'Group', iconProperties: { style: { color: 'black' } } };
    }
  }

  getColumnsFromNode(node) {
    return { ...node, isSelected: false, path: this.getPathString(node, node.name) };
  }

  isNodeSelected(node, selectedNodeList) {
    let isExisth = (this.selectedNodeList || []).find(s => s.id == node.id) ? true : false;
    if (isExisth) {
      let hasItem = selectedNodeList.find(s => s.id == node.id) ? true : false;
      if (!hasItem) selectedNodeList.push(this.getColumnsFromNode(node));
      return !hasItem;
    }
    return isExisth;
  }

  getPathString(node, pathString) {
    if (node.parent) {
      if (node.parent.id) pathString = node.parent.name + ' > ' + pathString;
      if (node.parent.parent) pathString = this.getPathString(node.parent, pathString);
    }
    return pathString;
  }

  getAccessPointNodeList(workgroupList, roleList: Array<AuthorizationRoleContract>, userList: Array<AuthorizationUserContract>) {
    let accessPointNodeList = workgroupList;
    workgroupList[0].isExpanded = true;
    let selectedNodeList = [];

    let workgroupMustBeSelected = this.props.workgroupMustBeSelected === undefined ? true : this.props.workgroupMustBeSelected;
    let roleMustBeSelected = this.props.roleMustBeSelected === undefined ? true : this.props.roleMustBeSelected;
    let userMustBeSelected = this.props.userMustBeSelected === undefined ? true : this.props.userMustBeSelected;

    this.treeForEach(workgroupList, item => {
      let node: AuthorizationAccessPointNode = item;
      if (node.workgroup) {
        node.name = node.workgroup.name;
        node.accessPointId = node.workgroup.accessPointId;
      }
      node.id = node.accessPointId;
      node.workgroupName = node.name;
      node.isCheckable = workgroupMustBeSelected;
      node.icon = this.getIcon(node.id);
      node.isSelected = this.isNodeSelected(node, selectedNodeList);

      if (node.workgroup) {
        let roles =
          roleList.filter(s => {
            return s.workgroupId == node.workgroup.workgroupId;
          }) || [];
        roles.forEach(role => {
          node.children = node.children || [];
          role.id = role.accessPointId;
          role.name = role.roleName;
          role.workgroupName = node.workgroupName;
          role.isCheckable = roleMustBeSelected;
          role.icon = this.getIcon(role.id);
          role.isSelected = this.isNodeSelected(role, selectedNodeList);
          role.___notiterate = true;
          node.children.push(role);
        });
      }
    });

    userList.forEach(user => {
      var role = roleList.find(r => r.roleId == user.roleId && user.workgroupId == r.workgroupId);
      if (role) {
        role.isCheckable = roleMustBeSelected;
        role.children = role.children || [];
        user.id = user.accessPointId;
        user.orgName = user.name;
        user.name = user.name + ' - ' + user.userCode + ' - ' + user.userId;
        user.icon = { dynamicIcon: 'Person' };
        user.workgroupName = role.workgroupName;
        user.roleName = role.name;
        user.userCode = user.userCode;
        user.iconStyle = {};
        user.isCheckable = userMustBeSelected;
        user.isSelected = this.isNodeSelected(user, selectedNodeList);
        role.children.push(user);
      }
    });

    return { accessPointNodeList, selectedNodeList };
  }

  treeForEach(nodes, doJop) {
    nodes.forEach(node => {
      !node.___notiterate && doJop(node);
      if (node.children && node.children.length > 0) {
        this.treeForEach(node.children, doJop);
      }
    });
  }

  setValues() {
    let workgroupList = _.cloneDeep(AccessPointDialog.StaticWorkgroupList);
    let roleList = _.cloneDeep(AccessPointDialog.StaticRoleList);
    let userList = _.cloneDeep(AccessPointDialog.StaticUserList);
    let m = this.getAccessPointNodeList(workgroupList, roleList, userList);

    this.parent.setState({
      workgroupList: workgroupList,
      roleList: roleList,
      userList: userList,
      accessPointNodeList: m.accessPointNodeList,
      selectedNodeList: m.selectedNodeList
    });
  }
}
