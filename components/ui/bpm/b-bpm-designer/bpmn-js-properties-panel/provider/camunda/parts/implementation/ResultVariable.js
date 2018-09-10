'use strict';

var is = require('../../../../../bpmn-js/util/ModelUtil').is;

var assign = require('lodash/assign');

var entryFactory = require('../../../../factory/EntryFactory'),
  cmdHelper    = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject     = options.getBusinessObject,
    hideResultVariable    = options.hideResultVariable,
    id                    = options.id || 'resultVariable';


  var resultVariableEntry = entryFactory.textField({
    id: id,
    label: translate('Result Variable'),
    modelProperty: 'resultVariable',
    context: element.context,

    get: function(element) {
      var bo = getBusinessObject(element);
      return { resultVariable: bo.get('camunda:resultVariable') };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);

      var resultVariable = values.resultVariable || undefined;

      var props = {
        'camunda:resultVariable': resultVariable
      };

      if (is(bo, 'camunda:DmnCapable') && !resultVariable) {
        props = assign({ 'camunda:mapDecisionResult': 'resultList' }, props);
      }

      return cmdHelper.updateBusinessObject(element, bo, props);
    },

    hidden: function() {
      if (typeof hideResultVariable === 'function') {
        return hideResultVariable.apply(resultVariableEntry, arguments);
      }
    }

  });

  return [ resultVariableEntry ];

};
