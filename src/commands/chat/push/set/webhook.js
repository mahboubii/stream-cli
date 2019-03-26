const { Command, flags } = require('@oclif/command');
const { prompt } = require('enquirer');

const { auth } = require('../../../../utils/auth');

class PushSetWebhook extends Command {
	async run() {
		const { flags } = this.parse(PushSetWebhook);

		try {
			if (!flags.url) {
				const res = await prompt([
					{
						type: 'input',
						name: 'url',
						message: `What is the absolute URL for your webhook?`,
						required: true,
					},
				]);

				flags.url = res.url;
			}

			const client = await auth(this);
			await client.updateAppSettings({
				webhook_url: flags.url,
			});

			if (flags.json) {
				const settings = await client.getAppSettings();

				this.log(
					JSON.stringify({
						webhook_url: settings.app.webhook_url,
					})
				);
				this.exit();
			}

			this.log('Push notifications have been enabled for Webhooks.');
			this.exit(0);
		} catch (error) {
			this.error(error || 'A Stream CLI error has occurred.', {
				exit: 1,
			});
		}
	}
}

PushSetWebhook.flags = {
	url: flags.string({
		char: 'u',
		description: 'Fully qualified URL for webhook support.',
		required: false,
	}),
	json: flags.boolean({
		char: 'j',
		description:
			'Output results in JSON. When not specified, returns output in a human friendly format.',
		required: false,
	}),
};

module.exports.SettingsPush = PushSetWebhook;