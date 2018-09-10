/* eslint-disable */
(function () {
  /**
   * convert
   */

  function convert(src: string) {
    var x = src.replace(/flowdocument/gi, 'div').replace(/paragraph/gi, 'p').replace(/listitem/gi, 'li').replace(/span/gi, 'run');
    x = x.replace(/list markerstyle="Decimal"/gi, 'ol Type="1"');

    return formatHTML(x);
  }

  function formatHTML(x: string) {
    var fragment = window.document.createDocumentFragment();
    var container = window.document.createElement('div');
    container.innerHTML = x;
    fragment.appendChild(container);
    setStylesOfTargets(fragment, 'div');
    setStylesOfTargets(fragment, 'run');
    setStylesOfTargets(fragment, 'p');

    return container.innerHTML;
  }

  function setStylesOfTargets(fragment: any, targetType: string) {
    var targets = fragment.firstChild.getElementsByTagName(targetType);
    for (var i = 0; i < targets.length; i++) {
      var atts = targets[i].attributes;//targets[i].getAttributeNames(); ie de getAttributeNames çalışmıyor.
      for (var j = 0; j < atts.length; j++) {
        if (atts[j].name != 'style' && atts[j].name != 'xml:space')
          targets[i].style[attributeMap(atts[j].name)] = atts[j].name == 'foreground' ? hexToRgb(targets[i].getAttribute(atts[j].name)) : targets[i].getAttribute(atts[j].name);
      }
    }
  }

  function attributeMap(att) {
    switch (att) {
      case 'fontstyle':
        return 'font-style';
        break;
      /* case 'fontfamily':
         return 'font-family';
         break;*/
      case 'fontweight':
        return 'font-weight';
        break;
      case 'foreground':
        return 'color';
        break;
      default: return att;
    }
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = convert;
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return convert; });
  } else {
    this.convert = convert;
  }
}).call(function () {
  return this || (typeof window !== 'undefined' ? window : global);
}());



