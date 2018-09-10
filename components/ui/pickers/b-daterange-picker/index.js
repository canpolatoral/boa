import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from '@material-ui/core/DatePicker';
import { BComponent } from 'b-component';
import { BThemeProvider } from 'b-component';
import { BIconButton } from 'b-icon-button';

export class BDateRangePicker extends BComponent {
  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);

    const minDate = new Date();
    const maxDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    minDate.setHours(0, 0, 0, 0);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    maxDate.setHours(0, 0, 0, 0);
    this.state = {
      minDate: minDate,
      maxDate: maxDate,
      autoOk: false,
      disableYearSelection: false,
      disabled: this.props.disabled
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({ disabled: nextProps.disabled});
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  onChange(event, value) {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  getValue() {
    return { minDate: this.state.minDate, maxDate: this.state.maxDate };
  }

  handleRemoveButtonMin = (e) => {
    var minD = new Date(this.getValue().minDate);
    minD.setDate(minD.getDate() - 1);
    this.handleChangeMinDate(e, minD);
  }
  handleAddButtonMin = (e) => {
    var minD = new Date(this.getValue().minDate);
    minD.setDate(minD.getDate() + 1);
    this.handleChangeMinDate(e, minD);
  }

  handleRemoveButtonMax = (e) => {
    var maxD = new Date(this.getValue().maxDate);
    maxD.setDate(maxD.getDate() - 1);
    this.handleChangeMaxDate(e, maxD);
  }

  handleAddButtonMax = (e) => {
    var maxD = new Date(this.getValue().maxDate);
    maxD.setDate(maxD.getDate() + 1);
    this.handleChangeMaxDate(e, maxD);
  }

  handleChangeMinDate = (event, date) => {
    this.setState({
      minDate: date,
    });
  };

  handleChangeMaxDate = (event, date) => {
    this.setState({
      maxDate: date,
    });
  };

  render() {
    return (
      <BThemeProvider theme={this.props.context.theme}>
        <div>
          <div style={{ float: 'left', marginTop: 1}}>
            <div style={{ float: 'left', marginTop: 24}}>
              <BIconButton
                context={this.props.context}
                dynamicIcon="ContentAddCircleOutline"
                onClick={this.handleAddButtonMin}
                disabled={this.state.disabled}
                />
            </div>
            <div style={{ float: 'left', marginTop: 0}}>
              <DatePicker
                  style={{ maxWidth: 80 }}
                  onChange={this.handleChangeMinDate, this.onChange}
                  autoOk={this.state.autoOk}
                  floatingLabelText="Min Date"
                  defaultDate={this.state.minDate}
                  value={this.state.minDate}
                  disableYearSelection={this.state.disableYearSelection}
                  textFieldStyle={{ maxWidth: 200 }}
                  hintText={this.props.hintText}
                  mode={this.props.mode}
                  container={this.props.container}
                  errorText={this.props.errorText}
                  disabled={this.state.disabled}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  okLabel={this.props.okLabel}
                  cancelLabel={this.props.cancelLabel}
                  formatDate={this.props.formatDate}
                  fullWidth={this.props.fullWidth}
                  />
            </div>
            <div style={{ float: 'left', marginTop: 24, marginLeft: 10 }}>
              <BIconButton
                context={this.props.context}
                dynamicIcon="ContentRemoveCircleOutline"
                onClick={this.handleRemoveButtonMin}
                disabled={this.state.disabled}
                />
            </div>
          </div>
          <div style={{ float: 'left', marginTop: 1}}>
            <div style={{ float: 'left', marginTop: 24, marginLeft: 0 }}>
              <BIconButton
                context={this.props.context}
                dynamicIcon="ContentAddCircleOutline"
                onClick={this.handleAddButtonMax}
                disabled={this.state.disabled}
                />
            </div>
            <div style={{ float: 'left', marginTop: 0}}>
              <DatePicker
                  style={{ maxWidth: 80 }}
                  onChange={this.handleChangeMaxDate, this.onChange}
                  autoOk={this.state.autoOk}
                  floatingLabelText="Max Date"
                  defaultDate={this.state.maxDate}
                  value={this.state.maxDate}
                  disableYearSelection={this.state.disableYearSelection}
                  textFieldStyle={{ maxWidth: 120 }}
                  hintText={this.props.hintText}
                  mode={this.props.mode}
                  container={this.props.container}
                  errorText={this.props.errorText}
                  disabled={this.state.disabled}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  okLabel={this.props.okLabel}
                  cancelLabel={this.props.cancelLabel}
                  formatDate={this.props.formatDate}
                  fullWidth={this.props.fullWidth}
                  />
            </div>
            <div style={{ float: 'left', marginTop: 24, marginLeft: 10}}>
              <BIconButton
                context={this.props.context}
                dynamicIcon="ContentRemoveCircleOutline"
                onClick={this.handleRemoveButtonMax}
                disabled={this.state.disabled}
                />
            </div>
          </div>
        </div>
      </BThemeProvider >
    );
  }
}

BDateRangePicker.propTypes = {
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
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
  textFieldStyle: PropTypes.object
};

BDateRangePicker.defaultProps = {
  disabled: false,
  firstDayOfWeek: 1,
  mode: 'portrait',
  container: 'dialog',
  cancelLabel: 'CANCEL',
  okLabel: 'OK',
  fullWidth: true
};

export default BDateRangePicker;
