import React from 'react';
import PropTypes from 'prop-types';
import AccessPointDialog from './AccessPointDialog';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import { BToolTip } from 'b-tool-tip';
import DataLoader from './DataLoader';
import _ from 'lodash';

@BComponentComposer
export class BAccessPointBrowser extends BBusinessComponent {
  static propTypes = {
    /**
     * Base properties from BBusinessComponent.
     */
    ...BBusinessComponent.props,
    /**
     * The label of the access point.
     */
    labelText: PropTypes.string,
    /**
     * The hint text of the label.
     */
    hintText: PropTypes.string,
    /**
     * If true, user can select multiple resource.
     */
    isMultiSelection: PropTypes.bool,
    /**
     * The error content to display.
     */
    errorText: PropTypes.string,
    /**
     * If true, user must be select at least one user resource.
     */
    userMustBeSelected: PropTypes.bool,
    /**
     * If true, user must be select at least one work group resource.
     */
    workgroupMustBeSelected: PropTypes.bool,
    /**
     * If true, user must be select at least one role resource.
     */
    roleMustBeSelected: PropTypes.bool,
    /**
     * If true, all item will be expanded.
     */
    expandAll: PropTypes.bool,
    /**
     * Height of component.
     */
    height: PropTypes.number,
    /**
     * If true, icons will be show.
     */
    showIcons: PropTypes.bool,

    isChoosable: PropTypes.bool,
    canSelectOwnWorkgroupRoot: PropTypes.bool,
    rootWorkgroupId: PropTypes.number,
    accessPointDialogClosedByApprove: PropTypes.func,
    showDetailedAccessPointName: PropTypes.bool,
    selectedAccessPointIds: PropTypes.array,
    onResetValue: PropTypes.func,
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    isChoosable: true,
    // userMustBeSelected: false,
    // workgroupMustBeSelected: false,
    // roleMustBeSelected: false,
    selectedAccessPointIds: [],
    isMultiSelection: true, // default true
    showDetailedAccessPointName: false // default false
  };

  constructor(props, context) {
    super(props, context);
    this.state = { selectedNodeList: [] };
    if ((this.props.selectedAccessPointIds || []).length > 0) {
      this.props.selectedAccessPointIds.forEach(id => {
        this.state.selectedNodeList.push({ id: id });
      });
    }
    this.dataLoader = new DataLoader(this, this.state.selectedNodeList);
  }

  _clearActionButton = {
    dynamicIcon: 'Clear',
    iconProperties: { nativeColor: this.props.context.theme.boaPalette.base400 },
    onClick: this.clearButtonClicked.bind(this)
  };

  _openDialogActionButton = {
    dynamicIcon: 'AddCircleOutline',
    iconProperties: { nativeColor: this.props.context.theme.boaPalette.pri500 },
    onClick: this.openDialogButtonClicked.bind(this)
  };

  componentDidMount() {
    super.componentDidMount();
    if ((this.state.selectedNodeList || []).length > 0) {
      this.dataLoader.loadData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if (!_.isEqual(this.props.selectedAccessPointIds, nextProps.selectedAccessPointIds)) {
        let selectedNodeList = [];
        (nextProps.selectedAccessPointIds || []).forEach(id => {
          selectedNodeList.push({ id: id });
        });
        this.state.selectedNodeList = selectedNodeList;
        this.dataLoader = new DataLoader(this, this.state.selectedNodeList);
        this.dataLoader.loadData();
      }
    }
  }

  proxyDidRespond(proxyResponse) {
    this.dataLoader && this.dataLoader.proxyDidRespond(proxyResponse);
  }

  clearButtonClicked() {
    if (!this.props.isChoosable) return false;
    this.resetValue();
  }

