import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  tooltip: {
    fontSize: '10px',
    padding: '12px',
    color: theme.boaPalette.comp450,
    backgroundColor: theme.boaPalette.base350,
    fontFamily: 'Roboto',
    maxWidth: '300px'
  }
});

@BComponentComposer
@withStyles(styles)
export class BToolTip extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    ...Tooltip.propTypes,
    tooltip: PropTypes.string,
    tooltipPosition: PropTypes.string
    // placement: PropTypes.oneOf(['left', 'top', 'right', 'bottom', 'left-start', 'left-end', 'top-start', 'top-end',
    //   'right-start', 'right-end', 'bottom-start', 'bottom-end'])
  };

  static defaultProps = {
    ...BComponent.defaultProps
  };

  state = {
    title: this.props.title
  };
  // Constructor
  constructor(props, context) {
    super(props, context);
    let placement = this.props.tooltipPosition ? this.props.tooltipPosition : this.props.placement;

    if (placement == 'up') {
      'top';
    }
    else if (placement == 'down') {
      placement = 'bottom';
    }

    this.state = {
      title: this.props.tooltip ? this.props.tooltip : this.props.title,
      placement: placement
    };
  }

  setValue(value) {
    this.setState({ title: value });
  }

  getValue() {
    return this.state.title;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tooltip !== this.props.tooltip) {
      this.setState({ title: nextProps.tooltip });
    }
  }
  // render
  render() {
    let toolTipIsOpen = this.state.title.length > 0 ? true : false;
    const { classes } = this.props;

    if (toolTipIsOpen) {
      return (
        <Tooltip {...this.props}
          title={this.state.title}
          placement={this.state.placement}
          classes={{
            tooltip: classes.tooltip
          }} >
          <div>
            {this.props.children}
          </div>
        </Tooltip>
      );
    }
    else {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
  }
}

export default BToolTip;
