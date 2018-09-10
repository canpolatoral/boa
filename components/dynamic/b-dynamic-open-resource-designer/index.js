import React from 'react'; import PropTypes from 'prop-types';
import { BScroll } from 'b-scroll';
import { BComponent } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BActionManager } from 'b-action-manager';
import { BResourceBrowser } from 'b-resource-browser';

export class BDynamicOpenResourceDesigner extends BBusinessComponent {
  static propTypes = {
    resourceInfo: PropTypes.any,
    resourceId: PropTypes.number,
    resourceData: PropTypes.any,
    onResourceDataChanged: PropTypes.func
  };
 
  static defaultProps = {
    resourceInfo: {
      'id': 934,
      'name': 'İş Akışı Yol Haritası',
      'description': 'İş Akışı Yol Haritası',
      'resourceCode': 'ISATROTMAP',
      'moduleCode': 'Yönetsel İşlemler',
      'channelId': 1,
      'sortId': 9999,
      'typeId': 0,
      'isLeaf': true,
      'isNew': false,
      'isHidden': true,
      'isRevokable': false,
      'isWorkflow': false,
      'isFavorite': false,
      'isAuthorizedResource': false,
      'bundleName': 'Main',
      'pageName': '/bpm/history-route-history',
      'openedBy': 0,
      'openState': 0,
      'uiType': 0,
      'identity': 934,
      'resourceActionList': [
        {
          'resourceId': 934,
          'actionId': 13,
          'actionType': 1,
          'name': 'Tamam',
          'commandName': 'Ok',
          'groupName': '',
          'description': 'Tamam',
          'iconPath': 'Done',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 1,
          'systemDate': '0001-01-01T00:00:00Z',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isOne': false,
          'isSelected': false,
          'isSelectable': true
        }
      ]
    },
    resourceData: undefined
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      resourceId: this.props.resourceId,
      resourceData: this.props.resourceData,
      isOpen: this.props.resourceData ? true : false
    };
  }

  componentDidMount() {

  }

  actionClick(command) {
    switch (command.commandName) {
      case 'Ok':
        var selectedResource = this.resourceBrowser.getValue();
        if (selectedResource) {
          if (this.props.onResourceDataChanged && this.state.isOpen) {
            this.props.onResourceDataChanged(selectedResource.id, selectedResource);
          }
          else if (this.props.onResourceDataChanged && !this.state.isOpen) {
            this.props.onResourceDataChanged(selectedResource.id, selectedResource);
          }
        }
        BDialogHelper.close(this, BComponent.DialogResponse.OK, undefined);
        break;
    }
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div style={{ height: 44, width: '100%' }}>
          <BActionManager
            ref={ref => (this.root = ref)}
            resourceInfo={this.props.resourceInfo}
            context={this.props.context}
            inDialog={true}
            visibleHelpButton={false}
            onActionClick={this.actionClick.bind(this)} />
        </div>
        <div style={{ height: 'calc(100% - 44px)', width: '100%' }}>
          <BScroll
            context={this.props.context}>
            <div style={{ height: 'calc(100% - 44px)', width: 'calc(100% - 14px)', marginTop: -4, marginLeft: 7, marginRight: 7 }}>
              <BResourceBrowser
                ref={ref => (this.resourceBrowser = ref)}
                style={{ padding: 18 }}
                context={this.props.context}
                value={this.state.resourceId} />
            </div>
          </BScroll>
        </div>
      </div>
    );
  }
}

export default BDynamicOpenResourceDesigner;
