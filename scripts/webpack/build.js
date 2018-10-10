var exec = require('../lib/exec').default.exec;

export default function BuildDistributable(componentname, componententry, distpath, testentry, ignoredFiles) {
    //console.log('BuildDistributable(componentname: '+componentname+', componententry: '+componententry+', distpath: '+distpath+', testentry: '+testentry+', ignoredFiles: '+ignoredFiles+');');
  if (ignoredFiles) {
    return exec(`webpack --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --env.ignoredFiles=${ignoredFiles} --bail`)
      .then(() => exec(`webpack -p --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --env.ignoredFiles=${ignoredFiles} --bail`));
  } else {
    return exec(`webpack --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --bail`)
      .then(() => exec(`webpack -p --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --bail`));
  }
}