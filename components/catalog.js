/* eslint-disable no-console */
import merge from 'lodash/merge';
import {
  setProxy,
  ServiceProxy,
  MockProxy
} from './utils/b-proxy';
// import {BMainMenu} from './business/b-main-menu';

// let serviceAddress = 'http://10.19.1.197:81/api/one/'; //farklı cihazlardan test ederken 82 portundan servis çağrısı için
let serviceAddress = 'http://' + window.location.hostname + ':82/api/one/'; // farklı cihazlardan test ederken 82 portundan servis çağrısı için
// let serviceAddress = 'https://127.0.0.1:8887/api/one/'; // farklı cihazlardan test ederken 82 portundan servis çağrısı için
// let serviceAddress = 'http://srvboaonedev1/api/one/'; // farklı cihazlardan test ederken 82 portundan servis çağrısı için
// let serviceAddress = 'http://srvitswebdev1/api/one/'; // farklı cihazlardan test ederken 82 portundan servis çağrısı için

// eslint-disable-next-line no-unused-vars
let serviceProxy = new ServiceProxy(serviceAddress);

let spCounter = 0;

// eslint-disable-next-line no-unused-vars
let mockProxy = new MockProxy([{
  'name': 'values',
  'value': (data) => {
    console.log('Main menu data acquired. data: ' + (data ? JSON.stringify(data) : '<nodata>'));
    return require('./business/mockdata/values.json');
  }
},
{
  'name': 'values/Generic',
  'value': (data) => {
    console.log('Generic method mock called. data: ' + (data ? JSON.stringify(data) : '<nodata>'));
    if (data) {
      if (data.type == 'BOA.Types.One.AuthorizedResourceRequest') {
        return require('./business/mockdata/values.json');
      }
      if (data.type == 'BOA.Types.DynamicFormGenerator.SpBrowserRequest') {
        if (data.body.MethodName == 'SelectSpByColumns') {
          return require('./business/mockdata/sp_list.json');
        } else {
          spCounter = spCounter + 1;
          if (spCounter % 3 == 1) {
            return require('./business/mockdata/sp_detail.json');
          }
          if (spCounter % 3 == 2) {
            return require('./business/mockdata/sp_detail_2.json');
          }
          if (spCounter % 3 == 0) {
            return require('./business/mockdata/sp_detail_3.json');
          }
        }

      }
    }
    return null;
  }
}
]);

