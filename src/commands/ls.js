const { Command, flags } = require('@oclif/command');
const shell = require('shelljs');
const crypto = require('crypto');
const { TIMEMACHINE_DIR } = require('../constants.js');
const { format } = require('date-fns');

class LsCommand extends Command {
    async run() {
        const SNAPSHOT_DIR = `${TIMEMACHINE_DIR}/snapshots`;

        try {
            shell.cd(`${TIMEMACHINE_DIR}`);
        } catch (e) {
            this.error('Please run mongodb-timemachine init <Mongodb URI>');
            this.exit(1);
            return false;
        }

        try {
            shell.cd(SNAPSHOT_DIR);
        } catch (e) {
            this.error('No snapshots exists');
            this.exit(1);
            return false;
        }

        const allSnapshots = shell.ls('-l').filter(dir => dir.isDirectory()).map((dir) => {
            return {
                name: dir.name,
                createdAt: dir.birthtimeMs,
            };
        }).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        allSnapshots.forEach(s => {
            this.log(`${format(s.createdAt, 'dd-MM-yyyy hh:mm:ss')} ${s.name}`)
        });
    }
}

LsCommand.description = `Lists all snapshots`

LsCommand.flags = {
    // name: flags.string({
    //     char: 'n',
    //     description: 'custom name for backup',
    // }),
}

module.exports = LsCommand
