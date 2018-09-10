import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import { BComponent, Utils, BComponentComposer } from 'b-component';
import { BDialogHelper, BDialog } from 'b-dialog-box';
import { BActionManager } from 'b-action-manager';
import { BLoading } from 'b-loading';
import { BShowHidePanel } from 'b-show-hide-panel';
import { printDiv } from 'b-helpers';
import { BPopover } from 'b-popover';
import { BActionManagerInfo } from 'b-action-manager-info';
import BResizable from 'b-resizable-beta';
import { BMenuItem } from 'b-menu-item';
import { BButton } from 'b-button';
import { BDivider } from 'b-divider';

@BComponentComposer
export class BBaseForm extends BComponent {
  static propTypes = {

    ...BComponent.propTypes,
    /**
     * Resource definition of form.
     */
    resourceInfo: PropTypes.object.isRequired,
    /**
     * Form left resizedPane.
     */
    leftPaneContent: PropTypes.any,
    /**
     * Left resizedPane initial width.
     */
    leftPaneWidth: PropTypes.number,
    /**
     * Left resizedPane max width.
     */
    leftPaneMaxWidth: PropTypes.number,
    /**
 * Left resizedPane min width.
 */
    leftPaneMinWidth: PropTypes.number,
    /**
     * Right resizedPane initial width.
     */
    rightPaneWidth: PropTypes.number,
    /**
     * Right resizedPane max width.
     */
    rightPaneMaxWidth: PropTypes.number,
    /**
     * Right resizedPane min width.
     */
    rightPaneMinWidth: PropTypes.number,
    /**
     * Form right resizedPane.
     */
    rightPaneContent: PropTypes.any,
    /**
     * Callback function fired when any action clicked.
     */
    onActionClick: PropTypes.func,
    /**
     * Callback function fired when current form is closing.
     */
    onClosing: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Reference of page which used this form.
     */
    page: PropTypes.any,
    /**
     * Status of dialog opening. True when opened by BDialogHelper. Default false.
     */
    openedByDialog: PropTypes.bool,
    /**
     * Inject action manager view. Default BActionManager.
     */
    actionManager: PropTypes.any,
    /**
    * Set visibility action manager view. Default false
    */
    hideActionManager: PropTypes.bool,

    backMenuItemClick: PropTypes.func,

    formHeader: PropTypes.string,
    /*
     TransactionalInput = 0,
     TransactionalOutput = 1,
     TransactionalInputOutput = 2
    */
    formHeaderTransactionTypes: PropTypes.oneOf([1, 2, 3])

  };
  static defaultProps = {
    ...BComponent.defaultProps
  }

  constructor(props, context) {
    super(props, context);
    this.manageForm(props);

    this.openLeftPaneDialog = false;
    this.backMenuItemClick = this.backMenuItemClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.manageForm(nextProps, true);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
  }


  componentWillUpdate(prevProps, prevState) {
    super.componentWillUpdate(prevProps, prevState);
  }

  componentWillMount() {
    super.componentWillMount();
  }

  manageForm(props, update) {
    const isMobile = Utils.isMobile(props);
    if (update) {
      this.setState(this.getFormState(props));
    } else {
      this.state = this.getFormState(props);
    }

    this.enableLeftDefault = { top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false };
    this.enableRightDefault = { top: false, right: false, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false };

    if (isMobile) {
      this.showLeftPane = false;
    } else {
      this.showLeftPane = true;
    }
  }

  getFormState(props) {
    const isMobile = Utils.isMobile(props);
    return {
      mainContentStyle: {
        position: 'absolute',
        left: (!props.context.localization.isRightToLeft && !isMobile) ? (props.leftPaneContent ? (!isMobile ? props.leftPaneWidth : 0) : 0) : (props.rightPaneContent ? (!isMobile ? props.rightPaneWidth : 0) : 0),
        right: !props.context.localization.isRightToLeft ? (props.rightPaneContent ? (!isMobile ? props.rightPaneWidth : 0) : 0) : (props.leftPaneContent ? (!isMobile ? props.leftPaneWidth : 0) : 0),
        top: 0,
        bottom: 0,
        borderColor: this.props.context.theme.boaPalette.base200,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTop: 0,
        borderBottom: 0,
        borderStyle: 'solid'
      },
      leftPaneExpanded: !isMobile,
      rightPaneExpanded: !isMobile,
      leftPaneWidth: props.leftPaneWidth,
      leftPaneActualWidth: props.leftPaneWidth, // !isMobile ? this.props.leftPaneWidth : 48,
      rightPaneWidth: props.rightPaneWidth,
      rightPaneActualWidth: props.rightPaneWidth, // !isMobile ? this.props.rightPaneWidth : 48,
      disabled: props.disabled
    };
  }

