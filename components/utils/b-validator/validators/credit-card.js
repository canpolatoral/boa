import { ValidatorBase, ValidationError, ErrorMessage } from '../base';
import isCreditCard from 'validator/lib/isCreditCard';

export class CreditCard extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'CreditCardDefault');
  }

  validate(obj) {
    if (obj && (typeof obj !== 'string' || !isCreditCard(obj))) {
      return new ValidationError(this.getMessage());
    }
  }
}
