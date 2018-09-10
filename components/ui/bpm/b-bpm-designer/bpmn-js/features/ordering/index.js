import translate from '../../../diagram-js/i18n/translate';

import BpmnOrderingProvider from './BpmnOrderingProvider';

export default {
  __depends__: [
    translate
  ],
  __init__: [ 'bpmnOrderingProvider' ],
  bpmnOrderingProvider: [ 'type', BpmnOrderingProvider ]
};