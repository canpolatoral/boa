'use strict';

import React from 'react';

var parameterComponentFactory = function (options, entryFactory) {
  var resource = {};

  resource.id = options.id;
  resource.canBeDisabled = !!options.disabled && typeof options.disabled === 'function';
  resource.canBeHidden = !!options.hidden && typeof options.hidden === 'function';
  resource.description = options.description;
  resource.actionName = typeof options.buttonAction != 'undefined' ? options.buttonAction.name : 'clear';

  var a = entryFactory.validationAwareTextField({
    id: 'id1',
    label: 'Id1',
    description: options.description,
    modelProperty: 'id1',
    context: options.element.context,
    element: options.element,
  });


  var b = entryFactory.validationAwareTextField({
    id: 'id2',
    label: 'Id2',
    description: options.description,
    modelProperty: 'id2',
    context: options.element.context,
    element: options.element,
  });


  return a, b;
};

export default class EntryFactorycreate {

  render() {
    console.log('#############aa00#');
    return (
      <div>
      </div>

    );
  }

}

module.exports = parameterComponentFactory;

