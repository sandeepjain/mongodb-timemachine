mongodb-timemachine
===================

Backup and restore mongodb database for your local development. This package takes the backup of the database with a timestamp and then allows you to restore to latest/previous version as needed for development.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mongodb-timemachine.svg)](https://npmjs.org/package/mongodb-timemachine)
[![Downloads/week](https://img.shields.io/npm/dw/mongodb-timemachine.svg)](https://npmjs.org/package/mongodb-timemachine)
[![License](https://img.shields.io/npm/l/mongodb-timemachine.svg)](https://github.com/sandeepjain/mongodb-timemachine/blob/master/package.json)

# Usage
```sh-session
// Installation
$ npm install -g mongodb-timemachine

// Initialise the timemachine and stores the connection configuration
// Only to be executed once
$ mongodb-timemachine init -uri=mongodb://localhost:27017/local

// Takes the current snapshot from the database
$ mongodb-timemachine snapshot

// Restores the latest snapshot to the database
$ mongodb-timemachine restore

// List all the snapshots
$ mongodb-timemachine ls

// Flush all the snapshot taken so far (except for the latest one)
$ mongodb-timemachine flus
```

# Todo

- [ ] Name based snapshot
- [ ] Support multiple database (Currently only single database is supported)
