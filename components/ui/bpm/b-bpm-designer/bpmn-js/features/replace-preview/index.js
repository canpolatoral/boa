import PreviewSupportModule from '../../../diagram-js/features/preview-support';

import BpmnReplacePreview from './BpmnReplacePreview';

export default {
  __depends__: [
    PreviewSupportModule
  ],
  __init__: [ 'bpmnReplacePreview' ],
  bpmnReplacePreview: [ 'type', BpmnReplacePreview ]
};
