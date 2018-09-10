import React from 'react';
import PropTypes from 'prop-types';

import { BComponent } from 'b-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BBusinessComponent } from 'b-business-component';
import { BComboBox } from 'b-combo-box';
import { BInput } from 'b-input';
import { BDialogHelper } from 'b-dialog-box';
import { BConst } from 'b-const';

/*
  Dinamik ekranda kullanılmak için oluşturuldu. Özelleştirilebilir.
*/
export class BMessagingDialogComponent extends BBusinessComponent {
  static propTypes = {
    /**
    * Base properties from BBusinessComponent.
    */
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    selectedMessage: PropTypes.string
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'YONTMSGDLG'
  };

  state = {
    messagingGroupList: [],
    messagingList: [],
    messagingDetailList: [],
    selectedMessage: this.props.selectedMessage,
    selectedMessageGroupId: this.props.selectedMessage && this.props.selectedMessage.messagingGroupId ? this.props.selectedMessage.messagingGroupId : null,
    selectedMessageCode: this.props.selectedMessage && this.props.selectedMessage.messagingCode ? this.props.selectedMessage.messagingCode : null,
    isMessagingLoading: this.props.selectedMessage ? true : false,
    isFirst: true,
  };

  constructor(props, context) {
    super(props, context);
    this.onSelectMessageGroup = this.onSelectMessageGroup.bind(this);
    this.onSelectMessage = this.onSelectMessage.bind(this);
    this.onClosing = this.onClosing.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.getMessagingGroupList();
  }

  render() {
    let date = new Date();
    let messagingArea;
    let keyPrefix = date.getMinutes() + '-' + date.getSeconds() + '-' + date.getMilliseconds();
    if (this.state.isNewRecord) {
      messagingArea =
        <div>
          <div style={{ height: '10px' }}></div>
          <BInput key={'PropertyName' + keyPrefix}
            ref={ref => this.messagingPropertyName = ref}
            context={this.props.context}
            defaultValue={''}
            value={''}
            type='text'
            maxLength={30}
            hintText={this.getMessage('BOAOne', 'MessagingPropertyName')}
            floatingLabelText={this.getMessage('BOAOne', 'MessagingPropertyName')}
            disabled={this.state.isMessagingLoading} />
          <BInput key={'DetailTR' + keyPrefix}
            ref={ref => this.messagingDetailTR = ref}
            context={this.props.context}
            defaultValue={''}
            value={''}
            type='text'
            hintText={'Türkçe'}
            floatingLabelText={'Türkçe'}
            disabled={this.state.isMessagingLoading} />
          <BInput key={'DetailEN' + keyPrefix}
            ref={ref => this.messagingDetailEN = ref}
            context={this.props.context}
            defaultValue={''}
            value={''}
            type='text'
            hintText={'English'}
            floatingLabelText={'English'}
            disabled={this.state.isMessagingLoading} />
          <BInput key={'DetailAR' + keyPrefix}
            ref={ref => this.messagingDetailAR = ref}
            context={this.props.context}
            defaultValue={''}
            value={''}
            type='text'
            hintText={'العربية'}
            floatingLabelText={'العربية'}
            disabled={this.state.isMessagingLoading} />
        </div>;
    }
    else if (this.state.messagingDetailList && this.state.messagingDetailList.length > 0) {
      let languages = { tr: '', en: '', de: '', ru: '', ar: '' };
      for (let i = 0; i < this.state.messagingDetailList.length; i++) {
        let langId = this.state.messagingDetailList[i].messagingLanguageId;
        let languageCode = langId == 1 ? 'tr' : langId == 2 ? 'en' : langId == 3 ? 'de' : langId == 4 ? 'ru' : 'ar';
        languages[languageCode] = this.state.messagingDetailList[i].messagingDescription;
      }
      messagingArea =
        <div>
          <div style={{ height: '10px' }}></div>
          <BInput key={'DetailTR-' + keyPrefix}
            ref={ref => this.messagingDetailTR2 = ref}
            context={this.props.context}
            defaultValue={''}
            value={languages.tr}
            type='text'
            hintText={'Türkçe'}
            floatingLabelText={'Türkçe'}
            disabled={this.state.isMessagingLoading} />
          <BInput key={'DetailEN-' + keyPrefix}
            ref={ref => this.messagingDetailEN2 = ref}
            context={this.props.context}
            defaultValue={''}
            value={languages.en}
            type='text'
            hintText={'English'}
            floatingLabelText={'English'}
            disabled={this.state.isMessagingLoading} />
          <BInput key={'DetailAR-' + keyPrefix}
            ref={ref => this.messagingDetailAR2 = ref}
            context={this.props.context}
            defaultValue={''}
            value={languages.ar}
            type='text'
            hintText={'العربية'}
            floatingLabelText={'العربية'}
            disabled={this.state.isMessagingLoading} />
        </div>;
    }
    let propertyName = this.getMessage('BOAOne', 'MessagingPropertyName');
    let description = this.getMessage('BOAOne', 'Description');
    return (
      <BTransactionForm
        ref={r => this.transactionForm = r}
        onClosing={this.onClosing}
        onActionClick={this.onActionClick}
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        inDialog={true} >
        <BCard
          context={this.props.context}
          column={0} >
          <div>
            <BComboBox
              context={this.props.context}
              hintText={this.getMessage('BOAOne', 'MessageGroupList')}
              labelText={this.getMessage('BOAOne', 'MessageGroupList')}
              displayLabelMemberPath={['messagingGroupName']}
              dataSource={this.state.messagingGroupList}
              multiSelect={false}
              multiColumn={false}
              value={[this.state.selectedMessageGroupId]}
              displayMemberPath='messagingGroupName'
              valueMemberPath='messagingGroupId'
              onSelect={this.onSelectMessageGroup}
              isAllOptionIncluded={false}
              disabled={this.state.isMessagingLoading} />
            <BComboBox
              context={this.props.context}
              hintText={this.getMessage('BOAOne', 'MessageList')}
              labelText={this.getMessage('BOAOne', 'MessageList')}
              displayLabelMemberPath={['messagingPropertyName', 'messagingDescription']}
              columns={[
                {
                  'key': 'messagingPropertyName',
                  'name': propertyName,
                  'width': 185
                },
                {
                  'key': 'messagingDescription',
                  'name': description,
                  'width': 330
                }
              ]}
              dataSource={this.state.messagingList}
              multiSelect={false}
              multiColumn={true}
              value={[this.state.selectedMessageCode]}
              displayMemberPath='messagingDescription'
              valueMemberPath='messagingCode'
              onSelect={this.onSelectMessage}
              isAllOptionIncluded={false}
              disabled={this.state.isMessagingLoading} />
            {messagingArea}
          </div>
        </BCard>
      </BTransactionForm>
    );
  }

