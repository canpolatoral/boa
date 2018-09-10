import PropTypes from 'prop-types';

import { BButton } from 'b-button';
import { BList } from 'b-list';
import { BListItem } from 'b-list-item';
import { BToggle } from 'b-toggle';
import { BInput } from 'b-input';
import { BInputNumeric } from 'b-input-numeric';
// import { BComboBox } from 'b-combo-box';
import { BSettings } from 'b-settings';
import BActionManager from 'b-action-manager';
import { BResourceBrowser } from 'b-resource-browser';
import { BCard } from 'b-card';
import { BCardHeader } from 'b-card-header';
import { BResizable } from 'b-resizable';
import { BDrawer } from 'b-drawer';
import { BGridList } from 'b-grid-list';
import { BRadioButton } from 'b-radio-button';
import { BImage } from 'b-image';
import { BDrawerMenu } from 'b-drawer-menu';
import { BDataGrid } from 'b-data-grid';
import { BLabel } from 'b-label';
import { BIconMenu } from 'b-icon-menu';
import { BChartForm } from 'b-chart-form';
import { BMoney } from 'b-money';
import { BIconButton } from 'b-icon-button';
// import { BMoreText } from 'b-more-text';
import { BInformationText } from 'b-information-text';
import { BExcelBrowser } from 'b-excel-browser';
import { BDialog } from 'b-dialog-box';
import { BDateTimePicker } from 'b-datetime-picker';
import { BAvatar } from 'b-avatar';
import { BProductBrowser } from 'b-product-browser-component';
import { BMenu } from 'b-menu';
import { BGridActionPanel } from 'b-grid-action-panel';
import { BFlexPanel } from 'b-flex-panel';
import { BFileInput } from 'b-file-input';
import { BMenuItem } from 'b-menu-item';
import { BRegistryIntellisenseEditor } from 'b-registry-intellisense-editor';
// import  BToolTip  from 'b-tool-tip';
import { BPopover } from 'b-popover';
import { BInputAction } from 'b-input-action';
import { BCriteriaPanel } from 'b-criteria-panel';
import BSnackbar from 'b-snackbar';
import BRdlViewer from 'b-rdl-viewer';
import { BProgress } from 'b-progress';
import { BInputMask } from 'b-input-mask';
import { BShowHidePanel } from 'b-show-hide-panel';
import BBpmRouteHistory from 'b-bpm-route-history';
import BTreeviewGrid from 'b-treeview-grid';
import BTreeview from 'b-treeview';
import { BInputSearch } from 'b-input-search';
import { BGridRow } from 'b-grid-row';
import BBpmUserNote from 'b-bpm-user-note';
import { BGridSection } from 'b-grid-section';
import { BLinearPanel } from 'b-linear-panel';
import { BDivider } from 'b-divider';
import { BTransactionForm } from 'b-transaction-form';
// import { BTabBar } from 'b-tab-bar';
// import { BAccountNote } from 'b-account-note-dialog';
import { BAccountComponent } from 'b-account-component';
import { BAccessPointBrowser } from 'b-access-point-browser';
import { BBankComponent } from 'b-bank-component';
import { BBlackListComponent } from 'b-black-list-component';
import { BBranchComponent } from 'b-branch-component';
import BBusinessDatetimeComponent from 'b-business-datetime-component';
import { BChannelComponent } from 'b-channel-component';
import { BCreditCardComponent } from 'b-credit-card-component';
import { BDivitComponent } from 'b-divit-component';
import { BFECComponent } from 'b-fec-component';
import { BFinancialSegmentBrowser } from 'b-financial-segment-browser';
import { BMainMenu } from 'b-main-menu';
import { BMernisComponent } from 'b-mernis-component';
import { BParameterComponent } from 'b-parameter-component';
import { BPersonComponent } from 'b-person-component';
import { BStoredProcedureViewer } from 'b-stored-procedure-viewer';
import { BSwiftBrowser } from 'b-swift-component';
import { BThirdPartyComponent } from 'b-third-party-component';
import { BThirdPartyRelationPersonsComponent } from 'b-third-party-relation-persons-component';
import { BUserComponent } from 'b-user-component';
import { BWorkgroupComponent } from 'b-workgroup-component';
import { BWorkgroupUserComponent } from 'b-workgroup-user-component';
import { BExpander } from 'b-expander';
import { BComboBox } from 'b-combo-box';

