import { ValidatorBase, ValidationError, ErrorMessage } from '../../base';

export class MinimumRequired extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'MinimumRequiredDefault');
  }

  validate([...parameters]) {
    let nullCounter = 0;

    if (parameters == null) {
      return new ValidationError(this.getMessage());
    }

    for (let i = 0; i < parameters.length; i++) {
      let value = parameters[i];
      if (value == null || value == undefined) {
        nullCounter++;
      }
    }

    let notNullCounter = parameters.length - nullCounter;
    return (notNullCounter >= this.minimumRequired) ? null : new ValidationError(this.getMessage());
  }
}
