import React from 'react';
import PropTypes from 'prop-types';

import { BBusinessComponent } from 'b-business-component';
import { BInputMask } from 'b-input-mask';
// import { BRadioButtonGroup } from 'b-radio-button-group';
import { BComponentComposer } from 'b-component';
@BComponentComposer
export class BCreditCardComponent extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    creditCardBankInfo: PropTypes.string,
    creditCardNumber: PropTypes.string,
    errorText: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    creditCardBankInfo: '',
    creditCardNumber: ''
  };

  state = {
    creditCardBankInfo: '',
    creditCardNumber: '',
    creditCardTypeList: [
      { value: '0', label: this.getMessage('BusinessComponents', 'CreditCardForKuwaitTurk') },
      { value: '1', label: this.getMessage('BusinessComponents', 'CreditCardForAnyNationalBankExceptKuwaitTurk') },
      { value: '2', label: this.getMessage('BusinessComponents', 'CreditCardForAnyInternationalBank') }
    ]
  };

  constructor(props, context) {
    super(props, context);
    this.onCreditCardNumberChange = this.onCreditCardNumberChange.bind(this);
  }

  /**
   * Return the selected bank that is currently selected
   * @returns {{creditCardBankInfo: '', creditCardNumber: ''}}
   */
  getValue() {
    return this.state.creditCardNumber.replace(/ /g, ''); // bosluklari silelim.
  }

  setValue(value) {
    this.setState({ ...value });
  }

  resetValue() {
    this.setState({
      creditCardBankInfo: this.props.creditCardBankInfo,
      creditCardNumber: this.props.creditCardNumber
    });
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  onCreditCardNumberChange(event, value) {
    this.setState({ creditCardNumber: value.replace(/\s/g, '') });
  }

  render() {
    let { context } = this.props;

    return (
      /* <BRadioButtonGroup
            context={context}
            items={this.state.creditCardTypeList}
          /> */
      < BInputMask
        context={context}
        floatingLabelText={this.props.floatingLabelText}
        hintText={this.props.hintText}
        type="CreditCard"
        helperText='1234 5678 9012 3456'
        onChange={this.onCreditCardNumberChange}
        value={this.state.creditCardNumber}
        errorText={this.props.errorText}
      />
    );
  }
}

export default BCreditCardComponent;
