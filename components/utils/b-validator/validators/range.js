import { ValidatorBase, ValidationError, ErrorMessage } from '../base';

export class Range extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'RangeDefault');
  }

  validate(obj) {
    if (obj != null && obj != undefined && (this.minimum && obj < this.minimum) || (this.maximum && obj > this.maximum)) {
      return new ValidationError(this.getMessage());
    }
  }
}
