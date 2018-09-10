'use strict';

var domQuery = require('min-dom').query;
var entryFieldDescription = require('./EntryFieldDescription');

import React from 'react';
import BInput from 'b-input';
import { BAppProvider } from 'b-component';

var textField = function (options, defaultParameters) {
  // Default action for the button next to the input-field
  var defaultButtonAction = function (element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
    input.value = '';

    return true;
  };

  // default method to determine if the button should be visible
  var defaultButtonShow = function (element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);

    return input.value !== '';
  };

  var resource = defaultParameters,
    label = options.label || resource.id,
    dataValueLabel = options.dataValueLabel,
    buttonLabel = options.buttonLabel || 'X',
    actionName = typeof options.buttonAction != 'undefined' ? options.buttonAction.name : 'clear',
    actionMethod = typeof options.buttonAction != 'undefined' ? options.buttonAction.method : defaultButtonAction,
    showName = typeof options.buttonShow != 'undefined' ? options.buttonShow.name : 'canClear',
    showMethod = typeof options.buttonShow != 'undefined' ? options.buttonShow.method : defaultButtonShow,
    canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
    canBeHidden = !!options.hidden && typeof options.hidden === 'function',
    description = options.description;

  resource.html = '<label for="camunda-' + resource.id + '" ' +
    (canBeDisabled ? 'data-disable="isDisabled" ' : '') +
    (canBeHidden ? 'data-show="isHidden" ' : '') +
    (dataValueLabel ? 'data-value="' + dataValueLabel + '"' : '') + '>' + label + '</label>' +
    '<div class="bpp-field-wrapper" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? 'data-show="isHidden"' : '') +
    '>' +
    '<input id="camunda-' + resource.id + '" type="text" name="' + options.modelProperty + '" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? 'data-show="isHidden"' : '') +
    ' />' +
    '<button class="' + actionName + '" data-action="' + actionName + '" data-show="' + showName + '" ' +
    (canBeDisabled ? 'data-disable="isDisabled"' : '') +
    (canBeHidden ? ' data-show="isHidden"' : '') + '>' +
    '<span>' + buttonLabel + '</span>' +
    '</button>' +
    '</div>';

  let input = (
    <div className="bpp-field-wrapper">
      <BAppProvider theme={options.context.theme}>
        <BInput
          name={options.modelProperty}
          disabled={canBeDisabled}
          isVisible={!canBeHidden}
          id={'camunda-' + resource.id}
          type="text"
          floatingLabelText={label}
          className={actionName}
          context={options.context}
          ref={r => (resource.component = r)}
          onChange={(e, v) => {
            resource.onChange(e, v, resource, options.element);
            // console.log("conpnnet " + e.target.value);
            // options.value= e.target.value;
            // console.log("component data"+resource.component.getInstance().getValue());
            // textField(options, defaultParameters);
          }}
        />
      </BAppProvider>
    </div>
  );

  // add description below text input entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  resource[actionName] = actionMethod;
  resource[showName] = showMethod;

  if (canBeDisabled) {
    resource.isDisabled = function () {
      return options.disabled.apply(resource, arguments);
    };
  }

  if (canBeHidden) {
    resource.isHidden = function () {
      return !options.hidden.apply(resource, arguments);
    };
  }

  resource.setValue = (value) => {

    resource.component.getInstance().setValue(value);

  };

  resource.getValue = () => {

    return resource.component.getInstance().getValue();

  };

  resource.cssClasses = ['bpp-textfield'];
  resource.html = input;

  return resource;
};


module.exports = textField;
