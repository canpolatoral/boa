import moment from 'moment';
import { ValidatorBase, ValidationError, ErrorMessage } from '../base';

export class Date extends ValidatorBase {

  constructor() {
    super();
    this.errorMessage = new ErrorMessage('Validation', 'DateDefault');
  }

  validate(obj) {
    if (!obj) {
      return undefined;
    }

    let date;
    let {maxDate, minDate, maxRange, minRange, format } = this;

    if (Object.prototype.toString.call(obj) === '[object Date]') {
      date = obj;
    } else {
      this.errorMessage = new ErrorMessage('Validation', 'InvalidDate');
      return new ValidationError(this.getMessage());
    }

    if (date) {
      if (maxDate) {
        if (typeof maxDate === 'string') {
          maxDate = moment(maxDate, format);
        } else {
          maxDate = null;
        }
      }
      if (minDate) {
        if (typeof minDate === 'string') {
          minDate = moment(minDate, format);
        } else {
          minDate = null;
        }
      }
      if (maxDate && date > maxDate) {
        this.errorMessage = new ErrorMessage('Validation', 'MaxDate');
        return new ValidationError(this.getMessage());
      }
      if (minDate && date < minDate) {
        this.errorMessage = new ErrorMessage('Validation', 'Mindate');
        return new ValidationError(this.getMessage());
      }
      if (maxRange) {
        this.errorMessage = new ErrorMessage('Validation', 'MaxRange');
        if (date > moment().add(maxRange, 'days')) {
          return new ValidationError(this.getMessage());
        }
      }
      if (minRange) {
        this.errorMessage = new ErrorMessage('Validation', 'MinRange');
        if (date < moment().add(minRange, 'days')) {
          return new ValidationError(this.getMessage());
        }
      }
    }

  }
}
