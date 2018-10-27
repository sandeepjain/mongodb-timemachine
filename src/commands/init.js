const { Command, flags } = require('@oclif/command');
const shell = require('shelljs');
const fs = require('fs');

const { TIMEMACHINE_DIR } = require('../constants.js');

class InitCommand extends Command {
    async run() {
        const { args } = this.parse(InitCommand)

        if (!shell.which('mongodump')) {
            this.error('Sorry, this script requires mongodump');
            this.exit(1);
            return false;
        }

        if (!shell.which('mongorestore')) {
            this.error('Sorry, this script requires mongorestore');
            this.exit(1);
            return false;
        }

        const { uri } = args;

        const config = {
            uri,
        };

        this.log(`Setting up timemachine with connection uri ${uri}`);

        // shell.cd(TIMEMACHINE_DIR);
        // Create timemachine directory
        shell.mkdir('-p', `${TIMEMACHINE_DIR}/snapshots`);

        shell.echo(`${JSON.stringify(config)}`).to(`${TIMEMACHINE_DIR}/config.json`);

        this.log(`Successfully initialised mongodb timemachine`);
    }
}

InitCommand.description = `Initialize the mongodb timemachine`

InitCommand.flags = {
    // uri: flags.string({
    //     char: 'u',
    //     description: 'Mongodb connection uri',
    // }),
}

InitCommand.args = [{
    name: 'uri',
    required: true,
    description: 'URI to connect to mongodb (includes database name)',
}];

module.exports = InitCommand
