import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { withStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { Localization } from '@boa/utils'; //
import { Icon } from '@boa/components/Icon'; //
import { IconButton } from '@boa/components/IconButton'; //

const styles = () => ({
  label: {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit',
  },
});

/**
 * Button Component is wrapped from `@material-ui/core/Button`.
 */
@ComponentComposer
@withStyles(styles)
class Button extends ComponentBase {
  static propTypes = {
    /**
     * Base properties from ComponentBase
     */
    ...ComponentBase.propTypes,
    /**
     * If `false` , content of the button wil be upper case
     */
    allowLabelCase: PropTypes.bool,
    /**
     * Size of button.
     */
    buttonSize: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * The color of the component.
     * It supports those theme colors that make sense for this component.
     */
    colorType: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    /**
     * If `true`, the button will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * Icon name from BOA icon library.
     */
    dynamicIcon: PropTypes.string,
    /**
     * Font icon name from font icon's library.
     */
    fontIcon: PropTypes.string,
    /**
     * If true, the button will take up the full width of its container.
     */
    fullWidth: PropTypes.bool,
    /**
     * Custom icon
     */
    icon: PropTypes.any,
    /**
     * Icon props
     */
    iconProperties: PropTypes.object,
    /**
     * If `true`, and `variant` is `'fab'`, will use mini floating action button styling.
     */
    mini: PropTypes.bool,
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
     * Button content.
     */
    text: PropTypes.string,
    /**
     * Text position on the button.
     */
    textPosition: PropTypes.oneOf(['center', 'left', 'right']),
    /**
     * Styles applied to the span element that wraps the children.
     */
    textStyle: PropTypes.object,
    /**
     * If type 'icon' tooltip will generate on icon button
     */
    tooltip: PropTypes.string,
    /**
     * tooltipPosition
     */
    tooltipPosition: PropTypes.string,
    /**
     * Button type should be `contained`, `text`, `fab` or `icon`.
     */
    type: PropTypes.oneOf(['contained', 'text', 'fab', 'icon']).isRequired,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    type: 'contained',
    text: '',
    allowLabelCase: true,
    textPosition: 'center',
    buttonSize: 'medium',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: props.disabled,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setDisable(nextProps.disabled);
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  getLabel() {
    const { allowLabelCase, text, textStyle } = this.props;
    const label = allowLabelCase ? text : Localization.stringUpperCase(!text ? '' : text);
    return textStyle ? <div style={textStyle}>{label}</div> : label;
  }

  createButtonElement(variant) {
    let props = this.props;
    const { textPosition, allowLabelCase, style } = this.props;

    /* istanbul ignore else  */
    if (variant !== 'fab') {
      props = Object.assign({}, props);
      const iconStyle = !this.getLabel() ? null : { marginRight: 8 };
      if (props.iconProperties && props.iconProperties.style) {
        props.iconProperties.style = merge(iconStyle, props.iconProperties.style);
      } else {
        props.iconProperties = { style: iconStyle };
      }
    }

    const icon = Icon.getIcon(props);
    const buttonStyle = {
      justifyContent: textPosition === 'right' ? 'flex-end' : textPosition,
      textAlign: textPosition,
      textTransform: allowLabelCase ? 'none' : '',
      ...style,
    };

    return (
      <MuiButton
        id={this.props.id}
        style={buttonStyle}
        fullWidth={this.props.fullWidth}
        color={this.props.colorType}
        disabled={this.state.disabled}
        disableRipple={this.state.disabled}
        onClick={this.props.onClick}
        variant={variant}
        size={this.props.buttonSize}
        mini={this.props.mini}
      >
        {icon}
        {this.getLabel()}
        {this.props.children}
      </MuiButton>
    );
  }

  createIconButtonElement() {
    return (
      <IconButton
        id={this.props.id}
        style={this.props.style}
        context={this.props.context}
        dynamicIcon={this.props.dynamicIcon}
        disabled={this.state.disabled}
        disableRipple={this.state.disabled}
        tooltip={this.props.tooltip}
        tooltipPosition={this.props.tooltipPosition}
        onClick={this.props.onClick}
      />);
  }

  createButton() {
    if (this.props.type && this.props.type === 'icon') {
      return this.createIconButtonElement();
    }
    return this.createButtonElement(this.props.type);
  }

  render() {
    return this.createButton();
  }
}

export default Button;
