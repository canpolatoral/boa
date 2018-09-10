import { ValidatorBase, ValidationError, ErrorMessage } from '../base';

export class Regex extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'RegexDefault');
  }

  validate(obj) {
    if (obj && (typeof obj === 'string' || obj.toString)) {
      let value = typeof obj === 'string' ? obj : obj.toString();
      if (value) {
        let r = new RegExp(this.expression);
        if (!r.test(value)) {
          return new ValidationError(this.getMessage());
        }
      }
    }
  }
}
