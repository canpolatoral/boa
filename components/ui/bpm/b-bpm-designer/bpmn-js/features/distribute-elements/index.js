import DistributeElementsModule from '../../../diagram-js/features/distribute-elements';

import BpmnDistributeElements from './BpmnDistributeElements';


export default {
  __depends__: [
    DistributeElementsModule
  ],
  __init__: [ 'bpmnDistributeElements' ],
  bpmnDistributeElements: [ 'type', BpmnDistributeElements ]
};
