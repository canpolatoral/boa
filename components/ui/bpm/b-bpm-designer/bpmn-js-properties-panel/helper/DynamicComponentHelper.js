import entryFactory from '..//factory/EntryFactory';

function create(item, element) {

  var _component :any =null;

  if (item.type == 'input') {
    _component= entryFactory.validationAwareTextField({
      id: item.id,
      label: item.id,
      description: item.description,
      modelProperty: item.id,
      context: element.context,
      element: element
    });

  }
  else if (item.type == 'parameterComponent') {

    _component=  entryFactory.parameterComponentFactory({
      id: item.id,
      description: item.description,
      label: item.id,
      modelProperty: item.id,
      context: element.context
    });
  }

  return _component;
}

export default create;
