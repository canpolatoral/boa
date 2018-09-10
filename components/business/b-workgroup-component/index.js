import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BComboBox } from 'b-combo-box';
import _ from 'lodash';

@BComponentComposer
export class BWorkgroupComponent extends BBusinessComponent {

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    whintText: null,
    labelText: null,
    allOptionDescription: null,
    allOptionValue: null,
    selectedWorkgroupId: null,
    defaultSelectedWorkgroupId: null,
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
     * Filter the workgroups by workgroup types.
     * @type {array of string}
     */
    workgroupTypeList: PropTypes.arrayOf(PropTypes.string),
    showSelfWorkgroup: PropTypes.bool,
    isDepartmentAndServiceTogether: PropTypes.bool,
    showSelfWorkgroupWithChildList: PropTypes.bool,
    workWithBranchComponent: PropTypes.bool,
    workgroupListManual: PropTypes.arrayOf(PropTypes.object),

    /**
     * If true, the workgroup will be disabled. Default valuse is false
     * @type {bool}
     */
    disabled: PropTypes.bool,

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
    errorTextWorkgroup: PropTypes.string,
  };

  state = {
    workgroupValueMemberPath: 'workgroupId',
    workgroupDisplayMemberPath: 'name',

    workgroupList: [],
    selectedWorkgroupId: this.props.selectedWorkgroupId || this.props.defaultSelectedWorkgroupId,
  };

  nullValue = 'null';

  constructor(props, context) {
    super(props, context);
    this.handleOnWorkgroupSelect = this.handleOnWorkgroupSelect.bind(this);
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
        (nextProps.workWithBranchComponent != this.props.workWithBranchComponent) ||
        (!_.isEqual(nextProps.workgroupTypeList, this.props.workgroupTypeList))) {
        this.loadData(nextProps);
      } else {
        if ((nextProps.selectedWorkgroupId != this.props.selectedWorkgroupId)) {
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
    if (this.state.workgroupList && this.state.workgroupList.length > 0) { return null; }
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
      });
      this.debugLog('error: GetWorkGroup method error: ' + response.results[0].errorMessage, 3);
    }
  }

  /**
   * proxyDidRespond Method
   */
  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GET_WORK_GROUP':
        if (response.success) {
          this.setValues(response.value);
        } else {
          this.debugLog('error: GetWorkGroup method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      case 'GET_WORK_GROUP_BY_TYPE':
        this.getWorkgroupListByType(response, params.workgroupId, params.props);
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

    let selectedId;
    if (props.isAllOptionIncluded && props.selectedWorkgroupId === null)
      selectedId = this.nullValue;
    else if (props.selectedWorkgroupId)
      selectedId = props.selectedWorkgroupId;
    else if (props.isDepartmentAndServiceTogether)
      selectedId = this.props.context.applicationContext.userManager.workGroupID;
    else
      selectedId = workgroupList.length > 0 ? workgroupList[0][this.state.workgroupValueMemberPath] : this.nullValue;

    this.setState({
      workgroupList: workgroupList,
      selectedWorkgroupId: selectedId
    });
  }

  setSelectedWorkgroupById(workgroupId) {
    this.setState({ selectedWorkgroupId: workgroupId });
  }

  /**
   * Returns the list of workgroup.
   * @returns {{workgroups: []}}
   */
  getValues() {
    return {
      workgroups: this.state.workgroupList || []
    };
  }

  /**
   * Returns the selected workgroup.
   * @returns {{workgroup: {}}}
   */
  getValue() {
    let item = this.BComboBoxWorkgroup.getValue();
    if (!item) return undefined;

    let workgroups = this.getValues().workgroups;
    let workgroup = Object.assign({}, workgroups.find(s => s[this.state.workgroupValueMemberPath] == item.value));
    if (this.props.isAllOptionIncluded) {
      if (workgroup) {
        if (workgroup[this.state.workgroupValueMemberPath] == this.nullValue) {
          workgroup = this.props.allOptionValue;
        }
      }
    }
    return {
      workgroup: workgroup,
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
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
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
        selectedWorkgroupId: selectedWorkgroupId
      });
      if (this.props.isAllOptionIncluded && selectedWorkgroupId == this.nullValue) {
        if (this.props.onWorkgroupSelect)
          this.props.onWorkgroupSelect(this.props.allOptionValue);
      }
      else {
        if (this.props.onWorkgroupSelect)
          this.props.onWorkgroupSelect(selectedWorkgroup);
      }
    }
    else {
      this.setState({ selectedWorkgroupId: undefined });
      if (this.props.onWorkgroupSelect)
        this.props.onWorkgroupSelect(undefined);
    }
  }

  render() {
    let workgroupColumns = [
      { key: 'workgroupId', name: this.getMessage('BusinessComponents', 'Id'), width: 1, type: 'number', resizable: true },
      { key: 'name', name: this.props.workgroupLabelText || this.getMessage('Authorization', 'WorkGroupHeader'), width: 300, type: 'string', resizable: true }];

    return (
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
    );
  }

}

export default BWorkgroupComponent;
