import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BActionManager } from 'b-action-manager';
import { BLabel } from 'b-label';
import { BRadioButton } from 'b-radio-button';
import { BButton } from 'b-button';
import { BCard } from 'b-card';
import { BGridList } from 'b-grid-list';
import { BList } from 'b-list';
import { BListItem } from 'b-list-item';
import { BPopover } from 'b-popover';
import { findDOMNode } from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import { BToggle } from 'b-toggle';
import { BComboBox } from 'b-combo-box';
import { BResourceBrowser } from 'b-resource-browser';
import { BParameterComponent } from 'b-parameter-component';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    background: theme.boaPalette.comp500,
    width: '100%'
  },
  listItemRoot: {
    paddingTop: 6,
    paddingBottom: 6,
    minHeight: 36,
  },
  listItemRootMobile: {
    minHeight: 48,
  },
  listItemTextPrimary: {
    color: theme.boaPalette.base400,
    fontSize: 14,
  },
  menuItemRoot: {
    minHeight: 48,
  },
  menuItemGutters: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  menuItemTextPrimary: {
    color: theme.boaPalette.base450,
    fontSize: 13,
  }
});

let dialogTitle = 'SETTINGS';
let dialogStyle;
let isMobileOrTablet;
let dialogRef;
let anchorEl;

@BComponentComposer
@withStyles(styles)
export class BSettingsStyled extends BComponent {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <BSettings {...this.props} />;
  }

}

