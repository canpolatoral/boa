import { ValidatorBase, ValidationError, ErrorMessage } from '../../base';
import { BValidationHelper } from '../../helper';

export class Compare extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'CompareDefault');
  }

  validate([...parameters]) {
    if (!parameters || parameters.length !== 2 || !this.validation || !this.validation.condition) {
      return new ValidationError(this.getMessage());
    }
    let param1 = parameters[0];
    let param2 = parameters[1];

    if (param1 == null || param1 == undefined || param2 == null || param2 == undefined) {
      return undefined;
    }

    let firstType = Object.prototype.toString.call(param1);
    let secondType = Object.prototype.toString.call(param2);

    if (firstType !== secondType) {
      return undefined;
    }

    let result = BValidationHelper.compare(this.validation.condition, param1, param2);
    if (!result) {
      return new ValidationError(this.getMessage());
    }
  }
}
