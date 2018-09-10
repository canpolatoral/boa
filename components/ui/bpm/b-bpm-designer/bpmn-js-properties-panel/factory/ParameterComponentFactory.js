'use strict';

import React from 'react';
import BParameterComponent from 'b-parameter-component';
import { BAppProvider } from 'b-component';

var parameterComponentFactory = function (options) {
  var resource = {};

  resource.id = options.id;
  resource.canBeDisabled = !!options.disabled && typeof options.disabled === 'function';
  resource.canBeHidden = !!options.hidden && typeof options.hidden === 'function';
  resource.description = options.description;

  let input = (
    <div className="bpp-field-wrapper">
      <BAppProvider theme={options.context.theme}>
        <BParameterComponent
          contenteditable={true}
          name={options.modelProperty}
          disabled={resource.canBeDisabled}
          isVisible={!resource.canBeHidden}
          id={resource.id}
          context={options.context}
          data-entry={options.modelProperty}
          ref={r => (resource.component = r)}
          onSelect={(e, index, selectedItems) => {
            resource.onChange(e, selectedItems, resource, options.element);
          }}
        />
      </BAppProvider>
    </div>
  );
  resource.html = input;

  resource.cssClasses = ['bpp-parameterComponent'];

  resource.get = function (element, node) {
    if (typeof options.get === 'function') {
      return options.get(element, node);
    }
    return { [options.modelProperty]: 'SesControl' };
  };

  resource.setValue = (value) => {
    console.log('BParameterComponent setValue'+value);
  //  resource.component.getInstance().setValue(value);

  };

  resource.getValue = () => {
    console.log('BParameterComponent get');
   // return resource.component.getInstance().getValue();

  };
  resource.set = function (element, values, node) {
    var modifiedValues = {};

    return options.set(element, modifiedValues, node);
  };

  return resource;
};

module.exports = parameterComponentFactory;