  setDisable(disabled) {
    this.setState({ disabled: disabled });
  }

  disableAction(commandName) {
    this.actionManager && this.actionManager.disableAction(commandName);
  }

  enableAction(commandName) {
    this.actionManager && this.actionManager.enableAction(commandName);
  }

  addAction(action:any) {
    this.actionManager && this.actionManager.addAction(action);
  }

  leftPaneIconClick() {
    this.openLeftPaneDialog = true;
    this.leftPaneDialogRef.getInstance().open(true);
    if (this.actionManager) {

      var actionList = null;
      var disableActionList = null;
      if (this.props.page && this.props.page.snaps.actionManager) {
        actionList = this.props.page.snaps.actionManager.getActionList();
        disableActionList = actionList.filter(u => this.props.page.snaps.actionManager.isActionDisabled(u));
      }
      else {
        actionList = this.actionManager.getActionList();
        disableActionList = actionList.filter(u => this.actionManager.isActionDisabled(u));
      }
      const { ...otherProps } = this.actionManager.props;

      var getInfoCommand = this.actionManager.props.resourceInfo.resourceActionList.find(u => u.actionId == 11);

      var props = Object.assign(otherProps, {
        actionsOnlyMode: true,
        filterCommandNameList: [getInfoCommand ? getInfoCommand.commandName : 'GetInfo', 'Clean'],
        disableActionList: disableActionList
      });

      this.criteriaActionManager = (<BActionManager {...props} onActionClick={(e, callBack) => {
        this.props.page && this.props.page.onPageActionClick(e, callBack);
        this.onActionClick(e, callBack);
      }} />);
      this.forceUpdate();
    }
  }

  leftPaneDialogCloseClick() {
    this.openLeftPaneDialog = false;
    this.leftPaneDialogRef.getInstance().open(false);
  }

  getLeftPaneDialog(content) {
    var customContentStyle = {
      maxWidth: 'none',
      height: '100vh',
      width: '100vw'
    };
    var customBodyStyle = {
      padding: 0,
      height: '100%'
    };


    return (
      <div>
        <div style={{ display: 'none' }}>{content}</div>
        <BDialog
          context={this.props.context}
          ref={r => this.leftPaneDialogRef = r}
          open={this.openLeftPaneDialog}
          // resourceCode={resourceCode}
          modal={true}
          // actions={actions}
          autoScrollBodyContent={false}
          onRequestClose={this.leftPaneDialogCloseClick.bind(this)}
          contentStyle={customContentStyle}
          bodyStyle={customBodyStyle}
          titleWithCloseButtonEnabled={true}
          title={this.getMessage('BusinessComponents', 'Criterias')}
          titleStyle={{ backgroundColor: this.props.context.theme.boaPalette.base300 }}
          style={{ height: '100%' }}>
          {content}
          {this.criteriaActionManager}
        </BDialog>
      </div>
    );
  }

