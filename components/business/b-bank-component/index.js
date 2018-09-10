import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';
import { BProgress } from 'b-progress';

export var Behaviour;
(function (Behaviour) {
  Behaviour[(Behaviour['Bank'] = 1)] = 'Bank';
  Behaviour[(Behaviour['BankCity'] = 2)] = 'BankCity';
  Behaviour[(Behaviour['BankCityBranch'] = 3)] = 'BankCityBranch';
  Behaviour[(Behaviour['BankBranch'] = 4)] = 'BankBranch';
})(Behaviour || (Behaviour = {}));

@BComponentComposer
export class BBankComponent extends BBusinessComponent {
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    selectedBankId: null,
    selectedCityId: null,
    selectedBranchId: null,
    defaultSelectedBankId: null,
    defaultSelectedCityId: null,
    defaultSelectedBranchId: null,
    behaviourType: Behaviour.Bank,
    hintTextBank: null,
    labelTextBank: null,
    hintTextCity: null,
    labelTextCity: null,
    hintTextBranch: null,
    labelTextBranch: null
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the bank that is currently selected
     * @type {number}
     */
    selectedBankId: PropTypes.number,

    /**
     * Determines the city that is currently selected
     * @type {number}
     */
    selectedCityId: PropTypes.number,

    /**
     * Determines the branch that is currently selected
     * @type {number}
     */
    selectedBranchId: PropTypes.number,

    /**
     * Determines the bank type
     * @type {number}
     */
    bankType: PropTypes.number,

    /**
     * Determines the closed or not closed banks
     * @type {boolean}
     */
    isClosedBanksInclude: PropTypes.bool,

    bankListDisabled: PropTypes.bool,
    bankListDisableSearch: PropTypes.bool,
    cityListDisabled: PropTypes.bool,
    cityListDisableSearch: PropTypes.bool,
    branchListDisabled: PropTypes.bool,
    branchListDisableSearch: PropTypes.bool,

    /**
     * Bileşendeki hangi listelerin açık olacağını belirler.
     * @type {string or number}
     */
    behaviourType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Callback function fires when a bank has been selected.
     * @type {func}
     */
    onBankSelect: PropTypes.func,

    /**
     * Callback function fires when a city has been selected.
     * @type {func}
     */
    onCitySelect: PropTypes.func,

    /**
     * Callback function fires when a branch has been selected.
     * @type {func}
     */
    onBranchSelect: PropTypes.func,

