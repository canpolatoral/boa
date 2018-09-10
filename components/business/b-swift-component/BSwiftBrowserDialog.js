import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';
import { BLabel } from 'b-label';
import { BRadioButton } from 'b-radio-button';
import { BInput } from 'b-input';
import { BBrowseForm } from 'b-browse-form';

export class BSwiftBrowserDialog extends BBusinessComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isGetbySwiftCode: true,
      isGetbyCorporateName: false,
      selectedSwift: {},
      swiftCodeInputText: '',
      dataSource: [],
      floatingLabelText: this.getMessage('BusinessComponents', 'SwiftCode'),
    };

    this.gridColumns = [
      {
        'key': 'swiftCode',
        'name': this.getMessage('BusinessComponents', 'SwiftCode'), // 'Swift Kodu',
        'resizable': true
      },
      {
        'key': 'corporateName',
        'name': this.getMessage('BusinessComponents', 'InstitutionName'), // 'Kurum Adı',
        'resizable': true
      },
      {
        'key': 'city',
        'name': this.getMessage('BusinessComponents', 'CityLabel'), // 'Şehir',
        'resizable': true
      },
      {
        'key': 'countryCode',
        'name': this.getMessage('BusinessComponents', 'CountryCodeLabel'), // 'Ülke Kodu',
        'resizable': true
      },
      {
        'key': 'countryName',
        'name': this.getMessage('BusinessComponents', 'CountryName'), // 'Ülke Adı',
        'resizable': true
      },
      {
        'key': 'address1',
        'name': this.getMessage('BusinessComponents', 'Address1'), // 'Adres 1',
        'resizable': true
      },
      {
        'key': 'address2',
        'name': this.getMessage('BusinessComponents', 'Address2'), // 'Adres 2',
        'resizable': true
      }
    ];

  }

  static propTypes = {
    ...BBusinessComponent.propTypes,
    ...BBrowseForm.propTypes,
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.object,
    autogenerateColumns: PropTypes.bool,
    selectedIndexes: PropTypes.arrayOf(PropTypes.number),
    selectedSwift: PropTypes.object,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,

  };


  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    leftPaneWidth: 270,
    leftPaneMaxWidth: 510,
    resourceCode: 'IBLRSWFSRC',
    isGetbySwiftCode: true,
    isGetbyCorporateName: false,
    autogenerateColumns: false,
    selectedIndexes: []
  };

  onCloseClick(e) {
    this.close(null);
    if (this.props.onClosing) this.props.onClosing(e);
  }

  updateGridSize(width, height) {
    this.setState({ gridWidth: width, gridHeight: height });
  }
  onIsGetbySwiftCodeFilterChanged(e, isInputChecked) {
    this.setState({ isGetbySwiftCode: isInputChecked, isGetbyCorporateName: !isInputChecked, floatingLabelText: this.getMessage('BusinessComponents', 'SwiftCode') });
  }
  onIsGetbyCorporateNameFilterChanged(e, isInputChecked) {
    this.setState({ isGetbyCorporateName: isInputChecked, isGetbySwiftCode: !isInputChecked, floatingLabelText: this.getMessage('BusinessComponents', 'InstitutionName') });
  }

  onCustomerGridSelectionChanged() {
    var changed = this.getSelectedRow();
    if (changed.length > 0) {
      this.setState({ selectedSwift: changed });
      this.browseForm.enableAction('Ok');
      this.browseForm.enableAction('Clean');

    }
  }
  actionBarButtonClick(e) {
    if (e.actionId == 11) // Bilgi Getir
    {
      this.browseForm.disableAction('Ok');
      this.getAllSwifts(this.state.swiftCodeInputText);
    } else if (e.actionId == 26) // OK
    {
      let selectedSwift = this.getSelectedRow();
      if (!selectedSwift[0] || !selectedSwift[0].swiftCode) {
        if (!this.props.selectedSwift) {
          BDialogHelper.show(this.props.context, this.getMessage('CoreBanking', 'SelectRecord'), BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
          return;
        }
        else {
          this.setState({ selectedSwift: this.props.selectedSwift },
            BDialogHelper.close(this, BComponent.DialogResponse.OK, this.state.selectedSwift));
        }
      }
      else {
        this.setState({ selectedSwift: selectedSwift[0] });
        BDialogHelper.close(this, BComponent.DialogResponse.OK, selectedSwift);
      }
    }
    else if (e.actionId == 30) // Clean
    {
      this.setState({ dataSource: [], isGetbySwiftCode: true, isGetbyCorporateName: false, selectedSwift: {}, swiftCodeInputText: '' });
      this.browseForm.disableAction('Clean');
      this.browseForm.disableAction('Ok');
    }
  }

  getSelectedRow() {
    let selectedRow = this.browseForm.getSelectedRows();
    return selectedRow;
  }
  componentWillReceiveProps(nextProps) {
    let criteriaExpanded = nextProps.criteriaPanelExpanded;
    this.browseForm.disableAction('Ok');
    this.browseForm.disableAction('Clean');
    if (this.state.criteriaExpanded != criteriaExpanded
      || this.state.criteriaPanelHeader != nextProps.criteriaPanelHeader) {
      this.setState({ criteriaExpanded: criteriaExpanded, criteriaPanelHeader: nextProps.criteriaPanelHeader });
    }
  }
  componentDidMount() {
    super.componentDidMount();
    this.browseForm.disableAction('Ok');
    this.browseForm.disableAction('Clean');
  }
  onTextChanged(e) {
    this.setState({ swiftCodeInputText: e.target.value });
  }
  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.getAllSwifts(this.state.swiftCodeInputText);
    }
    return true;
  }

  render() {

    return (
      <BBrowseForm
        {...this.props}
        dataSource={this.state.dataSource}
        columns={this.gridColumns}
        ref={r => this.browseForm = r}
        onClosing={this.onClosing}
        onActionClick={this.actionBarButtonClick.bind(this)}
        context={this.props.context}
        selectable='single'
        onGridRowSelectionChanged={this.onCustomerGridSelectionChanged.bind(this)}
        resourceInfo={this.props.resourceInfo}
        inDialog={true}>
        <BLabel context={this.props.context} style={{ color: this.props.context.theme.boaPalette.pri500 }}
          text={this.getMessage('BusinessComponents', 'Criterias')}
        />
        <BRadioButton
          context={this.props.context}
          checked={this.state.isGetbySwiftCode}
          ref={r => this.criteriaSwiftCode = r}
          style={this.checkBoxStyle}
          labelPosition="right"
          label={this.getMessage('BusinessComponents', 'FromSwiftCodeLabel')}
          onChange={this.onIsGetbySwiftCodeFilterChanged.bind(this)}
        />
        <BRadioButton
          context={this.props.context}
          checked={this.state.isGetbyCorporateName}

          ref={r => this.criteriaCorporateName = r}
          style={this.checkBoxStyle}
          labelPosition="right"
          label={this.getMessage('BusinessComponents', 'ByCorporateName')}
          onChange={this.onIsGetbyCorporateNameFilterChanged.bind(this)}
        />
        <BInput
          context={this.props.context}
          ref={r => this.binputactionSwiftCode = r}
          hintText={this.getMessage('BusinessComponents', 'EnterInstNameOrSwiftCode')}
          value={this.state.swiftCodeInputText}
          type='text'
          floatingLabelText={this.state.floatingLabelText}
          onKeyDown={this.onKeyDown.bind(this)}
          onChange={this.onTextChanged.bind(this)}
        />
      </BBrowseForm>
    );
  }

  getCriteriaType() {
    if (this.state.isGetbyCorporateName && this.state.isGetbyCorporateName == true && this.state.isGetbySwiftCode == false) {
      return 0;
    }
    else if (this.state.isGetbySwiftCode && this.state.isGetbySwiftCode == true && this.state.isGetbyCorporateName == false) {
      return 1;
    }
    else if (this.state.isGetbySwiftCode && this.state.isGetbySwiftCode == true && this.state.isGetbyCorporateName && this.state.isGetbyCorporateName == true) {
      return null;
    }
  }
  getAllSwifts(swiftCode) {

    if (!swiftCode || swiftCode == undefined || swiftCode == 'undefined') {
      swiftCode = '';
    }
    let parameters = { swiftCode: swiftCode, props: this.props };
    let proxyRequest = {
      requestClass: 'BOA.Types.BusinessComponents.SwiftSearchDialogRequest',
      requestBody: {
        swiftText: swiftCode,
        isSwiftCode: this.state.isGetbySwiftCode == true ? 1 : 0,
        methodName: 'GetSwiftSearchList'
      },
      key: 'GET_SWIFT_SEARCH_LIST',
      params: parameters
    };
    this.proxyExecute(proxyRequest);
    return;
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GET_SWIFT_SEARCH_LIST':
        if (response.success) {
          if (response.value.length == 0) {
            BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'NoRecordForSwiftCode'), BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
          } else {
            this.browseForm.enableAction('Clean');
            this.setState({ dataSource: response.value });
          }
        }
        else {
          this.setState({ dataSource: [] });
          this.clearSwiftInfo();
          this.debugLog('error: GetSwiftSearchList method error: ' + response.results[0].errorMessage, 3);
          BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'ProcessFailed'), BComponent.DialogType.Error, BComponent.DialogResponseStyle.OK);
        }
        break;

      default:
        break;
    }
  }

}
export default BSwiftBrowserDialog;
