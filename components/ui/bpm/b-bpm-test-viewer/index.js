import React from 'react';
import { BInput } from 'b-input';
import { BSendApproveDialog } from 'b-send-approve-dialog';
import { BPMActionReasonDialog } from 'b-bpm-action-reason';
import { BPMActionReasonList } from 'b-bpm-action-reason-list';
import { BRouteHistory } from 'b-bpm-route-history';
import { BpmMonitor } from 'b-bpm-monitor';
import { BUserNote } from 'b-bpm-user-note';
import { BpmActionManager } from 'b-bpm-action-manager';
import { BFlowStateComponent } from 'b-flow-state-component';
import { BLabel } from 'b-label';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import { BComponent } from 'b-component';
import { BButton } from 'b-button';

export class BTestViewer extends BComponent {
  bpmInputDescription: BInput;
  constructor(props, context) {
    super(props, context);

    this.state={open:false};
  }

  noteClick() {
    BUserNote.showNote(this.props.context, this.bpmInputDescription.getInstance().getValue());
  }

  historyClick() {
    BRouteHistory.showRoute(this.props.context, this.bpmInputDescription.getInstance().getValue());
  }

  monitorClick() {
    BpmMonitor.showMonitor(this.props.context, this.bpmInputDescription.getInstance().getValue());
  }

  sendApprove() {

    var stateList = [
      {
        'stateName': 'ADK- OTP Kilit Kaldırma Onayı',
        'saveStates': [

        ],
        'actionList': [
          8,
          7
        ],
        'avgDuration': 1
      }
    ];

    BSendApproveDialog.showApproveDialog(this.props.context, stateList, 'Akış Adı', 11804);

  }

  sendActionReason() {

    var list = [
      {
        'reasonCode': '690',
        'reasonName': 'İşlem açıklamasını dikkate alınız',
        'flowVerisonId': 6560,
        'activeVersion': true,
        'actionId': 3,
        'stateId': 1,
        'resouceId': 11804,
        'firstActionId': 0,
        'isSelected': false,
        'isSelectable': true
      },
      {
        'reasonCode': '691',
        'reasonName': 'İşlem yanlış müşteri üzerinden gönderilmiş',
        'flowVerisonId': 6560,
        'activeVersion': true,
        'actionId': 3,
        'stateId': 1,
        'resouceId': 11804,
        'firstActionId': 0,
        'isSelected': false,
        'isSelectable': true
      },
      {
        'reasonCode': '169',
        'reasonName': 'Teminat senedine tarih yazınız.',
        'flowVerisonId': 6560,
        'activeVersion': true,
        'actionId': 3,
        'stateId': 1,
        'resouceId': 11804,
        'firstActionId': 0,
        'isSelected': false,
        'isSelectable': true
      },
      {
        'reasonCode': '664',
        'reasonName': 'Teminat senedine, senet tutarını yazı ile de yazınız.',
        'flowVerisonId': 6560,
        'activeVersion': true,
        'actionId': 3,
        'stateId': 1,
        'resouceId': 11804,
        'firstActionId': 0,
        'isSelected': false,
        'isSelectable': true
      }
    ];
    BPMActionReasonDialog.showActionReasonDialog(this.props.context,
      list,
      ((dialogResponse, data) => {
        // eslint-disable-next-line no-console
        console.log(dialogResponse);
        // eslint-enable-next-line no-console
        // eslint-disable-next-line no-console
        console.log(data);
        // eslint-enable-next-line no-console
      }).bind(this)
    );

  }

  showActionReason() {

    BPMActionReasonList.showActionReasonList(this.props.context, 76158136);

  }


  callBack() {

  }


  handleClose() {
    this.setState({ open: false });
  }

  openPopover() {
    this.setState({ open: true });
  }