    errorTextBank: PropTypes.string,
    errorTextCity: PropTypes.string,
    errorTextBranch: PropTypes.string
  };

  state = {
    bankList: [],
    cityList: [],
    branchList: [],
    selectedBankId: this.props.selectedBankId,
    selectedCityId: this.props.selectedCityId,
    selectedBranchId: this.props.selectedBranchId,
    selectedBank: null,
    selectedCity: null,
    selectedBranch: null,
    valueMemberPathBank: 'bankId',
    valueMemberPathCity: 'cityId',
    valueMemberPathBranch: 'extendedBranchId'
  };

  currentProps = {};

  loadingIcon = (
    <BProgress
      context={this.props.context}
      size={20}
      progressType={'circular'}
      mode={'indeterminate'}
      style={{
        color: this.props.context.theme.boaPalette.sec500,
        position: 'absolute',
        top: '30%',
        right: !this.props.context.localization.isRightToLeft ? '3px' : 'auto'
      }}
    />
  );

  constructor(props, context) {
    super(props, context);
    this.handleOnBankSelect = this.handleOnBankSelect.bind(this);
    this.handleOnCitySelect = this.handleOnCitySelect.bind(this);
    this.handleOnBranchSelect = this.handleOnBranchSelect.bind(this);
    this.currentProps = Object.assign({}, this.props);
  }

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    super.componentDidMount();
    this.getBankList();
  }

  /**
   * Invoked before a mounted component receives new props
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.currentProps = Object.assign({}, nextProps);

      if (
        nextProps.bankType !== this.props.bankType ||
        nextProps.isClosedBanksInclude !== this.props.isClosedBanksInclude ||
        nextProps.selectedBankId !== this.state.selectedBankId
      ) {
        this.getBankList();
      }

      if (nextProps.behaviourType !== this.props.behaviourType) {
        this.setBankValues(this.state.selectedBankId);
      }

      if (nextProps.selectedCityId !== this.state.selectedCityId) {
        this.setCityValues(nextProps.selectedCityId);
      }
      if (nextProps.selectedBranchId !== this.state.selectedBranchId) {
        this.setBranchValues(nextProps.selectedBranchId);
      }
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GET_BANK_LIST': {
        this.getBankList(response);
        break;
      }
      case 'GET_BANK_CITY_LIST': {
        this.getBankCityList(params.bankId, response);
        break;
      }
      case 'GET_BANK_CITY_BRANCH_LIST': {
        this.getBankCityBranchList(params.bankId, params.cityId, response);
        break;
      }
      case 'GET_BANK_BRANCH_LIST': {
        this.getBankBranchList(params.bankId, response);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Load bank list from database
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getBankList(response) {
    if (this.state.bankList && this.state.bankList.length > 0)
     { return null;}  
    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.BankRequest',
        requestBody: {
          MethodName: 'GetBankList',
          IsClosedBanksInclude: this.currentProps.isClosedBanksInclude
        },
        key: 'GET_BANK_LIST'
      };
      this.proxyExecute(request);
      return;
    }

    if (response && response.success) {
      this.setBankValues(this.currentProps.selectedBankId, response.value);
    } else {
      this.setState({ bankList: [] });
    }
  }

  /**
   * Load bank list from database by bank id
   * @param bankId
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getBankCityList(bankId, response) {
    if (this.state.cityList && this.state.cityList.length > 0 )
    { return null;} 
    if (!bankId) return;
    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.BankRequest',
        requestBody: {
          MethodName: 'GetBankCityList',
          BankId: bankId
        },
        key: 'GET_BANK_CITY_LIST',
        params: { bankId: bankId }
      };
      this.proxyExecute(request);
      return;
    }

    if (response.success) {
      this.setCityValues(this.props.selectedCityId, response.value || []);
    } else {
      this.setState({ cityList: [] });
    }
  }

  /**
   * Load bank city of branch from database by bank id and city id
   * @param bankId
   * @param cityId
   * @param {any} response (isSuccess: bool, value: any)
   */
  getBankCityBranchList(bankId, cityId, response) {
    if (this.state.branchList && this.state.branchList.length > 0 )
    { return null;} 
    if (!cityId) return;

    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.BankRequest',
        requestBody: {
          MethodName: 'GetBankCityBranchList',
          BankId: bankId,
          CityId: cityId,
          IsClosedBanksInclude: this.currentProps.isClosedBanksInclude
        },
        key: 'GET_BANK_CITY_BRANCH_LIST',
        params: { bankId: bankId, cityId: cityId }
      };
      this.proxyExecute(request);
      return;
    }

    if (response.success) {
      this.setBranchValues(this.currentProps.selectedBranchId, response.value || []);
    } else {
      this.setState({ branchList: [] });
    }
  }

  /**
   * Load bank branch data from data base by bank id
   * @param bankId
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getBankBranchList(bankId, response) {
    if (this.state.branchList && this.state.branchList.length > 0)
    { return null;} 
    if (!bankId) return;

    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.BankRequest',
        requestBody: {
          MethodName: 'GetBankBranchList',
          BankId: bankId,
          IsClosedBanksInclude: this.props.isClosedBanksInclude
        },
        key: 'GET_BANK_BRANCH_LIST',
        params: { bankId: bankId }
      };

      this.proxyExecute(request);
      return;
    }

    if (response.success) {
      this.setBranchValues(this.props.selectedBranchId, response.value || []);
    } else {
      this.setState({ branchList: [] });
    }
  }

  /**
   * Set bank values by bank list
   * @param bankList
   */
  setBankValues(bankId, bankList) {
    bankList = bankList || this.state.bankList;
    let selectedBank = bankList.find(s => s[this.state.valueMemberPathBank] == bankId);

    this.setState({
      bankList: bankList,
      selectedBank: selectedBank,
      selectedBankId: bankId,
      selectedBranch: null,
      selectedCity: null
    });
    this.props.onBankSelect && this.props.onBankSelect(selectedBank);

    if (this.isCityVisible()) {
      this.getBankCityList(bankId);
    }

    if (this.props.behaviourType === Behaviour.BankBranch) {
      this.getBankBranchList(bankId);
    }
  }

  /**
   * Set city values by city list
   * @param cityList
   */
  setCityValues(selectedCityId, cityList) {
    if (!this.isCityVisible()) return;

    cityList = cityList || this.state.cityList || [];
    if (cityList.length === 0) return;
    let selectedCity = cityList.find(s => s[this.state.valueMemberPathCity] == selectedCityId);

    this.setState({
      cityList: cityList,
      selectedCityId: selectedCityId,
      selectedCity: selectedCity,
      selectedBranch: null
    });

    // Eğer city değişmemişse tekrar tetiklenmesin
    // if (selectedCityId !== stateSelectedCityId) {
    this.props.onCitySelect && this.props.onCitySelect(selectedCity);
    // }

    if (this.props.behaviourType == Behaviour.BankCityBranch) {
      this.getBankCityBranchList(this.state.selectedBankId, selectedCityId);
    }
  }

  /**
   * Set branch values by branch lsit
   * @param branchList
   */
  setBranchValues(selectedBranchId, branchList) {
    if (!this.isBranchVisible()) return;
    branchList = branchList || this.state.branchList || [];

    let selectedBranch = branchList.find(s => s[this.state.valueMemberPathBranch] == selectedBranchId);
    this.setState({
      branchList: branchList,
      selectedBranchId: selectedBranchId,
      selectedBranch: selectedBranch
    });
    this.props.onBranchSelect && this.props.onBranchSelect(selectedBranch);
  }

  /**
   * Return the selected bank that is currently selected
   * @returns {{bank: {}, city: {}, branch: {}}}
   */
  getValue() {
    return {
      bank: this.state.selectedBank,
      city: this.state.selectedCity,
      branch: this.state.selectedBranch
    };
  }

  /**
   * Get the data list
   * @returns {{bankList: Array, cityList: Array, branchList: Array}}
   */
  getValues() {
    return {
      bankList: this.state.bankList || [],
      cityList: this.state.cityList || [],
      branchList: this.state.branchList || []
    };
  }

  resetValue() {
    this.setState({
      selectedBankId: this.props.defaultSelectedBankId,
      selectedCityId: this.props.defaultSelectedCityId,
      selectedBranchId: this.props.defaultSelectedBranchId
    });
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  /**
   * Handle function fired when a bank is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnBankSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let bankId = selectedValues[0];
      this.setBankValues(bankId);
    }
  }

  /**
   * Handle function fired when a city is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnCitySelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let selectedCityId = selectedValues[0];
      this.setCityValues(selectedCityId);
    }
  }

  /**
   * Handle function fired when a branch is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnBranchSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let branchId = selectedValues[0];
      this.setBranchValues(branchId);
    }
  }

  isCityVisible() {
    return this.currentProps.behaviourType == Behaviour.BankCity || this.currentProps.behaviourType == Behaviour.BankCityBranch;
  }

  isBranchVisible() {
    return this.currentProps.behaviourType == Behaviour.BankCityBranch || this.currentProps.behaviourType == Behaviour.BankBranch;
  }

  render() {
    let { context } = this.props;

    let bankColumns = [
      { key: 'bankId', name: this.getMessage('CoreBanking', 'LabelBankCodeNumber'), width: 100, type: 'number', resizable: true },
      { key: 'name', name: this.getMessage('CoreBanking', 'BankName'), width: 300, type: 'string', resizable: true }
    ];

    let cityColumns = [
      { key: 'cityId', name: this.getMessage('CoreBanking', 'LabelCodeNumber'), width: 100, type: 'number', resizable: true },
      { key: 'name', name: this.getMessage('CoreBanking', 'CityLabel'), width: 250, type: 'string', resizable: true }
    ];

    let branchColumns = [
      { key: 'extendedBranchId', name: this.getMessage('CoreBanking', 'LabelCodeNumber'), width: 100, type: 'number', resizable: true },
      { key: 'name', name: this.getMessage('CoreBanking', 'BranchName'), width: 250, type: 'string', resizable: true }
    ];

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <BComboBox
            ref={r => (this.comboBoxBankList = r)}
            hintText={this.props.hintTextBank || this.getMessage('BusinessComponents', 'BankNameLabel')}
            labelText={this.props.labelTextBank || this.getMessage('BusinessComponents', 'BankList')}
            context={context}
            columns={bankColumns}
            valueMemberPath={this.state.valueMemberPathBank}
            displayLabelSeperator={' -'}
            displayLabelMemberPath={['bankId', 'name']}
            value={[this.state.selectedBankId]}
            dataSource={this.state.bankList}
            multiColumn={true}
            multiSelect={false}
            isAllOptionIncluded={false}
            onSelect={this.handleOnBankSelect}
            disabled={this.props.bankListDisabled}
            disableSearch={this.props.bankListDisableSearch}
            errorText={this.props.errorTextBank}
          />
          {this.state.isLoading && this.loadingIcon}
        </div>

        {this.isCityVisible() && (
          <BComboBox
            ref={r => (this.comboBoxCityList = r)}
            hintText={this.props.hintTextCity || this.getMessage('BusinessComponents', 'CityLabel')}
            labelText={this.props.labelTextCity || this.getMessage('BusinessComponents', 'CityList')}
            context={context}
            columns={cityColumns}
            valueMemberPath={this.state.valueMemberPathCity}
            displayLabelSeperator={' -'}
            displayLabelMemberPath={['cityId', 'name']}
            value={[this.state.selectedCityId]}
            dataSource={this.state.cityList}
            multiColumn={true}
            multiSelect={false}
            isAllOptionIncluded={false}
            onSelect={this.handleOnCitySelect}
            disabled={this.props.cityListDisabled}
            disableSearch={this.props.cityListDisableSearch}
            errorText={this.props.errorTextCity}
          />
        )}

        {this.isBranchVisible() && (
          <BComboBox
            ref={r => (this.comboBoxBranchList = r)}
            hintText={this.props.hintTextBranch || this.getMessage('BusinessComponents', 'Branch_2')}
            labelText={this.props.labelTextBranch || this.getMessage('CoreBanking', 'BranchList')}
            context={context}
            columns={branchColumns}
            valueMemberPath={this.state.valueMemberPathBranch}
            displayLabelSeperator={' -'}
            displayLabelMemberPath={['extendedBranchId', 'name']}
            value={[this.state.selectedBranchId]}
            dataSource={this.state.branchList}
            multiColumn={true}
            multiSelect={false}
            isAllOptionIncluded={false}
            onSelect={this.handleOnBranchSelect}
            disabled={this.props.branchListDisabled}
            disableSearch={this.props.branchListDisableSearch}
            errorText={this.props.errorTextBranch}
          />
        )}
      </div>
    );
  }
}

BBankComponent.Behaviour = Behaviour;
export default BBankComponent;
