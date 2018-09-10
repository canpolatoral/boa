import React from 'react';
import PropTypes from 'prop-types';
import ValidationHelper from './validate';


import { BComponent } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BInput } from 'b-input';
import { BInputNumeric } from 'b-input-numeric';
import { BRadioButtonGroup } from 'b-radio-button-group';
import { BTransactionForm } from 'b-transaction-form';
import { BComboBox } from 'b-combo-box';
import { BCard } from 'b-card';
import { BDataGrid } from 'b-data-grid';

export class BMernisDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    canGetOnlineInfoMoreThanOne: PropTypes.bool,
    isVisibileAddressInfoTab: PropTypes.bool,
    searchBehaviourType: PropTypes.oneOf(['All', 'SearchForRealPerson', ' SearchForCorporate'])
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLRMRNSKM',
    canGetOnlineInfoMoreThanOne: false,
    searchBehaviourType: 'All',
    isVisibileAddressInfoTab: false
  };

  state = {
    criteriaExpanded: true,
    isVerificationSelected: true,
    isRealPersonSelected: (this.props.searchBehaviourType == 'All' || this.props.searchBehaviourType == 'SearchForRealPerson') ? true : false,
    informationDialogIsOpen: false,
    informationMessage: '',
    isTCCitizenSelected: true,
    isForeignerSelected: false,
    dataSource: [],
    addressDataSource: [],
    columns: this.getColumns(),
    mernisParameterInfo: {
      name: '',
      surname: '',
      fatherName: '',
      motherName: '',
      birthPlace: '',
      gender: '',
      title: '',
    },
    selectedGender: [5]
  }

  constructor(props, context) {
    super(props, context);
    this.isMernisServiceHealty = true;
    this.isGetInfoCalledBefore = false;
    this.searchedOnlineList = [];

    this.onMernisParameterInfoChanged = this.onMernisParameterInfoChanged.bind(this);
    this.onMernisParameterInfoSelected = this.onMernisParameterInfoSelected.bind(this);
    this.onQueryTypeChanged = this.onQueryTypeChanged.bind(this);

  }

  componentDidMount() {
    super.componentDidMount();
    this.setComponentPartyType();
  }

  getQueryTypeOptions() {
    var queryType =
      [
        {
          label: this.getMessage('BusinessComponents', 'IdentityVerification'),
          value: '0'
        },
        {
          label: this.getMessage('BusinessComponents', 'IdentityQuery'),
          value: '1'
        }
      ];

    return queryType;
  }

  getIdentitiyTypeItems() {
    var identityTypeItems =
      [
        {
          label: this.getMessage('BusinessComponents', 'RealPerson'),
          value: '2',
          disabled: this.props.searchBehaviourType != 'All'
        },
        {
          label: this.getMessage('BusinessComponents', 'Corporate'),
          value: '3',
          disabled: this.props.searchBehaviourType != 'All'
        }
      ];
    return identityTypeItems;
  }

  getIdentitiyCitizenItems() {
    var identitiyCitizenItems =
      [
        {
          label: this.getMessage('BusinessComponents', 'TCCitizen'),
          value: '4'
        },
        {
          label: this.getMessage('BusinessComponents', 'Foreign'),
          value: '5'
        }
      ];

    return identitiyCitizenItems;
  }

  handleOnKeyDown()
  {
    this.transactionForm.enableAction('Clean');
  }

  getVerificationCriterias() {
    return (<div>
      {this.state.isRealPersonSelected ?
        <BInputNumeric
          context={this.props.context}
          maxLength={11}
          floatingLabelText={this.getMessage('BusinessComponents', 'IdentityNumber')}
          onKeyDown={this.handleOnKeyDown.bind(this)}
          value={this.state.identitySelected}
          onChange={(e, text) => this.setState({identitySelected:text})}
          ref={r => this.criteriaBInputIdentity = r} />
        :
        <BInputNumeric
          context={this.props.context}
          maxLength={11}
          floatingLabelText={this.getMessage('Accounting', 'TaxNumber')}
          onKeyDown={this.handleOnKeyDown.bind(this)}
          ref={r => this.criteriaBInputVKNIdentity = r} />
      }
    </div>);
  }

  getGenderDataSource() {
    var ds = [
      { value: '0', text: this.getMessage('Accounting', 'Man') },
      { value: '1', text: this.getMessage('Accounting', 'Woman') }
    ];
    return ds;
  }

  getQueryCriterias() {
    return (<div>
      {this.state.isRealPersonSelected ?
        <div>
          <BInput
            context={this.props.context}
            type='text'
            floatingLabelText={this.getMessage('Accounting', 'Name')}
            value={this.state.mernisParameterInfo.name}
            ref={r => this.criteriaBInputName = r}
            onChange={this.onMernisParameterInfoChanged} />
          <BInput
            context={this.props.context}
            type='text'
            floatingLabelText={this.getMessage('Accounting', 'Surname')}
            value={this.state.mernisParameterInfo.surname}
            ref={r => this.criteriaBInputSurname = r}
            onChange={this.onMernisParameterInfoChanged} />
          <BInput
            context={this.props.context}
            type='text'
            floatingLabelText={this.getMessage('Accounting', 'FatherName')}
            value={this.state.mernisParameterInfo.fatherName}
            ref={r => this.criteriaBInputFatherName = r}
            onChange={this.onMernisParameterInfoChanged} />
          <BInput
            context={this.props.context}
            type='text'
            floatingLabelText={this.getMessage('Accounting', 'MotherName')}
            value={this.state.mernisParameterInfo.motherName}
            ref={(r) => { this.criteriaBInputMotherName = r; }}
            /* ref={r => this.criteriaBInputMotherName = r} */
            onChange={this.onMernisParameterInfoChanged} />
          <BInput
            context={this.props.context}
            type='text'
            floatingLabelText={this.getMessage('Accounting', 'BirthPlaceText')}
            value={this.state.mernisParameterInfo.birthPlace}
            ref={r => this.criteriaBInputBirthPlace = r}
            onChange={this.onMernisParameterInfoChanged} />
          <BComboBox
            context={this.props.context}
            type='text'
            dataSource={this.getGenderDataSource()}
            multiple={false}
            labelText={this.getMessage('Accounting', 'Gender')}
            allOptionValue={'5'}
            value={this.state.selectedGender}
            onSelect={this.onMernisParameterInfoSelected}
            isAllOptionIncluded={true}
            fullWidth={true}
            displayMemberPath={'text'}
            valueMemberPath={'value'} />
          <div style={{ display: 'flex' }} >
            <BInputNumeric
              context={this.props.context}
              floatingLabelText={this.getMessage('BusinessComponents', 'Day')}
              ref={r => this.criteriaBInputBirthDay = r}
              onChange={this.onMernisParameterInfoChanged} />
            <BInputNumeric
              context={this.props.context}
              floatingLabelText={this.getMessage('BusinessComponents', 'Month')}
              ref={r => this.criteriaBInputBirthMonth = r}
              onChange={this.onMernisParameterInfoChanged} />
            <BInputNumeric
              context={this.props.context}
              floatingLabelText={this.getMessage('Calendar', 'Year')}
              ref={r => this.criteriaBInputBirthYear = r}
              onChange={this.onMernisParameterInfoChanged} />
          </div>
        </div>
        : <BInput
          context={this.props.context}
          floatingLabelText={this.getMessage('BusinessComponents', 'CompanyTitle')}
          value={this.state.mernisParameterInfo.title}
          ref={r => this.criteriaBInputTitle = r}
          onChange={this.onMernisParameterInfoChanged} />
      }

    </div>);


  }
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.transactionForm.disableAction('Ok');
    this.transactionForm.disableAction('Clean');
  }

  onPersonGridSelectionChanged() {
    if (this.customerDataGrid)
    {  this.transactionForm.enableAction('Ok');
      this.transactionForm.enableAction('Clean');
    }
  }

  getMernisDialog() {
    let { context } = this.props;

    let criteriaPanelContent = (
      <div >
        <BRadioButtonGroup
          headerText={this.getMessage('BusinessComponents', 'OperationType')}
          context={context}
          name='rgQuery'
          valueSelected={this.state.isVerificationSelected ? '0' : '1'}
          items={this.getQueryTypeOptions()}
          defaultSelected={0}
          onChange={this.onQueryTypeChanged}
          style={{ marginBottom: '15px' }} />
        <BRadioButtonGroup
          headerText={this.getMessage('Inquiry', 'CustomerType')}
          context={context}
          name='group1'
          valueSelected={this.state.isRealPersonSelected ? '2' : '3'}
          items={this.getIdentitiyTypeItems()}
          defaultSelected={2}
          onChange={this.onIdentityTypeChanged.bind(this)}
          style={{ marginBottom: '15px' }} />
        <BRadioButtonGroup
          headerText={this.getMessage('BusinessComponents', 'Citizenship')}
          context={context}
          name='group2'
          valueSelected={this.state.isTCCitizenSelected ? '4' : '5'}
          items={this.getIdentitiyCitizenItems()}
          defaultSelected={4}
          onChange={this.onCitizenTypeChanged.bind(this)}
          style={{ marginBottom: '15px' }} />

        <hr style={{ height: '1px', border: 'none', backgroundColor: this.props.context.theme.boaPalette.base300, marginLeft: '-24px', marginRight: '-24px' }} />
        <div style={{ color: this.props.context.theme.boaPalette.base400, fontSize: '16px' }}>
          {this.state.isRealPersonSelected ? this.getMessage('BusinessComponents', 'IdentityInformation') : this.getMessage('BusinessComponents', 'IdentityInformationForCorporate')}
          {this.state.isVerificationSelected ?
            this.getVerificationCriterias() :
            this.getQueryCriterias()}
        </div>
      </div>);

    return (<BTransactionForm {...this.props}
      ref={r => this.transactionForm = r}
      resourceCode={this.props.resourceInfo}
      leftPaneContent={criteriaPanelContent}
      leftPaneWidth={270}
      leftPaneMaxWidth={511}
      onActionClick={this.actionBarButtonClick.bind(this)}
      onClosing={this.handleClose.bind(this)}
      isWideCardEnabled={true}
      disableCardWidth={true}>
      <BCard context={this.props.context} padding={0} margin={0} style={{ paddingLeft: 0, paddingRight: 0}}>
        <div>
          <BDataGrid
            context={this.props.context}
            ref={r => this.customerDataGrid = r}
            columns={this.getColumns()}
            dataSource={this.state.dataSource}
            showGrid={this.state.dataSource.length > 0 ? true : false}
            enableRowSelect={true}
            onRowSelectionChanged = {this.onPersonGridSelectionChanged.bind(this)}
            // enableCellSelect={true}
            multiSelection={false}
            showAddButton={false}
            showDeleteButton={false}
            showEditButton={false}
            showHistoryButton={false}
            // showCheckbox={true}
            selectable={'single'}
            emptyText={this.getMessage('BusinessComponents', 'UseCriteriaFieldToQueryCustomer')}
            headerBarOptions={{
              show: true,
              showTitle: true,
              title: this.getMessage('BusinessComponents', 'CustomerInfo'),
              showFiltering: true,
              showGrouping: true,
              showMoreOptions: true,
              showDivit: false
            }}
          />
        </div>
      </BCard>
      <BCard context={this.props.context} padding={0} margin={0} style={{ paddingLeft: 0, paddingRight: 0}}>
        <div>
          <BDataGrid
            context={this.props.context}
            ref={r => this.addressDataGrid = r}
            columns={this.getAddressColumns()}
            dataSource={this.state.addressDataSource}
            showGrid={this.state.addressDataSource.length > 0 ? true : false}
            onRowSelectionChanged={this.onPersonGridSelectionChanged.bind(this)}
            enableRowSelect={true}
            enableCellSelect={false}
            multiSelection={false}
            showCheckbox={false}
            selectable={'single'}
            emptyText={this.getMessage('BusinessComponents', 'ChooseCustomerToSeeAdressInfo')}
            headerBarOptions={{
              show: true,
              showTitle: true,
              title: this.getMessage('BusinessComponents', 'AddressInformations'),
              showFiltering: true,
              showGrouping: true,
              showMoreOptions: true
            }}
          />
        </div>
      </BCard>
    </BTransactionForm>);
  }

  handleClose = () => {
    this.close(BComponent.DialogResponse.NONE);
  }

  actionBarButtonClick(e) {
    if (e.commandName == 'GetInfo' || e.commandName == 'GetInfoOnline') {
      var online = false;
      if (e.commandName == 'GetInfoOnline') // Online Bilgi Getir
        online = true;
      else {
        if (this.isGetInfoCalledBefore == false)
          this.isGetInfoCalledBefore = true;
      }
      if (this.state.isVerificationSelected) {
        if (this.componentPartyType == 'PersonCitizen' || this.componentPartyType == 'PersonForeigner')
          this.identityNumber = this.criteriaBInputIdentity.getValue();
        else
          this.identityNumber = this.criteriaBInputVKNIdentity.getValue();
      }
      this.getMernisInfo(this.identityNumber.toString(), online);
      this.transactionForm.enableAction('Clean');

    } else if (e.commandName == 'Ok') { // Tamam aksiyonuna tıklandığında

      if (this.getSelectedRows(this.customerDataGrid)) {
        if (this.getSelectedRows(this.customerDataGrid).length > 1)
          this.showDialogMessage(this.getMessage('BusinessComponents', 'CanNotSelectMore'), BComponent.DialogType.WARNING);
        else {

          var selectedMernis = this.getSelectedRows(this.customerDataGrid)[0];
          if (!(selectedMernis == null || selectedMernis.identityNumber == null)) {
            var selectedMernisInf = {
              selectedIdentityNumber: selectedMernis.identityNumber,
              isTaxNumberExists: null,
              dataPartyType: this.componentPartyType,
              selectedMernisInfo: null,
              selectedMernisInfoForCorporate: null,
              selectedMernisForeignerInfo: null
            };

            if (this.componentPartyType == 'PersonCitizen')
              selectedMernisInf.selectedMernisInfo = selectedMernis;
            else if (this.componentPartyType == 'PersonForeigner')
              selectedMernisInf.selectedMernisForeignerInfo = selectedMernis;
            else if (this.componentPartyType == 'Corporate') {
              selectedMernisInf.isTaxNumberExists = true;
              selectedMernisInf.selectedMernisInfoForCorporate = selectedMernis;
            }
            this.selectedMernisInformations = selectedMernisInf;
            this.close(BComponent.DialogResponse.YES);
          }
          else {
            this.showDialogMessage(this.getMessage('Loans', 'ChooseOne'), BComponent.DialogType.WARNING);
          }
        }
      }
    }
    else if (e.actionId == 30) // Clean
     {
      this.resetValue();
      this.transactionForm.disableAction('Clean');
      this.transactionForm.disableAction('Ok');
    }
  }

  resetValue () {
    this.setState({dataSource:[], addressDataSource:[], isVerificationSelected:true, isRealPersonSelected:true, isTCCitizenSelected:true, identitySelected:'' } );
    this.criteriaBInputName && this.criteriaBInputName .getInstance().resetValue();
    this.criteriaBInputSurname && this.criteriaBInputSurname.getInstance().resetValue();
    this.criteriaBInputFatherName && this.criteriaBInputFatherName.getInstance().resetValue();
    this.criteriaBInputMotherName && this.criteriaBInputMotherName.getInstance().resetValue();
    this.criteriaBInputBirthPlace && this.criteriaBInputBirthPlace.getInstance().resetValue();
    this.criteriaBInputBirthDay && this.criteriaBInputBirthDay.getInstance().resetValue();
    this.criteriaBInputBirthMonth && this.criteriaBInputBirthMonth.getInstance().resetValue();
    this.criteriaBInputBirthYear && this.criteriaBInputBirthYear.getInstance().resetValue();
    this.criteriaBInputTitle && this.criteriaBInputTitle.getInstance().resetValue();
    this.criteriaBInputIdentity && this.criteriaBInputIdentity.resetValue();
    if (this.criteriaBInputVKNIdentity) {this.criteriaBInputVKNIdentity.state.formattedValue ='';}

    if (this.criteriaBInputIdentity)
    { this.criteriaBInputIdentity.state.formattedValue='';
      this.criteriaBInputIdentity.state.value='';
      this.criteriaBInputIdentity.state.Value='';
      this.criteriaBInputIdentity.resetValue();
    }
    // this.forceUpdate();
  }
  // Genel bir dialog gösterme sağlanırsa ona entegre olunacak.
  showDialogMessage(dialogMessage, dialogType = BComponent.DialogType.INFO, dialogResponseStyle = BComponent.DialogResponseStyle.OK) {
    BDialogHelper.show(this.props.context, dialogMessage, dialogType, dialogResponseStyle);
  }

  getMernisAddressInfo(identityNumber: string, forceOnline: bool) {
    // Eğer adres tabı visible değilse hiç gitme.
    if (this.props.isVisibileAddressInfoTab != true)
      return null;

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisAddressRequest',
      requestBody: {
        IdentityNumber: this.identityNumber + '',
        ForceOnline: forceOnline,
        MethodName: 'GetMernisAddressByIdentityNumber'
      },
      key: 'getMernisAddressInfo'
    };
    this.proxyExecute(proxyRequest);

  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'getMernisAddressInfo':
        if (response.success) {
          var arr = [];
          response.value && arr.push(response.value);
          this.setState({ addressDataSource: arr });
        } else {
          this.debugLog('Adres bilgileri getirirken hata oluştu.');
          return null;
        }
        break;
      case 'GetMernisInfoByColumns':
        if (response.success) {
          if (response.value)
            this.mernisInfoList = response.value;
          else
            this.mernisInfoList = null;
          if (this.mernisInfoList != null && this.mernisInfoList.length > 0) {
            this.setState({ dataSource: this.mernisInfoList });
          }
        } else {
          if (response.results.indexOf(x => x.errorMessage == this.getMessage('BusinessComponents', 'MernisInfoMessage6')) >= 0) {
            this.isMernisServiceHealty = false;
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage6'), BComponent.DialogType.WARNING);
          } else {

            this.showDialogMessage(response.results, BComponent.DialogType.ERROR);
          }
        }
        break;
      case 'GetMernisInfoByColumnsFromLocal':
        if (response.success) {
          if (response.value)
            this.mernisInfoList = response.value;
          else
            this.mernisInfoList = null;
          if (this.mernisInfoList != null && this.mernisInfoList.length > 0) {
            this.setState({ dataSource: this.mernisInfoList });
          }
        } else {
          this.showDialogMessage(proxyResponse.results, BComponent.DialogType.ERROR);
        }
        break;
      case 'GetMernisInfoByIdentityNumber':
        if (response.success) {
          if (response.value && response.value.length > 0) {
            this.setState({ dataSource: response.value });
            this.getMernisAddressInfo(this.identityNumber, this.forceOnline);
          }
          else {
            this.mernisInfoList = null;
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'), BComponent.DialogType.WARNING);
            this.identityNumber = null;
            return false;
          }
        } else {
          if (response.results.indexOf(x => x.errorMessage == this.getMessage('BusinessComponents', 'MernisInfoMessage6')) >= 0) {
            this.isMernisServiceHealty = false;
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage6'), BComponent.DialogType.WARNING);
          } else {
            this.showDialogMessage(proxyResponse.results, BComponent.DialogType.ERROR);
          }
          this.identityNumber = null;
          return false;
        }
        break;
      case 'MernisForForeignerByColumns':
        if (response.success) {
          if (response.value)
            this.mernisInfoList = response.value;
          else
            this.mernisInfoList = null;
          if (this.mernisInfoList != null && this.mernisInfoList.length > 0) {
            this.setState({ dataSource: this.mernisInfoList });
          }
        } else {
          if (proxyResponse.results.indexOf(x => x.errorMessage == this.getMessage('BusinessComponents', 'MernisInfoMessage6')) >= 0) {
            this.isMernisServiceHealty = false;
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage6'), BComponent.DialogType.WARNING);
          } else {

            this.showDialogMessage(proxyResponse.results, BComponent.DialogType.ERROR);
          }
        }
        break;
      case 'MernisForForeignerByColumnsFromLocal':
        if (response.success) {
          if (response.value)
            this.mernisInfoList = response.value;
          else
            this.mernisInfoList = null;
          if (this.mernisInfoList != null && this.mernisInfoList.length > 0) {
            this.setState({ dataSource: this.mernisInfoList });
          }
        } else {
          this.showDialogMessage(response.results, BComponent.DialogType.ERROR);
        }
        break;
      case 'MernisTreasuryDataByTaxNumber':
        if (response.success) {
          if (response.value) {
            if (response.value != null && response.value.corporateContractList != null && response.value.corporateContractList.length > 0)
              this.setState({ dataSource: response.value.corporateContractList });
          }
          else {
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'), BComponent.DialogType.WARNING);
            this.identityNumber = null;
            return false;
          }

        } else {
          this.showDialogMessage(response.results, BComponent.DialogType.WARNING);
          this.identityNumber = null;
          return false;
        }

        break;
      case 'MernisForCorporateByColumns':
        if (response.success) {
          if (response.value)
            this.mernisForTreasuryData = response.value;
          else
            this.mernisForTreasuryData = null;

        } else {
          this.showDialogMessage(response.results, BComponent.DialogType.ERROR);
        }
        if (this.mernisForTreasuryData != null && this.mernisForTreasuryData.corporateContractList != null && this.mernisForTreasuryData.corporateContractList.length > 0) {
          this.setState({ dataSource: this.mernisForTreasuryData.corporateContractList });
        }
        break;
      default:
        break;
    }
  }

  getMernisPersonCitizenInfo(identityNumber: string, forceOnline: bool) {
    if (this.state.isVerificationSelected) {

      var message = ValidationHelper.validateTCNumber(identityNumber);
      if (message != null) {
        this.showDialogMessage(message, BComponent.DialogType.WARNING);
        return false;
      }

      this.identityNumber = identityNumber + '';
      this.forceOnline = forceOnline;

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
        requestBody: {
          IdentityNumber: this.identityNumber,
          ForceOnline: this.forceOnline,
          MethodName: 'GetMernisInfoByIdentityNumber'
        },
        key: 'GetMernisInfoByIdentityNumber'
      };
      this.proxyExecute(proxyRequest);

    }
    else {
      if (this.state.mernisParameterInfo != null) {
        if (!this.state.mernisParameterInfo.name
          && !this.state.mernisParameterInfo.surname
          && this.state.selectedGender
          && !this.state.mernisParameterInfo.fatherName
          && !this.state.mernisParameterInfo.birthDay
          && !this.state.mernisParameterInfo.birthMonth
          && !this.state.mernisParameterInfo.birthYear
          && !(this.state.mernisParameterInfo.birthYear < 1900)) {// parametrelerin hepsi dolu ile online olup olmasına bakılmaz GetMernisInfoByColumns çağırılır.

          let proxyRequest = {
            requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
            requestBody: {
              IdentityNumber: identityNumber,
              ParameterContract:
              {
                Name: this.state.mernisParameterInfo.name,
                Surname: this.state.mernisParameterInfo.surname,
                FatherName: this.state.mernisParameterInfo.fatherName,
                MotherName: this.state.mernisParameterInfo.motherName,
                BirthPlace: this.state.mernisParameterInfo.birthPlace,
                Gender: this.state.selectedGender,
                BirthDay: this.state.mernisParameterInfo.birthDay,
                BirthMonth: this.state.mernisParameterInfo.birthMonth,
                BirthYear: this.state.mernisParameterInfo.birthYear
              },
              ForceOnline: forceOnline,
              MethodName: 'GetMernisInfoByColumns'
            },
            key: 'GetMernisInfoByColumns'
          };
          this.proxyExecute(proxyRequest);

        }
        else {
          if (!forceOnline && this.state.mernisParameterInfo.name //  parametrelerin hepsi dolu değilse ve online ise parametreleri doldurmayı zorunlu tutar,
            && this.state.mernisParameterInfo.surname) {          // online değilse sadece name ve surname zorunludur. Name ve surname dolu ise GetMernisInfoByColumnsFromLocal metodu çağırılır

            let proxyRequest = {
              requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
              requestBody: {
                IdentityNumber: identityNumber,
                ParameterContract:
                {
                  Name: this.state.mernisParameterInfo.name,
                  Surname: this.state.mernisParameterInfo.surname,
                  FatherName: this.state.mernisParameterInfo.fatherName,
                  MotherName: this.state.mernisParameterInfo.motherName,
                  BirthPlace: this.state.mernisParameterInfo.birthPlace,
                  Gender: this.state.selectedGender,
                  BirthDay: this.state.mernisParameterInfo.birthDay,
                  BirthMonth: this.state.mernisParameterInfo.birthMonth,
                  BirthYear: this.state.mernisParameterInfo.birthYear
                },
                MethodName: 'GetMernisInfoByColumnsFromLocal'
              },
              key: 'GetMernisInfoByColumnsFromLocal'
            };
            this.proxyExecute(proxyRequest);

          } else {
            this.showDialogMessage(this.getMessage('BusinessComponents', 'EnterNameSurNameFatherNameAndMore'), BComponent.DialogType.WARNING);
            return;
          }
        }
      }
    }
  }

  getMernisForeignerInfo(identityNumber: string, forceOnline: bool) {

    if (this.state.isVerificationSelected) {
      var message = ValidationHelper.validateForeignIdentityNumber(identityNumber);
      if (message != null) {
        this.showDialogMessage(message, BComponent.DialogType.WARNING);
        return false;
      }

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
        requestBody: {
          IdentityNumber: identityNumber + '',
          ForceOnline: forceOnline,
          MethodName: 'MernisForForeignerByTaxNumber'
        },
        key: 'MernisForForeignerByTaxNumber'
      };
      this.proxyExecute(proxyRequest);

    } else {
      if (this.state.mernisParameterInfo != null) {
        if (!this.state.mernisParameterInfo.name
          && !this.state.mernisParameterInfo.surname
          && !this.state.mernisParameterInfo.fatherName
          && !this.state.mernisParameterInfo.birthDay
          && !this.state.mernisParameterInfo.birthMonth
          && !this.state.mernisParameterInfo.birthYear
          && !(this.state.mernisParameterInfo.birthYear < 1900)) { // parametrelerin hepsi dolu ise

          let proxyRequest = {
            requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
            requestBody: {
              IdentityNumber: this.identityNumber + '',
              ParameterContract:
              {
                Name: this.state.mernisParameterInfo.name,
                Surname: this.state.mernisParameterInfo.surname,
                FatherName: this.state.mernisParameterInfo.fatherName,
                MotherName: this.state.mernisParameterInfo.motherName,
                BirthPlace: this.state.mernisParameterInfo.birthPlace,
                Gender: this.state.selectedGender,
                BirthDay: this.state.mernisParameterInfo.birthDay,
                BirthMonth: this.state.mernisParameterInfo.birthMonth,
                BirthYear: this.state.mernisParameterInfo.birthYear
              },
              ForceOnline: forceOnline,
              MethodName: 'MernisForForeignerByColumns'
            },
            key: 'MernisForForeignerByColumns'
          };
          this.proxyExecute(proxyRequest);
        }
        else {
          if (!forceOnline && this.state.mernisParameterInfo.name
            && this.state.mernisParameterInfo.surname) {

            let proxyRequest = {
              requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
              requestBody: {
                IdentityNumber: this.identityNumber + '',
                ParameterContract:
                {
                  Name: this.state.mernisParameterInfo.name,
                  Surname: this.state.mernisParameterInfo.surname,
                  FatherName: this.state.mernisParameterInfo.fatherName,
                  MotherName: this.state.mernisParameterInfo.motherName,
                  BirthPlace: this.state.mernisParameterInfo.birthPlace,
                  Gender: this.state.selectedGender,
                  BirthDay: this.state.mernisParameterInfo.birthDay,
                  BirthMonth: this.state.mernisParameterInfo.birthMonth,
                  BirthYear: this.state.mernisParameterInfo.birthYear
                },
                MethodName: 'MernisForForeignerByColumnsFromLocal'
              },
              key: 'MernisForForeignerByColumnsFromLocal'
            };
            this.proxyExecute(proxyRequest);

          } else {
            this.showDialogMessage(this.getMessage('BusinessComponents', 'EnterNameSurNameFatherNameAndMore'), BComponent.DialogType.WARNING);
            return;
          }
        }
      }
    }
  }

  getMernisForeignOrCorporateInfo(identityNumber: string) {
    if (this.state.isVerificationSelected) {
      var message = ValidationHelper.validateTaxNumber(identityNumber);
      if (message != null) {
        this.showDialogMessage(message, BComponent.DialogType.WARNING);
        return false;
      }

      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
        requestBody: {
          IdentityNumber: identityNumber + '',
          ResourceCode: 'IBLRMRNSKM',
          MethodName: 'MernisTreasuryDataByTaxNumber'
        },
        key: 'MernisTreasuryDataByTaxNumber'
      };
      this.proxyExecute(proxyRequest);

    } else {
      this.debugLog(this.criteriaBInputTitle.getInstance().getValue());
      if (!this.criteriaBInputTitle.getInstance().getValue()) {
        this.showDialogMessage(this.getMessage('BusinessComponents', 'EnterCompanyTitle'), BComponent.DialogType.WARNING);
        return;
      } else if (this.criteriaBInputTitle.getInstance().getValue().length < 3) {
        this.showDialogMessage(this.getMessage('BusinessComponents', 'CompanyTitleMustBeMoreThanThreeChar'), BComponent.DialogType.WARNING);
        return;
      } else {
        let proxyRequest = {
          requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisForCorporateRequest',
          requestBody: {
            FirmName: this.criteriaBInputTitle.getInstance().getValue(),
            MethodName: 'MernisForCorporateByColumns'
          },
          key: 'MernisForCorporateByColumns'
        };
        this.proxyExecute(proxyRequest);
      }

    }
  }

  getMernisInfo(identityNumber: string, forceOnline: bool) {
    this.isMernisServiceHealty = true;

    if (this.props.canGetOnlineInfoMoreThanOne == false && forceOnline == true && (this.componentPartyType == 'PersonCitizen' || this.componentPartyType == 'PersonForeigner') && this.searchedOnlineList.indexOf(identityNumber) >= 0) {
      this.showDialogMessage(this.getMessage('BusinessComponents', 'OnlyOneQueryInfo'), BComponent.DialogType.WARNING);
      return;
    }

    if (this.componentPartyType == 'PersonCitizen') {
      this.getMernisPersonCitizenInfo(identityNumber, forceOnline);
    }
    else
      if (this.componentPartyType == 'PersonForeigner') {
        this.getMernisForeignerInfo(identityNumber, forceOnline);
      }
      else {
        this.getMernisForeignOrCorporateInfo(identityNumber);
      }
  }

  getValue() {
    return this.selectedMernisInformations;
  }

  getActivePartyType() {
    return this.componentPartyType;
  }

  getMernisServiceIsHealty() {
    return this.isMernisServiceHealty;
  }

  setComponentPartyType() {
    if (this.state.isRealPersonSelected) {
      if (this.state.isTCCitizenSelected)
        this.componentPartyType = 'PersonCitizen';
      else if (this.state.isForeignerSelected)
        this.componentPartyType = 'PersonForeigner';

      if (this.transactionForm) {
        if (this.isGetInfoCalledBefore)
          this.transactionForm.enableAction('GetInfoOnline');
        else
          this.transactionForm.disableAction('GetInfoOnline');
      }

    } else {
      this.componentPartyType = 'Corporate';
      if (this.transactionForm)
        this.transactionForm.disableAction('GetInfoOnline');
    }
  }

  onIdentityTypeChanged(event, newSelection) {
    this.setState({ isRealPersonSelected: newSelection == 2 }, this.setComponentPartyType);
    this.transactionForm.enableAction('Clean');
  }

  onCitizenTypeChanged(event, newSelection) {
    this.setState({ isTCCitizenSelected: (newSelection == 4) ? true:false, isForeignerSelected: newSelection == 5 }, this.setComponentPartyType);
    this.transactionForm.enableAction('Clean');
  }

  onQueryTypeChanged(event, newSelection) {
    this.setState({ isVerificationSelected: newSelection == 0 ? true : false });
    this.transactionForm.enableAction('Clean');
  }

  onMernisParameterInfoChanged() {
    if (this.state.isRealPersonSelected) {
      this.setState({
        mernisParameterInfo:
        {
          name: this.criteriaBInputName.getInstance().getValue(),
          surname: this.criteriaBInputSurname.getInstance().getValue(),
          fatherName: this.criteriaBInputFatherName.getInstance().getValue(),
          motherName: this.criteriaBInputMotherName.getInstance().getValue(),
          birthPlace: this.criteriaBInputBirthPlace.getInstance().getValue(),
          gender: this.state.selectedGender ? this.state.selectedGender : '5',
          birthDay: this.criteriaBInputBirthDay.getValue(),
          birthMonth: this.criteriaBInputBirthMonth.getValue(),
          birthYear: this.criteriaBInputBirthYear.getValue()
        }
      });
    }
    else {
      this.setState({
        mernisParameterInfo:
        {
          title: this.criteriaBInputTitle.getInstance().getValue()
        }
      });
    }
    this.transactionForm.enableAction('Clean');
  }

  onMernisParameterInfoSelected(e, v) {
    this.setState({ selectedGender: v });
    this.transactionForm.enableAction('Clean');
  }

  getAddressColumns() {
    return [
      {
        'key': 'identityNumber',
        'name': this.getMessage('BusinessComponents', 'IdentityNumber'),
        'resizable': true
      },
      {
        'key': 'addressText',
        'name': this.getMessage('BusinessComponents', 'Address'),
        'resizable': true
      },
      {
        'key': 'city',
        'name': this.getMessage('BusinessComponents', 'Province'),
        'resizable': true
      },
      {
        'key': 'county',
        'name': this.getMessage('BusinessComponents', 'County'),
        'resizable': true
      },
      {
        'key': 'townShip',
        'name': this.getMessage('BusinessComponents', 'TownShip'),
        'resizable': true
      },
      {
        'key': 'village',
        'name': this.getMessage('BusinessComponents', 'Village'),
        'resizable': true
      },
      {
        'key': 'street',
        'name': this.getMessage('BusinessComponents', 'Street'),
        'resizable': true
      },
      {
        'key': 'district',
        'name': this.getMessage('BusinessComponents', 'District2'),
        'resizable': true
      },
      {
        'key': 'outerDoorNo',
        'name': this.getMessage('BusinessComponents', 'OuterDoorNo'),
        'resizable': true
      },
      {
        'key': 'innerDoorNo',
        'name': this.getMessage('BusinessComponents', 'InnerDoorNo'),
        'resizable': true
      }
    ];
  }

  getColumns() { // arama değerine göre kolonlar dönecek
    this.setComponentPartyType();
    var columns = [];
    if (this.componentPartyType == 'PersonCitizen') {
      columns = [
        {
          'key': 'identityNumber',
          'name': this.getMessage('BusinessComponents', 'IdentityNumber'),
          'resizable': true
        },
        {
          'key': 'name',
          'name': this.getMessage('BusinessComponents', 'Name'),
          'resizable': true
        },
        {
          'key': 'surname',
          'name': this.getMessage('BusinessComponents', 'Surname'),
          'resizable': true
        },
        {
          'key': 'fatherName',
          'name': this.getMessage('BusinessComponents', 'FatherName'),
          'resizable': true
        },
        {
          'key': 'motherName',
          'name': this.getMessage('BusinessComponents', 'MotherName'),
          'resizable': true
        },
        {
          'key': 'birthPlace',
          'name': this.getMessage('BusinessComponents', 'BirthPlaceText'),
          'resizable': true
        },
        {
          'key': 'genderDefinition',
          'name': this.getMessage('BusinessComponents', 'Gender'),
          'resizable': true
        },
        {
          'key': 'birthDate',
          'name': this.getMessage('BusinessComponents', 'BirthDate'),
          'resizable': true
        },
        {
          'key': 'city',
          'name': this.getMessage('BusinessComponents', 'Province'),
          'resizable': true
        },
        {
          'key': 'country',
          'name': this.getMessage('BusinessComponents', 'County'),
          'resizable': true
        },
        {
          'key': 'districtCode',
          'name': this.getMessage('BusinessComponents', 'DistrictCodeLabel'),
          'resizable': true
        },
        {
          'key': 'personOrder',
          'name': this.getMessage('BusinessComponents', 'PersonOrder'),
          'resizable': true
        },
        {
          'key': 'familyOrder',
          'name': this.getMessage('BusinessComponents', 'FamilyOrder'),
          'resizable': true
        },
        {
          'key': 'district',
          'name': this.getMessage('BusinessComponents', 'District'),
          'resizable': true
        },
        {
          'key': 'status',
          'name': this.getMessage('BusinessComponents', 'Status'),
          'resizable': true
        },
        {
          'key': 'systemRegistrationDate',
          'name': this.getMessage('BusinessComponents', 'SaveDate'),
          'resizable': true
        }
      ];
    } else if (this.componentPartyType == 'PersonForeigner') {
      columns = [
        {
          'key': 'identityNumber',
          'name': this.getMessage('BusinessComponents', 'IdentityNumber'),
          'resizable': true
        },
        {
          'key': 'name',
          'name': this.getMessage('BusinessComponents', 'Name'),
          'resizable': true
        },
        {
          'key': 'surname',
          'name': this.getMessage('BusinessComponents', 'Surname'),
          'resizable': true
        },
        {
          'key': 'fatherName',
          'name': this.getMessage('BusinessComponents', 'FatherName'),
        },
        {
          'key': 'motherName',
          'name': this.getMessage('BusinessComponents', 'MotherName'),
          'resizable': true
        },
        {
          'key': 'partnerIdentitiNumber',
          'name': this.getMessage('BusinessComponents', 'PartnerIdentityNumber'),
          'resizable': true
        },
        {
          'key': 'genderDefinition',
          'name': this.getMessage('BusinessComponents', 'Gender'),
          'resizable': true
        },
        {
          'key': 'maritalStatus',
          'name': this.getMessage('BusinessComponents', 'MaritalStatus'),
          'resizable': true
        },
        {
          'key': 'birthPlace',
          'name': this.getMessage('BusinessComponents', 'BirthPlaceText'),
          'resizable': true
        },
        {
          'key': 'birthDate',
          'name': this.getMessage('BusinessComponents', 'BirthDate'),
          'resizable': true
        },
        {
          'key': 'residencePermitterCityName',
          'name': this.getMessage('BusinessComponents', 'ResidencePermitterCityName'),
          'resizable': true
        },
        {
          'key': 'residenceMaturityName',
          'name': this.getMessage('BusinessComponents', 'ResidenceMaturityName'),
          'resizable': true
        },
        {
          'key': 'residencePermitNo',
          'name': this.getMessage('BusinessComponents', 'ResidencePermitNo'),
          'resizable': true
        },
        {
          'key': 'permitBeginDate',
          'name': this.getMessage('BusinessComponents', 'PermitBeginDate'),
          'resizable': true
        },
        {
          'key': 'permitEndDate',
          'name': this.getMessage('BusinessComponents', 'PermitEndDate'),
          'resizable': true
        },
        {
          'key': 'endDateUncertainDescription',
          'name': this.getMessage('BusinessComponents', 'EndDateUncertainDescription'),
          'resizable': true
        },
        {
          'key': 'citizenship',
          'name': this.getMessage('BusinessComponents', 'Citizenship'),
          'resizable': true
        },
        {
          'key': 'systemRegistrationDate',
          'name': this.getMessage('BusinessComponents', 'SaveDate'),
          'resizable': true
        }
      ];

    } else if (this.componentPartyType == 'Corporate') {
      columns = [
        {
          'key': 'taxNumber',
          'name': this.getMessage('BusinessComponents', 'TaxNumber'),
          'resizable': true
        },
        {
          'key': 'commercialName',
          'name': this.getMessage('BusinessComponents', 'CompanyTitle'),
          'resizable': true
        },
        {
          'key': 'establishmentPlace',
          'name': this.getMessage('BusinessComponents', 'EstablishmentPlace'),
          'resizable': true
        },
        {
          'key': 'establishmentDate',
          'name': this.getMessage('BusinessComponents', 'EstablishmentDate'),
          'resizable': true
        }
      ];
    }
    return columns;
  }

  getSelectedRows(grid) {
    let selectedIndexes = grid.getSelectedRowIndexes();
    let selectedRows = [];
    let dataSource = grid.props.dataSource;
    if (dataSource && dataSource.length > 0 && selectedIndexes && selectedIndexes.length > 0) {
      selectedIndexes.map(index => selectedRows = selectedRows.concat(dataSource.filter(i => dataSource.indexOf(i) == index)));
    }
    return selectedRows;
  }

  render() {
    return this.getMernisDialog();
  }

  close(dialogResponse) {
    BDialogHelper.close(this, dialogResponse, this.selectedMernisInformations);
  }
}

export default BMernisDialog;
