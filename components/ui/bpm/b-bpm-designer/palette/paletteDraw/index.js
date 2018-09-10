
import inherits from 'inherits';
import { forEach } from 'min-dash';
import BaseRenderer from '../../diagram-js/draw/BaseRenderer';

import { isExternalElement } from '../../bpmn-js/util/ModelUtil';


// import {
//   append as svgAppend,
//   attr as svgAttr,
//   create as svgCreate
// } from 'tiny-svg';


function PaletteRender(eventBus, styles, bpmData) {
  BaseRenderer.call(this, eventBus, 1500);

  this.bpmData = bpmData;
  this.styles = styles;
  this.canRender = function (element) {
    var canRender = false;

    forEach(this.bpmData.nodeList, function (bpmItem) {

      if (isExternalElement(element, bpmItem.type, bpmItem.oneType)) {
        canRender = true;
      }
      else {
        if (!canRender) {
          canRender = false;
        }
      }

    });
    return canRender;
  };

  // this.drawShape = function (parent, shape) {
  //   var gfx = null;
  //   this.bpmData.nodeList.forEach((bpmItem) => {

  //     if (bpmItem.type == shape.type && bpmItem.oneType == shape.oneType)
  //       gfx = bpmItem.icon;

  //   });

  //   var path = svgCreate('path');
  //   var parser = new DOMParser();
  //   var xmlDoc = parser.parseFromString(gfx, 'text/xml');
  //   var x = xmlDoc.getElementsByTagName('path');
  //   for (var i = 0; i < x.length; i++) {
  //     svgAttr(path, { d: x[i].getAttribute('d') });
  //   }
  //   svgAppend(parent, path);
  //   return path;
  // };


}

inherits(PaletteRender, BaseRenderer);

module.exports = PaletteRender;


module.exports = {
  __init__: ['paletteRender'],
  paletteRender: ['type', PaletteRender]
};