  openDialogButtonClicked() {
    if (!this.props.isChoosable) {
      return false;
    }

    let dialog = (
      <AccessPointDialog
        context={this.props.context}
        accessPointNodeList={this.state.accessPointNodeList}
        selectedNodeList={this.state.selectedNodeList}
        isMultiSelection={this.props.isMultiSelection}
        workgroupMustBeSelected={this.props.workgroupMustBeSelected}
        roleMustBeSelected={this.props.roleMustBeSelected}
        userMustBeSelected={this.props.userMustBeSelected}
        expandAll={this.props.expandAll}
        height={this.props.height}
        showIcons={this.props.showIcons}
        rootWorkgroupId={this.props.canSelectOwnWorkgroupRoot ? this.props.rootWorkgroupId : undefined}
      />
    );

    BDialogHelper.showWithResourceCode(
      this.props.context,
      'IBLRERNKAR',
      dialog,
      0,
      0,
      this.props.floatingLabelText,
      this.onDialogClosed.bind(this)
    );
  }

  onDialogClosed(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
      this.setState({ selectedNodeList: data });
      this.props.accessPointDialogClosedByApprove && this.props.accessPointDialogClosedByApprove();
    }
  }

  getDisplayTextAndTooltip(data) {
    let toolTipText = [];
    let displayText = '';

    if (data) {
      if (Array.isArray(data)) {
        if (data.length > 0) toolTipText.push(this.getMessage('BusinessComponents', 'SelectedAccessPoint'));

        data.forEach(item => {
          let text = item.id;
          displayText += text + (data.length > 1 && data.length != data.findIndex(i => i.id == item.id) + 1 ? ', ' : '');
          if (this.props.showDetailedAccessPointName) {
            if (item.roleName) text += ' - ' + item.roleName;
            if (item.workgroupName) text += ' - ' + item.workgroupName;
            toolTipText.push(<div> {text} </div>);
          }
        });
      } else {
        displayText = data.name;
      }
    }
    return { displayText, toolTipText };
  }

  /**
   * Return the selected bank that is currently selected
   * @returns {''}
   */
  getValue() {
    return this.state.selectedNodeList
      ? this.state.selectedNodeList.map(item => {
        return item.id;
      })
      : [];
  }

  getData() {
    return this.state.selectedNodeList || [];
  }

  resetValue() {
    this.setState({
      selectedNodeList: [],
      displayText: '',
      toolTipText: []
    });

    if (this.props.onResetValue) {
      this.props.onResetValue();
    }
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  validateConstraint() {
    return this.bInputAction ? this.bInputAction.validateConstraint() : true;
  }

  render() {
    let text = this.getDisplayTextAndTooltip(this.state.selectedNodeList);
    let rightIconList = [];
    if (text.displayText) {
      rightIconList.push(this._clearActionButton);
    }
    rightIconList.push(this._openDialogActionButton);

    let input = (
      <div style={{ position: 'relative' }}>
        <BInputAction
          ref={r => (this.bInputAction = r)}
          context={this.props.context}
          inputDisabled={true}
          floatingLabelText={this.props.labelText || this.getMessage('BusinessComponents', 'AccessPoint')}
          hintText={this.props.hintText || this.getMessage('BusinessComponents', 'AccessPoint')}
          rightIconList={this.state.isLoading ? [] : rightIconList}
          value={text.displayText}
          errorText={this.props.errorText}
          disabled={!this.props.isChoosable}
          valueConstraint={this.props.valueConstraint}
        />
        {this.state.isLoading && this.dataLoader && this.dataLoader.loadingIcon()}
      </div>
    );

    return (
      <div style={{ position: 'relative' }}>
        {this.props.showDetailedAccessPointName ? (
          <BToolTip context={this.props.context} tooltip={text.toolTipText} tooltipPosition="down">
            <div tabIndex="0" style={{ outline: 'none', position: 'relative' }}>
              {input}
            </div>
          </BToolTip>
        ) : (
          input
        )}
      </div>
    );
  }
}

export default BAccessPointBrowser;
