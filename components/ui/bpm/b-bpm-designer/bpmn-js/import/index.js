import translate from '../../diagram-js/i18n/translate';

import BpmnImporter from './BpmnImporter';

export default {
  __depends__: [
    translate
  ],
  bpmnImporter: [ 'type', BpmnImporter ]
};