  close(dialogResponse) {
    let data = dialogResponse === BComponent.DialogResponse.YES ? this.getValue() : null;
    BDialogHelper.close(this, dialogResponse, data);
  }

  getValue() {
    if (this.state.selectedMessage) {
      return this.state.selectedMessage;
    }
    return null;
  }

  onSelectMessageGroup(selectedIndexes, selectedItems, selectedValues) {
    if (selectedItems && selectedItems.length == 1 && this.state.selectedMessageGroupId !== selectedValues[0]) {
      let selectedMessageGroup = this.state.messagingGroupList.find(x => x.messagingGroupId === selectedValues[0]);
      this.setState({ isFirst: false, selectedMessageGroupId: selectedMessageGroup.messagingGroupId, isNewRecord: false, isMessagingLoading: true });
      this.getMessagingList(selectedMessageGroup.messagingGroupId);
    }
  }

  onSelectMessage(selectedIndexes, selectedItems, selectedValues) {
    if (selectedItems && selectedItems.length == 1 && this.state.selectedMessageCode !== selectedValues[0]) {
      let selectedMessage = this.state.messagingList.find(x => x.messagingCode === selectedValues[0]);
      this.setState({ selectedMessage: selectedMessage, selectedMessageCode: selectedMessage.messagingCode, isNewRecord: false, isMessagingLoading: true });
      this.getMessageDetailList(selectedMessage.messagingCode);
    }
  }

