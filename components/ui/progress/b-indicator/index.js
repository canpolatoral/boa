import React from 'react'; import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BIndicator extends BComponent {

  static defaultProps = {
    ...BComponent.defaultProps,
    percentage: 0,
    size: 40,
    status: 'hide',
  }

  static propTypes = {
    ...BComponent.propTypes,
    /**
     * Override the theme's color of the indicator while it's status is
     * "ready" and it's percentage is less than 100.
     */
    color: PropTypes.string,
    /**
     * The absolute left position of the indicator in pixels.
     */
    left: PropTypes.number.isRequired,
    /**
     * Override the theme's color of the indicator while
     * it's status is "loading" or when it's percentage is 100.
     */
    loadingColor: PropTypes.string,
    /**
     * The confirmation progress to fetch data. Max value is 100.
     */
    percentage: PropTypes.number,
    /**
     * Size in pixels.
     */
    size: PropTypes.number,
    /**
     * The display status of the indicator. If the status is
     * "ready", the indicator will display the ready state
     * arrow. If the status is "loading", it will display
     * the loading progress indicator. If the status is "hide",
     * the indicator will be hidden.
     */
    status: PropTypes.oneOf(['ready', 'loading', 'hide']),
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The absolute top position of the indicator in pixels.
     */
    top: PropTypes.number.isRequired,
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <div> Dönüştürülmemiş </div>;
    // return (
    //   <BThemeProvider theme={this.props.context.theme}>
    //     <RefreshIndicator
    //       color={this.props.color}
    //       left={this.props.left}
    //       loadingColor={this.props.loadingColor}
    //       percentage={this.props.percentage}
    //       size={this.props.size}
    //       status={this.props.status}
    //       style={this.props.style}
    //       top={this.props.top}
    //       />
    //   </BThemeProvider>
    // );
  }
}

export default BIndicator;
