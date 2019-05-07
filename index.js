/* eslint-disable no-console */
const commander = require('commander');
const { blue, green, red } = require('kleur');
const childProcess = require('child_process');

const packageJson = require('./package.json');

commander.version(packageJson.version)
  .option('-E, --exact', 'install exact version')
  .option('-T, --tilde', 'install most recent version with the same minor version');
commander.on('--help', () => {
  console.log('');
  console.log('When no options are given, packages are installed with a caret (^).');
});
commander.parse(process.argv);

if (commander.exact && commander.tilde) {
  console.log('Exact and tilde options can\'t be on, on the same time.');
  process.exit(1);
}

const logError = (message) => {
  console.log(red('[Error]'), `: ${message}`);
};

const logInfo = (message) => {
  console.log(blue('[Start]'), `: ${message}`);
};

const logSuccess = (message) => {
  console.log(green('[Done]'), `: ${message}`);
};

const addExact = (command) => {
  if (commander.exact) {
    return `${command} --exact`;
  }
  return command;
};

const addTilde = (command) => {
  if (commander.tilde) {
    return `${command} --tilde`;
  }
  return command;
};

const addYarnOptions = (command) => {
  let tempCommand = addExact(command);
  tempCommand = addTilde(command);
  return tempCommand;
};

const options = {
  devDependencies: '--dev',
  peerDependencies: '--peer',
};

let command = '';
const elements = ['dependencies', 'devDependencies', 'peerDependencies'];
elements.forEach((element) => {
  if (packageJson[element]) {
    let tempCommand;
    const option = options[element];
    const packages = Object.keys(packageJson[element]);
    let packageList = '';

    packages.forEach((pkg) => {
      if (packageList.length) {
        packageList += ` ${pkg}`;
      } else {
        packageList = pkg;
      }
    });

    if (element === 'dependencies') {
      tempCommand = `yarn add ${packageList}`;
    }
    if (element === 'devDependencies' || element === 'peerDependencies') {
      tempCommand = `yarn add ${packageList} ${option}`;
    }
    tempCommand = addYarnOptions(tempCommand);

    if (command.length) {
      command += ` && ${tempCommand}`;
    } else {
      command = tempCommand;
    }
  }
});

try {
  logInfo(command);
  childProcess.execSync(command, {
    stdio: [],
  });
  logSuccess(command);
} catch (e) {
  logError(`${command} - ${e}`);
}
