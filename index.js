const commander = require('commander');
const {blue, green, red} = require('kleur');
const childProcess = require('child_process');

const packageJson = require('./package.json');

commander.version(packageJson.version)
  .option('-E, --exact', 'Install exact version')
  .option('-T, --tilde', 'Install most recent version with the same minor version')
  .parse(process.argv);

const logError = (message) => {
  console.log(red('[Error]'), `: ${message}`);
}

const logInfo = (message) => {
  console.log(blue('[Start]'), `: ${message}`);
}

const logSuccess = (message) => {
  console.log(green('[Done]'), `: ${message}`);
}

const options = {
  dependencies: '',
  devDependencies: ' --dev',
  peerDependencies: ' --peer'
};

let dependencyCommand = ''
let devDependencyCommand = ''
let peerDependencyCommand = '';
let command = '';
for (let element of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (packageJson[element]) {
    const option = options[element];
    const packages = Object.keys(packageJson[element]);
    let packageList = '';


    for (let pkg of packages) {
      if (packageList.length) {
        packageList += ` ${pkg}`;
      } else {
        packageList = pkg;
      }
    }

    if (element === 'dependencies') {
      dependencyCommand = `yarn add ${packageList}`;
      if (commander.exact) {
        dependencyCommand += ` --exact`;
      }
      if (commander.tilde) {
        dependencyCommand += ` --tilde`
      }
    }
    if (element === 'devDependencies') {
      devDependencyCommand = `yarn add ${packageList} --dev`;
      if (commander.exact) {
        devDependencyCommand += ` --exact`;
      }
      if (commander.tilde) {
        devDependencyCommand += ` --tilde`
      }
    }
    if (element === 'peerDependencies') {
      peerDependencyCommand = `yarn add ${packageList} --peer`;
      if (commander.exact) {
        peerDependencyCommand += ` --exact`;
      }
      if (commander.tilde) {
        peerDependencyCommand += ` --tilde`
      }
    }
  }
}

if (dependencyCommand.length) {
  command += dependencyCommand;
}
if (devDependencyCommand.length) {
  if (command.length) {
    command += ` && ${devDependencyCommand}`;
  } else {
    command += devDependencyCommand;
  }
}
if (peerDependencyCommand.length) {
  if (command.length) {
    command += ` && ${peerDependencyCommand}`;
  } else {
    command += peerDependencyCommand;
  }
}
console.log(command);

try {
  logInfo(command);
  childProcess.execSync(command, {
    stdio: []
  });
  logSuccess(command);
} catch (e) {
  logError(`${command} - ${e}`);
}
