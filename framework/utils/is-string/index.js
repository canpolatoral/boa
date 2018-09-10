/**
 * Expose isString
 */

module.exports = isString['default'] = isString;

/**
 * Check if string
 * @param  {Mixed}  value
 * @return {Boolean}
 */
function isString (value) {
  return typeof value === 'string';
}
