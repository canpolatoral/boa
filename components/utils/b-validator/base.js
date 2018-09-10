import { getFrameworkMessage } from 'b-messaging';

class ErrorMessage {
  constructor(groupName, propertyName) {
    this.propertyName = propertyName;
    this.groupName = groupName;
  }
}

class ValidationError {

  constructor(message) {
    this.message = message;
    this.fieldName = null;
  }
}

class ValidatorBase {
  constructor() {
  }

  validate() {
    throw new Error('not implemented');
  }

  getMessage() {
    if (typeof this.errorMessage === 'string') {
      return this.errorMessage;
    }
    else {
      return getFrameworkMessage(this.errorMessage.groupName, this.errorMessage.propertyName);
    }
  }
}


export { ErrorMessage, ValidationError, ValidatorBase };
