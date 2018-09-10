import React from 'react';
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BConst } from 'b-const';
import { BDialogHelper } from 'b-dialog-box';
import { BTreeView } from 'b-treeview';
import { BToggle } from 'b-toggle';
import { BChannelComponent } from 'b-channel-component';
import { ResourceNode } from './model';
import * as helper from './helper';

interface state {
  resourceList: Array<ResourceNode>;
  shortByNumber: Boolean;
  showHiddenResources: Boolean;
  showDetails: Boolean;
}

var ResourceType;
(function(ResourceType) {
  ResourceType[(ResourceType['Root'] = 0)] = 'Root';
  ResourceType[(ResourceType['Menu'] = 1)] = 'Menu';
  ResourceType[(ResourceType['Window'] = 2)] = 'Window';
  ResourceType[(ResourceType['HiddenMenu'] = 3)] = 'HiddenMenu';
  ResourceType[(ResourceType['HiddenWindow'] = 4)] = 'HiddenWindow';
})(ResourceType || (ResourceType = {}));

export class ResourceTreeDialog extends BBusinessComponent {
  static propTypes = {
    canCheckChildsByParent: PropTypes.bool,
    isLeafCheckable: PropTypes.bool,
    resourceList: PropTypes.array,
    canMultipleSelect: PropTypes.bool,
    selectedResourceList: PropTypes.any
  };

  static defaultProps = {
    resourceCode: 'IBLRRSSRCH',
    canCheckChildsByParent: false,
    isLeafCheckable: true,
    resourceList: []
  };

  state: state = {
    shortByNumber: true,
    showHiddenResources: true,
    showDetails: false,
    resourceList: this.props.resourceList || []
  };