export default [
  { category: 'BusinessComponent', name: 'BWorkgroupComponent', type: 'b-workgroup-component', component: BWorkgroupComponent },
  { category: 'BusinessComponent', name: 'BWorkgroupUserComponent', type: 'b-workgroup-user-component', component: BWorkgroupUserComponent },
  { category: 'BusinessComponent', name: 'BUserComponent', type: 'b-user-component', component: BUserComponent },
  { category: 'BusinessComponent', name: 'BThirdPartyRelationPersonsComponent', type: 'b-third-party-component', component: BThirdPartyRelationPersonsComponent },
  { category: 'BusinessComponent', name: 'BThirdPartyComponent', type: 'b-third-party-relation-persons-component', component: BThirdPartyComponent },
  { category: 'BusinessComponent', name: 'BSwiftBrowser', type: 'b-swift-component', component: BSwiftBrowser },
  { category: 'BusinessComponent', name: 'BStoredProcedureViewer', type: 'b-stored-procedure-viewer', component: BStoredProcedureViewer },
  { category: 'BusinessComponent', name: 'BPersonComponent', type: 'b-person-component', component: BPersonComponent },
  { category: 'BusinessComponent', name: 'BMernisComponent', type: 'b-mernis-component', component: BMernisComponent },
  { category: 'BusinessComponent', name: 'BParameterComponent', type: 'b-parameter-component', component: BParameterComponent },
  { category: 'BusinessComponent', name: 'BMainMenu', type: 'b-main-menu', component: BMainMenu },
  { category: 'BusinessComponent', name: 'BFinancialSegmentBrowser', type: 'b-financial-segment-browser', component: BFinancialSegmentBrowser },
  { category: 'BusinessComponent', name: 'BFECComponent', type: 'b-fec-component', component: BFECComponent },
  { category: 'BusinessComponent', name: 'BDivitComponent', type: 'b-divit-component', component: BDivitComponent },
  { category: 'BusinessComponent', name: 'BCreditCardComponent', type: 'b-credit-card-component', component: BCreditCardComponent },
  { category: 'BusinessComponent', name: 'BChannelComponent', type: 'b-channel-component', component: BChannelComponent },
  { category: 'BusinessComponent', name: 'BBusinessDatetimeComponent', type: 'b-business-datetime-component', component: BBusinessDatetimeComponent },
  { category: 'BusinessComponent', name: 'BBranchComponent', type: 'b-branch-component', component: BBranchComponent },
  { category: 'BusinessComponent', name: 'BBlackListComponent', type: 'b-black-list-component', component: BBlackListComponent },
  { category: 'BusinessComponent', name: 'BBankComponent', type: 'b-bank-component', component: BBankComponent },
  // { category: 'BusinessComponent', name: 'BAccountNote', type: 'b-account-note-dialog', component: BAccountNote },
  { category: 'BusinessComponent', name: 'BAccountComponent', type: 'b-account-component', component: BAccountComponent },
  { category: 'BusinessComponent', name: 'BAccessPointBrowser', type: 'b-access-point-browser', component: BAccessPointBrowser },
  { category: 'BusinessComponent', name: 'BSettings', type: 'b-settings', component: BSettings },
  { category: 'BusinessComponent', name: 'BActionManager', type: 'b-action-manager', component: BActionManager },
  { category: 'BusinessComponent', name: 'BResourceBrowser', type: 'b-resource-browser', component: BResourceBrowser },
  { category: 'UserControl', name: 'BTransactionForm', type: 'b-transaction-form', component: BTransactionForm },
  { category: 'UserControl', name: 'BExpander', type: 'b-expander', component: BExpander },
  // { category: 'UserControl', name: 'BTabBar', type: 'b-tab-bar', component: BTabBar },
  { category: 'UserControl', name: 'BLinearPanel', type: 'b-linear-panel', component: BLinearPanel },
  { category: 'UserControl', name: 'BDivider', type: 'b-divider', component: BDivider },
  { category: 'UserControl', name: 'BGridSection', type: 'b-grid-section', component: BGridSection },
  { category: 'UserControl', name: 'BBpmUserNote', type: 'b-bpm-user-note', component: BBpmUserNote },
  { category: 'UserControl', name: 'BGridRow', type: 'b-grid-row', component: BGridRow },
  { category: 'UserControl', name: 'BInputSearch', type: 'b-input-search', component: BInputSearch },
  { category: 'UserControl', name: 'BTreeviewGrid', type: 'b-treeview-grid', component: BTreeviewGrid },
  { category: 'UserControl', name: 'BTreeview', type: 'b-treeview', component: BTreeview },
  { category: 'UserControl', name: 'BBpmRouteHistory', type: 'b-bpm-route-history', component: BBpmRouteHistory },
  { category: 'UserControl', name: 'BShowHidePanel', type: 'b-show-hide-panel', component: BShowHidePanel },
  { category: 'UserControl', name: 'BInputMask', type: 'b-input-mask', component: BInputMask },
  { category: 'UserControl', name: 'BProgress', type: 'b-progress', component: BProgress },
  { category: 'UserControl', name: 'BRdlViewer', type: 'b-rdl-viewer', component: BRdlViewer },
  { category: 'UserControl', name: 'BSnackbar', type: 'b-snackbar', component: BSnackbar },
  { category: 'UserControl', name: 'BCriteriaPanel', type: 'b-criteria-panel', component: BCriteriaPanel },
  { category: 'UserControl', name: 'BInputAction', type: 'b-input-action', component: BInputAction },
  { category: 'UserControl', name: 'BPopover', type: 'b-popover', component: BPopover },
  { category: 'UserControl', name: 'BFileInput', type: 'b-file-input', component: BFileInput },
  { category: 'UserControl', name: 'BMenuItem', type: 'b-menu-item', component: BMenuItem },
  { category: 'UserControl', name: 'BRegistryIntellisenseEditor', type: 'b-registry-intellisense-editor', component: BRegistryIntellisenseEditor },
  // { category: 'UserControl', name: 'BToolTip', type: 'b-tool-tip', component: BToolTip },
  { category: 'UserControl', name: 'BFlexPanel', type: 'b-flex-panel', component: BFlexPanel },
  { category: 'UserControl', name: 'BGridActionPanel', type: 'b-grid-action-panel', component: BGridActionPanel },
  { category: 'UserControl', name: 'BMenu', type: 'b-menu', component: BMenu },
  { category: 'UserControl', name: 'BProductBrowser', type: 'b-product-browser-component', component: BProductBrowser },
  { category: 'UserControl', name: 'BAvatar', type: 'b-avatar', component: BAvatar },
  { category: 'UserControl', name: 'BDateTimePicker', type: 'b-datetime-picker', component: BDateTimePicker },
  { category: 'UserControl', name: 'BDialog', type: 'b-dialog-box', component: BDialog },
  { category: 'UserControl', name: 'BExcelBrowser', type: 'b-excel-browser', component: BExcelBrowser },
  { category: 'UserControl', name: 'BInformationText', type: 'b-information-text', component: BInformationText },
  // { category: 'UserControl', name: 'BMoreText', type: 'b-more-text', component: BMoreText },
  { category: 'UserControl', name: 'BIconButton', type: 'b-icon-button', component: BIconButton },
  { category: 'UserControl', name: 'BMoney', type: 'b-money', component: BMoney },
  { category: 'UserControl', name: 'BChartForm', type: 'b-chart-form', component: BChartForm },
  { category: 'UserControl', name: 'BIconMenu', type: 'b-icon-menu', component: BIconMenu },
  { category: 'UserControl', name: 'BLabel', type: 'b-label', component: BLabel },
  { category: 'UserControl', name: 'BDataGrid', type: 'b-data-grid', component: BDataGrid },
  { category: 'UserControl', name: 'BDrawerMenu', type: 'b-drawer-menu', component: BDrawerMenu },
  { category: 'UserControl', name: 'BImage', type: 'b-image', component: BImage },
  { category: 'UserControl', name: 'BRadioButton', type: 'b-radio-button', component: BRadioButton },
  { category: 'UserControl', name: 'BButton', type: 'b-button', component: BButton },
  { category: 'UserControl', name: 'BDrawer', type: 'b-drawer', component: BDrawer },
  { category: 'UserControl', name: 'BGridList', type: 'b-grid-list', component: BGridList },
  { category: 'UserControl', name: 'BList', type: 'b-list', component: BList },
  { category: 'UserControl', name: 'BListItem', type: 'b-list-item', component: BListItem },
  { category: 'UserControl', name: 'BToggle', type: 'b-toggle', component: BToggle },
  { category: 'UserControl', name: 'BInput', type: 'b-input', component: BInput },
  { category: 'UserControl', name: 'BInputNumeric', type: 'b-input-numeric', component: BInputNumeric },
  // { category: 'UserControl', name: 'BComboBox', type: 'b-combo-box', component: BComboBox },
  { category: 'UserControl', name: 'BCard', type: 'b-card', component: BCard },
  { category: 'UserControl', name: 'BCardHeader', type: 'b-card-header', component: BCardHeader },
  { category: 'UserControl', name: 'BResizable', type: 'b-resizable', component: BResizable },
  { category: 'UserControl', name: 'BComboBox', type: 'b-combo-box', component: BComboBox },
];

