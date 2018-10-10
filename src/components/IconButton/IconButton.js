import * as React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from 'b-icon';
import { ComponentBase, ComponentComposer } from 'b-component';

const styles = theme => ({
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

/**
 * BOA Icon Button Component
*/
@ComponentComposer
@withStyles(styles)
class IconButton extends ComponentBase {
  static propTypes = {
    /**
    * Base properties from ComponentBase
    */
    ...ComponentBase.propTypes,
    /**
     * Tooltip
     */
    tooltip: PropTypes.string,
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    /**
     * If `true`, the button will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * If `true`, the ripple will be disabled.
     */
    disableRipple: PropTypes.bool,
    /**
     * If `true`, the base button will have a keyboard focus ripple. disableRipple` must also be `false`.
     */
    focusRipple: PropTypes.bool,
    /**
     * @ignore
     */
    onClick: PropTypes.func,
    /**
     * Override the style of element
     */
    style: PropTypes.object,
    /**
      * Font icon name from font icon's library.
      */
    fontIcon: PropTypes.string,
    /**
     * SVG Icon name from material svg icon library.
     */
    svgIcon: PropTypes.string,
    /**
     * Icon name from BOA icon library.
     */
    dynamicIcon: PropTypes.string,
    /**
     * Tooltip position
     */
    tooltipPosition: PropTypes.oneOf('bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top'),
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    dynamicIcon: 'Home',
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
        {Icon.getIcon(this.props)}
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

export default IconButton;