  render() {
    let isRightToLeft = this.props.context.localization.isRightToLeft;
    let popoverStyle = {};
    let headerIcon = <div style={{position:'sticky', top:'0px', zIndex: '1'}}></div>;
    let anchorOrigin = {};
    let transformOrigin = {};
    let heightPopover = document.body.scrollHeight - 84 + 'px';
    let maxHeight = heightPopover - 500 +'px';
    let marginTop;
    if (process.env.NODE_ENV==='production' ) { marginTop = '6px'; }
    else { marginTop = '101px';  }
    const popoverDesktopStyle = {
      top: marginTop,
      height: heightPopover,
      maxheight:maxHeight,
      zIndex: 10000
    };
    const popoverMobileStyle = {
      maxWidth: '100%',
      zIndex: 10000
    };
    if (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM) {
      popoverStyle = popoverDesktopStyle;
      anchorOrigin = { horizontal: !isRightToLeft ? 'left' : 'right', vertical: 'bottom' };
      transformOrigin = { horizontal: 'center', vertical: 'bottom' };
    }
    else {
      popoverStyle = popoverMobileStyle;
      transformOrigin = { horizontal: !isRightToLeft ? 'right' : 'left', vertical: 'top' };
      headerIcon = <div  style={{position:'sticky', top:'0px', zIndex: '1', backgroundColor: this.props.context.theme.boaPalette.comp500}}>
        <BMenuItem
          primaryText={this.getMessage('BOAOne', 'DisplayInformation')}
          primaryTextPadding = { isRightToLeft ? '0px 16px 0px 24px' : '0px 24px 0px 16px' }
          itemSelected={this.backMenuItemClick}
          context={this.props.context}
          leftIcon={isRightToLeft ?
            <BButton context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 4px 0 0', padding: '0px' }}
              onClick={()=> this.setState({openInfoMenu:null})}
              dynamicIcon='Close' />
            :
            <BButton context={this.props.context}
              type='icon'
              iconProperties={{ color: 'grey' }}
              style={{ margin: '0 0 0 4px', padding: '0px' }}
              onClick={()=> this.setState({openInfoMenu:null})}
              dynamicIcon='ArrowBack' />
          }
        />
        <BDivider context={this.props.context} style={{ margin: 0 }} />
      </div>;
    }
    var clonedActionManager = this.props.actionManager && React.cloneElement(
      this.props.actionManager,
      {
        showLeftPaneButton: Utils.isMobile(this.props) && this.props.leftPaneContent,
        leftPaneIconClick: this.leftPaneIconClick.bind(this)
      }
    );

    this.actionManager = clonedActionManager || (
      <BActionManager
        ref={(r) => this.actionManager = r}
        onCloseClick={this.onClosing.bind(this)}
        showLeftPaneButton={Utils.isMobile(this.props) && this.props.leftPaneContent}
        leftPaneIconClick={this.leftPaneIconClick.bind(this)}
        {...this.props}
        onInfoClick={this.onInfoClick.bind(this)}
        onActionClick={this.onActionClick.bind(this)} />
    );
    var divStyle = {
      width: '100%',
      height: '100%',
      position: 'relative'
    };
    divStyle = merge(divStyle, this.props.style ? this.props.style : {});

    let baseForm = {
      backgroundColor: this.props.context.theme.boaPalette.base100,
      borderColor: this.props.context.theme.boaPalette.base200,
      borderLeftWidth: 1,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      width: '100%',
      height: '100%'
    };

    var contentStyle = {};
    contentStyle = merge(contentStyle, baseForm);

    let leftStyle;
    let rightStyle;
    if (!this.props.context.localization.isRightToLeft) {
      leftStyle = {
        left: 0,
        height: '100%',
        position: 'absolute',
        zIndex: 10
      };
      rightStyle = {
        right: 0,
        height: '100%',
        position: 'absolute',
        zIndex: 10
      };
    }
    else {
      leftStyle = {
        right: 0,
        height: '100%',
        position: 'absolute',
        zIndex: 10
      };
      rightStyle = {
        left: 0,
        height: '100%',
        position: 'absolute',
        zIndex: 10
      };
    }

    const leftPaneContentStyle = {
      height: '100%',
      width: '100%',
      position: 'relative'
    };
    const rightPaneContentStyle = {
      height: '100%',
      width: '100%',
      position: 'relative',
      backgroundColor: this.props.context.theme.boaPalette.base100
    };

    /* ActionBar altından başlayan content alanı içindir. */
    const middleContentStyle = {
      left: 0,
      right: 0,
      top: this.props.hideActionManager ? 0 : 40,
      bottom: 0,
      position: 'absolute'
    };
    let leftContent;
    if (this.props.leftPaneContent) {
      let _leftContent = Utils.isMobile(this.props) ? this.props.leftPaneContent : (
        <div style={leftStyle}>
          <BResizable
            context={this.props.context}
            ref={r => this.leftResizable = r}
            bounds='parent'
            minWidth={this.state.leftPaneExpanded ? this.props.leftPaneMinWidth : 48}
            maxWidth={this.state.leftPaneExpanded ? this.props.leftPaneMaxWidth : 48}
            default={{ x: 0, y: 0, width: this.state.leftPaneActualWidth, height: '100%' }}
            enable={this.enableLeftDefault}
            onResize={this.onResize.bind(this, 'left')}>
            <div style={leftPaneContentStyle}>{this.props.leftPaneContent}</div>
          </BResizable>
        </div>
      );

      if (_leftContent) {
        if (this.state && (this.state.disabled == true || this.state.disabled == false)) {
          leftContent = BComponent.Utils.getFormChildren(_leftContent, this.state.disabled);
        }
        else {
          leftContent = _leftContent;
        }
      }
    }


    let rightContent;
    if (this.props.rightPaneContent) {
      let _rightContent = Utils.isMobile(this.props) ? this.props.rightPaneContent : (
        <div style={rightStyle}>
          <BResizable
            context={this.props.context}
            ref={r => this.rightResizable = r}
            bounds='parent'
            minWidth={this.state.rightPaneExpanded ? this.props.rightPaneMinWidth : 48}
            maxWidth={this.state.rightPaneExpanded ? this.props.rightPaneMaxWidth : 48}
            default={{ x: 0, y: 0, width: this.state.rightPaneActualWidth, height: '100%' }}
            enable={this.enableRightDefault}
            onResize={this.onResize.bind(this, 'right')}>
            <div style={rightPaneContentStyle}>{this.props.rightPaneContent}</div>
          </BResizable>
        </div>
      );

      if (_rightContent) {
        if (this.state && (this.state.disabled == true || this.state.disabled == false)) {
          rightContent = BComponent.Utils.getFormChildren(_rightContent, this.state.disabled);
        }
        else {
          rightContent = _rightContent;
        }
      }
    }
    const progress = <BShowHidePanel ref={(r) => this.progressPanel = r}>
      <BLoading context={this.props.context} />
    </BShowHidePanel>;
    let childs = null;
    if (this.props && this.props.children) {
      if (this.state && (this.state.disabled == true || this.state.disabled == false)) {
        childs = BComponent.Utils.getFormChildren(this.props.children, this.state.disabled);
      }
      else {
        childs = this.props.children;
      }
    }

    var leftContentView = this.showLeftPane ? leftContent : this.getLeftPaneDialog(leftContent);
    var rightContentView = rightContent; // todo right pane not ready

    return (
      <div style={divStyle}>
        {!this.props.context.localization.isRightToLeft ? leftContentView : rightContentView}
        <div ref={r => this.mainContent = r} style={this.state.mainContentStyle}>
          {!this.props.hideActionManager && this.actionManager}
          <BPopover
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
              anchorOrigin={anchorOrigin}
              context={this.props.context}
              anchorEl={!Utils.isMobile(this.props) && this.state.openInfoMenu}
              open={this.state.openInfoMenu}
              style={popoverStyle}
              isOriginSetted={true}
              transformOrigin={transformOrigin}
              onRequestClose={()=> {
                this.setState({openInfoMenu:null, });
                this.actionManager.hideArrow();
              }}>
            {headerIcon}
            <BActionManagerInfo context={this.props.context} resourceInfo={this.props.resourceInfo} />
          </BPopover>

          <div ref={r => this.mainContentWithoutActionManager = r} style={middleContentStyle}>
            <div style={contentStyle}>
              {childs}
            </div>
          </div>
        </div>
        {!this.props.context.localization.isRightToLeft ? rightContentView : leftContentView}
        {progress}
      </div>
    );
  }
  backMenuItemClick(parameters) {
    this.debugLog(parameters);
  }
  showProgress() {
    if (this.progressPanel)
      this.progressPanel.getInstance().show();
    else if (this.baseForm &&  this.baseForm.progressPanel )
      this.baseForm.progressPanel.getInstance().show();

  }

