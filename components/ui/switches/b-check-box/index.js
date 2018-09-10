import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { BLabel } from 'b-label';
import merge from 'lodash/merge';

import { BComponent, BComponentComposer } from 'b-component';

const styles = theme => ({
  root: {
    margin: 0,
    height: 30
  },
  checked: {
    margin: 0,
    color: theme.boaPalette.pri500
  },
  disabled: {
    margin: 0,
    color: theme.boaPalette.base250
  },
  labelLTR: {
    color: theme.boaPalette.base450,
    fontSize: 14,
    marginLeft: 12,
    marginRight: 0,
    marginTop: -3
  },
  labelRTL: {
    color: theme.boaPalette.base450,
    fontSize: 14,
    marginLeft: 0,
    marginRight: 12,
    marginTop: -3
  }
});

@BComponentComposer
@withStyles(styles)
export class BCheckBox extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
     * If `true`, the component is checked.
     */
    checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * The icon to display when the component is checked.
     */
    checkedIcon: PropTypes.node,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object.isRequired,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    color: PropTypes.oneOf(['primary', 'secondary']),
    /**
     * @ignore
     */
    defaultChecked: PropTypes.bool,
    /**
     * If `true`, the switch will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * If `true`, the ripple effect will be disabled.
     */
    disableRipple: PropTypes.bool,
    /**
     * The icon to display when the component is unchecked.
     */
    icon: PropTypes.node,
    /**
     * The id of the `input` element.
     */
    id: PropTypes.string,
    /**
     * If `true`, the component appears indeterminate.
     */
    indeterminate: PropTypes.bool,
    /**
     * The icon to display when the component is indeterminate.
     */
    indeterminateIcon: PropTypes.node,
    /**
     * Properties applied to the `input` element.
     */
    inputProps: PropTypes.object,
    /**
     * Use that property to pass a ref callback to the native input component.
     */
    inputRef: PropTypes.func,
    /*
    * @ignore
    */
    name: PropTypes.string,
    /**
     * Callback fired when the state is changed.
     *
     * @param {object} event The event source of the callback
     * @param {boolean} checked The `checked` value of the switch
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * The input component property `type`.
     */
    type: PropTypes.string,
    /**
     * The value of the component.
     */
    value: PropTypes.string,

    errorText: PropTypes.string,

    errorTextVisible: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    color: 'primary',
    indeterminate: false,
    errorTextVisible: true
  };

  state = {
    isChecked: this.props.checked != undefined ? this.props.checked : this.props.defaultChecked || false,
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
    this.onCheck = this.onCheck.bind(this);
    this.state = {
      isChecked: this.props.checked != undefined ? this.props.checked : this.props.defaultChecked || false,
      disabled: this.props.disabled
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked || nextProps.disabled !== this.props.disabled) {
      this.setState({ isChecked: nextProps.checked, disabled: nextProps.disabled });
    } else if (nextProps.defaultChecked !== this.props.defaultChecked || nextProps.disabled !== this.props.disabled) {
      this.setState({ isChecked: nextProps.defaultChecked, disabled: nextProps.disabled });
    }
  }

  getValue() {
    return this.state.isChecked;
  }

  setValue(value) {
    this.setState({ isChecked: value });
  }

  resetValue() {
    this.setState({ isChecked: this.props.defaultChecked });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  onCheck(event, isInputChecked) {
    this.setState({ isChecked: isInputChecked });
    if (this.props.onCheck) {
      this.props.onCheck(event, isInputChecked, this.props.value);
    }
    if (this.props.onChange) {
      this.props.onChange(event, isInputChecked, this.props.value);
    }
  }

  render() {
    let errorStyle = {
      color: this.props.context.theme.boaPalette.error500,
      fontSize: 11,
      marginTop: 2,
      height: 16,
      textAlign: this.props.context.localization.isRightToLeft ? 'right' : 'left'
    };
    let style = { height: 24, width: 24, marginTop: -3 };

    let boxStyle = merge(style, this.props.style ? this.props.style : {});

    const { classes, label } = this.props;

    let _checkBox = (
      <Checkbox
        name={this.props.name}
        checked={this.state.isChecked}
        disabled={this.state.disabled}
        checkedIcon={this.props.checkedIcon ? this.props.checkedIcon : undefined}
        icon={this.props.icon}
        color={this.props.color}
        style={boxStyle}
        indeterminate={this.props.indeterminate}
        classes={{
          checked: classes.checked,
          disabled: classes.disabled
        }}
        onChange={this.onCheck}
      />
    );

    return label ? (
      <div style={{ display: 'inline-flex' }}>
        <FormControlLabel
          control={_checkBox}
          classes={{
            label: this.props.context.localization.isRightToLeft ? classes.labelRTL : classes.labelLTR,
            root: classes.root
          }}
          label={label}
        />
        {this.props.errorText && this.props.errorTextVisible ? (
          <BLabel style={errorStyle} context={this.props.context} text={this.props.errorText} />
        ) : null}
      </div>
    ) : (
      _checkBox
    );
  }
}

export default BCheckBox;
