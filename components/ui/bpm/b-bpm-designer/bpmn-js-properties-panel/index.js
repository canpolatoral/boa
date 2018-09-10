module.exports = {
  __depends__: [
    require('./cmd'),
    require('../diagram-js/i18n/translate').default
  ],
  __init__: [ 'propertiesPanel' ],
  propertiesPanel: [ 'type', require('./PropertiesPanel') ]
};
