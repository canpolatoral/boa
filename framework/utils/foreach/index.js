/**
 * Modules
 */

var isObject = require('../is-object');
var isArray = require('../is-array');
var forEachObj = require('../foreach-obj');
var forEachArr = require('../foreach-array');

/**
 * Expose foreach
 */

module.exports = forEach['default'] = forEach;

/**
 * For each
 * @param  {Function} fn  iterator
 * @param  {Object}   obj object to iterate over
 */

function forEach (fn, a) {
  if (isArray(a)) return forEachArr.call(this, fn, a);
  if (isObject(a)) return forEachObj.call(this, fn, a);
}