setProxy(serviceProxy);

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
  Toolkit: [
    {
      BToolkit: require('b-toolkit'),
      Description: {
        category: 'Toolkit',
        properties: {
          displayName: 'UIToolkit',
          index: 0,
          type: 'BToolkit',
          data: require('./toolkit/b-toolkit/assets/data/defaults.json')[0].props
        }
      }
    }
  ],
  Dynamic: [
    //   {
    //     TestViewer: require('generic-test-viewer'),
    //     Description: {
    //       category: 'Dynamic',
    //       properties: {
    //         displayName: 'BChartFrom',
    //         index: 0,
    //         type: 'TestViewer',
    //         data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
    //           require('./test-viewers/generic-test-viewer/b-charts-test-generator').default)
    //       }
    //     }
    //   },
    {
      BDesigner: require('b-designer'),
      Description: {
        category: 'Dynamic',
        properties: {
          displayName: 'BTransactionFormDesigner',
          index: 0,
          type: 'BDesigner',
          data: {
            resourceInfo: require('./dynamic/b-designer/assets/data/resourceInfo.json'),
            menuItems: require('./dynamic/b-designer/assets/data/menu.json'),
            designerType: 'transaction'
          }
        }
      }
    },
    {
      BDesigner: require('b-designer'),
      Description: {
        category: 'Dynamic',
        properties: {
          displayName: 'BBrowseFormDesigner',
          index: 0,
          type: 'BDesigner',
          data: {
            resourceInfo: require('./dynamic/b-designer/assets/data/resourceInfo.json'),
            menuItems: require('./dynamic/b-designer/assets/data/menu.json'),
            designerType: 'browse'
          }
        }
      }
    },
    //   {
    //     BDynamicTransaction: require('b-dynamic-transaction'),
    //     Description: {
    //       category: 'Dynamic',
    //       properties: {
    //         displayName: 'BDynamicTransaction',
    //         index: 1,
    //         type: 'BDynamicTransaction',
    //         data: {
    //           modal: require('./dynamic/b-dynamic-transaction/assets/data/modal.json'),
    //           resourceInfo: require('./dynamic/b-dynamic-transaction/assets/data/resourceInfo.json')
    //         }
    //       }
    //     }
    //   },
    {
      BDynamicEventDesigner: require('b-dynamic-event-designer'),
      Description: {
        category: 'Dynamic',
        properties: {
          displayName: 'BDynamicEventDesigner',
          index: 1,
          type: 'BDynamicEventDesigner',
          data: require('./dynamic/b-dynamic-event-designer/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BDynamicActionEdit: require('generic-test-viewer'),
      Description: {
        category: 'Dynamic',
        properties: {
          displayName: 'Action Edit',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-dynamic-action-edit-test-generator').default)
        }
      }
    }
  ],
  Business: [
    {
      // BAccountComponent: require('b-account-component'),
      BAccountComponent: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Account Component (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-account-component-test-generator').default)
        }
      }
    },
    {
      BMessagingComponent: require('b-messaging-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BMessaging Component',
          index: 0,
          type: 'BMessagingComponent',
          data: require('./business/b-messaging-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BTransactionComponent: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Transaction Component (test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-transaction-component-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BSettings (TEST)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-settings-test-generator').default)
        }
      }
    },
    {
      BActionManager: require('b-action-manager'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Action Manager',
          index: 0,
          type: 'BActionManager',
          data: require('./business/b-action-manager/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BActionManager: require('b-action-manager-info'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Action Manager Info',
          index: 0,
          type: 'BActionManagerInfo',
          data: require('./business/b-action-manager-info/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BBPMActionManager: require('b-bpm-action-manager'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BPM Action Manager',
          index: 0,
          type: 'BBPMActionManager',
          data: require('./business/b-bpm-action-manager/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BCommunicationSummary: require('b-communication-summary'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BCommunicationSummary',
          index: 0,
          type: 'BCommunicationSummary',
          data: require('./business/b-communication-summary/assets/data/defaults.json')[0].props
        }
      }
    },
    // {
    //   BAgreementViewer: require('b-agreement-viewer'),
    //   Description: {
    //     category: 'Business',
    //     properties: {
    //       displayName: 'AgreementViewer Component',
    //       index: 0,
    //       type: 'BAgreementViewer',
    //       data: require('./business/b-agreement-viewer/assets/data/defaults.json')[0].props
    //     }
    //   }
    // },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'AgreementViewer (Test Viewer)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-agreementviewer-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Parameter Comp. (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-parameter-component-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Bank Component (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-bank-test-generator').default)
        }
      }
    },
    {
      BBlackListComponent: require('b-black-list-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Black List Component',
          index: 0,
          type: 'BBlackListComponent',
          data: require('./business/b-black-list-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BBranchComponent: require('b-branch-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Branch Component',
          index: 1,
          type: 'BBranchComponent',
          data: require('./business/b-branch-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BUserComponent: require('b-user-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'User Component',
          index: 1,
          type: 'BUserComponent',
          data: require('./business/b-user-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BChannelComponent: require('b-channel-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Channel Component',
          index: 0,
          type: 'BChannelComponent',
          data: require('./business/b-channel-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BCommissionComponent: require('b-commission-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Commission Component',
          index: 0,
          type: 'BCommissionComponent',
          data: require('./business/b-commission-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BIBANComponent: require('b-iban-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'IBAN Component',
          index: 0,
          type: 'BIBANComponent',
          data: require('./business/b-iban-component/assets/data/defaults.json')[0].props,
        }
      }
    },
    {
      BFecComponent: require('b-fec-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'FEC Component',
          index: 1,
          type: 'BFecComponent',
          data: require('./business/b-fec-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BMernisComponent: require('b-mernis-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Mernis Component',
          index: 0,
          type: 'BMernisComponent',
          data: require('./business/b-mernis-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'RDLViewer (Test)',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-rdl-viewer-test-generator').default)
        }
      }
    },
    {
      BMoney: require('b-money'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Money',
          index: 0,
          type: 'BMoney',
          data: require('./business/b-money/assets/data/defaults.json')[0].props
        }
      }
    },
    //   {
    //     TestViewer: require('generic-test-viewer'),
    //     Description: {
    //       category: 'Business',
    //       properties: {
    //         displayName: 'Money-Test',
    //         index: 0,
    //         type: 'TestViewer',
    //         data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
    //           require('./test-viewers/generic-test-viewer/b-money-test-generator').default)
    //       }
    //     }
    //   },

    //   {
    //     TestViewer: require('generic-test-viewer'),
    //     Description: {
    //       category: 'Business',
    //       properties: {
    //         displayName: 'Parameter Component (Test)',
    //         index: 0,
    //         type: 'TestViewer',
    //         data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
    //           require('./test-viewers/generic-test-viewer/b-parameter-component-test-generator').default)
    //       }
    //     }
    //   },
    {
      BStoredProcedureViewer: require('b-stored-procedure-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'SP Viewer',
          index: 0,
          type: 'BStoredProcedureViewer',
          data: require('./business/b-stored-procedure-viewer/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BSurveyComponent: require('b-survey-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BSurvey Component',
          index: 0,
          type: 'BSurveyComponent',
          data: require('./business/b-survey-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BThirdPartyComponent: require('b-third-party-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Third Party Component',
          index: 1,
          type: 'BThirdPartyComponent',
          data: require('./business/b-third-party-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BThirdPartyRelationPersonsComponent: require('b-third-party-relation-persons-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Third Party Relation Person Component',
          index: 1,
          type: 'BThirdPartyRelationPersonsComponent',
          data: require('./business/b-third-party-relation-persons-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BThirdPartySaveDialog: require('b-third-party-save-dialog'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Third Party Save Dialog',
          index: 1,
          type: 'BThirdPartySaveDialog',
          data: require('./business/b-third-party-save-dialog/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BWorkgroupUserComponent: require('b-workgroup-user-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Workgroup User Component',
          index: 1,
          type: 'BWorkgroupUserComponent',
          data: require('./business/b-workgroup-user-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BWorkgroupComponent: require('b-workgroup-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Workgroup Component',
          index: 1,
          type: 'BWorkgroupComponent',
          data: require('./business/b-workgroup-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BPersonComponent: require('b-person-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Person Component',
          index: 0,
          type: 'BPersonComponent',
          data: require('./business/b-person-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BPrayerComponent: require('b-prayer-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BPrayer Component',
          index: 0,
          type: 'BPrayerComponent',
          data: require('./business/b-prayer-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BGoodsServiceComponent: require('b-goods-service-browser-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Goods Service Browser Component',
          index: 1,
          type: 'BGoodsServiceComponent'
        }
      }
    },

    {
      BProductBrowserComponent: require('b-product-browser-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Product Browser Component',
          index: 1,
          type: 'BProductBrowserComponent'
        }
      }
    },
    {
      BSwiftComponent: require('b-swift-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Swift Component',
          index: 1,
          type: 'BSwiftComponent'
        }
      }
    },
    {
      BFlowStateComponent: require('b-flow-state-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Flow State Component',
          index: 1,
          type: 'BFlowStateComponent'
        }
      }
    },
    {
      BEducationComponent: require('b-education-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Education Component',
          index: 1,
          type: 'BEducationComponent'
        }
      }
    },
    {
      BCreditCardComponent: require('b-credit-card-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'Credit Card',
          index: 1,
          type: 'BCreditCardComponent',
          data: require('./business/b-credit-card-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BResourceBrowser',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-resource-browser-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BAccessPointBrowser',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-access-point-browser-test-generator').default)
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BFinancialSegmentBrowser',
          index: 0,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-financial-segment-browser-test-generator').default)
        }
      }
    },
    {
      BReportPost: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BReportPost',
          index: 5,
          type: 'BReportPost',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-report-post-test-generator').default)
        }
      }
    },

    {
      BAnnualLeave: require('b-annual-leave'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BAnnualLeave',
          index: 1,
          type: 'BAnnualLeave',
          data: require('./business/b-annual-leave/assets/data/defaults.json')[0].props,
        }
      }
    },

    {
      BRegistryIntellisenseEditor: require('b-registry-intellisense-editor'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BRegistryIntellisenseEditor',
          index: 10,
          type: 'BRegistryIntellisenseEditor',
          data: require('./business/b-registry-intellisense-editor/assets/data/defaults.json')[0].props
        }
      }
    },
    /*
    {
      BReportPost: require('b-corporate-customer-list'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BCorporateCustomerList',
          index: 0,
          type: 'BCorporateCustomerList',
          data: require('./business/b-corporate-customer-list/assets/data/defaults.json')[0].props,
        }
      }
    },
    {
      TestViewer: require('generic-test-viewer'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BCorporateCustomerList (Test)',
          index: 2,
          type: 'TestViewer',
          data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
            require('./test-viewers/generic-test-viewer/b-corporate-customer-list-test-generator').default)
        }
      }
    }*/
    //   {
    //     BTypeSelect: require('b-type-select'),
    //     Description: {
    //       category: 'Business',
    //       properties: {
    //         displayName: 'BTypeSelect',
    //         index: 11,
    //         type: 'BTypeSelect',
    //         data: require('./business/b-type-select/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   }
  ],
  Labels: [
    {
      BLabel: require('b-label'),
      Description: {
        category: 'Labels',
        properties: {
          displayName: 'BLabel',
          index: 1,
          type: 'BLabel',
          data: require('./ui/labels/b-label/assets/data/defaults.json')[0].props
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
          data: require('./ui/labels/b-information-text/assets/data/defaults.json')[0].props
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
          data: require('./ui/labels/b-more-text/assets/data/defaults.json')[0].props
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
        data: require('./ui/buttons/b-icon-button/assets/data/defaults.json')[0].props
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
        data: require('./ui/buttons/b-action-button/assets/data/defaults.json')[0].props
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
        data: require('./ui/forms/b-base-form/assets/data/defaults.json')[0].props
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
        data: require('./ui/forms/b-browse-form/assets/data/defaults.json')[0].props
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
        data: require('./ui/forms/b-transaction-form/assets/data/defaults.json')[0].props
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
        data: require('./ui/forms/b-transaction-wizard-form/assets/data/defaults.json')[0].props
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
        data: require('./ui/inputs/b-auto-complete/assets/data/defaults.json')[0].props
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
        data: require('./ui/inputs/b-input/assets/data/defaults.json')[0].props
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
        data: require('./ui/inputs/b-input-action/assets/data/defaults.json')[0].props
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
        data: require('./ui/inputs/b-input-mask/assets/data/defaults.json')[0].props
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
        data: require('./ui/inputs/b-input-search/assets/data/defaults.json')[0].props
      }
    }
  }
  ],

  Lists: [
    {
      BList: require('./ui/lists/b-list'),
      Description: {
        category: 'Lists',
        properties: {
          displayName: 'BList',
          index: 1,
          type: 'BList',
          data: require('./ui/lists/b-list/assets/data/defaults.json')[0].props
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

  // Kendo_Grid: [{
  //   TestViewer: require('generic-test-viewer'),
  //   Description: {
  //     category: 'Kendo_Grid',
  //     properties: {
  //       displayName: 'Basic Grid',
  //       index: 0,
  //       type: 'TestViewer',
  //       data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
  //         require('./test-viewers/generic-test-viewer/b-data-grid-test-generator').default)
  //     }
  //   }
  // },

  // {
  //   TestViewer: require('generic-test-viewer'),
  //   Description: {
  //     category: 'Kendo_Grid',
  //     properties: {
  //       displayName: 'Grid Action Panel',
  //       index: 0,
  //       type: 'TestViewer',
  //       data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
  //         require('./test-viewers/generic-test-viewer/b-data-grid-action-generator').default)
  //     }
  //   }
  // },

  // {
  //   TestViewer: require('generic-test-viewer'),
  //   Description: {
  //     category: 'Kendo_Grid',
  //     properties: {
  //       displayName: 'Editable Grid',
  //       index: 0,
  //       type: 'TestViewer',
  //       data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
  //         require('./test-viewers/generic-test-viewer/b-data-grid-test-generator-editable').default)
  //     }
  //   }
  // },

  // {
  //   TestViewer: require('generic-test-viewer'),
  //   Description: {
  //     category: 'Kendo_Grid',
  //     properties: {
  //       displayName: 'Hierarchy Grid',
  //       index: 0,
  //       type: 'TestViewer',
  //       data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
  //         require('./test-viewers/generic-test-viewer/b-data-grid-test-generator-hierarchy').default)
  //     }
  //   }
  // },
  // {
  //   TestViewer: require('generic-test-viewer'),
  //   Description: {
  //     category: 'Kendo_Grid',
  //     properties: {
  //       displayName: 'Grid Group',
  //       index: 0,
  //       type: 'TestViewer',
  //       data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
  //         require('./test-viewers/generic-test-viewer/b-data-grid-test-generator-group').default)
  //     }
  //   }
  // },
  // {
  //   TestViewer: require('generic-test-viewer'),
  //   Description: {
  //     category: 'Kendo_Grid',
  //     properties: {
  //       displayName: 'Grid Aggregate',
  //       index: 0,
  //       type: 'TestViewer',
  //       data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
  //         require('./test-viewers/generic-test-viewer/b-data-grid-test-generator-aggregate').default)
  //     }
  //   }
  // }
  // ],
  Chart: [{
    BChartCard: require('b-chart-card'),
    Description: {
      category: 'Chart',
      properties: {
        displayName: 'BChartCard',
        index: 0,
        type: 'BChartCard',
        data: require('./ui/chart/b-chart-card/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BChartForm: require('b-chart-form'),
    Description: {
      category: 'Chart',
      properties: {
        displayName: 'BChartForm',
        index: 1,
        type: 'BChartForm',
        data: require('./ui/chart/b-chart-form/assets/data/defaults.json')[0].props
      }
    }
  }
  ],
  Menu: [{
    BMainMenu: require('b-main-menu'),
    Description: {
      category: 'Menu',
      properties: {
        displayName: 'Main Menu',
        index: 0,
        type: 'BMainMenu',
        data: require('./business/b-main-menu/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BMenu: require('b-menu'),
    Description: {
      category: 'Menu',
      properties: {
        displayName: 'BMenu',
        index: 1,
        type: 'BMenu',
        data: require('./ui/menu/b-menu/assets/data/defaults.json')[0].props
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
        data: require('./ui/menu/b-drawer-menu/assets/data/defaults.json')[0].props
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
        data: require('./ui/menu/b-menu-item/assets/data/defaults.json')[0].props
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
        data: require('./ui/menu/b-icon-menu/assets/data/defaults.json')[0].props
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
        data: require('./ui/selects/b-combo-box/assets/data/defaults.json')[0].props
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
        data: require('./ui/selects/b-select-list-box/assets/data/defaults.json')[0].props
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
        data: require('./ui/slider/b-slider/assets/data/defaults.json')[0].props
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
        data: require('./ui/switches/b-check-box/assets/data/defaults.json')[0].props
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
        data: require('./ui/switches/b-check-box-group/assets/data/defaults.json')[0].props
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
        data: require('./ui/switches/b-toggle/assets/data/defaults.json')[0].props
      }
    }
  },
  //   {
  //     BToggleIcon: require('b-toggle-icon'),
  //     Description: {
  //       category: 'Switches',
  //       properties: {
  //         displayName: 'BToggleIcon',
  //         index: 0,
  //         type: 'BToggleIcon',
  //         data: require('./ui/switches/b-toggle-icon/assets/data/defaults.json')[0].props
  //       }
  //     }
  //   },
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
  ToolBar: [{
    BAppBar: require('b-app-bar'),
    Description: {
      category: 'ToolBar',
      properties: {
        displayName: 'BAppBar',
        index: 0,
        type: 'BAppBar',
        data: require('./ui/toolbar/b-app-bar/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BAppHeaderKFH: require('b-app-header-kfh'),
    Description: {
      category: 'ToolBar',
      properties: {
        displayName: 'BAppHeaderKFH',
        index: 0,
        type: 'BAppHeaderKFH',
        data: require('./ui/toolbar/b-app-header-kfh/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    BDocNotice: require('b-doc-notice'),
    Description: {
      category: 'ToolBar',
      properties: {
        displayName: 'BDocNotice',
        index: 0,
        type: 'BDocNotice',
        data: require('./ui/documentation/b-doc-notice/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    // BAccountComponent: require('b-account-component'),
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
    //   {
    //     BAppHeader: require('b-app-header'),
    //     Description: {
    //       category: 'ToolBar',
    //       properties: {
    //         displayName: 'BAppHeader',
    //         index: 0,
    //         type: 'BAppHeader',
    //         data: require('./ui/toolbar/b-app-header/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   },
    // {
    //   BTabBar: require('b-tab-bar'),
    //   Description: {
    //     category: 'ToolBar',
    //     properties: {
    //       displayName: 'BTabBar',
    //       index: 0,
    //       type: 'BTabBar',
    //       data: require('./ui/toolbar/b-tab-bar/assets/data/defaults.json')[0].props
    //     }
    //   }
    // },
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
    //         data: require('./ui/treeview/b-treeview/assets/data/defaults.json')[0].props
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
          data: require('./ui/treeview/b-treeview-data-grid/assets/data/defaults.json')[0].props
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
          data: require('./ui/treeview/b-treeview-grid/assets/data/defaults.json')[0].props
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
    //         data: require('./ui/layout/b-footer/assets/data/defaults.json')[0].props
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
    //         data: require('./ui/layout/b-side-bar/assets/data/defaults.json')[0].props
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
          data: require('./ui/layout/b-expander/assets/data/defaults.json')[0].props
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
          data: require('./ui/layout/b-stepper/assets/data/defaults.json')[0].props
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
        data: require('./ui/progress/b-progress/assets/data/defaults.json')[0].props
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
        data: require('./ui/progress/b-progress/assets/data/defaults.json')[1].props
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
    //         data: require('./ui/progress/b-indicator/assets/data/defaults.json')[0].props
    //       }
    //     }
    //   }
  ],
  Others: [
    //   {
    //     BSnackbarCatalog: require('./ui/others/b-snackbar/catalog'),
    //     Description: {
    //       category: 'Others',
    //       properties: {
    //         displayName: 'BSnackbar',
    //         index: 0,
    //         type: 'BSnackbarCatalog',
    //         data: require('./ui/others/b-snackbar/assets/data/defaults.json')[0].props
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
          data: require('./ui/others/b-loading/assets/data/defaults.json')[0].props
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
          data: require('./ui/others/b-divider/assets/data/defaults.json')[1]
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
    //         data: require('./ui/others/b-carousel/assets/data/defaults.json')[0].props
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
    //         data: require('./ui/others/b-promo/assets/data/defaults.json')[0].props
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
          data: require('./ui/others/b-carousel/assets/data/defaults.json')[0].props
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
    //         data: require('./ui/others/b-html-to-react/assets/data/defaults.json')[0].props
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
          data: require('./ui/avatar/b-avatar/assets/data/defaults.json')[0].props
        }
      }
    }


  ],
  Dialog: [{
    BDialogBoxCatalog: require('./ui/dialog/b-dialog-box/catalog'),
    Description: {
      category: 'Dialog',
      properties: {
        displayName: 'BDialogBox',
        index: 0,
        type: 'BDialogBoxCatalog',
        data: require('./ui/dialog/b-dialog-box/assets/data/defaults.json')[0].props
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
  BPM: [{
    BTestViewer: require('b-bpm-test-viewer'),
    Description: {
      category: 'BPM',
      properties: {
        displayName: 'BTestViewer',
        index: 0,
        type: 'BTestViewer',
        data: require('./ui/bpm/b-bpm-test-viewer/assets/data/defaults.json')[0].props
      }
    }
  },
  {
    TestViewer: require('generic-test-viewer'),
    Description: {
      category: 'BPM',
      properties: {
        displayName: 'Bpm Designer',
        index: 0,
        type: 'TestViewer',
        data: getGeneratorProps(require('./test-viewers/generic-test-viewer/assets/data/defaults.json')[0].props,
          require('./test-viewers/generic-test-viewer/b-bpm-designer-test-generator').default)
      }
    }
  },
  {
    BSendApproveDialog: require('b-send-approve-dialog'),
    Description: {
      category: 'BPM',
      properties: {
        displayName: 'Approve Dialog',
        index: 0,
        type: 'BSendApproveDialog',
        data: require('./ui/bpm/b-send-approve-dialog/assets/data/defaults.json')[0].props
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
          data: require('./ui/dms/b-pdf-viewer/assets/data/defaults.json')[0].props
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
      BCalendarComponent: require('b-calendar-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BCalendar Component',
          index: 10,
          type: 'BCalendarComponent',
          data: require('./business/b-calendar-component/assets/data/defaults.json')[0].props
        }
      }
    },
    {
      BAnnouncementComponent: require('b-announcement-component'),
      Description: {
        category: 'Business',
        properties: {
          displayName: 'BAnnouncement Component',
          index: 10,
          type: 'BAnnouncementComponent',
          data: require('./business/b-announcement-component/assets/data/defaults.json')[0].props
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
