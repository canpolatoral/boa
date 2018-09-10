import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BComboBox } from 'b-combo-box';
import _ from 'lodash';

@BComponentComposer
export class BWorkgroupUserComponent extends BBusinessComponent {

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    workgroupHintText: null,
    workgroupLabelText: null,
    workgroupUserLabelText: null,
    workgroupUserHintText: null,
    allOptionDescription: null,
    workgroupVisible: true,
    workgroupUserVisible: true,
    allOptionValue: null,
    selectedWorkgroupId: null,
    defaultSelectedWorkgroupId: null,
    selectedWorkgroupUserId: null,
    defaultSelectedWorkgroupUserId: null,
    workgroupUserMultiColumn: true,
    useFirstElementAsDefault: true, // mbrn: Default true olarak kullanilmisti zaten. Fakat dolu gelmesin isteyenler oldugu icin default true birakilip option verildi.
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the workgroup that is currently selected.
     * @type {number}
     */
    selectedWorkgroupId: PropTypes.number,
    defaultSelectedWorkgroupId: PropTypes.number,

    /**
     * Determines the branch that is currently selected
     * @type {number}
     */
    workgroupFilterIdList: PropTypes.arrayOf(PropTypes.number),

    /**
     * Determines the workgroup user that is currently selected.
     * @type {number}
     */
    selectedWorkgroupUserId: PropTypes.number,
    defaultSelectedWorkgroupUserId: PropTypes.number,

    /**
     * Filter the workgroups by workgroup types.
     * @type {array of string}
     */
    workgroupTypeList: PropTypes.arrayOf(PropTypes.string),
    showSelfWorkgroup: PropTypes.bool,
    isDepartmentAndServiceTogether: PropTypes.bool,
    showSelfWorkgroupWithChildList: PropTypes.bool,
    showSubWorkgroupUsers: PropTypes.bool,
    workWithBranchComponent: PropTypes.bool,
    workgroupListManual: PropTypes.arrayOf(PropTypes.object),

    /**
     * If true, the workgroup will be disabled. Default valuse is false
     * @type {bool}
     */
    workgroupDisabled: PropTypes.bool,

    /**
     * The hint content to display.
     * @type {string}
     */
    workgroupHintText: PropTypes.string,

    /**
     * The content of the floating label.
     * @type {string}
     */
    workgroupLabelText: PropTypes.string,

    /**
     * The hint content to display.
     * @type {string}
     */
    workgroupUserHintText: PropTypes.string,

    /**
     * The content of the floating label.
     * @type {string}
     */
    workgroupUserLabelText: PropTypes.string,

    /**
     * If true, the workgroup user will be disabled. Default valuse is false
     * @type {bool}
     */
    workgroupUserDisabled: PropTypes.bool,
    workgroupUserDisableSearch: PropTypes.bool,

    /**
     * If true, the workgroup will be visible. Default valuse is true.
     * @type {bool}
     */
    workgroupVisible: PropTypes.bool,

    /**
     * If true, the workgroup user will be visible. Default valuse is true.
     * @type {bool}
     */
    workgroupUserVisible: PropTypes.bool,

    /**
     * If true an item will push to the first row of the parameter list. Default is value is false.
     * @type {bool}
     */
    isAllOptionIncluded: PropTypes.bool,

    /**
     * If isAllOptionIncluded is true. Default value is 'Hepsi'
     * @type {number}
     */
    allOptionDescription: PropTypes.string,

    /**
     * Callback function fires when the fec has been selected.
     * @type {func}
     */
    onWorkgroupSelect: PropTypes.func,

