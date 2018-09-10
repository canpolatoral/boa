import React from 'react';
import PropTypes from 'prop-types';
// import Slider from './Slider';
import { BComponent } from 'b-component';

export class BSlider extends BComponent {
  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    if (this.props.context.localization.isRightToLeft) {
      let newAxis;
      if (props.axis == 'x') newAxis = 'x-reverse';
      else if (props.axis == 'x-reverse') newAxis = 'x';
      else if (props.axis == 'y') newAxis = 'y-reverse';
      else if (props.axis == 'y-reverse') newAxis = 'y';
      this.state = { axis: newAxis, disabled: props.disabled };
    } else {
      this.state = { axis: props.axis, disabled: props.disabled };
    }
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
      <div>
        <div
          context={this.props.context}
          axis={this.state.axis}
          defaultValue={this.props.defaultValue}
          disableFocusRipple={this.props.disableFocusRipple}
          disabled={this.state.disabled}
          max={this.props.max}
          min={this.props.min}
          name={this.props.name}
          required={this.props.required}
          sliderStyle={this.props.sliderStyle}
          step={this.props.step}
          style={this.props.style}
          value={this.props.value}
          onChange={this.props.onChange}
          onDragStart={this.props.onDragStart}
          onDragStop={this.props.onDragStop}
        />

        <div>
          İlerde gelecek {' '}
          <a target="_blank" href="https://github.com/mui-org/@material-ui/core/issues/4793#issuecomment-320872975">
            Detay
          </a>
        </div>
      </div>
    );
  }

  onChange(event, value) {
    if (this.props.onChange) {
      this.props.onChange(event, value);
    }
  }

  onDragStart(event) {
    if (this.props.onDragStart) {
      this.props.onDragStart(event);
    }
  }

  onDragStop(event) {
    if (this.props.onDragStop) {
      this.props.onDragStop(event);
    }
  }
}

BSlider.propTypes = {
  axis: PropTypes.oneOf(['x', 'x-reverse', 'y', 'y-reverse']),
  defaultValue: PropTypes.valueInRangePropType,
  disableFocusRipple: PropTypes.bool,
  disabled: PropTypes.bool,
  max: PropTypes.minMaxPropType,
  min: PropTypes.minMaxPropType,
  name: PropTypes.string,
  required: PropTypes.bool,
  sliderStyle: PropTypes.object,
  step: PropTypes.number,
  style: PropTypes.object,
  value: PropTypes.valueInRangePropType,
  onChange: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragStop: PropTypes.func
};

export default BSlider;
