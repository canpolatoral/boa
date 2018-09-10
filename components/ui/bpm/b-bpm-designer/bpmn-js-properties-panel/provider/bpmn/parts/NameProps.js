'use strict';

var nameEntryFactory = require('./implementation/Name'),
  is = require('../../../../bpmn-js/util/ModelUtil').is;

module.exports = function(group, element, translate) {

  if (!is(element, 'bpmn:Collaboration')) {

    var options;
    if (is(element, 'bpmn:TextAnnotation')) {
      options = { modelProperty: 'text', context: element.context };
    }

    // name
    group.entries = group.entries.concat(nameEntryFactory(element, options, translate));

  }

};
