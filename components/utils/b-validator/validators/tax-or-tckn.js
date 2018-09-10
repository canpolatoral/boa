import { ValidatorBase, ValidationError, ErrorMessage } from '../base';
import { BValidationHelper } from '../helper';

export class TaxOrTCKN extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'TaxOrTCKNDefault');
  }

  validate(obj) {
    if (obj) {
      if (typeof obj !== 'string' || obj.length > 11 || obj.length < 10) {
        return new ValidationError(this.getMessage());
      }
      if (obj.length === 10 && !BValidationHelper.isValidTaxNumber(obj)) {
        return new ValidationError(this.getMessage());
      } else if (obj.length === 11 && !BValidationHelper.isValidTCNumber(obj)) {
        return new ValidationError(this.getMessage());
      }
    }
  }
}
