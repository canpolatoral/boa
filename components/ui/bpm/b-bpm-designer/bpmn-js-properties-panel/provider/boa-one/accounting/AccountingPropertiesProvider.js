import inherits from 'inherits';

import PropertiesActivator from '../../../../bpmn-js-properties-panel/PropertiesActivator';

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps from '../../../../bpmn-js-properties-panel/provider/bpmn/parts/ProcessProps';
import eventProps from '../../../../bpmn-js-properties-panel/provider/bpmn/parts/EventProps';
import linkProps from '../../../../bpmn-js-properties-panel/provider/bpmn/parts/LinkProps';
import documentationProps from '../../../../bpmn-js-properties-panel/provider/bpmn/parts/DocumentationProps';
import idProps from '../../../../bpmn-js-properties-panel/provider/bpmn/parts/IdProps';
import nameProps from '../../../../bpmn-js-properties-panel/provider/bpmn/parts/NameProps';

// properties xmlle erişim için eklendi inceleme sonrası kaldırılabilir
import properties from '../../../../bpmn-js-properties-panel/provider/camunda/parts/PropertiesProps';
// Require your custom property entries.

import accountingProps from './parts/AccountingProps';
// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  processProps(generalGroup, element, translate);

  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };
  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  return [generalGroup, detailsGroup, documentationGroup];
}

// Create the custom accounting tab tab//akış componenetlerinin tabları bura create ediliyor.
function createAccountingTabGroups(element, elementRegistry, bpmnFactory, translate) {
  // Create a group called "Black accounting".
  // bpmnFactory, translate,propertiesGroup xmlle erişim için eklendi inceleme sonrası kaldırılabilir
  var accountingGroup = {
    id: 'accounting-tab-group',
    label: 'Accounting',
    entries: []
  };

  // Add the spell props to the black accounting group.
  accountingProps(accountingGroup, element, bpmnFactory, translate);

 // bpmnFactory, translate,propertiesGroup xmlle erişim için eklendi inceleme sonrası kaldırılabilir
  var propertiesGroup = {
    id: 'extensionElements-properties',
    label: translate('Properties'),
    entries: []
  };
  properties(propertiesGroup, element, bpmnFactory, translate);

  return [accountingGroup, propertiesGroup];
}

export default function AccountingPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {
  PropertiesActivator.call(this, eventBus);

  this.getTabs = function (element) {
    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    // The "accounting" tab
    // bpmnFactory, translate xmlle erişim için eklendi
    var accountingTab = {
      id: 'accounting',
      label: 'Accounting',
      groups: createAccountingTabGroups(element, elementRegistry, bpmnFactory, translate)
    };

    // Show general + "accounting" tab
    return [generalTab, accountingTab];
  };
}

inherits(AccountingPropertiesProvider, PropertiesActivator);
