import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BBranchComponent } from 'b-branch-component';
import { BParameterComponent } from 'b-parameter-component';
import { BComponent, Utils } from 'b-component';
import { BComboBox } from 'b-combo-box';
import { BInput } from 'b-input';
import { BInputNumeric } from 'b-input-numeric';
import { BLabel } from 'b-label';
import { BTabBar } from 'b-tab-bar';
import { BCheckBox } from 'b-check-box';
import { BTransactionForm } from 'b-transaction-form';
import { BBaseForm } from 'b-base-form';
import { BDataGrid } from 'b-data-grid';
import { BScroll } from 'b-scroll';
import { BCard } from 'b-card';
import { BDialogHelper } from 'b-dialog-box';
import { BDivider } from 'b-divider';

let ElementResizeDetectorMaker = require('element-resize-detector');

export class CustomerAccountSearchDialog extends BBusinessComponent {
  static propTypes = {
    /**
     * BBaseForm prop types.
     */
    ...BBaseForm.propTypes,
    /**
     * Criteria pane expanded/collapsed status. Default true (expanded).
     */
    criteriaPanelExpanded: PropTypes.bool,
    /**
     * Criteria pane can expandable status. Default true (expandable).
     */
    criteriaPanelExpandable: PropTypes.bool,

    /**
     * Datagrid data source.
     */
    dataSource: PropTypes.array.isRequired,
    /**
     * Datagrid columns definition.
     */
    columns: PropTypes.object,
    /**
     * Datagrid auto generate column ability. Default false.
     */
    autogenerateColumns: PropTypes.bool,
    /**
     * Datagrid selected row indexes.
     */
    selectedIndexes: PropTypes.arrayOf(PropTypes.number),

    fECList: PropTypes.array,
    fECListBanned: PropTypes.array,
    productCodeList: PropTypes.array,
    productCodeListBanned: PropTypes.array,
    productTypeList: PropTypes.array,
    productGroupList: PropTypes.array
  };

  static defaultProps = {
    leftPaneWidth: 270,
    leftPaneMaxWidth: 511,
    criteriaPanelExpanded: true,
    criteriaPanelExpandable: true,
    autogenerateColumns: false,
    selectedIndexes: [],

    fECList: [],
    fECListBanned: [],
    productCodeList: [],
    productCodeListBanned: [],
    productTypeList: [],
    productGroupList: []
  };

  state = {
    criteriaExpanded: this.props.criteriaPanelExpanded,
    customerList: [],
    favouriteCustomerList: [],
    accountList: [],

    isActive: true,
    isPassive: false,
    isIndividual: true,
    isCorporate: false,
    branchId: null,
    cityId: null,
    shortName: null,
    fatherName: null,
    birthYear: null,

    selectedCriteriaValue: 0,
    criteriaValue: null,
    criteriaBarIndex: 0,
    contentBarIndex: 0,
    tempCriteriaValue: ''
  };

  cardMargin = 24;
  customerListHeaderBarOptions = {
    show: true,
    showTitle: true,
    showMoreOptions: true,
    title: this.getMessage('BusinessComponents', 'Customers')
  };

  favoriteCustomerListHeaderBarOptions = {
    show: true,
    showTitle: true,
    showMoreOptions: true,
    title: this.getMessage('BusinessComponents', 'FavoriteCustomers')
  };

  accountListHeaderBarOptions = {
    show: true,
    showTitle: true,
    showMoreOptions: true,
    title: this.getMessage('BusinessComponents', 'Accounts')
  };

  accountGridColumnSet = [
    { key: 'branchId', name: this.getMessage('BusinessComponents', 'BranchCodeLabel'), resizable: true },
    { key: 'branchName', name: this.getMessage('BusinessComponents', 'Branch'), resizable: true },
    { key: 'accountNumber', name: this.getMessage('BusinessComponents', 'CustomerNo_2'), resizable: true },
    { key: 'accountSuffix', name: this.getMessage('BusinessComponents', 'AccountSuffix'), resizable: true },
    { key: 'fecDesc', name: this.getMessage('BusinessComponents', 'ForeignExchangeType'), resizable: true },
    { key: 'ledgerId', name: this.getMessage('BusinessComponents', 'Account'), resizable: true }
  ];

  customerGridColumnSet = [
    { key: 'shortName', name: this.getMessage('BusinessComponents', 'ShortName'), resizable: true },
    { key: 'accountNumber', name: this.getMessage('BusinessComponents', 'CustomerNo_2'), resizable: true },
    { key: 'fatherName', name: this.getMessage('BusinessComponents', 'FatherName'), resizable: true },
    { key: 'birthDate', name: this.getMessage('BusinessComponents', 'BirthDate'), resizable: true },
    { key: 'address', name: this.getMessage('BusinessComponents', 'Address'), resizable: true }
  ];

