import React from 'react'; import PropTypes from 'prop-types';
import { BScroll } from 'b-scroll';
import sortBy from 'lodash/sortBy';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BFlexPanel } from 'b-flex-panel';
import { BActionManager } from 'b-action-manager';
import { BIterationEventItem } from './item';
import Common from './common';

@BComponentComposer
export class BDynamicEventDesigner extends BBusinessComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent
    */
    ...BBusinessComponent.props,
    /**
    * Reource info of dynamic event.
    */
    resourceInfo: PropTypes.object,
    /**
    * Contains data of event.
    */
    eventData: PropTypes.object,
    /**
    * The event of data changing.
    */
    onEventDataChanged: PropTypes.func,
    /**
    * The property source of component.
    */
    componentPropertySource: PropTypes.any
  };

  static defaultProps = {
    /**
    * Default prop values from BBusinessComponent
    */
    ...BBusinessComponent.defaultProps,
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
          'commandName': 'Close',
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
        },
        {
          'resourceId': 934,
          'actionId': 11,
          'actionType': 1,
          'name': 'Hepsini Aç',
          'commandName': 'OpenAll',
          'groupName': '',
          'description': 'Hepsini Aç',
          'iconPath': 'Remove',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 2,
          'systemDate': '0001-01-01T00:00:00Z',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isOne': false,
          'isSelected': false,
          'isSelectable': true
        },
        {
          'resourceId': 934,
          'actionId': 12,
          'actionType': 1,
          'name': 'Hepsini Kapat',
          'commandName': 'CloseAll',
          'groupName': '',
          'description': 'Bilgi Getir',
          'iconPath': 'Add',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 3,
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
    }
  };

  constructor(props, context) {
    super(props, context);
    this.eventData = this.props.eventData;
  }

  componentDidMount() {
    super.componentDidMount();
    this.getEventContent();
  }

  actionClick(command) {
    switch (command.commandName) {
      case 'OpenAll':
        {
          this.eventData.interactions.map((interaction) => {
            interaction.isExpanded = false;
            interaction.assignments.map((assignment) => {
              assignment.isExpanded = false;
            });
          });

          this.setState({
            historyItemList: []
          }, () => {
            this.getEventContent();
          });
          break;

        }
      case 'CloseAll':
        {
          this.eventData.interactions.map((interaction) => {
            interaction.isExpanded = true;
            interaction.assignments.map((assignment) => {
              assignment.isExpanded = true;
            });
          });

          this.setState({
            historyItemList: []
          }, () => {
            this.getEventContent();
          });
          break;

        }
      case 'Close':
        BDialogHelper.close(this, BComponent.DialogResponse.OK, undefined);
        break;
    }
  }

  getEventContent() {
    let historyItemList = new Array();
    this.refreshInteractionKeys();

    this.eventData.interactions.map((element) => {
      historyItemList.push(this.createInteractionItem(element, this, true));
    });
    var element = { type: 'assignment' };
    historyItemList.push(this.createInteractionItem(element, this, false));

    this.setState({
      historyItemList: Object.assign([], historyItemList)
    });

    if (this.props.onEventDataChanged) {
      this.props.onEventDataChanged(this.eventData);
    }
  }

  getNewInteraction(interactionType: any, interactionKey: string) {
    var interaction;
    if (interactionType == Common.interactionTypeEnum.ifInteraction) {
      interaction = {
        'isExpanded': false,
        'type': 'if',
        'interactionType': 2,
        'interactionKey': interactionKey,
        'interactionHeader': this.getMessage('BusinessComponents', 'IfInteraction')+' ' + interactionKey,
        'sourceComponent': '-1',
        'sourceProp': '-1',
        'compareWith': '-1',
        'compareValueType': '-1',
        'compareValue': '',
        'compareOperand': '-1',
        'compareComponent': '-1',
        'compareProp': '-1',
        'assignments': [
          {
            'isExpanded': false,
            'type': 'assignment',
            'interactionType': 1,
            'interactionKey': interactionKey + '.1',
            'interactionHeader': this.getMessage('BusinessComponents', 'AssignmentInteraction')+' 1',
            'toComponent': '-1',
            'toProp': '-1',
            'fromType': '-1',
            'fromValueType': '-1',
            'fromValue': '',
            'fromComponent': '-1',
            'fromProp': '-1'
          }
        ]
      };
    }
    else if (interactionType == Common.interactionTypeEnum.assignmentInteraction) {
      interaction = {
        'isExpanded': false,
        'type': 'assignment',
        'interactionType': 1,
        'interactionKey': interactionKey,
        'interactionHeader': '',
        'toComponent': '-1',
        'toProp': '-1',
        'fromValueType': '-1',
        'fromType': '-1',
        'fromValue': '',
        'fromComponent': '-1',
        'fromProp': '-1'
      };
    }
    return interaction;
  }

  clearOtherValues(interactionItem: any, itemKey: string) {
    if (interactionItem.interactionType == Common.interactionTypeEnum.ifInteraction) {
      switch (itemKey) {
        case 'sourceComponent':
          interactionItem.sourceProp = '-1';
          interactionItem.compareWith = '-1';
          interactionItem.compareValue = '';
          interactionItem.compareOperand = '-1';
          interactionItem.compareComponent = '-1';
          interactionItem.compareProp = '-1';
          break;
        case 'sourceProp':
          interactionItem.compareWith = '-1';
          interactionItem.compareValue = '';
          interactionItem.compareOperand = '-1';
          interactionItem.compareComponent = '-1';
          interactionItem.compareProp = '-1';
          break;
        case 'compareWith':
          interactionItem.compareValue = '';
          interactionItem.compareValueType = '-1';
          interactionItem.compareOperand = '-1';
          interactionItem.compareComponent = '-1';
          interactionItem.compareProp = '-1';
          break;
        case 'compareComponent':
          interactionItem.compareProp = '-1';
          break;
      }
    }
    else if (interactionItem.interactionType == Common.interactionTypeEnum.assignmentInteraction) {
      switch (itemKey) {
        case 'toComponent':
          interactionItem.toProp = '-1';
          interactionItem.fromType = '-1';
          interactionItem.fromValue = '';
          interactionItem.fromComponent = '-1';
          interactionItem.fromProp = '-1';
          break;
        case 'toProp':
          interactionItem.fromType = '-1';
          interactionItem.fromValue = '';
          interactionItem.fromComponent = '-1';
          interactionItem.fromProp = '-1';
          break;
        case 'fromType':
          interactionItem.fromValue = '';
          interactionItem.fromValueType = '-1';
          interactionItem.fromComponent = '-1';
          interactionItem.fromProp = '-1';
          break;
        case 'fromComponent':
          interactionItem.fromProp = '-1';
          break;
      }
    }
  }

  sortInteractionList() {
    this.eventData.interactions = sortBy(this.eventData.interactions, ['interactionKey']);
    this.eventData.interactions.map((element) => {
      element.assignments = sortBy(element.assignments, ['interactionKey']);
    });
  }

  refreshContent() {
    this.setState({
      historyItemList: []
    }, () => {
      this.getEventContent();
    });
  }

  interactionTypeChanged(selectedInteraction: any) {
    var oldInteraction = this.eventData.interactions.find(x => x.interactionKey == selectedInteraction.interactionKey);
    var index = this.eventData.interactions.findIndex(x => x.interactionKey == selectedInteraction.interactionKey);
    this.eventData.interactions.splice(index, 1);

    var newInteraction = this.getNewInteraction(selectedInteraction.interactionType, oldInteraction.interactionKey);
    this.eventData.interactions.push(newInteraction);

    this.sortInteractionList();
    this.refreshContent();
  }

  refreshInteractionKeys() {
    this.sortInteractionList();
    var interactionKey = 1;
    this.eventData.interactions.map((interaction) => {
      interaction.interactionKey = interactionKey.toString();
      interaction.isFirstItem = interaction.isLastItem = false;
      if (interactionKey == 1) {
        interaction.isFirstItem = true;
      }
      if (interactionKey == this.eventData.interactions.length) {
        interaction.isLastItem = true;
      }
      var assignmentKey = 1;
      interaction.assignments.map((assignment) => {
        assignment.interactionKey = interactionKey.toString() + '.' + assignmentKey.toString();
        assignment.isFirstItem = assignment.isLastItem = false;
        if (assignmentKey == 1) {
          assignment.isFirstItem = true;
        }
        if (assignmentKey == interaction.assignments.length) {
          assignment.isLastItem = true;
        }
        assignmentKey = assignmentKey + 1;
      });
      interactionKey = interactionKey + 1;
    });
  }

  interactionButtonClick(interactionItem: any) {
    if (interactionItem.isExpanded === undefined) {
      var newAssignmentInteraction = this.getNewInteraction(Common.interactionTypeEnum.assignmentInteraction, this.eventData.interactions.length + 1);
      if (interactionItem.interactionType == Common.interactionTypeEnum.ifInteraction) {
        var assignments = this.eventData.interactions.find(x => x.interactionKey == interactionItem.interactionKey).assignments;
        newAssignmentInteraction.interactionKey = interactionItem.interactionKey + '.' + (assignments.length + 1);
        assignments.push(newAssignmentInteraction);
      }
      else {
        newAssignmentInteraction.interactionKey = this.eventData.interactions.length + 1;
        this.eventData.interactions.push(newAssignmentInteraction);
      }
    }
    else {
      if (interactionItem.interactionKey.toString().indexOf('.') > -1) {
        var ifInteractionKey = interactionItem.interactionKey.split('.')[0];
        var currentAssignment = this.eventData.interactions.find(x => x.interactionKey == ifInteractionKey)
          .assignments.find(x => x.interactionKey == interactionItem.interactionKey);
        currentAssignment.isExpanded = !interactionItem.isExpanded;
      }
      else {
        this.eventData.interactions.find(x => x.interactionKey == interactionItem.interactionKey).isExpanded = !interactionItem.isExpanded;
      }
    }
    this.refreshContent();
  }

  deleteButtonClick(interactionItem: any) {
    if (interactionItem.interactionKey) {
      var index;
      if (interactionItem.interactionKey.toString().indexOf('.') > -1) {
        var ifInteractionKey = interactionItem.interactionKey.split('.')[0];
        var assignments = this.eventData.interactions.find(x => x.interactionKey == ifInteractionKey).assignments;
        index = assignments.findIndex(x => x.interactionKey == interactionItem.interactionKey);
        assignments.splice(index, 1);
      }
      else {
        index = this.eventData.interactions.findIndex(x => x.interactionKey == interactionItem.interactionKey);
        this.eventData.interactions.splice(index, 1);
      }
    }
    this.refreshInteractionKeys();
    this.refreshContent();
  }

  moveInteraction(interactionItem: any, moveUp: bool) {
    var index, tempInteractionKey, replaceIndex;
    if (interactionItem.interactionKey.toString().indexOf('.') > -1) {
      var ifInteractionKey = interactionItem.interactionKey.split('.')[0];
      var assignments = this.eventData.interactions.find(x => x.interactionKey == ifInteractionKey).assignments;
      index = assignments.findIndex(x => x.interactionKey == interactionItem.interactionKey);
      tempInteractionKey = assignments[index].interactionKey;
      replaceIndex = (moveUp ? index - 1 : index + 1);
      assignments[index].interactionKey = assignments[replaceIndex].interactionKey;
      assignments[replaceIndex].interactionKey = tempInteractionKey;
    }
    else {
      index = this.eventData.interactions.findIndex(x => x.interactionKey == interactionItem.interactionKey);
      tempInteractionKey = this.eventData.interactions[index].interactionKey;
      replaceIndex = (moveUp ? index - 1 : index + 1);
      this.eventData.interactions[index].interactionKey = this.eventData.interactions[replaceIndex].interactionKey;
      this.eventData.interactions[replaceIndex].interactionKey = tempInteractionKey;
    }
  }

  moveUpButtonClick(interactionItem: any) {
    if (interactionItem.interactionKey) {
      this.moveInteraction(interactionItem, true);
    }
    this.refreshContent();
  }

  moveDownButtonClick(interactionItem: any) {
    if (interactionItem.interactionKey) {
      this.moveInteraction(interactionItem, false);
    }
    this.refreshContent();
  }

  dataComboSelect(changedData: any) {
    var selectedInteraction;
    if (changedData.interaction.interactionKey.toString().indexOf('.') > -1) {
      var ifInteractionKey = changedData.interaction.interactionKey.split('.')[0];
      selectedInteraction = this.eventData.interactions.find(x => x.interactionKey == ifInteractionKey).assignments.find(x => x.interactionKey == changedData.interaction.interactionKey);
    }
    else {
      selectedInteraction = this.eventData.interactions.find(x => x.interactionKey == changedData.interaction.interactionKey);
    }
    selectedInteraction[changedData.changeKey] = changedData.newValue;
    this.clearOtherValues(selectedInteraction, changedData.changeKey);
    this.refreshContent();
  }
  getInteractionNode(interaction: any, form: any, dividerVisibility: boolean, children: any) {
    return (<BIterationEventItem
      context={this.props.context}
      historyItem={interaction}
      componentPropertySource={this.props.componentPropertySource}
      key={interaction.interactionKey}
      dividerVisibility={dividerVisibility}
      onInteractionTypeSelect={this.interactionTypeChanged.bind(this)}
      onInteractionButtonClick={this.interactionButtonClick.bind(this)}
      onDeleteButtonClick={this.deleteButtonClick.bind(this)}
      onMoveUpButtonClick={this.moveUpButtonClick.bind(this)}
      onMoveDownButtonClick={this.moveDownButtonClick.bind(this)}
      onDataComboSelect={this.dataComboSelect.bind(this)} >
      {children}
    </BIterationEventItem>);
  }

  createInteractionItem(interaction: any, form: any, dividerVisibility: boolean) {
    if (interaction.type == 'assignment') {
      return this.getInteractionNode(interaction, this, dividerVisibility);
    }
    else if (interaction.type == 'if') {
      var ifInteractionContent =
        <BFlexPanel
          style={{
            marginTop: 20,
            marginBottom: 20,
            alignSelf: 'left',
            flexGrow: '1'
          }}
          direction='vertical'
          alignItems='left'
          responsive={false}
          alignment='spaceBetween'
          context={this.props.context}>
          {
            interaction.assignments.map((assignment) => {
              return this.getInteractionNode(assignment, this, dividerVisibility);
            })
          }
          {this.getInteractionNode({ type: 'assignment', interactionType: Common.interactionTypeEnum.ifInteraction, interactionKey: interaction.interactionKey }, this, false)}
        </BFlexPanel>;
      return this.getInteractionNode(interaction, this, dividerVisibility, ifInteractionContent);
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
            <div style={{ height: 'calc(100% - 44px)', width: '100%', marginTop: -4 }}>
              <BFlexPanel
                alignment='left'
                direction='vertical'
                alignItems='stretch'
                alignContent='stretch'
                responsive={false}
                style={{ padding: 18 }}
                context={this.props.context}>
                {this.state.historyItemList}
              </BFlexPanel>
            </div>
          </BScroll>
        </div>
      </div>
    );
  }
}

export default BDynamicEventDesigner;
