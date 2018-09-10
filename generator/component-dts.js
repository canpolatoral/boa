import path from 'path';
import fs from 'fs';
import PropTypes from 'prop-types';

import jsdom from 'jsdom';

var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;
global.document = doc;
global.window = win;

function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}

propagateToGlobal(win);

const COMPONENTS = `../components/${process.argv[process.argv.length - 1].substring(2)}/`;
const COMPONENTS_DIRECTORY = path.join(__dirname, COMPONENTS);
const COMPONENTS_UI = '../components/ui/';
const COMPONENTS_BUSINESS = '../components/business/';
const COMPONENTS_DIRECTORY_UI = path.join(__dirname, COMPONENTS_UI);
const COMPONENTS_DIRECTORY_BUSINESS = path.join(__dirname, COMPONENTS_BUSINESS);

let properties = [];

const getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};
const getPropTypesAsString = (className, filePath) => {
  const text = fs.readFileSync(filePath, 'utf-8');
  const start = text.indexOf(`${className}.propTypes`) < 0 ? text.indexOf('static propTypes') : text.indexOf(`${className}.propTypes`);
  const end = text.length - start;
  return text.substr(start, end).split('\n');
};
const getFunctionSignature = (className, filePath, functionName) => {
  try {
    const propTypesString = getPropTypesAsString(className, filePath);
    const myLine = propTypesString.find(x => x.indexOf(functionName) > -1);
    return myLine.split('//')[1].trim() + ';';
  } catch (err) {
    return '() => void; // TODO: method parametre ve dönüş tipi eklenmeli! ';
  }

};
const checkArrayOf = (className, filePath, propName) => {
  let result = {};
  try {
    const propTypesString = getPropTypesAsString(className, filePath);
    let myLine = propTypesString.find(x => x.indexOf(propName) > -1);
    const key = 'arrayOf';
    if (myLine.indexOf(key) > -1) {
      if (myLine.indexOf('isRequired') > -1) {
        result.key = propName;
      } else {
        result.key = propName + '?';
      }
      let start = myLine.indexOf('arrayOf') + 1 + key.length;
      let end = myLine.length - start;
      myLine = myLine.substr(start, end);
      end = myLine.indexOf(')');
      const final = myLine.substr(0, end);

      if (final.indexOf('PropTypes.string') > -1) {
        result.value = 'string[];';
      } else if (final.indexOf('PropTypes.number') > -1) {
        result.value = 'number[];';
      } else if (final.indexOf('PropTypes.object') > -1) {
        result.value = 'object[];';
      } else if (final.indexOf('PropTypes.element') > -1) {
        result.value = 'React.ReactElement<any>[];';
      } else if (final.indexOf('PropTypes.node') > -1) {
        result.value = 'React.ReactNode[];';
      } else {
        result.value = 'any[];';
      }
    }

  } catch (err) {
    console.log(err);
  }
  finally {
    return result;
  }

};
const checkOneOf = (className, filePath, propName) => {
  let result = {};
  try {
    const propTypesString = getPropTypesAsString(className, filePath);
    let myLine = propTypesString.find(x => x.indexOf(propName) > -1);
    const key = 'oneOf(';
    if (myLine.indexOf(key) > -1) {
      if (myLine.indexOf('isRequired') > -1) {
        result.key = propName;
      } else {
        result.key = propName + '?';
      }
      let start = myLine.indexOf('oneOf(') + key.length;
      let end = myLine.length - start;
      myLine = myLine.substr(start, end);
      end = myLine.indexOf(')');
      let final = myLine.substr(0, end);
      final = final.replace(new RegExp("'", 'g'), '"');
      let myTypes = JSON.parse(final);
      result.value = '';
      myTypes.forEach((obj) => {
        if (typeof obj === 'number') {
          result.value = result.value + `${obj} |`;
        } else if (typeof obj === 'string') {
          result.value = result.value + `"${obj}" |`;
        }
      });

      if (result.value.length > 0) {
        result.value = result.value.substring(0, result.value.length - 1) + ';';
      }
      else {
        result.value = 'any; // TODO: propType handle edilemedi.';
      }
    }

  } catch (err) {
    console.log(err);
  }
  finally {
    return result;
  }

};

