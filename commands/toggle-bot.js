const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle-bot')
		.setDescription('Toggles the bot on or off for your servers'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
