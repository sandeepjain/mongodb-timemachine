const { Command, flags } = require('@oclif/command');
const shell = require('shelljs');
const crypto = require('crypto');
const {cli} = require('cli-ux')
const notifier = require('node-notifier');
const { format } = require('date-fns');

const { TIMEMACHINE_DIR } = require('../constants.js');

class RestoreCommand extends Command {
    async run() {
        cli.action.start('Restoring snapshot');
        const { args } = this.parse(RestoreCommand)

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

        try {
            shell.cd(SNAPSHOT_DIR);
        } catch (e) {
            this.error('No snapshots exists');
            this.exit(1);
            return false;
        }

        const { uri } = config;

        const allSnapshots = shell.ls('-l').filter(dir => dir.isDirectory()).map((dir) => {
            return {
                name: dir.name,
                createdAt: dir.birthtimeMs,
            };
        });

        let restoringSnapshot;
        if (args.hash) {
            restoringSnapshot = allSnapshots.find(s => s.name === args.hash);

            if (!restoringSnapshot) {
                this.error('Unable to find snapshot with given hash');
                this.exit(1);
                return false;
            }
        } else {
            const sortedSnapshots = allSnapshots.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            restoringSnapshot = sortedSnapshots[0];
        }

        this.log(`Restoring snapshot ${restoringSnapshot.name} taken on ${format(restoringSnapshot.createdAt, 'dd-MM-yyyy HH:mm:ss')}.`);

        // FIXME: Restore from gzip
        if (shell.exec(`mongorestore --uri ${uri} --dir ${SNAPSHOT_DIR}/${restoringSnapshot.name} --drop --quiet`).code !== 0) {
            this.error('Fail to restore the database');
            this.exit(1);
            return false;
        }

        // Create timemachine directory
        cli.action.stop('Completed');

        notifier.notify({
            title: 'MongoDB Timemachine',
            message: `Database restored successfully with snapshot taken on ${format(restoringSnapshot.createdAt, 'dd-MM-yyyy HH:mm:ss')}`,
        });
    }
}

RestoreCommand.description = `Restores the mongodb backup`

RestoreCommand.args = [{
    name: 'hash',
    required: false,
    description: 'Snapshot hash',
}];

module.exports = RestoreCommand
