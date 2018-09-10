import React from 'react'; import PropTypes from 'prop-types';
import BThirdPartyComponent from 'b-third-party-component';
import { BBusinessComponent } from 'b-business-component';
import { BInput } from 'b-input';
import { BComboBox } from 'b-combo-box';
import { BRadioButton } from 'b-radio-button';
import { BCheckBox } from 'b-check-box';
import { BToggle } from 'b-toggle';
import sortBy from 'lodash/sortBy';
import { BComponentComposer } from 'b-component';

@BComponentComposer
export class BThirdPartyRelationPersonsComponent extends BBusinessComponent {

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    labelToggle: null,
    labelEntitled: null,
    labelCharge: null,
    labelFaxMailOrder: null,
    labelDefinedFaxNumber: null,
    labelIsOriginalOrder: null,
    labelIsSignitureApproved: null,
    labelIsPhoneApproved: null,
    labelInteviewText: null,
    labelPersonType: null,
    isEntitled: true
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    disabled: PropTypes.bool,
    isToggled: PropTypes.bool,
    isToggleDisabled: PropTypes.bool,
    thirdPartySerializeId: PropTypes.number,
    accountNumber: PropTypes.number,
    thirdPersonId: PropTypes.number,
    relationPersonId: PropTypes.number,

    isEntitled: PropTypes.bool,
    isCharge: PropTypes.bool,
    isFaxMailOrder: PropTypes.bool,
    isPhoneApproved: PropTypes.bool,
    isSignitureApproved: PropTypes.bool,
    isDefinedFaxNumber: PropTypes.bool,
    isOriginalOrder: PropTypes.bool,
    inteviewText: PropTypes.string,

    relationshipTypeIdList: PropTypes.arrayOf(PropTypes.number),
    allowFilterCustomerProperties: PropTypes.bool,
    authorizationTypeFilterList: PropTypes.arrayOf(PropTypes.number),
    showFaxMailOrder: PropTypes.bool,

    labelToggle: PropTypes.string,
    labelEntitled: PropTypes.string,
    labelCharge: PropTypes.string,
    labelFaxMailOrder: PropTypes.string,
    labelDefinedFaxNumber: PropTypes.string,
    labelIsOriginalOrder: PropTypes.string,
    labelIsSignitureApproved: PropTypes.string,
    labelIsPhoneApproved: PropTypes.string,
    labelInteviewText: PropTypes.string,
    labelPersonType: PropTypes.string,

