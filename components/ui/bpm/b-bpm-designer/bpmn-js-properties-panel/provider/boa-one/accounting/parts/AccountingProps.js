
import DynamicComponentHelper from '../../../../../bpmn-js-properties-panel/helper/DynamicComponentHelper';
import {
  forEach
} from 'min-dash';
// xmlle erişim için eklendi inceleme sonrası kaldırılabilir
// xmlle erişim için eklendi inceleme sonrası kaldırılabilir

export default function (group, element) {
  // Only return an entry, if the currently selected
  // element is a start event.//tabların içerisinde ekleneen componenetler buradan oluşturuluyor.element seçilince çalışır.
  // elementi create eder hangi tabda hangi componentler olucak diye

  forEach(element.propsInfo, function (item) {
    group.entries.push(DynamicComponentHelper(item, element));
  });

  // xmlle erişim için eklendi inceleme sonrası kaldırılabilir
  // group.entries.push(createCamundaProperty(
  //   {}, '', bpmnFactory
  // ));
  // var signalEventDefinition = eventDefinitionHelper.getSignalEventDefinition(element);
  // var CAMUNDA_IN_EXTENSION_ELEMENT = 'camunda:In';
  // var CAMUNDA_OUT_EXTENSION_ELEMENT = 'camunda:Out';

  //   var WHITESPACE_REGEX = /\s/;

  // function getVariableMappings(element, type) {
  //   var camundaMappings = getCamundaInOutMappings(element, type);

  //   return filter(camundaMappings, function(mapping) {
  //     return !mapping.businessKey;
  //   });
  // }

  // var newElement = function(type) {
  //   return function(element, extensionElements, value) {
  //     var newElem = elementHelper.createElement(type, { source : '' }, extensionElements, bpmnFactory);

  //     return cmdHelper.addElementsTolist(element, extensionElements, 'values', [ newElem ]);
  //   };
  // };

  // function getCamundaInOutMappings(element, type) {
  //   var bo = getBusinessObject(element);

  //   var signalEventDefinition = eventDefinitionHelper.getSignalEventDefinition(bo);

  //   return extensionElementsHelper.getExtensionElements(signalEventDefinition || bo, type) || [];
  // }

  // var removeElement = function(type) {
  //   return function(element, extensionElements, value, idx) {
  //     var variablesMappings= getVariableMappings(element, type);
  //     var mapping = variablesMappings[idx];

  //     if (mapping) {
  //       return extensionElementsHelper
  //         .removeEntry(signalEventDefinition || getBusinessObject(element), element, mapping);
  //     }
  //   };
  // };

  // var inEntry = extensionElementsEntry(element, bpmnFactory, {
  //   id: 'variableMapping-in',
  //   label: translate('In Mapping'),
  //   modelProperty: 'source',
  //   prefix: 'In',
  //   idGeneration: false,
  //   resizable: true,
  //   businessObject: signalEventDefinition || getBusinessObject(element),

  //   createExtensionElement: newElement(CAMUNDA_IN_EXTENSION_ELEMENT),
  //   removeExtensionElement: removeElement(CAMUNDA_IN_EXTENSION_ELEMENT),

  //   getExtensionElements: function(element) {
  //     return getVariableMappings(element, CAMUNDA_IN_EXTENSION_ELEMENT);
  //   },

  //   setOptionLabelValue: setOptionLabelValue(CAMUNDA_IN_EXTENSION_ELEMENT)
  // });

  // var setOptionLabelValue = function(type) {
  //   return function(element, node, option, property, value, idx) {
  //     var label = idx + ' : ';

  //     var variableMappings = getVariableMappings(element, type);
  //     var mappingValue = variableMappings[idx];
  //     var mappingType = getInOutType(mappingValue);

  //     if (mappingType === 'variables') {
  //       label = label + 'all';
  //     }
  //     else if (mappingType === 'source') {
  //       label = label + (mappingValue.source || '<empty>');
  //     }
  //     else if (mappingType === 'sourceExpression') {
  //       label = label + (mappingValue.sourceExpression || '<empty>');
  //     } else {
  //       label = label + '<empty>';
  //     }

  //     option.text = label;
  //   };
  // };

  // function getInOutType(mapping) {
  //   var inOutType = 'source';

  //   if (mapping.variables === 'all') {
  //     inOutType = 'variables';
  //   }
  //   else if (typeof mapping.source !== 'undefined') {
  //     inOutType = 'source';
  //   }
  //   else if (typeof mapping.sourceExpression !== 'undefined') {
  //     inOutType = 'sourceExpression';
  //   }

  //   return inOutType;
  // }

  // group.entries.push(inEntry);
}