  hideProgress() {

    if (this.progressPanel)
      this.progressPanel.getInstance().hide();
    else if (this.baseForm &&  this.baseForm.progressPanel )
      this.baseForm.progressPanel.getInstance().hide();
  }

  updateMainContentStyle(width, resizedPane) {
    var element = ReactDOM.findDOMNode(this.mainContent);
    element.style.position = 'absolute';
    element.style.left = resizedPane === 'left' ? width + 'px' : element.style.left;
    element.style.right = resizedPane === 'right' ? width + 'px' : element.style.right;
    element.style.top = '0px';
    element.style.bottom = '0px';
  }

  updateLeftPane(isExpanded) {
    const isMobile = Utils.isMobile(this.props);
    this.leftResizable.getInstance().updateSize({ width: isExpanded ? this.state.leftPaneWidth : 48 });
    if (isExpanded) {
      this.leftResizable.getInstance().setEnabled(this.enableLeftDefault);
    } else {
      this.leftResizable.getInstance().setEnabled(isExpanded);
    }

    var element = ReactDOM.findDOMNode(this.mainContent);
    if (!this.props.context.localization.isRightToLeft) {
      element.style.position = 'absolute';
      element.style.left = isExpanded ? this.state.leftPaneWidth + 'px' : isMobile ? '0px' : '48px';
      element.style.right = this.state.mainContentStyle.right + 'px';
      element.style.top = '0px';
      element.style.bottom = '0px';
    }
    else {
      element.style.position = 'absolute';
      element.style.left = this.state.mainContentStyle.left + 'px';
      element.style.right = isExpanded ? this.state.leftPaneWidth + 'px' : isMobile ? '0px' : '48px';
      element.style.top = '0px';
      element.style.bottom = '0px';
    }
  }

