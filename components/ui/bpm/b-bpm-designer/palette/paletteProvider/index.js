/**
 * A provider for quick service task production
 */
function BpmPaletteProvider(palette, create, elementFactory, bpmData, styles) {

  this._create = create;
  this._elementFactory = elementFactory;
  this.bpmData = bpmData;
  this.styles = styles;
  palette.registerProvider(this);
}

BpmPaletteProvider.prototype.getPaletteEntries = function () {

  var elementFactory = this._elementFactory,
    create = this._create;

  function createAction(type, oneType, group, title, customHtml, className, options, propsInfo) {

    function createListener(event) {
      var serviceTaskShape = elementFactory.create('shape', { type: type, oneType: oneType, propsInfo: propsInfo });
      if (options) {
        if (options['isExpanded'] == true) {
          serviceTaskShape.businessObject.di.isExpanded = options.isExpanded;
        }
      }
      create.start(event, serviceTaskShape);
    }
    return {
      group: group,
      title: title,
      customHtml: customHtml,
      className: className,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  var buttonList = [];
  this.bpmData.nodeList.forEach((bpmItem) => {
    buttonList.push(createAction(bpmItem.type, bpmItem.oneType, bpmItem.group, bpmItem.toolTip, bpmItem.icon, bpmItem.className, bpmItem.options, bpmItem.propsInfo));
  });

  return buttonList;
};


module.exports = {
  __init__: ['bpmPalette'],
  bpmPalette: ['type', BpmPaletteProvider]
};

