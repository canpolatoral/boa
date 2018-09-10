import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputMask } from 'b-input-mask';
import { BDialogHelper } from 'b-dialog-box';

export var IBANTypes;
(function(IBANTypes) {
  IBANTypes[(IBANTypes['TR'] = 1)] = 'TR';
  IBANTypes[(IBANTypes['FOREIGN'] = 2)] = 'FOREIGN';
  IBANTypes[(IBANTypes['ALL'] = 3)] = 'ALL';
})(IBANTypes || (IBANTypes = {}));

const KTIBANCode = '00205';

@BComponentComposer
export class BIBANComponent extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    iban: PropTypes.string,
    errorText: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    iban: ''
  };

  state = {
    iban: ''
  };

  constructor(props, context) {
    super(props, context);
    this.onIBANChange = this.onIBANChange.bind(this);
  }

  /**
   * Return the selected bank that is currently selected
   * @returns {{iban: ''}}
   */
  getValue() {
    return this.state.iban.replace(/ /g, '');
  }

  setValue(value) {
    this.setState({ ...value });
  }

  resetValue() {
    this.setState({
      iban: this.props.iban,
      ibanAccountInfo: this.props.ibanAccountInfo
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

  isKTIBAN() {
    if (this.state.iban) {
      if (this.state.iban.substring(4, 9) == KTIBANCode) {
        return true;
      }
      else {
        return false;
      }
    }
    return null;
  }

  onKeyDown(event) {
    if (event.keyCode == 13) {
      if (this.isKTIBAN()) {
        this.getIBANAccountInfo();
        return true;
      }
    }
    return false;
  }

  onBlur() {
    this.setState({
      iban: this.props.value
    });
  }
  /**
  * Load parameter list from database
  */
  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GET_IBAN_ACCOUNT_INFO': {
        this.getIBANAccountInfo(response);
        break;
      }
      default:
        break;
    }
  }

  getIBANAccountInfo(response) {
    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.IBANAccountInfoRequest',
        requestBody: {
          MethodName: 'GetIBANAccountInfo',
          iban: this.state.iban 
        },
        key: 'GET_IBAN_ACCOUNT_INFO'
      };

      this.proxyExecute(request);
      return;
    }

    if (!response.success) {
      BDialogHelper.showError(this.props.context, this.getMessage('BusinessComponents', 'ErrorWhenGetIBANAccountInfo'), response.results);
      this.setState({ ibanAccountInfo: null });
    } else {
      if (response.value) {
        if (!response.value.validationMessage) {
          this.setState({ ibanAccountInfo: response.value });
        } else {
          this.setState({ ibanAccountInfo: null });
        }
        if (this.props.validateKTAccountInfo && response.value.validationMessage) {
          BDialogHelper.show(
            this.props.context,
            response.value.validationMessage,
            BComponent.DialogType.INFO,
            BComponent.DialogResponseStyle.OK
          );
        }
      } else {
        this.setState({ ibanAccountInfo: null });
      }
    }
  }

  onIBANChange(event, value) {
    this.setState({ iban: value.replace(/\s/g, '') });
  }

  render() {
    let { context } = this.props;

    return (
      < BInputMask
        context={context}
        floatingLabelText={this.props.floatingLabelText}
        hintText={this.props.hintText}
        type="IBAN"
        helperText='TR47 0000 1001 0000 0350 9300 01'
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChange={this.onIBANChange.bind(this)}
        value={this.state.iban}
        errorText={this.props.errorText}
      />
    );
  }

}

export default BIBANComponent;
