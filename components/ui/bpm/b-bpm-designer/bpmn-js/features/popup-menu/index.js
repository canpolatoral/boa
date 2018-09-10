import PopupMenuModule from '../../../diagram-js/features/popup-menu';
import ReplaceModule from '../replace';

import ReplaceMenuProvider from './ReplaceMenuProvider';


export default {
  __depends__: [
    PopupMenuModule,
    ReplaceModule
  ],
  __init__: [ 'replaceMenuProvider' ],
  replaceMenuProvider: [ 'type', ReplaceMenuProvider ]
};