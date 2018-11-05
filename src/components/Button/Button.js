import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { withStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';
import MuiIconButton from '@material-ui/core/IconButton';
import {
  ComponentBase,
  ComponentComposer,
} from '@boa/base'; // eslint-disable-line import/no-unresolved
import { Localization } from '@boa/utils'; // eslint-disable-line import/no-unresolved
import { Icon } from '@boa/components/Icon'; // eslint-disable-line import/no-unresolved

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
     * Button type should be `contained`, `flat`, `fab` or `icon`.
     */
    type: PropTypes.oneOf(['contained', 'flat', 'fab', 'icon']).isRequired,
  };

  static defaultProps = {
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
    this.onClick = this.onClick.bind(this);
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

  getLabel() {
    const { allowLabelCase, text, textStyle } = this.props;
    const label = allowLabelCase ? text : Localization.stringUpperCase(!text ? '' : text);
    return textStyle ? <div style={textStyle}>{label}</div> : label;
  }

  createButtonElement(variant) {
    let props = this.props;
    const { textPosition, allowLabelCase, style } = this.props;
    if (variant !== 'fab') {
      props = Object.assign({}, props);
      const iconStyle = !this.getLabel() ? null : { marginRight: 8 };
      const iconProp = props.iconProperties;
      if (iconProp) {
        iconProp.style = merge(iconStyle, iconProp.style);
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
        disableFocusRipple={this.state.disabled}
        onClick={this.onClick.bind}
        variant={variant}
        size={this.props.buttonSize}
        mini={this.props.mini}
      >
        {icon}
        {this.getLabel()}
      </MuiButton>
    );
  }

  createIconButtonElement() {
    return (
      <MuiIconButton
        tooltip={this.props.tooltip}
        style={this.props.style}
        disabled={this.state.disabled}
        disableRipple={this.state.disabled}
        onClick={this.onClick.bind}
      >
        {Icon.getIcon(this.props)}
      </MuiIconButton>
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
