import RulesModule from '../../../diagram-js/features/rules';

import BpmnRules from './BpmnRules';

export default {
  __depends__: [
    RulesModule
  ],
  __init__: [ 'bpmnRules' ],
  bpmnRules: [ 'type', BpmnRules ]
};
