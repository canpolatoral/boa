import React from 'react';
import PropTypes from 'prop-types';
import { BThirdPartySaveDialog } from 'b-third-party-save-dialog';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';
import { BIconButton } from 'b-icon-button';
import { BComponent } from 'b-component';

@BComponentComposer
export class BThirdPartyComponent extends BBusinessComponent {
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    hintText: null,
    labelText: null
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the bank that is currently selected
     * @type {number}
     */
    selectedThirdPartyId: PropTypes.number,

    /**
     * Determines the bank that is currently selected
     * @type {number}
     */
    accountNumber: PropTypes.number,

    /**
     * Determines the bank that is currently selected
     * @type {string}
     */
    hintText: PropTypes.string,

    /**
     * Determines the bank that is currently selected
     * @type {string}
     */
    labelText: PropTypes.string,

    /**
     * Determines the bank that is currently selected
     * @type {bool}
     */
    disabled: PropTypes.bool,

    /**
     * Callback function fires when a city has been selected.
     * @type {func}
     */
    onThirdPartySelect: PropTypes.func,
    errorText: PropTypes.string
  };

  state = {
    thirdPartyList: [],
    selectedThirdPartyId: null,
    selectedThirdPartyComponentContract: null
  };

  valueMemberPath = 'thirdPartyId';

  constructor(props, context) {
    super(props, context);

    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleButtonOnClick = this.handleButtonOnClick.bind(this);
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
      if (nextProps.selectedThirdPartyId != this.props.selectedThirdPartyId || nextProps.accountNumber != this.props.accountNumber) {
        this.loadData(nextProps);
      }
    }
  }

  /**
   * Load third party data from data base
   * @param props
   */
  loadData(props) {
    if (this.state.thirdPartyList && this.state.thirdPartyList.length > 0) {
      return null;
    }
    props = props || this.props;

    if (props.accountNumber) {
      let proxyRequest = {
        requestClass: 'BOA.Types.BusinessComponents.ThirdPartySearchDialogRequest',
        requestBody: {
          MethodName: 'Call',
          AccountNumber: props.accountNumber,
          ResourceCode: 'IBLTUCNTAN'
        },
        key: 'ThirdPartySearchDialogCall'
      };
      this.proxyExecute(proxyRequest);
    } else {
      this.clearValues();
    }
  }

  /**
   * getThirdPartyComponentContractById
   * @param {any} id
   * @param {any} callback
   */
  getThirdPartyById(selectedThirdPartyId) {
    if (!selectedThirdPartyId) {
      this.setState({
        selectedThirdPartyComponentContract: null,
        selectedThirdPartyId: selectedThirdPartyId
      });
      return;
    }
    let proxyRequest = {
      requestClass: 'BOA.Types.BusinessComponents.ThirdPartyComponentRequest',
      requestBody: {
        MethodName: 'GetThirdPartyById',
        ThirdPartyId: selectedThirdPartyId
      },
      params: { selectedThirdPartyId: selectedThirdPartyId },
      key: 'GetThirdPartyById'
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'ThirdPartySearchDialogCall':
        if (response.success) {
          this.setValues(response.value, this.props);
        } else {
          this.clearValues();
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'GetThirdPartyById':
        var { selectedThirdPartyId } = proxyResponse.params;
        if (response.success) {
          this.setState({
            selectedThirdPartyComponentContract: response.value,
            selectedThirdPartyId: selectedThirdPartyId
          });
          this.props.onThirdPartySelect && this.props.onThirdPartySelect(response.value);
        } else {
          this.setState({
            selectedThirdPartyComponentContract: null,
            selectedThirdPartyId: selectedThirdPartyId
          });
          this.props.onThirdPartySelect && this.props.onThirdPartySelect(response.value);
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
      thirdPartyList: [],
      selectedThirdPartyId: null,
      selectedThirdPartyComponentContract: null
    });
  }

  /**
   * Set third party values by third party list
   * @param thirdPartyList
   * @param props
   */
  setValues(thirdPartyList: any[], props) {
    props = props || this.props;
    let selectedThirdPartyId = props.selectedThirdPartyId;
    if (!selectedThirdPartyId) {
      if (!this.state.selectedThirdPartyId && (thirdPartyList || []).length > 0) {
        let firstItemId = thirdPartyList[0].thirdPartyId;
        selectedThirdPartyId = firstItemId;
      }
    }

    this.setState({
      thirdPartyList: thirdPartyList,
      selectedThirdPartyId: selectedThirdPartyId
    });
  }

  /**
   * Reset the value
   */
  resetValue() {
    this.setState({
      selectedThirdPartyId: null,
      selectedThirdPartyComponentContract: null
    });
    if (this.BComboBox) {
      this.BComboBox.resetValue();
    }
  }

  /**
   * this.state.thirdPartyList
   * @returns {Array}
   */
  getValues() {
    return this.state.thirdPartyList;
  }

  /**
   * Return the selected third party that is currently selected
   * @returns {{selectedThirdParty}}
   */
  getValue() {
    return this.state.selectedThirdPartyComponentContract;
    // let item = this.BComboBox.getValue();
    // if (!item) return undefined;
    // let values = this.getValues();
    // return values.find(s => s[this.state.valueMemberPath] == item.value);
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  handleCloseDialog(dialogResponse) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
      this.state.thirdPartyList = [];
      this.loadData();
    }
  }

  handleButtonOnClick() {
    let accountNumber = this.props.accountNumber;
    let thirdPartyId = 0;
    if (accountNumber) {
      if (this.state.selectedThirdPartyComponentContract && this.state.selectedThirdPartyComponentContract.thirdParty) {
        thirdPartyId = this.state.selectedThirdPartyComponentContract.thirdParty.thirdPartyId;
      }
    }
    let dialog = <BThirdPartySaveDialog context={this.props.context} accountNumber={accountNumber} thirdPartyId={thirdPartyId} />;
    // let style = { width: '600px'/* '51%' */, height: '80%'};
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, '', this.handleCloseDialog.bind(this), {
      width: '50%',
      height: '75%'
    });
  }

  /**
   * Handle function fired when a thirt party is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let selectedThirdPartyId = selectedValues[0];
      this.getThirdPartyById(selectedThirdPartyId);
    }
  }

  render() {
    let { context } = this.props;

    let columns = [
      { key: 'identityNumber', name: this.getMessage('BusinessComponents', 'IdentityNumber'), width: 120, type: 'number', resizable: true },
      { key: 'name', name: this.getMessage('BusinessComponents', 'NameLabel'), width: 110, type: 'string', resizable: true },
      { key: 'surName', name: this.getMessage('BusinessComponents', 'SurnameLabel'), width: 150, type: 'string', resizable: true }
    ];

    let searchIconButton = (
      <BIconButton
        ref={r => (this.BIconButton = r)}
        style={{ display: 'inline-block' }}
        context={context}
        dynamicIcon="AddCircleOutline"
        iconProperties={{ nativeColor: this.props.context.theme.boaPalette.pri500 }}
        tooltip="Yetkili Arama"
        disabled={this.props.disabled}
        onClick={this.handleButtonOnClick}
      />
    );

    return (
      <div>
        {!this.props.context.localization.isRightToLeft ? null : searchIconButton}
        <div style={{ display: 'inline-block', width: '100%', maxWidth: 'calc(100% - 48px)' }}>
          <BComboBox
            ref={r => (this.BComboBox = r)}
            context={context}
            columns={columns}
            valueMemberPath={this.valueMemberPath}
            displayMemberPath="fullName"
            value={[this.state.selectedThirdPartyId]}
            dataSource={this.state.thirdPartyList}
            multiColumn={true}
            multiSelect={false}
            isAllOptionIncluded={false}
            onSelect={this.handleOnSelect}
            hintText={this.props.hintText || this.getMessage('BusinessComponents', 'ThirdPartyLabel')}
            labelText={this.props.labelText || this.getMessage('BusinessComponents', 'ThirdPartyLabel')}
            disabled={this.props.disabled}
            disableSearch={this.props.disableSearch}
            errorText={this.props.errorText}
          />
        </div>
        {!this.props.context.localization.isRightToLeft ? searchIconButton : null}
      </div>
    );
  }
}

export default BThirdPartyComponent;
