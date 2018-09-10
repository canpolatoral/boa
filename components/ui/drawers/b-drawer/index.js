import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BDrawer extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
      /**
     * Side from which the drawer will appear.
     */
    anchor: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
    /**
     * The contents of the drawer.
     */
    children: PropTypes.node,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object.isRequired,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The elevation of the drawer.
     */
    elevation: PropTypes.number,
    /**
     * Properties applied to the `Modal` element.
     */
    ModalProps: PropTypes.object,
    /**
     * Callback fired when the component requests to be closed.
     *
     * @param {object} event The event source of the callback
     */
    onClose: PropTypes.func,
    /**
     * If `true`, the drawer is open.
     */
    open: PropTypes.bool,
    /**
     * Properties applied to the `Paper` element.
     */
    PaperProps: PropTypes.object,
    /**
     * Properties applied to the `Slide` element.
     */
    SlideProps: PropTypes.object,
    /**
     * @ignore
     */
    theme: PropTypes.object.isRequired,
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     */
    transitionDuration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
    /**
     * The type of drawer.
     */
    variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary']),
  };

  static defaultProps = {
    /**
    * Base default properties from BComponent.
    */
    ...BComponent.defaultProps,
    docked: true,
    open: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { open: this.props.open, docked: this.props.docked };
    this.openDrawer = this.openDrawer.bind(this);
    this.dockDrawer = this.dockDrawer.bind(this);
  }

  openDrawer(value) {
    this.setState({ open: value });
  }

  dockDrawer(value) {
    this.setState({ docked: value });
  }

  render() {
    if (this.props.context.localization.isRightToLeft) {
      this.containerStyle = Object.assign({ textAlign: 'right' }, this.props.containerStyle);
      this.overlayStyle = Object.assign({ textAlign: 'right' }, this.props.overlayStyle);
    }
    else {
      this.containerStyle = Object.assign({ textAlign: 'left' }, this.props.containerStyle);
      this.overlayStyle = Object.assign({ textAlign: 'left' }, this.props.overlayStyle);
    }
    return (
      <Drawer
        ref={(item) => { this.leftDrawer = item; }}
        open={this.state.open}
        variant={this.props.variant ? this.state.variant : this.state.docked ? 'persistent':'temporary'}
        anchor={this.props.anchor}
        PaperProps={{style: this.containerStyle}}
        onClose={this.props.onClose}
        // PaperProps={{style: {width: this.props.width}}
        >
        {this.props.children}
      </Drawer>
    );
  }
}

export default BDrawer;