  constructor(props, context) {
    super(props, context);
    this.onBranchSelect = this.onBranchSelect.bind(this);
    this.onCityParameterChanged = this.onCityParameterChanged.bind(this);
    this.onCustomerGridSelectionChanged = this.onCustomerGridSelectionChanged.bind(this);
    this.resizeDetector = ElementResizeDetectorMaker();
    if (Utils.isMobile(props)) {
      this.state.criteriaExpanded = false;
    }
  }

  actionBarButtonClick(e) {
    if (e.commandName == 'Search') {
      // Bilgi Getir
      this.transactionForm.showProgress();
      if (this.state.contentBarIndex == 0) {
        if (this.state.criteriaBarIndex == 0) this.getInfoActionClicked();
        else this.getInfoByCustomCriteriaActionClicked();
      } else {
        this.getInfoByFavouriteActionClicked();
      }
    } else if (e.commandName == 'Clean') {
      this.cleanClicked();
    } else if (e.commandName == 'Ok') {
      this.okClicked();
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;

    switch (key) {
      case 'GET_ACCOUNT_INFO': {
        this.getInfoActionClicked(response);
        break;
      }
      case 'GET_INFO_BY_FAVOURITY': {
        this.getInfoByFavouriteActionClicked(response);
        break;
      }
      case 'GET_INFO_BY_CUSTOMER_CRITERIA': {
        this.getInfoByCustomCriteriaActionClicked(response);
        break;
      }
      case 'GET_ALL_CUSTOMER_INFO': {
        this.selectCustomerAccountList(params.accountNumber, response);
        break;
      }
      default:
        break;
    }
  }

  getInfoByCustomCriteriaActionClicked(response) {
    var accountStateOption = null;
    if (this.state.isActive && !this.state.isPassive) accountStateOption = 1;
    else if (!this.state.isActive && this.state.isPassive) accountStateOption = 0;
    else if (!this.state.isActive && !this.state.isPassive) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'PleaseEnterSearchValue'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.transactionForm.hideProgress();
      return;
    }

    var personType = null;
    if (this.state.isIndividual && !this.state.isCorporate) personType = 'B';
    else if (!this.state.isIndividual && this.state.isCorporate) personType = 'K';
    else if (!this.state.isIndividual && !this.state.isCorporate) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'PleaseEnterSearchValue'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.transactionForm.hideProgress();
      return;
    }

    var tempCriteriaValue = this.detailCriteriaFilterField.getInstance().getValue();
    if (tempCriteriaValue == null) tempCriteriaValue = '';

    var request = {
      accountStatus: accountStateOption,
      branchId: this.state.branchId == -1 ? undefined : this.state.branchId,
      customerType: personType,
      criteria: this.state.selectedCriteriaValue + 1,
      searchFor: tempCriteriaValue.toString().replace(' ', ''),
      methodName: 'Call',
      resourceId: this.props.resourceInfo.resourceId
    };

    if (!response) {
      var _request = {
        requestClass: 'BOA.Types.BusinessComponents.CustomerAccountSearchDialog2Request',
        requestBody: request,
        key: 'GET_INFO_BY_CUSTOMER_CRITERIA'
      };
      this.proxyExecute(_request);
      return;
    }

