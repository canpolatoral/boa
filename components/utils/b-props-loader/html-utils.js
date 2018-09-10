var _acorn = require('acorn-object-spread/inject')(require('acorn-jsx'));
var _escodegen = require('escodegen-jsx');
var _estraverse = require('./estraverse-fb/estraverse-fb.js');

// Returns array of standart HTML tags like div, span, etc
// returns: Array of standart HTML tags
function getStandartHtmlTags() {
  let standartTags = ['div', 'br', 'span', 'nav', 'section', 'header', 'footer', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tbody', 'thead', 'tr', 'td', 'ul', 'ol', 'img', 'input', 'select', 'option', 'textarea', 'button', 'label', 'address', 'area', 'blockquote', 'caption', 'col', 'colgroup'];
  return standartTags;
}

// Extracts the first word from a text. Used for getting the tag part from an html code
// input: Text starting with a '<' character and ending with a '>'
// returns: First word of the text (Eg: <br/> : br, <div style='color:blue'> : div )
function retriveHtmlTag(textPortion) {
  let spacePos = textPortion.indexOf(' ');
  let newLinePos = textPortion.indexOf('\n');
  let tagEndingExp = new RegExp('[\/]*>', '');
  let bracePos = tagEndingExp.exec(textPortion).index;
  spacePos = (spacePos >= 0 && newLinePos >= 0 && spacePos <= newLinePos) ? spacePos : (newLinePos >= 0 ? newLinePos : spacePos);
  let endPos = (spacePos >= 0 && spacePos <= bracePos) ? spacePos : bracePos;

  let tag = textPortion.substr(1, endPos - 1).trim();
  return tag;
}

// Checks if the given source (tagWithAttributes) contains the given search string array. Used to check if the given HTML code contains the given attributes
// input: tagWithAttributes: HTML code with start and end brackets (Eg: 1) <div class='myclass' style='color:red'>, 2) <br/> )
//        attribArr: Array of attributes to be searched (Eg: ['style', 'class'])
// returns: true if one of the searched attributes exists in the given text
function checkAlreadyExists(tagWithAttributes, attrib) {
  if (attrib) {
    let sourceStr = tagWithAttributes.toLowerCase();
    if (sourceStr.indexOf(' ' + attrib) >= 0) {
      return true;
    }
  }
  return false;
}

// Given the source text, replaces the searchTxt at the startPos position with the replaceTxt.
function replaceAt(source, searchTxt, replaceTxt, startPos) {
  let newTxt = source.substring(0, startPos) + replaceTxt + source.substring(startPos + searchTxt.length);
  return newTxt;
}

function checkIfTagIsSuitable(tag, whiteList, blackList, regEx) {
  var tagLower = tag.toLowerCase();
  var isSuitable = false;
  if (!(whiteList || regEx || blackList)) {
    // Default :
    blackList = [];
  }

  if (whiteList) {
    for (var i = 0; i < whiteList.length; i++) {
      if (whiteList[i].toLowerCase() === tagLower) {
        isSuitable = true;
        break;
      }
    }
  } else if (regEx) {
    isSuitable = tag.match(regEx);
  } else if (blackList) {
    var inBlackList = false;
    var list = blackList.concat(getStandartHtmlTags());
    for (var j = 0; j < list.length; j++) {
      if (list[j].toLowerCase() === tagLower) {
        inBlackList = true;
        break;
      }
    }
    isSuitable = !inBlackList;
  }
  return isSuitable;
}

function parseSnapshot(source) {
  var snapshotIndex = 0;
  var astResult = _acorn.parse(source, { ranges: true, plugins: { jsx: true, objectSpread: true }, sourceType: 'module' });
  _estraverse.traverse(astResult, {
    enter: function enter(node) {
      if (node.type == 'JSXOpeningElement') {
        if (node.attributes && node.attributes.length > 0) {
          for (var index = 0; index < node.attributes.length; index++) {
            if (node.attributes[index].name
              && node.attributes[index].name.name == 'ref'
              && node.attributes[index].value
              && node.attributes[index].value.type == 'JSXExpressionContainer') {
              var cmpProp = _escodegen.generate(node.attributes[index].value.expression);
              var refstart = node.attributes[index].name.start ? node.attributes[index].name.start : null;
              if (refstart) {
                if (cmpProp.indexOf('this.snaps.') > 0) {
                  var snapRegex = new RegExp(/this.snaps.(\w+)/g);
                  var match = snapRegex.exec(cmpProp);
                  if (match != null && match.length > 0) {
                    var definition = match[0].replace('this.snaps.', '');
                    var targetSnapshot = ' snapshot={this.state.snapshot["' + definition + '"]} ';
                    // targetSnapshot = targetSnapshot + 'snapKey={"' + definition + '"} ';
                    targetSnapshot = targetSnapshot + 'snapKey={this.getSnapKey("' + definition + '")} ';
                    targetSnapshot = targetSnapshot + 'id={"' + definition + '"} ';
                    // targetSnapshot = targetSnapshot + 'errorText={this.state.errors && this.state.errors.' + definition + '} '; // dışarıdan errortext verilince hata sebep olduğu için comment out edildi. (coral)
                    targetSnapshot = targetSnapshot + '{...this.state.dynamicProps["' + definition + '"]} ';
                    refstart = node.attributes[node.attributes.length - 1].end;
                    source = source.substring(0, refstart + snapshotIndex) + targetSnapshot + source.substring(refstart + snapshotIndex);
                    snapshotIndex = snapshotIndex + targetSnapshot.length;
                  }
                }
              }
              break;
            }
          }
        }
      }
    }
  });
  return source;
}

module.exports = function (source, commonPropsArr, whiteList, blackList, regEx) {
  source = parseSnapshot(source);
  var htmlTagExp = new RegExp(/<[\w]+/g);
  var match = htmlTagExp.exec(source);
  while (match != null) {
    // Now we know the start of the tag, lets find the space or end of the tag:
    var endBracePos = source.indexOf('>', match.index + 1);
    var tagWithAttribs = source.substring(match.index, endBracePos + 1);
    if (checkAlreadyExists(tagWithAttribs, commonPropsArr)) {
      match = htmlTagExp.exec(source);
      continue;
    }

    var tag = retriveHtmlTag(tagWithAttribs);
    var isSuitable = checkIfTagIsSuitable(tag, whiteList, blackList, regEx);

    if (isSuitable) {
      var compTag = '<' + tag;
      var newTag = compTag + ' ';
      for (var i = 0; i < commonPropsArr.length; i++) {
        var prop = commonPropsArr[i].split('=')[0].toLowerCase();
        if (!checkAlreadyExists(tagWithAttribs, prop)) {
          newTag += commonPropsArr[i] + ' ';
        }
      }

      // Now, replace the tag with newTag:
      source = replaceAt(source, compTag, newTag, match.index);
    }
    match = htmlTagExp.exec(source);
  }
  return source;
};
