import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import { BComponent, BComponentComposer } from 'b-component';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  checked: {
    color: theme.boaPalette.pri500
  },
  disabled: {
    color: theme.boaPalette.base250
  },
  formControlRoot: {
    marginLeft: 0,
    marginBottom: 6,
    marginTop: 6,
    height: 24
  },
  formControlRootRTL: {
    marginLeft: 16,
    marginRight: 0,
    marginBottom: 6,
    marginTop: 6,
    height: 24,
    flexDirection: 'row-reverse'
  },
  radioRoot: {
    height: 24,
    width: 24,
    marginRight: 12
  },
  radioRootRTL: {
    height: 24,
    width: 24,
    marginRight: 0,
    marginLeft: 12
  },
  controlContent: {
    display: 'flex',
    alignItems: 'center'
  }
});

@BComponentComposer
@withStyles(styles)
export class BRadioButton extends BComponent {
  static propTypes = {
    /**
     * Base properties from BComponent
     */
    ...BComponent.propTypes,
    /**
     * The text to be used in an enclosing label element.
     */
    label: PropTypes.node,
    labelPosition: PropTypes.string,
    labelStyle: PropTypes.object,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    content: PropTypes.element,
    name: PropTypes.string,
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
    uncheckedIcon: PropTypes.node,
    /**
     * The id of the `input` element.
     */
    id: PropTypes.string,
    /**
     * Properties applied to the `input` element.
     */
    inputProps: PropTypes.object,
    /**
     * Use that property to pass a ref callback to the native input component.
     */
    inputRef: PropTypes.func,
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
    value: PropTypes.any,

    errorText: PropTypes.string,

    errorTextVisible: PropTypes.bool
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    color: 'primary',
    checkedIcon: <RadioButtonChecked />,
    uncheckedIcon: <RadioButtonUnchecked />,
    errorTextVisible: true,
    labelPosition: 'right'
  };

  state = {
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  getValue() {
    return this.props.value;
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  render() {
    const { classes } = this.props;

    let isRight = false;
    if (this.props.context.localization.isRightToLeft) isRight = this.props.labelPosition === 'left' ? true : false;
    else isRight = this.props.labelPosition === 'right' ? true : false;

    let radio = (
      <Radio
        key={this.props.key}
        context={this.props.context}
        checked={this.props.checked}
        disabled={this.state.disabled}
        color={this.props.color}
        checkedIcon={this.props.checkedIcon}
        disableRipple={this.props.disableRipple}
        icon={this.props.uncheckedIcon}
        value={this.props.value}
        classes={{
          root: isRight ? classes.radioRoot : classes.radioRootRTL,
          checked: classes.checked,
          disabled: classes.disabled
        }}
        onChange={this.props.onChange}
      />
    );

    return (
      <FormControlLabel
        value={this.props.value}
        label={this.props.label}
        classes={{ root: isRight ? classes.formControlRoot : classes.formControlRootRTL }}
        control={
          this.props.content ? (
            <div className={classes.controlContent}>
              {radio}
              {this.props.content}
            </div>
          ) : (
            radio
          )
        }
      />
    );
  }
}

export default BRadioButton;
