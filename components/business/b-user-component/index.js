import React from 'react'; import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';
import sortBy from 'lodash/sortBy';

export var SortOption;
(function (SortOption) {
  SortOption[SortOption['Code'] = 1] = 'Code';
  SortOption[SortOption['Name'] = 2] = 'Name';
})(SortOption || (SortOption = {}));
@BComponentComposer
export class BUserComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the UserId that is currently selected
     * @type {array}
     */
    selectedUserId: PropTypes.array,
    /**
    * Determines the UserCode that is currently selected
    * @type {array}
    */
    selectedUserCode: PropTypes.array,
    /**
    * BOAUser filter by branchId
    * @type {number}
    */
    branchId: PropTypes.number,
    /**
     * If true an item will push to the first index of the user list. Default is value is false.
     * @type {Boolean}
     */
    isAllOptionIncluded: PropTypes.bool,
    /**
     * If isAllOptionIncluded is true. Default value is 'Hepsi'
     * @type {string}
     */
    allOptionDescription: PropTypes.string,
    /**
     * If isAllOptionIncluded is true.. Default value is '-1'
     * @type {any}
     */
    allOptionValue: PropTypes.any,
    /**
     * The hint content to display.
     * @type {string}
     */
    hintText: PropTypes.string,
    /**
     * The content of the floating label.
     * @type {string}
     */
    labelText: PropTypes.string,
    /**
     * If true, the User component will be disabled.
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    disableSearch: PropTypes.bool,
    /**
     * Display your chosen column on user component. Default column is 'name'
     * @type {string}
     */
    displayMemberPath: PropTypes.string,
    /**
     * Determines whether the information will be read from the cache when the information is fetched.
     * Default value is true.
     * @type {Boolean}
     */
    isCacheEnabled: PropTypes.bool,
    /**
     * Used to block service users (ATM,XTM,Your Corner)
     * @type {Boolean}
     */
    isServiceUserEnabled: PropTypes.bool,
    /**
    * BCombobox set multiSelect value
    * @type {Boolean}
    */
    multiSelect: PropTypes.bool,
    /**
    * BCombobox set multiSelect value
    * @type {Boolean}
    */
    IsSystemColumnVisible: PropTypes.bool,
    /**
      * Callback function fired when the user item is selected
      * @type {function}
      */
    onUserSelect: PropTypes.func,
    /**
    * Sort the users. Available options is BUserComponent.SortOption.Code, BUserComponent.SortOption.Name
    * @type {string, number}
    */
    sortOption: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    errorText: PropTypes.string,
    /* Dashboarddan bu metotla çağırılıyor.*/
    onChangeSync: PropTypes.func
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    hintText: null,
    labelText: null,
    allOptionDescription: null,
    isAllOptionIncluded: false,
    multiSelect: false,
    allOptionValue: '-1',
    disabled: false,
    disableSearch: false,
    displayMemberPath: 'name',
    isCacheEnabled: false,
    isServiceUserEnabled: true,
    sortOption: SortOption.Name
  }

  constructor(props, context) {
    super(props, context);
    let userIdTitle = this.getMessage('BusinessComponents', 'EmployeeNumber');
    let userCodeTitle = this.getMessage('BusinessComponents', 'UserCodeLabel');
    let nameTitle = this.getMessage('BusinessComponents', 'Name');
    this.state = {
      valueMemberPath: 'userId',
      valueMemberPathUnit: 'userId',
      boaUserList: [],
      userIdTitle: userIdTitle,
      userCodeTitle: userCodeTitle,
      nameTitle: nameTitle,
      selectedUser: [],
      selectedUserId: this.props.selectedUserId,
      selectedUserCode: this.props.selectedUserCode
    };
  }

  /**
   * get All boaUserList
   * @param {*} props
   */
  /*   _loadBoaUserListData(props) {
      props = props || this.props;
      let promise = this.proxyCall('BOA.Types.Kernel.BusinessHelper.BoaUserListRequest', {
        doNotUseCache: props.isCacheEnabled,
        isServiceUserEnabled: props.isServiceUserEnabled,
        MethodName: 'GetAllUser'
      });
      promise.then((result) => {
        if (result.success) {
          this.setValues(result.value, props);
        } else {
          this.debugLog(this.resultErrorListToString(result.results), 3);
        }
      }, (error) => {
        this.debugLog(JSON.stringify(error), 3);
      });
    } */
  /**
    * Get all boaUserList from data base
    * @param {any} isCacheEnabled
    * @param {any} callback (isSuccess: bool, value: any)
    */
  _loadBoaUserListData(props) {
    props = props || this.props;
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.BoaUserListRequest',
      requestBody: {
        IsCacheEnabled: props.isCacheEnabled,
        // isServiceUserEnabled: props.isServiceUserEnabled,
        MethodName: 'GetAllUser'
      },
      key: 'GetAllUser'
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {

    if (proxyResponse.response.success) {
      this.setValues(proxyResponse.response.value, this.props);
    } else {
      this.clearValues();
    }

  }


  /* all option value item instance */
  _getAllOptionItemInstance() {
    let value = this.props.allOptionValue || '';
    let item = {
      [this.state.valueMemberPath]: value,
      [this.props.displayMemberPath]: this.props.allOptionDescription || this.getMessage('BusinessComponents', 'All')
    };
    return item;
  }

  /**
   *  get AllOptionItem
   * @param {*} boaUserList
   */
  _getAllOptionItem(boaUserList) {
    if (boaUserList && boaUserList.length > 0) {
      let index = boaUserList.findIndex(
        s => s[this.state.valueMemberPath] == this._getAllOptionItemInstance()[this.state.valueMemberPath]
      );
      return {
        isExists: index == -1 ? false : true,
        index: index
      };
    }
    return { isExists: false, index: -1 };
  }

  /*
   * get Sorted Values
   * @param {*} boaUserList
   * @param {*} props
   */
  _getSortedValues(boaUserList, props) {
    props = props || this.props;
    boaUserList = boaUserList || [];

    let sortOption = props.sortOption;
    let newList = [];
    switch (sortOption) {
      case SortOption.Code:
        newList = sortBy(boaUserList, 'userId');
        break;
      case SortOption.Name:
        newList = sortBy(boaUserList, 'name');
        break;
      default:
        newList = boaUserList;
        break;
    }
    return newList;
  }

  /* Invoked immediately after a component is mounted */
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
      if ((nextProps.selectedUserId != this.props.selectedUserId) ||
        (nextProps.selectedUserCode != this.props.selectedUserCode) ||
        (nextProps.isCacheEnabled != this.props.isCacheEnabled) ||
        (nextProps.isServiceUserEnabled != this.props.isServiceUserEnabled) ||
        (nextProps.sortOption != this.props.sortOption)) {
        let list = this.getValue().boaUserList;
        this.setValues(list, nextProps);
      }
    }
  }

  /**
   * Load user data from data base
   * @param props
   */
  loadData(props) {
    if (!this.state.boaUserList || this.state.boaUserList.length == 0) {
      props = props || this.props;
      this._loadBoaUserListData(props);
    }
  }

  /**
   * Sort the Users. Available options is BUserComponent.SortOption.Code, BUserComponent.SortOption.Name
   * @param sortOption
   */
  sortValues(sortOption) {
    if (!sortOption) return;
    let boaUserList = this.getValue().boaUserList;
    if (boaUserList && boaUserList.length > 0) {
      boaUserList = this._getSortedValues(boaUserList, sortOption);
      let allOptionItem = this._getAllOptionItem(boaUserList);
      if (allOptionItem.isExists) {
        boaUserList.splice(allOptionItem.index, 1);
        boaUserList.unshift(this._getAllOptionItemInstance());
      }
      this.setValues(boaUserList);
    }
  }

  /**
   * Set the Users by Users
   * @param boaUserList
   * @param props
   */
  setValues(boaUserList, props) {
    let _props = props || this.props.props;
    let branchId = _props.branchId;
    let userCode = _props.selectedUserCode;
    if (_props.branchId != null) {
      boaUserList = boaUserList.filter(function (el) { return el.branchId == branchId; });
    }

    if (_props.selectedUserCode != null) {
      let userCodeList = new Array();
      boaUserList.forEach(d => {
        for (var i = 0; i < userCode.length; i++) {
          if (d.userCode == userCode[i])
            userCodeList[i] = (d.userId);
        }
      });
      this.setState({ selectedUserId: userCodeList, selectedUserCode: userCodeList });
    }

    boaUserList = boaUserList || this.getValue().boaUserList;
    boaUserList = this._getSortedValues(boaUserList, _props);

    if (boaUserList && boaUserList.length > 0) {
      this.setState({
        boaUserList: boaUserList
      });
    } else {
      this.clearValues();
    }
  }

  /* BComboBox Reset Value */
  resetValue() {
    this.setState({
      selectedUser: [],
      selectedUserId: [],
      selectedUserCode: []
    });
    if (this.BComboBox) {
      this.BComboBox.resetValue();
    }
  }

  /* Clear values */
  clearValues() {
    this.setState({
      selectedUser: [],
      selectedUserId: [],
      selectedUserCode: [],
    });
  }

  /* Returns the selected user. */
  getValue() {
    let selectedUser, selectedUserId, selectedUserCode;
    if (this.props && this.props.multiSelect) {
      selectedUser = this.state.selectedUser || [];
      selectedUserId = this.state.selectedUserId || [];
      selectedUserCode = this.state.selectedUserCode || [];
    }
    else {
      selectedUser = this.state.selectedUser && this.state.selectedUser.length == 1 ? this.state.selectedUser[0] : null;
      selectedUserId = this.state.selectedUserId && this.state.selectedUserId.length == 1 ? this.state.selectedUserId[0] : null;
      selectedUserCode = this.state.selectedUserCode && this.state.selectedUserCode.length == 1 ? this.state.selectedUserCode[0] : null;
    }
    return {
      boaUserList: this.state.boaUserList || [],
      user: selectedUser,
      selectedUserId: selectedUserId,
      selectedUserCode: selectedUserCode,
    };
  }

  /* Get the BUserComponent snapshot*/
  getSnapshot() {
    return {
      state: this.state
    };
  }

  /* set the BUserComponent snapshot */
  setSnapshot(snapshot) {
    let {
      state
    } = snapshot;
    this.setState({ ...state });
  }

  /** Handle function fired when a user is selected
   * @param index
   * @param selectedItems
   * @param selectedValues */
  handleOnSelect(index, selectedItems, selectedValues) {
    if (selectedItems && selectedItems.length > 0) {
      let userCodeList = new Array();
      selectedItems.forEach(d => {
        userCodeList.push(d.userCode);
      });
      this.setState({ selectedUser: selectedItems, selectedUserId: selectedValues, selectedUserCode: userCodeList });
      this.onUserSelect(selectedItems);
    }
    else {
      this.setState({ selectedUser: [], selectedUserId: [], selectedUserCode: [] });
      this.onUserSelect(null);
    }
  }

  /**
   * Callback function fired when a user is selected
   * @param selectedUser
   */
  onUserSelect(selectedUser) {
    if (this.props && this.props.onUserSelect) {
      if (this.props.multiSelect) {
        this.props.onUserSelect(selectedUser);
      }
      else {
        this.props.onUserSelect(selectedUser && selectedUser.length == 1 ? selectedUser[0] : null);
      }
    }

    if (this.props && this.props.onChangeSync) {
      if (this.props.multiSelect) {
        this.props.onChangeSync(selectedUser);
      } else {
        this.props.onChangeSync(selectedUser && selectedUser.length == 1 ? selectedUser[0] : null);
      }
    }
  }

  /* render method component */
  render() {
    let userListColumns = [
      { key: 'userId', name: (this.state.userIdTitle), width: 70, resizable: true },
      { key: 'userCode', name: (this.state.userCodeTitle), width: 300, resizable: true },
      { key: 'name', name: (this.state.nameTitle), width: 300, resizable: true }];
    return (
      <div>
        <BComboBox
          ref={r => this.BComboBox = r}
          context={this.props.context}
          columns={userListColumns}
          valueMemberPath={this.state.valueMemberPath}
          displayMemberPath={this.props.displayMemberPath}
          value={this.state.selectedUserId}
          dataSource={this.state.boaUserList}
          multiColumn={true}
          multiSelect={this.props.multiSelect}
          isAllOptionIncluded={this.props.isAllOptionIncluded}
          onSelect={this.handleOnSelect.bind(this)}
          hintText={this.props.hintText || this.getMessage('BusinessComponents', 'User')}
          labelText={this.props.labelText || this.getMessage('AUD', 'UserList')}
          disabled={this.props.disabled}
          disableSearch={this.props.disableSearch}
          errorText={this.props.errorText} />
      </div>
    );
  }
}

BUserComponent.SortOption = SortOption;
export default BUserComponent;
