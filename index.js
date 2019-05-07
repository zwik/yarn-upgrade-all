const commander = require('commander');
const { blue, green, red } = require('kleur');
const childProcess = require('child_process');

const packageJson = require('./package.json');

commander.version(packageJson.version)
  .option('-E, --exact', 'Install exact version')
  .option('-T, --tilde', 'Install most recent version with the same minor version')
  .parse(process.argv);

if (commander.exact && commander.tilde) {
  console.log(`Exact and tilde options can't be on, on the same time.`);
  process.exit(1);
}

const logError = (message) => {
  console.log(red('[Error]'), `: ${message}`);
}

const logInfo = (message) => {
  console.log(blue('[Start]'), `: ${message}`);
}

const logSuccess = (message) => {
  console.log(green('[Done]'), `: ${message}`);
}

const addYarnOptions = (command) => {
  command = addExact(command);
  command = addTilde(command);
  return command;
}

const addExact = (command) => {
  if (commander.exact) {
    return command + ` --exact`;
  } else {
    return command;
  }
}

const addTilde = (command) => {
  if (commander.tilde) {
     return command + ` --tilde`;
  } else {
    return command;
  }
}

const options = {
  devDependencies: ' --dev',
  peerDependencies: ' --peer'
};

let tempCommand = '';
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
      tempCommand = `yarn add ${packageList}`;
      tempCommand = addYarnOptions(tempCommand);
    }
    if (element === 'devDependencies' || element == 'peerDependencies') {
      tempCommand = `yarn add ${packageList} ${option}`;
      tempCommand = addYarnOptions(tempCommand);
    }

    if (command.length) {
      command += ` && ${tempCommand}`;
    } else {
      command += tempCommand;
    }
  }
}

try {
  logInfo(command);
  childProcess.execSync(command, {
    stdio: []
  });
  logSuccess(command);
} catch (e) {
  logError(`${command} - ${e}`);
}
