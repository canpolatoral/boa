import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { ComponentBase, ComponentComposer } from '@boa/base';
import { Localization } from '@boa/utils';
import { Icon } from '@boa/components/Icon';
import { IconButton } from '@boa/components/IconButton';

const styles = () => ({
  label: {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit',
  },
});

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 * This component is wrapped from `@material-ui/core/Button`.
 * It able to render an `<IconButton />` when the "type" prop is "icon".
 */
@ComponentComposer
@withStyles(styles)
class Button extends ComponentBase {
  static propTypes = {
    /**
     * Base properties from ComponentBase.
     */
    ...ComponentBase.propTypes,
    /**
     * If `false`, content of the button wil be upper case.
     */
    allowLabelCase: PropTypes.bool,
    /**
     * Predefined sizes of button.
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
     * The custom icon element to be rendered inside the button.
     */
    icon: PropTypes.any,
    /**
     * Icon props that be passed to the `<Icon />` element.
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
     * The position of the text in button.
     */
    textPosition: PropTypes.oneOf(['center', 'left', 'right']),
    /**
     * Styles applied to the span element that wraps the children.
     */
    textStyle: PropTypes.object,
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
    type: PropTypes.oneOf(['contained', 'text', 'fab', 'icon']).isRequired,
  };

  static defaultProps = {
    ...ComponentBase.defaultProps,
    type: 'contained',
    text: 'Click',
    allowLabelCase: false,
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
        {...this.props}
        disabled={this.state.disabled}
        disableRipple={this.state.disabled}
        onClick={this.onClick}
      />
    );
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
