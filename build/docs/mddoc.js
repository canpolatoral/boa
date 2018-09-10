var path = require('path');
var docJsonToMd = require('./doc-json-to-md');
var fse = require('fs-extra');

export default function BuildMdDoc(componentRoot) {
  var componententry = path.join(componentRoot, 'docs', 'content.json');
  var distpath = path.join(componentRoot, 'package', 'README.md'); 
  var docContent = require(componententry);
  var result = docJsonToMd(docContent);
  fse.outputFileSync(distpath, result);  
}