import _ from 'lodash-compat';
import fsp from 'fs-promise';
var fs = require('fs'), path = require('path');

export default function BuildPackageJson(componentRoot ) {
    let cwdPackageRoot = process.cwd();
    const npmPath = path.join(componentRoot,'package','package.json');
    const pkgJsonPath = path.join(cwdPackageRoot,'build','package','info.json');
    const licensePath = path.join(cwdPackageRoot,'build','package','LICENSE');
    const cmpJsonPath = path.join(componentRoot,'assets','data','info.json');
    var pkgJson = fs.existsSync(pkgJsonPath) ? require(pkgJsonPath) : {};
    var cmpJson = fs.existsSync(cmpJsonPath) ? require(cmpJsonPath) : {};
    var target = _.merge({}, cmpJson, pkgJson);
    var data = JSON.stringify(target, null, 4);
    return fsp.writeFile(npmPath, data)
            .then(() => fsp.copy(licensePath, path.join(componentRoot,'package','LICENSE')));
}