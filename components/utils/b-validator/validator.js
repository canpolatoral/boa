import ValidatorFactory from './factory';

import { BDialogHelper } from 'b-dialog-box';
import { proxyExecute, proxyTransactionExecute } from 'b-ui-proxy';
import { getFrameworkMessage } from 'b-messaging';
import { BComponent } from 'b-component';


export class BValidator {

  constructor(context) {
    this.context = context;
  }

  validateFieldByType(value, type, props) {
    let validator = ValidatorFactory[type];
    let validationError = null;

    if (validator) {
      validator = Object.assign(validator, props);
      validationError = validator.validate(value);
    }

    return validationError == null;
  }


  validateFields(model, schema) {
    let validationErrors = [];
    if (schema.fieldValidations) {
      schema.fieldValidations.forEach((field) => {
        if (field.validation) {
          let validationType = field.validation.type;
          let validator = ValidatorFactory[validationType];
          if (validator) {
            validator = Object.assign(validator, field.validation);
            let fieldProps = schema.fieldValidations ? schema.fieldValidations.find(x => x.name == field.name) : null;
            let fieldValue = this.getValue(model, fieldProps && fieldProps.path ? fieldProps.path : field.path);
            let validationError = validator.validate(fieldValue);
            if (validationError) {
              validationError.fieldName = field.name;
              validationError.componentReference = field.componentReference;
              validationErrors.push(validationError);
            }
          }
        }
      });
    }
    return validationErrors;
  }

  validateGroups(model, schema) {
    let validationErrors = [];
    if (schema.groupValidations) {
      schema.groupValidations.forEach((group) => {
        let validationType = group.type;
        var validator = ValidatorFactory[validationType];
        if (validator) {
          validator = Object.assign(validator, group, { errorMessage: group.validation.errorMessage });
          let parameters = [];

          validator.validation && validator.validation.fields.forEach((field) => {
            let parameter;
            let fieldProps = schema.fieldValidations ? schema.fieldValidations.find(x => x.name == field.name) : null;
            if (fieldProps) {
              parameter = this.getValue(model, fieldProps.path);
            }
            parameters.push(parameter);
          });

          var validationError = validator.validate(parameters);
          if (validationError) {
            validationError.fieldName = validator.name;
            validationErrors.push(validationError);
          }
        }
      });
    }
    return validationErrors;
  }

  validate(model, schema) {
    if (!schema || !Object.keys(schema) || Object.keys(schema).length === 0)
      return undefined;

    let validationErr = [];
    let errors = {};

    let fieldErrors = this.validateFields(model, schema);
    let groupErrors = this.validateGroups(model, schema);

    validationErr = [...fieldErrors, ...groupErrors];

    if (validationErr && validationErr.length > 0) {
      for (let i = 0; i < validationErr.length; i++) {
        if (errors[validationErr[i].componentReference]) {
          errors[validationErr[i].componentReference] = errors[validationErr[i].componentReference].concat('\n', validationErr[i].message);
        } else {
          errors[validationErr[i].componentReference] = validationErr[i].message;
        }
      }
    }

    let fieldErrorsMessage, groupErrorsMessage;
    if (fieldErrors && fieldErrors.length > 0) {
      fieldErrorsMessage = fieldErrors.map((err) => {
        return `${err.message}\n`;
      });
    }
    if (groupErrors && groupErrors.length > 0) {
      groupErrorsMessage = groupErrors.map((err) => {
        return `${err.message}\n`;
      });
    }

    if (groupErrorsMessage) {
      let allMessages;
      if (fieldErrorsMessage && groupErrorsMessage) {
        allMessages = fieldErrorsMessage + '\n' + groupErrorsMessage;
      }
      else if (fieldErrorsMessage) {
        allMessages = fieldErrorsMessage;
      }
      else if (groupErrorsMessage) {
        allMessages = groupErrorsMessage;
      }
      BDialogHelper.show(this.context, allMessages);
    }

    return errors;
  }

