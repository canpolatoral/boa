import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, LinearProgress } from '@material-ui/core';
import { BComponent, BComponentComposer } from 'b-component';
@BComponentComposer
export class BProgress extends BComponent {

  static defaultProps = {
    ...BComponent.defaultProps,
    progressType: 'circular',
    mode: 'indeterminate',
    value: 0,
    min: 0,
    max: 100,
  }

  static propTypes = {
    ...BComponent.propTypes,
    /**
     * Specifies the type of progress to display such as 'circular' or 'linear'
     */
    progressType: PropTypes.oneOf(['circular', 'linear']),
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    color: PropTypes.oneOf(['primary', 'secondary', 'inherit']),
    /**
     * The max value of progress, only works in determinate mode.
     */
    max: PropTypes.number,
    /**
     * The min value of progress, only works in determinate mode.
     */
    min: PropTypes.number,
    /**
     * The mode of show your progress, indeterminate
     * for when there is no value for progress.
     */
    mode: PropTypes.oneOf(['determinate', 'indeterminate', 'static']),
    /**
     * The diameter of the progress in pixels.
     */
    size: PropTypes.number,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Stroke width in pixels.
     */
    thickness: PropTypes.number,
    /**
     * The value of progress, only works in determinate mode.
     */
    value: PropTypes.number
  }

  constructor(props, context) {
    super(props, context);
  }

  renderCircularProgress() {
    return (
      <CircularProgress
        color={this.props.color}
        max={this.props.max}
        min={this.props.min}
        variant={this.props.mode}
        size={this.props.size}
        style={this.props.style}
        thickness={this.props.thickness}
        value={this.props.value}
      />
    );
  }

  renderLinearProgress() {
    return (
      <LinearProgress
        color={this.props.color}
        max={this.props.max}
        min={this.props.min}
        variant={this.props.mode}
        style={this.props.style}
        value={this.props.value}
      />
    );
  }

  render() {
    if (this.props.progressType === 'circular')
      return this.renderCircularProgress();
    else {
      return this.renderLinearProgress();
    }
  }
}

export default BProgress;