  updateRightPane(isExpanded) {
    const isMobile = Utils.isMobile(this.props);
    this.rightResizable.getInstance().updateSize({ width: isExpanded ? this.state.leftPaneWidth : 48 });
    if (isExpanded) {
      this.rightResizable.getInstance().setEnabled(this.enableRightDefault);
    } else {
      this.rightResizable.getInstance().setEnabled(isExpanded);
    }

    var element = ReactDOM.findDOMNode(this.mainContent);
    if (!this.props.context.localization.isRightToLeft) {
      element.style.position = 'absolute';
      element.style.right = isExpanded ? this.state.rightPaneWidth + 'px' : isMobile ? '0px' : '48px';
      element.style.left = this.state.mainContentStyle.left + 'px';
      element.style.top = '0px';
      element.style.bottom = '0px';
    }
    else {
      element.style.position = 'absolute';
      element.style.left = isExpanded ? this.state.rightPaneWidth + 'px' : isMobile ? '0px' : '48px';
      element.style.right = this.state.mainContentStyle.right + 'px';
      element.style.top = '0px';
      element.style.bottom = '0px';
    }
  }

  onClosing(e) {
    this.props.onClosing && this.props.onClosing(e);
  }
  timer = null;
  onInfoClick(e) {
    const isMobile = Utils.isMobile(this.props);
    if (isMobile) {
      this.setState({ openInfoMenu: [] });
    }
    else {
      this.setState({ openInfoMenu: e.currentTarget });
    }

  }

  onActionClick(e, callBack) {
    this.debugLog(e.commandName + ' command clicked.');

    //  if (e.actionId == 11) {
    this.openLeftPaneDialog = false;
    this.leftPaneDialogRef && this.leftPaneDialogRef.getInstance().open(false);
    // }

    if (this.props.onActionClick) {
      return this.props.onActionClick(e, callBack);
    }
  }

  onResize(resizedPane, direction, styleSize, clientSize) {
    this.updateMainContentStyle(clientSize.width, resizedPane);
  }

  close(dialogResponse = BComponent.DialogResponse.CANCEL, returnValue) {
    this.onClosing(dialogResponse, returnValue);
    this.props.inDialog && BDialogHelper.close(this.props.context, dialogResponse, returnValue);
  }

  printContent() {
    var element = ReactDOM.findDOMNode(this.mainContentWithoutActionManager);
    element && printDiv(element.innerHTML);
  }
}

export default BBaseForm;
