'use strict';

import React from 'react';
import BChecbox from 'b-check-box';
import { BAppProvider } from 'b-component';

var getBusinessObject = require('../../bpmn-js/util/ModelUtil').getBusinessObject,
  cmdHelper = require('../helper/CmdHelper');

var entryFieldDescription = require('./EntryFieldDescription');


var checkbox = function(options, defaultParameters) {
  var resource      = defaultParameters,
    label         = options.label || resource.id,
    canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
    canBeHidden   = !!options.hidden && typeof options.hidden === 'function',
    description   = options.description;

  resource.html =
    '<input id="camunda-' + resource.id + '" ' +
         'type="checkbox" ' +
         'name="' + options.modelProperty + '" ' +
         (canBeDisabled ? 'data-disable="isDisabled"' : '') +
         (canBeHidden ? 'data-show="isHidden"' : '') +
         ' />' +
    '<label for="camunda-' + resource.id + '" ' +
         (canBeDisabled ? 'data-disable="isDisabled"' : '') +
         (canBeHidden ? 'data-show="isHidden"' : '') +
         '>' + label + '</label>';


  let _checkbox = (
    <BAppProvider theme={options.context.theme}>
      <BChecbox 
        name={options.modelProperty}
        disabled={canBeDisabled}
        isVisible={!canBeHidden}
        id={'camunda-' + resource.id}
        context={options.context}
        label={label} 
      />
    </BAppProvider>
  ); 

  // add description below checkbox entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  resource.get = function(element) {
    var bo = getBusinessObject(element),
      res = {};

    res[options.modelProperty] = bo.get(options.modelProperty);

    return res;
  };

  resource.set = function(element, values) {
    var res = {};

    res[options.modelProperty] = !!values[options.modelProperty];

    return cmdHelper.updateProperties(element, res);
  };

  if (typeof options.set === 'function') {
    resource.set = options.set;
  }

  if (typeof options.get === 'function') {
    resource.get = options.get;
  }

  if (canBeDisabled) {
    resource.isDisabled = function() {
      return options.disabled.apply(resource, arguments);
    };
  }

  if (canBeHidden) {
    resource.isHidden = function() {
      return !options.hidden.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['bpp-checkbox'];

  resource.html = _checkbox;
  
  return resource;
};

module.exports = checkbox;
