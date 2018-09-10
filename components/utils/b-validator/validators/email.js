import { ValidatorBase, ValidationError, ErrorMessage } from '../base';
import isEmail from 'validator/lib/isEmail';

export class Email extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'EmailDefault');
  }

  validate(obj) {
    if (obj && (typeof obj !== 'string' || !isEmail(obj))) {
      return new ValidationError(this.getMessage());
    }
  }
}
