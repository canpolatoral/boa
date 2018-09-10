import React from 'react';
import PropTypes from 'prop-types';

import { BBusinessComponent } from 'b-business-component';
import { BDataGrid } from 'b-data-grid';
import { BScroll } from 'b-scroll';
import { BBaseForm } from 'b-base-form';
import { BTransactionForm } from 'b-transaction-form';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';
import { BCriteriaPanel } from 'b-criteria-panel';
import { BCard } from 'b-card';
import { BLabel } from 'b-label';
import { BCheckBox } from 'b-check-box';
import { BInputNumeric } from 'b-input-numeric';
import { BDateTimePicker } from 'b-datetime-picker';
import { BBranchComponent } from 'b-branch-component';
import { BInput } from 'b-input';
// import { BIconButton } from 'b-icon-button';
let isCheckRealPerson = true;
let isCheckCorporate = false;

export class BPersonSearchDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * BBaseForm prop types.
     */
    ...BBaseForm.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    /**
     * Criteria pane expanded/collapsed status. Default true (expanded).
     */
    criteriaPanelExpanded: PropTypes.bool,
    /**
     * Criteria pane can expandable status. Default true (expandable).
     */
    criteriaPanelExpandable: PropTypes.bool,
    /**
     * Criteria pane header button text. Default 'Criterias'.
     */
    criteriaPanelHeader: PropTypes.string,
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
    selectedPerson: PropTypes.object
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLRSELPER',
    leftPaneWidth: 270,
    leftPaneMaxWidth: 511,
    criteriaPanelExpanded: true,
    criteriaPanelExpandable: true,
    autogenerateColumns: false,
    selectedIndexes: [],
  };

  constructor(props, context) {
    super(props, context);
    this.onCriteriaExpandChanged = this.onCriteriaExpandChanged.bind(this);
    this.state = {
      gridWidth: 900,
      gridHeight: 500,
      isRealPerson: true,
      isCorporate: false,
      criteriaPanelHeader: this.getMessage('BusinessComponents', 'Criterias'),
      criteriaExpanded: this.props.criteriaPanelExpanded,
      personList: [],
      identitOrTaxNumber: null,
      personName: '',
      personNumber: null,
      selectedPerson: {}
    };
  }

  personGridColumnSet = [
    {
      'key': 'personid',
      'name': this.getMessage('BusinessComponents', 'PersonNumber'),
      'resizable': true
    },
    {
      'key': 'name',
      'name': this.getMessage('BusinessComponents', 'ShortName'),
      'resizable': true
    },
    {
      'key': 'taxNumber',
      'name': this.getMessage('BusinessComponents', 'TaxNumber'),
      'resizable': true
    },
    {
      'key': 'personTypeDescription',
      'name': this.getMessage('BusinessComponents', 'PersonType'),
      'resizable': true
    },
    {
      'key': 'fatherName',
      'name': this.getMessage('BusinessComponents', 'FatherName'),
      'resizable': true
    },
    {
      'key': 'date',
      'name': this.getMessage('BusinessComponents', 'BirthDate'),
      'resizable': true
    },
    {
      'key': 'accomodationCountryName',
      'name': this.getMessage('BusinessComponents', 'LocationLabel'),
      'resizable': true
    },
    {
      'key': 'citizenshipCountryName',
      'name': this.getMessage('BusinessComponents', 'Citizenship'),
      'resizable': true
    }
  ];

  onCloseClick(e) {
    this.close(null);
    if (this.props.onClosing) this.props.onClosing(e);
  }

  updateGridSize(width, height) {
    this.setState({ gridWidth: width, gridHeight: height });
  }

  onIsRealPersonFilterChanged(e, isInputChecked) {
    this.setState({ isRealPerson: isInputChecked });
    if (isInputChecked) {
      this.baseForm.enableAction('Clean');
      isCheckRealPerson = true;
    }
    else if (isCheckCorporate) {
      this.baseForm.enableAction('Clean');
      isCheckRealPerson = false;
    }
    else {
      this.baseForm.disableAction('Clean');
      isCheckRealPerson = false;
      isCheckCorporate = false;
    }
  }

  onIsCorporateFilterChanged(e, isInputChecked) {
    this.setState({ isCorporate: isInputChecked });
    if (isInputChecked) {
      this.baseForm.enableAction('Clean');
      isCheckCorporate = true;
    }
    else if (isCheckRealPerson) {
      this.baseForm.enableAction('Clean');
      isCheckCorporate = false;
    }
    else {
      this.baseForm.disableAction('Clean');
      isCheckCorporate = false;
      isCheckRealPerson = false;
    }
  }

  onCriteriaExpandChanged(isExpanded) {
    this.debugLog('BrowseForm.CriteriaHeader clicked!');
    this.setState({ criteriaExpanded: isExpanded });
    this.baseForm.updateLeftPane(isExpanded);
  }

  onCustomerGridSelectionChanged() {
    var changed = this.getSelectedRow(this.customerDataGrid);
    if (changed.length > 0)
      this.setState({ selectedPerson: changed });
  }

  actionBarButtonClick(e) {
    if (e.actionId == 11) // Bilgi Getir
    {
      this.getInfoActionClicked();
    }
    else if (e.actionId == 26) // OK
    {
      let selectedPerson = this.getSelectedRow(this.personDataGrid);
      if (!selectedPerson || !selectedPerson.personid) {
        if (!this.props.selectedPerson) {
          BDialogHelper.show(this.props.context, this.getMessage('CoreBanking', 'SelectRecord'), BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
          return;
        }
        else {
          this.setState({ selectedPerson: this.props.selectedPerson },
            BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.selectedPerson));
        }
      }
      else {
        this.setState({ selectedPerson: selectedPerson });
        BDialogHelper.close(this, BComponent.DialogResponse.OK, selectedPerson);
      }
    }
    if (e.actionId == 30) // Clean
    {
      this.baseForm.disableAction('Ok');
      this.baseForm.disableAction('Clean');
      this.resetValue();
    }
  }

  onPersonGridSelectionChanged() {
    if (this.personDataGrid)
      this.baseForm.enableAction('Ok');
    this.baseForm.enableAction('Clean');

    var changed = this.getSelectedRow(this.personDataGrid);
    this.setState({ selectedPerson: changed });
  }

  getSelectedRow(grid) {
    let selectedIndex = grid.getSelectedRowIndexes()[grid.getSelectedRowIndexes().length - 1];
    let selectedRow = {};
    let dataSource = grid.props.dataSource;
    if (dataSource && dataSource.length > 0 && selectedIndex > -1) {
      selectedRow = dataSource[selectedIndex];
    }
    return selectedRow;
  }

  getInfoActionClicked() {
    this.setState({
      personNumber: this.criteriaPersonNumber.getValue(),
      identitOrTaxNumber: this.criteriaTCKNAndVKN.getValue(),
      personName: this.criteriaPersonName.getInstance().getValue()
    });
    this.getAllPersons();
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    let criteriaExpanded = nextProps.criteriaPanelExpanded;
    if (this.state.criteriaExpanded != criteriaExpanded
      || this.state.criteriaPanelHeader != nextProps.criteriaPanelHeader) {
      this.setState({ criteriaExpanded: criteriaExpanded, criteriaPanelHeader: nextProps.criteriaPanelHeader });
    }
    this.baseForm.disableAction('Ok');
    this.baseForm.disableAction('Clean');

  }

  handleOnChange(e, val) {
    if ((val & val != null) || (val != null && val.getYear) || (e && e.branchId > 0))
      this.baseForm.enableAction('Clean');
    if ((this.state.personNumber && this.state.personNumber.length > 0) ||
      (this.state.identitOrTaxNumber && this.state.identitOrTaxNumber.length > 0) ||
      (this.state.personName && this.state.personName.length > 0))
      this.baseForm.enableAction('Clean');
  }

  render() {
    let criteriaPanel = (
      <BCriteriaPanel context={this.props.context}
        onExpandChange={this.onCriteriaExpandChanged}
        expanded={this.state.criteriaExpanded}
        expandable={this.props.criteriaPanelExpandable}
        header={this.state.criteriaPanelHeader}>
        <div>
          <BScroll context={this.props.context} option={{ suppressScrollX: true }}>
            <div style={{ padding: 24 }}>
              <BLabel context={this.props.context} text={this.getMessage('BusinessComponents', 'PersonType')} style={{ color: this.props.context.theme.boaPalette.pri500 }} />
              <div style={{ display: 'grid' }}>
                <BCheckBox
                  context={this.props.context}
                  label={this.getMessage('BusinessComponents', 'Real')}
                  defaultChecked={this.state.isRealPerson}
                  disabled={false}
                  ref={r => this.criteriaRealPerson = r}
                  onCheck={this.onIsRealPersonFilterChanged.bind(this)} />
                <BCheckBox
                  context={this.props.context}
                  label={this.getMessage('BusinessComponents', 'Corporate')}
                  defaultChecked={this.state.isCorporate}
                  disabled={false}
                  ref={r => this.criteriaCorporate = r}
                  onCheck={this.onIsCorporateFilterChanged.bind(this)} />
              </div>
              <BInputNumeric context={this.props.context} type='text'
                value={this.state.personNumber}
                floatingLabelText={this.getMessage('BusinessComponents', 'PersonNumber')}
                hintText={this.getMessage('BusinessComponents', 'PersonNumber')}
                ref={r => this.criteriaPersonNumber = r}
                onChange={this.handleOnChange.bind(this)} />
              <BInputNumeric context={this.props.context}
                type='text'
                value={this.state.identitOrTaxNumber}
                floatingLabelText={this.getMessage('CoreBanking', 'TCKNAndVKN')}
                hintText={this.getMessage('CoreBanking', 'TCKNAndVKN')}
                ref={r => this.criteriaTCKNAndVKN = r}
                maxLength={20}
                onChange={this.handleOnChange.bind(this)} />
              <BInput context={this.props.context}
                type='text'
                value={this.state.personName}
                floatingLabelText={this.getMessage('CoreBanking', 'Name_3')}
                ref={r => this.criteriaPersonName = r}
                onChange={this.handleOnChange.bind(this)} />
              <BDateTimePicker context={this.props.context}
                ref={(r) => this.criteriaRecordBeginDate = r}
                disabled={this.disabled}
                value={this.state.recordBeginDate}
                format='DDMMYYYY'
                floatingLabelTextDate={this.getMessage('CoreBanking', 'RecordBeginDate')}
                onChange={this.handleOnChange.bind(this)} />
              <BDateTimePicker context={this.props.context}
                ref={(r) => this.criteriaRecordEndDate = r}
                value={this.state.recordEndDate}
                disabled={this.disabled}
                format='DDMMYYYY'
                floatingLabelTextDate={this.getMessage('CoreBanking', 'RecordEndDate')}
                onChange={this.handleOnChange.bind(this)} />
              <BBranchComponent context={this.props.context}
                ref={r => this.branchOption = r}
                onBranchSelect={this.handleOnChange.bind(this)} />

            </div>
          </BScroll>
        </div>
      </BCriteriaPanel>
    );

    return (
      <BTransactionForm context={this.props.context}
        ref={r => this.baseForm = r}
        {...this.props}
        onActionClick={this.actionBarButtonClick.bind(this)}
        resourceInfo={this.props.resourceInfo}
        leftPaneContent={criteriaPanel}
        onClosing={this.onCloseClick.bind(this)}
        style={{ 'background-color': 'rgb(245, 245, 245)' }}>

        <div style={{ ...this.scrollContentStyle, marginTop: '24px', marginRight: this.props.context.deviceSize < BComponent.Sizes.MEDIUM ? '0px' : '24px', marginLeft: this.props.context.deviceSize < BComponent.Sizes.MEDIUM ? '0px' : '24px' }} >
          <BCard context={this.props.context} style={{ margin: '0px', padding: '0px' }}>
            {this.state.personList.length > 0 ?
              <div style={{ marginTop: '12px', marginBottom: '12px', marginLeft: '0px', marginRight: '0px' }}>
                <BDataGrid
                  context={this.props.context}
                  ref={r => this.personDataGrid = r}
                  columns={this.personGridColumnSet}
                  dataSource={this.state.personList}
                  minWidth={this.state.gridWidth}
                  height='400'
                  enableRowSelect={true}
                  enableCellSelect={false}
                  multiSelection={false}
                  showCheckbox={false}
                  onRowSelectionChanged={this.onPersonGridSelectionChanged.bind(this)}
                  headerBarOptions={{
                    show: true,
                    showTitle: true,
                    title: this.getMessage('BusinessComponents', 'Customers'),
                    showFiltering: true,
                    showGrouping: true,
                    showMoreOptions: true
                  }}
                />
              </div>
              :
              <div>
                <BDataGrid
                  context={this.props.context}
                  ref={r => this.personDataGridEmpty = r}
                  dataSource={this.state.personList}
                  minWidth={this.state.gridWidth}
                  showGrid={this.state.personList.length > 0 ? true : false}
                  onRowSelectionChanged={this.onPersonGridSelectionChanged.bind(this)}
                  emptyText={this.getMessage('BusinessComponents', 'CustomerNotFountUseCriteria')}
                  headerBarOptions={{
                    show: true,
                    showTitle: true,
                    title: this.getMessage('BusinessComponents', 'Customers')
                  }}
                />
              </div>
            }
          </BCard>
        </div>
      </BTransactionForm>
    );
  }

  getCustomerType() {
    if (this.state.isCorporate != undefined && this.state.isCorporate == true
      && (this.state.isRealPerson == undefined || this.state.isRealPerson == false)) {
      return 1;
    }
    else if (this.state.isRealPerson != undefined && this.state.isRealPerson == true && (this.state.isCorporate == undefined || this.state.isCorporate == false)) {
      return 0;
    }
    else if (this.state.isRealPerson != undefined && this.state.isRealPerson == true && this.state.isCorporate != undefined && this.state.isCorporate == true) {
      return null;
    }
    return null;
  }

  getAllPersons() {
    let request = {};
    this.setState({
      personNumber: this.criteriaPersonNumber.getValue(),
      identitOrTaxNumber: this.criteriaTCKNAndVKN.getValue(),
      personName: this.criteriaPersonName.getInstance().getValue()
    });
    request.requestClass = 'BOA.Types.Kernel.BusinessHelper.PersonSearchRequest';
    request.key = 'GetAllPersons';
    request.requestBody = {};
    request.requestBody.MethodName = 'GetAllPersonsByPersonId';
    request.requestBody.PersonType = this.getCustomerType();

    if (this.criteriaPersonName.getInstance().getValue() == '') {
      request.requestBody.personName = null;
    }
    else {
      request.requestBody.personName = this.criteriaPersonName.getInstance().getValue();
    }
    if (this.criteriaTCKNAndVKN.getValue() == '') {
      request.requestBody.taxNo = null;
    }
    else {
      request.requestBody.taxNo = this.criteriaTCKNAndVKN.getValue();
    }
    if (this.criteriaPersonNumber.getValue() == '') {
      request.requestBody.personId = null;
    }
    else {
      request.requestBody.personId = this.criteriaPersonNumber.getValue();
    }
    if (this.criteriaRecordBeginDate.getValue() == '') {
      request.requestBody.startDate = null;
    }
    else {
      request.requestBody.startDate = this.state.recordBeginDate;
    }
    if (this.criteriaRecordEndDate.getValue() == '') {
      request.requestBody.finishDate = null;
    }
    else {
      request.requestBody.finishDate = this.state.recordEndDate;
    }
    var selectedBranch = this.branchOption.getValue();
    request.requestBody.selectedBranchId = (selectedBranch && selectedBranch.branch) ? selectedBranch.branch.branchId : null;

    this.proxyExecute(request);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllPersons':
        if (response.success) {
          if (response.value.length == 0) {
            BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'CustomerDidNotMatchYourCriteria'), BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
          }
          for (let i = 0; i < response.value.length; i++) {
            response.value[i].personTypeDescription = response.value[i].personType == 0 ? 'Real' : 'Corporate';
          }
          this.setState({ personList: response.value });
          // this.baseForm.enableAction('Clean');
        }
        else {
          this.setState({ personList: null });
          BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'ErrorDuringTransaction'), BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
          this.clearPersonInfo();
          this.debugLog(proxyResponse.results);
        }
        break;
      default:
        break;
    }
  }

  resetValue() {
    this.setState({
      personList: [],
      personNumber: '',
      identitOrTaxNumber: '',
      personName: '',
      selectedPerson: null,
      recordBeginDate: null,
      recordEndDate: null
    });

    /* this.criteriaPersonName.getInstance().resetValue();
    this.criteriaPersonNumber.resetValue(); */
    this.criteriaRecordBeginDate.resetValue();
    this.criteriaRecordEndDate.resetValue();
    this.branchOption.resetValue();
  }
}

export default BPersonSearchDialog;
