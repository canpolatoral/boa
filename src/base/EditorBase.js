import isEqual from 'lodash/isEqual';
import { ComponentBase } from './ComponentBase';

export class EditorBase extends ComponentBase {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    ...ComponentBase.propTypes
  }

  static defaultProps = {
    ...ComponentBase.defaultProps,
  }

  validateConstraint() {
    const { valueConstraint } = this.props;
    let result = true;

    if (!valueConstraint || !this.props.isVisible) {
      return result;
    }

    const value = this.getValue ? this.getValue() : null;
    let newValidationResult = [];

    if (valueConstraint.required == true) {
      const message = this.isNullOrEmpty(value);
      message && newValidationResult.push({ key: 'required', message: message });
    }

    if (valueConstraint.minLength) {
      const message = this.checkLength(value, { min: valueConstraint.minLength });
      message && newValidationResult.push({ key: 'minLength', message: message });
    }

    if (valueConstraint.maxLength) {
      const message = this.checkLength(value, { max: valueConstraint.maxLength });
      message && newValidationResult.push({ key: 'maxLength', message: message });
    }

    result = newValidationResult.length > 0 ? false : true;

    if (!this.validationResult || !isEqual(this.validationResult.sort(), newValidationResult.sort())) {
      this.validationResult = newValidationResult;
      this.forceUpdate();
    }

    return result;
  }

  isNullOrEmpty(value) {
    if (value == null || value == undefined) {
      return this.getMessage('BOA', 'Nullable');
    }
    if (typeof value === 'string' && value.trim() === '') {
      return this.getMessage('BOA', 'Nullable');
    }
    return null;
  }

  checkLength(value, options) {
    if (!value || typeof value !== 'string' || !options) {
      return null;
    }

    let min = options.min ? options.min < 0 ? 0 : options.min : 0;
    let max = options.max ? options.max < 0 ? 0 : options.max : 0;

    var len = value.length || 0;

    if (len < min) {
      return this.getMessage('BOA', 'MinLength').replace('{0}', min);
    }
    if (max && len > max) {
      return this.getChildId('BOA', 'MaxLength').replace('{0}', max);
    }
    return null;
  }
}
