import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from '@material-ui/core/TimePicker';
import { BComponent } from 'b-component';

export class BTimePicker extends BComponent {
  state = {
    value: this.props.value,
    disabled: this.props.disabled
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  render() {
    return (
      <TimePicker
        hintText={this.props.hintText}
        mode={this.props.mode}
        value={this.state.value}
        onChange={this.onChange}
        floatingLabelText={this.props.floatingLabelText}
        errorText={this.props.errorText}
        disabled={this.state.disabled}
        format={this.props.format}
        autoOk={this.props.autoOk}
        okLabel={this.props.okLabel}
        cancelLabel={this.props.cancelLabel}
      />
    );
  }

  onChange(event, value) {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
}

BTimePicker.propTypes = {
  ...BComponent.propTypes,
  value: PropTypes.object,
  onChange: PropTypes.func,
  hintText: PropTypes.string,
  mode: PropTypes.oneOf(['landscape', 'portrait']),
  errorText: PropTypes.string,
  floatingLabelText: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.oneOf(['ampm', '24hr']),
  autoOk: PropTypes.bool,
  cancelLabel: PropTypes.string,
  okLabel: PropTypes.string
};

BTimePicker.defaultProps = {
  ...BComponent.defaultProps,
  disabled: false,
  firstDayOfWeek: 1,
  mode: 'portrait',
  format: '24hr'
};

export default BTimePicker;
