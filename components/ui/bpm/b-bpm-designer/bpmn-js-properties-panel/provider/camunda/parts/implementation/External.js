'use strict';

var entryFactory = require('../../../../factory/EntryFactory'),
  cmdHelper    = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getImplementationType = options.getImplementationType,
    getBusinessObject     = options.getBusinessObject;

  function isExternal(element) {
    return getImplementationType(element) === 'external';
  }

  var topicEntry = entryFactory.textField({
    id: 'externalTopic',
    label: translate('Topic'),
    modelProperty: 'externalTopic',
    context: element.context,

    get: function(element) {
      var bo = getBusinessObject(element);
      return { externalTopic: bo.get('camunda:topic') };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'camunda:topic': values.externalTopic
      });
    },

    validate: function(element, values) {
      return isExternal(element) && !values.externalTopic ? { externalTopic: 'Must provide a value' } : {};
    },

    hidden: function(element) {
      return !isExternal(element);
    }

  });

  return [ topicEntry ];

};
