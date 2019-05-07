# yarn-upgrade-options
This is a command line utility program to upgrade all the packages in your `package.json` to the latest version
(potentially upgrading packages across major versions).


## Installation
```
yarn add --dev yarn-upgrade-options
```

## Usage
```
npx yarn-upgrade-options
```
Will update packages with caret `^` versioning.

```
npx yarn-upgrade-options -E
```
Will update packages with exact versioning.

```
npx yarn-upgrade-options -T
```
Will update packages with tilde versioning.

## Installation globally
```
yarn global add yarn-upgrade-options
```

### Installation on Windows
```
npm install -g yarn-upgrade-options
```

:exclamation: Don't use `yarn` to install it on Windows because there is a bug: [yarnpkg/yarn#2224](https://github.com/yarnpkg/yarn/issues/2224).

## How does it work?
For every package in `package.json`, it runs `yarn add [--dev|--peer] <package-name>`.

## Why not simply `yarn upgrade --latest` ?
Most of the time `yarn upgrade --latest` works. But I did meet some cases when it didn't work. I am not sure of the reason, maybe it's yarn's bug.

This library is very robust because it goes the hard way.

## What if a package failed to install?
In that case, that package will be skipped and an error message will be printed.

You need to read the error message and manually install that package.

It is the recommended flow. Because if a package failed to install, most of the time, you need to manually troubleshoot the issue and fix the issue.
