import React from 'react';
import PropTypes from 'prop-types';
import BMernisComponent from 'b-mernis-component';

import { BBusinessComponent } from 'b-business-component';
import { BInput } from 'b-input';
import { BInputAction } from 'b-input-action';
import { BComponent, BComponentComposer } from 'b-component';
import { BCard } from 'b-card';
import { BInputMask } from 'b-input-mask';
import { BBusinessDateTimeComponent } from 'b-business-datetime-component';
import { BLocalization } from 'b-localization';
import { BTransactionForm } from 'b-transaction-form';
import { BInformationText } from 'b-information-text';
import { BDialogHelper } from 'b-dialog-box';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { getFrameworkMessage } from 'b-messaging';
import { BRadioButtonGroup } from 'b-radio-button-group';


import cloneDeep from 'lodash/cloneDeep';


@BComponentComposer
export class BThirdPartySaveDialog extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    accountNumber: PropTypes.number,
    thirdPartyId: PropTypes.number,
    onClosing: PropTypes.func
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLTUCNTAN'
  };

  thirdPartyContract: {
    thirdPartyId: number,
    accountNumber: number,
    address: string,
    birthDate: Date,
    birthPlace: string,
    email: string,
    fatherName: string,
    faxNumber: string,
    fullName: string,
    identityNumber: string,
    motherName: string,
    name: string,
    nationality: string,
    phoneNumber: string,
    surName: string
  } =
  {
    thirdPartyId: 0,
    accountNumber: 0,
    address: '',
    birthDate: null,
    birthPlace: '',
    email: '',
    fatherName: '',
    faxNumber: '',
    fullName: '',
    identityNumber: '',
    motherName: '',
    name: '',
    surName: '',
    nationality: 'TC',
    phoneNumber: ''
  };

  state = {
    contract: this.thirdPartyContract,
    isMernisHealty: true,
    isIdentityNumberVerified: false,
    selectedNationality: 0, /* TC */
    disableFields: false,
    inputNameError: '',
    inputSurnameError: '',
    inputAddressError: '',
    inputMernisError: '',
    inputEmailError: '',
    fieldsVisible: false,
    value: '0'

  };

  dialogResponse = BComponent.DialogResponse.NONE;
  selectedMernisInformations = {};

  constructor(props, context) {
    super(props, context);
    this.handleOnClosing = this.handleOnClosing.bind(this);
    this.handleOnActionClick = this.handleOnActionClick.bind(this);
    this.handleOnNameChange = this.handleOnNameChange.bind(this);
    this.handleOnSurnameChange = this.handleOnSurnameChange.bind(this);
    this.handleOnFatherNameChange = this.handleOnFatherNameChange.bind(this);
    this.handleOnMotherNameChange = this.handleOnMotherNameChange.bind(this);
    this.handleOnBirthPlaceChange = this.handleOnBirthPlaceChange.bind(this);
    this.handleOnAddressChange = this.handleOnAddressChange.bind(this);
    this.handleOnEmailChange = this.handleOnEmailChange.bind(this);
    this.handleOnFaxNumberChange = this.handleOnFaxNumberChange.bind(this);
    this.handleOnPhoneNumberChange = this.handleOnPhoneNumberChange.bind(this);
    this.handleOnBirthDateChange = this.handleOnBirthDateChange.bind(this);
    this.handleMernisNotHealty = this.handleMernisNotHealty.bind(this);
    this.handleSelectedMernisInfoChanged = this.handleSelectedMernisInfoChanged.bind(this);

    this.labelName = this.getMessage('BusinessComponents', 'Name');
    this.labelSurName = this.getMessage('BusinessComponents', 'Surname');
    this.labelBirthPlace = this.getMessage('BusinessComponents', 'BirthPlaceText');
    this.labelBirthDate = this.getMessage('BusinessComponents', 'BirthDate');
    this.labelAddress = this.getMessage('BusinessComponents', 'Address');
    this.labelFatherName = this.getMessage('BusinessComponents', 'FatherName');
    this.labelMotherName = this.getMessage('BusinessComponents', 'MotherName');
    this.labelPhoneNumber = this.getMessage('BusinessComponents', 'PhoneNumber');
    this.labelFax = this.getMessage('BusinessComponents', 'Fax');
    this.labelEmail = this.getMessage('BusinessComponents', 'EmailAddress');
    this.labelNationalityTC = this.getMessage('BusinessComponents', 'TC');
    this.labelNationalityForeign = this.getMessage('BusinessComponents', 'Foreign');
  }

  componentWillMount() {
    super.componentWillMount();
    this.dialogResponse = BComponent.DialogResponse.NONE;
    this.loadData(this.props);
  }

  loadData(props) {
    props = props || this.props;

    if (props.thirdPartyId) {
      let dataContract = this.thirdPartyContract;
      dataContract.thirdPartyId = props.thirdPartyId;

      let request = {
        requestClass: 'BOA.Types.BusinessComponents.ThirdPartyRequest',
        requestBody: {
          MethodName: 'GetThirdPartyById',
          ResourceCode: 'IBLTUCNTAN',
          DataContract: dataContract
        },
        key: 'GetThirdPartyById'
      };
      this.proxyExecute(request);
    }
  }

  getThirdPartyByIdentityNumber(mernisIdentity, partyType) {
    let dataContract = cloneDeep(this.thirdPartyContract);
    dataContract.identityNumber = mernisIdentity.selectedIdentityNumber;
    let request = {
      requestClass: 'BOA.Types.BusinessComponents.ThirdPartyRequest',
      requestBody: {
        MethodName: 'GetThirdPartyByIdentityNumber',
        ResourceCode: 'IBLTUCNTAN',
        DataContract: dataContract
      },
      key: 'GetThirdPartyByIdentityNumber',
      params: { mernisIdentity, partyType }
    };
    this.proxyExecute(request);
  }

  fillDataFromMernisIdentity(mernisIdentity, partyType) {
    let contract = Object.assign({}, this.thirdPartyContract);
    if (partyType == 'PersonForeigner') {
      if (!mernisIdentity.SelectedIdentityNumber) {
        let msg = this.getMessage('BusinessComponents', 'NoTaxNumberSureToContinue');
        BDialogHelper.show(this.props.context, msg, BComponent.DialogType.QUESTION, BComponent.DialogResponseStyle.YESNO, '?',
          (dialogResponse: any): any => {
            if (dialogResponse == BComponent.DialogResponse.NO) {
              return;
            }
          }
        );
      }
      contract.nationality = 'Foreign';
      contract.birthDate = mernisIdentity.selectedMernisInfo.birthDate; // BLocalization.formatDateTime(mernisIdentity.selectedMernisInfo.birthDate, 'DD.MM.YYYY');
      // contract.birthDate = mernisIdentity.selectedMernisInfo.birthDate;
      contract.birthPlace = mernisIdentity.selectedMernisInfo.birthPlace;
      contract.fatherName = mernisIdentity.selectedMernisInfo.fatherName;
      contract.motherName = mernisIdentity.selectedMernisInfo.motherName;
      contract.name = mernisIdentity.selectedMernisInfo.name;
      contract.surName = mernisIdentity.selectedMernisInfo.surname;
      contract.identityNumber = mernisIdentity.selectedIdentityNumber;
      if (mernisIdentity.selectedMernisAddress != null)
        contract.address = mernisIdentity.selectedMernisAddress.addressText;
      else
        contract.address = '';

      this.setValue(contract, true);
    } else if (partyType == 'PersonCitizen') {
      contract.nationality = 'TC';
      contract.birthDate = mernisIdentity.selectedMernisInfo.birthDate; // BLocalization.formatDateTime(mernisIdentity.selectedMernisInfo.birthDate, 'DD.MM.YYYY');
      // contract.birthDate = mernisIdentity.selectedMernisInfo.birthDate;
      contract.birthPlace = mernisIdentity.selectedMernisInfo.birthPlace;
      contract.fatherName = mernisIdentity.selectedMernisInfo.fatherName;
      contract.motherName = mernisIdentity.selectedMernisInfo.motherName;
      contract.name = mernisIdentity.selectedMernisInfo.name;
      contract.surName = mernisIdentity.selectedMernisInfo.surname;
      contract.identityNumber = mernisIdentity.selectedIdentityNumber;
      if (mernisIdentity.selectedMernisAddress != null)
        contract.address = mernisIdentity.selectedMernisAddress.addressText;
      else
        contract.address = '';

      this.setValue(contract, true);
    }
  }

  showDialogMessage(dialogMessage, dialogType = BComponent.DialogType.INFO, dialogResponseStyle = BComponent.DialogResponseStyle.OK) {
    BDialogHelper.show(this.props.context, dialogMessage, dialogType, dialogResponseStyle);
  }
  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetThirdPartyById':
        if (response.success && response.value) {
          this.setValue(response.value.thirdParty);
        } else {
          this.clearValues();
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'GetThirdPartyByIdentityNumber':
        if (response.success) {
          if (response.value) {
            let msg = this.getMessage('BusinessComponents', 'ThirdPartyAlreadyExists');
            BDialogHelper.show(this.props.context, msg, BComponent.DialogType.INFO);
            this.setValue(response.value, true);
          } else {
            var { mernisIdentity, partyType } = proxyResponse.params;
            this.fillDataFromMernisIdentity(mernisIdentity, partyType);
          }
        } else {
          this.clearValues();
        }
        break;
      case 'SaveThirdParty':
        if (response.success) {
          this.dialogResponse = BComponent.DialogResponse.OK;
          let msg = this.getMessage('BusinessComponents', 'OperationSuccess');
          BDialogHelper.show(this.props.context, msg, BComponent.DialogType.INFO);
          this.clearValues();      
          BDialogHelper.close(this, BComponent.DialogResponse.OK, this.dialogResponse);    
        } else {
          BDialogHelper.show(this.props.context, this.resultErrorListToString(response.results), BComponent.DialogType.ERROR);
        }
        break;
      case 'DeleteThirdParty':
        if (response.success) {
          if (response.value) {
            this.dialogResponse = BComponent.DialogResponse.OK;
            let msg = this.getMessage('BusinessComponents', 'Deleted');
            BDialogHelper.show(this.props.context, msg, BComponent.DialogType.INFO);
            this.clearValues();
            BDialogHelper.close(this, BComponent.DialogResponse.OK, this.dialogResponse);    
          }
        } else {
          BDialogHelper.show(this.props.context, this.resultErrorListToString(response.results), BComponent.DialogType.ERROR);
        }
        break;
      default:
        break;
    }
  }


  isRequire(value) {
    if (value == null || value == undefined) {
      return getFrameworkMessage('BOA', 'Nullable');
    }
    if (typeof value === 'string' && value.trim() === '') {
      return getFrameworkMessage('BOA', 'Nullable');
    }
    return '';
  }

  isValidEmail(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    if (!re.test(value)) {
      return getFrameworkMessage('BOA', 'NotValidEmail');
    }
    return '';
  }

  validateTCNumber(identityNumber: string) {
    if (!identityNumber) {
      return this.getMessage('BusinessComponents', 'PleaseEnterIdentityNumber');
    }
    // if (typeof identityNumber != 'number') {
    //    return 'Girilen değer sayısal olmalıdır.';
    // }
    if (identityNumber.length != 11) {
      return this.getMessage('BusinessComponents', 'IdentityNumberLengthError');
    }
    if (identityNumber.startsWith('9')) {
      return this.getMessage('BusinessComponents', 'IdentityNumberCannotStartsWith9');
    }
    if (identityNumber.startsWith('0')) {
      return this.getMessage('BusinessComponents', 'IdentityNumberCannotStartsWith0');
    }
    if (!this.isValidTCNumber(identityNumber)) {
      return this.getMessage('BusinessComponents', 'InvalidIdentityNumber');
    }
    return '';
  }

  isValidTCNumber(TCNumber) {
    if (!TCNumber) {
      return false;
    }
    if (TCNumber.length != 11) {
      return false;
    }
    let TC = [11];
    for (let i = 0; i < 11; i++) {
      let a = TCNumber[i].toString();
      TC[i] = Number(a);
    }

    let oddNumbers = 0;
    let evenNumbers = 0;
    let k = 0;
    for (; k < 9; k++) {
      if (k % 2 == 0)
        oddNumbers += TC[k];
      else
        if (k % 2 != 0)
          evenNumbers += TC[k];
    }
    let t1 = (oddNumbers * 3) + evenNumbers;
    let c1 = (10 - (t1 % 10)) % 10;
    let t2 = c1 + evenNumbers;
    let t3 = (t2 * 3) + oddNumbers;
    let c2 = (10 - (t3 % 10)) % 10;
    if (c1 == TC[9] && c2 == TC[10]) {
      return true;
    }
    return false;
  }

  // TO DO: BusinessHelper.ValidateForeignIdentityNumber
  validateForeignIdentityNumber(identityNumber: string) {
    var errorMessage = '';
    if (!identityNumber) {
      errorMessage = this.getMessage('BusinessComponents', 'PleaseIdentityNumberOrTaxNumber');
      return errorMessage;
    }
    // if (!StringHelper.IsNumeric(identityNumber)) {
    //  errorMessage = BOA.Messaging.MessagingHelper.GetMessage("Kernel", "EnteredValueMustBeNumeric"));
    //   return errorMessage;
    // }
    if (identityNumber.length != 10 && identityNumber.length != 11) {
      errorMessage = this.getMessage('BusinessComponents', 'EnteredValueIsNotIdentityNumberOrTaxNumber');
      return errorMessage;
    }
    if (identityNumber.length == 10 && !this.isValidTaxNumber(identityNumber)) {
      errorMessage = this.getMessage('BusinessComponents', 'InvalidTaxNumber');
      return errorMessage;
    }
    else
      if (identityNumber.length == 11) {
        if (!this.isValidTCNumber(identityNumber)) {
          errorMessage = this.getMessage('BusinessComponents', 'InvalidIdentityNumber');
          return errorMessage;
        }
        if (!identityNumber.startsWith('9')) {
          errorMessage = this.getMessage('BusinessComponents', 'TaxNumberMustStartsWith9');
          return errorMessage;
        }
      }
    return errorMessage;
  }

  saveCommand() {
    let dataContract = this.getInstance().getValue();

    var obj = this.mernisIdentityNumber.getInstance().getValue().selectedMernisInformations;
    var identityNumber;
    if (obj)
      identityNumber = obj.selectedIdentityNumber;

    let inputNameError = this.isRequire(dataContract.name);
    let inputSurnameError = this.isRequire(dataContract.surName);
    let inputMernisError = this.state.selectedNationality == 0 ? this.validateTCNumber(identityNumber) : this.validateForeignIdentityNumber(identityNumber);
    let inputAddressError = this.isRequire(dataContract.address);

    this.setState({
      inputNameError: inputNameError,
      inputSurnameError: inputSurnameError,
      inputAddressError: inputAddressError,
      inputMernisError: inputMernisError
    });

    var text = '';
    text += inputNameError;
    text += inputSurnameError;
    text += inputAddressError;
    text += inputMernisError;

    if (text != '') {
      this.showDialogMessage(getFrameworkMessage('BOA', 'Nullable'), BComponent.DialogType.WARNING);
      return false;
    }

    dataContract.accountNumber = this.props.accountNumber;
    if (dataContract) { 
      var request = {
        requestClass: 'BOA.Types.BusinessComponents.ThirdPartySaveRequest',
        requestBody: {
          MethodName: 'SaveThirdParty',
          ResourceCode: 'IBLTUCNTAN',
          DataContract: dataContract,
          fromTransactionalExecute: true
        },
        key: 'SaveThirdParty'
      };
      this.proxyTransactionExecute(request);
    }
  }

  deleteCommand() {
    let contract = this.getInstance().getValue();
    if (contract && contract.thirdPartyId) {
      var request = {
        requestClass: 'BOA.Types.BusinessComponents.ThirdPartySaveRequest',
        requestBody: {
          MethodName: 'DeleteThirdParty',
          ResourceCode: 'IBLTUCNTAN',
          DataContract: contract,
          fromTransactionalExecute: true
        },
        key: 'DeleteThirdParty'
      };
      this.proxyTransactionExecute(request);
    } else {
      BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'ErrorOccuredDuringProcess'), BComponent.DialogType.ERROR);
    }
  }

  newCommand() {
    this.clearValues();
    this.transactionForm.disableAction('New');
    this.transactionForm.disableAction('Delete');
    this.forceUpdate();

  }

  handleOnActionClick(e) {
    switch (e.commandName) {
      case 'Save':
        this.saveCommand();
        break;
      case 'Delete':
        this.deleteCommand();
        break;
      case 'New':
        this.newCommand();
        break;
      case 'Select':
        this.handleOnClosing();
        break;
      default:
    }
  }

  resetValue() {
    let contract = Object.assign({}, this.thirdPartyContract);
    this.setState({
      contract: contract,
      isMernisHealty: true,
      isMernisIdentityVerified: false
    });
    this.thirdPartyId = 0;
    this.selectedMernisInformations = null;
    if (this.mernisIdentityNumber)
      this.mernisIdentityNumber.resetValue();
  }

  clearValues() {
    this.resetValue();
  }

  setValue(thirdParty, isMernisIdentityVerified) {
    let isVerified = isMernisIdentityVerified || this.state.isMernisIdentityVerified;
    if (thirdParty) {
      let selectedNationality = 0;
      if (thirdParty.nationality) {
        if (thirdParty.nationality == this.getMessage('BusinessComponents', 'TC'))
          selectedNationality = 0;
        else if (thirdParty.nationality == this.getMessage('BusinessComponents', 'Foreign'))
          selectedNationality = 1;
      }
      this.setState({
        contract: thirdParty,
        selectedNationality: selectedNationality,
        isMernisHealty: true,
        isMernisIdentityVerified: isVerified
      });
    }
  }

  getValue() {
    return this.state.contract;
  }

  getSnapshot() {
    return this.state;
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setValue(state.contract);
  }

  handleSelectedMernisInfoChanged() {
    this.setState({ fieldsVisible: true });
    this.transactionForm.enableAction('New');
    this.transactionForm.enableAction('Delete');
    this.selectedMernisInformations = this.mernisIdentityNumber.getInstance().getValue();
    var res = this.selectedMernisInformations;
    if (res.selectedIdentityNumber != this.mernisIdentityNumber.state.identityNumber) {
      this.getThirdPartyByIdentityNumber(res.selectedMernisInformations, res.selectedMernisInformations.dataPartyType);
    }
  }

  handleOnTabChange(e, value) {
    if (value == 1) {
      this.setState({
        disableFields: true,
        value: value
      });
    }
    else {
      this.setState({
        disableFields: false,
        value: value
      });
    }
  }

  handleRadioChange(e, value) {
    let contract = this.state.contract;
    if (value == 1) {
      contract.nationality = 'Foreign';
      this.setState({
        disableFields: true,
        value: '1',
        contract: contract
      });
    }
    else {
      contract.nationality = 'TC';
      this.setState({
        disableFields: false,
        value: '0',
        contract: contract
      });
    }
  }

  handleMernisNotHealty() {
    this.selectedMernisInformations = null;
    this.setState({
      isMernisHealty: false,
      isMernisIdentityVerified: false
    });
  }

  handleOnNameChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.name = value;
    this.setState({ inputNameError: this.isRequire(value) });
    this.setState({
      contract: contract
    });
  }

  handleOnSurnameChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.surName = value;
    this.setState({ inputSurnameError: this.isRequire(value) });
    this.setState({
      contract: contract
    });
  }

  handleOnBirthPlaceChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.birthPlace = value;
    this.setState({
      contract: contract
    });
  }

  handleOnFatherNameChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.fatherName = value;
    this.setState({
      contract: contract
    });
  }

  handleOnMotherNameChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.motherName = value;
    this.setState({
      contract: contract
    });
  }

  handleOnAddressChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.address = value;
    this.setState({ inputAddressError: this.isRequire(value) });
    this.setState({
      contract: contract
    });
  }

  handleOnPhoneNumberChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.phoneNumber = value;
    this.setState({
      contract: contract
    });
  }

  handleOnFaxNumberChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.faxNumber = value;
    this.setState({
      contract: contract
    });
  }

  handleOnEmailChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.email = value;
    this.setState({
      contract: contract
    });
  }
  
  handleOnBirthDateChange(e, value) {
    let contract = Object.assign({}, this.state.contract);
    contract.birthDate = value;
    this.setState({
      contract: contract
    });
  }

  handleOnClosing() {
    let data = this.getInstance().getValue();
    let dialogResponse = this.dialogResponse;
    BDialogHelper.close(this, dialogResponse, data);
  }

  componentDidMount() {
    super.componentDidMount();
    this.transactionForm.disableAction('New');
    this.transactionForm.disableAction('Delete');
    this.forceUpdate();

  }

  render() {
    let { context } = this.props;
    let { contract, disableFields } = this.state;
    let isMernisIdentityVerified = this.state.isMernisIdentityVerified;

    var nationalityItems = [
      { label: this.labelNationalityTC, value: '0' },
      { label: this.labelNationalityForeign, value: '1' }];


    let fields;
    let otherFields;
    if (this.state.isMernisHealty) {
      if (isMernisIdentityVerified) {
        fields = (
          <div>
            <BGridRow context={context} columnCount={2}>
              <BInformationText context={context} labelText={this.labelName} infoText={contract.name} />
              <BInformationText context={context} labelText={this.labelSurName} infoText={contract.surName} />
            </BGridRow>
            <BGridRow context={context} columnCount={2}>
              <BInformationText context={context} labelText={this.labelBirthPlace} infoText={contract.birthPlace} />
              <BInformationText context={context} labelText={this.labelBirthDate} infoText={BLocalization.formatDateTime(contract.birthDate, 'DD.MM.YYYY')} />
            </BGridRow>
            <BGridRow context={context} columnCount={2}>
              <BInformationText context={context} labelText={this.labelFatherName} infoText={contract.fatherName} />
              <BInformationText context={context} labelText={this.labelMotherName} infoText={contract.motherName} />
            </BGridRow>
          </div>
        );
      }
      else {
        fields = (
          <div>
            <BGridRow context={context} columnCount={2}>
              <BInput
                ref={r => this.inputName = r}
                context={context}
                type="text"
                floatingLabelText={this.labelName}
                value={contract.name}
                disabled={false}
                errorText={this.state.inputNameError}
                onChange={this.handleOnNameChange} />
              <BInput
                ref={r => this.inputSurname = r}
                context={context}
                type="text"
                errorText={this.state.inputSurnameError}
                floatingLabelText={this.labelSurName}
                disabled={false}
                value={contract.surName}
                onChange={this.handleOnSurnameChange} />
            </BGridRow>
            <BGridRow context={context} columnCount={2}>
              <BInput
                ref={r => this.inputBirthPlace = r}
                context={context}
                floatingLabelText={this.labelBirthPlace}
                value={contract.birthPlace}
                onChange={this.handleOnBirthPlaceChange} />
              <BBusinessDateTimeComponent
                ref={r => this.dateBirthDate = r}
                context={context}
                dateOnChange={this.handleOnBirthDateChange}
                floatingLabelTextDate={this.labelBirthDate}
                value={contract.birthDate} />
            </BGridRow>
            <BGridRow context={context} columnCount={2}>
              <BInput
                ref={r => this.inputFatherName = r}
                context={context} type="text"
                floatingLabelText={this.labelFatherName}
                value={contract.fatherName}
                disabled={disableFields}
                onChange={this.handleOnFatherNameChange} />
              <BInput
                ref={r => this.inputMotherName = r}
                context={context}
                type="text"
                disabled={disableFields}
                floatingLabelText={this.labelMotherName}
                value={contract.motherName}
                onChange={this.handleOnMotherNameChange} />
            </BGridRow>
          </div>

        );
      }

      otherFields = (
        <div>
          <BGridRow context={context} columnCount={2}>
            <BInputMask
              ref={r => this.inputPhoneNumber = r}
              context={context}
              type="Custom"
              floatingLabelText={this.labelPhoneNumber}
              value={contract.phoneNumber}
              mask='(5nn) nnn nn nn'
              size='20'
              hintText='532 123 45 67'
              onChange={this.handleOnPhoneNumberChange}
              bottomRightInfoEnable={false}
              maxLength={15} />
            <BInputMask
              ref={r => this.inputFaxNumber = r}
              context={context}
              type="Custom"
              floatingLabelText={this.labelFax}
              value={contract.faxNumber}
              onChange={this.handleOnFaxNumberChange}
              bottomRightInfoEnable={false}
              mask='(nnn) nnn nn nn' size='20'
              hintText='532 123 45 67' />
          </BGridRow>
          <BGridRow context={context} columnCount={2} verticalAlign='bottom'>
            <BInput
              ref={r => this.inputAddress = r}
              context={context} type="text"
              floatingLabelText={this.labelAddress}
              value={contract.address}
              errorText={this.state.inputAddressError}
              onChange={this.handleOnAddressChange}
              multiLine={true} rows={3}
              style={{ verticalAlign: 'bottom' }} />

            <BInputAction
              ref={r => this.inputEmail = r}
              context={context} type="text"
              floatingLabelText={this.labelEmail}
              value={contract.email}
              errorText={this.state.inputEmailError}
              onChange={this.handleOnEmailChange}
              onBlur={() => {
                if (contract)
                  this.setState({ inputEmailError: this.isValidEmail(contract.email) });
              }}
              style={{ verticalAlign: 'bottom' }} />
          </BGridRow>
        </div>
      );
    }

    return (
      <BTransactionForm
        {...this.props}
        ref={r => this.transactionForm = r}
        context={context}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.handleOnActionClick}
        onClosing={this.handleOnClosing}>
        <BCard context={this.props.context} disableCardWidth={false} style={{ maxWidth: '800px', padding: '0px 24px', fontWeight: '400' }} >
          <BRadioButtonGroup
            headerText={this.getMessage('BusinessComponents', 'Citizenship')}
            context={context}
            name='radioButtonGroup'
            valueSelected={this.state.value}
            items={nationalityItems}
            onChange={this.handleRadioChange.bind(this)} />
          {/* <BTabBar context={context}
            mode='secondary'
            centerTabs={true}
            value={this.state.value}
            tabItems={nationalityItems}
            onChange={this.handleOnTabChange.bind(this)}
            initialSelectedIndex={this.state.selectedNationality} /> */}
          <div key='thirdPartySaveDialog' style={{ paddingTop: '12px' }} >
            <BGridSection context={context} style={this.props.style}>
              <BGridRow context={context} columnCount={2}>
                <BMernisComponent
                  ref={r => this.mernisIdentityNumber = r}
                  context={context}
                  selectedMernisInfoChanged={this.handleSelectedMernisInfoChanged}
                  mernisNotHealty={this.handleMernisNotHealty}
                  identityNumber={contract.identityNumber}
                  isVisibileAddressInfoTab={true}
                  errorText={this.state.inputMernisError}
                  searchBehaviourType={'SearchForRealPerson'} />
                <div></div>
              </BGridRow>
              {
                this.state.fieldsVisible ?
                  fields : ''
              }
              {this.state.fieldsVisible ?
                otherFields : ''}
            </BGridSection>
          </div>
        </BCard>
      </BTransactionForm>
    );

  }
}

BThirdPartySaveDialog.DialogResponse = BComponent.DialogResponse;
export default BThirdPartySaveDialog;
