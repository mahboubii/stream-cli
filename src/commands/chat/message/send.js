const { Command, flags } = require('@oclif/command');
const emoji = require('node-emoji');
const chalk = require('chalk');
const path = require('path');

const { auth } = require('../../../utils/auth');

class MessageSend extends Command {
    async run() {
        const { flags } = this.parse(MessageSend);

        try {
            const client = await auth(
                path.join(this.config.configDir, 'config.json'),
                this
            );

            await client.updateUser({
                id: flags.uid,
                role: 'admin',
            });

            await client.setUser({ id: flags.uid, status: 'invisible' });
            const channel = client.channel(flags.type, flags.channel);

            const payload = {
                text: flags.message,
            };

            if (flags.attachments) {
                payload.attachments = JSON.parse(flags.attachments);
            }

            await channel.sendMessage(payload);

            const message = chalk.blue(
                `Message ${chalk.bold(
                    flags.message
                )} has been sent to the ${chalk.bold(
                    flags.channel
                )} channel by ${chalk.bold(flags.uid)}!`
            );

            this.log(message, emoji.get('smile'));
            this.exit();
        } catch (err) {
            this.error(err, { exit: 1 });
        }
    }
}

MessageSend.flags = {
    id: flags.string({
        char: 'i',
        description: chalk.blue.bold(
            'The channel ID that you would like to send a message to.'
        ),
        required: false,
    }),
    user: flags.string({
        char: 'u',
        description: chalk.blue.bold(
            'The ID of the acting user sending the message.'
        ),
        default: '*',
        required: true,
    }),
    type: flags.string({
        char: 't',
        description: chalk.blue.bold('The type of channel.'),
        options: ['livestream', 'messaging', 'gaming', 'commerce', 'team'],
        required: true,
    }),
    message: flags.string({
        char: 'm',
        description: chalk.blue.bold(
            'The message you would like to send as plaintext.'
        ),
        required: true,
    }),
    attachments: flags.string({
        char: 'a',
        description: chalk.blue.bold(
            'A JSON payload of attachments to send with the message.'
        ),
        required: false,
    }),
};

module.exports.MessageSend = MessageSend;
