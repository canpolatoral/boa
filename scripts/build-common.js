import 'colors';
import exec from './exec';

export default function (destination, componentName, componentEntry, ignoredFiles) {
  return exec(`webpack --config webpack-transform.config.js --env.componententry="${componentEntry}" --env.componentname=${componentName} --env.distpath="${destination}" --env.ignoredFiles=${ignoredFiles} --bail`);
}
