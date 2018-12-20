/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { ComponentBase, ComponentComposer, Utils, DialogType, Sizes } from '@boa/base';
import { Button } from '@boa/components/Button';
import { Icon } from '@boa/components/Icon';
import DialogHelper from './DialogHelper';

/**
 * Dialog Component is wrapped from `@material-ui/core/Dialog`.
 * Also `DialogHelper` provides a static method called `show`
 * This method allows create window from outside the render method.
 */
@ComponentComposer
class Dialog extends ComponentBase {
  static propTypes = {
    ...ComponentBase.propTypes,
    /**
     * Dialog children, usually the included sub-components.
     */
    autoDetectWindowHeight: PropTypes.bool,
    /**
     * Dialog children, usually the included sub-components.
     */
    children: PropTypes.node,
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * If `true`, hitting escape will not fire the `onClose` callback.
     */
    content: PropTypes.any,
    /**
     * If `true`, it will be full-screen
     */
    dialogBoxContentPadding: PropTypes.any,
    /**
     * If `true`, clicking the backdrop will not fire the `onClose` callback.
     */
    disableBackdropClick: PropTypes.bool,
    /**
     * If `true`, hitting escape will not fire the `onClose` callback.
     */
    disableEscapeKeyDown: PropTypes.bool,
    /**
     * If true, the modal will not restore focus to previously focused element once modal is hidden.
     * (input bileşeninin focusunda açıyorsanız can kurtarır!)
     */
    disableRestoreFocus: PropTypes.bool,
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
    repositionOnUpdate: PropTypes.bool,
    showHeader: PropTypes.bool,
    style: PropTypes.object,
    titleBackgroundColor: PropTypes.string,
    /**
     * If true, the modal will not restore focus to previously focused element once modal is hidden.
     */
    titleWithCloseButtonEnabled: PropTypes.bool,
    /**
     * Transition component.
     */
    transition: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     */
    transitionDuration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
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
    dialogBoxContentPadding: '24px',
  };

  state = {
    open: this.props.open,
    title: this.props.title,
  };

