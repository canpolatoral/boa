import { ValidatorBase, ValidationError, ErrorMessage } from '../base';
import { BValidationHelper } from '../helper';

export class TCKN extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'TCKNDefault');
  }

  validate(obj) {
    if (obj) {
      if (typeof obj !== 'string' || !BValidationHelper.isValidTCNumber(obj)) {
        return new ValidationError(this.getMessage());
      }
    }
  }
}
