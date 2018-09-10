import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Popover from '@material-ui/core/Popover';

import { BComponent, BComponentComposer } from 'b-component';
import { BResizableBeta } from 'b-resizable-beta';
@BComponentComposer
export class BPopover extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,

    action: PropTypes.func,
    /**
     * This is the DOM element, or a function that returns the DOM element,
     * that may be used to set the position of the popover.
     */
    anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * This is the point on the anchor where the popover's
     * `anchorEl` will attach to. This is not used when the
     * anchorReference is 'anchorPosition'.
     *
     * Options:
     * vertical: [top, center, bottom];
     * horizontal: [left, center, right].
     */
    anchorOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['left', 'center', 'right']),
      ]),
      vertical: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['top', 'center', 'bottom'])]),
    }),
    /**
     * This is the position that may be used
     * to set the position of the popover.
     * The coordinates are relative to
     * the application's client area.
     */
    anchorPosition: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
    /*
     * This determines which anchor prop to refer to to set
     * the position of the popover.
     */
    anchorReference: PropTypes.oneOf(['anchorEl', 'anchorPosition']),
    /**
     * The content of the component.
     */
    children: PropTypes.node,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object,
    /**
     * A node, component instance, or function that returns either.
     * The `container` will passed to the Modal component.
     * By default, it's using the body of the anchorEl's top-level document object,
     * so it's simply `document.body` most of the time.
     */
    container: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * The elevation of the popover.
     */
    elevation: PropTypes.number,
    /**
     * This function is called in order to retrieve the content anchor element.
     * It's the opposite of the `anchorEl` property.
     * The content anchor element should be an element inside the popover.
     * It's used to correctly scroll and set the position of the popover.
     * The positioning strategy tries to make the content anchor element just above the
     * anchor element.
     */
    getContentAnchorEl: PropTypes.func,
    /**
     * Specifies how close to the edge of the window the popover can appear.
     */
    marginThreshold: PropTypes.number,
    /**
     * Callback fired when the component requests to be closed.
     *
     * @param {object} event The event source of the callback.
     */
    onClose: PropTypes.func,
    /**
     * Callback fired before the component is entering.
     */
    onEnter: PropTypes.func,
    /**
     * Callback fired when the component has entered.
     */
    onEntered: PropTypes.func,
    /**
     * Callback fired when the component is entering.
     */
    onEntering: PropTypes.func,
    /**
     * Callback fired before the component is exiting.
     */
    onExit: PropTypes.func,
    /**
     * Callback fired when the component has exited.
     */
    onExited: PropTypes.func,
    /**
     * Callback fired when the component is exiting.
     */
    onExiting: PropTypes.func,
    /**
     * If `true`, the popover is visible.
     */
    open: PropTypes.bool.isRequired,
    /**
     * Properties applied to the `Paper` element.
     */
    PaperProps: PropTypes.object,
    /**
     * @ignore
     */
    role: PropTypes.string,
    /**
     * This is the point on the popover which
     * will attach to the anchor's origin.
     *
     * Options:
     * vertical: [top, center, bottom, x(px)];
     * horizontal: [left, center, right, x(px)].
     */
    transformOrigin: PropTypes.shape({
      horizontal: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['left', 'center', 'right']),
      ]),
      vertical: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['top', 'center', 'bottom'])]),
    }),
    /**
     * Transition component.
     */
    transition: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * Set to 'auto' to automatically calculate transition time based on height.
     */
    transitionDuration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
      PropTypes.oneOf(['auto']),
    ]),
    onRequestClose: PropTypes.func,

    /**
     * If true, the modal will not restore focus to previously focused element once modal is hidden. (input bileşeninin focusunda açıyorsanız can kurtarır!)
     */
    disableRestoreFocus:PropTypes.bool
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    anchorReference: 'anchorEl',
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    elevation: 8,
    marginThreshold: 16,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    // transition: Grow,
    transitionDuration: 'auto',
    disableRestoreFocus:false
  }

  state = {
    open: this.props.open,
    anchorEl: this.props.anchorEl,
    style: this.props.style,
  };

  constructor(props, context) {
    super(props, context);
    this.onRequestClose = this.onRequestClose.bind(this);
    this.openPopover = this.openPopover.bind(this);

    // let defaultAnchorOrigin, defaultTargetOrigin;
    // if (this.props.context.localization.isRightToLeft) {
    //   defaultAnchorOrigin = { vertical: 'bottom', horizontal: 'left' };
    //   defaultTargetOrigin = { vertical: 'top', horizontal: 'left' };
    // }
    // else {
    //   defaultAnchorOrigin = { vertical: 'bottom', horizontal: 'right' };
    //   defaultTargetOrigin = { vertical: 'top', horizontal: 'right' };
    // }
    // this.anchorOrigin = this.props.isOriginSetted && this.props.anchorOrigin ? this.props.anchorOrigin : defaultAnchorOrigin;
    // // this.targetOrigin = this.props.isOriginSetted && this.props.targetOrigin ? this.props.targetOrigin : defaultTargetOrigin;
  }

  getValue() {
    return this.state;
  }

  setValue(value) {
    this.setState({ ...value });
  }

  openPopover() {
    this.setState((prevState) => { return { open: !prevState.open }; });
  }

  manualOpen(openElement, width) {
    this.setState({ open: true, anchorEl: openElement, style: Object.assign({}, this.state.style, { width: width }) });
  }

  manualClose() {
    this.setState({ open: false });
  }

  onRequestClose(reason) {
    {
      if (reason == 'clickAway') {
        this.setState({ open: false });
      }
      if (this.props.onRequestClose) {
        this.props.onRequestClose(reason);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open != nextProps.open) {
      this.setState({ open: nextProps.open, anchorEl: nextProps.anchorEl });
    }
  }

  onResize(e, direction, refToResizableElement) {
    try {
      let resizableParent = ReactDOM.findDOMNode(this.resizable).parentNode;
      resizableParent.style.height = (refToResizableElement.height) + 'px';
      resizableParent.style.width = (refToResizableElement.width) + 'px';
    } catch (ex) {
      this.debugLog(ex);
    }
  }

  render() {
    let children;
    if (this.props.isResizable) {
      children =
        <BResizableBeta
          context={this.props.context}
          ref={r => this.resizable = r}
          bounds='parent'
          minWidth={200}
          minHeight={100}
          default={{ x: 0, y: 0, width: '100%', height: '100%' }}
          onResize={this.onResize.bind(this)}>
          {this.props.children}
        </BResizableBeta>;
    }
    else {
      children = this.props.children;
    }
    return (
      <Popover
        ref={r => this.popover = r}
        anchorEl={this.state.anchorEl}
        anchorReference={this.props.anchorReference}
        anchorPosition={this.props.anchorPosition}
        // anchorOrigin={this.anchorOrigin}
        anchorOrigin={this.props.anchorOrigin}
        children={children}
        className={this.props.className}
        onClose={this.props.onRequestClose}
        open={this.state.open}
        style={this.state.style}
        targetOrigin={this.targetOrigin}
        useLayerForClickAway={this.props.useLayerForClickAway}
        transitionComponent={this.props.transition}
        transformOrigin={this.props.transformOrigin}
        transitionDuration={this.props.transitionDuration}
        disableRestoreFocus={this.props.disableRestoreFocus}
        PaperProps={this.props.PaperProps}
        marginThreshold={this.props.marginThreshold}
      />

      // context = {context}
      // open={this.self.state.open}
      // anchorEl={this.self.state.anchorEl}
      // anchorReference={this.self.state.anchorReference}
      // anchorPosition={{ top: this.self.state.positionTop, left: this.self.state.positionLeft }}
      // onClose={this.handleClose.bind(this)}
      // anchorOrigin={{
      //   vertical: this.self.state.anchorOriginVertical,
      //   horizontal: this.self.state.anchorOriginHorizontal,
      // }}
      // transformOrigin={{
      //   vertical: this.self.state.transformOriginVertical,
      //   horizontal: this.self.state.transformOriginHorizontal,
      // }}

    );
  }
}

export default BPopover;
