easy-ci-cd
==========

fast and easy to do ci and cd

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/easy-ci-cd.svg)](https://npmjs.org/package/easy-ci-cd)
[![Downloads/week](https://img.shields.io/npm/dw/easy-ci-cd.svg)](https://npmjs.org/package/easy-ci-cd)
[![License](https://img.shields.io/npm/l/easy-ci-cd.svg)](https://github.com/easy-programming-guide/easy-ci-cd/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g easy-ci-cd
$ easy-ci-cd COMMAND
running command...
$ easy-ci-cd (-v|--version|version)
easy-ci-cd/0.0.1 win32-x64 node-v14.7.0
$ easy-ci-cd --help [COMMAND]
USAGE
  $ easy-ci-cd COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`easy-ci-cd hello [FILE]`](#easy-ci-cd-hello-file)
* [`easy-ci-cd help [COMMAND]`](#easy-ci-cd-help-command)

## `easy-ci-cd hello [FILE]`

describe the command here

```
USAGE
  $ easy-ci-cd hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ easy-ci-cd hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/easy-programming-guide/easy-ci-cd/blob/v0.0.1/src\commands\hello.ts)_

## `easy-ci-cd help [COMMAND]`

display help for easy-ci-cd

```
USAGE
  $ easy-ci-cd help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_
<!-- commandsstop -->
