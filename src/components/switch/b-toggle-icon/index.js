import React from 'react'; 
import PropTypes from 'prop-types';
import { BComponent } from 'b-component';

export class BToggleIcon extends BComponent {
  static propTypes = {
    defaultToggled: PropTypes.bool,
    disabled: PropTypes.bool,
    elementStyle: PropTypes.object,
    iconStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    label: PropTypes.node,
    labelPosition: PropTypes.oneOf(['left', 'right']),
    labelStyle: PropTypes.object,
    onToggle: PropTypes.func,
    rippleStyle: PropTypes.object,
    style: PropTypes.object,
    thumbStyle: PropTypes.object,
    thumbSwitchedStyle: PropTypes.object,
    toggled: PropTypes.bool,
    trackStyle: PropTypes.object,
    trackSwitchedStyle: PropTypes.object,
    valueLink: PropTypes.object,
    title: PropTypes.string,
    iconPath: PropTypes.string
  };

  static defaultProps = {
    defaultToggled: false,
    disabled: false,
    labelPosition: 'left'

  };

  constructor(props, context) {
    super(props, context);
    this.state = { disabled: this.props.disabled };
    if (this.props.context.localization.isRightToLeft) {
      // Burası şimdilik right left özelliğini desteklemiyor
      this.isRightToLeft = false;
    }
    else {
      this.isRightToLeft = false;
    }

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

    return <div> Dönüştürülmemiş </div>;

    // return (
    //   <BThemeProvider theme={this.props.context.theme}>
    //     <div style={mainToggleImageBlock}>
    //       <div style={iconBlock}>
    //         <div style={iconImageBlock}>
    //           <img src={this.props.iconPath} style={iconStyle}></img>
    //         </div>
    //       </div>
    //       <div style={toggleBlock}>
    //         <div style={titleBlock}>{this.props.title}</div>
    //         <div style= {toggleStyle}>
    //           <Toggle
    //             defaultToggled={this.props.defaultToggled}
    //             disabled={this.state.disabled}
    //             elementStyle={this.props.elementStyle}
    //             iconStyle={this.props.iconStyle}
    //             inputStyle={this.props.inputStyle}
    //             label={this.props.label}
    //             labelPosition={this.props.labelPosition}
    //             labelStyle={labelStyle}
    //             onToggle={this.props.onToggle}
    //             rippleStyle={this.props.rippleStyle}
    //             style={this.props.style}
    //             thumbStyle={this.props.thumbStyle}
    //             thumbSwitchedStyle={this.props.thumbSwitchedStyle}
    //             trackStyle={this.props.trackStyle}
    //             trackSwitchedStyles={this.props.trackSwitchedStyles}
    //             valueLink={this.props.valueLink} />
    //         </div>
    //       </div>
    //     </div>
    //   </BThemeProvider>
    // );
  }
}

export default BToggleIcon;
