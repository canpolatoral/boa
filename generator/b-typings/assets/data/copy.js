var fsp = require ('fs-promise');
var _ = require('lodash-compat');
var exec = require('child-process-promise').exec;

var executionOptions = {
  dryRun: false,
  verbose: false
};

function logWithPrefix(prefix, message) {
  console.log(
    message.toString().trim()
      .split('\n')
      .map((line) => '${prefix.grey} ${line}')
      .join('\n')
  );
}

function execWrapper(command, options) {
  if(!options) { options = {} };
  var proc = exec(command, options);
  if (!executionOptions.verbose) {
    return proc;
  }
  var title = options.title || command;
  var output = (data, type) => logWithPrefix('[${title}] ${type}:', data);
  return proc.progress((args) => {
    args.stdout.on('data', data => output(data, 'stdout'));
    args.stderr.on('data', data => output(data, 'stderr'));
  })
    .then(result => {
      logWithPrefix('[${title}]', 'Complete');
      return result;
    });
}

function safeExec(command, options) {
  if(!options) { options = {} };
  var title = options.title || command;
  if (executionOptions.dryRun) {
    logWithPrefix('[${title}]', 'DRY RUN');
    return Promise.resolve();
  }
  return execWrapper(command, options);
}

function setExecOptions(options) {
  executionOptions = _.extend({}, executionOptions, options);
}

/**** COPY COMMAND ******/

var srcDirectory = './typings';
var deployDirectory = '../../typings';

try {
  fsp.emptyDirSync(deployDirectory);
  console.log('emptyDirSync for ' + deployDirectory + ' finished');
  fsp.copySync(srcDirectory, deployDirectory);
  console.log('copySync for ' + srcDirectory + ' to ' + deployDirectory + '  finished');
  console.log('b-typings postinstall script finished successfully..');
} catch (err) {
  console.error('ERROR: b-typings', err)
}

/********************** */