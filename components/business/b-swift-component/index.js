import React from 'react'; import PropTypes from 'prop-types';
import BSwiftBrowserDialog from './BSwiftBrowserDialog';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent, BComponentComposer } from 'b-component';
import { BInputAction } from 'b-input-action';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { BInput } from 'b-input';

@BComponentComposer
export class BSwiftBrowser extends BBusinessComponent {
  static deleteSvgIcon = 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z';

  static propTypes = {
    ...BBusinessComponent.propTypes,
    style: PropTypes.object,
    label: PropTypes.string,
    fec: PropTypes.short,
    channelId: PropTypes.short,
    selectedItemChange: PropTypes.func,
    selectedItemClear: PropTypes.func,
    disabled: PropTypes.bool,
    selectedCorporateName: PropTypes.string,
    selectedSwiftCode: PropTypes.string,
    swiftLabel: PropTypes.string,
    swiftCode: PropTypes.string,
    corporateName: PropTypes.string,
    city: PropTypes.string,
    countryCode: PropTypes.string,
    countryName: PropTypes.string,
    bankAddress1: PropTypes.string,
    bankAddress2: PropTypes.string,
    selectedSwift: PropTypes.object
  };
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    style: null,
    label: null,
    fec: null,
    channelId: null,
    selectedSwiftCode: null,
    selectedItemChange: null,
    selectedItemClear: null,
    selectedCorporateName: null,
    disabled: false
  };

  _addButton = { dynamicIcon: 'AddCircleOutline', iconProperties: { nativeColor: this.props.context.theme.boaPalette.pri500 }, onClick: this.addSwiftClicked.bind(this) };
  _searchButton = { bIcon: 'ArrowCircle', iconProperties: { folder: 'Others', nativeColor: this.props.context.theme.boaPalette.pri500 }, onClick: this.findSwiftClicked.bind(this) };
  _clearActionButton = { dynamicIcon: 'Clear', iconProperties: { nativeColor: this.props.context.theme.boaPalette.base400 }, onClick: this.clearSwiftClicked.bind(this) };


  constructor(props, context) {
    super(props, context);
    this.initialState();
  }

  initialState() {
    this.state = {
      swiftCodeInputText: null,
      bankNameInputText: null,
      selectedSwift: null
    };
  }

  resetState() {
    this.setState({
      swiftCodeInputText: null,
      bankNameInputText: null,
      selectedSwift: null
    });
  }

  getValue() {
    return {
      selectedSwift: this.state.selectedSwift
    };
  }
  getValues() {
    return {
      swiftList: this.state.swiftList
    };
  }
  resetValue() {
    this.clearSwiftClicked();
  }
  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }
  findSwiftClicked() {
    this.findSwiftItemBySwiftCode(null, this.state.swiftCodeInputText);
  }
  clearSwiftClicked() {
    this.selectedItemClear();
  }
  addSwiftClicked() {
    let dialog = (
      <BSwiftBrowserDialog context={this.props.context}
        fec={this.props.fec}
        channelId={this.props.channelId}
        onClosing={this.handleClose.bind(this)}
        selectedItemChange={this.props.selectedItemChange}
        swiftList={this.props.swiftList}
        selectedSwift={this.state.selectedSwift}
        selectedSwiftCode={this.props.selectedSwiftCode}
        selectedCorporateName={this.props.selectedCorporateName}
      />);
    BDialogHelper.showWithResourceCode(this.props.context,
      null
      , dialog
      , 0
      , 0
      , this.getMessage('BusinessComponents', 'SwiftDialog')
      , this.handleClose.bind(this)
      , { width: '75%', height: '90%' });
  }
  handleClose(dialogResponse, data) {
    if (data == null) {
      return;
    } else {
      if (dialogResponse == BComponent.DialogResponse.OK) {
        this.setState({ selectedSwift: data[0], swiftCodeInputText: data[0].swiftCode, bankNameInputText: data[0].corporateName }, () => {
          if (this.props.selectedItemChange) {
            this.props.selectedItemChange(data, null);
          }
        });
      }
    }
  }
  selectedItemClear() {
    if (this.props.selectedItemClear) {
      this.props.selectedItemClear();
    }
    this.resetState();
    this.onTextChanged(null, '');
  }
  onTextChanged(e, value) {
    this.setState({ swiftCodeInputText: value });
  }
  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.findSwiftItemBySwiftCode(null, this.state.swiftCodeInputText);
    }
    return true;
  }
  render() {
    let messageEnterSwiftCode = this.getMessage('BusinessComponents', 'SwiftCode');
    let messageSwiftCode = this.getMessage('BusinessComponents', 'SwiftCode');
    let messageInstitutionNameBySwift = this.getMessage('BusinessComponents', 'InstitutionNameBySwiftCode');
    let messageInstitutionName = this.getMessage('BusinessComponents', 'InstitutionName');
    return (
      <BGridSection context={this.props.context} style={this.props.style}>
        <BGridRow context={this.props.context}>
          <BInputAction
            ref={r => this.binputactionSwiftCode = r}
            context={this.props.context}
            hintText={messageEnterSwiftCode}
            value={this.state.swiftCodeInputText}
            type='text'
            floatingLabelText={messageSwiftCode}
            onKeyDown={this.onKeyDown.bind(this)}
            onChange={this.onTextChanged.bind(this)}
            bottomRightInfoEnable={false}
            leftIconList={[]}
            rightIconList={this.getActionList(this.state.swiftCodeInputText)}
            disabled={this.props.disabled} />
        </BGridRow>
        {this.state.bankNameInputText != null && this.state.bankNameInputText != '' ? (
          <BGridRow context={this.props.context}>
            <BInput ref={r => this.binputactionBankName = r}
              context={this.props.context}
              hintText={messageInstitutionNameBySwift}
              floatingLabelText={messageInstitutionName}
              value={this.state.bankNameInputText}
              type='text'
              onKeyDown={null}
              onChange={null}
              bottomRightInfoEnable={false}
              disabled={true} />
          </BGridRow>)
          : null}

      </BGridSection>
    );
  }


  getActionList(stateValue) {
    if (this.props.disabled)
      return [];
    else
      return stateValue ? [this._clearActionButton, this._searchButton, this._addButton] : [this._addButton];
  }

  findSwiftItemBySwiftCode(response, swiftCode) {
    if (this.state.swiftList && this.state.swiftList.length > 0) { return null; }
    if (!swiftCode) {
      swiftCode = '';
    }

    if (!response) {
      let parameters = { swiftCode: swiftCode, props: this.props };
      let proxyRequest = {
        requestClass: 'BOA.Types.BusinessComponents.SwiftSearchDialogRequest',
        requestBody: {
          swiftText: swiftCode,
          isSwiftCode: 1,
          methodName: 'GetSwiftSearchList'
        },
        key: 'GET_SWIFT_SEARCH_LIST',
        params: parameters
      };
      this.proxyExecute(proxyRequest);
      return;
    }

    if (response.success) {
      var linearSwiftList = response.value;
      this.setState({ swiftList: linearSwiftList });
      if (swiftCode) {
        for (var index = 0; index < linearSwiftList.length; index++) {
          var element = linearSwiftList[index];
          if (element.swiftCode.toLowerCase() == swiftCode.toLowerCase()) {
            var defaultSwift = {};
            defaultSwift = element;
            break;
          }
          else if (element.swiftCode.toLowerCase().indexOf(swiftCode.toLowerCase()) > -1) {
            defaultSwift = element;
            break;
          }
        }
        if (linearSwiftList.length == 0) {
          let message = this.getMessage('BusinessComponents', 'NoRecordForSwiftCode');
          this.setState({ bankNameInputText: '' });
          BDialogHelper.show(this.props.context, message, BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
        }
        else {
          this.setState({
            selectedSwift: defaultSwift,
            swiftCodeInputText: defaultSwift ? defaultSwift.swiftCode : null,
            bankNameInputText: defaultSwift ? defaultSwift.corporateName : null,
            swiftList: linearSwiftList
          });
        }

        this.props.selectedItemChange(defaultSwift, null);
      }
      else {
        let message = this.getMessage('BusinessComponents', 'CriteriaDescription');
        BDialogHelper.show(this.props.context, message, BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
      }
    }
    else {
      let message = this.getMessage('BusinessComponents', 'ProcessFailed');
      this.debugLog('error: GetSwiftSearchList method error: ' + response.results[0].errorMessage, 3);
      BDialogHelper.show(this.props.context, message, BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
      return null;
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GET_SWIFT_SEARCH_LIST':
        this.findSwiftItemBySwiftCode(response, params.swiftCode);
        break;

      default:
        break;
    }
  }

  componentWillReceiveProps(nextProps) {

    var isSwiftChanged = nextProps.selectedSwiftCode != this.props.selectedSwiftCode;

    if (isSwiftChanged && this.state.swiftCodeInputText != null && nextProps.selectedSwiftCode == this.state.swiftCodeInputText) {
      isSwiftChanged = false;
    }

    if (isSwiftChanged) {
      var nextSwiftCode = nextProps.selectedSwiftCode;
      if (nextSwiftCode) {
        this.findSwiftItemBySwiftCode(null, nextSwiftCode);
      }
      else {
        this.setState({ swiftCodeInputText: '', bankNameInputText: '' });
      }
    }

  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.selectedSwiftCode)
      this.findSwiftItemBySwiftCode(null, this.props.selectedSwiftCode);
  }
}
export default BSwiftBrowser;
