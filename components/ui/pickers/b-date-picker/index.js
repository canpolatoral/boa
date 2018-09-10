import React from 'react'; 
import PropTypes from 'prop-types';
import DatePicker from '@material-ui/core/DatePicker';
import { BComponent } from 'b-component';
import { BThemeProvider } from 'b-component';

export class BDatePicker extends BComponent {

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
      this.setState({ disabled: nextProps.disabled});
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  render() {
    return (
      <BThemeProvider theme={this.props.context.theme}>
        <DatePicker
            hintText={this.props.hintText}
            mode={this.props.mode}
            container={this.props.container}
            value={this.state.value}
            onChange={this.onChange}
            floatingLabelText={this.props.floatingLabelText}
            errorText={this.props.errorText}
            disabled={this.state.disabled}
            firstDayOfWeek={this.props.firstDayOfWeek}
            autoOk={this.props.autoOk}
            okLabel={this.props.okLabel}
            cancelLabel={this.props.cancelLabel}
            formatDate={this.props.formatDate}
            fullWidth={this.props.fullWidth}
            />
      </BThemeProvider>
    );
  }

  onChange(event, value) {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  getValue () {
    return this.state.value;
  }
}

BDatePicker.propTypes = {
  ...BComponent.propTypes,
  value: PropTypes.object,
  onChange: PropTypes.func,
  hintText: PropTypes.string,
  mode: PropTypes.oneOf(['landscape', 'portrait']),
  container: PropTypes.oneOf(['dialog', 'inline']),
  errorText: PropTypes.string,
  floatingLabelText: PropTypes.string,
  disabled: PropTypes.bool,
  firstDayOfWeek: PropTypes.number,
  autoOk: PropTypes.bool,
  cancelLabel: PropTypes.string,
  okLabel: PropTypes.string,
  formatDate: PropTypes.func,
  fullWidth: PropTypes.bool
};

BDatePicker.defaultProps = {
  ...BComponent.defaultProps,
  disabled: false,
  firstDayOfWeek: 1,
  mode: 'portrait',
  container: 'dialog',
  cancelLabel: 'CANCEL',
  okLabel: 'OK',
  fullWidth: true
};

export default BDatePicker;
