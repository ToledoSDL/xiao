const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class GoogleDoodleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-doodle',
			group: 'events',
			memberName: 'google-doodle',
			description: 'Responds with a Google Doodle, either the latest one or a random one from the past.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get doodles for?',
					type: 'month',
					default: 'latest'
				},
				{
					key: 'year',
					prompt: 'What year would you like to get doodles for?',
					type: 'integer',
					default: ''
				}
			]
		});
	}

	async run(msg, { month, year }) {
		const latest = month === 'latest';
		const now = new Date();
		if (latest) month = now.getMonth() + 1;
		if (!year) year = now.getFullYear();
		try {
			const { body } = await snekfetch.get(`https://www.google.com/doodles/json/${year}/${month}`);
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[latest ? 0 : Math.floor(Math.random() * body.length)];
			const runDate = new Date(data.run_date_array.join('-')).toDateString();
			return msg.say(`${runDate}: ${data.share_text}`, { files: [`https:${data.url}`] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
