import * as React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '@boa/components/Icon';
import { ComponentBase, ComponentComposer } from '@boa/base';

const styles = {
  root: {
    textAlign: 'center',
    flex: '0 0 auto',
    width: 48,
    height: 48,
    padding: 0,
    borderRadius: '50%',
  },
  label: {
    width: '100%',
    display: 'flex',
    alignItems: 'inherit',
    justifyContent: 'inherit',
  },
};

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
     * The color of the component.
     * It supports those theme colors that make sense for this component.
     */
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary', 'disabled']),
    /**
     * If `true`, the button will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * If `true`, the ripple will be disabled.
     */
    disableRipple: PropTypes.bool,
    /**
     * Icon name from BOA icon library.
     */
    dynamicIcon: PropTypes.string,
    /**
     * If `true`, the base button will have a keyboard focus ripple.
     * disableRipple` must also be `false`.
     */
    focusRipple: PropTypes.bool,
    /**
     * Font icon name from font icon's library.
     */
    fontIcon: PropTypes.string,
    /**
     * Icon props
     */
    iconProperties: PropTypes.object,
    /**
     * @ignore
     */
    onClick: PropTypes.func,
    /**
     * Override the style of element
     */
    style: PropTypes.object,
    /**
     * SVG Icon name from material svg icon library.
     */
    svgIcon: PropTypes.string,
    /**
     * Tooltip
     */
    tooltip: PropTypes.string,
    /**
     * Tooltip position
     */
    tooltipPosition: PropTypes.string,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    dynamicIcon: 'Home',
    color: 'default',
    disabled: false,
    disableRipple: false,
    focusRipple: true,
  };

  render() {
    const { classes } = this.props;
    const tooltipTitle = this.props.tooltip;
    const tooltipPosition = this.props.tooltipPosition;
    const iconProperties = this.props.iconProperties;

    /* istanbul ignore if */
    if (iconProperties) {
      iconProperties.color = this.props.disabled ? 'disabled' : iconProperties.color;
    }

    const iconButton = (
      <ButtonBase
        id={this.props.id}
        classes={{
          root: classes.root,
        }}
        onClick={this.props.onClick}
        style={this.props.style}
        disabled={this.props.disabled}
        focusRipple={this.props.focusRipple}
        disableRipple={this.props.disableRipple}
      >
        {Icon.getIcon({ ...this.props, iconProperties })}
      </ButtonBase>
    );

    return tooltipTitle ? (
      <Tooltip title={tooltipTitle} placement={tooltipPosition}>
        {iconButton}
      </Tooltip>
    ) : (
      iconButton
    );
  }
}

export default IconButton;