@BComponentComposer
@withStyles(styles)
export class BSettings
  extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
  };

  state = {
    settingsInfo: {
      choosenLanguageId: 1,
      willOpenScreenList: null,
      statusBubbleVisibilityType: 1,
      taskbarBubbleVisibilityType: 1,
      UIStylesPanel: 1,
      controlPassbookOption: true,
      controlShowDivitOnSecondMonitor: true,
      controlFinalCheck: false,
      controlAnswerNoCheck: false,
      controlAccountNumberOption: true,
      controlCustomerPaneOption: true,
      controlCustomerAdvertisementOption: true
    },
    dialogTitle,
    selectedItem: 0,
    selected: false,
    resourceInfo: {
      'id': 934,
      'name': 'Ayarlar',
      'description': 'Ayarlar',
      'resourceCode': 'ISATSETTINGS',
      'resourceActionList': [
        {
          'resourceId': 934,
          'actionId': 11,
          'actionType': 1,
          'name': this.getMessage('BusinessComponents', 'Save'),
          'commandName': 'Save',
          'groupName': '',
          'description': 'Kaydet',
          'iconPath': 'Save',
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
      ],
    },
    selectedTheme: 1,
    statusbarBubbleVisibilityValue: 1,
    taskbarBubbleVisibilityValue: 1,
    toggleItems: [
      {
        value: true,
        label: this.getMessage('BusinessComponents', 'PrintReceiveAutomatically'),
        informationText: this.getMessage('BusinessComponents', 'PrintReceiveAutomaticallyTooltip'),
      },
      {
        value: true,
        label: this.getMessage('BusinessComponents', 'ShowDivitOnSecondMonitor'),
        informationText: this.getMessage('BusinessComponents', 'ShowDivitOnSecondMonitorToolTip'),
      },
      {
        value: false,
        label: this.getMessage('BusinessComponents', 'WarnApproveOrRejectButton'),
        informationText: this.getMessage('BusinessComponents', 'ApproveOrRejectWarningDetails'),
      },
      {
        value: false,
        label: this.getMessage('BusinessComponents', 'QuestionIsDefaultNo'),
        informationText: this.getMessage('BusinessComponents', 'QuestionIsDefaultNoDetails'),
      },
      {
        value: true,
        label: this.getMessage('BusinessComponents', 'AutomaticCustomerNumber'),
        informationText: this.getMessage('BusinessComponents', 'CustmerNumberIsAutomaticallyPopulatedInNewScreens'),
      },
      {
        value: true,
        label: this.getMessage('BusinessComponents', 'AutomaticCustomerWindow'),
        informationText: this.getMessage('BusinessComponents', 'WhenAccountNumberEnteredRetrieveCustomerInfoAutomatically'),
      },
      {
        value: true,
        label: this.getMessage('BusinessComponents', 'AutomaticMarketingWindow'),
        informationText: this.getMessage('BusinessComponents', 'WhenAccountNumberEnteredRetrieveMarketingInfoAutomatically'),
      }
    ]
  };

  constructor(props, context) {
    super(props, context);
  }

  static show(context) {
    isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    let settingsElement = <BSettingsStyled context={context} />;
    dialogStyle = { width: 960, height: '100%', padding: 0, overflow: 'hide' };
    dialogRef = BDialogHelper.show(context,
      settingsElement,
      0, 0, dialogTitle, this.onClose, dialogStyle, null, null); //  Title dinamik olarak set edilecek
  }


  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  onClose = () => {
  }

  onBackClicked = () => {
    let state = { selectedItem: null, selected: false, title: dialogTitle };
    this.setState(state);
    dialogRef.getInstance().setLeftTitleButton(null);
  }

  componentDidMount() {
    super.componentDidMount();   
    if (dialogRef) {
      dialogTitle = this.getMessage('BusinessComponents', 'Settings');
      this.setState({ title: dialogTitle });
      var node = findDOMNode(dialogRef.getInstance());
      if (node) {
        var dialogHeight = node.children[1].clientHeight;
        this.setState({ dialogContentHeight: dialogHeight - 88 });
      }
    }

    let proxyRequest = {
      requestClass: 'BOA.Types.Container.ClientSettingsRequest',
      requestBody: {
        methodName: 'Select',
        DataContract: {
          userName: this.props.context.applicationContext.user.userName,          
        },
      },
      key: 'ClientSettingsSelect'
    };
    this.proxyExecute(proxyRequest);
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate(nextProps, nextState);
    if (nextState.title !== this.state.title && dialogRef) {
      dialogRef.getInstance().setTitle(nextState.title);
    }
  }

  listItemClicked = (item) => {
    let state = { selectedItem: item.value, selected: true, title: isMobileOrTablet ? item.primaryText : this.state.title };
    this.setState(state);

    if (isMobileOrTablet) {
      dialogRef.getInstance().setLeftTitleButton(
        <BButton context={this.props.context}
          type="icon"
          style={{ width: 40, height: 40 }}
          dynamicIcon={'ArrowBack'}
          iconProperties={{ nativeColor: '#FFF' }}
          onClick={this.onBackClicked} />);
    }
  }

  optionClick = (event) => {
    anchorEl = event.currentTarget;
    this.setState({ isMenuOptionOpen: true });
  }

  actionClick = (event) => {
    this.debugLog(event);
    this.debugLog('ACTION_CLICK');
  }
  menuOptionListItemClicked = (item) => {
    this.setState({ isMenuOptionOpen: false });
    if (item.value === 1) {
      this.setDefaultAllElements();
    }
    this.debugLog('MENUOPTION ITEM Clicked' + item);
  }

  changeTheme = (selectedTheme) => {
    this.setState({ selectedTheme });
    let setInfo = this.state.settingsInfo;
    setInfo.UIStylesPanel = selectedTheme;
    this.setState({ settingsInfo: setInfo });
  };

  onToggle = (index) => {
    let toggleItems = this.state.toggleItems;
    toggleItems[index].value = !toggleItems[index].value;
    this.setState({ toggleItems: Object.assign([], toggleItems) });
  }

  statusbarBubbleVisibilitySelect = (selectedIndex, selectedItems) => {
    this.setState({ statusbarBubbleVisibilityValue: selectedItems[0].value });
    let setInfo = this.state.settingsInfo;
    setInfo.statusBubbleVisibilityType = selectedItems[0].value;
    this.setState({ settingsInfo: setInfo });
  }

  taskbarBubbleVisibilitySelect = (selectedIndex, selectedItems) => {
    this.setState({ taskbarBubbleVisibilityValue: selectedItems[0].value });
    let setInfo = this.state.settingsInfo;
    setInfo.taskbarBubbleVisibilityType = selectedItems[0].value;
    this.setState({ settingsInfo: setInfo });
  }

  setDefaultAllElements = () => {
    let defaultToggles = [{ value: true }, { value: true }, { value: false }, { value: false }, { value: true }, { value: true }, { value: true }];
    let toggleItems = this.state.toggleItems.map((item, i) => {
      item.value = defaultToggles[i].value;
      return item;
    });
    this.setState({
      toggleItems: Object.assign([], toggleItems),
      statusbarBubbleVisibilityValue: 1, taskbarBubbleVisibilityValue: 1
    });
  }
  onLanguageParameterChanged(parameter) {
    var setInfo = this.state.settingsInfo;
    setInfo.choosenLanguageId = parameter.paramCode;
    this.setState({ settingsInfo: setInfo });
  }
  handleOnResourceSelect(values) {
    let setInfo = this.state.settingsInfo;
    setInfo.willOpenScreenList = values[0];
    this.setState({ settingsInfo: setInfo });
  }
  handleOnPrintReceiveAutomatically(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlPassbookOption = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  handleOnShowDivitOnSecondMonitor(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlShowDivitOnSecondMonitor = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  handleOnWarnApproveOrRejectButton(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlFinalCheck = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  handleQuestionIsDefaultNo(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlAnswerNoCheck = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  handleOnAutomaticCustomerNumber(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlAccountNumberOption = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  handleOnControlCustomerPaneOption(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlCustomerPaneOption = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  handleOnAutomaticMarketingWindow(event, isInputChecked) {
    let setInfo = this.state.settingsInfo;
    setInfo.controlCustomerAdvertisementOption = isInputChecked;
    this.setState({ settingsInfo: setInfo });
  }
  getValues() {
    let values = [];
    if (this.state.settingsInfo && this.state.settingsInfo.length > 0) {
      this.state.settingsInfo.forEach(() => {
        values.push(this.state.settingsInfo.choosenLanguageId);
      });
    }
    return values;
  }
  clientSettingSave() {  
    let proxyRequest = {
      requestClass: 'BOA.Types.Container.ClientSettingsRequest',
      requestBody: {
        methodName: 'Insert',
        DataContract: {
          IsForcedToUseSetting: 1,
          SettingJSON : JSON.stringify(this.state.settingsInfo)          
        },
      },
      key: 'ClientSettingsInsert'
    };
    this.proxyExecute(proxyRequest);
  }
  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'ClientSettingsInsert': {
        if (response.success) {
          this.debugLog('true');
        }  
        break;
      }
      case 'ClientSettingsSelect': {
        if (response.success) {
          this.setState({ settingsInfo: JSON.parse(proxyResponse.response.value.settingJSON) });
        }
        break;
      }
      default:
        break;
    }
  }
  render() {
    let listItems = [
      { primaryText: this.getMessage('BusinessComponents', 'General'), value: 0 },
      { primaryText: this.getMessage('BusinessComponents', 'Report'), value: 1 },
      { primaryText: this.getMessage('BusinessComponents', 'PrayerTimes'), value: 2 },
      { primaryText: this.getMessage('BusinessComponents', 'Theme'), value: 3 },
    ];

    let menuOptionListItems = [
      { primaryText: this.getMessage('BusinessComponents', 'RevertToDefaultSettings'), value: 1 },
      { primaryText: this.getMessage('BusinessComponents', 'RevertToDefaultView'), value: 2 },
      { primaryText: this.getMessage('BOA', 'ControlShowMenuPath'), value: 3 },
      { primaryText: this.getMessage('BOA', 'AddToFavorites'), value: 4, divider: true },
      { primaryText: this.getMessage('BOA', 'RankThisScreen'), value: 5 },
      { primaryText: this.getMessage('BOA', 'MessageHistory'), value: 6, divider: true },
      { primaryText: this.getMessage('BOA', 'MyNotes'), value: 7 },
      { primaryText: this.getMessage('BOA', 'EnterDemandOrSuggestion'), value: 8 },
      { primaryText: this.getMessage('BOA', 'OpenINC'), value: 9 },
    ];

    let bubbleDatasource = [
      { value: 1, text: this.getMessage('BOA', 'AllMessages') },
      { value: 2, text: this.getMessage('BOA', 'OnlyErrors') },
      { value: 3, text: this.getMessage('BOA', 'OnlyInformations') },
      { value: 4, text: this.getMessage('BOA', 'OnlyWarnings') },
      { value: 5, text: this.getMessage('BOA', 'ErrorsAndWarnings') },
      { value: 6, text: this.getMessage('BOA', 'DontShowMessage') }
    ];

    // this.getMessage('BOA', 'Summer')
    let themeItems = [
      { title: this.getMessage('BOA', 'Fall'), value: 2, color: '#ef6c00' },
      { title: this.getMessage('BOA', 'Violet'), value: 5, color: '#aa00ff' },
      { title: this.getMessage('BOA', 'Winter'), value: 0, color: '#40c4ff' },
      { title: this.getMessage('BOA', 'Rose'), value: 6, color: '#c62828' },
      { title: this.getMessage('BOA', 'Spring'), value: 3, color: '#43a047' },
      { title: this.getMessage('BOA', 'Sea'), value: 7, color: '#004ba0' },
      { title: this.getMessage('BOA', 'Summer'), value: 1, color: '#ffea00' },
      { title: this.getMessage('BOA', 'Night'), value: 4, color: '#000000' },
    ];

    let { context, classes, } = this.props;
    const { isRightToLeft } = context.localization;

    let contentStyle = {
      width: '100%',
      background: context.theme.boaPalette.base100,
      padding: isMobileOrTablet ? 0 : 24,
      paddingTop: isMobileOrTablet ? 10 : 24,
      overflow: 'scroll',
      height: this.state.dialogContentHeight,
    };

    let columns = [
      { key: 'value', name: 'Value', type: 'number', 'width': 80 },
      { key: 'text', name: 'Text', 'width': 140 },
    ];
    let infoTextStyle = { height: 16, marginTop: -12, fontSize: '11px', color: context.theme.boaPalette.base400 };
    let elementStyle = { width: '100%', marginBottom: 8 };

    let settingsContent = this.state.selectedItem === 0 ?
      <div style={contentStyle}>
        <BCard context={context} >
          <div>
            <div style={elementStyle}>
              <BParameterComponent
                context={context}
                hintText={this.getMessage('BusinessComponents', 'LanguageChoose')}
                labelText={this.getMessage('BusinessComponents', 'LanguageChoose')}
                paramType='BOALanguage'
                displayMember='ParamDescription'
                selectedParamCode={this.state.settingsInfo.choosenLanguageId}
                onParameterSelect={this.onLanguageParameterChanged.bind(this)}
              // onParameterSelect={this.onSegmentSelected.bind(this)}
              />
              <BLabel style={infoTextStyle}
                context={context} text={this.getMessage('BusinessComponents', 'RestartBOAForActivateSelectedLanguage')} />
            </div>
            <div style={elementStyle}>
              <BResourceBrowser
                context={context}
                hintText={this.getMessage('BOA', 'BOAWillOpenScreen')}
                labelText={this.getMessage('BOA', 'BOAWillOpenScreen')}
                style={{ marginBottom: -10, }}
                value={this.state.resourceId}
                actionListVisibility={false}
                canMultipleSelect={true}
                canCheckChildsByParent={true}
                onResourceSelect={this.handleOnResourceSelect.bind(this)}
                // onResourceSelect={(values, datas) => {
                //   this.handleOnResourceSelect(values, datas);
                // }}
                onResetValue={() => {
                  this.handleOnResetValue();
                }}
              />
              <BLabel style={infoTextStyle}
                context={context} text={this.getMessage('BOA', 'BOAWillOpenScreenTooltip')} />
            </div>
            <div style={elementStyle}>{}
              <BComboBox
                context={context}
                columns={columns}
                valueConstraint={{ required: true }}
                multiSelect={false}
                multiColumn={false}
                isAllOptionIncluded={false}
                disableSearch={true}
                value={[this.state.settingsInfo.statusBubbleVisibilityType]}
                onSelect={this.statusbarBubbleVisibilitySelect.bind(this)}
                valueMemberPath='value'
                hintText={this.getMessage('BOA', 'BOAStatusbarBubbleVisibility')}
                labelText={this.getMessage('BOA', 'BOAStatusbarBubbleVisibility')}
                dataSource={bubbleDatasource}
                style={{ marginBottom: -10, }}
              />
              <BLabel style={infoTextStyle}
                context={context} text={this.getMessage('BOA', 'BOAStatusbarBubbleVisibilityTooltip')} />
            </div>
            <div style={elementStyle}>
              <BComboBox
                context={context}
                columns={columns}
                valueConstraint={{ required: true }}
                multiSelect={false}
                multiColumn={false}
                isAllOptionIncluded={false}
                disableSearch={true}
                value={[this.state.settingsInfo.taskbarBubbleVisibilityType]}
                onSelect={this.taskbarBubbleVisibilitySelect.bind(this)}
                valueMemberPath='value'
                hintText={this.getMessage('BOA', 'BOATaskbarBubbleVisibility')}
                labelText={this.getMessage('BOA', 'BOATaskbarBubbleVisibility')}
                dataSource={bubbleDatasource}
                style={{ marginBottom: -10, }}
              />
              <BLabel style={infoTextStyle}
                context={context} text={this.getMessage('BOA', 'BOATaskbarBubbleVisibilityTooltip')} />
            </div>
            <BToggle
              context={context}
              onToggle={this.handleOnPrintReceiveAutomatically.bind(this)}
              toggled={this.state.settingsInfo.controlPassbookOption}
              defaultToggled={true}
              label={this.getMessage('BusinessComponents', 'PrintReceiveAutomatically')}
              informationText={this.getMessage('BusinessComponents', 'PrintReceiveAutomaticallyTooltip')} />
            <BToggle
              context={context}
              onToggle={this.handleOnShowDivitOnSecondMonitor.bind(this)}
              toggled={this.state.settingsInfo.controlShowDivitOnSecondMonitor}
              defaultToggled={true}
              label={this.getMessage('BusinessComponents', 'ShowDivitOnSecondMonitor')}
              informationText={this.getMessage('BusinessComponents', 'ShowDivitOnSecondMonitorToolTip')} />
            <BToggle
              context={context}
              onToggle={this.handleOnWarnApproveOrRejectButton.bind(this)}
              toggled={this.state.settingsInfo.controlFinalCheck}
              defaultToggled={false}
              label={this.getMessage('BusinessComponents', 'WarnApproveOrRejectButton')}
              informationText={this.getMessage('BusinessComponents', 'ApproveOrRejectWarningDetails')} />
            <BToggle
              context={context}
              onToggle={this.handleQuestionIsDefaultNo.bind(this)}
              toggled={this.state.settingsInfo.controlAnswerNoCheck}
              defaultToggled={false}
              label={this.getMessage('BusinessComponents', 'QuestionIsDefaultNo')}
              informationText={this.getMessage('BusinessComponents', 'QuestionIsDefaultNoDetails')} />
            <BToggle
              context={context}
              onToggle={this.handleOnAutomaticCustomerNumber.bind(this)}
              toggled={this.state.settingsInfo.controlAccountNumberOption}
              defaultToggled={true}
              label={this.getMessage('BusinessComponents', 'AutomaticCustomerNumber')}
              informationText={this.getMessage('BusinessComponents', 'CustmerNumberIsAutomaticallyPopulatedInNewScreens')} />
            <BToggle
              context={context}
              onToggle={this.handleOnControlCustomerPaneOption.bind(this)}
              toggled={this.state.settingsInfo.controlCustomerPaneOption}
              defaultToggled={true}
              label={this.getMessage('BusinessComponents', 'AutomaticCustomerWindow')}
              informationText={this.getMessage('BusinessComponents', 'WhenAccountNumberEnteredRetrieveCustomerInfoAutomatically')} />
            <BToggle
              context={context}
              onToggle={this.handleOnAutomaticMarketingWindow.bind(this)}
              toggled={this.state.settingsInfo.controlCustomerAdvertisementOption}
              defaultToggled={true}
              label={this.getMessage('BusinessComponents', 'AutomaticMarketingWindow')}
              informationText={this.getMessage('BusinessComponents', 'WhenAccountNumberEnteredRetrieveMarketingInfoAutomatically')} />

            {/* {this.state.toggleItems.map((item, i) =>
              <div key={i}
                style={elementStyle}>
                <BToggle
                  context={context}
                  label={item.label}
                  informationText={item.informationText}
                  toggled={item.value}
                  onToggle={() => this.onToggle(i)}
                />
              </div>
            )} */}
          </div>
        </BCard>
      </div>
      : this.state.selectedItem === 1 ?
        <div style={contentStyle}>
          <BCard context={context} >
            <BLabel context={context} text={this.getMessage('BusinessComponents', 'Reports')} />
          </BCard>
        </div>
        : this.state.selectedItem === 2 ?
          <div style={contentStyle}>
            <BCard context={context} >
              <BLabel context={context} text={this.getMessage('BusinessComponents', 'PrayerTimes')} />
            </BCard>
          </div>
          : this.state.selectedItem === 3 ?
            <div style={contentStyle}>
              <BCard context={context} >
                <div>
                  <BGridList style={{ paddingLeft: 12, paddingRight: 12 }} context={context} cellHeight={48} cols={isMobileOrTablet ? 1 : 2}>
                    {themeItems.map((item, i) =>
                      <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        <BRadioButton
                          context={context}
                          checked={this.state.settingsInfo.UIStylesPanel === item.value}
                          onChange={() => this.changeTheme(item.value)}
                          value={'' + item.value}
                          content={<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                            <div style={{ width: 28, height: 24, backgroundColor: item.color }} />
                            <div style={{
                              marginLeft: isRightToLeft ? 0 : 12,
                              marginRight: isRightToLeft ? 12 : 0,
                              display: 'flex',
                              alignItems: 'center',
                            }}>{item.title}</div></div>}
                        />
                      </div>
                    )}
                  </BGridList>
                </div>
              </BCard>
            </div>
            : null;

    let listContent =
      <BList style={{
        paddingTop: isMobileOrTablet ? 10 : 0,
        width: isMobileOrTablet ? '100%' : 320,
        borderRight: isRightToLeft ? null : '1px solid ' + context.theme.boaPalette.base200,
        borderLeft: isRightToLeft ? '1px solid ' + context.theme.boaPalette.base200 : null,
      }}
        context={context}>
        {listItems.map((item, i) =>
          <BListItem key={i} context={context}
            classes={{
              root: isMobileOrTablet ? classes.listItemRootMobile : classes.listItemRoot,
              itemTextPrimary: classes.listItemTextPrimary,
            }}
            selected={!isMobileOrTablet && item.value === this.state.selectedItem}
            primaryText={item.primaryText}
            // secondaryText={item.secondaryText}
            onClick={() => this.listItemClicked(item)}
            divider={isMobileOrTablet}
          />)}
      </BList>;

    let menuOptionListContent =
      <BList style={{
        width: isMobileOrTablet ? '100%' : 300, backgroundColor: context.theme.boaPalette.base10
      }}
        context={context}>
        {menuOptionListItems.map((item, i) =>
          <BListItem key={i} context={context}
            classes={{
              root: classes.menuItemRoot,
              gutters: classes.menuItemGutters,
              itemTextPrimary: classes.menuItemTextPrimary,
            }}
            primaryText={item.primaryText}
            // secondaryText={item.secondaryText}
            onClick={() => this.menuOptionListItemClicked(item)}
            divider={item.divider}
          />)}
      </BList>;


    let renderActionManager = null;
    if (!isMobileOrTablet || (isMobileOrTablet && this.state.selected)) {
      renderActionManager = <BActionManager
        ref={ref => this.actionManager = ref}
        resourceInfo={this.state.resourceInfo}
        context={context}
        inDialog={true}
        onActionClick={this.clientSettingSave.bind(this)}
        // onInfoClick={() => this.debugLog('INFO_CLICK')}
        onOptionsClick={this.optionClick}
      />;
    }

    return (
      <div style={{
        width: '100%', height: this.state.dialogContentHeight, direction: isRightToLeft ? 'rtl' : 'ltr',
      }}>
        {renderActionManager}
        <BPopover
          context={context}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onRequestClose={() => this.setState({ isMenuOptionOpen: false })}
          open={this.state.isMenuOptionOpen}
        >
          {menuOptionListContent}
        </BPopover>
        <div className={classes.root} >

          {isMobileOrTablet ? null :
            listContent
          }
          {isMobileOrTablet && !this.state.selected ?
            listContent
            : null
          }
          {isMobileOrTablet ? null :
            settingsContent
          }
          {isMobileOrTablet && this.state.selected ?
            settingsContent
            : null
          }
        </div>
      </div >
    );
  }
}
export default BSettings;