  validateAsync(model, schema, callback) {
    this.model = model;
    this.schema = schema;
    let errors = this.validate(model, schema);
    this.errors = errors || {};

    if (Object.keys(this.errors).length > 0) {
      callback(false, this.errors);
    } else {
      this.validationCallback = callback;
      if (schema && schema.businessValidations && schema.businessValidations.length > 0) {
        this.businessValidations = schema.businessValidations;
        this.sequentialValidations = [];
        this.nonSequentialValidations = [];
        let sequentialValidations = this.businessValidations.filter((validation) => {
          return (validation.sortNumber > 0 && (validation.type == 'Question' || validation.type == 'Control' || validation.type == 'RuleCall'));
        });

        if (sequentialValidations && sequentialValidations.length > 0) {
          sequentialValidations = sequentialValidations.sort((a, b) => {
            return (a.sortNumber - b.sortNumber);
          });

          sequentialValidations.forEach((validation, index) => {
            let request = {
              requestClass: validation.validation.typeName,
              requestBody: {
                resourceId: this.model.requestBody.resourceId,
                actionId: this.model.requestBody.actionId,
                resourceCode: this.model.requestBody.resourceCode
              },
              key: `VALIDATION_${validation.name}_${index}`
            };
            for (let parameter in validation.validation.parameters) {
              let parameterValue = validation.validation.parameters[parameter].value;
              let parameterKey = validation.validation.parameters[parameter].key;
              if (!parameterValue.startsWith('f.')) {
                this.setValue(request.requestBody, parameterKey, parameterValue);
              } else {
                let fieldKey = parameterValue.substring(2, parameterValue.length);
                let fieldProps = schema.fields.find(x => x.name === fieldKey);
                if (fieldProps) {
                  this.setValue(request.requestBody, parameterKey, this.getValue(model, fieldProps.path));
                }
              }
            }

            if (validation.type == 'RuleCall') {
              var ruleRequest = {
                requestClass: 'BOA.Types.One.RuleExecutionRequest',
                requestBody: {
                  resourceId: request.requestBody.resourceId,
                  actionId: request.requestBody.actionId,
                  resourceCode: request.requestBody.resourceCode,
                  methodName: 'Call',
                  requestBody: JSON.stringify(this.model.requestBody),
                  requestClassName: this.model.requestClass,
                  ruleCode: validation.validation.ruleCode
                },
                key: `VALIDATION_${validation.name}_${index}`
              };
              this.sequentialValidations.push({ name: validation.name, key: `VALIDATION_${validation.name}_${index}`, request: ruleRequest, type:'RuleCall' });
            }
            else {
              this.sequentialValidations.push({ name: validation.name, key: `VALIDATION_${validation.name}_${index}`, request: request, type:'Other' });
            }

          });

          let validation = this.sequentialValidations[0];
          if (validation.type == 'RuleCall')
          {
            proxyTransactionExecute(validation.request);
          } else
          {
            proxyExecute(validation.request);
          }
         
        }
      } else {
        let hasError = Object.keys(this.errors).length > 0;
        this.validationCallback(!hasError, this.errors);
      }
    }
  }

  validateAsyncTest(request, callback) {
    this.validationCallback = callback;
    var ruleRequest = {
      requestClass: 'BOA.Types.One.RuleExecutionRequest',
      requestBody: {
        resourceId: request.requestBody.resourceId,
        actionId: request.requestBody.actionId,
        resourceCode: request.requestBody.resourceCode,
        methodName: 'Call',
        requestBody: JSON.stringify(request.requestBody),
        requestClassName: request.requestClass,
        ruleCode: 'CIVILIDVALIDATION'
      },
      key: 'VALIDATION_'
    };

    proxyTransactionExecute(ruleRequest);
  }

  proxyDidRespond(proxyResponse) {
    let response = proxyResponse.response;
    let currentValidation = this.findValidationWithKey(proxyResponse.key);
    this.setValidationResponse(currentValidation.name, response);

    // if ((!response.success || response.success && !response.value) && currentValidation && currentValidation.validation && currentValidation.validation.continueOnError == false) {
    if ((!response.success &&  currentValidation.validation!=null ) && currentValidation.validation.continueOnError == false) {
      BDialogHelper.show(this.context, 'Validasyon sırasında hata oluştu.');
      this.validationCallback(false, response.results);
      return;
    }

    let responseValue = currentValidation.type == 'RuleCall' ? true : this.getValue(response, currentValidation.validation.responsePath);
    
    if (currentValidation.type == 'Question' && responseValue == true) {
      let { dialogMessage, dialogTitle } = currentValidation.validation;
      let message = getFrameworkMessage(dialogMessage.groupName, dialogMessage.propertyName);
      let title = getFrameworkMessage(dialogTitle.groupName, dialogTitle.propertyName);
      BDialogHelper.show(this.context, message, BComponent.DialogType.QUESTION, BComponent.DialogResponseStyle.YESNO, title, this.onDialogClose.bind(this, currentValidation.name));
    }
    else if (currentValidation.type == 'Control' && responseValue == false) {
      let { dialogMessage, dialogTitle } = currentValidation.validation;
      let message = getFrameworkMessage(dialogMessage.groupName, dialogMessage.propertyName);
      let title = getFrameworkMessage(dialogTitle.groupName, dialogTitle.propertyName);
      BDialogHelper.show(this.context, message, BComponent.DialogType.ERROR, BComponent.DialogResponseStyle.OK, title, this.onDialogClose.bind(this, currentValidation.name));
    }
    else if (currentValidation.type == 'RuleCall' && response.value == false) {
      var result = response.results[0];
      let { dialogMessage, dialogTitle } = currentValidation.validation;
      if (!result.errorMessage || result.errorMessage == '') {
        result.errorMessage = getFrameworkMessage(dialogMessage.groupName, dialogMessage.propertyName);
      }
      let title = getFrameworkMessage(dialogTitle.groupName, dialogTitle.propertyName);
      if (!title || title == '') {
        title = getFrameworkMessage('BOA', 'Warning');
      }
      BDialogHelper.show(this.context, result.errorMessage, BComponent.DialogType.ERROR, BComponent.DialogResponseStyle.OK, title, this.onDialogClose.bind(this, currentValidation.name));
    } else {
      this.executeNextValidation();
    }
  }

