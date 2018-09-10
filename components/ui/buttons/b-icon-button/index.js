import * as React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import { BComponent, BComponentComposer } from 'b-component';
import { BIcon } from 'b-icon';
import { withStyles } from '@material-ui/core/styles';

export const styles = theme => ({
  root: {
    textAlign: 'center',
    flex: '0 0 auto',
    fontSize: theme.typography.pxToRem(24),
    width: 48,
    height: 48,
    padding: 0,
    borderRadius: '50%',
    color: theme.palette.action.active,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': {
      textDecoration: 'none',
      // Reset on mouse devices
      backgroundColor: 'transparent',
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
      '&$disabled': {
        backgroundColor: 'transparent',
      },
    },
  },
  colorInherit: {
    color: 'inherit',
  },
  colorPrimary: {
    color: theme.palette.primary.main,
  },
  colorSecondary: {
    color: theme.palette.secondary.main,
  },
  disabled: {
    color: theme.palette.action.disabled,
  },
  label: {
    width: '100%',
    display: 'flex',
    alignItems: 'inherit',
    justifyContent: 'inherit',
  },
});

@BComponentComposer
@withStyles(styles)
export class BIconButton extends BComponent {
  static propTypes = {
    /**
    * Base properties from BComponent
    */
    ...BComponent.propTypes,
    tooltip: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    TouchRippleProps: PropTypes.node,
    focusRipple: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    tabIndex: PropTypes.string,
    iconStyle: PropTypes.object,
    tooltipPosition: PropTypes.string /* "bottom-end","bottom-start","bottom","left-end","left-start","left","right-end","right-start","right","top-end","top-start","top". */
  };

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps,
    open: false, // tooltip
    color: 'default',
    disabled: false,
    disableRipple: false,
    focusRipple: true
  };

  constructor(props, context) {
    super(props, context);

    this.onClick = this.onClick.bind(this);
    this.onTouchTap = this.onTouchTap.bind(this);
    this.state = { disabled: props.disabled };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  onTouchTap(e) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(e);
    }
  }

  onBlur(e) {
    this.props.onBlur && this.props.onBlur(e);
  }

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  render() {

    const { classes } = this.props;
    let tooltipTitle = this.props.tooltip;
    let tooltipPosition = this.props.tooltipPosition;


    let iconButton = (
      <ButtonBase
        classes={{
          root: classes.root,
        }}
        onClick={this.onClick}
        style={this.props.style}
        disabled={this.state.disabled}
        focusRipple={this.props.focusRipple}
        disableFocusRipple={this.props.disableRipple}
        disableRipple={this.props.disableRipple}
      >
        {BIcon.getIcon(this.props)}
      </ButtonBase>
    );

    return (
      tooltipTitle ?
        (<Tooltip title={tooltipTitle} placement={tooltipPosition} >{iconButton}</Tooltip>)
        :
        iconButton
    );
  }
}
export default BIconButton;