export function getReadablePropTypes(CurrentPropTypes) {
  let typeList = [];
  for (var key in CurrentPropTypes) {
    // skip loop if the property is from prototype
    if (!CurrentPropTypes.hasOwnProperty(key)) continue;


    let currentType = CurrentPropTypes[key];
    let { type, isRequired } = { type: 'undefined', isRequired: false };

    if (currentType == PropTypes.string || currentType == PropTypes.string.isRequired) {
      type = 'string';
      if (currentType == PropTypes.string.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.number || currentType == PropTypes.number.isRequired) {
      type = 'number';
      if (currentType == PropTypes.number.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.bool || currentType == PropTypes.bool.isRequired) {
      type = 'bool';
      if (currentType == PropTypes.bool.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.array || currentType == PropTypes.array.isRequired) {
      type = 'array';
      if (currentType == PropTypes.array.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.node || currentType == PropTypes.node.isRequired) {
      type = 'node';
      if (currentType == PropTypes.node.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.element || currentType == PropTypes.element.isRequired) {
      type = 'element';
      if (currentType == PropTypes.element.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.object || currentType == PropTypes.object.isRequired) {
      type = 'object';
      if (currentType == PropTypes.object.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.func || currentType == PropTypes.func.isRequired) {
      type = 'func';
      if (currentType == PropTypes.func.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.any || currentType == PropTypes.any.isRequired) {
      type = 'any';
      if (currentType == PropTypes.any.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.arrayOf || currentType == PropTypes.arrayOf.isRequired) {
      type = 'arrayOf';
      if (currentType == PropTypes.arrayOf.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.oneOfType || currentType == PropTypes.oneOfType.isRequired) {
      type = 'oneOfType';
      if (currentType == PropTypes.oneOfType.isRequired)
        isRequired = true;
    }
    else if (currentType == PropTypes.oneOf || currentType == PropTypes.oneOf.isRequired) {
      type = 'oneOf';
      if (currentType == PropTypes.oneOf.isRequired)
        isRequired = true;
    }
    else
      type = 'undefined';

    if (CurrentPropTypes.style == PropTypes.string) {
      type = 'undefined';
    }

    let item = { name: key, type, isRequired };
    typeList.push(item);
  }
  return typeList;
}
