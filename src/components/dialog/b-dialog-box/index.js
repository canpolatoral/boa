import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { getMessage } from 'b-messaging';
import { BComponent, BComponentComposer, BAppProvider } from 'b-component';
import { BButton } from 'b-button';
import { BIcon } from 'b-icon';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

@BComponentComposer
export class BDialog extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
     * Dialog children, usually the included sub-components.
     */
    children: PropTypes.node.isRequired,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * If `true`, clicking the backdrop will not fire the `onClose` callback.
     */
    disableBackdropClick: PropTypes.bool,
    /**
     * If `true`, hitting escape will not fire the `onClose` callback.
     */
    disableEscapeKeyDown: PropTypes.bool,
    /**
     * If `true`, it will be full-screen
     */
    fullScreen: PropTypes.bool,
    /**
     * If specified, stretches dialog to max width.
     */
    fullWidth: PropTypes.bool,
    /**
     * Determine the max width of the dialog.
     * The dialog width grows with the size of the screen, this property is useful
     * on the desktop where you might need some coherent different width size across your
     * application. Set to `false` to disable `maxWidth`.
     */
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', false]),
    /**
     * Callback fired when the backdrop is clicked.
     */
    onBackdropClick: PropTypes.func,
    /**
     * Callback fired when the component requests to be closed.
     *
     * @param {object} event The event source of the callback
     */
    onClose: PropTypes.func,
    /**
     * Callback fired before the dialog enters.
     */
    onEnter: PropTypes.func,
    /**
     * Callback fired when the dialog has entered.
     */
    onEntered: PropTypes.func,
    /**
     * Callback fired when the dialog is entering.
     */
    onEntering: PropTypes.func,
    /**
     * Callback fired when the escape key is pressed,
     * `disableKeyboard` is false and the modal is in focus.
     */
    onEscapeKeyDown: PropTypes.func,
    /**
     * Callback fired before the dialog exits.
     */
    onExit: PropTypes.func,
    /**
     * Callback fired when the dialog has exited.
     */
    onExited: PropTypes.func,
    /**
     * Callback fired when the dialog is exiting.
     */
    onExiting: PropTypes.func,
    /**
     * If `true`, the Dialog is open.
     */
    open: PropTypes.bool.isRequired,
    /**
     * Properties applied to the `Paper` element.
     */
    PaperProps: PropTypes.object,
    /**
     * Transition component.
     */
    transition: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     */
    transitionDuration: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number })]),
    titleWithCloseButtonEnabled: PropTypes.bool,

    autoDetectWindowHeight: PropTypes.bool,

    // autoScrollBodyContent: PropTypes.bool,

    repositionOnUpdate: PropTypes.bool,

    content: PropTypes.any,

    style: PropTypes.object,

    titleBackgroundColor: PropTypes.string,
    /**
     * If true, the modal will not restore focus to previously focused element once modal is hidden. (input bileşeninin focusunda açıyorsanız can kurtarır!)
     */
    disableRestoreFocus: PropTypes.bool,

    showHeader: PropTypes.bool,

    dialogBoxContentPadding: PropTypes.any
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    fullScreen: false,
    fullWidth: false,
    disableBackdropClick: false,
    disableEscapeKeyDown: false,
    titleWithCloseButtonEnabled: false,
    autoDetectWindowHeight: true,
    // autoScrollBodyContent: false,
    modal: false,
    repositionOnUpdate: true,
    showHeader: true,
    dialogBoxContentPadding: '24px'
  };

  state = {
    open: this.props.open,
    title: this.props.title
  };

  constructor(props, context) {
    super(props, context);
    this.open = this.open.bind(this);
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ ...value });
  }

  componentWillReceiveProps(nextProps) {
    let { open, title } = nextProps;
    this.setState({ open, title });
  }

  componentWillMount() {
    super.componentWillMount();
  }

  setTitle(title) {
    this.setState({ title, noBackgroudChange: true });
  }

  setLeftTitleButton(value) {
    this.setState({ leftTitleButton: value });
  }

  onCloseClicked() {
    this.props.onRequestClose && this.props.onRequestClose();
  }

  open(open) {
    this.setState({ open }, () => {
      if (open == false) this.props.dialogKey && BDialogHelper.clearRefs(this.props.dialogKey);
    });
  }

  fireClosable() {
    return this.props.onClosing && this.props.onClosing(this, BDialogHelper.getContentRef(this.props.dialogKey));
  }

  getIcon(type, context) {
    const iconStyle = { width: '48px', height: '48px' };
    switch (type) {
      case BComponent.DialogType.INFO: {
        const icon = {
          dynamicIcon: 'Info',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.warning500 }
          }
        };
        return BIcon.getIcon(icon);
      }
      case BComponent.DialogType.QUESTION: {
        const icon = {
          dynamicIcon: 'Help',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.info500 }
          }
        };
        return BIcon.getIcon(icon);
      }
      case BComponent.DialogType.WARNING: {
        const icon = {
          dynamicIcon: 'Error',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.warning500 }
          }
        };
        return BIcon.getIcon(icon);
      }
      case BComponent.DialogType.ERROR: {
        const icon = {
          dynamicIcon: 'Error',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.warning500 }
          }
        };
        return BIcon.getIcon(icon);
      }
      case BComponent.DialogType.SUCCESS: {
        const icon = {
          dynamicIcon: 'CheckCircle',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.success500 }
          }
        };
        return BIcon.getIcon(icon);
      }
    }
  }

  prepareDialog() {
    let { context, content, children, dialogType, dialogKey, style, dialogRefs, titleWithCloseButtonEnabled, showHeader } = this.props;
    let contentProps;
    let customContentStyle = {};
    // let customBodyStyle = {};
    // let titleWithCloseButtonEnabled = false;
    let fullScreen = false;
    let dialogContent;
    let dialogSubContent = [];
    // let autoScrollBodyContent = false;
    let dialog = {};
    let isObject = false;

    const headerStyle = {
      boxSizing: 'border-box',
      width: '100%',
      fontSize: '16px',
      color: context.theme.boaPalette.base450,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'transparent'
    };

    Object.assign(headerStyle, this.props.context.localization.isRightToLeft ? { marginLeft: '24px' } : { marginRight: '24px' });

    /* eslint-disable no-console  */
    if (!children) {
      if (!content) {
        dialogContent = '';
        console.log('Dialog: ' + content);
      } else if (
        typeof content == 'string' ||
        content instanceof Array ||
        (content instanceof Object && content.mainContent !== undefined)
      ) {
        if (content instanceof Array) {
          // autoScrollBodyContent = true;

          dialogContent = '';
          content.forEach(item => {
            dialogContent += item + '<br />';
          });
          dialogContent = dialogContent.replace('\n', '<br />');
        } else if (content instanceof Object) {
          isObject = true;
          // autoScrollBodyContent = true;
          dialogContent = [];
          dialogContent.push(
            <div id="dialogHeader" style={headerStyle}>
              {content.mainContent}
            </div>
          );

          let subObj = [];
          let subObjStyle = {
            overflow: 'auto',
            height: '60vh',
            paddingLeft: '98px',
            paddingBottom: '24px'
          };
          Object.assign(
            subObjStyle,
            this.props.context.localization.isRightToLeft
              ? { paddingLeft: '24px', paddingRight: '98px', direction: 'rtl' }
              : { direction: 'ltr' }
          );
          Object.assign(
            subObjStyle,
            this.props.context.deviceSize <= BComponent.Sizes.SMALL ? { paddingLeft: '24px', paddingRight: '24px' } : {}
          );

          content.subcontents.forEach(item => {
            subObj.push(<div style={{ marginTop: '24px', fontSize: '11px', color: context.theme.boaPalette.base400 }}>{item.header}</div>);
            item.contents.forEach(i => {
              subObj.push(<div style={{ fontSize: '13px', color: context.theme.boaPalette.base450 }}>{i}</div>);
            });
          });

          dialogSubContent.push(
            <div
              id="scrollDiv"
              onScroll={event => {
                let scrollDivStyle = document.getElementById('scrollDiv').style;
                let headerDivStyle = document.getElementById('dialogHeader').style;

                if (event.target.scrollTop > 0) {
                  scrollDivStyle.borderTopColor = context.theme.boaPalette.base200;
                  scrollDivStyle.borderTopStyle = 'solid';
                  scrollDivStyle.borderTopWidth = '1px';
                  headerDivStyle.borderBottomWidth = '1px';
                  headerDivStyle.borderBottomStyle = 'solid';
                  headerDivStyle.borderBottomColor = 'transparent';
                } else {
                  scrollDivStyle.borderTopColor = 'transparent';
                }
              }}
              style={subObjStyle}
            >
              {subObj}
            </div>
          );
        } else {
          if (typeof content == 'string' && content.includes('\n')) {
            let text = content.replace(/\n/gi, '#00100#');
            let textArray = text.split('#00100#');
            dialogContent = '';
            textArray.forEach(item => {
              dialogContent += item + '<br />';
            });
            dialogContent = dialogContent.replace('\n', '<br />');
          } else {
            dialogContent = BComponent.Utils.getShowStatusMessageReplacedText(content);
          }
        }
        // console.log('Dialog: ' + dialogContent);
      } else {
        contentProps = {
          inDialog: true,
          dialogKey: dialogKey,
          ref: r => {
            if (dialogRefs[dialogKey]) dialogRefs[dialogKey].contentRef = r;
          }
        };
        // console.log('Dialog: ' + typeof content);
        if (content.type.prototype && content.type.prototype.isReactComponent) {
          dialogContent = React.cloneElement(content, contentProps);
        } else {
          dialogContent = content;
        }
        customContentStyle = {
          maxWidth: 'none',
          height: '90vh',
          width: '90vw',
          overflow: 'hidden'
        };

        if (style && style.height && typeof style.height === 'string' && style.height.includes('%'))
          style.height = style.height.replace('%', 'vh');
        if (style && style.width && typeof style.width === 'string' && style.width.includes('%'))
          style.width = style.width && style.width.replace('%', 'vw');

        customContentStyle = Object.assign({}, customContentStyle, style);
        titleWithCloseButtonEnabled = showHeader;
      }
    } else {
      dialogContent = children;
    }
    /* eslint-enable no-console */

    let dIcon = this.getIcon(dialogType, context);

    if (titleWithCloseButtonEnabled) {
      if (customContentStyle.width > window.innerWidth) {
        customContentStyle.width = '100vw';
      }
      if (customContentStyle.height > window.innerHeight) {
        customContentStyle.height = '100vh';
      }

      // mobilse her durumda dialoglar fullscreen açılsın
      if (context.deviceSize <= BComponent.Sizes.SMALL) {
        customContentStyle = Object.assign(customContentStyle, { height: '100vh', width: '100vw' });
        fullScreen = true;
      }
    } else {
      customContentStyle = Object.assign(customContentStyle, { margin: '8px' }, style);
    }

    dialog = {
      dialogContent: dialogContent,
      children: children,
      icon: dIcon,
      subContent: dialogSubContent,
      isObject: isObject,
      titleWithCloseButtonEnabled: titleWithCloseButtonEnabled,
      customContentStyle: customContentStyle,
      fullScreen: fullScreen,
      contentProps: contentProps
    };
    return dialog;
  }

  onEnter() {
    let scrollDiv = document.getElementById('scrollDiv');
    if (scrollDiv != null) {
      if (scrollDiv.offsetHeight < scrollDiv.scrollHeight) {
        scrollDiv.style.borderBottomColor = this.props.context.theme.boaPalette.base200;
        scrollDiv.style.borderBottomStyle = 'solid';
        scrollDiv.style.borderBottomWidth = '1px';
      } else {
        scrollDiv.style.borderBottomColor = 'transparent';
      }
    }
  }

  render() {
    // this.prepareTitleWithCloseButton(this.state.title);
    const { leftTitleButton, title } = this.state;

    let dialog = this.prepareDialog();

    // let children;

    dialog.titleWithCloseButtonEnabled
      ? !dialog.contentProps
        ? dialog.dialogContent
        : React.cloneElement(dialog.dialogContent, dialog.contentProps)
      : {};
    let titleBackgroundColor = this.props.titleBackgroundColor
      ? this.props.titleBackgroundColor
      : Object.keys(BDialogHelper.dialogRefs).length >= 1
        ? this.props.context.theme.boaPalette.base300
        : this.props.context.theme.boaPalette.pri500;

    let objLine = {
      height: '1px',
      borderBottomColor: this.props.context.theme.boaPalette.base200,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      marginBottom: '-1px'
    };
    Object.assign(
      objLine,
      this.props.context.localization.isRightToLeft
        ? { marginLeft: '24px', marginRight: '96px' }
        : { marginLeft: '96px', marginRight: '24px' }
    );
    Object.assign(objLine, this.props.context.deviceSize <= BComponent.Sizes.SMALL ? { marginRight: '24px', marginLeft: '24px' } : {});

    let closeButtonStyle = { top: 0, right: 0 };
    Object.assign(closeButtonStyle, this.props.context.localization.isRightToLeft ? { paddingLeft: '12px' } : { paddingRight: '12px' });
    if (this.props.context.deviceSize <= BComponent.Sizes.SMALL) {
      Object.assign(closeButtonStyle, this.props.context.localization.isRightToLeft ? { paddingLeft: '4px' } : { paddingRight: '4px' });
    }

    let titleStyle = { flex: 1, paddingTop: '9px' };
    if (this.props.context.deviceSize <= BComponent.Sizes.SMALL) {
      Object.assign(
        titleStyle,
        this.props.context.localization.isRightToLeft
          ? !leftTitleButton && { paddingRight: '44px' }
          : !leftTitleButton && { paddingLeft: '44px' }
      );
    } else {
      Object.assign(titleStyle, this.props.context.localization.isRightToLeft ? { paddingRight: '60px' } : { paddingLeft: '60px' });
    }
    let dialogFormStyle = {
      boxSizing: 'border-box',
      width: '100%',
      fontSize: '16px',
      textAlign: 'center',
      color: this.props.context.theme.boaPalette.comp500,
      background: titleBackgroundColor,
      padding: '0px',
      display: 'flex',
      direction: this.props.context.localization.isRightToLeft ? 'rtl' : 'ltr'
    };

    let dialogForm = this.props.showHeader ? (
      <DialogTitle disableTypography={true} style={dialogFormStyle}>
        {leftTitleButton && <div>{leftTitleButton}</div>}
        <div style={titleStyle}>{title}</div>
        <div style={closeButtonStyle}>
          <BButton
            context={this.props.context}
            type="icon"
            style={{ width: '40px', height: '40px' }}
            dynamicIcon={'Close'}
            iconProperties={{ nativeColor: this.props.context.theme.boaPalette.comp500 }}
            onClick={this.onCloseClicked.bind(this)}
          />
        </div>
      </DialogTitle>
    ) : null;

    let dialogBoxContent = this.props.style ? (
      <DialogContent style={this.props.style}>{dialog.dialogContent}</DialogContent>
    ) :
      (
        <DialogContent style={{ padding: '0px', overflow: 'hidden' }}>
          <div>
            <div
              style={{
                display: 'flex',
                // alignItems: 'center',
                padding: '0px',
                minHeight: '96px',
                fontSize: '16px',
                direction: this.props.context.localization.isRightToLeft ? 'rtl' : 'ltr'
              }}
            >
              {this.props.context.deviceSize > BComponent.Sizes.SMALL && (
                <div
                  style={
                    this.props.context.localization.isRightToLeft
                      ? { paddingTop: '24px', paddingRight: '24px' }
                      : { paddingTop: '24px', paddingLeft: '24px' }
                  }
                >
                  {dialog.icon}
                </div>
              )}
              <div style={{ padding: this.props.dialogBoxContentPadding, display: 'flex', alignItems: 'center' }}>
                {this.props.content instanceof Array || (typeof this.props.content == 'string' && typeof dialog.dialogContent == 'string' && dialog.dialogContent.includes('<br />')) ? (
                  <span dangerouslySetInnerHTML={{ __html: dialog.dialogContent }} />
                ) : (
                    dialog.dialogContent
                  )}
              </div>
            </div>
            <div style={objLine} />
            {dialog.subContent}
          </div>
        </DialogContent>
      );

    return (
      <Dialog
        fullScreen={dialog.fullScreen}
        fullWidth={this.props.fullWidth}
        open={this.state.open}
        onClose={this.props.onRequestClose}
        PaperProps={{ style: dialog.customContentStyle }}
        onEntered={this.onEnter.bind(this)}
        onExiting={this.props.onClosing ? this.fireClosable.bind(this) : undefined}
        contentProps={dialog.contentProps}
        disableRestoreFocus={this.props.disableRestoreFocus}
      >
        {dialog.titleWithCloseButtonEnabled && dialogForm}
        {dialog.titleWithCloseButtonEnabled ? dialog.dialogContent : dialogBoxContent}
        {!dialog.titleWithCloseButtonEnabled ? this.props.actions && <DialogActions>{this.props.actions}</DialogActions> : null}
      </Dialog>
    );

    // return (
    //   <Dialog
    //     actions={this.props.actions}
    //     actionsContainerClassName={this.props.actionsContainerClassName}
    //     actionsContainerStyle={this.props.actionsContainerStyle}
    //     autoDetectWindowHeight={this.props.autoDetectWindowHeight}
    //     autoScrollBodyContent={this.props.autoScrollBodyContent}
    //     bodyClassName={this.props.bodyClassName}
    //     bodyStyle={this.props.bodyStyle}
    //     children={children}
    //     className={this.props.className}
    //     contentClassName={this.props.contentClassName}
    //     contentStyle={this.props.contentStyle}
    //     modal={this.props.modal}
    //     onRequestClose={this.props.onRequestClose}
    //     open={this.state.open}
    //     overlayClassName={this.props.overlayClassName}
    //     overlayStyle={this.props.overlayStyle}
    //     repositionOnUpdate={this.props.repositionOnUpdate}
    //     style={this.props.style}
    //     title={this.title}
    //     titleClassName={this.props.titleClassName}
    //     titleStyle={this.titleStyle}
    //     onClosing={this.props.onClosing ? this.fireClosable.bind(this) : null}
    //   />
    // );
  }
}

