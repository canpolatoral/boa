/* eslint-disable no-restricted-syntax */

import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import { parse } from 'react-docgen';

const options = yargs
  .option('input', {
    default: 'all',
    type: 'string',
  })
  .option('output', {
    default: 'console',
    type: 'string',
  }).argv;

const repair = obj => {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object') {
        repair(obj[property]);
      } else {
        let str = obj[property];
        if (typeof str === 'string' && str[0] === "'" && str[str.length - 1] === "'") {
          obj[property] = str.slice(1, str.length - 1);
        } else if (typeof str === 'string' && str.startsWith('new Date(')) {
          str = str.slice(9, str.length - 1).replace(' ', '');
          const params = str.split(',');
          obj[property] = new Date(...params);
        } else {
          try {
            obj[property] = JSON.parse(str);
          } catch (err) {
            // eslint-disable
          }
        }
      }
    }
  }
};

const generateDocument = component => {
  if (component === 'Scroll' || component === 'Icon') return;

  const fileContent = fs.readFileSync(path.join(__dirname, '..', '..', component), {
    encoding: 'utf8',
  });

  const componentInfo = parse(fileContent);
  repair(componentInfo);

  if (options.output === 'console') {
    console.log(JSON.stringify(componentInfo, null, '\t')); // eslint-disable-line
  } else {
    fs.writeFileSync(
      path.join(__dirname, '..', '..', options.output),
      JSON.stringify(componentInfo, null, '\t'),
      { flag: 'w', encoding: 'utf8' },
    );
  }
};

const generate = () => {
  if (options.input === 'all') {
    throw new Error('input not specified, use --input "packages/components/src/Button/Button.js"');
  }
  generateDocument(options.input);
};

generate();
