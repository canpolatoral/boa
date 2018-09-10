import { ValidatorBase, ValidationError, ErrorMessage } from '../../base';
import { BValidationHelper } from '../../helper';

export class Condition extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'ConditionDefault');
  }

  validate([...parameters]) {
    if (!parameters || parameters.length !== 2) {
      return undefined;
    }

    let firstParameter = parameters[0];
    let secondParameter = parameters[1];

    if (firstParameter == null || firstParameter == undefined || secondParameter == null | secondParameter == undefined)
      return undefined;

    let firstCompareValue = this.validation.firstCompareValue;
    let secondCompareValue = this.validation.secondCompareValue;
    let condition = this.validation.condition;
    let validation = this.validation.validation;

    if (!condition || !validation) {
      return undefined;
    }

    let isValidationRequired = BValidationHelper.checkParameter(condition, firstParameter, firstCompareValue);
    if (isValidationRequired) {
      let isValid = BValidationHelper.checkParameter(validation, secondParameter, secondCompareValue);
      if (isValid == false)
        return new ValidationError(this.getMessage());
    }
  }

}
