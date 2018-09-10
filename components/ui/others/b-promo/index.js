import React from 'react'; import PropTypes from 'prop-types';

import { BComponent } from 'b-component';

export class BPromo extends BComponent {

  static defaultProps = {
    titlePosition: 'bottom'
  }

  static propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    description: PropTypes.string,
    descriptionStyle: PropTypes.object,
    iconPath: PropTypes.string,
    iconStyle: PropTypes.object,
    iconBlockStyle: PropTypes.object,
    titlePosition: PropTypes.string,
    style: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return this.renderTopBottomTitle();
    // if (this.props.titlePosition === 'top' || this.props.titlePosition === 'bottom')
    //   return this.renderTopBottomTitle();
    // else {
    //   return this.renderLeftRightTitle();
    // }
  }

  renderTopBottomTitle() {
    const itemBlock = {
      display: 'inline-block',
      textAlign: 'center'
    };
    const rootStyle = Object.assign(itemBlock, this.props.style);
    var iconBlockStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: '#D8D8D8',
      width: 100,
      height: 100,
      borderRadius: '50%'
    };
    iconBlockStyle = Object.assign(iconBlockStyle, this.props.iconBlockStyle);
    const iconImageBlock = {
      display: 'inline-block',
      padding: '20px 20px 20px'
    };
    var iconStyle = {
      width: 60,
      height: 60
    };
    iconStyle = Object.assign(iconStyle, this.props.iconStyle);

    var titleStyle = {
      margin: 5
    };
    titleStyle = Object.assign(titleStyle, this.props.titleStyle);
    var descriptionStyle = {
      margin: 5,
      fontSize: 15
    };
    descriptionStyle = Object.assign(descriptionStyle, this.props.descriptionStyle);

    if (this.props.titlePosition === 'bottom') {
      return (
        <div style={rootStyle}>
          <div style={iconBlockStyle}>
            <div style={iconImageBlock}>
              <img src={this.props.iconPath} style={iconStyle}></img>
            </div>
          </div>
          <h3 style={titleStyle}>{this.props.title}</h3>
          <label style={descriptionStyle}>{this.props.description} </label>
        </div>
      );
    } else {
      return (
        <div style={rootStyle}>
          <h3 style={titleStyle}>{this.props.title}</h3>
          <label style={descriptionStyle}>{this.props.description} </label>
          <div style={iconBlockStyle}>
            <div style={iconImageBlock}>
              <img src={this.props.iconPath} style={iconStyle}></img>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default BPromo;
