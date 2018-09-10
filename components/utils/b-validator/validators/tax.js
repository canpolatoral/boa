import { ValidatorBase, ValidationError, ErrorMessage } from '../base';
import { BValidationHelper } from '../helper';

export class TaxNumber extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'TaxNumberDefault');
  }

  validate(obj) {
    if (obj) {
      if (typeof obj !== 'string' || !BValidationHelper.isValidTaxNumber(obj)) {
        return new ValidationError(this.getMessage());
      }
    }
  }

}
