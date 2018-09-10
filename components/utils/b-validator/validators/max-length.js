import { ValidatorBase, ValidationError, ErrorMessage } from '../base';

export class MaxLength extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'MaxLengthDefault');
  }

  validate(obj) {
    if (!obj) {
      return undefined;
    }

    let length;
    if (obj.length) {
      length = obj.length;
    } else if (obj.toString && obj.toString().length) {
      length = obj.toString().length;
    }

    if (length && length > this.maxLength) {
      return new ValidationError(this.getMessage());
    }

  }
}
