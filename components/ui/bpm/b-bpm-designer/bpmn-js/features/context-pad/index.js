import DirectEditingModule from '../../../diagram-js-direct-editing';
import ContextPadModule from '../../../diagram-js/features/context-pad';
import SelectionModule from '../../../diagram-js/features/selection';
import ConnectModule from '../../../diagram-js/features/connect';
import CreateModule from '../../../diagram-js/features/create';
import PopupMenuModule from '../popup-menu';

import ContextPadProvider from './ContextPadProvider';

export default {
  __depends__: [
    DirectEditingModule,
    ContextPadModule,
    SelectionModule,
    ConnectModule,
    CreateModule,
    PopupMenuModule
  ],
  __init__: [ 'contextPadProvider' ],
  contextPadProvider: [ 'type', ContextPadProvider ]
};