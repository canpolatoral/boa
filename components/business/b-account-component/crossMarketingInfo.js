import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BCheckBoxGroup } from 'b-check-box-group';
import { BFormManager } from 'b-form-manager';
import { BDialogHelper } from 'b-dialog-box';

export class CrossMarketingInfo extends BBusinessComponent {
  static propTypes = {
    selectList: PropTypes.array,
    crossMarketingData: PropTypes.any
  };

  static defaultProps = {
    selectList: []
  };

  state = {
    selectList: this.props.selectList
  };

  constructor(props, context) {
    super(props, context);
    this.selectedValue = null;
  }

  checkItems() {
    var values = this.checkGroup.getValue();
    if (!values || values.length != 1) {
      BFormManager.showStatusMessage('Bir kayıt seçilmelidir.');
      return false;
    } else {
      this.selectedValue = values[0];
      return true;
    }
  }

  afterApproveOrReject(value) {
    this.openResource(value.ResourceToOpen);
    this.refreshList();
  }

  refreshList() {
    var request = {
      DataContract: this.selectedValue,
      MethodName: 'Select'
    };

    let promise = this.proxyCall('BOA.Types.BusinessComponents.CrossMarketingMessageRequest', request);
    promise.then(response => {
      if (!response.success && response.results.length > 0) {
        // log
      } else if (response.value == null || response.value.length == 0) {
        BDialogHelper.close(this, null, this.props.crossMarketingData);
      } else {
        let newList = [];
        response.value.forEach(crossMarketingData => {
          var newData = {
            UserId: crossMarketingData.UserId,
            ChannelId: crossMarketingData.ChannelId,
            ResourceCode: crossMarketingData.ResourceCode,
            AccountNumber: crossMarketingData.AccountNumber,
            LanguageId: crossMarketingData.LanguageId,
            CrossMarketingInfo: crossMarketingData.crossMarketingInfo,
            CrossMarketingId: crossMarketingData.crossMarketingId,
            State: crossMarketingData.state,
            ResourceToOpen: crossMarketingData.resourceToOpen
          };
          newList.push(newData);
        });
        this.setState({ selectList: newList });
      }
    });
  }

  openResource(resourceCode) {
    if (resourceCode) {
      BFormManager.show(resourceCode, null, true);
    }
  }

  actionBarButtonClick(e) {
    if (e.commandName == 'Approve' || e.commandName == 'Reject') {
      if (this.checkItems()) {
        var isNewRecord = this.selectedValue.State == null ? true : false;
        this.selectedValue.State = e.commandName == 'Approve' ? 1 : 2;
        var request = {
          DataContract: this.selectedValue,
          MethodName: isNewRecord ? 'Insert' : 'Update'
        };

        let promise = this.proxyCall('BOA.Types.BusinessComponents.CrossMarketingMessageRequest', request);
        promise.then(response => {
          if (!response.success && response.results.length > 0) {
            // log
          } else {
            this.afterApproveOrReject(this.selectedValue);
          }
        });
      }
    }
  }

  render() {
    let list = this.state.selectList;
    let content = [];
    list.forEach(item => {
      var newItem = {
        value: item,
        label: item.CrossMarketingInfo,
        checked: list.length == 1
      };
      content.push(newItem);
    });

    return (
      <BTransactionForm
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.actionBarButtonClick.bind(this)}
        disableCardWidth={true}
        isWideCardEnabled={true}
      >
        <BCard context={this.props.context} expandable={false} initiallyExpanded={false}>
          <BCheckBoxGroup context={this.props.context} items={content} ref={r => (this.checkGroup = r)} />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default CrossMarketingInfo;