const getDefinedTypes = (component, className, packageName, path) => {
  Object.keys(component.propTypes).forEach((key, index) => {
    var propType = component.propTypes[key];

    if (propType === PropTypes.bool || propType === PropTypes.bool.isRequired) {
      if (propType === PropTypes.bool.isRequired) {
        properties.push({ key: key, value: 'boolean;' });
      } else {
        properties.push({ key: key + '?', value: 'boolean;' });
      }
    }

    else if (propType === PropTypes.func || propType === PropTypes.func.isRequired) {
      if (propType === PropTypes.func.isRequired) {
        properties.push({ key: key, value: getFunctionSignature(className, path, key) });
      } else {
        properties.push({ key: key + '?', value: getFunctionSignature(className, path, key) });
      }
    }

    else if (propType === PropTypes.number || propType === PropTypes.number.isRequired) {
      if (propType === PropTypes.number.isRequired) {
        properties.push({ key: key, value: 'number;' });
      } else {
        properties.push({ key: key + '?', value: 'number;' });
      }
    }

    else if (propType === PropTypes.object || propType === PropTypes.object.isRequired) {
      if (propType === PropTypes.object.isRequired) {
        if (key.indexOf('style') !== -1) {
          properties.push({ key: key, value: 'React.CSSProperties;' });
        } else {
          properties.push({ key: key, value: 'any;' });
        }
      } else {
        if (key.indexOf('style') !== -1) {
          properties.push({ key: key + '?', value: 'React.CSSProperties;' });
        } else {
          properties.push({ key: key + '?', value: 'any;' });
        }
      }
    }

    else if (propType === PropTypes.string || propType === PropTypes.string.isRequired) {
      if (propType === PropTypes.string.isRequired) {
        properties.push({ key: key, value: 'string;' });
      } else {
        properties.push({ key: key + '?', value: 'string;' });
      }
    }

    else if (propType === PropTypes.any || propType === PropTypes.any.isRequired) {
      if (propType === PropTypes.any.isRequired) {
        properties.push({ key: key, value: 'any;' });
      } else {
        properties.push({ key: key + '?', value: 'any;' });
      }
    }

    else if (propType === PropTypes.element || propType === PropTypes.element.isRequired) {
      if (propType === PropTypes.element.isRequired) {
        properties.push({ key: key, value: 'React.ReactElement<any>;' });
      } else {
        properties.push({ key: key + '?', value: 'React.ReactElement<any>;' });
      }
    }

    else if (propType === PropTypes.node || propType === PropTypes.node.isRequired) {
      if (propType === PropTypes.node.isRequired) {
        properties.push({ key: key, value: 'React.ReactNode;' });
      } else {
        properties.push({ key: key + '?', value: 'React.ReactNode;' });
      }
    }

    else if (propType === PropTypes.array || propType === PropTypes.array.isRequired) {
      if (propType === PropTypes.array.isRequired) {
        properties.push({ key: key, value: 'any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.' });
      } else {
        properties.push({ key: key + '?', value: 'any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.' });
      }
    }

    // TODO
    else {
      // arrayOf, oneOf, instanceOf, objectOf, oneOfType,
      const arrayOf = checkArrayOf(className, path, key);
      if (arrayOf && arrayOf.key) {
        properties.push({ key: arrayOf.key, value: arrayOf.value });
      } else {
        const oneOf = checkOneOf(className, path, key);
        if (oneOf && oneOf.key) {
          properties.push({ key: oneOf.key, value: oneOf.value });
        } else {
          // symbol, shape, custompropType
          properties.push({ key: key + '?', value: 'any; // TODO: propType handle edilemedi.' });
        }
      }
    }
  });

  // template string indent bozulmasın diye böyle oluşturuldu.
  let template = `
declare namespace __${className} {
    import React = __React;
    interface ${className}Props extends __BComponent.BComponentProps {`;


  Object.keys(component.propTypes).forEach((key, index) => {
    template = template + `
        ${properties[index].key}: ${properties[index].value}`;
  });

  template = template + `
    }

    export class ${className} extends  __BComponent.BComponetBase<${className}Props> {
    }
}

declare module '${packageName}' {
    export import ${className} = __${className}.${className};
    export default ${className};
}`;

  return template;
};

const createDtsFile = (moduleName, dts) => {
  if (!fs.existsSync(path.join(__dirname, 'dts'))) {
    fs.mkdirSync(path.join(__dirname, 'dts'));
  }

  if (!fs.existsSync(path.join(__dirname, 'dts', moduleName))) {
    fs.mkdirSync(path.join(__dirname, 'dts', moduleName));
  }
  fs.writeFile(path.join(__dirname, 'dts', moduleName, moduleName + '.d.ts'), dts, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(moduleName + '.d.ts oluşturuldu');
  });
};


if (process.argv[process.argv.length - 1].substring(2) === 'ui') {
  const dirs = getDirectories(path.join(COMPONENTS_DIRECTORY));
  dirs.forEach((dir) => {
    const subDirs = getDirectories(path.join(COMPONENTS_DIRECTORY, dir));
    subDirs.forEach((sub) => {
      properties = [];
      const component = require(COMPONENTS + '/' + dir + '/' + sub);
      const dts = getDefinedTypes(component.default, component.default.name, sub, path.join(COMPONENTS_DIRECTORY, dir, sub, 'index.js'));
      createDtsFile(sub, dts);
    });
  });
} else if (process.argv[process.argv.length - 1].substring(2) === 'business') {
  const dirs = getDirectories(path.join(COMPONENTS_DIRECTORY));
  dirs.forEach((dir) => {
    properties = [];
    const component = require(COMPONENTS + '/' + dir);
    const dts = getDefinedTypes(component.default, component.default.name, dir, path.join(COMPONENTS_DIRECTORY, dir, 'index.js'));
    createDtsFile(dir, dts);
  });
} else {
  const moduleName = process.argv[process.argv.length - 1].substring(2);

  getDirectories(COMPONENTS_DIRECTORY_UI).forEach((dir) => {
    getDirectories(path.join(__dirname, COMPONENTS_UI, dir)).forEach((sub) => {
      if (sub === moduleName) {
        properties = [];
        const component = require(COMPONENTS_UI + '/' + dir + '/' + sub);
        const dts = getDefinedTypes(component.default, component.default.name, sub, path.join(COMPONENTS_DIRECTORY_UI, dir, sub, 'index.js'));
        createDtsFile(sub, dts);
      }
    });
  });

  getDirectories(COMPONENTS_DIRECTORY_BUSINESS).forEach((dir) => {
    if (dir === moduleName) {
      properties = [];
      const component = require(COMPONENTS_BUSINESS + '/' + dir);
      const dts = getDefinedTypes(component.default, component.default.name, dir, path.join(COMPONENTS_DIRECTORY_BUSINESS, dir, 'index.js'));
      createDtsFile(dir, dts);
    }
  });

}