    this.setState({
      criteriaValue: tempCriteriaValue.toString()
    });

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        response.results[0].errorMessage,
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
    if (response.value.length == 0) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'CustomerDidNotMatchYourCriteria'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
    this.setState({ customerList: response.value, accountList: [] });
    this.transactionForm.hideProgress();
  }

  getInfoActionClicked(response) {
    var accountStateOption = undefined;
    if (this.state.isActive && !this.state.isPassive) accountStateOption = 1;
    else if (!this.state.isActive && this.state.isPassive) accountStateOption = 0;
    else if (!this.state.isActive && !this.state.isPassive) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'PleaseEnterSearchValue'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.transactionForm.hideProgress();
      return;
    }

    var personType = undefined;
    if (this.state.isIndividual && !this.state.isCorporate) personType = 'B';
    else if (!this.state.isIndividual && this.state.isCorporate) personType = 'K';
    else if (!this.state.isIndividual && !this.state.isCorporate) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'PleaseEnterSearchValue'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.transactionForm.hideProgress();
      return;
    }

    var nameFilter = this.searchNameInput.getInstance().getValue() || '';
    if (nameFilter == null || nameFilter.length < 3) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'PleaseEnterShortNameValue'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.transactionForm.hideProgress();
      return;
    }

    nameFilter = nameFilter.length > 0 ? '%' + nameFilter + '%' : undefined;

    var fathernameFilter = this.searchFathersNameInput.getInstance().getValue() || '';
    fathernameFilter = fathernameFilter.length > 0 ? '%' + fathernameFilter + '%' : undefined;

    // var selectedBranch = this.branchOption.getValue();
    // var selectedBranchId = (selectedBranch && selectedBranch.branch) ? selectedBranch.branch.branchId : undefined;

    var birthYear = this.birthDateInput.getValue().value;
    var request = {
      accountStatus: accountStateOption,
      branchId: this.state.branchId == -1 ? undefined : this.state.branchId,
      customerType: personType,
      name: nameFilter,
      firmName: nameFilter,
      fatherName: fathernameFilter,
      yearOfBirth: birthYear ? birthYear.toString() : undefined,
      city: this.state.cityId == '-1' ? undefined : this.state.cityId,
      establismentCityId: this.state.cityId == '-1' ? undefined : this.state.cityId,
      methodName: 'Call',
      resourceId: this.props.resourceInfo.resourceId
    };

    if (this.state.isIndividual) request.firmName = undefined;
    else request.name = undefined;

    this.setState({
      shortName: this.searchNameInput.getInstance().getValue(),
      fatherName: this.searchFathersNameInput.getInstance().getValue(),
      birthYear: birthYear
    });

    if (!response) {
      var _request = {
        requestClass: 'BOA.Types.BusinessComponents.CustomerAccountSearchDialogRequest',
        requestBody: request,
        key: 'GET_ACCOUNT_INFO'
      };
      this.proxyExecute(_request);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        response.results[0].errorMessage,
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
    if (response.value.length == 0) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'CustomerDidNotMatchYourCriteria'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
    this.setState({ customerList: response.value, accountList: [] });
    this.transactionForm.hideProgress();
  }

  getInfoByFavouriteActionClicked(response) {
    var userName = '';
    if (this.props.context && this.props.context.applicationContext && this.props.context.applicationContext.user) {
      userName = this.props.context.applicationContext.user.userName;
    }

    var request = {
      userName: userName,
      methodName: 'GetAccountComponentFavoriteCustomers',
      resourceId: this.props.resourceInfo.resourceId
    };

    if (!response) {
      var _request = {
        requestClass: 'BOA.Types.BusinessComponents.AccountComponentFavoriteCustomersRequest',
        requestBody: request,
        key: 'GET_INFO_BY_FAVOURITY'
      };
      this.proxyExecute(_request);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        response.results[0].errorMessage,
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
    if (response.value.length == 0) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'CustomerDidNotMatchYourCriteria'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
    this.setState({ favouriteCustomerList: response.value });
    this.transactionForm.hideProgress();
  }

  cleanClicked() {
    this.setState({
      customerList: [],
      accountList: [],
      favouriteCustomerList: [],
      shortName: '',
      fatherName: '',
      birthYear: null,
      isActive: true,
      isPassive: false,
      isCorporate: false,
      isIndividual: true,
      branchId: -1,
      cityId: '-1',
      selectedCriteriaValue: 0,
      tempCriteriaValue: ''
    });

    if (this.searchNameInput) this.searchNameInput.getInstance().resetValue();
    if (this.searchFathersNameInput) this.searchFathersNameInput.getInstance().resetValue();
    if (this.birthDateInput) this.birthDateInput.getInstance().resetValue();
    if (this.detailCriteriaFilterField) this.detailCriteriaFilterField.getInstance().resetValue();
  }

  okClicked() {
    var selectedAccount = { accountNumber: null, accountSuffix: null };
    var selectedRow: any = null;
    if (this.state.contentBarIndex == 0) {
      if (this.customerDataGrid) {
        selectedRow = this.getSelectedRows(this.customerDataGrid);
      }
      if (selectedRow && selectedRow.length > 0) {
        selectedAccount.accountNumber = selectedRow[0].accountNumber;
      } else {
        BDialogHelper.show(
          this.props.context,
          this.getMessage('BusinessComponents', 'PleaseSelectRecord'),
          BComponent.DialogType.Error,
          BComponent.DialogResponseStyle.OK
        );
        return;
      }

      if (this.accountDataGrid) {
        selectedRow = this.getSelectedRows(this.accountDataGrid);
        if (selectedRow && selectedRow.length > 0) selectedAccount.accountSuffix = selectedRow[0].accountSuffix;
      }
    } else {
      if (this.favouriteCustomerDataGrid) {
        selectedRow = this.getSelectedRows(this.favouriteCustomerDataGrid);
      }
      if (selectedRow && selectedRow.length > 0) {
        selectedAccount.accountNumber = selectedRow[0].accountNumber;
      } else {
        BDialogHelper.show(
          this.props.context,
          this.getMessage('BusinessComponents', 'PleaseSelectRecord'),
          BComponent.DialogType.Error,
          BComponent.DialogResponseStyle.OK
        );
        return;
      }
    }

    if (selectedAccount.accountNumber) {
      this.close(selectedAccount);
    } else {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'PleaseSelectRecord'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
    }
  }

  onCloseClick(e) {
    this.close(null);
    if (this.props.onClosing) this.props.onClosing(e);
  }

  close(dialogResponse) {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE, dialogResponse);
  }

  componentWillReceiveProps(nextProps) {
    let criteriaExpanded = nextProps.criteriaPanelExpanded;
    if (this.state.criteriaExpanded != criteriaExpanded) {
      this.setState({ criteriaExpanded: criteriaExpanded });
    }
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.datagridDiv) {
      this.resizeDetector.listenTo(this.datagridDiv, this.onResizeParent.bind(this));
    }

    this.cleanClicked();
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    if (this.datagridDiv) {
      this.resizeDetector.uninstall(this.datagridDiv);
    }
  }

  onResizeParent() {
    if (this.datagridDiv) {
      let width = this.datagridDiv.offsetWidth;
      let height = this.datagridDiv.offsetHeight;
      this.updateGridSize(width, height);
    }
  }

  updateGridSize(width, height) {
    var cardHeight = (height - this.cardMargin * 3 - 50) / 2; // bu logic sıkıntılı bir logic (coral)
    this.setState({ gridWidth: width, gridHeight: height, cardHeight: cardHeight });
    this.customerDataGrid.setSize(width, cardHeight);
    this.accountDataGrid.setSize(width, cardHeight);
    this.favouriteCustomerDataGrid.setSize(width, cardHeight);
  }

  onCriteriaPanelChanged(e, value) {
    this.setState({ criteriaBarIndex: value });
  }

  onContentPanelChanged(e, value) {
    this.setState({ contentBarIndex: value });
  }

  onCustomerGridSelectionChanged(dataItem) {
    if (dataItem) this.selectCustomerAccountList(dataItem.accountNumber);
  }

  getSelectedRows(grid) {
    let selectedIndexes = grid.getSelectedRowIndexes();
    let selectedRows = [];
    let dataSource = grid.props.dataSource;
    if (dataSource && dataSource.length > 0 && selectedIndexes && selectedIndexes.length > 0) {
      selectedIndexes.map(index => (selectedRows = selectedRows.concat(dataSource.filter(i => dataSource.indexOf(i) == index))));
    }
    return selectedRows;
  }

  selectCustomerAccountList(accountNumber, response) {
    if (!response) {
      var request = {
        AccountNumber: accountNumber,
        MethodName: 'GetAllCustomerInfo',
        FECGroupList: this.props.fECGroupList,
        FECList: this.props.fECList,
        FECListBanned: this.props.fECListBanned,
        ProductCodeList: this.props.productCodeList,
        ProductCodeListBanned: this.props.productCodeListBanned,
        ProductGroupList: this.props.productGroupList
      };

      var _request = {
        requestClass: 'BOA.Types.BusinessComponents.AccountComponentCustomerAllInfoRequest',
        requestBody: request,
        key: 'GET_ALL_CUSTOMER_INFO',
        params: { accountNumber: accountNumber }
      };
      this.proxyExecute(_request);
      return;
    }

    if (!response.success) {
      BDialogHelper.show(
        this.props.context,
        response.results[0].errorMessage,
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.setState({ accountList: [] });
      return null;
    }
    if (!response.value || !response.value['customerInfo']) {
      BDialogHelper.show(
        this.props.context,
        this.getMessage('BusinessComponents', 'CustomerDidNotMatchYourCriteria'),
        BComponent.DialogType.Error,
        BComponent.DialogResponseStyle.OK
      );
      this.setState({ accountList: [] });
    } else {
      this.setState({ accountList: response.value.accountList });
    }
  }

  onBranchSelect(value) {
    var birthYear = this.birthDateInput.getValue();
    this.setState({ branchId: value.branchId, birthYear: birthYear });
  }

  onCityParameterChanged(parameter) {
    var birthYear = this.birthDateInput.getValue();
    this.setState({ cityId: parameter.paramCode, birthYear: birthYear });
  }

  getDetailCriteriaSet() {
    return [
      {
        text: this.getMessage('BusinessComponents', 'IdentityNumber'),
        Desc: this.getMessage('BusinessComponents', 'Enter11DigitIdentityNumber'),
        value: 0,
        maxLength: 11,
        type: 'numeric'
      },

      {
        text: this.getMessage('BusinessComponents', 'CommerceRegistryNumber'),
        Desc: this.getMessage('BusinessComponents', 'NoSpaceTradeRegistrationNumber'),
        value: 1,
        maxLength: 20,
        type: 'numeric'
      },
      {
        text: this.getMessage('BusinessComponents', 'TaxNumber'),
        Desc: this.getMessage('BusinessComponents', 'Enter10digitTaxNumber'),
        value: 2,
        maxLength: 10,
        type: 'numeric'
      },
      {
        text: this.getMessage('BusinessComponents', 'CreditCardNumber'),
        Desc: this.getMessage('BusinessComponents', 'Enter16DigitCreditCardNumber'),
        value: 3,
        maxLength: 16,
        type: 'numeric'
      },
      {
        text: this.getMessage('BusinessComponents', 'ATMNo'),
        Desc: this.getMessage('BusinessComponents', 'Enter16DigitDebitCardNumber'),
        value: 4,
        maxLength: 16,
        type: 'numeric'
      },
      {
        text: this.getMessage('BusinessComponents', 'PhoneNumber'),
        Desc: this.getMessage('BusinessComponents', 'Enter10DigitPhoneNumber'),
        value: 5,
        maxLength: 10,
        type: 'numeric'
      },
      {
        text: this.getMessage('BusinessComponents', 'EmailAddress'),
        Desc: this.getMessage('BusinessComponents', 'EmailInfo'),
        value: 6,
        type: 'text'
      },
      {
        text: this.getMessage('BusinessComponents', 'IBAN'),
        Desc: this.getMessage('BusinessComponents', 'EnterIBAN36Character'),
        value: 7,
        maxLength: 26,
        type: 'text'
      },
      {
        text: this.getMessage('Foreign', 'Swift'),
        Desc: this.getMessage('BusinessComponents', 'CriteriaDescription'),
        value: 8,
        type: 'text'
      },
      {
        text: this.getMessage('BusinessComponents', 'ReutersCodeLabel'),
        Desc: this.getMessage('BusinessComponents', 'EnterReutersCodeInformation'),
        value: 9,
        type: 'text'
      }
    ];
  }

  getYears() {
    var years = [];
    for (let i = new Date().getFullYear(); i >= 1900; i--) {
      years.push({
        text: i.toString(),
        value: i.toString(),
        maxLength: 4,
        type: 'numeric'
      });
    }

    return years;
  }

  onBirthDateFieldChanged(index, selectedItem, selectedValue) {
    if (selectedValue[0] == this.state.birthYear) return;
    this.setState({ birthYear: selectedValue[0] });
  }

  onCriteriaFieldChanged(index, selectedItem, selectedValue) {
    var birthYear = this.birthDateInput.getValue();
    if (selectedValue[0] == this.state.selectedCriteriaValue) return;

    this.setState({
      selectedCriteriaValue: selectedValue[0],
      birthYear: birthYear,
      tempCriteriaValue: ''
    });
  }

  getStyle() {
    return {
      checkBoxHeaderStyle: {
        color: this.props.context.theme.boaPalette.pri500,
        display: 'flex',
        'margin-bottom': '10px',
        'margin-top': '10px'
      },
      divStyle: { left: 0, right: 0, bottom: 0, top: 0, position: 'absolute' },
      bdivider: { width: 'calc(100% + 36px)', marginBottom: 0, marginLeft: -16, marginRight: -16, marginTop: 0 },
      tabStyle: {
        'background-color': 'white',
        'border-bottom-width': '1px',
        'border-bottom-color': this.props.context.theme.boaPalette.base200
      },
      tabCustomerInfoStyle: {
        'background-color': 'white',
        'border-bottom-width': '1px',
        'border-bottom-color': this.props.context.theme.boaPalette.base200
      }
    };
  }

  render() {
    const divStyle = this.getStyle().divStyle;
    const tabStyle = this.getStyle().tabStyle;

    var criteriaTabSet = [
      {
        text: this.getMessage('BusinessComponents', 'GeneralSearch'),
        value: 0,
        content: <div style={{ height: this.state.gridHeight - 50 }}>{this.renderGeneralSearch()}</div>
      },
      {
        text: this.getMessage('BusinessComponents', 'SpecialSearch'),
        value: 1,
        content: <div style={{ height: this.state.gridHeight - 50 }}>{this.renderSpecialSearch()}</div>
      }
    ];

    var tabBarItems = [
      {
        text: this.getMessage('BusinessComponents', 'CustomerAccountInfo'),
        value: 0,
        content: <div style={{ height: this.state.gridHeight - 50, width: this.state.gridWidth }}>{this.renderCustomerAccountInfo()}</div>
      },
      {
        text: this.getMessage('BusinessComponents', 'Favorites'),
        value: 1,
        content: <div style={{ height: this.state.gridHeight - 50, width: this.state.gridWidth }}>{this.renderFavorites()}</div>
      }
    ];

    if (this.props.columns) {
      this.props.columns.forEach(column => {
        if (column.resizable == undefined) column.resizable = true;
        if (!column.width) column.width = 100;
      });
    }

    let criteriaPanel = (
      <BTabBar
        context={this.props.context}
        mode="secondary"
        centerTabs={true}
        centered={true}
        style={tabStyle}
        ref={r => (this.criteriaPanel = r)}
        tabItems={criteriaTabSet}
        onChange={this.onCriteriaPanelChanged.bind(this)}
        value={this.state.criteriaBarIndex}
        centered={true}
      />
    );

    return (
      <BTransactionForm
        context={this.props.context}
        {...this.props}
        resourceInfo={this.props.resourceInfo}
        leftPaneContent={criteriaPanel}
        leftPaneContentStyle={{ padding: 0 }}
        onActionClick={this.actionBarButtonClick.bind(this)}
        onClosing={this.onCloseClick.bind(this)}
        ref={r => (this.transactionForm = r)}
        isCustom={true}
      >
        <div ref={r => (this.datagridDiv = r)} style={divStyle}>
          <BTabBar
            style={this.getStyle().tabCustomerInfoStyle}
            context={this.props.context}
            tabItems={tabBarItems}
            mode="secondary"
            centerTabs={true}
            centered={true}
            value={this.state.contentBarIndex}
            onChange={this.onContentPanelChanged.bind(this)}
          />
        </div>
      </BTransactionForm>
    );
  }

  getCardHeight() {
    if (this.state.cardHeight) {
      let p = this.state.cardHeight + 'px';
      return p;
    }
    return '300px';
  }

  getGridHeight() {
    if (this.state.cardHeight) {
      let p = this.state.cardHeight;
      return p;
    }
    return 280 - this.cardMargin - 30;
  }

  renderCustomerAccountInfo() {
    return (
      <BScroll context={this.props.context} option={{ suppressScrollX: true }}>
        <div style={{ padding: '24px' }}>
          <BCard
            context={this.props.context}
            ref={r => (this.customerCard = r)}
            style={{ padding: '9px 0px 0px 0px', marginBottom:'-7px' }}
            containerStyle={{ height: this.getCardHeight() }}
          >
            <div>
              <BDataGrid
                context={this.props.context}
                ref={r => (this.customerDataGrid = r)}
                headerBarOptions={this.customerListHeaderBarOptions}
                height={this.getGridHeight()}
                showGrid={this.state.customerList.length > 0 ? true : false}
                columns={this.customerGridColumnSet}
                dataSource={this.state.customerList}
                onRowSelectionChanged={this.onCustomerGridSelectionChanged}
              />
            </div>
          </BCard>
          <div style={{ width: '100%', height: '24px' }} />
          <BCard
            ref={r => (this.accountCard = r)}
            context={this.props.context}
            style={{ padding: '9px 0px 0px 0px', marginBottom:'-7px' }}
            containerStyle={{ height: this.getCardHeight() }}
          >
            <div>
              <BDataGrid
                context={this.props.context}
                ref={r => (this.accountDataGrid = r)}
                columns={this.accountGridColumnSet}
                headerBarOptions={this.accountListHeaderBarOptions}
                height={this.getGridHeight()}
                showGrid={this.state.accountList.length > 0 ? true : false}
                dataSource={this.state.accountList}
                selectable={'singleNonPointer'}
              />
            </div>
          </BCard>
        </div>
      </BScroll>
    );
  }

  renderFavorites() {
    return (
      <BScroll context={this.props.context} option={{ suppressScrollX: true }}>
        <div style={{ padding: '24px' }}>
          <BCard
            ref={r => (this.favoriteCard = r)}
            context={this.props.context}
            style={{ padding: '9px 0px 0px 0px', height: this.state.cardHeight }}
            padding={0}
          >
            <div>
              <BDataGrid
                context={this.props.context}
                ref={r => (this.favouriteCustomerDataGrid = r)}
                headerBarOptions={this.favoriteCustomerListHeaderBarOptions}
                height={this.state.cardHeight - this.cardMargin - 30}
                showGrid={this.state.favouriteCustomerList.length > 0 ? true : false}
                columns={this.customerGridColumnSet}
                dataSource={this.state.favouriteCustomerList}
                minHeight={this.state.gridHeight - 100}
                selectable={'singleNonPointer'}
                onRowSelectionChanged={this.onCustomerGridSelectionChanged}
              />
            </div>
          </BCard>
        </div>
      </BScroll>
    );
  }

  renderGeneralSearch() {
    let checkBoxHeaderStyle = this.getStyle().checkBoxHeaderStyle;
    let bdividerStyle = this.getStyle().bdivider;
    var hiddenFilterStyle = this.state.isIndividual && this.state.isCorporate ? { display: 'none' } : {};

    const { context } = this.props;

    return (
      <BScroll context={this.props.context} option={{ suppressScrollX: true }}>
        <div style={{ padding: '12px 24px 24px 24px' }}>
          <BLabel context={context} text={this.getMessage('BusinessComponents', 'AccountStatus')} style={checkBoxHeaderStyle} />
          <BCheckBox
            ref={r => (this.activeAccountOption = r)}
            context={context}
            label={this.getMessage('BusinessComponents', 'Active')}
            labelPosition="right"
            defaultChecked={this.state.isActive}
            disabled={false}
            onCheck={(e, v) => {
              this.setState({ isActive: v });
            }}
          />
          <BCheckBox
            ref={r => (this.disabledAccountOption = r)}
            context={context}
            label={this.getMessage('BusinessComponents', 'Passive')}
            labelPosition="right"
            defaultChecked={this.state.isPassive}
            disabled={false}
            onCheck={(e, v) => {
              this.setState({ isPassive: v });
            }}
          />

          <BLabel context={context} text={this.getMessage('BusinessComponents', 'PersonType')} style={checkBoxHeaderStyle} />
          <BCheckBox
            ref={r => (this.individualCustomerOption = r)}
            label={this.getMessage('BusinessComponents', 'Real')}
            labelPosition="right"
            defaultChecked={this.state.isIndividual}
            disabled={false}
            context={context}
            onCheck={(e, v) => {
              this.setState({ isIndividual: v });
            }}
          />
          <BCheckBox
            ref={r => (this.corporateCustomerOption = r)}
            label={this.getMessage('BusinessComponents', 'Corporate')}
            labelPosition="right"
            defaultChecked={this.state.isCorporate}
            disabled={false}
            context={context}
            onCheck={(e, v) => {
              this.setState({ isCorporate: v });
            }}
          />
          <BBranchComponent
            context={context}
            ref={r => (this.branchOption = r)}
            selectedBranchId={this.state.branchId}
            onBranchSelect={this.onBranchSelect}
            isAllOptionIncluded={true}
            allOptionValue={-1}
            sortOption={'Name'}
            style={hiddenFilterStyle}
          />
          <BDivider context={context} style={bdividerStyle} />
          <BInput
            context={context}
            type="text"
            floatingLabelText={
              this.state.isIndividual && this.state.isCorporate
                ? this.getMessage('BusinessComponents', 'ShortName') + '/' + this.getMessage('BusinessComponents', 'FirmName')
                : this.state.isIndividual
                  ? this.getMessage('BusinessComponents', 'ShortName')
                  : this.getMessage('BusinessComponents', 'FirmName')
            }
            value={this.state.shortName}
            ref={r => (this.searchNameInput = r)}
          />
          <BInput
            context={context}
            type="text"
            floatingLabelText={
              this.state.isIndividual
                ? this.getMessage('BusinessComponents', 'FatherName')
                : this.getMessage('BusinessComponents', 'CommercialName')
            }
            value={this.state.fatherName}
            ref={r => (this.searchFathersNameInput = r)}
            style={hiddenFilterStyle}
          />
          <BComboBox
            ref={r => (this.birthDateInput = r)}
            context={context}
            value={[this.state.birthYear]}
            labelText={
              this.state.isIndividual
                ? this.getMessage('BusinessComponents', 'BirthYear')
                : this.getMessage('BusinessComponents', 'EstablishmentYear')
            }
            dataSource={this.getYears()}
            displayMemberPath={'text'}
            valueMemberPath={'value'}
            onSelect={this.onBirthDateFieldChanged.bind(this)}
            fullWidth={true}
            style={hiddenFilterStyle}
          />
          <div style={hiddenFilterStyle}>
            <BParameterComponent
              ref={r => (this.cityParameter = r)}
              context={context}
              paramType={'SEHIR'}
              isAllOptionIncluded={true}
              allOptionValue={'-1'}
              onParameterSelect={this.onCityParameterChanged}
              labelText={
                this.state.isIndividual
                  ? this.getMessage('BusinessComponents', 'RegisteredCity')
                  : this.getMessage('BusinessComponents', 'EstablishmentPlace')
              }
              selectedParamCode={this.state.cityId}
            />
          </div>
        </div>
      </BScroll>
    );
  }

  renderSpecialSearch() {
    let checkBoxHeaderStyle = this.getStyle().checkBoxHeaderStyle;
    let bdividerStyle = this.getStyle().bdivider;

    let selectedCriteriaDetail = this.getDetailCriteriaSet()[this.state.selectedCriteriaValue];
    var detailCriteriaFilter = <div />;
    if (selectedCriteriaDetail.type == 'numeric')
      detailCriteriaFilter = (
        <BInputNumeric
          context={this.props.context}
          helperText={selectedCriteriaDetail.Desc}
          floatingLabelText={selectedCriteriaDetail.text}
          ref={r => (this.detailCriteriaFilterField = r)}
          maxLength={selectedCriteriaDetail.maxLength}
          value={this.state.tempCriteriaValue}
          onChange={(e, value) => {
            this.setState({ tempCriteriaValue: value });
          }}
        />
      );
    else
      detailCriteriaFilter = (
        <BInput
          context={this.props.context}
          type="text"
          helperText={selectedCriteriaDetail.Desc}
          floatingLabelText={selectedCriteriaDetail.text}
          ref={r => (this.detailCriteriaFilterField = r)}
          maxLength={selectedCriteriaDetail.maxLength}
          value={this.state.tempCriteriaValue}
          onChange={(e, value) => {
            this.setState({ tempCriteriaValue: value });
          }}
        />
      );

    return (
      <BScroll context={this.props.context} option={{ suppressScrollX: true }}>
        <div style={{ padding: '12px 24px 24px 24px' }}>
          <BLabel context={this.props.context} text={this.getMessage('BusinessComponents', 'AccountStatus')} style={checkBoxHeaderStyle} />
          <BCheckBox
            context={this.props.context}
            label={this.getMessage('BusinessComponents', 'Active')}
            labelPosition="right"
            defaultChecked={this.state.isActive}
            disabled={false}
            ref={r => (this.activeAccountOption2 = r)}
            onCheck={(e, v) => {
              this.setState({ isActive: v });
            }}
          />
          <BCheckBox
            context={this.props.context}
            label={this.getMessage('BusinessComponents', 'Passive')}
            labelPosition="right"
            defaultChecked={this.state.isPassive}
            disabled={false}
            ref={r => (this.disabledAccountOption2 = r)}
            onCheck={(e, v) => {
              this.setState({ isPassive: v });
            }}
          />

          <BLabel context={this.props.context} text={this.getMessage('BusinessComponents', 'PersonType')} style={checkBoxHeaderStyle} />
          <BCheckBox
            label={this.getMessage('BusinessComponents', 'Real')}
            labelPosition="right"
            defaultChecked={this.state.isIndividual}
            disabled={false}
            context={this.props.context}
            ref={r => (this.individualOption2 = r)}
            onCheck={(e, v) => {
              this.setState({ isIndividual: v });
            }}
          />
          <BCheckBox
            label={this.getMessage('BusinessComponents', 'Corporate')}
            labelPosition="right"
            defaultChecked={this.state.isCorporate}
            disabled={false}
            context={this.props.context}
            ref={r => (this.corporateCustomerOption2 = r)}
            onCheck={(e, v) => {
              this.setState({ isCorporate: v });
            }}
          />
          <BBranchComponent
            context={this.props.context}
            ref={r => (this.branchOption2 = r)}
            selectedBranchId={this.state.branchId}
            onBranchSelect={this.onBranchSelect}
            isAllOptionIncluded={true}
            allOptionValue={'-1'}
            sortOption={'Name'}
          />
          <BDivider context={this.props.context} style={bdividerStyle} />
          <BComboBox
            ref={r => (this.detailCriteriaField2 = r)}
            context={this.props.context}
            labelText={this.getMessage('BusinessComponents', 'Criteria')}
            value={[this.state.selectedCriteriaValue]}
            dataSource={this.getDetailCriteriaSet()}
            displayMemberPath={'text'}
            valueMemberPath={'value'}
            onSelect={this.onCriteriaFieldChanged.bind(this)}
            fullWidth={true}
          />
          {detailCriteriaFilter}
        </div>
      </BScroll>
    );
  }
}

export default CustomerAccountSearchDialog;
