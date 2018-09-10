import { ValidatorBase, ValidationError, ErrorMessage } from '../base';
import { BValidationHelper } from '../helper';

export class IBAN extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'IBANDefault');
  }

  validate(obj) {
    if (obj) {
      if (typeof obj !== 'string') {
        return new ValidationError(this.getMessage());
      }
      let validationErrorMessage = BValidationHelper.isValidIBAN(obj);
      if (validationErrorMessage) {
        return new ValidationError(this.getMessage());
      }
    }
  }
}
