import { ValidatorBase, ValidationError, ErrorMessage } from '../base';

export class MinLength extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'MinLengthDefault');
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

    if (length && length < this.minLength) {
      return new ValidationError(this.getMessage());
    }
  }
}
