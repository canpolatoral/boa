import AlignElementsModule from '../../../diagram-js/features/align-elements';
import EditorActionsModule from '../../../diagram-js/features/editor-actions';
import HandToolModule from '../../../diagram-js/features/hand-tool';
import LassoToolModule from '../../../diagram-js/features/lasso-tool';
import SpaceToolModule from '../../../diagram-js/features/space-tool';
import DirectEditingModule from '../../../diagram-js-direct-editing';
import GlobalConnectModule from '../global-connect';
import CopyPasteModule from '../copy-paste';
import DistributeElementsModule from '../distribute-elements';
import SearchModule from '../search';

import BpmnEditorActions from './BpmnEditorActions';

export default {
  __depends__: [
    AlignElementsModule,
    EditorActionsModule,
    HandToolModule,
    LassoToolModule,
    SpaceToolModule,
    DirectEditingModule,
    GlobalConnectModule,
    CopyPasteModule,
    DistributeElementsModule,
    SearchModule
  ],
  editorActions: [ 'type', BpmnEditorActions ]
};
