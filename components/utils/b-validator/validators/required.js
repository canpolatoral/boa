import { ValidatorBase, ValidationError, ErrorMessage } from '../base';

export class Required extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'RequiredDefault');
    this.allowEmptyString = false;
  }

  validate(obj) {
    if (obj == null || obj == undefined) {
      return new ValidationError(this.getMessage());
    }
    if (typeof obj === 'string' && this.allowEmptyString === false && obj.trim() === '') {
      return new ValidationError(this.getMessage());
    }
  }
}