  constructor(props, context) {
    super(props, context);
    this.fireClosable = this.fireClosable.bind(this);
    this.open = this.open.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { open, title } = nextProps;
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

  open(open) {
    this.setState({ open }, () => {
      if (open === false && this.props.dialogKey) {
        DialogHelper.clearRefs(this.props.dialogKey);
      }
    });
  }

  fireClosable() {
    if (this.props.onClosing) {
      this.props.onClosing(this, DialogHelper.getContentRef(this.props.dialogKey));
    }
  }

  getIcon(type) {
    const context = this.props.context;
    const iconStyle = { width: '48px', height: '48px' };
    switch (type) {
      case DialogType.INFO: {
        const icon = {
          dynamicIcon: 'Info',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.warning500 },
          },
        };
        return Icon.getIcon(icon);
      }
      /* istanbul ignore next */
      case DialogType.QUESTION: {
        const icon = {
          dynamicIcon: 'Help',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.info500 },
          },
        };
        return Icon.getIcon(icon);
      }
      /* istanbul ignore next */
      case DialogType.WARNING: {
        const icon = {
          dynamicIcon: 'Error',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.warning500 },
          },
        };
        return Icon.getIcon(icon);
      }
      /* istanbul ignore next */
      case DialogType.ERROR: {
        const icon = {
          dynamicIcon: 'Error',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.warning500 },
          },
        };
        return Icon.getIcon(icon);
      }
      /* istanbul ignore next */
      case DialogType.SUCCESS: {
        const icon = {
          dynamicIcon: 'CheckCircle',
          iconProperties: {
            style: { ...iconStyle, color: context.theme.boaPalette.success500 },
          },
        };
        return Icon.getIcon(icon);
      }
      default:
        return null;
    }
  }

  prepareDialog() {
    const {
      context,
      content,
      children,
      dialogType,
      dialogKey,
      style,
      dialogRefs,
      showHeader,
    } = this.props;
    const isRightToLeft = context.localization.isRightToLeft;
    let titleWithCloseButtonEnabled = this.props.titleWithCloseButtonEnabled;
    let contentProps;
    let customContentStyle = {};
    let fullScreen = false;
    let dialogContent;
    const dialogSubContent = [];
    let dialog = {};
    let isObject = false;

    const headerStyle = {
      boxSizing: 'border-box',
      width: '100%',
      fontSize: '16px',
      color: context.theme.boaPalette.base450,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'transparent',
    };

    Object.assign(headerStyle, isRightToLeft ? { marginLeft: '24px' } : { marginRight: '24px' });

    /* eslint-disable no-console  */
    if (!children) {
      if (!content) {
        dialogContent = '';
      } else if (
        typeof content === 'string' ||
        content instanceof Array ||
        (content instanceof Object && content.mainContent !== undefined)
      ) {
        if (content instanceof Array) {
          dialogContent = '';
          content.forEach(item => {
            dialogContent += `${item}<br />`;
          });
          dialogContent = dialogContent.replace('\n', '<br />');
        } else if (content instanceof Object) {
          isObject = true;
          dialogContent = [];
          dialogContent.push(
            <div key="dialogContent" id="dialogHeader" style={headerStyle}>
              {content.mainContent}
            </div>,
          );

          const subObj = [];
          const subObjStyle = {
            overflow: 'auto',
            height: '60vh',
            paddingLeft: '98px',
            paddingBottom: '24px',
          };

          Object.assign(
            subObjStyle,
            this.props.context.localization.isRightToLeft
              ? { paddingLeft: '24px', paddingRight: '98px', direction: 'rtl' }
              : { direction: 'ltr' },
          );

          Object.assign(
            subObjStyle,
            context.deviceSize <= Sizes.SMALL ? { paddingLeft: '24px', paddingRight: '24px' } : {},
          );

          content.subcontents.forEach((item, index) => {
            subObj.push(
              <div
                key={index} // eslint-disable-line
                style={{
                  marginTop: '24px',
                  fontSize: '11px',
                  color: context.theme.boaPalette.base400,
                }}
              >
                {item.header}
              </div>,
            );
            item.contents.forEach((i, j) => {
              subObj.push(
                <div
                  key={`${index.toString() + j.toString()}`} // eslint-disable-line
                  style={{
                    fontSize: '13px',
                    color: context.theme.boaPalette.base450,
                  }}
                >
                  {i}
                </div>,
              );
            });
          });

          dialogSubContent.push(
            <div
              key="scrollDiv"
              id="scrollDiv"
              onScroll={event => {
                const scrollDivStyle = document.getElementById('scrollDiv').style;
                const headerDivStyle = document.getElementById('dialogHeader').style;
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
            </div>,
          );
        } else if (typeof content === 'string' && content.includes('\n')) {
          const text = content.replace(/\n/gi, '#00100#');
          const textArray = text.split('#00100#');
          dialogContent = '';
          textArray.forEach(item => {
            dialogContent += `${item}<br />`;
          });
          dialogContent = dialogContent.replace('\n', '<br />');
        } else {
          dialogContent = Utils.getShowStatusMessageReplacedText(content);
        }
      } else {
        contentProps = {
          inDialog: true,
          dialogKey,
          ref: r => {
            if (dialogRefs[dialogKey]) {
              dialogRefs[dialogKey].contentRef = r;
            }
          },
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
          overflow: 'hidden',
        };

        // eslint-disable-next-line max-len
        if (
          style &&
          style.height &&
          typeof style.height === 'string' &&
          style.height.includes('%')
        ) {
          style.height = style.height.replace('%', 'vh');
        }

        // eslint-disable-next-line max-len
        if (style && style.width && typeof style.width === 'string' && style.width.includes('%')) {
          style.width = style.width && style.width.replace('%', 'vw');
        }

        customContentStyle = Object.assign({}, customContentStyle, style);
        titleWithCloseButtonEnabled = showHeader;
      }
    } else {
      dialogContent = children;
    }
    const dIcon = this.getIcon(dialogType);

    if (titleWithCloseButtonEnabled) {
      if (customContentStyle.width > window.innerWidth) {
        customContentStyle.width = '100vw';
      }
      if (customContentStyle.height > window.innerHeight) {
        customContentStyle.height = '100vh';
      }

      // mobilse her durumda dialoglar fullscreen açılsın
      if (context.deviceSize <= Sizes.SMALL) {
        customContentStyle = Object.assign(customContentStyle, { height: '100vh', width: '100vw' });
        fullScreen = true;
      }
    } else {
      customContentStyle = Object.assign(customContentStyle, { margin: '8px' }, style);
    }

    dialog = {
      dialogContent,
      children,
      icon: dIcon,
      subContent: dialogSubContent,
      isObject,
      titleWithCloseButtonEnabled,
      customContentStyle,
      fullScreen,
      contentProps,
    };
    return dialog;
  }

  onEnter() {
    const scrollDiv = document.getElementById('scrollDiv');
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
    const { leftTitleButton, title } = this.state;
    const context = this.props.context;
    const dialog = this.prepareDialog();
    const closeButtonStyle = { top: 0, right: 0 };
    const titleStyle = { flex: 1, paddingTop: '9px' };

    let titleBackgroundColor = this.props.titleBackgroundColor;

    if (Object.keys(DialogHelper.dialogRefs).length >= 1) {
      titleBackgroundColor = context.theme.boaPalette.base300;
    } else {
      titleBackgroundColor = context.theme.boaPalette.pri500;
    }

    const objLine = {
      height: '1px',
      borderBottomColor: context.theme.boaPalette.base200,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      marginBottom: '-1px',
    };

    const dialogFormStyle = {
      boxSizing: 'border-box',
      width: '100%',
      fontSize: '16px',
      textAlign: 'center',
      color: context.theme.boaPalette.comp500,
      background: titleBackgroundColor,
      padding: '0px',
      display: 'flex',
      direction: context.localization.isRightToLeft ? 'rtl' : 'ltr',
    };

    Object.assign(
      objLine,
      context.localization.isRightToLeft
        ? { marginLeft: '24px', marginRight: '96px' }
        : { marginLeft: '96px', marginRight: '24px' },
    );

    Object.assign(
      objLine,
      context.deviceSize <= Sizes.SMALL ? { marginRight: '24px', marginLeft: '24px' } : {},
    );

    Object.assign(
      closeButtonStyle,
      context.localization.isRightToLeft ? { paddingLeft: '12px' } : { paddingRight: '12px' },
    );

    if (context.deviceSize <= Sizes.SMALL) {
      Object.assign(
        closeButtonStyle,
        context.localization.isRightToLeft ? { paddingLeft: '4px' } : { paddingRight: '4px' },
      );
    }

    if (context.deviceSize <= Sizes.SMALL) {
      Object.assign(
        titleStyle,
        context.localization.isRightToLeft
          ? !leftTitleButton && { paddingRight: '44px' }
          : !leftTitleButton && { paddingLeft: '44px' },
      );
    } else {
      Object.assign(
        titleStyle,
        context.localization.isRightToLeft ? { paddingRight: '60px' } : { paddingLeft: '60px' },
      );
    }

    const dialogForm = this.props.showHeader ? (
      <MuiDialogTitle disableTypography style={dialogFormStyle}>
        {leftTitleButton && <div>{leftTitleButton}</div>}
        <div style={titleStyle}>{title}</div>
        <div style={closeButtonStyle}>
          <Button
            context={context}
            type="icon"
            style={{ width: '40px', height: '40px' }}
            dynamicIcon={'Close'}
            iconProperties={{ nativeColor: context.theme.boaPalette.comp500 }}
            onClick={this.props.onRequestClose}
          />
        </div>
      </MuiDialogTitle>
    ) : null;

    const dialogBoxContent = this.props.style ? (
      <MuiDialogContent style={this.props.style}>{dialog.dialogContent}</MuiDialogContent>
    ) : (
        <MuiDialogContent style={{ padding: '0px', overflow: 'hidden' }}>
          <div>
            <div
              style={{
                display: 'flex',
                // alignItems: 'center',
                padding: '0px',
                minHeight: '96px',
                fontSize: '16px',
                direction: context.localization.isRightToLeft ? 'rtl' : 'ltr',
              }}
            >
              {context.deviceSize > Sizes.SMALL && (
                <div
                  style={
                    context.localization.isRightToLeft
                      ? { paddingTop: '24px', paddingRight: '24px' }
                      : { paddingTop: '24px', paddingLeft: '24px' }
                  }
                >
                  {dialog.icon}
                </div>
              )}
              <div
                style={{
                  padding: this.props.dialogBoxContentPadding,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {this.props.content instanceof Array ||
                  (typeof this.props.content === 'string' &&
                    typeof dialog.dialogContent === 'string' &&
                    dialog.dialogContent.includes('<br />')) ? (
                    <span dangerouslySetInnerHTML={{ __html: dialog.dialogContent }} />
                  ) : (
                    dialog.dialogContent
                  )}
              </div>
            </div>
            <div style={objLine} />
            {dialog.subContent}
          </div>
        </MuiDialogContent>
      );

    return (
      <MuiDialog
        fullScreen={dialog.fullScreen}
        fullWidth={this.props.fullWidth}
        open={this.state.open}
        onClose={this.props.onRequestClose}
        PaperProps={{ style: dialog.customContentStyle }}
        onEntered={this.onEnter}
        onExiting={this.fireClosable}
        disableRestoreFocus={this.props.disableRestoreFocus}
      >
        {dialog.titleWithCloseButtonEnabled && dialogForm}
        {dialog.titleWithCloseButtonEnabled ? dialog.dialogContent : dialogBoxContent}
        {!dialog.titleWithCloseButtonEnabled && this.props.actions && (
          <MuiDialogActions>{this.props.actions}</MuiDialogActions>
        )}
        <div
          id={`snack-bar-element-instance-${this.props.dialogKey}`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }} />
      </MuiDialog>
    );
  }
}

export default Dialog;
