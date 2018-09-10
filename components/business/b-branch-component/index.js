import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BComboBox } from 'b-combo-box';
import sortBy from 'lodash/sortBy';

export var SortOption;
(function (SortOption) {
  SortOption[SortOption['Code'] = 1] = 'Code';
  SortOption[SortOption['Name'] = 2] = 'Name';
})(SortOption || (SortOption = {}));
@BComponentComposer
export class BBranchComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the branch that is currently selected
     * @type {number}
     */
    selectedBranchId: PropTypes.number,
    defaultSelectedBranchId: PropTypes.number,
    /**
     * If isUnitsSelectable is true sub branches will be show.
     * @type {Boolean}
     */
    isUnitsSelectable: PropTypes.bool,
    /**
     * The sub branch that is currently selected.
     * @type {number}
     */
    selectedBranchUnitId: PropTypes.number,
    defaultSelectedBranchUnitId: PropTypes.number,
    /**
     * If true an item will push to the first index of the branch list. Default is value is false.
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
     * The hint content to display of the unit branches.
     * @type {string}
     */
    hintTextUtil: PropTypes.string,
    /**
     * The content of the floating label of the unit branches.
     * @type {string}
     */
    labelTextUtil: PropTypes.string,
    /**
     * If true, the Branch component will be disabled.
     * @type {Boolean}
     */
    disabled: PropTypes.bool,
    disableSearch: PropTypes.bool,
    /**
     * Kullanıcı diğer şubeleri normalde seçebilir, ancak bu değer false olursa
     * 99 nolu şubedeki kişiler HARİÇ (Eğer IsOtherBranchesChooseableForGM = true ise)
     * @type {Boolean}
     */
    isOtherBranchesChooseable: PropTypes.bool,
    /**
     * Şube serbest bölge filtresi atmak için kullanılır. null: hepsi,
     * 0: Serbest bölge harici şubeler, 1: Serbest bölge şubeleri. Varsayılan null.
     * @type {Boolean}
     */
    isInFreeZone: PropTypes.number,
    /**
     * Bileşende kullanılan şube listesinde BranchRegion filtresi atmak için kullanılan değişken. Varsayılan null.
     * @type {number}
     */
    branchRegion: PropTypes.number,
    /**
     * Bileşende kullanılan şube listesinde ReginalOffice filtresi atmak için kullanılan değişken.
     * Varsayılan null.
     * @type {number}
     */
    reginalOffice: PropTypes.number,
    /**
     * Bu değer eğer true olarak atanırsa kullanıcının yetkili olduğu şubeler bileşende gösterilmektedir.
     * Default değer false.
     * @type {string}
     */
    branchType: PropTypes.string,
    /**
     * Bu değer eğer true olarak atanırsa kullanıcının yetkili olduğu şubeler bileşende gösterilmektedir.
     * Default değer false.
     * @type {Boolean}
     */
    workGroupSync: PropTypes.bool,
    /**
     * Determines the branches of the selected customer.
     * @type {number}
     */
    customerId: PropTypes.number,
    /**
     * Determines whether the information will be read from the cache when the information is fetched.
     * Default value is true.
     * @type {Boolean}
     */
    isCacheEnabled: PropTypes.bool,
    /**
     * IsOtherBranchesChooseable = false olduğu durumlarda bu değer true ise şube combosu değiştirilebilir,
     * false ise şube combosu değiştirilemez.
     * @type {Boolean}
     */
    isOtherBranchesChooseableForGM: PropTypes.bool,
    /**
     * Callback function fired when the branch item is selected
     * @type {function}
     */
    onBranchSelect: PropTypes.func,
    /**
     * Callback function fired when the sub branch item is selected
     * @type {function}
     */
    onSubBranchSelect: PropTypes.func,
    /**
     * Sort the branchs. Available options is BBranchComponent.SortOption.Code, BBranchComponent.SortOption.Name
     * @type {string, number}
     */
    sortOption: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    errorTextBranch: PropTypes.string,
    errorTextUnit: PropTypes.string,
    /**
     * Horizontal or vetical mode of component.
     * @type {'horizontal', 'vertical'}
     */
    mode: PropTypes.oneOf(['horizontal', 'vertical'])
  }

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    selectedBranchId: null,
    defaultSelectedBranchId: null,
    selectedBranchUnitId: null,
    defaultSelectedBranchUnitId: null,
    allOptionValue: null,
    isCacheEnabled: true,
    workGroupSync: false,
    isOtherBranchesChooseable: true,
    isOtherBranchesChooseableForGM: true,
    sortOption: SortOption.Code,
    mode: 'vertical'
  }

  constructor(props, context) {
    super(props, context);

    this.handleOnBranchSelect = this.handleOnBranchSelect.bind(this);
    this.handleOnSubBranchSelect = this.handleOnSubBranchSelect.bind(this);
    this.state = {
      branchList: [],
      subBranchList: [],
      allOptionDescription: this.getMessage('BusinessComponents', 'All'),
      valueMemberPath: 'branchId',
      valueMemberPathUnit: 'unitId',
      displayMemberPath: 'name',
      displayMemberPathUnit: 'name',
      selectedBranchId: this.props.selectedBranchId || this.props.defaultSelectedBranchId,
      selectedSubBranchId: this.props.selectedBranchUnitId
    };
    this.nullValue = ' '; // 'null' da olabilir fakat şube kodları ekranda görülüyor
  }

  /**
   * Invoked immediately after a component is mounted
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
      if (nextProps.customerId != this.props.customerId) {
        this.loadData(nextProps);
      } else {
        if ((nextProps.selectedBranchId != this.props.selectedBranchId) ||
          (nextProps.isOtherBranchesChooseable != this.props.isOtherBranchesChooseable) ||
          (nextProps.isInFreeZone != this.props.isInFreeZone) ||
          (nextProps.branchRegion != this.props.branchRegion) ||
          (nextProps.reginalOffice != this.props.reginalOffice) ||
          (nextProps.workGroupSync != this.props.workGroupSync) ||
          (nextProps.isCacheEnabled != this.props.isCacheEnabled) ||
          (nextProps.isOtherBranchesChooseableForGM != this.props.isOtherBranchesChooseableForGM) ||
          (nextProps.branchType != this.props.branchType) ||
          (nextProps.isUnitsSelectable != this.props.isUnitsSelectable) ||
          (nextProps.selectedBranchUnitId != this.props.selectedBranchUnitId) ||
          (nextProps.sortOption != this.props.sortOption) ||
          (nextProps.allOptionDescription != this.props.allOptionDescription)
        ) {

          let branchList = this.getValues().branchList;
          this.setValues(branchList, nextProps);
        }
      }
    }
  }

  /**
   * Get all branch from data base
   * @param {any} isCacheEnabled
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getAllBranches(isCacheEnabled) {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.BranchRequest',
      requestBody: {
        MethodName: 'GetAllBranches',
        IsCacheEnabled: isCacheEnabled
      },
      key: 'GetAllBranches'
    };
    this.proxyExecute(proxyRequest);
  }

  /**
   * Get branch by customer id
   * @param {any} customerId
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getBranchesByCustomerId(customerId) {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.BranchRequest',
      requestBody: {
        MethodName: 'GetBranchesByCustomerId',
        CustomerId: customerId
      },
      key: 'GetBranchesByCustomerId'
    };
    this.proxyExecute(proxyRequest);
  }

  /**
   * Get sub branch bb branch id
   * @param {any} branchId
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getAllBranchesUnitByBranchId(branchId, defaultBranchId) {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.BranchUnitRequest',
      requestBody: {
        MethodName: 'GetAllBranchesUnitByBranchId',
        DataContract: { branchId: branchId },
        defaultBranchId: defaultBranchId
      },
      key: 'GetAllBranchesUnitByBranchId'
    };
    this.proxyExecute(proxyRequest);
  }

  getAllOptionItemInstance() {
    let value = this.props.allOptionValue;
    if (value === null || value === undefined)
      value = this.nullValue;

    let item = {
      [this.state.valueMemberPath]: value,
      [this.state.displayMemberPath]: this.state.allOptionDescription
    };
    return item;
  }

  isAllOptionExists(branchList) {
    if (branchList && branchList.length > 0) {
      let index = branchList.findIndex(
        s => s[this.state.valueMemberPath] == this.getAllOptionItemInstance()[this.state.valueMemberPath]
      );
      return {
        isExists: index == -1 ? false : true,
        index: index
      };
    }
    return { isExists: false, index: -1 };
  }

  getSortedValues(branchList, props) {
    props = props || this.props;
    branchList = branchList || [];

    let sortOption = props.sortOption;
    let newList = [];
    switch (sortOption) {
      case SortOption.Code:
        newList = sortBy(branchList, 'branchId');
        break;
      case SortOption.Name:
        newList = sortBy(branchList, 'name');
        break;
      default:
        newList = branchList;
        break;
    }
    return newList;
  }

  /**
   * Filter branch by props
   * @param {any} branchList
   * @param {any} props
   */
  filterByProps(branchList, props) {
    branchList = branchList || [];
    if (props.branchType)
      branchList = branchList.filter((el) => {
        return el.branchType == props.branchType;
      }) || [];

    if (props.isInFreeZone)
      branchList = branchList.filter((el) => {
        return el.isInFreeZone == props.isInFreeZone;
      }) || [];

    if (props.reginalOffice)
      branchList = branchList.filter((el) => {
        return el.reginalOffice == props.reginalOffice;
      }) || [];

    if (props.branchRegion)
      branchList = branchList.filter((el) => {
        return el.region == props.branchRegion;
      }) || [];

    if (props.workGroupSync && props.isOtherBranchesChooseable) {
      if (branchList && branchList.length > 0) {
        let branchIds = this.props.applicationContext.user.workGroupBranchList;
        if (branchIds.length > 0) {
          let newList = [];
          branchIds.forEach(function (branchId) {
            var f = branchList.find(s => s[this.state.valueMemberPath] == branchId);
            if (f !== undefined) {
              newList.push(f);
            }
          }, this);
          branchList = newList;
        }
      }
    }

    if (props.isAllOptionIncluded) {
      var allOptionItem = this.isAllOptionExists(branchList);
      if (!allOptionItem.isExists && Array.isArray(branchList)) {
        branchList.unshift(this.getAllOptionItemInstance());
      }
    }

    return branchList || [];
  }

  /**
   * Load branch data from data base
   * @param props
   */
  loadData(props) {
    if (!this.state.branchList || this.state.branchList.length == 0) {
      props = props || this.props;
      if (props.customerId) {
        this.getBranchesByCustomerId(props.customerId);
      } else {
        this.getAllBranches(props.isCacheEnabled);
      }
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllBranches':
      case 'GetBranchesByCustomerId':
        if (response.success) {
          this.setValues(response.value, this.props);
        } else {
          this.clearValues();
        }
        break;
      case 'GetAllBranchesUnitByBranchId':
        if (response.success) {
          this.setSubValues(response.value, this.props.selectedBranchUnitId, this.props);
        }
        break;
      default:
        break;
    }
  }

  /**
   * Sort the Branches. Available options is BBranchComponent.SortOption.Code, BBranchComponent.SortOption.Name
   * @param sortOption
   */
  sortValues(sortOption) {
    if (!sortOption) return;

    let branchList = this.getValues().branchList;
    if (branchList && branchList.length > 0) {
      branchList = this.filterByProps(branchList, this.props);
      branchList = this.getSortedValues(branchList, sortOption);

      let allOptionItem = this.isAllOptionExists(branchList);
      if (allOptionItem.isExists) {
        branchList.splice(allOptionItem.index, 1);
        branchList.unshift(this.getAllOptionItemInstance());
      }
      this.setValues(branchList, this.props);
    }
  }

  /**
   * Clear values
   * @param isOnlyBranchUnit
   */
  clearValues() {
    if (this.props.isUnitsSelectable) {
      this.setState({
        branchList: [],
        subBranchList: []
      });
    }
    else {
      this.setState({ branchList: [] });
    }
  }

  /**
   * Reset the values
   */
  resetValue() {
    let selectedBranchId = this.props.defaultSelectedBranchId;
    if (this.props.isAllOptionIncluded) {
      if (this.props.defaultSelectedBranchId === null) {
        selectedBranchId = this.nullValue;
      }
    }
    if (this.props.isUnitsSelectable) {
      this.setState({
        selectedBranchId: selectedBranchId,
        selectedSubBranchId: this.props.defaultSelectedBranchUnitId,
        subBranchList: []
      });

      if (selectedBranchId) {
        this.getAllBranchesUnitByBranchId(selectedBranchId, this.props.defaultSelectedBranchUnitId);
      }
    }
    else {
      this.setState({ selectedBranchId: selectedBranchId });
    }
  }

  /**
   * Set the Branches by Branchs
   * @param branchList
   * @param props
   */
  setValues(branchList, props) {
    if (!Array.isArray((branchList))) {
      this.clearValues();
      return;
    }

    props = props || this.props;
    branchList = this.filterByProps(branchList, props);
    branchList = this.getSortedValues(branchList, props);

    let selectedId;
    if (props.isAllOptionIncluded && props.selectedBranchId === null)
      selectedId = this.nullValue;
    else
      selectedId = props.selectedBranchId || props.defaultSelectedBranchId;

    this.setState({
      branchList: branchList,
      selectedBranchId: selectedId
    });

    if (props.isUnitsSelectable) {
      if (props.selectedBranchUnitId) {
        this.getAllBranchesUnitByBranchId(selectedId, (isSuccess, value) => {
          if (isSuccess) {
            this.setSubValues(value, props.selectedBranchUnitId, props);
          }
        });
      }
    }
  }

  /**
   * Set sub branch list
   * @param {any} subBranchList
   * @param {any} selectedSubBranchId
   * @param {any} props
   */
  setSubValues(subBranchList, selectedSubBranchId, props) {
    if (!props) {
      props = this.props;
    }
    if (subBranchList && subBranchList.length > 0) {
      let firstId = subBranchList[0][this.state.valueMemberPathUnit];
      this.setState({
        subBranchList: subBranchList,
        selectedSubBranchId: selectedSubBranchId ? selectedSubBranchId : firstId
      });
    }
    else {
      this.setState({
        subBranchList: subBranchList,
        selectedSubBranchId: selectedSubBranchId
      });
    }
  }

  /**
   * Returns the list of branchs
   * @returns {{branchList: Array, subBranchList: Array}}
   */
  getValues() {
    return {
      branchList: this.state.branchList || [],
      subBranchList: this.state.subBranchList || []
    };
  }

  /**
   * Returns the selected branch.
   * @returns {{branch: {}, subBranch: {}}}
   */
  getValue() {
    let item = this.BComboBox.getValue();
    if (!item) return undefined;
    let subBranch;
    let branchList = this.getValues().branchList;
    let branch = Object.assign({}, branchList.find(s => s[this.state.valueMemberPath] == item.value));
    if (this.props.isAllOptionIncluded) {
      if (branch) {
        if (branch[this.state.valueMemberPath] == this.nullValue) {
          branch = this.props.allOptionValue;
        }
      }
    }
    if (this.props.isUnitsSelectable) {
      let subitem = this.BComboBoxUnit.getValue();
      if (subitem) {
        let subBranchList = this.getValues().subBranchList;
        subBranch = subBranchList.find(s => s[this.state.valueMemberPathUnit] == subitem.value);
      }
    }
    return {
      branch: branch,
      subBranch: subBranch
    };
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
  handleOnBranchSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let selectedBranchContract = selectedItems[0];
      let selectedBranchId = selectedValues[0];
      this.setState({
        selectedBranchId: selectedBranchId,
        selectedSubBranchId: undefined,
        labelText: selectedItems[0].name
      });
      if (this.props.isAllOptionIncluded && selectedBranchId == this.nullValue) {
        if (this.props.onBranchSelect)
          this.props.onBranchSelect(this.props.allOptionValue);
      }
      else {
        if (this.props.onBranchSelect)
          this.props.onBranchSelect(selectedBranchContract);
      }
      if (this.props.isUnitsSelectable) {
        this.getAllBranchesUnitByBranchId(selectedBranchId, (isSuccess, value) => {
          if (isSuccess) {
            this.setSubValues(value, undefined, this.props);
          }
        });
      }
    }
    else {
      this.setState({ subBranchList: [] });
      if (this.props.onBranchSelect)
        this.props.onBranchSelect(undefined);
    }
  }

  /**
   * Handle function fired when a branch unit is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnSubBranchSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      this.setState({ selectedSubBranchId: selectedValues[0] });
      if (this.props.onSubBranchSelect)
        this.props.onSubBranchSelect(selectedItems[0]);
    }
    else {
      if (this.props.onSubBranchSelect)
        this.props.onSubBranchSelect(undefined);
    }
  }

  validateConstraint() {
    return this.BComboBox ? this.BComboBox.validateConstraint() : true;
  }

  render() {
    let branchColumns = [
      { key: 'branchId', name: this.getMessage('BusinessComponents', 'BranchCodeLabel'), width: 85, resizable: true },
      { key: 'name', name: this.getMessage('BusinessComponents', 'Branch'), width: 300, resizable: true }];

    let branchUnitColumns = [
      { key: 'unitId', name: this.getMessage('BusinessComponents', 'BranchCodeLabel'), width: 85, type: 'number', resizable: true },
      { key: 'name', name: this.getMessage('BusinessComponents', 'SubBranch'), width: 200, resizable: true },
      { key: 'branchName', name: this.getMessage('BusinessComponents', 'Branch'), width: 180, resizable: true }];

    var commonStyle = { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right', width: '50%', minHeight: 1 };
    var branchStyle, unitStyle = {};
    if (this.props.isUnitsSelectable && this.props.mode == 'horizontal') {
      branchStyle = Object.assign(commonStyle, { paddingRight: 5 });
      unitStyle = Object.assign(commonStyle, { paddingLeft: 5 });
    }

    return (
      <div>
        <div style={branchStyle}>
          <BComboBox
            {...this.props}
            ref={r => this.BComboBox = r}
            context={this.props.context}
            columns={branchColumns}
            valueMemberPath={this.state.valueMemberPath}
            displayMemberPath={this.state.displayMemberPath}
            value={[this.state.selectedBranchId]}
            dataSource={this.state.branchList}
            multiColumn={true}
            multiSelect={false}
            isAllOptionIncluded={false} /* we will manage */
            onSelect={this.handleOnBranchSelect}
            hintText={this.props.hintText || this.getMessage('BusinessComponents', 'Branch')}
            labelText={this.props.labelText || this.getMessage('BusinessComponents', 'Branch')}
            disabled={this.props.disabled}
            disableSearch={this.props.disableSearch}
            errorText={this.props.errorTextBranch} />
        </div>
        {this.props.isUnitsSelectable ?
          <div style={unitStyle}>
            <BComboBox
              ref={r => this.BComboBoxUnit = r}
              context={this.props.context}
              columns={branchUnitColumns}
              valueMemberPath={this.state.valueMemberPathUnit}
              displayMemberPath={this.state.displayMemberPathUnit}
              value={[this.state.selectedSubBranchId]}
              dataSource={this.state.subBranchList}
              multiColumn={true}
              multiSelect={false}
              isAllOptionIncluded={false}
              onSelect={this.handleOnSubBranchSelect}
              hintText={this.props.hintTextUnit || this.getMessage('BusinessComponents', 'SubBranch')}
              labelText={this.props.labelTextUnit || this.getMessage('BusinessComponents', 'SubBranch')}
              disabled={this.props.disabledUnit || this.props.disabled}
              disableSearch={this.props.disableSearchUnit}
              errorText={this.props.errorTextUnit}
            /> </div> : <div />
        }
      </div>
    );
  }
}

BBranchComponent.SortOption = SortOption;
export default BBranchComponent;
