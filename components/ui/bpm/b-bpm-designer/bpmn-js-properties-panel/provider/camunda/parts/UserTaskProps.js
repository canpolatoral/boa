'use strict';

var is = require('../../../../bpmn-js/util/ModelUtil').is,
  entryFactory = require('../../../factory/EntryFactory');


module.exports = function(group, element, translate) {
  if (is(element, 'camunda:Assignable')) {

    // Assignee
    group.entries.push(entryFactory.textField({
      id : 'assignee',
      label : translate('Assignee'),
      modelProperty : 'assignee',
      context: element.context
    }));

    // Candidate Users
    group.entries.push(entryFactory.textField({
      id : 'candidateUsers',
      label : translate('Candidate Users'),
      modelProperty : 'candidateUsers',
      context: element.context
    }));

    // Candidate Groups
    group.entries.push(entryFactory.textField({
      id : 'candidateGroups',
      label : translate('Candidate Groups'),
      modelProperty : 'candidateGroups',
      context: element.context
    }));

    // Due Date
    group.entries.push(entryFactory.textField({
      id : 'dueDate',
      description : translate('The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)'),
      label : translate('Due Date'),
      modelProperty : 'dueDate',
      context: element.context
    }));

    // FollowUp Date
    group.entries.push(entryFactory.textField({
      id : 'followUpDate',
      description : translate('The follow up date as an EL expression (e.g. ${someDate} or an ' +
                    'ISO date (e.g. 2015-06-26T09:54:00)'),
      label : translate('Follow Up Date'),
      modelProperty : 'followUpDate',
      context: element.context
    }));

    // priority
    group.entries.push(entryFactory.textField({
      id : 'priority',
      label : translate('Priority'),
      modelProperty : 'priority',
      context: element.context
    }));
  }
};