export default BDialog;

export function BDialogComposer(WrappedComponent) {
  return class IIBDialog extends WrappedComponent {
    render() {
      const renderContent = super.render().props.children;
      return <BDialog {...this.props}>{renderContent}</BDialog>;
    }
  };
}

export class BDialogHelper {
  static dialogCounter = 0;

  static dialogDivs = {};
  static dialogRefs = {};

  /** internal methods **/
  static getContentRef(key) {
    return this.dialogRefs[key].contentRef;
  }

  /** internal methods **/
  static clearRefs(key) {
    let idleDialogDiv = this.dialogDivs[key];
    delete this.dialogRefs[key];
    delete this.dialogDivs[key];
    ReactDOM.unmountComponentAtNode(idleDialogDiv);
    document.body.removeChild(idleDialogDiv);
  }

  static staticConstructor() {
    this.onClose = this.onClose.bind(this);
  }

  static show(
    context,
    content,
    dialogType = BComponent.DialogType.INFO,
    dialogResponseStyle = BComponent.DialogResponseStyle.OK,
    title,
    onClose,
    style,
    onClosing,
    showHeader = true
  ) {
    let thisRef;
    let dialogContentRef;
    let actions = [];
    const dialogKey = 'dialogKey_' + this.dialogCounter++;

    const createAction = (context, text, type, focus) => {
      return (
        <BButton
          context={context}
          style={{
            color: context.theme.boaPalette.pri500,
            fontWeight: 'bold',
            fontSize: '13px'
          }}
          type="flat"
          text={getMessage('BOA', text, context.language)}
          keyboardFocused={focus}
          tag={type}
          onClick={this.onClose.bind(this, type)}
        />
      );
    };

    // DialogBox için aksiyonların oluşturulması
    if (
      content &&
      (typeof content == 'string' ||
        content instanceof Array ||
        ((content instanceof Object && content.mainContent !== undefined) || dialogResponseStyle != null))
    ) {
      if (dialogResponseStyle == BComponent.DialogResponseStyle.OK) {
        actions.push(createAction(context, 'Ok', BComponent.DialogResponse.OK, true));
      } else if (dialogResponseStyle == BComponent.DialogResponseStyle.YESCANCEL) {
        actions.push(createAction(context, 'Yes', BComponent.DialogResponse.YES, true));
        actions.push(createAction(context, 'Cancel', BComponent.DialogResponse.CANCEL, false));
      } else if (dialogResponseStyle == BComponent.DialogResponseStyle.YESNO) {
        actions.push(createAction(context, 'Yes', BComponent.DialogResponse.YES, true));
        actions.push(createAction(context, 'No', BComponent.DialogResponse.NO, false));
      } else if (dialogResponseStyle == BComponent.DialogResponseStyle.YESNOCANCEL) {
        actions.push(createAction(context, 'Yes', BComponent.DialogResponse.YES, true));
        actions.push(createAction(context, 'No', BComponent.DialogResponse.NO, false));
        actions.push(createAction(context, 'Cancel', BComponent.DialogResponse.CANCEL, false));
      } else actions.push(createAction(context, 'Ok', BComponent.DialogResponse.OK, true));
    }

    let titleBackgroundColor =
      Object.keys(BDialogHelper.dialogRefs).length >= 1 ? context.theme.boaPalette.base300 : context.theme.boaPalette.pri500;

    let dialogElement = (
      <BAppProvider theme={context.theme}>
        <BDialog
          context={context}
          content={content}
          dialogType={dialogType}
          dialogResponseStyle={dialogResponseStyle}
          style={style}
          dialogKey={dialogKey}
          dialogRefs={this.dialogRefs}
          onRequestClose={this.onClose}
          onClosing={onClosing}
          ref={r => (thisRef = r)}
          open={true}
          title={title}
          titleBackgroundColor={titleBackgroundColor}
          // fullScreen={fullScreen}
          actions={actions}
          showHeader={showHeader}
        // autoScrollBodyContent={autoScrollBodyContent}
        // PaperProps={{ style: customContentStyle }}
        // bodyStyle={customBodyStyle}
        // titleWithCloseButtonEnabled={titleWithCloseButtonEnabled}
        // title={titleWithCloseButtonEnabled ? title : null}
        // titleStyle={{ fontSize: '20px' }}
        // style={titleWithCloseButtonEnabled ? { height: '100%' } : { height: 'fit-content' }}
        >
          {/* {
            titleWithCloseButtonEnabled ?
              dialogContent
              :
              <div>
                <div style={{
                  display: 'flex',
                  paddingLeft: '24px',
                  paddingTop: '24px',
                  alignItems: 'center'
                }}>
                  <div style={{ paddingBottom: '15px' }}>{dIcon}</div>
                  {dialogContent}
                </div>
                {dialogSubContent}
              </div>
          } */}
        </BDialog>
      </BAppProvider>
    );

    let dialogDiv = document.createElement('div');
    document.body.appendChild(dialogDiv);
    this.dialogDivs[dialogKey] = dialogDiv;

    ReactDOM.render(dialogElement, dialogDiv, () => {
      this.dialogRefs[dialogKey] = { dialog: thisRef, onClose: onClose, contentRef: dialogContentRef };
    });

    return thisRef;
  }

