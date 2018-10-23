import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import { parse } from 'react-docgen';

const COMPONENTS = '../../src/components/';
const STORIES = '../../stories/';
const COMPONENTS_DIRECTORY = path.join(__dirname, COMPONENTS);
const STORIES_DIRECTORY = path.join(__dirname, STORIES);

const options = yargs.option('component', {
  default: 'all',
  type: 'string'
}).argv;

const directories = fs.readdirSync(COMPONENTS_DIRECTORY).filter((file) => {
  return fs.statSync(path.join(COMPONENTS_DIRECTORY, file)).isDirectory();
});


const generateDocument = (component) => {
  if (component == 'Scroll' || component == 'Icon')
    return;

  const fileContent = fs.readFileSync(path.join(COMPONENTS_DIRECTORY, component, component + '.js'), { encoding: 'utf8' });

  const componentInfo = parse(fileContent);
  repair(componentInfo);

  // if (componentInfo.composes && componentInfo.composes.length > 0) {
  //   componentInfo.composes.forEach((item) => {

  //   })
  // }
  if (!fs.existsSync(path.join(STORIES_DIRECTORY, component))) {
    fs.mkdirSync(path.join(STORIES_DIRECTORY, component));
  }
  fs.writeFileSync(path.join(STORIES_DIRECTORY, component, 'doc.json'), JSON.stringify(componentInfo, null, '\t'), { flag: 'w', encoding: 'utf8' });
};


const repair = (obj) => {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == 'object') {
        repair(obj[property]);
      } else {
        let str = obj[property];
        if (typeof str === 'string' && str[0] == '\'' && str[str.length - 1] == '\'') {
          obj[property] = str.slice(1, str.length - 1);
        } else if (typeof str === 'string' && str.startsWith('new Date(')) {
          str = str.slice(9, str.length - 1).replace(' ', '');
          const params = str.split(',');
          obj[property] = new Date(...params);
        } else {
          try {
            obj[property] = JSON.parse(str);
          } catch (err) { // eslint-disable

          }
        }
      }
    }
  }
};


directories.forEach((dir) => {
  if (options.component === 'all' || dir == options.component)
    generateDocument(dir);
});
