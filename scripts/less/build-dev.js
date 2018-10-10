import lessCompiler from './build';
var fs = require('fs'),path = require('path');
const componentsRoot = path.resolve('components');

function fileExists(filePath)
{
  try
    {
    return fs.statSync(filePath).isFile();
  }
  catch (err)
    {
    return false;
  }
}

function getDirectories(srcpath, promises) {
  var directories = fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });   
  directories.forEach(function(directory) {
    if(directory !== 'base') {      
      var possibleCategory = path.join(srcpath, directory);
      if(fileExists(path.join(possibleCategory, 'index.js'))) {
        console.log(possibleCategory);
        promises.push(lessCompiler(possibleCategory, true));
      }
      else {  
        getDirectories(possibleCategory, promises);
      }
    }
  });
}



function BuildDevCss() {
  var promises = [];
  getDirectories(componentsRoot, promises);
  return Promise.all(promises);
}

BuildDevCss();