const { Command, flags } = require('@oclif/command');
const shell = require('shelljs');
const crypto = require('crypto');
const {cli} = require('cli-ux')
const notifier = require('node-notifier');

const { TIMEMACHINE_DIR } = require('../constants.js');

class SnapshotCommand extends Command {
    async run() {
        cli.action.start('Taking snapshot of latest data');
        const SNAPSHOT_DIR = `${TIMEMACHINE_DIR}/snapshots`;

        let config;
        try {
            shell.cd(`${TIMEMACHINE_DIR}`);
            config = JSON.parse(shell.cat(`${TIMEMACHINE_DIR}/config.json`));
        } catch (e) {
            this.error('Please run mongodb-timemachine init <Mongodb URI>');
            this.exit(1);
            return false;
        }

        const { uri } = config;

        shell.mkdir('-p', SNAPSHOT_DIR);

        shell.cd(SNAPSHOT_DIR);

        const id = crypto.randomBytes(20).toString('hex');

        // TODO: Snapshot to gzip
        if (shell.exec(`mongodump --uri ${uri} --out ${id} --quiet`).code !== 0) {
            this.error('Fail to take snapshot of database');
            this.exit(1);
            return false;
        }

        // Create timemachine directory
        cli.action.stop('Completed');
        this.log(`Snapshot Id: ${id}`);
        notifier.notify({
            title: 'MongoDB Timemachine',
            message: 'Snapshot taken successfully.',
        });
    }
}

SnapshotCommand.description = `Take snapshot of the database`

SnapshotCommand.flags = {
    name: flags.string({
        char: 'n',
        description: 'custom name for backup',
    }),
}

module.exports = SnapshotCommand
