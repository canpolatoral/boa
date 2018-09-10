import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { BComponent, BComponentComposer } from 'b-component';
import { withStyles } from '@material-ui/core/styles';
import { BIcon } from 'b-icon';
import _ from 'lodash';

const styles = () => ({
  label: {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit'
  }
});

@BComponentComposer
@withStyles(styles)
export class BButton extends BComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string,
    textStyle: PropTypes.object,
    textPosition: PropTypes.oneOf(['center', 'left', 'right']),
    buttonSize: PropTypes.oneOf(['small', 'medium', 'large']), // BComponentteki size ile conflict verdiğinden buttonSize olarak değiştirildi
    /**
     * Override the inline-styles of the button element.
     */
    tooltip: PropTypes.string,
    fontIcon: PropTypes.string,
    /**
     * If true, the button will take up the full width of its container.
     */
    fullWidth: PropTypes.bool,
    svgIcon: PropTypes.string,
    dynamicIcon: PropTypes.string,
    iconProperties: PropTypes.object,
    colorType: PropTypes.string,
    style: PropTypes.object,
    mini: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    allowLabelCase: PropTypes.bool,
    icon: PropTypes.any
  };

  static defaultProps = {
    allowLabelCase: false,
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

  static getItemIfExists(array, item) {
    return array && item && array.indexOf && array.indexOf(item) >= 0 ? item : undefined;
  }

  onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  getLabel() {
    let label = this.props.allowLabelCase ? this.props.text : BComponent.Localization.stringUpperCase(!this.props.text ? '' : this.props.text);
    return this.props.textStyle ? <div style={this.props.textStyle}>{label}</div> : label;
  }

  createButtonElement(variant) {
    let props = this.props;
    if (variant != 'fab') {
      props = Object.assign({}, props);
      let iconStyle = this.getLabel() == null || this.getLabel() == '' ? null : { marginRight: 8 };
      let iconProp = props.iconProperties;
      if (iconProp) {
        iconProp.style = _.merge(iconStyle, iconProp.style);
      } else {
        props.iconProperties = { style: iconStyle };
      }
    }
    let icon = BIcon.getIcon(props);
    let buttonStyle = {
      justifyContent: this.props.textPosition == 'right' ? 'flex-end' : this.props.textPosition,
      textAlign: this.props.textPosition,
      textTransform: this.props.allowLabelCase ? 'none' : '',
      ...this.props.style
    };

    return (
      <Button
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
      </Button>
    );
  }

  createIconButtonElement() {
    return (
      <IconButton
        tooltip={this.props.tooltip}
        style={this.props.style}
        disabled={this.state.disabled}
        disableRipple={this.state.disabled}
        onClick={this.onClick.bind(this)}
      >
        {BIcon.getIcon(this.props)}
      </IconButton>
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

export default BButton;
