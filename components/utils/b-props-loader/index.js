var loaderUtils = require('loader-utils');
var addProps = require('./html-utils.js');

module.exports = function (source) {
  var query = loaderUtils.getOptions(this);

  this.cacheable(true);	
  var commonProps = '';
  // var commonPropsArr = '';
  var whiteList = null;
  var blackList = null;
  var regEx = null;
  if (query.attribsWithValues) {
    commonProps = query.attribsWithValues; // Ex: 'deviceSize={this.props.deviceSize}'
  } else {
    throw new Error('attribsWithValues cannot be empty');
  }
  if (query.whiteList) {
    whiteList = query.whiteList;
  }
  if (query.regEx) {
    regEx = new RegExp(query.regEx, 'i');
  }
  if (query.blackList) {
    blackList = query.blackList;
  }
  var newSource = addProps(source, commonProps, whiteList, blackList, regEx);
  return newSource;
};