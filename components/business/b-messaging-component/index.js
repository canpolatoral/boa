import React from 'react';
import PropTypes from 'prop-types';
import BMessagingDialogComponent from './dialog';

import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';

/*
  Multilanguage için Message listelemek, eklemek ve seçim yapmak için oluşturuldu.
*/
@BComponentComposer
export class BMessagingComponent extends BBusinessComponent {
  static propTypes = {
    selectedCode: PropTypes.string,
    disabled: PropTypes.bool,
    hintText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    selectedCode: '', // BOAMessaging.203134',
    disabled: false
  };

  state = {
    selectedCode: this.props.selectedCode,
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
    this.state.selectedCode && this.getMessagingByCode(this.state.selectedCode);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedCode != nextProps.selectedCode) {
      this.setValue(nextProps.selectedCode, null);
      this.setState({ selectedCode: nextProps.selectedCode });
      nextProps.selectedCode && this.getMessagingByCode(nextProps.selectedCode);
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  getValue() {
    let selectedCode;
    if (this.state.selectedCode) {
      selectedCode = this.state.selectedCode;
    }
    return selectedCode;
  }

  setValue(selectedCode, selectedMessageDescription) {
    let visibleMessage = '';
    if (selectedMessageDescription) {
      visibleMessage = selectedMessageDescription;
    }
    else if (selectedCode) {
      if (selectedCode && selectedCode.indexOf('BOAMessaging.') == 0 && selectedCode.indexOf('.') > -1) {
        let propArray = selectedCode.split('.');
        visibleMessage = (propArray && propArray.length > 1 ? propArray[1] : '') + '.' + (propArray && propArray.length > 2 ? propArray[2] : '');
      }
      else {
        visibleMessage = selectedCode;
      }
    }
    this.setState({ selectedMessageProperty: visibleMessage });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  searchClicked() {
    let dialogStyle;
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) {
      dialogStyle = { width: '420px', height: '500px' };
      // width: '90%',
    }
    else {
      dialogStyle = {  width: '524px', height: '500px' };
      // width: '35%',
    }
    let dialog = (
      <BMessagingDialogComponent
        context={this.props.context}
        selectedMessage={this.state.selectedMessage}
        onClosing={this.handleClose}
        ref={r => this.spDialog = r} />);
    let dialogTitle = this.getMessage('BOAOne', 'MessageList');
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, dialogTitle, this.handleClose.bind(this), dialogStyle);
  }

  clearClicked() {
    this.setState({ selectedCode: null, selectedMessage: null, selectedMessageProperty: null });
    this.setValue(null, null);
    this.onChange(null);
  }

  handleClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.YES) {
      if (data) {
        let selectedCode = 'BOAMessaging.' + data.messagingGroupName + '.' + data.messagingPropertyName;
        this.setValue(selectedCode, data.messagingDescription);
        this.setState({ selectedCode: selectedCode, selectedMessage: data });
        this.onChange(selectedCode);
      }
    }
  }

  onChange(selectedCode) {
    if (this.props.onChange) {
      this.props.onChange(selectedCode);
    }
  }

  getMessagingByCode(computedPropertyName) {
    let groupName, propertyName;
    try {
      if (computedPropertyName && computedPropertyName.indexOf('BOAMessaging.') == 0 && computedPropertyName.indexOf('.') > -1) {
        let propArray = computedPropertyName.split('.');
        groupName = propArray && propArray.length > 1 ? computedPropertyName.split('.')[1] : null;
        propertyName = propArray && propArray.length > 2 ? computedPropertyName.split('.')[2] : null;
      }
    }
    catch (ex) {
      this.debugLog(ex);
    }
    if (groupName && propertyName) {
      this.getMessage(groupName, propertyName);
    }
  }

  getMessage(groupName, propertyName) {
    let proxyRequest = {
      requestClass: 'BOA.Types.One.MessagingRequest',
      requestBody: {
        MethodName: 'SelectMessageByCode',
        ResourceCode: 'YONTMSGDLG',
        MessagingGroupName: groupName,
        MessagingPropertyName: propertyName
      },
      key: 'SelectMessageByCode'
    };
    this.proxyExecute(proxyRequest);
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'SelectMessageByCode':
        if (response.success) {
          this.setValue(this.state.selectedCode, response.value.messagingDescription);
          this.setState({ selectedMessage: response.value });
        } else {

          BDialogHelper.showError(this.props.context, this.getMessage('BOA', 'ThereWasAnErrorFetchingDetail'), response.results);
          this.debugLog('error: getMessagingByCode method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      default:
        break;
    }
  }


  render() {
    let { context } = this.props;
    let rightIconList = [];
    if (this.state.selectedCode) {
      rightIconList.push(
        {
          dynamicIcon: 'Clear',
          onClick: this.clearClicked.bind(this)
        }
      );
    }
    rightIconList.push(
      {
        dynamicIcon: 'AddCircleOutline',
        iconProperties: { nativeColor: context.theme.boaPalette.pri500 },
        onClick: this.searchClicked.bind(this)
      }
    );
    return (
      <BInputAction
        ref={r => this.bInputAction = r}
        value={this.state.selectedMessageProperty}
        context={context}
        inputDisabled={true}
        hintText={this.props.hintText}
        floatingLabelText={this.props.floatingLabelText}
        rightIconList={rightIconList}
        disabled={this.state.disabled}
      />
    );
  }
}

export default BMessagingComponent;