  onDialogClose(name, response) {
    let currentValidation = this.findValidationWithName(name);

    if (currentValidation.type === 'Control' || currentValidation.type === 'RuleCall') {
      this.errors[name] = false;
      this.validationCallback(false, this.errors);
      return;
    }

    if (response != BComponent.DialogResponse.YES) {
      this.errors[name] = false;
      this.validationCallback(false, this.errors);
      return;
    }

    if (currentValidation.validation.assignments && currentValidation.validation.assignments.length > 0) {
      currentValidation.validation.assignments.forEach((assignment) => {
        this.setValue(this.model, assignment.requestPath, this.getValue(response, assignment.responsePath));
      });
    }
    this.executeNextValidation();
  }

  findValidationWithKey(key) {
    let validation = this.sequentialValidations.find(x => x.key === key);
    if (!validation) {
      validation = this.nonSequentialValidations.find(x => x.key === key);
    }
    if (validation) {
      return this.businessValidations.find(x => x.name === validation.name);
    }
  }

  findValidationWithName(name) {
    return this.businessValidations.find(x => x.name === name);
  }

  setValidationResponse(name, response) {
    let validation = this.sequentialValidations.find(x => x.name === name);
    if (!validation) {
      validation = this.nonSequentialValidations.find(x => x.name === name);
    }
    if (validation) {
      validation.response = response;
    }
  }

  executeNextValidation() {
    let nextValidation;
    for (let i = 0; i < this.sequentialValidations.length; i++) {
      if (!nextValidation && !this.sequentialValidations[i].response) {
        nextValidation = this.sequentialValidations[i];
      }
    }
    if (nextValidation) {
      proxyExecute(nextValidation.request);
    } else {
      let hasError = Object.keys(this.errors).length > 0;
      this.validationCallback(!hasError, this.errors);
    }
  }

  getValue(item, property) {
    if (!property || !item)
      return null;

    if (property.includes('.')) {
      let newProperty = property.substring(property.indexOf('.') + 1, property.length);
      let nested = property.split('.')[0];
      if (nested == 'm') {
        if (item['requestBody']) {
          nested = 'requestBody';
        }
        else {
          return this.getValue(item, newProperty);
        }
      }
      let realProperty = this.getRealProperty(item, nested);
      if (!item[realProperty]) {
        return null;
      }
      return this.getValue(item[realProperty], newProperty);
    }

    let finalProperty = this.getRealProperty(item, property);
    return item[finalProperty];
  }

  getRealProperty(item, property) {
    // şemadan property değeri DataContract.Name şeklinde gelebilir. Doğru prop'u bulabilmek için böyle bir method ekledik
    if (!property || !item)
      return null;

    let realProperty = property;
    let keys = Object.keys(item);
    keys.forEach((key) => {
      if (key.toLowerCase() === property.toLowerCase()) {
        realProperty = key;
      }
    });
    return realProperty;
  }

  setValue(item, property, value) {
    if (!item) {
      return;
    }

    if (property.includes('.')) {
      var newProperty = property.substring(property.indexOf('.') + 1, property.length);
      var nested = property.split('.')[0];
      if (!item[nested]) {
        item[nested] = {};
      }
      this.setValue(item[nested], newProperty, value);
    } else {
      item[property] = value;
    }
  }

}
