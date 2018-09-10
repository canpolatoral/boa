import React from 'react'; import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';

import { BComponent } from 'b-component';

export class BCaptcha extends BComponent {

  static propTypes = {
    /**
     * The API client key.
     */
    sitekey: PropTypes.string.isRequired,
    /**
     * The function to be called when the user successfully completes the captcha.
     */
    onChange: PropTypes.func.isRequired,
    /**
     * Using that component will oblige you to manage the grecaptcha dep and load the script by yourself.
     */
    grecaptcha: PropTypes.object,
    /**
     * light or dark The theme of the widget. Default light.
     */
    theme: PropTypes.oneOf(['dark', 'light']),
    /**
     * image or audio The type of initial captcha. Default image.
     */
    type: PropTypes.oneOf(['image', 'audio']),
    /**
     * The tabindex on the element. Default 0.
     */
    tabindex: PropTypes.number,
    /**
     * Callback when the challenge is expired and has to be redone by user. By default it will call the onChange with null to signify expired callback.
     */
    onExpired: PropTypes.func,
    /**
     * compact, normal or invisible. This allows you to change the size or do an invisible captcha. Default normal.
     */
    size: PropTypes.oneOf(['compact', 'normal', 'invisible']),
    /**
     * Set the stoken parameter, which allows the captcha to be used from different domains, see reCAPTCHA secure-token.
     */
    stoken: PropTypes.string,
    /**
     * bottomright, bottomleft or inline. Positions reCAPTCHA badge. Only for invisible reCAPTCHA. Default bottomright.
     */
    badge: PropTypes.oneOf(['bottomright', 'bottomleft', 'inline']),
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object
  };

  static defaultProps = {
    theme: 'light',
    type: 'image',
    tabindex: 0,
    size: 'normal',
    badge: 'bottomright',
  };

  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.debugLog('Captcha value: ' + value);
    this.props.onChange && this.props.onChange(value);
  }

  getValue() {
    return this.recaptcha && this.recaptcha.getValue();
  }

  reset() {
    return this.recaptcha && this.recaptcha.reset();
  }

  render() {
    return (
      <div style={this.props.style}>
        <ReCAPTCHA
          ref={r => this.recaptcha = r}
          sitekey={this.props.sitekey}
          onChange={this.onChange}
          grecaptcha={this.props.grecaptcha}
          theme={this.props.theme}
          type={this.props.type}
          tabindex={this.props.tabindex}
          onExpired={this.props.onExpired}
          size={this.props.size}
          stoken={this.props.stoken}
          badge={this.props.badge}
        />
      </div>
    );
  }
}

export default BCaptcha;