    /**
     * Callback function fires when the fec has been selected.
     * @type {func}
     */
    onWorkgroupUserSelect: PropTypes.func,
    errorTextWorkgroup: PropTypes.string,
    errorTextUser: PropTypes.string,
    workgroupUserMultiColumn: PropTypes.bool
  };

  state = {
    workgroupValueMemberPath: 'workgroupId',
    workgroupDisplayMemberPath: 'name',
    workgroupUserValueMemberPath: 'userid',
    workgroupUserDisplayMemberPath: 'name',

    workgroupList: [],
    workgroupUserList: [],
    selectedWorkgroupId: this.props.selectedWorkgroupId || this.props.defaultSelectedWorkgroupId,
    selectedWorkgroupUserId: this.props.selectedWorkgroupUserId || this.props.defaultSelectedWorkgroupUserId
  };

  nullValue = -100000;

  constructor(props, context) {
    super(props, context);
    this.handleOnWorkgroupSelect = this.handleOnWorkgroupSelect.bind(this);
    this.handleOnWorkgroupUserSelect = this.handleOnWorkgroupUserSelect.bind(this);
  }

  getAllOptionItemInstance(props) {
    props = props || this.props;
    let value = props.allOptionValue;
    if (value === null || value === undefined)
      value = this.nullValue;

    let item = {
      [this.state.workgroupValueMemberPath]: value,
      [this.state.workgroupDisplayMemberPath]: props.allOptionDescription || this.getMessage('BusinessComponents', 'All')
    };
    return item;
  }

  isAllOptionExists(workgroupList, props) {
    props = props || this.props;
    if (workgroupList && workgroupList.length > 0) {
      let i = workgroupList.findIndex(
        s => s[this.state.workgroupValueMemberPath] == this.getAllOptionItemInstance(props)[this.state.workgroupValueMemberPath]
      );
      return {
        isExists: i == -1 ? false : true,
        index: i
      };
    }
    return {
      isExists: false,
      index: -1
    };
  }

  filterByProps(workgroupList, props) {
    workgroupList = workgroupList || [];

    if (props.isAllOptionIncluded) {
      let allOptionItem = this.isAllOptionExists(workgroupList, props);
      if (!allOptionItem.isExists) {
        workgroupList.unshift(this.getAllOptionItemInstance(props));
      }
    }
    return workgroupList || [];
  }

  /**
   * Invoked immediately before a component is mounted
   */
  componentDidMount() {
    super.componentDidMount();
    this.loadData();
  }

  /**
   * Invoked before a mounted component receives new props
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if ((nextProps.isDepartmentAndServiceTogether != this.props.isDepartmentAndServiceTogether) ||
        (!_.isEqual(nextProps.workgroupFilterIdList, this.props.workgroupFilterIdList)) ||
        (nextProps.showSelfWorkgroupWithChildList != this.props.showSelfWorkgroupWithChildList) ||
        (nextProps.showSubWorkgroupUsers != this.props.showSubWorkgroupUsers) ||
        (nextProps.workWithBranchComponent != this.props.workWithBranchComponent) ||
        (!_.isEqual(nextProps.workgroupTypeList, this.props.workgroupTypeList)) ||
        (nextProps.workgroupUserVisible != this.props.workgroupUserVisible)) {
        this.loadData(nextProps);
      } else {
        if ((nextProps.selectedWorkgroupId != this.props.selectedWorkgroupId) ||
          (nextProps.selectedWorkgroupUserId != this.props.selectedWorkgroupUserId)) {
          let list = this.getValues().workgroups;
          this.setValues(list, nextProps);
        }
      }
    }
  }

  /**
   * Load workgroup data from data base
   * @param props
   */
  loadData(props) {
    if (this.state.workgroupUserList && this.state.workgroupList.length > 0) { return null; }
    props = props || this.props;

    if (props.isDepartmentAndServiceTogether) {
      let workgroupId = this.props.context.applicationContext.userManager.workGroupID;

      this.getWorkgroupListByType(null, workgroupId, props);
    }
    else {
      let workgroupFilterIdList = props.workgroupFilterIdList || [];
      if (props.showSelfWorkgroup)
        workgroupFilterIdList.push(this.props.context.applicationContext.user.workGroupId);

      let methodName = (workgroupFilterIdList.length > 0 && props.showSelfWorkgroupWithChildList)
        ? 'GetWorkgroupWithChildList' : 'GetWorkgroupListByType';

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.WorkgroupRequest',
        requestBody: {
          MethodName: methodName,
          UserId: this.props.context.applicationContext.user.userid,
          WorkgroupTypeList: props.workgroupTypeList,
          WorkgroupList: workgroupFilterIdList
        },
        key: 'GET_WORK_GROUP'
      };

      this.proxyExecute(proxyRequest);
    }
  }

  /**
   * Load workgroup data from data base
   * @param {any} response
   * @param {any} workgroupId
   * @param {any} props
   */
  getWorkgroupListByType(response, workgroupId, props) {
    if (!workgroupId) {
      this.setState({
        workgroupList: [],
      });
      return;
    }

    if (!response) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.WorkgroupRequest',
        requestBody: {
          MethodName: 'GetWorkgroupListByType',
          WorkgroupId: workgroupId
        },
        key: 'GET_WORK_GROUP_BY_TYPE',
        params: { workgroupId: workgroupId, props: props }
      };
      this.proxyExecute(proxyRequest);
      return;
    }

    if (response.success) {
      this.setValues(response.value, props);
    }
    else {
      this.setState({
        workgroupList: [],
        workgroupUserList: []
      });
      this.debugLog(this.resultErrorListToString(response.results), 3);
    }
  }

  /**
   * Load workgroup user data from data base
   * @param workgroupId
   */
  getWorkgroupUserList(workgroupId) {
    if (!workgroupId) {
      this.setState({ workgroupUserList: [] });
      return;
    }
    let props = this.props;
    let methodName = props.showSubWorkgroupUsers ? 'GetWorkgroupUserListWithChildren' : 'GetWorkgroupUserList';
    let workgroupIdList = props.workgroupFilterIdList || [];

    if (workgroupId == this.nullValue)
      workgroupIdList.push(this.props.context.applicationContext.user.workGroupId);
    else
      workgroupIdList.push(workgroupId);

    if (props.workWithBranchComponent) {
      if (workgroupId == 305) { /* Genel müdürlük ise */
        workgroupIdList.unshift(-1); /* Bölge müdürlükleri */
      }
    }

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.WorkgroupRequest',
      requestBody: {
        MethodName: methodName,
        WorkgroupList: workgroupIdList,
        WorkgroupTypeList: props.workgroupTypeList
      },
      key: 'GET_WORK_GROUP_USER_LIST'
    };
    this.proxyExecute(proxyRequest);
  }

  /**
   * proxyDidRespond Method
   * @param proxyResponse
   */
  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GET_WORK_GROUP':
        if (response.success) {
          this.setValues(response.value);
        } else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;

      case 'GET_WORK_GROUP_BY_TYPE':
        this.getWorkgroupListByType(response, params.workgroupId, params.props);
        break;

      case 'GET_WORK_GROUP_USER_LIST':
        if (response.success) {
          this.setUserValues(response.value);
        }
        else {
          this.setState({ workgroupUserList: [] });
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;

      default:
        break;
    }
  }

  /**
   * Set the workgroups by workgroup list
   * @param workgroupList
   * @param props
   */
  setValues(workgroupList, props) {
    props = props || this.props;
    workgroupList = this.filterByProps(workgroupList, props);

    let selectedId = this.nullValue;
    if (props.isAllOptionIncluded && props.selectedWorkgroupId === null)
      selectedId = this.nullValue;
    else if (props.selectedWorkgroupId)
      selectedId = props.selectedWorkgroupId;
    else if (props.isDepartmentAndServiceTogether)
      selectedId = this.props.context.applicationContext.userManager.workGroupID;
    else if (props.useFirstElementAsDefault)
      selectedId = workgroupList.length > 0 ? workgroupList[0][this.state.workgroupValueMemberPath] : this.nullValue;

    this.setState({
      workgroupList: workgroupList,
      selectedWorkgroupId: selectedId
    });

    if (props.workgroupUserVisible) {
      this.getWorkgroupUserList(selectedId);
    }
  }

  /**
   * Set the workgroup users by workgroup user list
   * @param workgroupUserList
   * @param props
   */
  setUserValues(workgroupUserList, props) {
    props = props || this.props;
    workgroupUserList = workgroupUserList || [];

    if (props.isAllOptionIncluded && workgroupUserList.length > 1) {
      let contract = {
        userName: null,
        name: props.allOptionDescription || this.getMessage('BusinessComponents', 'All'),
        userid: this.nullValue
      };
      workgroupUserList.unshift(contract);
    }

    if (props.selectedWorkgroupUserId) {
      this.setState({
        workgroupUserList: workgroupUserList,
        selectedWorkgroupUserId: props.selectedWorkgroupUserId
      });
    } else {
      let firstId = this.nullValue;
      if (props.useFirstElementAsDefault)
        firstId = workgroupUserList.length > 1 ? workgroupUserList[0][this.state.workgroupUserValueMemberPath] : this.nullValue;
      this.setState({
        workgroupUserList: workgroupUserList,
        selectedWorkgroupUserId: firstId
      });
    }
  }

  setSelectedWorkgroupById(workgroupId) {
    this.setState({ selectedWorkgroupId: workgroupId });
  }

  setSelectedWorkgroupUserById(workgroupUserId) {
    this.setState({ selectedWorkgroupUserId: workgroupUserId });
  }

  /**
   * Returns the list of workgroup.
   * @returns {{workgroups: [], workgroupUsers: []}}
   */
  getValues() {
    return {
      workgroups: this.state.workgroupList || [],
      workgroupUsers: this.state.workgroupUserList || []
    };
  }

  /**
   * Returns the selected workgroup.
   * @returns {{workgroup: {}, workgroupUser: {}}}
   */
  getValue() {
    let item = this.BComboBoxWorkgroup.getValue();
    if (!item) return undefined;

    let workgroupUser;
    let workgroups = this.getValues().workgroups;
    let workgroup = Object.assign({}, workgroups.find(s => s[this.state.workgroupValueMemberPath] == item.value));
    if (this.props.isAllOptionIncluded) {
      if (workgroup) {
        if (workgroup[this.state.workgroupValueMemberPath] == this.nullValue) {
          workgroup = this.props.allOptionValue;
        }
      }
    }
    if (this.props.workgroupUserVisible) {
      let subitem = this.BComboBoxWorkgroupUser.getValue();
      if (subitem) {
        let workgroupUsers = this.getValues().workgroupUsers;
        workgroupUser = Object.assign({}, workgroupUsers.find(s => s[this.state.workgroupUserValueMemberPath] == subitem.value));
        if (workgroupUser) {
          if (workgroupUser[this.state.workgroupUserValueMemberPath] == this.nullValue) {
            workgroupUser = this.props.allOptionValue;
          }
        }
      }
    }
    return {
      workgroup: workgroup,
      workgroupUser: workgroupUser
    };
  }

  resetValue() {
    let selectedWorkgroupId = this.props.defaultSelectedWorkgroupId;
    if (this.props.isAllOptionIncluded) {
      if (selectedWorkgroupId === null) {
        selectedWorkgroupId = this.nullValue;
      }
    }
    this.setState({ selectedWorkgroupId: selectedWorkgroupId });

    if (this.props.workgroupUserVisible) {
      if (selectedWorkgroupId) {
        this.getWorkgroupUserList(selectedWorkgroupId);
      }
      else {
        this.setState({
          selectedWorkgroupUserId: this.props.defaultSelectedWorkgroupUserId,
          workgroupUserList: []
        });
      }
    }
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  /**
   * Get the list of string errors as single lined string
   * @param resultList
   * @returns error messages
   */
  resultErrorListToString(resultList) {
    let message = ' ';
    if (resultList && resultList.length > 0) {
      resultList.forEach((item) => {
        message += item.errorMessage;
      }, this);
    }
    return message;
  }

  /**
   * Handle function fired when a branch is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnWorkgroupSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let selectedWorkgroup = selectedItems[0];
      let selectedWorkgroupId = selectedValues[0];
      this.setState({
        selectedWorkgroupId: selectedWorkgroupId,
        selectedWorkgroupUserId: undefined
      });
      if (this.props.isAllOptionIncluded && selectedWorkgroupId == this.nullValue) {
        if (this.props.onWorkgroupSelect)
          this.props.onWorkgroupSelect(this.props.allOptionValue);
      }
      else {
        if (this.props.onWorkgroupSelect)
          this.props.onWorkgroupSelect(selectedWorkgroup);
      }
      if (this.props.workgroupUserVisible) {
        this.getWorkgroupUserList(selectedWorkgroupId);
      }
    }
    else {
      this.setState({ selectedWorkgroupId: undefined });
      if (this.props.onWorkgroupSelect)
        this.props.onWorkgroupSelect(undefined);
    }
  }

  /**
   * Handle function fired when a branch is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnWorkgroupUserSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      this.setState({ selectedWorkgroupUserId: selectedValues[0] });
      if (this.props.onWorkgroupUserSelect)
        this.props.onWorkgroupUserSelect(selectedItems[0]);
    }
    else {
      this.setState({ selectedWorkgroupUserId: undefined });
      if (this.props.onWorkgroupUserSelect)
        this.props.onWorkgroupUserSelect(undefined);
    }
  }

  render() {
    let workgroupColumns = [
      { key: 'workgroupId', name: this.getMessage('BusinessComponents', 'Id'), width: 1, type: 'number', resizable: true },
      { key: 'name', name: this.props.workgroupLabelText || this.getMessage('Authorization', 'WorkGroupHeader'), width: 300, type: 'string', resizable: true }];

    let workgroupUserColumns = [
      { key: 'userid', name: this.getMessage('BusinessComponents', 'Id'), width: 1, type: 'number', resizable: true },
      { key: 'userName', name: this.getMessage('BusinessComponents', 'CodeLabel2'), width: 100, type: 'string' },
      { key: 'name', name: this.props.workgroupUserLabelText || this.getMessage('BusinessComponents', 'User'), width: 270, type: 'string', resizable: true }];

    return (
      <div>
        <div style={{ display: (this.props.workgroupVisible ? 'block' : 'none') }}>
          <BComboBox
            ref={r => this.BComboBoxWorkgroup = r}
            context={this.props.context}
            columns={workgroupColumns}
            valueMemberPath={this.state.workgroupValueMemberPath}
            displayMemberPath={this.state.workgroupDisplayMemberPath}
            value={[this.state.selectedWorkgroupId]}
            dataSource={this.state.workgroupList}
            multiColumn={true}
            multiSelect={false}
            isAllOptionIncluded={false} /* we will manage */
            onSelect={this.handleOnWorkgroupSelect}
            hintText={this.props.workgroupHintText || this.getMessage('Authorization', 'WorkGroupHeader')}
            labelText={this.props.workgroupLabelText || this.getMessage('Authorization', 'WorkGroupHeader')}
            disabled={this.props.workgroupDisabled}
            disableSearch={this.props.workgroupDisableSearch}
            errorText={this.props.errorTextWorkgroup}
          />
        </div>
        {this.props.workgroupUserVisible ?
          <BComboBox
            ref={r => this.BComboBoxWorkgroupUser = r}
            errorText={this.props.errorTextUser}
            context={this.props.context}
            columns={workgroupUserColumns}
            valueMemberPath={this.state.workgroupUserValueMemberPath}
            displayMemberPath={this.state.workgroupUserDisplayMemberPath}
            value={[this.state.selectedWorkgroupUserId]}
            dataSource={this.state.workgroupUserList}
            multiColumn={this.props.workgroupUserMultiColumn}
            multiSelect={false}
            isAllOptionIncluded={false} /* we will manage */
            onSelect={this.handleOnWorkgroupUserSelect}
            hintText={this.props.workgroupUserHintText || this.getMessage('BusinessComponents', 'User')}
            labelText={this.props.workgroupUserLabelText || this.getMessage('BusinessComponents', 'User')}
            disabled={this.props.workgroupUserDisabled}
            disableSearch={this.props.workgroupUserDisableSearch}
          /> : <div />
        }
      </div>
    );
  }

}
export default BWorkgroupUserComponent;