    onToggle: PropTypes.func,
    onPersonTypeChange: PropTypes.func,
    onThirdPartySelect: PropTypes.func,
    onPersonRelationsSelect: PropTypes.func
  };

  state = {
    isToggled: this.props.isToggled,
    personRelationsList: [],
    selectedPersonType: this.getSelectedPersonType(),
    thirdPartySerializeInfo: {
      isCharge: this.props.isCharge,
      isDefinedFaxNumber: this.props.isDefinedFaxNumber,
      isEntitled: this.props.isEntitled,
      isFaxMailOrder: this.props.isFaxMailOrder,
      isOriginalOrder: this.props.isOriginalOrder,
      isPhoneApproved: this.props.isPhoneApproved,
      isSignitureApproved: this.props.isSignitureApproved,
      inteviewText: this.props.inteviewText,
      relationPersonId: this.props.relationPersonId,
      thirdPersonId: this.props.thirdPersonId
    }
  };

  valueMemberPath = 'thirdPartyId';
  personRelationsList = [];
  selectedPersonRelationsContract = {};

  constructor(props, context) {
    super(props, context);

    this.handleOnComponentToggle = this.handleOnComponentToggle.bind(this);
    this.handlePersonTypesOnChange = this.handlePersonTypesOnChange.bind(this);
    this.handlePhoneApprovedOnCheck = this.handlePhoneApprovedOnCheck.bind(this);
    this.handleDefinedFaxNumberOnCheck = this.handleDefinedFaxNumberOnCheck.bind(this);
    this.handleOriginalOrderOnCheck = this.handleOriginalOrderOnCheck.bind(this);
    this.handleSignatureApprovedOnCheck = this.handleSignatureApprovedOnCheck.bind(this);
    this.handleInterviewTextOnChange = this.handleInterviewTextOnChange.bind(this);
    this.handleOnPersonRelationsSelect = this.handleOnPersonRelationsSelect.bind(this);
    this.handleOnThirdPartySelect = this.handleOnThirdPartySelect.bind(this);
  }

  getSelectedPersonType(props) {
    props = props || this.props;
    if (props.isEntitled)
      return 'Entitled';
    else if (props.isCharge)
      return 'Charge';
    else if (props.isFaxMailOrder)
      return 'FaxMailOrder';
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
      if ((nextProps.thirdPartySerializeId != this.props.thirdPartySerializeId) ||
        (nextProps.accountNumber != this.props.accountNumber)) {
        this.loadData(nextProps);
      }
      this.setState(
        {
          isToggled: nextProps.isToggled,
          selectedPersonType: this.getSelectedPersonType(nextProps),
          thirdPartySerializeInfo: {
            isCharge: nextProps.isCharge,
            isDefinedFaxNumber: nextProps.isDefinedFaxNumber,
            isEntitled: nextProps.isEntitled,
            isFaxMailOrder: nextProps.isFaxMailOrder,
            isOriginalOrder: nextProps.isOriginalOrder,
            isPhoneApproved: nextProps.isPhoneApproved,
            isSignitureApproved: nextProps.isSignitureApproved,
            inteviewText: nextProps.inteviewText,
            relationPersonId: nextProps.relationPersonId,
            thirdPersonId: nextProps.thirdPersonId
          }
        }
      );
    }
  }

  /**
   * Load third party data from data base.
   * @param props
   */
  loadData(props) {
    props = props || this.props;

    if (props.thirdPartySerializeId) {
      this.getThirdPartyWithRelationPersonsSerializeById(props.thirdPartySerializeId);
    } else if (props.accountNumber) {
      this.getPersonRelation(props.accountNumber);
    }
  }

  /**
   * Load relation persons by serialize id
   * @param serializeId
   */
  getThirdPartyWithRelationPersonsSerializeById(thirdPartySerializeId) {
    let request = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.ThirdPartyWithRelationPersonsSerializeRequest',
      requestBody: {
        MethodName: 'GetThirdPartyWithRelationPersonsSerializeById',
        SerializeId: thirdPartySerializeId
      }
    };
    this.proxyExecute(request);
  }

  /**
   * 1. Get the all persons by account number
   * @param accountNumber
   */
  getPersonRelation(accountNumber) {
    if (accountNumber) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.PersonInfoRequest',
        requestBody: {
          MethodName: 'GetAllPersonsByAccountNumber',
          AccountNumber: accountNumber
        },
        params: {accountNumber},
        key: 'GetAllPersonsByAccountNumber'
      };

      this.proxyExecute(request);
    }
  }

  /**
   * 2. Get the customer info by account number
   * @param accountNumber
   * @param allPersonsByAccountNumberList
   */
  getThirdPartyComponentCustomerInfo(accountNumber, allPersonsByAccountNumberList) {

    let request = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.AccountComponentCustomerInfoRequest',
      requestBody: {
        MethodName: 'GetThirdPartyComponentCustomerInfo',
        AccountNumber: accountNumber,
        MainAccountNumber: accountNumber,
        StateNoList: null,
        Status: null
      },
      params:{accountNumber, allPersonsByAccountNumberList},
      key:'GetThirdPartyComponentCustomerInfo'
    };

    this.proxyExecute(request);
  }

  /**
   * 3. Get the person relation info by account number
   * @param accountNumber
   * @param personRelationList
   */
  getPersonRelationsByColumns(accountNumber, tempPersonRelationList) {


    let request = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.CustomerRequest',
      requestBody: {
        MethodName: 'GetCustomerAuthorizedPersonList',
        AccountNumber: accountNumber,
        RelationshipTypeid: null
      },
      params:{ tempPersonRelationList},
      key:'GetCustomerAuthorizedPersonList'
    };
    this.proxyExecute(request);
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllPersonsByAccountNumber':
        if (response.success) {
          var { accountNumber } = proxyResponse.params;
          let allPersonsByAccountNumberList = response.value;
          this.getThirdPartyComponentCustomerInfo(accountNumber, allPersonsByAccountNumberList);
        } else {
          this.clearValues();
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'GetThirdPartyComponentCustomerInfo':
        if (response.success) {
          var { allPersonsByAccountNumberList } = proxyResponse.params;
          let tempPersonRelationList = [];
          if (response.value != null && this.props.allowFilterCustomerProperties &&
          (response.value.sharedCustomerType != 0 || response.value.personType == 1 ||
            (response.value.accountGroupType == 2 && response.value.personType == 0))) {
            allPersonsByAccountNumberList.forEach((item) => {
              if (item.personType == 0) {
                let contract = {};
                contract.personid = item.personid;
                contract.toPersonName = item.firstName + ' ' + item.lastName;
                contract.userDescription = item.firstName + ' ' + item.lastName;
                contract.toPersonid = item.personid;
                contract.permissionType = '';
                contract.authorizationType = 99;
                tempPersonRelationList.push(contract);
              }
            }, this);

            this.getPersonRelationsByColumns(accountNumber, tempPersonRelationList);
          }
        } else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'GetCustomerAuthorizedPersonList' :
        if (response.success) {
          let temp2PersonRelationList = [];
          let temp3PersonRelationList = [];
          var { tempPersonRelationList } = proxyResponse.params;
          temp2PersonRelationList = response.value;
          var resourceCode = this.props.pageParams.resourceInfo.resourceCode;
          resourceCode = resourceCode ? resourceCode.toLowerCase() : '';
          var txList = this.props.context.applicationContext.staticData?this.props.context.applicationContext.staticData.resourceTransactionChannelList:undefined;

          var resourceTransactionList = null;
          if (txList) {
            resourceTransactionList = txList[resourceCode] ? txList[resourceCode].filter(x => x.channel == 1 && x.isAuthorizedCheckActive == 1) : null;
          }
          temp2PersonRelationList.forEach(function (item) {
            let contract = {};
            contract.authorizationType = item.authorizationTypeId;
            contract.personid = item.mainPersonId;
            contract.relationshipTypeid = item.relationshipTypeId;
            contract.relationid = item.customerRelationId;
            contract.relationshipName = item.relationshipType;
            contract.toPersonName = item.personName;
            contract.toPersonid = item.ToPersonid;
            contract.userDescription = item.description;
            contract.permissionType = item.authorizationType;
            var date = (item.endDate == null || item.endDate == undefined) ? new Date() : new Date(item.endDate);
            if (date >= new Date()) {
              if (resourceTransactionList != null && resourceTransactionList.length != 0) {
                if (item.authorizationTypeId == 99)
                  temp3PersonRelationList.push(contract);
                else {
                  resourceTransactionList.forEach((resource) => {
                    var transactionContract = item.relationTransactionList.filter(x => x.transactionCode == resource.transactionCode);
                    if (transactionContract.length != 0)
                      temp3PersonRelationList.push(contract);
                  }, this);
                }
              }
              else {
                temp3PersonRelationList.push(contract);
              }
            }
          }, this);

          if (this.props.relationshipTypeIdList && this.props.relationshipTypeIdList.length > 0) {
            this.props.relationshipTypeIdList.forEach((i) => {
              let m = temp3PersonRelationList.filter(a => a.relationshipTypeid == i);
              if (m && m.length > 0) {
                tempPersonRelationList = tempPersonRelationList.concat(m);
              }
            }, this);
          }
          else {
            temp3PersonRelationList.forEach((item) => {
              tempPersonRelationList.push(item);
            }, this);
          }

        // tempPersonRelationList = tempPersonRelationList.Where(l => ((l.EndDate != null ? l.EndDate :
        // ClientApplicationContext.Application.Channel.Today) >= ClientApplicationContext.Application.Channel.Today)).ToList();

          let temp4PersonRelationList = [];
          if (this.props.authorizationTypeFilterList && this.props.authorizationTypeFilterList.length > 0) {
            this.props.authorizationTypeFilterList.forEach((i) => {
              let m = tempPersonRelationList.find(a => a.authorizationType == i);
              if (m) {
                temp4PersonRelationList.push(m);
              }
            }, this);
          }
          else {
            temp4PersonRelationList = tempPersonRelationList;
          }

          this.personRelationsList = sortBy(temp4PersonRelationList, 'personName');
          this.setState({
            personRelationsList: this.personRelationsList || []
          });

          if (!this.personRelationsList || this.personRelationsList.length == 0) {
            let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
            contract.isCharge = true;
            contract.isEntitled = false;
            this.setState({ thirdPartySerializeInfo: contract });
          }

        } else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'GetThirdPartyWithRelationPersonsSerializeById':
        if (response.success) {
          this.setState({ thirdPartySerializeInfo: response.value });
        } else {
          this.clearValues();
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      default:
        break;
    }
  }

  /**
   * Clear third party values
   */
  clearValues() {
    this.setState({
      personRelationsList: []
    });
  }

  /**
   * Get the third party serialize info
   * @returns ThirdPartySerializeInfo
   */
  getValue() {
    let thirdPartyComponentContract = {};
    if (this.bThirdPartyComponent) {
      thirdPartyComponentContract = this.bThirdPartyComponent.getInstance().getValue();
    }
    return {
      thirdPartySerializeInfo: this.state.thirdPartySerializeInfo,
      thirdPartyComponentContract: thirdPartyComponentContract,
      personRelationsContract: this.selectedPersonRelationsContract
    };
  }

  getSnapshot() {
    return {
      state: this.state,
      personRelationsList: this.personRelationsList
    };
  }

  setSnapshot(snapshot) {
    let { state, personRelationsList } = snapshot;
    this.personRelationsList = personRelationsList;
    this.setState({ ...state });
  }

  /**
   * Handle function fired when a relation person is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnPersonRelationsSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      this.selectedPersonRelationsContract = selectedItems[0];

      let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
      contract.relationid = selectedValues[0];
      this.setState({
        thirdPartySerializeInfo: contract
      });
      if (this.props.onPersonRelationsSelect) {
        this.props.onPersonRelationsSelect(this.selectedPersonRelationsContract);
      }
    }
  }

  /**
   * Handle function fired when a third party is selected
   * @param thirdParty
   */
  handleOnThirdPartySelect(thirdParty) {
    if (thirdParty) {
      let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
      if (thirdParty.thirdParty) {
        contract.thirdPersonId = thirdParty.thirdParty.thirdPartyId;
      } else {
        contract.thirdPersonId = undefined;
      }
      this.setState({
        thirdPartySerializeInfo: contract
      });
      if (this.props.onThirdPartySelect) {
        this.props.onThirdPartySelect(thirdParty);
      }
    }
  }

  /**
   * Handle function that is fired when the toggle switch is toggled.
   * @param event
   * @param isInputChecked
   */
  handleOnComponentToggle(event, isInputChecked) {
    this.setState({
      isToggled: isInputChecked
    });
    if (this.props.onToggle) {
      this.props.onToggle(isInputChecked);
    }
  }

  /**
   * Handle function fired when person type is changed
   * @param event

   */
  handlePersonTypesOnChange(event) {
    var newSelection = event.target.value;
    let isEntitled = false;
    let isCharge = false;
    let isFaxMailOrder = false;
    if (newSelection == 'Entitled') {
      isEntitled = true;
    } else if (newSelection == 'Charge') {
      isCharge = true;
    } else if (newSelection == 'FaxMailOrder') {
      isFaxMailOrder = true;
    }


    let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
    contract.isEntitled = isEntitled;
    contract.isCharge = isCharge;
    contract.isFaxMailOrder = isFaxMailOrder;

    this.setState({
      selectedPersonType: newSelection,
      thirdPartySerializeInfo: contract,

    });

    if (this.props.onPersonTypeChange) {
      this.props.onPersonTypeChange(newSelection);
    }
  }

  /**
   * Handle function fired when defined fax number is checked
   * @param event
   * @param isInputChecked
   */
  handleDefinedFaxNumberOnCheck(event, isInputChecked) {
    let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
    contract.isDefinedFaxNumber = isInputChecked;
    this.setState({
      thirdPartySerializeInfo: contract
    });
  }

  /**
   * Handle function fired when orginal order is checked
   * @param event
   * @param isInputChecked
   */
  handleOriginalOrderOnCheck(event, isInputChecked) {
    let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
    contract.isOriginalOrder = isInputChecked;
    this.setState({
      thirdPartySerializeInfo: contract
    });
  }

  /**
   * Handle function fired when signature approved is checked
   * @param event
   * @param isInputChecked
   */
  handleSignatureApprovedOnCheck(event, isInputChecked) {
    let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
    contract.isSignitureApproved = isInputChecked;
    this.setState({
      thirdPartySerializeInfo: contract
    });
  }

  /**
   * Handle function fired when phone approved is checked
   * @param event
   * @param isInputChecked
   */
  handlePhoneApprovedOnCheck(event, isInputChecked) {
    let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
    contract.isPhoneApproved = isInputChecked;
    this.setState({
      thirdPartySerializeInfo: contract
    });
  }

  /**
   * Handle function fired when interview text is changed
   * @param e
   * @param v
   */
  handleInterviewTextOnChange(e, v) {
    let contract = Object.assign({}, this.state.thirdPartySerializeInfo);
    let value = v.trim();
    contract.inteviewText = value;
    this.setState({
      thirdPartySerializeInfo: contract
    });
  }

  resetValue() {
    this.setState({
      thirdPartySerializeInfo: Object.assign({}, thirdPartyWithRelationPersonsSerializeContract)
    });
    if (this.comboBoxPersonRelation) {
      this.comboBoxPersonRelation.resetValue();
    }
    if (this.bThirdPartyComponent) {
      this.bThirdPartyComponent.resetValue();
    }
  }

  render() {
    let personTypes = [
      {
        'label': this.props.labelEntitled || this.getMessage('BusinessComponents', 'ThirdPartyEntitledLabel'),
        'value': 'Entitled',
        'disabled': this.props.disabled,
        'style': { display: 'inline-block' }
      },
      {
        'label': this.props.labelCharge || this.getMessage('BusinessComponents', 'ThirdPartyChargedLabel'),
        'value': 'Charge',
        'disabled': this.props.disabled,
        'style': { display: 'inline-block' }
      }];

    if (this.props.showFaxMailOrder) {
      personTypes.push({
        'label': this.props.labelFaxMailOrder || this.getMessage('BusinessComponents', 'ThirdPartyFaxMailOrder'),
        'value': 'FaxMailOrder',
        'disabled': this.props.disabled
      });
    }

    let accountRelationsColumns = [
      { key: 'personid', name: this.getMessage('CoreBanking', 'PersonNo'), width: 1, type: 'number', resizable: true },
      { key: 'relationshipName', name: this.getMessage('CoreBanking', 'LabelTitle'), width: 150, type: 'string', resizable: true },
      { key: 'toPersonName', name: this.getMessage('BusinessComponents', 'NameSurNameText'), width: 275, type: 'string', resizable: true }];

    let { context } = this.props;

    return (
      <div style={this.props.style}>
        <div>
          <div>
            <BToggle
              context={context}
              disabled={this.props.isToggleDisabled}
              onToggle={this.handleOnComponentToggle}
              labelPosition={'left'}
              toggled={this.state.isToggled}
              defaultToggled={this.state.isToggled}
              label={this.props.labelToggle || this.getMessage('BusinessComponents', 'ThirdPartyToggleLabel')} />

            <div style={{ display: (this.state.isToggled ? 'block' : 'none') }}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <BRadioButton context={context}
                    name='group2'
                    label={personTypes[0].label}
                    value={personTypes[0].value}
                    key={personTypes[0].value}
                    checked={this.state.selectedPersonType === personTypes[0].value}
                    onChange={this.handlePersonTypesOnChange} />
                </div>
                <div style={{ flex: 1 }}>
                  <BRadioButton context={context}
                    name='group2'
                    label={personTypes[1].label}
                    value={personTypes[1].value}
                    key={personTypes[1].value}
                    checked={this.state.selectedPersonType === personTypes[1].value}
                    onChange={this.handlePersonTypesOnChange} />
                </div>
                { this.props.showFaxMailOrder? <div style={{ flex: 1 }}>
                  <BRadioButton context={context}
                    name='group2'
                    label={personTypes[2].label}
                    value={personTypes[2].value}
                    key={personTypes[2].value}
                    checked={this.state.selectedPersonType === personTypes[2].value}
                    onChange={this.handlePersonTypesOnChange} />
                </div>:''}
              </div>

              <div style={{ display: (this.state.thirdPartySerializeInfo.isCharge ? 'block' : 'none') }}>
                <BThirdPartyComponent
                  context={context}
                  ref={r => this.bThirdPartyComponent = r}
                  snapKey={this.getSnapKey('bThirdPartyComponent')}
                  accountNumber={this.props.accountNumber}
                  selectedThirdPartyId={this.state.thirdPartySerializeInfo.thirdPersonId}
                  onThirdPartySelect={this.handleOnThirdPartySelect}
                  labelText={this.props.labelCharge || this.getMessage('BusinessComponents', 'ThirdPartyChargedLabel')}
                  disabled={this.props.disabled}
                  hintText={this.props.labelCharge || this.getMessage('BusinessComponents', 'ThirdPartyChargedLabel')} />
              </div>

              <div style={{
                display: (this.state.thirdPartySerializeInfo.isFaxMailOrder ? 'block' : 'none'),
                marginTop: '10px', paddingLeft: '15px'
              }}>
                <BCheckBox
                  ref={r => this.checkBoxDefinedFaxNumber = r}
                  label={this.props.labelDefinedFaxNumber || this.getMessage('BusinessComponents', 'ThirdPartyDefinedFaxNumber')}
                  defaultChecked={this.state.thirdPartySerializeInfo.isDefinedFaxNumber}
                  labelPosition='right'
                  context={context}
                  disabled={this.props.disabled}
                  onCheck={this.handleDefinedFaxNumberOnCheck} />
                <BCheckBox
                  ref={r => this.checkBoxOriginalOrder = r}
                  defaultChecked={this.state.thirdPartySerializeInfo.isOriginalOrder}
                  labelPosition='right'
                  label={this.props.labelIsOriginalOrder || this.getMessage('BusinessComponents', 'ThirdPartyIsOriginalOrder')}
                  context={context}
                  disabled={this.props.disabled}
                  onCheck={this.handleOriginalOrderOnCheck} />
                <BCheckBox
                  ref={r => this.checkBoxSignatureApproved = r}
                  defaultChecked={this.state.thirdPartySerializeInfo.isSignitureApproved}
                  labelPosition='right'
                  label={this.props.labelIsSignitureApproved || this.getMessage('BusinessComponents', 'ThirdPartyIsSignatureApproved')}
                  context={context}
                  disabled={this.props.disabled}
                  onCheck={this.handleSignatureApprovedOnCheck} />
                <BCheckBox
                  ref={r => this.checkBoxPhoneApproved = r}
                  defaultChecked={this.state.thirdPartySerializeInfo.isPhoneApproved}
                  labelPosition='right'
                  label={this.props.labelIsPhoneApproved || this.getMessage('BusinessComponents', 'ThirdPartyIsPhoneApproved')}
                  context={context}
                  disabled={this.props.disabled}
                  onCheck={this.handlePhoneApprovedOnCheck} />

                <div style={{ display: (this.state.thirdPartySerializeInfo.isPhoneApproved ? 'block' : 'none') }}>
                  <BInput
                    ref={r => this.inputInterviewText = r}
                    floatingLabelText={this.props.labelInteviewText || this.getMessage('BusinessComponents', 'ThirdPartyInterviewText')}
                    hintText={this.props.labelInteviewText || this.getMessage('BusinessComponents', 'ThirdPartyInterviewText')}
                    value={this.state.thirdPartySerializeInfo.inteviewText}
                    context={context}
                    disabled={this.props.disabled}
                    onChange={this.handleInterviewTextOnChange} />
                </div>
              </div>

              <div style={{
                display: ((this.state.thirdPartySerializeInfo.isEntitled ||
                  this.state.thirdPartySerializeInfo.isFaxMailOrder) ? 'block' : 'none')
              }}>
                <BComboBox
                  ref={r => this.comboBoxPersonRelation = r}
                  context={context}
                  hintText={this.props.labelEntitled || this.getMessage('BusinessComponents', 'ThirdPartyEntitledLabel')}
                  labelText={this.props.labelEntitled || this.getMessage('BusinessComponents', 'ThirdPartyEntitledLabel')}
                  columns={accountRelationsColumns}
                  valueMemberPath='toPersonid'
                  displayMemberPath="toPersonName"
                  onSelect={this.handleOnPersonRelationsSelect}
                  value={[this.state.thirdPartySerializeInfo.relationPersonId]}
                  dataSource={this.state.personRelationsList}
                  multiColumn={true}
                  multiSelect={false}
                  disabled={this.props.disabled}
                  isAllOptionIncluded={false} />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

// let personRelationsContract: {
//   authorizationType: number, autoDescription: string, endDate: Date,
//   permissionType: string, personid: number, relationid: number,
//   relationshipName: string, relationshipTypeid: number, roleid: number,
//   share: number, startDate: Date, stateDate: Date,
//   stateMaker: string, stateNo: number, stateWFNo: number,
//   toPersonid: number, toPersonName: string, userDescription: string
// } = {
//   authorizationType: 0, personid: 0
// };

let thirdPartyWithRelationPersonsSerializeContract: {
  inteviewText: string, isCharge: boolean,
  isDefinedFaxNumber: boolean, isEntitled: boolean,
  isFaxMailOrder: boolean, isOriginalOrder: boolean,
  isPhoneApproved: boolean, isSignitureApproved: boolean,
  relationPersonId: number, thirdPersonId: number
} = {
  relationPersonId: 0, thirdPersonId: 0
};

export default BThirdPartyRelationPersonsComponent;
