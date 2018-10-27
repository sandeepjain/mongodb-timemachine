const { Command, flags } = require('@oclif/command');
const shell = require('shelljs');
const crypto = require('crypto');
const {cli} = require('cli-ux')
const { format } = require('date-fns');

const { TIMEMACHINE_DIR } = require('../constants.js');

class FlushCommand extends Command {
    async run() {
        cli.action.start('Preparing snapshots to flush');

        const SNAPSHOT_DIR = `${TIMEMACHINE_DIR}/snapshots`;

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

        cli.action.stop('Done!');

        if (allSnapshots.length <= 1) {
            this.log('Nothing to delete');
            return false;
        }

        this.log('Following snapshots would be deleted.');

        const [first, ...snapshotToDelete] = allSnapshots;

        snapshotToDelete.forEach((s) => {
            this.log(`${format(s.createdAt, 'dd-MM-yyyy hh:mm:ss')} ${s.name}`)
        });

        const result = await cli.confirm('Continue deleting all the above snapshots?');

        if (!result) {
            this.error('Action aborted by user.');
            return false;
        }

        cli.action.start('Flushing out old snapshots');

        shell.rm('-r', snapshotToDelete.map(s => s.name));

        cli.action.stop('Done!');
    }
}

FlushCommand.description = `Flush all snapshots (except the latest one)`

FlushCommand.flags = {
    // name: flags.string({
    //     char: 'n',
    //     description: 'custom name for backup',
    // }),
}

module.exports = FlushCommand