  getMessagingGroupList() {

    let proxyRequest = {
      requestClass: 'BOA.Types.One.MessagingRequest',
      requestBody: {
        MethodName: 'SelectMessagingGroupList',
        ResourceCode: 'YONTMSGDLG'
      },
      key: 'GetMessagingGroupList'
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetMessagingGroupList':
        if (response.success) {
          if (this.state.selectedMessageGroupId > 0) {
            this.setState({ messagingGroupList: response.value });
            this.getMessagingList(this.state.selectedMessageGroupId);
          }
          else {
            this.setState({ messagingGroupList: response.value, selectedMessageGroupId: response.value[0].messagingGroupId });
            this.getMessagingList(response.value[0].messagingGroupId);
          }
        } else {
          BDialogHelper.showError(this.props.context, this.getMessage('BOA', 'GetInfoErrorMessage'), response.results);
          this.setState({ isMessagingLoading: false });
          this.debugLog('error: getMessagingGroupList method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      case 'GetMessagingList':
        if (response.success) {
          if (this.state.isFirst && this.state.selectedMessageCode > 0) {
            let selectedMessage = response.value.find(x => x.messagingCode == this.state.selectedMessageCode);
            this.setState({ isFirst: false, messagingList: response.value, selectedMessage: selectedMessage, selectedMessageCode: selectedMessage.messagingCode });
            this.getMessageDetailList(this.state.selectedMessageCode);
          }
          else {
            this.setState({ messagingList: response.value, selectedMessage: response.value[0], selectedMessageCode: response.value[0].messagingCode });
            this.getMessageDetailList(response.value[0].messagingCode);
          }
        } else {
          BDialogHelper.showError(this.props.context, this.getMessage('BOA', 'GetInfoErrorMessage'), response.results);
          this.setState({ isMessagingLoading: false });
          this.debugLog('error: GetMessagingList method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      case 'getMessageDetailList':
        if (response.success) {
          this.setState({ messagingDetailList: response.value, isMessagingLoading: false });
        } else {
          BDialogHelper.showError(this.props.context, this.getMessage('BOA', 'GetInfoErrorMessage'), response.results);
          this.setState({ isMessagingLoading: false });
          this.debugLog('error: getMessageDetailList method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      case 'SaveMessage':
        if (response.success) {
          BDialogHelper.show(this.props.context, this.getMessage('BOA', 'SaveSuccessfull'), BComponent.DialogType.SUCCESS);
          this.messagingDetailTR.getInstance().resetValue();
          this.messagingDetailEN.getInstance().resetValue();
          this.messagingDetailAR.getInstance().resetValue();
          this.setState({ isFirst: true, selectedMessageCode: response.value, isNewRecord: false });
          this.getMessagingList(this.state.selectedMessageGroupId);
        } else {
          BDialogHelper.showError(this.props.context, this.getMessage('BOA', 'SaveErrorMessage'), response.results);
          this.setState({ isMessagingLoading: false });
          this.debugLog('error: SaveMessage method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      case 'UpdateMessage':
        if (response.success) {
          // Yeni kayıt ilgili messageList e eklenip seçili yapılacak.
          BDialogHelper.show(this.props.context, this.getMessage('BOA', 'UpdateSuccessfull'), BComponent.DialogType.SUCCESS);
          // this.messagingDetailTR2.resetValue();
          // this.messagingDetailEN2.resetValue();
          // this.messagingDetailAR2.resetValue();
          this.setState({ isFirst: true, isNewRecord: false });
          this.getMessagingList(this.state.selectedMessage.messagingGroupId);
        } else {
          BDialogHelper.showError(this.props.context, this.getMessage('BOA', 'SaveErrorMessage'), response.results);
          this.setState({ isMessagingLoading: false });
          this.debugLog('error: UpdateMessage method error: ' + response.results[0].errorMessage, 3);
        }
        break;

      default:
        break;
    }
  }

  getMessagingList(messagingGroupId) {

    let proxyRequest = {
      requestClass: 'BOA.Types.One.MessagingRequest',
      requestBody: {
        MethodName: 'SelectMessagingList',
        MessagingGroupId: messagingGroupId,
        ResourceCode: 'YONTMSGDLG'
      },
      key: 'GetMessagingList'
    };
    this.proxyExecute(proxyRequest);
  }

  getMessageDetailList(messagingCode) {
    let proxyRequest = {
      requestClass: 'BOA.Types.One.MessagingRequest',
      requestBody: {
        MethodName: 'SelectMessageDetailListByCode',
        MessagingCode: messagingCode,
        ResourceCode: 'YONTMSGDLG'
      },
      key: 'getMessageDetailList'
    };
    this.proxyExecute(proxyRequest);
  }

  handleClose() {
    this.close(BComponent.DialogResponse.NONE);
  }

  onActionClick(e) {
    switch (e.commandName) {
      case BConst.ActionCommand.Ok: this.close(BComponent.DialogResponse.YES); break;
      case BConst.ActionCommand.Save: {
        // save
        if (this.state.isNewRecord) {
          this.saveMessage();
        }
        // update
        else {
          this.updateMessage();
        }
      } break;
      case BConst.ActionCommand.New: this.setState({ isNewRecord: true }); break;
    }

    // 20170808-baran: actionId ortamdan ortama degisebildigi icin commandName ile degisiklik yapildi

    // if (e.actionId == 1) {
    //   this.close(BComponent.DialogResponse.YES);
    // }
    // else if (e.actionId == 2) {
    //   // save
    //   if (this.state.isNewRecord) {
    //     this.saveMessage();
    //   }
    //   // update
    //   else {
    //     this.updateMessage();
    //   }
    // }
    // else if (e.actionId == 4) {
    //   this.setState({ isNewRecord: true });
    // }
  }

  saveMessage() {
    let groupId = this.state.selectedMessageGroupId,
      propertyName = this.messagingPropertyName.getInstance().getValue(),
      descriptionTR = this.messagingDetailTR.getInstance().getValue(),
      descriptionEN = this.messagingDetailEN.getInstance().getValue(),
      descriptionAR = this.messagingDetailAR.getInstance().getValue();

    if (groupId == undefined || groupId == null || groupId <= 0 || (!descriptionTR && !descriptionEN && !descriptionAR)) {
      BDialogHelper.show(this.props.context, this.getMessage('BOA', 'EnterAMessageForALanguage'));
      return;
    }

    this.setState({ isMessagingLoading: true });
    let proxyRequest = {
      requestClass: 'BOA.Types.One.MessagingRequest',
      requestBody: {
        MethodName: 'InsertMessaging',
        ResourceCode: 'YONTMSGDLG',
        MessagingContract: {
          MessagingGroupId: groupId,
          MessagingPropertyName: propertyName,
          MessagingDescriptionTR: descriptionTR,
          MessagingDescriptionEN: descriptionEN,
          MessagingDescriptionAR: descriptionAR
        }
      },
      key: 'SaveMessage'
    };
    this.proxyExecute(proxyRequest);
  }

  updateMessage() {
    if (!this.state.selectedMessage) {
      BDialogHelper.show(this.props.context, this.getMessage('BOA', 'SelectAMessageForUpdate'));
      return;
    }
    let code = this.state.selectedMessage.messagingCode,
      descriptionTR = this.messagingDetailTR2.getInstance().getValue(),
      descriptionEN = this.messagingDetailEN2.getInstance().getValue(),
      descriptionAR = this.messagingDetailAR2.getInstance().getValue();

    if (code == undefined || code == null || code <= 0 || (!descriptionTR && !descriptionEN && !descriptionAR)) {
      BDialogHelper.show(this.props.context, this.getMessage('BOA', 'EnterAMessageForALanguage'));
      return;
    }

    this.setState({ isMessagingLoading: true });
    let proxyRequest = {
      requestClass: 'BOA.Types.One.MessagingRequest',
      requestBody: {
        MethodName: 'UpdateMessaging',
        ResourceCode: 'YONTMSGDLG',
        MessagingContract: {
          MessagingCode: code,
          MessagingDescriptionTR: descriptionTR,
          MessagingDescriptionEN: descriptionEN,
          MessagingDescriptionAR: descriptionAR
        }
      },
      key: 'UpdateMessage'
    };
    this.proxyExecute(proxyRequest);
  }

  onClosing() {
    this.close(BComponent.DialogResponse.NONE);
  }
}

export default BMessagingDialogComponent;
