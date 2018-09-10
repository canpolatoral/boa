import ChangeSupportModule from '../../../diagram-js/features/change-support';
import ResizeModule from '../../../diagram-js/features/resize';
import DirectEditingModule from '../../../diagram-js-direct-editing';

import LabelEditingProvider from './LabelEditingProvider';
import LabelEditingPreview from './LabelEditingPreview';


export default {
  __depends__: [
    ChangeSupportModule,
    ResizeModule,
    DirectEditingModule
  ],
  __init__: [
    'labelEditingProvider',
    'labelEditingPreview'
  ],
  labelEditingProvider: [ 'type', LabelEditingProvider ],
  labelEditingPreview: [ 'type', LabelEditingPreview ]
};
