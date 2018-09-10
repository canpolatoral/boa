'use strict';
import React from 'react';
import BInput from 'b-input';
import { BAppProvider } from 'b-component';

var entryFieldDescription = require('./EntryFieldDescription');


var textBox = function(options, defaultParameters) {

  var resource    = defaultParameters,
    label       = options.label || resource.id,
    canBeShown  = !!options.show && typeof options.show === 'function',
    description = options.description;

  resource.html =
    '<label for="camunda-' + resource.id + '" ' +
    (canBeShown ? 'data-show="isShown"' : '') +
    '>' + label + '</label>' +
    '<div class="bpp-field-wrapper" ' +
    (canBeShown ? 'data-show="isShown"' : '') +
    '>' +
      '<div contenteditable="true" id="camunda-' + resource.id + '" ' +
            'name="' + options.modelProperty + '" />' +
    '</div>';

  let input = (
    <div className="bpp-field-wrapper">
      <BAppProvider theme={options.context.theme}>
        <BInput
          contenteditable={true}
          name={options.modelProperty}
          isVisible={!canBeShown}
          id={'camunda-' + resource.id}
          type="text"
          multiLine={true}
          rows={1}
          rowsMax={4}
          noWrap={false}
          floatingLabelText={label}
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

  // add description below text box entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  if (canBeShown) {
    resource.isShown = function() {
      return options.show.apply(resource, arguments);
    };
  }
  resource.setValue = (value) => {

    resource.component.getInstance().setValue(value);

  };

  resource.getValue = () => {

    return resource.component.getInstance().getValue();

  };

  resource.cssClasses = ['bpp-textbox'];
  resource.html = input;

  return resource;
};

module.exports = textBox;
