import exec from '../exec';

export default function BuildDistributable(componentname, componententry, distpath, testentry, ignoredFiles) {
  if (ignoredFiles) {
    return exec(`webpack --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --env.ignoredFiles=${ignoredFiles} --bail`)
      .then(() => exec(`webpack -p --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --env.ignoredFiles=${ignoredFiles} --bail`));
  } else {
    return exec(`webpack --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --bail`)
      .then(() => exec(`webpack -p --env.componententry="${componententry}" --env.componentname=${componentname} --env.testentry="${testentry}" --env.distpath="${distpath}" --bail`));
  }
}
