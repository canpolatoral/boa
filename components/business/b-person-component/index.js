import React from 'react';
import PropTypes from 'prop-types';
import { BComponentComposer, DialogType } from 'b-component';
import BPersonSearchDialog from './BPersonSearchDialog';

import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';

export var PersonType;
(function (PersonType) {
  PersonType[PersonType['RealPerson'] = 0] = 'RealPerson';
  PersonType[PersonType['CorporatePerson'] = 1] = 'CorporatePerson';
  PersonType[PersonType['All'] = 3] = 'All';
})(PersonType || (PersonType = {}));
@BComponentComposer
export class BPersonComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    disabled: PropTypes.bool,
    personId: PropTypes.int,
    personType: PropTypes.oneOf([PersonType.RealPerson, PersonType.CorporatePerson, PersonType.All]),
    errorText: PropTypes.string,
    selectedItemChange: PropTypes.func
  }

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    disabled: false,
    personId: null,
    personType: PersonType.All,
    selectedItemChange: null
  }

  _addButton = {
    dynamicIcon: 'AddCircleOutline',
    iconProperties: { nativeColor:  this.props.context.theme.boaPalette.pri500  },
    onClick: this.addButtonClicked.bind(this),
    context: this.context
  };
  _searchButton = {
    bIcon: 'ArrowCircle',
    iconProperties: { folder: 'Others', nativeColor: this.props.context.theme.boaPalette.pri500  },
    onClick: this.actionSearchClicked.bind(this),
    context: this.context
  };
  _clearActionButton = {
    dynamicIcon: 'Clear',
    onClick: this.clearButtonClicked.bind(this),
    context: this.context
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      personId: this.props.personId,
      disabled: this.props.disabled
    };
  }

  resetState() {
    this.setState({
      personId: null,
      errorText: null,
      selectedPerson: null,
      searchText: null,
      disabled: this.props.disabled || false
    }, () => {
      if (this.props.selectedItemChange != null) {
        this.props.selectedItemChange(null);
      }
    }); // , () => { this.binputaction.resetValue() }
    if (this.binputaction && this.binputaction.binput) {
      this.binputaction.resetValue();
    }
  }
  getActionList(stateValue) {
    // if (this.props.disabled)
    //   return [];
    // else
    //   return stateValue ? [this._clearActionButton, this._searchButton] : [this._addButton];
    return stateValue ? [this._clearActionButton, this._searchButton, this._addButton] : [this._addButton];
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.personId !== this.props.personId) {
      this.setState({ personId: nextProps.personId });
      this.getAllPersons(nextProps.personId);
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  onBlur() {
    this.setState({ disabled: false }, () => {
      this.getAllPersons(this.state.personId);
    });
  }

  onChange(e, value) {
    if (value)
      this.setState({ searchText: value.trim() });
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      this.getAllPersons(this.state.searchText);
    }
    return true;
  }

  getValue() {
    return this.state.selectedPerson;
  }

  resetValue() {
    this.resetState();
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  render() {
    let { context } = this.props;
    return (
      <BInputAction
        ref={r => this.binputaction = r}
        type='text'
        errorText={this.props.errorText}
        hintText={this.getMessage('BusinessComponents', 'Person')}
        context={context}
        floatingLabelText={this.getMessage('BusinessComponents', 'IdOrTaxOrPersonNumber')}
        onKeyDown={this.onKeyDown.bind(this)}
        rightIconList={this.getActionList(this.state.searchText)}
        value={this.state.searchText}
        onChange={this.onChange}
        onBlur={this.onBlur}
        disabled={this.state.disabled} />
    );
  }

  addButtonClicked() {
    let dialog = (
      <BPersonSearchDialog context={this.props.context} />);
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, this.getMessage('BusinessComponents', 'PersonSearch'), this.handleClose.bind(this), { width: '65%', height: '70%' });
  }

  handleClose(dialogResponse, data) {
    if (data == null) {
      return;
    } else {
      if (dialogResponse == BComponent.DialogResponse.OK) {
        this.setState({ selectedPerson: data, searchText: data.personid + ' - ' + data.name }, () => {
          if (this.props.selectedItemChange) {
            this.props.selectedItemChange(data);
          }
        });
      }
    }
  }

  actionSearchClicked() {
    this.setState({ disabled: true }, () => {
      this.getAllPersons(this.state.searchText);
    });
  }

  clearButtonClicked() {
    this.resetState();
    this.onChange(null, '');
  }

  getAllPersons(parameter) {
    if (!parameter)
      return;

    parameter = parameter.toString().trim();
    let request = {requestClass: 'BOA.Types.Kernel.BusinessHelper.PersonSearchRequest'};
    request.key= 'GetAllPersons';
    request.requestBody={};
    request.requestBody.MethodName = 'GetAllPersonsByPersonId';

    if (parameter.length > 10) // NationalId > 10 ITS POC
      request.requestBody.taxNo = parameter;
    else
      request.requestBody.personId = parameter;

    this.proxyExecute(request);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllPersons':
        if (response.success == true) {
          if (response.value && response.value.length > 0) {
            if (this.props.personType == PersonType.RealPerson && response.value[0].personType != 0) {
              BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'CanEnterOnlyRealPersonIdentityTaxNumber'), DialogType.Error);
              this.resetState();
            }
            else {
              if (this.props.personType == PersonType.CorporatePerson && response.value[0].PersonType != 1) {
                BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'CanEnterOnlyOrganizationsTaxNumber'), DialogType.Error);
                this.resetState();
              }
              else {
                this.setState({ selectedPerson: response.value[0], disabled: false, searchText: response.value[0].personid + '-' + response.value[0].name });
                this.props.selectedItemChange(response.value[0]);
              }
            }
          } else {
            BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'PersonNotFoundOrPassive'), DialogType.Error);
            this.resetState();
          }
        }
        else {
          BDialogHelper.show(this.props.context, this.getMessage('BusinessComponents', 'ErrorWhenGetPersonInformation'), DialogType.Error);
          this.resetState();
        }
        break;
      default:
        break;
    }
  }
}

export default BPersonComponent;
