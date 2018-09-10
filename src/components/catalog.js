/* eslint-disable no-console */
import merge from 'lodash/merge';

let getGeneratorProps = function (config, generator) {
  let props = config && config.props ? config.props : {};
  if (generator) {
    return merge(props, {
      'generator': generator
    });
  }
  return props;
};

export default {
  Labels: [
    {
      BLabel: require('b-label'),
      Description: {
        category: 'Labels',
        properties: {
          displayName: 'BLabel',
          index: 1,
          type: 'BLabel',
          data: require('./label/b-label/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Labels',
        properties: {
          displayName: 'BLabelAdvanced',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-label-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Labels',
        properties: {
          displayName: 'BInfoLabelTest',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-information-label-test-generator').default)
        }
      }
    },
    {
      BInformationText: require('b-information-text'),
      Description: {
        category: 'Labels',
        properties: {
          displayName: 'BInformationText',
          index: 1,
          type: 'BInformationText',
          data: require('./label/b-information-text/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BMoreText: require('b-more-text'),
      Description: {
        category: 'Labels',
        properties: {
          displayName: 'BMoreText',
          index: 1,
          type: 'BMoreText',
          data: require('./label/b-more-text/assets/data/defaults.json')[0].props
        }
      }
    }
  ],
  Buttons: [{
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Buttons',
      properties: {
        displayName: 'BButton',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-button-test-generator').default)
      }
    }
  },
  {
    BIconButton: require('b-icon-button'),
    Description: {
      category: 'Buttons',
      properties: {
        displayName: 'BIconButton',
        index: 1,
        type: 'BIconButton',
        data: require('./button/b-icon-button/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BActionButton: require('b-action-button'),
    Description: {
      category: 'Buttons',
      properties: {
        displayName: 'BActionButton',
        index: 1,
        type: 'BActionButton',
        data: require('./button/b-action-button/assets/data/defaults.json')[0].props
      }
    }
  }
  ],
  Drawer: [{
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Drawer',
      properties: {
        displayName: 'BDrawer (Test)',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-drawer-test-generator').default)
      }
    }
  }],
  Forms: [{
    BBaseForm: require('b-base-form'),
    Description: {
      category: 'Forms',
      properties: {
        displayName: 'BBaseForm',
        index: 0,
        type: 'BBaseForm',
        data: require('./form/b-base-form/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BBrowseForm: require('b-browse-form'),
    Description: {
      category: 'Forms',
      properties: {
        displayName: 'BBrowseForm',
        index: 0,
        type: 'BBrowseForm',
        data: require('./form/b-browse-form/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Forms',
      properties: {
        displayName: 'BFormBase (Test)',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-form-base-test-generator').default)
      }
    }
  },
  {
    BTransactionForm: require('b-transaction-form'),
    Description: {
      category: 'Forms',
      properties: {
        displayName: 'BTransactionForm (Test)',
        index: 0,
        type: 'BTransactionForm',
        data: require('./form/b-transaction-form/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BTransactionWizardForm: require('b-transaction-wizard-form'),
    Description: {
      category: 'Forms',
      properties: {
        displayName: 'BTransactionWizardForm (Test)',
        index: 0,
        type: 'BTransactionWizardForm',
        data: require('./form/b-transaction-wizard-form/assets/data/defaults.json')[0].props
      }
    }
  }
  ],
  Inputs: [{
    BAutoComplete: require('b-auto-complete'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BAutoComplete',
        index: 1,
        type: 'BAutoComplete',
        data: require('./input/b-auto-complete/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInput (Test)',
        index: 2,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-input-test-generator').default)
      }
    }
  },
  {
    BInput: require('b-input'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInput',
        index: 3,
        type: 'BInput',
        data: require('./input/b-input/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInputNumeric',
        index: 4,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-input-numeric-test-generator').default)
      }
    }
  },
  {
    BInputAction: require('b-input-action'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInputAction',
        index: 5,
        type: 'BInputAction',
        data: require('./input/b-input-action/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInputAction Test',
        index: 6,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-input-action-test-generator').default)
      }
    }
  },
  {
    BInputMask: require('b-input-mask'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInputMask',
        index: 7,
        type: 'BInputMask',
        data: require('./input/b-input-mask/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInputMask (test)',
        index: 8,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-input-mask-test-generator').default)
      }
    }
  },
  {
    BInputSearch: require('b-input-search'),
    Description: {
      category: 'Inputs',
      properties: {
        displayName: 'BInputSearch',
        index: 10,
        type: 'BInputSearch',
        data: require('./input/b-input-search/assets/data/defaults.json')[0].props
      }
    }
  }
  ],
  Lists: [
    {
      BList: require('./list/b-list'),
      Description: {
        category: 'Lists',
        properties: {
          displayName: 'BList',
          index: 1,
          type: 'BList',
          data: require('./list/b-list/assets/data/defaults.json')[0].props
        }
      }
    },

    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Lists',
        properties: {
          displayName: 'Virtualized List',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-virtualized-list-test-generator').default)
        }
      }
    },
  ],
  Grids: [
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Basic',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Data Formating',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-format').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Custom Cell',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-reactTemplate').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Fundamentals',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-color').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Tree',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-tree').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Hierarchy And Detail Row',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-hierarchy').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Grid Action Panel',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-action-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Editing Row',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-row-editing').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Grids',
        properties: {
          displayName: 'Editing Batch',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-data-grid-dx-test-generator-batch-editing').default)
        }
      }
    }
  ],
  Menu: [
    {
      BMenu: require('b-menu'),
      Description: {
        category: 'Menu',
        properties: {
          displayName: 'BMenu',
          index: 1,
          type: 'BMenu',
          data: require('./menu/b-menu/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BDrawerMenu: require('b-drawer-menu'),
      Description: {
        category: 'Menu',
        properties: {
          displayName: 'BDrawerMenu',
          index: 2,
          type: 'BDrawerMenu',
          data: require('./menu/b-drawer-menu/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BMenuItem: require('b-menu-item'),
      Description: {
        category: 'Menu',
        properties: {
          displayName: 'BMenuItem',
          index: 3,
          type: 'BMenuItem',
          data: require('./menu/b-menu-item/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BIconMenu: require('b-icon-menu'),
      Description: {
        category: 'Menu',
        properties: {
          displayName: 'BIconMenu',
          index: 4,
          type: 'BIconMenu',
          data: require('./menu/b-icon-menu/assets/data/defaults.json')[0].props
        }
      },
    }
  ],
  Selects: [{
    BComboBox: require('b-combo-box'),
    Description: {
      category: 'Selects',
      properties: {
        displayName: 'BComboBox',
        index: 1,
        type: 'BComboBox',
        data: require('./select/b-combo-box/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Selects',
      properties: {
        displayName: 'BComboBox (test)',
        index: 2,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-combo-box-test-generator').default)
      }
    }
  },
  {
    BSelectListBox: require('b-select-list-box'),
    Description: {
      category: 'Selects',
      properties: {
        displayName: 'BSelectListBox',
        index: 1,
        type: 'BSelectListBox',
        data: require('./select/b-select-list-box/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Selects',
      properties: {
        displayName: 'BSelectListBox (test)',
        index: 2,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-select-list-box-test-generator').default)
      }
    }
  }
  ],
  Panels: [{
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Panels',
      properties: {
        displayName: 'SnackBar - New',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-snack-bar-test-generator').default)
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Panels',
      properties: {
        displayName: 'BCard - SnackBar',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-card-test-generator').default)
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Panels',
      properties: {
        displayName: 'BCardPost',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-card-post-test-generator').default)
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Panels',
      properties: {
        displayName: 'BAppCard',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-app-card-test-generator').default)
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Panels',
      properties: {
        displayName: 'BLinearPanel',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-linear-panel-test-generator').default)
      }
    }
  }
  ],
  Pickers: [
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Pickers',
        properties: {
          displayName: 'BDateTimePicker (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-date-picker-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Pickers',
        properties: {
          displayName: 'BCalendarPicker (Test)',
          index: 1,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-calendar-picker-test-generator').default)
        }
      }
    }
  ],
  Slider: [{
    BSlider: require('b-slider'),
    Description: {
      category: 'Slider',
      properties: {
        displayName: 'BSlider',
        index: 0,
        type: 'BSlider',
        data: require('./slider/b-slider/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Slider',
      properties: {
        displayName: 'BSlider (Test)',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-slider-test-generator').default)
      }
    }
  }
  ],
  Switches: [{
    BCheckBox: require('b-check-box'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BCheckBox',
        index: 0,
        type: 'BCheckBox',
        data: require('./switch/b-check-box/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BCheckBoxGroup: require('b-check-box-group'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BCheckBoxGroup',
        index: 0,
        type: 'BCheckBoxGroup',
        data: require('./switch/b-check-box-group/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BCheckBox (Test)',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-check-box-test-generator').default)
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BRadioButton',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-radio-button-test-generator').default)
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BRadiobuttonGroup (Test)',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-radio-button-group-test-generator').default)
      }
    }
  },
  {
    BToggle: require('b-toggle'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BToggle',
        index: 0,
        type: 'BToggle',
        data: require('./switch/b-toggle/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Switches',
      properties: {
        displayName: 'BToggle (Test)',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-toggle-test-generator').default)
      }
    }
  }
  ],
  ToolBar: [
    {
      BDocNotice: require('b-doc-notice'),
      Description: {
        category: 'ToolBar',
        properties: {
          displayName: 'BDocNotice',
          index: 0,
          type: 'BDocNotice',
          data: require('./documentation/b-doc-notice/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BTabBar: require('generic-test-viewer'),
      Description: {
        category: 'ToolBar',
        properties: {
          displayName: 'Tab Bar (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-tab-bar-test-generator').default)
        }
      }
    },
  ],
  TreeView: [
    //   {
    //     BTreeView: require('b-treeview'),
    //     Description: {
    //       category: 'TreeView',
    //       properties: {
    //         displayName: 'BTreeView',
    //         index: 0,
    //         type: 'BTreeView',
    //         data: require('./treeview/b-treeview/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   }
    // ],
    // TreeViewDataGrid: [
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'TreeView',
        properties: {
          displayName: 'BTreeView (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-treeview-test-generator').default)
        }
      }
    },
    {
      BTreeViewDataGrid: require('b-treeview-data-grid'),
      Description: {
        category: 'TreeView',
        properties: {
          displayName: 'BTreeViewDataGrid',
          index: 0,
          type: 'BTreeViewDataGrid',
          data: require('./treeview/b-treeview-data-grid/assets/data/defaults.json')[0].props
        }
      }
    },
    // ],
    // TreeViewGrid: [
    {
      BTreeViewGrid: require('b-treeview-grid'),
      Description: {
        category: 'TreeView',
        properties: {
          displayName: 'BTreeViewGrid',
          index: 0,
          type: 'BTreeViewGrid',
          data: require('./treeview/b-treeview-grid/assets/data/defaults.json')[0].props
        }
      }
    }
  ],
  Layout: [
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Layout',
        properties: {
          displayName: 'Grid Layout (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-grid-layout-test-generator').default)
        }
      }
    },

    //   {
    //     TestViewer: require('generic-test-viewer'),
    //     Description: {
    //       category: 'Layout',
    //       properties: {
    //         displayName: 'Layouts (Test)',
    //         index: 0,
    //         type: 'TestViewer',
    //         data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
    //           require('./test-viewers/generic-test-viewer/b-layout-test-generator').default)
    //       }
    //     }
    //   },
    //   {
    //     BFooter: require('b-footer'),
    //     Description: {
    //       category: 'Layout',
    //       properties: {
    //         displayName: 'BFooter',
    //         index: 2,
    //         type: 'BFooter',
    //         data: require('./layout/b-footer/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    //   {
    //     BSideBar: require('b-side-bar'),
    //     Description: {
    //       category: 'Layout',
    //       properties: {
    //         displayName: 'BSideBar',
    //         index: 0,
    //         type: 'BAppBar',
    //         data: require('./layout/b-side-bar/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    {
      BExpander: require('b-expander'),
      Description: {
        category: 'Layout',
        properties: {
          displayName: 'BExpander',
          index: 0,
          type: 'BExpander',
          data: require('./layout/b-expander/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Layout',
        properties: {
          displayName: 'BFlexPanel',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-flex-panel-test-generator').default)
        }
      }
    },
    {
      BStepper: require('b-stepper'),
      Description: {
        category: 'Layout',
        properties: {
          displayName: 'BStepper',
          index: 0,
          type: 'BStepper',
          data: require('./layout/b-stepper/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Layout',
        properties: {
          displayName: 'BStepper (test)',
          index: 2,
          type: 'TestViewer',
          data: getGeneratorProps({},
            require('./test-viewers/generic-test-viewer/b-stepper-test-generator').default)
        }
      }
    }
  ],
  Progress: [{
    BProgress: require('b-progress'),
    Description: {
      category: 'Progress',
      properties: {
        displayName: 'BProgress-Circular',
        index: 0,
        type: 'BProgress',
        data: require('./progress/b-progress/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BProgress: require('b-progress'),
    Description: {
      category: 'Progress',
      properties: {
        displayName: 'BProgress-Linear',
        index: 0,
        type: 'BProgress',
        data: require('./progress/b-progress/assets/data/defaults.json')[1].props
      }
    }
  }
    //   {
    //     BIndicator: require('b-indicator'),
    //     Description: {
    //       category: 'Progress',
    //       properties: {
    //         displayName: 'BIndicator',
    //         index: 1,
    //         type: 'BIndicator',
    //         data: require('./progress/b-indicator/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   }
  ],
  Others: [
    //   {
    //     BSnackbarCatalog: require('./others/b-snackbar/catalog'),
    //     Description: {
    //       category: 'Others',
    //       properties: {
    //         displayName: 'BSnackbar',
    //         index: 0,
    //         type: 'BSnackbarCatalog',
    //         data: require('./others/b-snackbar/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'ToolTip test',
          index: 2,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-tool-tip-test-generator').default)
        }
      }
    },
    {
      BLoading: require('b-loading'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BLoading',
          index: 1,
          type: 'BLoading',
          data: require('./others/b-loading/assets/data/defaults.json')[0].props
        }
      }
    },

    {
      BDivider: require('b-divider'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BDivider',
          index: 1,
          type: 'BDivider',
          data: require('./others/b-divider/assets/data/defaults.json')[1]
        }
      }
    },
    //   {
    //     BCarousel: require('b-carousel'),
    //     Description: {
    //       category: 'Others',
    //       properties: {
    //         displayName: 'BCarousel',
    //         index: 1,
    //         type: 'BCarousel',
    //         data: require('./others/b-carousel/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    //   {
    //     BPromo: require('b-promo'),
    //     Description: {
    //       category: 'Others',
    //       properties: {
    //         displayName: 'BPromo',
    //         index: 2,
    //         type: 'BPromo',
    //         data: require('./others/b-promo/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BPopover',
          index: 1,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-popover-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'Icons',
          index: 2,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/icons-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BIcons',
          index: 2,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-icon-test-generator').default)
        }
      }
    },
    //   {
    //     TestViewer: require('generic-test-viewer'),
    //     Description: {
    //       category: 'Others',
    //       properties: {
    //         displayName: 'Service Test',
    //         index: 2,
    //         type: 'TestViewer',
    //         data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
    //           require('./test-viewers/generic-test-viewer/servicecall-test-generator').default)
    //       }
    //     }
    //   },
    {
      BCarousel: require('b-carousel'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BCarousel',
          index: 0,
          type: 'BCarousel',
          data: require('./others/b-carousel/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BExcelBrowser',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-excel-browser-test-generator').default)
        }
      }
    },
    //   {
    //     BHtmlToReact: require('b-html-to-react'),
    //     Description: {
    //       category: 'Others',
    //       properties: {
    //         displayName: 'BHtmlToReact',
    //         index: 0,
    //         type: 'BHtmlToReact',
    //         data: require('./others/b-html-to-react/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    {
      BAvatar: require('b-avatar'),
      Description: {
        category: 'Others',
        properties: {
          displayName: 'BAvatar',
          index: 0,
          type: 'BAvatar',
          data: require('./avatar/b-avatar/assets/data/defaults.json')[0].props
        }
      }
    }


  ],
  Dialog: [{
    BDialogBoxCatalog: require('./dialog/b-dialog-box/catalog'),
    Description: {
      category: 'Dialog',
      properties: {
        displayName: 'BDialogBox',
        index: 0,
        type: 'BDialogBoxCatalog',
        data: require('./dialog/b-dialog-box/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'Dialog',
      properties: {
        displayName: 'BDialogBox (Test)',
        index: 1,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-dialogbox-test-generator').default)
      }
    }
  }
  ],
  DMS: [


    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'DMS',
        properties: {
          displayName: 'BFileInput',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-file-input-test-generator').default)
        }
      }
    },
    {
      BPdfViewer: require('b-pdf-viewer'),
      Description: {
        category: 'DMS',
        properties: {
          displayName: 'BPdfViewer',
          index: 1,
          type: 'BPdfViewer',
          data: require('./dms/b-pdf-viewer/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'DMS',
        properties: {
          displayName: 'BPdfViewer(test)',
          index: 2,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-pdf-viewer-test-generator').default)
        }
      }
    },
    {
      BDivitComponent: require('generic-test-viewer'),
      Description: {
        category: 'DMS',
        properties: {
          displayName: 'BDivitComponent',
          index: 0,
          type: 'BDivitComponent',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-divit-component-test-generator').default)
        }
      },

    }
  ]
};