  render() {

    var resourceInfo = {
      'children': [

      ],
      'id': 11804,
      'name': 'BOA One BPM Test',
      'description': 'test',
      'resourceCode': 'YONTBPMTST',
      'moduleCode': '',
      'channelId': 1,
      'sortId': 1,
      'typeId': 0,
      'isLeaf': true,
      'isNew': false,
      'isHidden': false,
      'isRevokable': false,
      'isWorkflow': true,
      'isFavorite': false,
      'assemblyName': 'BOA.UI.Workflow2.TestResource',
      'className': 'BOA.UI.Workflow2.TestResource',
      'iconName': 'ActionDashboard',
      'iconColor': '#805346',
      'bundleName': 'Main',
      'pageName': '/bpm/inbox-start-flow',
      'openedBy': 0,
      'openState': 0,
      'uiType': 0,
      'identity': 11804,
      'parent': {
        'children': [

        ],
        'id': 0,
        'channelId': 0,
        'sortId': 0,
        'typeId': 0,
        'isLeaf': false,
        'isNew': false,
        'isHidden': false,
        'isRevokable': false,
        'isWorkflow': false,
        'isFavorite': false,
        'openedBy': 0,
        'openState': 0,
        'uiType': 0,
        'identity': 0
      },
      'resourceActionList': [
        {
          'resourceId': 11804,
          'actionId': 11,
          'actionType': 2,
          'name': 'Onay 2',
          'commandName': 'Approve2',
          'groupName': '',
          'description': 'Bilgi Getir',
          'iconPath': 'SettingsBackupRestore',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 1,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 11804,
          'actionId': 39,
          'actionType': 2,
          'name': 'Ret 2',
          'commandName': 'Reject2',
          'groupName': '',
          'description': 'Sorgula',
          'iconPath': 'SettingsBackupRestore',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 2,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 11804,
          'actionId': 26,
          'actionType': 1,
          'name': 'Divit',
          'commandName': 'Divit',
          'groupName': '',
          'description': 'Tamam',
          'iconPath': 'Done',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 3,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 11804,
          'actionId': 3,
          'actionType': 1,
          'name': 'Kaydet',
          'commandName': 'Save',
          'groupName': '',
          'description': 'Kaydet',
          'iconPath': 'Save',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': true,
          'sortId': 4,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 11804,
          'actionId': 45,
          'actionType': 1,
          'name': "Excel'e Aktar",
          'commandName': 'ExportToExcel',
          'groupName': '',
          'description': "Excel'e Aktar",
          'iconPath': 'FileUpload',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 5,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 11804,
          'actionId': 8,
          'actionType': 2,
          'name': 'Ret',
          'commandName': 'Reject',
          'groupName': '',
          'description': 'Ret',
          'iconPath': 'RemoveCircle',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 18,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 11804,
          'actionId': 7,
          'actionType': 2,
          'name': 'Onay',
          'commandName': 'Approve',
          'groupName': '',
          'description': 'Onay',
          'iconPath': 'Done',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 22,
          'systemDate': '0001-01-01T00:00:00',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isSelected': false,
          'isSelectable': true
        }
      ],
      'workflowData': {
        'workflowActiveStateId': 0,
        'workflowActiveVersionId': 0,
        'flowMap': [
          {
            'flowId': 962,
            'activeVersionId': 5496
          }
        ],
        'startStateActions': [
          {
            'resourceAction': {
              'resourceId': 11804,
              'actionId': 3,
              'actionType': 1,
              'name': 'Kaydet',
              'commandName': 'Save',
              'groupName': '',
              'description': 'Kaydet',
              'iconPath': 'Save',
              'isVirtual': false,
              'isAssignable': true,
              'hasAccounting': false,
              'hasSlip': false,
              'hasCommission': false,
              'hasWorkflow': true,
              'sortId': 4,
              'systemDate': '0001-01-01T00:00:00',
              'hasAuthorization': false,
              'hasTellerTransaction': false,
              'hasRevokableTransaction': false,
              'hasFutureDated': false,
              'isSelected': false,
              'isSelectable': true
            },
            'isDelegateAction': false
          }
        ],
        'firsActionInfos': [
          {
            'actionId': 3,
            'hasAccounting': false,
            'hasCommission': false,
            'hasSlip': false,
            'hasAuthorization': false,
            'hasTellerTransaction': false,
            'hasRevokableTransaction': false,
            'hasFutureDated': false
          }
        ],
        'flowVersionData': {
          '3648': {
            'flowVersionId': 3648,
            'startStateId': 1,
            'isActiveVersion': false,
            'stateActionList': {
              '1': [
                {
                  'resourceAction': {
                    'resourceId': 2,
                    'name': 'Ret',
                    'commandName': 'Reject',
                    'groupName': '',
                    'description': 'Ret',
                    'iconPath': 'RemoveCircle',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 18,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                }
              ],
              '511': [
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 11,
                    'actionType': 2,
                    'name': 'Onay 2',
                    'commandName': 'Approve2',
                    'groupName': '',
                    'description': 'Bilgi Getir',
                    'iconPath': 'SettingsBackupRestore',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 1,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                },
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 39,
                    'actionType': 2,
                    'name': 'Ret 2',
                    'commandName': 'Reject2',
                    'groupName': '',
                    'description': 'Sorgula',
                    'iconPath': 'SettingsBackupRestore',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 2,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                }
              ]
            }
          },
          '5589': {
            'flowVersionId': 5589,
            'startStateId': 1,
            'isActiveVersion': true,
            'stateActionList': {
              '1': [
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 3,
                    'actionType': 1,
                    'name': 'Kaydet',
                    'commandName': 'Save',
                    'groupName': '',
                    'description': 'Kaydet',
                    'iconPath': 'Save',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': true,
                    'sortId': 4,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                }
              ],
              '510': [
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 7,
                    'actionType': 2,
                    'name': 'Onay',
                    'commandName': 'Approve',
                    'groupName': '',
                    'description': 'Onay',
                    'iconPath': 'Done',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 22,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                },
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 8,
                    'actionType': 2,
                    'name': 'Ret',
                    'commandName': 'Reject',
                    'groupName': '',
                    'description': 'Ret',
                    'iconPath': 'RemoveCircle',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 18,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                }
              ],
              '511': [
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 11,
                    'actionType': 2,
                    'name': 'Onay 2',
                    'commandName': 'Approve2',
                    'groupName': '',
                    'description': 'Bilgi Getir',
                    'iconPath': 'SettingsBackupRestore',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 1,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                },
                {
                  'resourceAction': {
                    'resourceId': 11804,
                    'actionId': 39,
                    'actionType': 2,
                    'name': 'Ret 2',
                    'commandName': 'Reject2',
                    'groupName': '',
                    'description': 'Sorgula',
                    'iconPath': 'SettingsBackupRestore',
                    'isVirtual': false,
                    'isAssignable': true,
                    'hasAccounting': false,
                    'hasSlip': false,
                    'hasCommission': false,
                    'hasWorkflow': false,
                    'sortId': 2,
                    'systemDate': '0001-01-01T00:00:00',
                    'hasAuthorization': false,
                    'hasTellerTransaction': false,
                    'hasRevokableTransaction': false,
                    'hasFutureDated': false,
                    'isSelected': false,
                    'isSelectable': true
                  },
                  'isDelegateAction': false
                }
              ]
            }
          }
        },
        'workflowActionReasons': [
          {
            'reasonCode': '2',
            'reasonName': 'Kara Listede',
            'flowVerisonId': 5549,
            'activeVersion': false,
            'actionId': 3,
            'stateId': 1,
            'resouceId': 11804,
            'firstActionId': 0,
            'isSelected': false,
            'isSelectable': true
          },
          {
            'reasonCode': '10',
            'reasonName': 'Müşteri/Satıcı Vazgeçti',
            'flowVerisonId': 5549,
            'activeVersion': false,
            'actionId': 3,
            'stateId': 1,
            'resouceId': 11804,
            'firstActionId': 0,
            'isSelected': false,
            'isSelectable': true
          },
          {
            'reasonCode': '11',
            'reasonName': 'Proje Bilgilerinin Hatalı Girilmesi',
            'flowVerisonId': 5549,
            'activeVersion': false,
            'actionId': 3,
            'stateId': 1,
            'resouceId': 11804,
            'firstActionId': 0,
            'isSelected': false,
            'isSelectable': true
          },
          {
            'reasonCode': '1',
            'reasonName': 'Riskli Müşteri',
            'flowVerisonId': 5549,
            'activeVersion': false,
            'actionId': 3,
            'stateId': 1,
            'resouceId': 11804,
            'firstActionId': 0,
            'isSelected': false,
            'isSelectable': true
          }
        ]
      },
      'validationInfo': [

      ]

    };

    return (

      <BGridSection context={this.props.context}  >
        <BGridRow context={this.props.context}  >
          <BInput ref={(r) => { this.bpmInputDescription = r; }} context={this.props.context} value='76189056' floatingLabelText='Akış numarası' />
        </BGridRow>
        <BGridRow context={this.props.context}  >
          <BButton context={this.props.context} type="raised" text='İş Akış Notları' onClick={this.noteClick.bind(this)} />
        </BGridRow>
        <BGridRow context={this.props.context}  >
          <BButton context={this.props.context} type="raised" text='İş Akışı Yol Haritası' onClick={this.historyClick.bind(this)} />
        </BGridRow>
        <BGridRow context={this.props.context}  >
          <BButton context={this.props.context} type="raised" text='BPM Monitoring' onClick={this.monitorClick.bind(this)} />
        </BGridRow>
        <BGridRow context={this.props.context}  >
          <BButton context={this.props.context} type="raised" text='Onaya Gönder' onClick={this.sendApprove.bind(this)} />
        </BGridRow>
        <BGridRow context={this.props.context}  >
          <BButton context={this.props.context} type="raised" text='Aksiyon Gerekçeleri Giriş' onClick={this.sendActionReason.bind(this)} />
        </BGridRow>

        <BGridRow context={this.props.context}  >
          <BButton context={this.props.context} type="raised" text='Aksiyon Gerekçeleri Listesi' onClick={this.showActionReason.bind(this)} />
        </BGridRow>

        <BGridRow context={this.props.context}  >
          <BpmActionManager
            context={this.props.context}
            resourceInfo={resourceInfo}
            page={this.props.page} />
        </BGridRow>

        <BGridRow context={this.props.context}  >
          <BLabel text='b-flow-state-component'
            context={this.props.context}
          />
        </BGridRow>

        <BGridRow context={this.props.context}  >
          <BFlowStateComponent context={this.props.context} stateVisible={true} selectedFlowId={1} />
        </BGridRow>

      </BGridSection>

    );
  }

}

export default BTestViewer;
