import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { BIconButton } from 'b-icon-button';
import classNames from 'classnames';

export function addMessage(uniqueId, text, closeText = '', closeCallback = null, type = '', timeout = 5000) {
  let element = document.getElementById('snack-bar-element-instance');
  if (element) {
    var snackBarInstance;
    let snackBar = (
      <BSnackBar
        ref={r => (snackBarInstance = r)}
        messageId={uniqueId}
        text={text}
        closeText={closeText}
        closeCallback={closeCallback}
        type={type || 'default'}
        timeout={timeout}
      />
    );
    ReactDOM.render(snackBar, element, () => {
      snackBarInstance && snackBarInstance.getInstance().show();
    });
    return true;
  }
  return false;
}

const styles = theme => ({
  default: {},
  success: { backgroundColor: green[600] },
  error: { backgroundColor: theme.palette.error.dark },
  info: { backgroundColor: theme.palette.primary.dark },
  warning: { backgroundColor: amber[700] },
  message: { display: 'flex', alignItems: 'center' }
});

@BComponentComposer
@withStyles(styles)
export class BSnackBar extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    messageId: PropTypes.string,
    text: PropTypes.string,
    open: PropTypes.bool,
    timeout: PropTypes.number,
    closeText: PropTypes.string,
    closeCallback: PropTypes.func,
    type: PropTypes.oneOf(['default', 'success', 'error', 'info', 'warning']),
    vertical: PropTypes.oneOf(['top', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'right']),
    style: PropTypes.object,
    showCloseIcon: PropTypes.bool,
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {
    open: false,
    timeout: 5000,
    vertical: 'bottom',
    horizontal: 'left',
    showCloseIcon: true
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: this.props.open,
      messageInfo: {}
    };
  }

  queue = [];

  show() {
    this.queue.push({
      key: new Date().getTime()
    });

    if (this.state.open) {
      this.setState({ open: false });
    } else {
      this._processQueue();
    }
  }

  close() {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  _processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        messageInfo: this.queue.shift(),
        open: true
      });
    }
  };

  handleOnClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  handleOnCloseCallback = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
    this.props.closeCallback && this.props.closeCallback();
  };

  handleOnExited = () => {
    this._processQueue();
  };

  getActions() {
    let actions = [];
    if (this.props.closeCallback && this.props.closeText) {
      actions.push(
        <Button
          key={'keybtn_' + this.props.messageId}
          color="secondary"
          size="small"
          onClick={() => {
            this.handleOnCloseCallback();
          }}
        >
          {this.props.closeText.toUpperCase()}
        </Button>
      );
    }
    if (this.props.showCloseIcon) {
      actions.push(
        <BIconButton
          style={{ color: 'white', opacity: '0.8' }}
          key={'keyicon_' + this.props.messageId}
          dynamicIcon="Clear"
          onClick={() => {
            this.handleOnClose();
          }}
        />
      );
    }

    return actions;
  }

  render() {
    const { classes, className, type, messageId } = this.props;
    let message_Id = messageId || 'message_Id';

    return (
      <Snackbar
        open={this.state.open}
        anchorOrigin={{
          vertical: this.props.vertical,
          horizontal: this.props.horizontal
        }}
        onClose={this.handleOnClose}
        onExited={this.handleOnExited}
        autoHideDuration={this.props.timeout}
        ContentProps={{ 'aria-describedby': message_Id }}
      >
        <SnackbarContent
          className={classNames(classes[type], className)}
          aria-describedby="client-snackbar"
          message={
            <span className={classes.message} id={message_Id}>
              <div dangerouslySetInnerHTML={{ __html: this.props.text.replace(/\n/gi, '<br />') }} />
            </span>
          }
          action={this.getActions()}
        />
      </Snackbar>
    );
  }
}

export default BSnackBar;
