
import {
  forEach
} from 'min-dash';

import { isExternalElement } from '../bpmn-js/util/ModelUtil';

export default function PopupMenu(popupMenu, bpmData) {
  this.bpmData = bpmData;
  this._popupMenu = popupMenu;
  // this._popupMenu.create('bpmn-replaceNew', this);
  this._popupMenu.registerProvider('bpmn-replace', this);
  // this._popupMenu.registerProvider(this);
}

function appendEntries(id, title, imageUrl, imageStyle, className, active, label) {


  var entries = [{

    label: label,
    id: id,
    className: className,
    title: title,
    imageUrl: imageUrl,
    imageStyle: imageStyle,
    active: active,
    action: function () {
      alert('Button has been clicked');
    }
  }];

  return entries;
}

PopupMenu.prototype.getEntries = function (element) {
  var entries = [];
  forEach(this.bpmData.nodeList, function (actionItem) {
    // iç içe açılabilmesi için element null olmamalı. Geliştirme istenirse yapılacak..
    if (isExternalElement(element, actionItem.type, actionItem.oneType)) {
      forEach(actionItem.entryList, function (entriesList) {
        entries.push(appendEntries(entriesList.id, entriesList.toolTip, entriesList.imageUrl, entriesList.imageStyle, entriesList.className, entriesList.active, entriesList.label, ));
      });
    }
  });
  return entries[0];
};

PopupMenu.prototype.getHeaderEntries = function (element) {

  var headerEntries = [];
  forEach(this.bpmData.nodeList, function (actionItem) {
    // iç içe açılabilmesi için element null olmamalı. Geliştirme istenirse yapılacak..
    if (isExternalElement(element, actionItem.type, actionItem.oneType)) {
      forEach(actionItem.headerEntryList, function (headerEntriesList) {
        headerEntries.push(appendEntries(headerEntriesList.id, headerEntriesList.toolTip, headerEntriesList.imageUrl, headerEntriesList.imageStyle, headerEntriesList.className, headerEntriesList.active));
      });
    }
  });
  return headerEntries[0];
};


module.exports = {
  __init__: ['popupMenus'],
  popupMenus: ['type', PopupMenu],
};
