'use strict';

import {  isExternalElement } from '../../bpmn-js/util/ModelUtil';
import {
  assign,
  forEach
} from 'min-dash';


function PaletteContext(eventBus, contextPad, commandStack, create, elementFactory, injector, bpmData) {

  this.bpmData = bpmData;
  contextPad.registerProvider(this);

  this._autoPlace = injector.get('autoPlace', false);
  var autoPlace = this._autoPlace;

  function appendAction( type, group, title, imageUrl, imageStyle, className, options) {

    function appendStart(event, element) {

      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, element);
    }


    var append = autoPlace ? function (event, element) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      autoPlace.append(element, shape);
    } : appendStart;


    return {
      group: group,
      className: className,
      title: title,
      imageStyle: imageStyle,
      imageUrl: imageUrl,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
  }
 
  this.getContextPadEntries = function (element) {
    var actionList = [];
    forEach(this.bpmData.nodeList, function (actionItem) {
      // iç içe açılabilmesi için element null olmamalı. Geliştirme istenirse yapılacak..
      if (isExternalElement(element, actionItem.type, actionItem.oneType)) {
        forEach(actionItem.actionList, function (actionItemList) {
          actionList.push(appendAction(actionItemList.type, actionItemList.group, actionItemList.toolTip, actionItemList.imageUrl, actionItemList.imageStyle, actionItemList.className, actionItemList.options));  
        });
      }
    });

    return actionList;
  };
 
}

module.exports = PaletteContext;


module.exports = {
  __init__: ['colorPicker'],
  colorPicker: ['type', PaletteContext],
};
