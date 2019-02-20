import * as React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import { Icon } from '@kuveytturk/boa-components/Icon';
import { ToolTip } from '@kuveytturk/boa-components/ToolTip';
import { ComponentBase, ComponentComposer } from '@kuveytturk/boa-base';

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
 * Icon buttons allow users to take actions, and make choices, with a icon tap.
 * This component is made up `@material-ui/core/ButtonBase`, and  `@kuveytturk/boa-components/Icon`.
 * It able to render an `<ToolTip />` when the "tooltipTitle" prop exists.
 */
@ComponentComposer
@withStyles(styles)
class IconButton extends ComponentBase {
  static propTypes = {
    /**
     * Base properties from ComponentBase.
     */
    ...ComponentBase.propTypes,
    /**
     * The color of the component.
     * It supports those theme colors that make sense for this component.
     */
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary', 'disabled']),
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
     * `disableRipple` must also be `false`.
     */
    focusRipple: PropTypes.bool,
    /**
     * Font icon name from font icon's library.
     */
    fontIcon: PropTypes.string,
    /**
     * Icon props that be passed to the `<Icon />` element.
     */
    iconProperties: PropTypes.object,
    /**
     * @ignore
     */
    onClick: PropTypes.func,
    /**
     * SVG Icon name from material svg icon library.
     */
    svgIcon: PropTypes.string,
    /**
     * If type 'icon' tooltip will generate on icon button.
     */
    tooltip: PropTypes.string,
    /**
     * The position of the tooltip in button.
     */
    tooltipPosition: PropTypes.string,
    /**
     * Button type should be `contained`, `text`, `fab` or `icon`.
     */
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    dynamicIcon: 'Home',
    color: 'default',
    disabled: false,
    disableRipple: false,
    focusRipple: true,
  };

  state = {
    disabled: this.props.disabled,
  };

  render() {
    const { classes } = this.props;
    const tooltipTitle = this.props.tooltip;
    const tooltipPosition = this.props.tooltipPosition;
    const iconProperties = { ...this.props.iconProperties };

    /* istanbul ignore else */
    if (iconProperties && this.state.disabled) {
      iconProperties.color = 'disabled';
    } else if (this.props.iconProperties) {
      iconProperties.color = this.props.iconProperties.color;
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
        tabIndex={this.props.tabIndex}
      >
        {Icon.getIcon({ ...this.props, iconProperties })}
      </ButtonBase>
    );

    return tooltipTitle ? (
      <ToolTip
        context={this.props.context}
        tooltip={tooltipTitle}
        tooltipPosition={tooltipPosition}
      >
        {iconButton}
      </ToolTip>
    ) : (
      iconButton
    );
  }
}

export default IconButton;
