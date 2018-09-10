import React from 'react';
import PropTypes from 'prop-types';
import ValidationHelper from './validate';

import { BMernisDialog } from './BMernisDialog';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import { BBlackListComponent } from 'b-black-list-component';
@BComponentComposer
export class BMernisComponent extends BBusinessComponent {
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    showDialogMessages: true,
    canGetOnlineInfoMoreThanOne: false,
    isTextAndButtonsEnabled: true,
    isReadOnly: false,
    searchBehaviourType: 'All',
    isVisibileAddressInfoTab: true,
    isVisibileSearchAndClearButton: true,
    isVisibileSearchOnlineButton: false,
    componentPartyType: 'PersonCitizen', //   PersonCitizen = 0, PersonForeigner = 1, Corporate = 2,UnDefined = 3
    showBlackListDialogMessages: true,
    isBlackListReadonly: true,
    floatingLabelText: null,
    mernisInfo: null
  }

  static propTypes = {
    ...BBusinessComponent.propTypes,
    identityNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showDialogMessages: PropTypes.bool,
    canGetOnlineInfoMoreThanOne: PropTypes.bool,
    isTextAndButtonsEnabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    searchBehaviourType: PropTypes.oneOf(['All', 'SearchForRealPerson', 'SearchForCorporate']),
    isVisibileAddressInfoTab: PropTypes.bool,
    isVisibileSearchAndClearButton: PropTypes.bool,
    isVisibileSearchOnlineButton: PropTypes.bool,
    componentPartyType: PropTypes.oneOf(['PersonCitizen', 'PersonForeigner', 'Corporate', 'UnDefined']),
    showBlackListDialogMessages: PropTypes.bool,
    isBlackListReadonly: PropTypes.bool,
    selectedMernisInfoChanged: PropTypes.func,
    selectedMernisInfoCleared: PropTypes.func,
    recordCouldntFind: PropTypes.func,
    mernisNotHealty: PropTypes.func,
    onBlur: PropTypes.func,
    clearClick: PropTypes.func,
    searchClick: PropTypes.func,
    floatingLabelText: PropTypes.string,
    errorText: PropTypes.string,
    mernisInfo: PropTypes.any
  }

  state = {
    identityNumber: this.props.identityNumber ? this.props.identityNumber : '',
    isBlackListIndividual: true,
    blackListContract: [],
    blackListMernisInfo: []
  }

  constructor(props, context) {
    super(props, context);
    this.componentPartyType = this.props.componentPartyType;
    this.rightIconList = [];
    this.selectedMernisInformations = null;
    ValidationHelper.setGetMessage(this.getMessage);
    if (this.props.isVisibileSearchAndClearButton) {
      this.rightIconList.push(
        {
          dynamicIcon: 'Clear',
          iconProperties: { nativeColor: this.props.context.theme.boaPalette.pri500 },
          onClick: this.clearButtonClicked.bind(this)
        },
      );
      this.rightIconList.push(
        {
          bIcon: 'ArrowCircle',
          iconProperties: { folder: 'Others', nativeColor: this.props.context.theme.boaPalette.pri500 },
          onClick: this.searchClicked.bind(this)
        },
      );
      this.rightIconList.push(
        {
          dynamicIcon: 'AddCircleOutline',
          iconProperties: { 'nativeColor': this.props.context.theme.boaPalette.pri500 },
          onClick: this.showClicked.bind(this),
          disabled: !this.props.isTextAndButtonsEnabled
        },
      );
    }
    if (this.props.isVisibileSearchOnlineButton) {
      this.rightIconList.push({
        dynamicIcon: 'Cached',
        iconProperties: { 'nativeColor': this.props.context.theme.boaPalette.pri500 },
        onClick: this.searchOnlineClicked.bind(this)
      });
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.identityNumber) {
      this.identityNumber = this.props.identityNumber.toString();

      if (this.validateIdentityNumber(this.identityNumber)) { // girilen değeri valide eder, geçerli ise devam yoksa girilen değer temizlenir.

        if (this.props.isVisibileSearchOnlineButton) { // online ara butonu görünür ise bileşeni readonly durumuna çeker.
          this.setState({ isReadOnly: true });
        } else {
          this.getMernisInfo(this.identityNumber, false);
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (this.state.identityNumber != nextProps.identityNumber) {
      this.setState({ identityNumber: nextProps.identityNumber });
      if (nextProps.identityNumber) {
        this.identityNumber = nextProps.identityNumber.toString();
        if (this.validateIdentityNumber(this.identityNumber)) { // girilen değeri valide eder, geçerli ise devam yoksa girilen değer temizlenir.
          if (nextProps.isVisibileSearchOnlineButton) { // online ara butonu görünür ise bileşeni readonly durumuna çeker.
            this.setState({ isReadOnly: true });
          } else {
            this.getMernisInfo(this.identityNumber, false);
          }
        }
      }
    }
  }

  showMernisDialog() {
    let dialog = (
      <BMernisDialog context={this.props.context}
        canGetOnlineInfoMoreThanOne={this.props.canGetOnlineInfoMoreThanOne}
        isVisibileAddressInfoTab={this.props.isVisibileAddressInfoTab}
        searchBehaviourType={this.props.searchBehaviourType}
        onClosing={this.handleClose} />);
    BDialogHelper.showWithResourceCode(this.props.context, null, dialog, 0, 0, '', this.handleClose.bind(this));
  }

  showBlackListDialog() {
    let dialog = (
      <BBlackListComponent context={this.props.context}
        isIndividual={this.state.isBlackListIndividual}
        blackListContract={this.state.blackListContract}
        blackListMernisInfo={this.state.blackListMernisInfo}
        disableActions={this.props.isBlackListReadonly}
        ref={r => this.blackListComponent = r} />
    );
    BDialogHelper.showWithResourceCode(this.props.context, null, dialog, 0, 0, '', this.handleBlackListClose.bind(this));
  }

  searchClicked() {
    this.identityNumber = this.bInputIdentity.getInstance().getValue();
    if (this.identityNumber) {
      this.getMernisInfo(this.identityNumber, false);
    }
  }

  showClicked() {
    this.showMernisDialog();
  }

  clearButtonClicked() {
    this.resetValue();
  }

  searchOnlineClicked() {
    this.identityNumber = this.bInputIdentity.getInstance().getValue();
    if (this.identityNumber) {
      this.getMernisInfo(this.identityNumber, true);
    }
    else {
      // this.setState({ open: true });
    }
  }

  handleClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.YES) {
      this.setValue(data, true);
    }
  }

  handleBlackListClose(dialogResponse) {
    if (dialogResponse == BComponent.DialogResponse.CANCEL) {
      this.setValue(null, false);
    }
    else {
      this.setState({ identityNumber: this.selectedMernisInformations.selectedIdentityNumber });
      if (dialogResponse == BComponent.DialogResponse.OK) {
        this.blackListVerificationType = 1;
      } else {
        this.blackListVerificationType = 0;
      }
    }
  }

  validateIdentityNumber(identityNumber: string) {
    // normalde burada numeric mi diye bir kontrol var ancak input type numeric olduğu için bu kontrolü burada yapmıyoruz.
    if (identityNumber.length != 11 && identityNumber.length != 10) {
      this.showDialogMessage(this.getMessage('BusinessComponents', 'InvalidTCKNOrTaxNumberError'), BComponent.DialogType.WARNING);
      return false;
    }
    else if (!this.isValidTaxOrTcNumber(identityNumber)) {
      this.showDialogMessage(this.getMessage('BusinessComponents', 'EnteredTCKNOrTaxNumberIsInvalid'), BComponent.DialogType.WARNING);
      return false;
    }
    return true;
  }

  raiseMernisNotHealty() {
    if (this.props.mernisNotHealty)
      this.props.mernisNotHealty();
  }

  raiseRecordCouldntFind() {
    if (this.props.recordCouldntFind)
      this.props.recordCouldntFind();
  }

  raiseSelectedMernisInfoChanged() {
    if (this.props.selectedMernisInfoChanged)
      this.props.selectedMernisInfoChanged();
  }

  // TO DO BOA.Commondaki ValidationHelper.IsValidTaxOrTcNumber metodu kullanılacak.
  isValidTaxOrTcNumber(taxOrTcNumber: number) {
    if (taxOrTcNumber == 0)
      return false;

    if (taxOrTcNumber.length == 10)
      return ValidationHelper.isValidTaxNumber(taxOrTcNumber.toString());
    else if (taxOrTcNumber.length == 11)
      return ValidationHelper.isValidTCNumber(taxOrTcNumber.toString());
    else
      return false;
  }

  // Genel bir dialog gösterme sağlanırsa ona entegre olunacak. [olundu]
  showDialogMessage(dialogMessage, dialogType = BComponent.DialogType.INFO, dialogResponseStyle = BComponent.DialogResponseStyle.OK) {
    if (this.props.showDialogMessages)
      BDialogHelper.show(this.props.context, dialogMessage, dialogType, dialogResponseStyle);
  }

  // BusinessHelper.GetIdentityDataPartyType
  getIdentityDataPartyType(identityNumber: string) {
    if (identityNumber.length == 11) {
      if (identityNumber[0].toString() == '9') {
        // Yabancı sorgula
        return 'PersonForeigner';
      }
      else {
        // TCKN sorgula
        return 'PersonCitizen';
      }
    }
    else
      if (identityNumber.length == 10) {
        // Vergi Numarası veya yabancı
        return 'UnDefined';
      }
    return 'UnDefined';
  }

  getMernisAddressInfo(forceOnline: bool) {
    // Eğer adres tabı visible değilse hiç gitme.
    if (this.props.isVisibileAddressInfoTab != true)
      return;

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

  getActionList(stateValue) {
    return stateValue ? [this.clearActionButton, this.searchActionButton, this.addActionButton] : [this.addActionButton];
  }

  getTheme() {
    return this.props.context.theme;
  }

  addActionButton = {
    dynamicIcon: 'AddCircleOutline',
    iconProperties: { color: 'primary' },
    onClick: () => {
      this.showClicked();
    }
  };

  searchActionButton = {
    bIcon: 'ArrowCircle',
    iconProperties: { folder: 'Others', color: 'primary' },
    onClick: () => {
      this.searchClicked();
    }
  };

  clearActionButton = {
    dynamicIcon: 'Clear',
    iconProperties: { color: this.getTheme().boaPalette.base400 },
    onClick: () => {
      this.clearButtonClicked();
    }
  };

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'getMernisAddressInfo':
        if (response.success) {
          this.selectedMernisInformations.selectedMernisAddress = response.value;
          this.raiseSelectedMernisInfoChanged();
        } else {
          this.debugLog('Adres bilgileri getirirken hata oluştu.');
          this.selectedMernisInformations.selectedMernisAddress = null;
          this.raiseSelectedMernisInfoChanged();
        }
        break;
      case 'GetMernisInfoByIdentityNumber':
        if (response.success) {
          if (response.value && response.value.length > 0) {
            this.isReadOnly = true;
            // this.ControlSearch.IsEnabled = false;
            this.selectedMernisInformations = {
              selectedIdentityNumber: this.props.identityNumber,
              dataPartyType: 'PersonCitizen'
            };
            this.componentPartyType = 'PersonCitizen';
            this.selectedMernisInformations.selectedMernisInfo = response.value[0];
            if (this.props.forceOnline == true)
              this.searchedOnlineList.push(this.props.identityNumber);

            this.getMernisAddressInfo(this.props.forceOnline);

            // kara liste kontrolü
            this.isInBlackList(this.selectedMernisInformations);
          }
          else {
            this.mernisInfoList = null;
            this.raiseRecordCouldntFind();
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'), BComponent.DialogType.INFO);
            this.setState({ identityNumber: '' });
            return false;
          }
        } else {
          if (response.results.indexOf(x => x.errorMessage == this.getMessage('BusinessComponents', 'MernisInfoMessage3')) >= 0) {
            this.isMernisServiceHealty = false;
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'), BComponent.DialogType.WARNING);
            this.raiseMernisNotHealty();
          } else {
            this.showDialogMessage(response.results[0].errorMessage, BComponent.DialogType.ERROR);
          }
          this.setState({ identityNumber: '' });
          return false;
        }

        break;
      case 'MernisForForeignerByTaxNumber':
        if (response.success) {
          if (response.value && response.value.length > 0) {
            this.isReadOnly = true;
            // this.ControlSearch.IsEnabled = false;
            this.selectedMernisInformations = {
              selectedIdentityNumber: this.props.identityNumber,
              dataPartyType: 'PersonForeigner',
              selectedMernisForeignerInfo: response.value[0]
            };
            this.componentPartyType = 'PersonForeigner';

            if (this.props.forceOnline == true)
              this.searchedOnlineList.push(this.props.identityNumber);
            this.raiseSelectedMernisInfoChanged();

            // kara liste kontrolü
            this.isInBlackList(this.selectedMernisInformations);
          }
          else {
            this.raiseRecordCouldntFind();
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'), BComponent.DialogType.INFO);
            this.setState({ identityNumber: '' });
          }
        } else {
          if (response.results.indexOf(x => x.errorMessage == this.getMessage('BusinessComponents', 'MernisInfoMessage3')) >= 0) {
            this.isMernisServiceHealty = false;
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'), BComponent.DialogType.WARNING);
            this.raiseMernisNotHealty();
          } else {
            this.showDialogMessage(response.results[0].errorMessage);
          }
          this.setState({ identityNumber: '' });
        }

        break;
      case 'MernisTreasuryDataByTaxNumber':
        if (response.success) {
          if (response.value) {
            if (response.value) {
              this.isReadOnly = true;
              // this.ControlSearch.IsEnabled = false;
              this.selectedMernisInformations = {
                selectedIdentityNumber: this.props.identityNumber,
                isTaxNumberExists: response.value.isTaxNumberExists,
                dataPartyType: null,
                selectedMernisInfoForCorporate: null,
                selectedMernisForeignerInfo: null
              };

              if (response.value.dataPartyType == 2) { // 'Corporate'
                if (this.props.searchBehaviourType == 'Corporate') {
                  this.showDialogMessage(this.getMessage('BusinessComponents', 'CanMakeTransactionOnlyTaxNumberBelongsToRealPerson'), BComponent.DialogType.WARNING);
                  this.setState({ identityNumber: '' });
                  return false;
                }
                this.selectedMernisInformations.dataPartyType = 'Corporate';
                this.componentPartyType = 'Corporate';
                if (response.value.corporateContractList != null && response.value.corporateContractList.length > 0) {
                  this.IsReadOnly = true;
                  // this.ControlSearch.IsEnabled = false;
                  this.selectedMernisInformations.selectedMernisInfoForCorporate = response.value.corporateContractList[0];
                  this.raiseSelectedMernisInfoChanged();

                } else {
                  this.raiseRecordCouldntFind();
                  // Eğer VKN sorgulaması yapıldıysa ve sorgulama başarısız ise değer korunacaktır.
                  this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage5'));
                  //  ClearSelectedInformations(thisControl);
                  return false;
                }
              } else if (response.value.dataPartyType == 1) { // 'PersonForeigner'
                if (this.props.searchBehaviourType == 'SearchForCorporate') {
                  this.showDialogMessage(this.getMessage('BusinessComponents', 'CanMakeTransactionOnlyTaxNumberBelongsToOrganization'), BComponent.DialogType.WARNING);
                  this.setState({ identityNumber: '' });
                  return false;
                }
                this.selectedMernisInformations.dataPartyType = 'PersonForeigner';
                this.componentPartyType = 'PersonForeigner';
                if (response.value.foreignerContract != null) {
                  this.IsReadOnly = true;
                  // this.ControlSearch.IsEnabled = false;
                  this.selectedMernisInformations.selectedMernisForeignerInfo = response.value.foreignerContract;
                  this.raiseSelectedMernisInfoChanged();
                }
                else {
                  this.raiseRecordCouldntFind();
                  this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage5'));
                  this.setState({ identityNumber: '' });
                  return false;
                }
              } else {
                this.selectedMernisInformations.dataPartyType = 'UnDefined';
                this.componentPartyType = 'UnDefined';

                this.raiseRecordCouldntFind();
                this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage5'));
                return false;
              }

              // kara liste kontrolü
              this.isInBlackList(this.selectedMernisInformations);
              return true;
            }
          }
          else {
            this.raiseRecordCouldntFind();
            this.showDialogMessage(this.getMessage('BusinessComponents', 'MernisInfoMessage3'));
            this.setState({ identityNumber: '' });
            return false;
          }

        } else {
          this.showDialogMessage(this.getMessage('BusinessComponents', 'ExceptionThrown'), BComponent.DialogType.ERROR);
          this.setState({ identityNumber: '' });
          return false;
        }
        break;
      case 'BlackListRequest':
        if (!response.success) {
          this.setValue(this.props.mernisInfo, false);
        } else {
          let { mernisInfo } = proxyResponse.params;
          this.selectedMernisInformations = {
            selectedIdentityNumber: mernisInfo.selectedIdentityNumber,
            dataPartyType: 'PersonCitizen',
            selectedMernisInfo: mernisInfo
          };

          if (response.value != null && ((response.value.individualBlackList != null && response.value.individualBlackList.length > 0) || (response.value.corporateBlackList != null && response.value.corporateBlackList.length > 0))) {
            var myObj = (mernisInfo.selectedMernisInfo) ? mernisInfo.selectedMernisInfo : (mernisInfo.selectedMernisForeignerInfo ? mernisInfo.selectedMernisForeignerInfo : mernisInfo.selectedMernisInfoForCorporate);
            var x = [];
            x.push(myObj); // tipinin array olması gerekiyor.
            this.setState({
              identityNumber: mernisInfo.selectedIdentityNumber,
              isBlackListIndividual: this.props.searchType == 0,
              blackListContract: this.props.searchType == 0 ? response.value.individualBlackList : response.value.corporateBlackList,
              blackListMernisInfo: x
            }, this.showBlackListDialog);
          } else {
            this.setValue(mernisInfo, false);
          }
        }
        break;
      default:
        break;
    }
  }

  getMernisPersonCitizenInfo(identityNumber: string, forceOnline: bool) {
    var message = ValidationHelper.validateTCNumber(identityNumber);
    if (message != null) {
      this.showDialogMessage(message);
      return false;
    }

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
      requestBody: {
        identityNumber: identityNumber + '',
        ForceOnline: forceOnline,
        MethodName: 'GetMernisInfoByIdentityNumber'
      },
      key: 'GetMernisInfoByIdentityNumber'
    };
    this.proxyExecute(proxyRequest);
  }

  getMernisForeignerInfo(identityNumber: string, forceOnline: bool) {
    var message = ValidationHelper.validateForeignIdentityNumber(identityNumber);
    if (message != null) {
      this.showDialogMessage(message);
      return false;
    }

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
      requestBody: {
        identityNumber: identityNumber + '',
        ForceOnline: forceOnline,
        MethodName: 'MernisForForeignerByTaxNumber'
      },
      key: 'MernisForForeignerByTaxNumber'
    };
    this.proxyExecute(proxyRequest);
  }

  getMernisForeignOrCorporateInfo(identityNumber: string) {
    var message = ValidationHelper.validateTaxNumber(identityNumber);
    if (message != null) {
      this.showDialogMessage(message);
      return false;
    }
    let requestBody = {
      identityNumber: identityNumber + '',
      resourceCode: 'IBLRMRNSKM',
      methodName: 'MernisTreasuryDataByTaxNumber'
    };

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.MernisRequest',
      requestBody: requestBody,
      key: 'MernisTreasuryDataByTaxNumber'
    };
    this.proxyExecute(proxyRequest);

  }

  isInBlackList(mernisInfo: any) {
    this.blackListVerificationType = 0;
    if (mernisInfo == null || !this.props.showBlackListDialogMessages) {  // Kara liste kontrolü yapma.
      this.setValue(mernisInfo, false);
      return;
    }

    var identityNumber = '';
    var name = '';
    var surname = '';
    var fatherName = '';
    var corporateName = '';
    var searchType = 0;
    var motherName = '';
    var birthDate;
    if (mernisInfo.selectedMernisInfo != null) {
      identityNumber = mernisInfo.selectedMernisInfo.identityNumber;
      name = mernisInfo.selectedMernisInfo.name;
      surname = mernisInfo.selectedMernisInfo.surname;
      fatherName = mernisInfo.selectedMernisInfo.fatherName;
      searchType = 0;
      motherName = mernisInfo.selectedMernisInfo.motherName;
      birthDate = mernisInfo.selectedMernisInfo.birthDate;
    }
    else if (mernisInfo.selectedMernisInfoForCorporate != null) {
      identityNumber = mernisInfo.selectedMernisInfoForCorporate.taxNumber;
      corporateName = mernisInfo.selectedMernisInfoForCorporate.commercialName;
      searchType = 1;
    }
    else if (mernisInfo.selectedMernisForeignerInfo != null) {
      identityNumber = mernisInfo.selectedMernisForeignerInfo.identityNumber;
      name = mernisInfo.selectedMernisForeignerInfo.name;
      surname = mernisInfo.selectedMernisForeignerInfo.surname;
      fatherName = mernisInfo.selectedMernisForeignerInfo.fatherName;
      searchType = 0;
      motherName = mernisInfo.selectedMernisForeignerInfo.motherName;
      birthDate = mernisInfo.selectedMernisForeignerInfo.birthDate;
    }
    else {
      this.setValue(mernisInfo, false);
      return;
    }

    let requestBody = {
      taxNumber: identityNumber + '',
      name: name,
      surname: surname,
      fatherName: fatherName,
      corporateName: corporateName,
      searchType: searchType,
      birthDate: birthDate,
      motherName: motherName,
      methodName: 'GetBlackListCompositeInformation'
    };

    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.BlackListRequest',
      requestBody: requestBody,
      key: 'BlackListRequest',
      params: { mernisInfo }
    };
    this.proxyExecute(proxyRequest);
  }

  getMernisInfo(identityNumber: string, forceOnline: bool) {
    this.componentPartyType = this.getIdentityDataPartyType(identityNumber);
    if (this.componentPartyType != 'UnDefined' && this.props.searchBehaviourType == 'SearchForCorporate') {
      this.showDialog(this.getMessage('BusinessComponents', 'CanMakeTransactionOnlyTaxNumberBelongsToOrganization'), BComponent.DialogType.WARNING);
      this.setState({ identityNumber: '' });
      return;
    }
    if (this.props.canGetOnlineInfoMoreThanOne == false && forceOnline == true && (this.componentPartyType == 'PersonCitizen' || this.componentPartyType == 'PersonForeigner') && this.searchedOnlineList.indexOf(identityNumber) >= 0) {
      this.showDialog(this.getMessage('BusinessComponents', 'OnlyOneQueryInfo'), BComponent.DialogType.WARNING);
      this.setState({ identityNumber: '' });
      return;
    }

    if (this.componentPartyType == 'PersonCitizen') {
      this.getMernisPersonCitizenInfo(identityNumber, forceOnline);
    }
    else if (this.componentPartyType == 'PersonForeigner') {
      this.getMernisForeignerInfo(identityNumber, forceOnline);
    }
    else {
      this.getMernisForeignOrCorporateInfo(identityNumber);
    }
  }

  resetValue() {
    this.setState({
      identityNumber: this.props.identityNumber ? this.props.identityNumber : '',
      isBlackListIndividual: true,
      blackListContract: [],
      blackListMernisInfo: []
    });
    this.componentPartyType = this.props.componentPartyType;
    this.selectedMernisInformations = null;
  }

  getValue() {
    let selectedMernisInformations = this.selectedMernisInformations;
    selectedMernisInformations.selectedIdentityNumber = this.selectedMernisInformations.selectedMernisInfo.identityNumber;
    return {
      selectedMernisInformations,
      selectedIdentityNumber: this.selectedMernisInformations.selectedMernisInfo.identityNumber,
      blackListVerificationType: this.blackListVerificationType
    };
  }

  setValue(value, checkBlackList = true) {
    this.selectedMernisInformations = value;
    this.setState({ identityNumber: this.selectedMernisInformations ? this.selectedMernisInformations.selectedIdentityNumber : ' ' });
    if (checkBlackList)
      this.isInBlackList(this.selectedMernisInformations);
    else {
      this.raiseSelectedMernisInfoChanged();
    }
  }

  getSnapshot() {
    return {
      state: this.state,
      selectedMernisInformations: this.selectedMernisInformations,
      searchedOnlineList: this.searchedOnlineList,
      // rightIconList: this.rightIconList,
      snapShotIdentity: this.bInputIdentity.getInstance().getValue()
    };
  }

  setSnapshot(snapshot) {
    let snapState = { ...snapshot.state };
    this.setState(snapState);
    this.selectedMernisInformations = snapshot.selectedMernisInformations;
    this.searchedOnlineList = snapshot.searchedOnlineList;
    // this.rightIconList = snapshot.rightIconList;
    this.snapShotIdentity = snapshot.snapShotIdentity;
  }

  onTextChanged(e, value) {
    if (!isNaN(value) || value == '') {
      this.setState({ identityNumber: value });
    } else {
      var temp = this.state.identityNumber;
      this.setState({ identityNumber: temp == '' ? null : '' }, () => { this.setState({ identityNumber: temp }); });
    }
  }
  handleonKeyDown(event) {
    if (event.key == 'Enter') {
      console.log('enter press here! ');
      this.searchClicked(event);
    }
  }

  render() {
    let { context } = this.props;
    return (
      <BInputAction
        ref={r => this.bInputIdentity = r}
        value={this.snapShotIdentity || this.state.identityNumber}
        context={context}
        defaultValue={this.state.identityNumber}
        floatingLabelText={this.props.floatingLabelText ? this.props.floatingLabelText : this.getMessage('BusinessComponents', 'IdentityTaxNumber')}
        hintText={this.props.floatingLabelText ? this.props.floatingLabelText : this.getMessage('BusinessComponents', 'IdentityTaxNumber')}
        maxLength={11}
        rightIconList={this.getActionList(this.state.identityNumber)}
        // rightIconList={this.rightIconList}
        onBlur={this.props.onBlur}
        errorText={this.props.errorText}
        type={'text'}
        onChange={this.onTextChanged.bind(this)}
        onKeyDown={this.handleonKeyDown.bind(this)}
      />
    );
  }
}

export default BMernisComponent;
