import SelectionModule from '../../../diagram-js/features/selection';
import ReplaceModule from '../../../diagram-js/features/replace';

import BpmnReplace from './BpmnReplace';

export default {
  __depends__: [
    SelectionModule,
    ReplaceModule
  ],
  bpmnReplace: [ 'type', BpmnReplace ]
};
