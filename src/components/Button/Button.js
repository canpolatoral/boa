import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { withStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';
import MuiIconButton from '@material-ui/core/IconButton';

import { ComponentBase, ComponentComposer } from 'b-component';
import { Localization } from 'b-localization';
import { Icon } from 'b-icon';


const styles = () => ({
  label: {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit'
  }
});

/**
 * BOA Button Component
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
     * Button type should be `raised`, `flat`, `fab` or `icon`.
     */
    type: PropTypes.oneOf(['raised', 'flat', 'fab', 'icon']).isRequired,
    /**
     * Button content.
     */
    text: PropTypes.string,
    /**
     * Styles applied to the span element that wraps the children.
     */
    textStyle: PropTypes.object,
    /**
     * Text position on the button.
     */
    textPosition: PropTypes.oneOf(['center', 'left', 'right']),
    /**
     * Size of button.
     */
    buttonSize: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * If type 'icon' tooltip will generate on icon button
     */
    tooltip: PropTypes.string,
    /**
     * Font icon name from font icon's library.
     */
    fontIcon: PropTypes.string,
    /**
     * If true, the button will take up the full width of its container.
     */
    fullWidth: PropTypes.bool,
    /**
     * SVG Icon name from material svg icon library.
     */
    svgIcon: PropTypes.string,
    /**
     * Icon name from BOA icon library.
     */
    dynamicIcon: PropTypes.string,
    /**
     * Icon props
     */
    iconProperties: PropTypes.object,
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    colorType: PropTypes.string,
    /**
     * Override the style of element
     */
    style: PropTypes.object,
    /**
     * If `true`, and `variant` is `'fab'`, will use mini floating action button styling.
     */
    mini: PropTypes.bool,
    /**
     * If `true`, the button will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * @ignore
     */
    onClick: PropTypes.func,
    /**
     * If `false` , content of the button wil be upper case
     */
    allowLabelCase: PropTypes.bool,
    /**
     * Custom icon
     */
    icon: PropTypes.any
  };

  static defaultProps = {
    type: 'raised',
    text: 'click',
    allowLabelCase: true,
    textPosition: 'center',
    buttonSize: 'medium'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: props.disabled
    };
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
    let label = this.props.allowLabelCase ? this.props.text : Localization.stringUpperCase(!this.props.text ? '' : this.props.text);
    return this.props.textStyle ? <div style={this.props.textStyle}>{label}</div> : label;
  }

  createButtonElement(variant) {
    let props = this.props;
    if (variant != 'fab') {
      props = Object.assign({}, props);
      let iconStyle = this.getLabel() == null || this.getLabel() == '' ? null : { marginRight: 8 };
      let iconProp = props.iconProperties;
      if (iconProp) {
        iconProp.style = merge(iconStyle, iconProp.style);
      } else {
        props.iconProperties = { style: iconStyle };
      }
    }
    let icon = Icon.getIcon(props);
    let buttonStyle = {
      justifyContent: this.props.textPosition == 'right' ? 'flex-end' : this.props.textPosition,
      textAlign: this.props.textPosition,
      textTransform: this.props.allowLabelCase ? 'none' : '',
      ...this.props.style
    };

    return (
      <MuiButton
        style={buttonStyle}
        fullWidth={this.props.fullWidth}
        color={this.props.colorType}
        disabled={this.state.disabled}
        disableRipple={this.state.disabled}
        disableFocusRipple={this.state.disabled}
        onClick={this.onClick.bind(this)}
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
        onClick={this.onClick.bind(this)}
      >
        {Icon.getIcon(this.props)}
      </MuiIconButton>
    );
  }

  createButton() {
    if (this.props.type && this.props.type == 'icon') {
      return this.createIconButtonElement();
    } else {
      return this.createButtonElement(this.props.type);
    }
  }

  render() {
    return this.createButton();
  }
}

export default Button;