  static treeHeight = 500;

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.applyFilter();
  }

  componentDidMount() {
    super.componentDidMount();
    this.determineActionEnables();
  }

  getValue(): Array<Number> {
    let treeControl = this.treeView && this.treeView.getInstance();
    if (treeControl) {
      let value = treeControl.getValue();
      return (value || []).map(item => {
        return item.id;
      });
    }
    return null;
  }

  determineActionEnables() {
    let form = this.transactionForm;
    if (form) {
      if (this.state.shortByNumber) {
        form.disableAction('SortByNumber');
        form.enableAction('SortByName');
      } else {
        form.enableAction('SortByNumber');
        form.disableAction('SortByName');
      }

      let value = this.getValue();
      if ((value || []).length > 0) {
        form.enableAction(BConst.ActionCommand.Ok);
      } else {
        form.disableAction(BConst.ActionCommand.Ok);
      }
    }
  }

  getTreeHeight(obj): Number {
    if (obj && obj.parentDiv) {
      let m = this.props.canMultipleSelect ? 240 : 180;
      ResourceTreeDialog.treeHeight = obj.parentDiv.clientHeight - m;
      return obj.parentDiv.clientHeight - m;
    }
    return ResourceTreeDialog.treeHeight;
  }

  applyFilter() {
    let resourceList = Object.assign([], this.state.resourceList);
    let showDetails = this.state.showDetails;
    let showHiddenResources = this.state.showHiddenResources;
    let channels = this.state.checkedChannelList;

    helper.treeForEach(resourceList, node => {
      node.isHidden = false;
      node.detail = null;
      node.icon = null;

      if (showDetails) {
        node.detail = node.id + ' - ' + ResourceTreeDialog.ResourceType[node.typeId] + ' - ' + node.uiType + ' - ' + node.sortId;
      }

      if (node.typeId == 3 || node.typeId == 4) {
        node.isHidden = !showHiddenResources;
        if (showHiddenResources) {
          node.icon = {
            dynamicIcon: 'CropFree',
            iconProperties: { style: { color: this.props.context.theme.boaPalette.base250 } }
          };
        }
      }

      if (node.id !== 0 && channels && !channels.find(s => s.channelId === node.channelId)) {
        node.isHidden = true;
      }
    });
  }

  resetState() {
    this.setState({ reRender: !this.state.reRender });
  }

  handleOnActionClick(e) {
    switch (e.commandName) {
      case BConst.ActionCommand.Ok: {
        let value = this.getValue();
        if ((value || []).length == 0) {
          let closeMsg = this.getMessage('BusinessComponents', 'ChooseAScreenPlease');
          BDialogHelper.show(this.props.context, closeMsg, BComponent.DialogType.WARNING);
          return;
        }
        BDialogHelper.close(this, BComponent.DialogResponse.OK, value);
        break;
      }
      case 'Clean': {
        let list = Object.assign([], this.state.resourceList || []);
        helper.treeForEach(list, node => {
          node.isSelected = false;
        });
        this.setState({
          resourceList: list,
          showHiddenResources: true,
          showDetails: false
        });
        this.channelComponent.getInstance().resetValue();
        break;
      }
      case 'SortByName': {
        let newList = helper.sortByName(this.state.resourceList);
        this.setState({
          resourceList: Object.assign([], newList),
          shortByNumber: false
        });
        break;
      }
      case 'SortByNumber': {
        let newList = helper.sortByNumber(this.state.resourceList);
        this.setState({
          resourceList: Object.assign([], newList),
          shortByNumber: true
        });
        break;
      }
      default:
        break;
    }
  }

  render() {
    this.determineActionEnables();

    let cardStyle = { paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px', paddingBottom: '0px' };
    let leftPaneContent = (
      <div>
        <BToggle
          context={this.props.context}
          labelPosition={'left'}
          toggled={this.state.showDetails}
          defaultToggled={this.state.showDetails}
          label={this.getMessage('BusinessComponents', 'ShowDetails')}
          onToggle={(event, checked) => {
            this.state.showDetails = checked;
            this.applyFilter();
            this.resetState();
          }}
        />
        <BToggle
          context={this.props.context}
          labelPosition={'left'}
          toggled={this.state.showHiddenResources}
          defaultToggled={this.state.showHiddenResources}
          label={this.getMessage('BusinessComponents', 'IncludeHiddenResources')}
          onToggle={(event, checked) => {
            this.state.showHiddenResources = checked;
            this.applyFilter();
            this.resetState();
          }}
        />
        <BChannelComponent
          ref={r => (this.channelComponent = r)}
          context={this.props.context}
          labelText={this.getMessage('BusinessComponents', 'Channel')}
          isMultiple={true}
          selectedChannelId={-1}
          multiColumn={false}
          disableSearch={true}
          selectAllOpening={true}
          onChannelSelect={(dataitems: any) => {
            this.state.checkedChannelList = dataitems;
            this.applyFilter();
            this.resetState();
          }}
        />
      </div>
    );

    return (
      <BTransactionForm
        ref={r => (this.transactionForm = r)}
        disableCardWidth={true}
        {...this.props}
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        cardSectionThresholdColumn={1}
        leftPaneContent={leftPaneContent}
        onActionClick={e => {
          this.handleOnActionClick(e);
        }}
      >
        <BCard context={this.props.context} style={cardStyle}>
          <BTreeView
            ref={r => (this.treeView = r)}
            context={this.props.context}
            data={this.state.resourceList}
            height={this.getTreeHeight(this.transactionForm)}
            style={{ marginBottom: '-8px' }}
            isMultiSelect={this.props.canMultipleSelect}
            isCheckable={true}
            isSingleCheckable={true}
            isLeafCheckable={this.props.isLeafCheckable}
            rowHeight={this.state.showDetails ? 40 : 36}
            onSelectNode={() => {
              this.determineActionEnables();
            }}
            onCheckNode={() => {
              this.determineActionEnables();
            }}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

ResourceTreeDialog.ResourceType = ResourceType;
ResourceTreeDialog.StaticResourceList = [];
export default ResourceTreeDialog;
