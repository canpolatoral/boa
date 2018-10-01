import PropTypes from 'prop-types';

String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

export function getReadablePropTypes(CurrentPropTypes) {
  let typeList = [];
  for (var key in CurrentPropTypes) {

    if (key === 'inputAlign') {
      console.log(CurrentPropTypes);
    }
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
