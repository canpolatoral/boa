import _ from 'lodash-compat';
import fsp from 'fs-promise';
var fs = require('fs'), path = require('path');

export default function BuildPackageJson(componentRoot ) {
    let cwdPackageRoot = process.cwd();
    const npmPath = path.join(componentRoot,'package','package.json');
    const pkgJsonPath = path.join(cwdPackageRoot,'build','package','framework','info.json');
    const licensePath = path.join(cwdPackageRoot,'build','package','LICENSE');
    const readmePath = path.join(cwdPackageRoot, 'build','package','framework','README.md');
    var pkgJson = fs.existsSync(pkgJsonPath) ? require(pkgJsonPath) : {};
    var target = _.extend({}, pkgJson);
    var data = JSON.stringify(target, null, 4);
    return fsp.writeFile(npmPath, data)
            .then(() => fsp.copy(licensePath, path.join(componentRoot,'package','LICENSE')))
            .then(() => fsp.copy(readmePath, path.join(componentRoot,'package','README.md')));
}