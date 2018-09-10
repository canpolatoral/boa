import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import { BComponent, BComponentComposer, Utils } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BActionButton } from 'b-action-button';
import { BMenuItem } from 'b-menu-item';
import { BIconButton } from 'b-icon-button';
import { BIconMenu } from 'b-icon-menu';
import { BInput } from 'b-input';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { BFlexPanel } from 'b-flex-panel';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

var Actions = require('b-icon').Actions;
let ElementResizeDetectorMaker = require('element-resize-detector');
import { BDrawerMenu } from 'b-drawer-menu';

@BComponentComposer
export class ActionManagerBase extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
     * resource info
     */
    resourceInfo: PropTypes.any,

    /**
     * container page
     */
    page: PropTypes.any,

    /**
     * Callback function fired when the any action is clicked by the mouse.
     */
    canExecuteDelegates: PropTypes.any,
    /**
     * Callback function fired when the any action is clicked by the mouse.
     *
     * @param {object} event targeting the element.
     */
    onActionClick: PropTypes.func,
    /**
     * Callback function fired when the help button is clicked by the mouse.
     */
    onHelpClick: PropTypes.func,
    /**
     * Callback function fired when the info button is clicked by the mouse.
     */
    onInfoClick: PropTypes.func,
    /**
     * Callback function fired when the options button is clicked by the mouse.
     */
    onOptionsClick: PropTypes.func,
    /**
     * Callback function fired when the close button is clicked by the mouse.
     */
    onCloseClick: PropTypes.func,
    /**
     * Visibility of Help button. Default true.
     */
    onChangeViewClick: PropTypes.func,
    /**
     * Callback function fired when the ChangeView button is clicked by the mouse.
     */
    visibleHelpButton: PropTypes.bool,
    /**
     * Visibility of Info button. Default true.
     */
    visibleInfoButton: PropTypes.bool,
    /**
     * Visibility of Options button. Default true.
     */
    visibleOptionsButton: PropTypes.bool,

    /**
     * Visibility of Options button. Default true.
     */
    visibleCloseButton: PropTypes.bool,

    /**
    * Visibility of Change View button. Default false.
    */
    visibleChangeViewButton: PropTypes.bool,

    /**
     * Set visibility showLeftPane Default false,
     */
    showLeftPaneButton: PropTypes.bool,
    /**
     * Left Pane Icon
     */
    leftPaneIcon: PropTypes.any,
    /**
     * Callback function fired when the left pane inco button is clicked by the mouse.
     */
    leftPaneIconClick: PropTypes.func,
    /**
     * ActionManager filters by command name list
     */
    filterCommandNameList: PropTypes.array,
    /**
     * ActionManager shows only actions.
     */
    actionsOnlyMode: PropTypes.bool,

    hideCommandNameList: PropTypes.array,

    disableActionList: PropTypes.array,

    formHeader: PropTypes.string,

    formHeaderTransactionTypes: PropTypes.number,

    formMode: PropTypes.string
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    visibleHelpButton: true,
    visibleInfoButton: true,
    visibleOptionsButton: true,
    visibleCloseButton: true,
    visibleChangeViewButton: false,
    formMode: 'list'
  };

  // state = {
  //   arrowVisibles:{help:false, info:false, settings:false}
  // }

  arrowVisibles = { help: false, info: false, settings: false, close: false, changeView: false };

  getArrowVisibles() {
    if (this.arrowVisibles) {
      return this.arrowVisibles;
    }
    return {
      help: false,
      close: false,
      settings: false,
      info: false,
      changeView: false
    };
  }

  state = this.props.snapshot || {
    hasMoreAction: false,
    buttonCount: 0,
    resourceActionList:
      this.props.resourceInfo && this.props.resourceInfo.resourceActionList ? cloneDeep(this.props.resourceInfo.resourceActionList) : []
  };

  constructor(props, context) {
    super(props, context);

    this.updateMoreAction = this.updateMoreAction.bind(this);
    this.resizeActionManager = this.resizeActionManager.bind(this);
    this.resizeDetector = ElementResizeDetectorMaker();

    this.state.formMode = props.formMode;

    // TODO: Page'den alınacak.
    if (this.state.resourceActionList) {
      for (var i = 0; i < this.state.resourceActionList.length; i++) {
        var key = this.getCanActionExecuteKey(this.state.resourceActionList[i]);
        this.state[key] = this.isActionDisabled(this.state.resourceActionList[i]);
      }
    }
  }
  isShowBpmDescriptionInput = false;

  getSnapshot() {
    return {
      isShowBpmDescriptionInput: this.isShowBpmDescriptionInput,
      bpmInputDescription: this.bpmInputDescription,
      actionList: this.actionList,
      resourceActionList: this.state.resourceActionList,
      actionButtons: this.actionButtons,
      moreActions: this.moreActions,
      isVisibleStandartButton: this.isVisibleStandartButton,
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    (this.isShowBpmDescriptionInput = snapshot.isShowBpmDescriptionInput),
      (this.bpmInputDescription = snapshot.bpmInputDescription),
      (this.actionList = snapshot.actionList),
      (this.resourceActionList = snapshot.resourceActionList),
      (this.actionButtons = snapshot.actionButtons),
      (this.moreActions = snapshot.moreActions),
      (this.isVisibleStandartButton = snapshot.isVisibleStandartButton),
      (this.state = snapshot.state);
  }

  getBpmDescription() {
    if (this.bpmInputDescription) {
      return this.bpmInputDescription.getInstance().getValue();
    }
  }

  setBpmDescription(value) {
    if (this.bpmInputDescription) {
      return this.bpmInputDescription.getInstance().setValue(value);
    }
  }

  resetBpmDescription() {
    if (this.bpmInputDescription) {
      return this.bpmInputDescription.getInstance().resetValue();
    }
  }

  render() {
    // let isMobileOrTablet = Utils.isMobileOrTablet(this.props);
    let isMobile = Utils.isMobile(this.props);

    this.actionList = this.getActionList();
    this.actionButtons = this.populateActions(this.actionList.slice(0, this.state.buttonCount));
    const styles = {
      height: '40px',
      borderColor: this.props.context.theme.boaPalette.base200,
      borderWidth: 1,
      borderStyle: 'solid',
      position: 'relative',
      tabButtonStyle: { nativeColor: this.props.context.theme.boaPalette.pri500 },
      moreActionButtonStyle: { nativeColor: this.props.context.theme.boaPalette.pri500 },
      helpButtonStyle: { nativeColor: this.props.context.theme.boaPalette.sec500 },
      changeViewButtonStyle: { nativeColor: this.props.context.theme.boaPalette.more500 },
      infoButtonStyle: { nativeColor: this.props.context.theme.boaPalette.pri500 },
      optionsButtonStyle: { nativeColor: this.props.context.theme.boaPalette.pri500 },
      closeButtonStyle: { nativeColor: this.props.context.theme.boaPalette.obli500, display: 'none' },
      leftPaneButtonStyle: { nativeColor: this.props.context.theme.boaPalette.pri500, folder: 'Others' }
    };

    const closeIcon = 'Close';
    const optionsIcon = 'MoreVert';
    const infoIcon = 'InfoOutline';
    const helpIcon = 'Help';
    const leftIcon = 'Criterias'; // prop'dan alınabilir.

    const { DoubleChevronRight, DoubleChevronLeft } = Actions;
    const moreActionIcon = !this.props.context.localization.isRightToLeft ? (
      <DoubleChevronRight context={this.props.context} style={{ color: this.props.context.theme.boaPalette.pri500 }} />
    ) : (
      <DoubleChevronLeft context={this.props.context} style={{ color: this.props.context.theme.boaPalette.pri500 }} />
      );
    let rightIconButtonStyle = {
      float: !this.props.context.localization.isRightToLeft ? 'right' : 'left',
      display: 'inline-block',
      height: 40,
      width: isMobile ? 32 : 48
    };
    var leftIconButtonStyle = Object.assign({}, rightIconButtonStyle, {
      float: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      height: 40,
      width: isMobile ? 32 : 48
    });

    this.iconCount = 0;
    const { context } = this.props;

    const createIconButton = (dynamicIcon, bIcon, iconButtonStyle, iconProperties, onClick, arrowVisible) => {
      let _infoElement;
      _infoElement = (
        <div>
          <div>
            <ArrowDropUp
              style={{
                color: 'white',
                strokeWidth: '0.5',
                stroke: 'grey',
                width: '60px',
                height: '40px',
                display: arrowVisible ? 'block' : 'none',
                margin: '-19px -6px 0px -6px'
              }}
            />
          </div>
        </div>
      );
      if (this.props.actionsOnlyMode) {
        return null;
      } else {
        return (
          <div align="center" style={iconButtonStyle}>
            <BIconButton
              context={context}
              dynamicIcon={dynamicIcon}
              bIcon={bIcon}
              style={{
                height: 32,
                width: 32,
                marginTop: 4
              }}
              iconProperties={iconProperties}
              onClick={onClick}
            />
            {_infoElement}
          </div>
        );
      }
    };

    // if (isMobileOrTablet) {
    //   rightIconButtonStyle.boxShadow = '-1px 0px 0px rgba(0, 0, 0, 0.2)';
    //   rightIconButtonStyle.height = 40;
    //   leftIconButtonStyle.boxShadow = '1px 0px 0px rgba(0, 0, 0, 0.2)';
    //   leftIconButtonStyle.height = 40;
    // }

    let closeButton, optionsButton, infoButton, helpButton, leftPaneButton, changeViewButton;

    leftPaneButton = createIconButton(null, leftIcon, leftIconButtonStyle, styles.leftPaneButtonStyle, this.props.leftPaneIconClick);
    if (!this.props.inDialog && !isMobile && !window.isBOAStoreLogin && this.props.visibleCloseButton) {
      closeButton = createIconButton(
        closeIcon,
        null,
        rightIconButtonStyle,
        styles.closeButtonStyle,
        this.onCloseClick.bind(this),
        this.getArrowVisibles().close
      );
    }

    if (this.props.visibleOptionsButton) {
      optionsButton = createIconButton(
        optionsIcon,
        null,
        rightIconButtonStyle,
        styles.optionsButtonStyle,
        this.onOptionsClick.bind(this),
        this.getArrowVisibles().settings
      );
    }
    if (this.props.visibleInfoButton) {
      infoButton = createIconButton(
        infoIcon,
        null,
        rightIconButtonStyle,
        styles.infoButtonStyle,
        this.onInfoClick.bind(this),
        this.getArrowVisibles().info
      );
      //
    }
    if (this.props.visibleHelpButton) {
      helpButton = createIconButton(
        helpIcon,
        null,
        rightIconButtonStyle,
        styles.helpButtonStyle,
        this.onHelpClick.bind(this),
        this.getArrowVisibles().help
      );
    }

    if (this.props.visibleChangeViewButton) {
      changeViewButton = createIconButton(
        this.state.formMode == 'list' ? 'Dashboard' : 'List', // todo: ikon adı değişecek.
        null,
        rightIconButtonStyle,
        styles.changeViewButtonStyle,
        this.onChangeViewClick.bind(this),
        this.getArrowVisibles().changeView
      );
    }

    this.iconCount =
      (closeButton ? 1 : 0) +
      (optionsButton ? 1 : 0) +
      (infoButton ? 1 : 0) +
      (helpButton ? 1 : 0) +
      (changeViewButton ? 1 : 0) +
      (this.moreActions && this.moreActions.length ? 1 : 0);

    let panelStyle = {
      height: 40,
      textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      marginLeft: isMobile ? 8 : 12,
      marginRight: isMobile ? 8 : 12
    };

    let borderStyle = {
      borderBottomColor: this.props.context.theme.boaPalette.base200,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      height: isMobile && this.isShowBpmDescriptionInput ? 80 : 40,
      direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl',
      background: this.props.context.theme.boaPalette.comp500
    };

    let actionsDivStyle = {
      width: '100%',
      textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    };
    let actionsParentDivStyle = {
      width: 'calc(100% - ' + this.iconCount * 48 + 'px)'
    };

    let moreActionsMenu = null;
    this.moreActions = this.getMoreActionMenuItems(this.actionList.slice(this.state.buttonCount, this.actionList.length));

    moreActionsMenu = (
      <div align="center" style={{ display: 'inline-block', height: 40, width: 32 }}>
        <BIconMenu
          ref={r => {
            this.moreActionButton = r;
          }}
          context={this.props.context}
          iconType="custom"
          menuStyle={{
            background: this.props.context.theme.boaPalette.base10,
            paddingTop: 4,
            minWidth: 220
          }}
          iconStyle={{
            width: 32,
            height: 32,
            marginTop: 4
          }}
          customIcon={moreActionIcon}
          disabled={this.state.disabled}
          menuItems={this.moreActions}
        />
      </div>
    );

    if (isMobile) {
      moreActionsMenu = (
        <div align="center" style={{ display: 'inline-block', height: 40, width: 32 }}>
          <BIconButton
            context={context}
            icon={moreActionIcon}
            style={{
              height: 32,
              width: 32,
              marginTop: 4
            }}
            onClick={this.onMoreAction.bind(this)}
          />{' '}
        </div>
      );
    }

    let bpmDescription = null;
    let divider1 = null;
    let divider2 = null;

    if (!this.props.actionsOnlyMode) {
      bpmDescription = (
        <BFlexPanel
          responsive={false}
          alignItems="stretch"
          alignContent="stretch"
          style={{
            overflow: 'hidden',
            marginLeft: isMobile ? 16 : 0,
            marginRight: isMobile ? 16 : 0,
            marginTop: isMobile ? 10 : 16,
            minWidth: 200
          }}
        >
          <BInput
            ref={r => {
              this.bpmInputDescription = r;
            }}
            context={this.props.context}
            hintText={this.getMessage('BusinessComponents', 'WorkflowDescription')}
            underlineShow={true}
          />
        </BFlexPanel>
      );

      divider1 = (
        <div
          style={{
            width: 1,
            background: this.props.context.theme.boaPalette.base200,
            height: 40,
            marginLeft: !this.props.context.localization.isRightToLeft ? 12 : 24,
            marginRight: !this.props.context.localization.isRightToLeft ? 24 : 12
          }}
        />
      );

      divider2 = (
        <div
          style={{
            width: 1,
            background: this.props.context.theme.boaPalette.base200,
            height: 40,
            marginLeft: !this.props.context.localization.isRightToLeft ? 24 : 12,
            marginRight: !this.props.context.localization.isRightToLeft ? 12 : 24
          }}
        />
      );
    }

    let headerDiv = null;
    if (this.props.formHeader) {
      headerDiv = (
        <div style={{ backgroundColor: Utils.formHeaderTransactionTypesColor(this.props.formHeaderTransactionTypes, this.props) }}>
          <BFlexPanel
            alignItems="center"
            style={{
              marginLeft: isMobile ? 16 : 24,
              marginRight: isMobile ? 16 : 24,
              height: 24,
              fontSize: 12,
              fontWeight: 500,
              color: this.props.context.theme.boaPalette.comp500
            }}
          >
            {BComponent.Localization.stringUpperCase(this.props.formHeader)}
          </BFlexPanel>
        </div>
      );
    }

    this.iconCount = (closeButton ? 1 : 0) + (optionsButton ? 1 : 0) + (infoButton ? 1 : 0) + (helpButton ? 1 : 0) + (changeViewButton ? 1 : 0);
    var isMoreActionVisible = this.moreActions && this.moreActions.length > 0;
    var standartDivWidth = this.standartDiv ? ReactDOM.findDOMNode(this.standartDiv).offsetWidth : 0;
    actionsParentDivStyle.width = 'calc(100% - ' + standartDivWidth + 'px)';
    if (!isMobile) {
      return (
        <div style={borderStyle}>
          <BFlexPanel direction="vertical">
            <BFlexPanel responsive={false} style={panelStyle}>
              <BFlexPanel
                alignItems="center"
                responsive={false}
                ref={r => {
                  this.actionsParentDiv = r;
                }}
                style={actionsParentDivStyle}
              >
                {this.props.showLeftPaneButton && (this.props.leftPaneIcon || leftPaneButton)}
                <BFlexPanel
                  alignItems="center"
                  responsive={false}
                  ref={r => {
                    this.actionsDiv = r;
                  }}
                  style={actionsDivStyle}
                >
                  {this.actionButtons}
                </BFlexPanel>
              </BFlexPanel>
              <BFlexPanel
                ref={r => {
                  this.standartDiv = r;
                }}
                style={{ float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
                alignItems="center"
                responsive={false}
              >
                {isMoreActionVisible ? moreActionsMenu : null}
                {this.isShowBpmDescriptionInput ? divider1 : null}
                {this.isShowBpmDescriptionInput ? bpmDescription : null}
                {this.isShowBpmDescriptionInput ? divider2 : null}
                {changeViewButton}
                {helpButton}
                {infoButton}
                {optionsButton}
                {closeButton}
              </BFlexPanel>
            </BFlexPanel>
            {headerDiv}
          </BFlexPanel>
        </div>
      );
    } else {
      if (this.isShowBpmDescriptionInput) {
        panelStyle.borderBottomColor = this.props.context.theme.boaPalette.base200;
        panelStyle.borderBottomStyle = 'solid';
        panelStyle.borderBottomWidth = 1;
      }
      if ((!this.standartDiv || standartDivWidth == 0) && this.isVisibleStandartButton) {
        standartDivWidth = (isMoreActionVisible ? 32 : 0) + (optionsButton ? 32 : 0) + (infoButton ? 32 : 0) + (helpButton ? 32 : 0) + (changeViewButton ? 32 : 0);
        actionsParentDivStyle.width = 'calc(100% - ' + standartDivWidth + 'px)';
      } else {
        standartDivWidth = isMoreActionVisible ? 32 : 0;
        actionsParentDivStyle.width = 'calc(100% - ' + standartDivWidth + 'px)';
      }
      return (
        <div style={borderStyle}>
          <BFlexPanel direction="vertical">
            <BFlexPanel responsive={false} style={panelStyle}>
              <BFlexPanel
                alignItems="center"
                responsive={false}
                ref={r => {
                  this.actionsParentDiv = r;
                }}
                style={actionsParentDivStyle}
              >
                {this.props.showLeftPaneButton && (this.props.leftPaneIcon || leftPaneButton)}
                <BFlexPanel
                  alignItems="center"
                  responsive={false}
                  ref={r => {
                    this.actionsDiv = r;
                  }}
                  style={actionsDivStyle}
                >
                  {this.actionButtons}
                </BFlexPanel>
              </BFlexPanel>
              <BFlexPanel
                ref={r => {
                  this.standartDiv = r;
                }}
                style={{ float: !this.props.context.localization.isRightToLeft ? 'right' : 'left' }}
                alignItems="center"
                responsive={false}
              >
                {isMoreActionVisible ? moreActionsMenu : null}
                {this.isVisibleStandartButton && changeViewButton}
                {this.isVisibleStandartButton && helpButton}
                {this.isVisibleStandartButton && infoButton}
                {this.isVisibleStandartButton && optionsButton}
              </BFlexPanel>
            </BFlexPanel>
            <div
              style={{
                marginLeft: isMobile ? 16 : 24,
                marginRight: isMobile ? 16 : 24
              }}
            >
              {this.isShowBpmDescriptionInput ? bpmDescription : null}
            </div>
            {headerDiv}
          </BFlexPanel>
        </div>
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (
      nextProps.resourceInfo &&
      (nextProps.resourceInfo.resourceActionList != this.props.resourceInfo.resourceActionList ||
        nextProps.filterCommandNameList != this.props.filterCommandNameList ||
        nextProps.actionsOnlyMode != this.props.actionsOnlyMode)
    ) {
      this.setState({
        resourceActionList:
          nextProps.resourceInfo && nextProps.resourceInfo.resourceActionList ? cloneDeep(nextProps.resourceInfo.resourceActionList) : []
      });
    }
    if (nextProps.formMode != this.props.formMode) {
      this.setState({ formMode: nextProps.formMode });
    }
    if (nextProps.snapshot) {
      this.setState({ ...nextProps.snapshot });
    }
  }

  componentWillMount() {
    super.componentWillMount();
    this.actionList = this.getActionList();
    this.setState({
      buttonCount: this.actionList.length
    });
  }

  componentDidMount() {
    super.componentDidMount();
    var parentNode = ReactDOM.findDOMNode(this);

    if (parentNode) {
      this.parentDiv = parentNode.parentNode;
      if (this.parentDiv) {
        this.resizeDetector.listenTo(this.parentDiv, this.resizeActionManager);
      }
    }
    this.updateMoreAction();
  }

  resizeActionManager() {
    this.actionList = this.getActionList();
    this.setState({
      buttonCount: this.actionList.length
    });
    this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    if (this.hasMoreAction()) {
      this.setState(prevState => ({
        buttonCount: prevState.buttonCount - 1
      }));
      this.isVisibleStandartButton = false;
      this.forceUpdate();
    } else {
      if (this.moreActions && this.moreActions.length > 0) {
        if (this.isVisibleStandartButton) {
          this.isVisibleStandartButton = false;
          this.forceUpdate();
        }
      } else {
        if (!this.isVisibleStandartButton) {
          this.isVisibleStandartButton = true;
          this.forceUpdate();
        }
      }
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.parentDiv) {
      this.resizeDetector.uninstall(this.parentDiv);
    }
  }

  /* Action Generation */
  getActionList() {
    if (!this.state.resourceActionList) {
      return [];
    }
    let resourceActionList = this.state.resourceActionList;

    let groups = []; // {groupName: '', startIndex:2, items:[] }
    let newActionList = resourceActionList.slice(0);

    resourceActionList.forEach(action => {
      if (action.groupName && groups.indexOf(action.groupName) < 0) {
        groups.push(action.groupName);
        let sortId = action.sortId;
        let groupActions = resourceActionList.filter(item => {
          item.disabled = this.isActionDisabled(item);
          if (item.groupName == action.groupName) {
            sortId = item.sortId < sortId ? item.sortId : sortId;
            return true;
          }
          return false;
        });
        let groupAction = {
          resourceId: action.resourceId,
          name: action.groupName,
          description: action.groupName,
          items: groupActions,
          sortId: sortId,
          actionId: groups.length * -1
        };

        newActionList.splice(newActionList.length, 0, groupAction);
        groupActions.forEach(item => {
          newActionList.splice(newActionList.indexOf(item), 1);
        });
      }
    });

    if (this.props.filterCommandNameList) {
      newActionList = newActionList.filter(action => this.props.filterCommandNameList.includes(action.commandName));
    }
    if (this.props.hideCommandNameList) {
      newActionList = newActionList.filter(action => !this.props.hideCommandNameList.includes(action.commandName));
    }
    this.sortActionList(newActionList);
    return newActionList;
  }

  populateActions(actionList) {
    let actionButtons = [];
    // actionType=11 Wizard, actionType=12 sayfa içi aksiyon(kurumsal müşteri-eerman)
    actionList
      .filter(a => {
        if (a.isVirtual || a.actionType == 11 || a.actionType == 12) return false;
        return true;
      })
      .forEach(element => {
        actionButtons.push(this.createAction(element));
      }, this);

    return actionButtons;
  }

  sortActionList(actionList) {
    actionList.sort(function (a, b) {
      if (a.sortId > b.sortId) {
        return 1;
      }
      if (a.sortId < b.sortId) {
        return -1;
      }
      var nameA = BComponent.Localization.stringUpperCase(a.name);
      var nameB = BComponent.Localization.stringUpperCase(b.name);
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  }

  createAction(action) {
    const { resourceInfo } = this.props.page ? this.props.page.state.pageParams : this.props;
    let uniqueKey = action.resourceId + '_' + action.actionId + (resourceInfo && resourceInfo.language ? '_' + resourceInfo.language : '');

    if (!action.iconPath) action.iconPath = 'None';
    if (action.items && action.items.length > 0) action.iconPath = 'MoreHoriz';

    const disabled = this.isActionDisabled(action);
    return (
      <BActionButton
        context={this.props.context}
        action={action}
        onClick={this.genericActionClick.bind(this)}
        disabled={disabled}
        key={uniqueKey}
      />
    );
  }

  /* More Actions */
  updateMoreAction() {
    if (this.hasMoreAction()) {
      this.forceUpdate();
    }
  }

  hasMoreAction() {
    if (this.actionsParentDiv && this.actionsDiv) {
      if (
        ReactDOM.findDOMNode(this.actionsParentDiv.getInstance()).offsetWidth <
        ReactDOM.findDOMNode(this.actionsDiv.getInstance()).scrollWidth
      ) {
        return true;
      }
    }
    return false;
  }

  getMoreActionMenuItems(actionList) {
    let returnArray = [];

    var isMobile = Utils.isMobile(this.props);
    for (let i = 0; i < actionList.length; i++) {
      let action = actionList[i];
      if (action.isVirtual) continue;
      let subItems;
      let moreItem = action.items && action.items.length > 0;
      if (moreItem) {
        subItems = this.getMoreActionMenuItems(action.items);
      }

      const disabled = this.isActionDisabled(action);

      const iconPath = Actions[action.iconPath] ? action.iconPath : moreItem ? 'MoreHoriz' : 'None';
      const iconProps = { context: this.props.context };
      const LeftIconType = Actions[iconPath];
      const leftIcon = <LeftIconType {...iconProps} />;
      let rightIcon =
        action.items && action.items.length > 0 ? (
          !this.props.context.localization.isRightToLeft ? (
            <ChevronRight
              nativeColor={isMobile ? this.props.context.theme.boaPalette.base400 : this.props.context.theme.boaPalette.base300}
            />
          ) : (
            <ChevronLeft
                nativeColor={isMobile ? this.props.context.theme.boaPalette.base400 : this.props.context.theme.boaPalette.base300}
              />
            )
        ) : null;
      let returnObject = (
        <BMenuItem
          context={this.props.context}
          style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
          key={action.actionId}
          value={action.actionId}
          primaryText={BComponent.Localization.stringUpperCase(action.name)}
          menuItems={subItems}
          isAddedDrawer={isMobile}
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          disabled={disabled}
          leftIconStyle={{
            marginLeft: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
            marginRight: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
            color: this.getIconColor(iconPath, disabled)
          }}
          rightIconStyle={{
            marginLeft: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
            marginRight: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24)
          }}
          primaryTextPadding={'0px 4px 0px 4px'}
          itemSelected={this.onMoreActionItemClick.bind(this, action)}
        />
      );
      returnArray.push(returnObject);
    }
    return returnArray;
  }

  updateExecutionStates() {
    if (this.props.canExecuteDelegates) {
      Object.keys(this.props.canExecuteDelegates).forEach(item => {
        if (this.isFunction(this.props.canExecuteDelegates[item])) {
          var key = this.getCanActionExecuteKey({ commandName: item });
          var val = this.props.canExecuteDelegates[item]();
          this.setState({ [key]: val });
        }
      });
    }
  }

  /* Clicks */
  genericActionClick(e, callBack) {
    this.debugLog(e.commandName + '-' + e.name);
    if (this.moreActionButton && this.moreActionButton.getInstance() && !e.items) {
      this.moreActionButton.getInstance().handleClose();
    }
    if (this.props.onActionClick && e.actionId > 0) {
      return this.props.onActionClick(e, callBack);
    }
  }

  onMoreAction() {
    var isMobile = Utils.isMobile(this.props);
    var actionMenuList = this.getMoreActionMenuItems(this.actionList);
    if (this.moreActions && this.moreActions.length > 0 && !this.isVisibleStandartButton) {
      const rightIcon = !this.props.context.localization.isRightToLeft ? (
        <ChevronRight nativeColor={this.props.context.theme.boaPalette.base400} />
      ) : (
        <ChevronLeft nativeColor={this.props.context.theme.boaPalette.base400} />
        );
      actionMenuList.push(<BMenuItem />);
      this.props.visibleHelpButton &&
        actionMenuList.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'Help'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            primaryTextPadding={'0px 16px 0px 16px'}
            itemSelected={this.onHelpClick.bind(this)}
          />
        );
      this.props.visibleInfoButton &&
        actionMenuList.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            rightIcon={rightIcon}
            primaryTextPadding={'0px 16px 0px 16px'}
            leftIconStyle={{
              marginLeft: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
              marginRight: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24)
            }}
            rightIconStyle={{
              marginLeft: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
              marginRight: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24)
            }}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('DynamicFormGenerator', 'ResourceInfo'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            itemSelected={this.onInfoClick.bind(this)}
          />
        );

      if (this.props.visibleOptionsButton) {
        var optionMenus = [];

        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'ControlShowMenuPath'))}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onControlShowMenuPathClick.bind(this)}
          />
        );
        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'AddToFavorites'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onAddToFavoritesClick.bind(this)}
          />
        );
        optionMenus.push(<BMenuItem />);
        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'RankThisScreen'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onRankThisScreenClick.bind(this)}
          />
        );
        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'MessageHistory'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onMessageHistoryClick.bind(this)}
          />
        );
        optionMenus.push(<BMenuItem />);
        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'MyNotes'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onMyNotesClick.bind(this)}
          />
        );
        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'EnterDemandOrSuggestion'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onEnterDemandOrSuggestionClick.bind(this)}
          />
        );
        optionMenus.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BOA', 'OpenINC'))}
            isAddedDrawer={Utils.isMobile(this.props)}
            itemSelected={this.onOpenINCClick.bind(this)}
          />
        );

        actionMenuList.push(
          <BMenuItem
            context={this.props.context}
            isAddedDrawer={true}
            menuItems={optionMenus}
            rightIcon={rightIcon}
            style={{ direction: !this.props.context.localization.isRightToLeft ? 'ltr' : 'rtl' }}
            primaryTextPadding={'0px 16px 0px 16px'}
            isAddedDrawer={true}
            leftIconStyle={{
              marginLeft: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
              marginRight: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24)
            }}
            rightIconStyle={{
              marginLeft: this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24),
              marginRight: !this.props.context.localization.isRightToLeft && (isMobile ? 16 : 24)
            }}
            primaryText={BComponent.Localization.stringUpperCase(this.getMessage('BusinessComponents', 'Options'))}
            isAddedDrawer={Utils.isMobile(this.props)}
          />
        );
      }
    }

    let menu = (
      <BFlexPanel direction="vertical" responsive={false}>
        <div style={{ height: '100vh', overflowY: 'scroll' }}>
          <BDrawerMenu
            context={this.props.context}
            isMenuItemList={true}
            autoWidth={true}
            disableAutoFocus={false}
            initiallyKeyboardFocused={false}
            items={actionMenuList}
          // onChange={this.onMenuItemSelected.bind(this)}
          // onDrawerMenuUpdate={this.onDrawerMenuUpdate.bind(this)}
          />
        </div>
      </BFlexPanel>
    );

    BDialogHelper.show(
      this.props.context,
      menu,
      BComponent.DialogType.SUCCESS,
      BComponent.DialogResponseStyle.OK,
      null,
      null,
      {
        padding: '0px',
        maxHeight: 'fit-content',
        borderRadius: '2px',
        overflow: 'auto',
        width: 'calc(100vw - 16px)',
        height: 'calc(100% - 16px)'
      },
      null,
      null,
      false
    );
  }

  onMoreActionItemClick(e, callBack) {
    this.debugLog('MoreActionItem clicked.');
    if (Utils.isMobile(this.props)) {
      BDialogHelper.close(this.props.context, BComponent.DialogResponse.NONE);
    }
    return this.genericActionClick(e, callBack);
  }

  onHelpClick(e) {
    this.debugLog('Help clicked.');
    this.props.onHelpClick && this.props.onHelpClick(e);
  }

  onChangeViewClick(e) {

    let formMode = this.props.formMode == 'list' ? 'card' : 'list';
    this.props.onChangeViewClick && this.props.onChangeViewClick(e, formMode);


  }

  onInfoClick(e) {
    this.debugLog('Info clicked.');
    let isMobile = Utils.isMobile(this.props);
    if (isMobile) {
      this.props.onInfoClick && this.props.onInfoClick();
    } else {
      let arrowVisibles = this.getArrowVisibles();
      arrowVisibles.info = true;
      this.props.onInfoClick && this.props.onInfoClick(e);
    }
  }

  onControlShowMenuPathClick(e) {
    this.debugLog('onControlShowMenuPathClick clicked.');
    this.props.onInfoClick && this.props.onControlShowMenuPathClick(e);
  }

  onAddToFavoritesClick(e) {
    this.debugLog('onAddToFavoritesClick clicked.');
    this.props.onAddToFavoritesClick && this.props.onAddToFavoritesClick(e);
  }

  onRankThisScreenClick(e) {
    this.debugLog('onRankThisScreenClick clicked.');
    this.props.onRankThisScreenClick && this.props.onRankThisScreenClick(e);
  }

  onMessageHistoryClick(e) {
    this.debugLog('onMessageHistoryClick clicked.');
    this.props.onRankThisScreenClick && this.props.onMessageHistoryClick(e);
  }

  onMyNotesClick(e) {
    this.debugLog('onMyNotesClick clicked.');
    this.props.onRankThisScreenClick && this.props.onMyNotesClick(e);
  }

  onEnterDemandOrSuggestionClick(e) {
    this.debugLog('onEnterDemandOrSuggestionClick clicked.');
    this.props.onRankThisScreenClick && this.props.onEnterDemandOrSuggestionClick(e);
  }

  onOpenINCClick(e) {
    this.debugLog('onOpenINCClick clicked.');
    this.props.onRankThisScreenClick && this.props.onOpenINCClick(e);
  }

  onOptionsClick(e) {
    this.debugLog('Options clicked.');
    this.props.onOptionsClick && this.props.onOptionsClick(e);
  }

  onCloseClick(e) {
    this.debugLog('Close clicked.');
    this.props.onCloseClick && this.props.onCloseClick(e);
  }

  /* Action States */
  isActionDisabled(action) {
    if (this.props.disableActionList && this.props.disableActionList.find(item => item.commandName == action.commandName)) return true;

    let disableKey = this.getCanActionExecuteKey(action);
    return !(action.items && action.items.length > 0) && !this.state[disableKey];
  }

  enableAction(commandName) {
    let disableKey = this.getCanActionExecuteKey({ commandName: commandName });
    return this.setState({ [disableKey]: true });
  }

  disableAction(commandName) {
    let disableKey = this.getCanActionExecuteKey({ commandName: commandName });
    return this.setState({ [disableKey]: false });
  }

  hideArrow() {
    // this.setState({arrowVisibles: false});
    let arrowVisible = this.getArrowVisibles();
    arrowVisible.info = false;
    arrowVisible.settings = false;
  }

  hideAction(commandName) {
    if (!this.state.resourceActionList) {
      return;
    }
    const { resourceActionList } = this.state;
    const commandAction = resourceActionList.filter(a => {
      return a.commandName == commandName;
    });
    if (commandAction.length > 0) {
      commandAction[0].isVirtual = true;
      this.forceUpdate();
    }
  }

  getCanActionExecuteKey(action) {
    return 'Can' + action.commandName + 'Execute';
  }

  isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
  }

  getIconColor(iconPath, disabled) {
    if (disabled) return this.props.context.theme.boaPalette.base250;

    switch (iconPath) {
      case 'Folder':
        return this.props.context.theme.boaPalette.more500;
      case 'Add':
      case 'ArrowUpward':
      case 'DocumentAdd':
      case 'Done':
      case 'FileDownload':
      case 'Refresh':
        return this.props.context.theme.boaPalette.success500;
      case 'ArrowDownward':
      case 'Delete':
      case 'DocumentRemove':
      case 'DoNotDisturbAlt':
      case 'Remove':
      case 'RemoveCircle':
      case 'Cancel':
        return this.props.context.theme.boaPalette.error500;
      case 'LockOpen':
        return this.props.context.theme.boaPalette.warning500;
      default:
        return this.props.context.theme.boaPalette.pri500;
    }
  }

  showMessage(dialogMessage, dialogType = BComponent.DialogType.INFO, dialogResponseStyle = BComponent.DialogResponseStyle.OK) {
    BDialogHelper.show(this.props.context, dialogMessage, dialogType, dialogResponseStyle);
  }

  addAction(action: any) {
    var temp = this.state.resourceActionList;
    if (action.length && action.length > 1) {
      temp = temp.concat(action);
      var keys=[];
      for (var i = 0; i < action.length; i++) {
        var key = this.getCanActionExecuteKey(action[i]);
        keys[key] = this.isActionDisabled(action[i]);

      }
      this.setState({ ...keys, resourceActionList: temp });

    }
    else {
      key = this.getCanActionExecuteKey(action);
      var val = this.isActionDisabled(action);
      temp.push(action);
      this.setState({
        [key]: val,
        resourceActionList: temp
      });
    }
  }
}

export class BActionManager extends ActionManagerBase {
  getResourceInfo() {
    let resourceInfo;
    if (this.props.page && this.props.page.state && this.props.page.state.pageParams && this.props.page.state.pageParams.resourceInfo) {
      resourceInfo = this.props.page.state.pageParams.resourceInfo;
    } else {
      resourceInfo = this.props.resourceInfo;
    }
    return resourceInfo;
  }
}

export default BActionManager;