  static showError(
    context,
    message,
    results,
    dialogType = BComponent.DialogType.INFO,
    dialogResponseStyle = BComponent.DialogResponseStyle.OK,
    title,
    onClose,
    style
  ) {
    var errorMessage = [];
    if (message) {
      errorMessage.push(message);
    }
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        errorMessage.push(results[i].errorMessage);
      }
      this.show(
        context,
        errorMessage,
        (dialogType = BComponent.DialogType.INFO),
        (dialogResponseStyle = BComponent.DialogResponseStyle.OK),
        title,
        onClose,
        style
      );
    }
  }

  static showPage(context, content, title, onClose, style) {
    this.show(context, content, BComponent.DialogType.INFO, BComponent.DialogResponseStyle.OK, title, onClose, style);
  }

  static close(component, dialogResponse = BComponent.DialogResponse.NONE, returnValue) {
    let dialogKey;
    let idleDialog;
    let idleDialogDiv;
    if (component && component.props && component.props.dialogKey) {
      dialogKey = component.props.dialogKey;
    } else {
      dialogKey = Object.keys(this.dialogRefs).slice(-1)[0];
    }
    idleDialog = this.dialogRefs[dialogKey];
    idleDialogDiv = this.dialogDivs[dialogKey];

    if (
      !idleDialog.dialog.props.onClosing ||
      (idleDialog.dialog.props.onClosing && idleDialog.dialog.props.onClosing(idleDialog.dialog, idleDialog.contentRef))
    ) {
      delete this.dialogRefs[dialogKey];
      delete this.dialogDivs[dialogKey];

      idleDialog.dialog.getInstance().setState({ open: false }, () => {
        setTimeout(() => {
          idleDialog.onClose && idleDialog.onClose(dialogResponse, returnValue);
          idleDialog.contentRef && idleDialog.contentRef.onClose && idleDialog.contentRef.onClose(dialogResponse, returnValue);
          ReactDOM.unmountComponentAtNode(idleDialogDiv);
          document.body.removeChild(idleDialogDiv);
        }, 200);
      });
    }
  }

  static onClose(dialogResponse) {
    this.close(undefined, dialogResponse, undefined);
  }
}

BDialogHelper.staticConstructor();
