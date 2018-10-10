import { exec } from 'child-process-promise';


export default async function (command, options = {}) {
  console.log(('runnig: ' + command).grey);
  await exec(command, options);
  console.log('completed'.cyan);
}
