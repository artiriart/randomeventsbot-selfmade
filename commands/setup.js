const {
    SlashCommandBuilder,
    SeparatorBuilder,
    SectionBuilder,
    ContainerBuilder,
    ThumbnailBuilder,
    TextDisplayBuilder,
    } = require("discord.js");
const sqlite3 = require('sqlite3').verbose();
import { db } from '../database.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup-server')
		.setDescription('Setup the server with necessary configurations')
        .addBooleanOption(option => 
            option.setName('auto-eggs')
                .setDescription('Automatically forward egg Events')
                .setRequired(false)),
	async execute(interaction) {
        if (interaction.user.id === interaction.guild.ownerId) {
            const serverId = interaction.guild.id;
            const autoEggs = interaction.options.getBoolean('auto-eggs') || false;
            const userId = interaction.user.id;
            const sql = `INSERT INTO servers_db (server_id, user_id, pause, auto_eggs) VALUES ('${serverId}', ${userId}, false, ${autoEggs}) ON CONFLICT(server_id) DO UPDATE SET user_id = ${userId}, pause = false, auto_eggs = ${autoEggs};`;
            db.run(sql, (err) => {
                if (err) {
                    console.error('Error inserting/updating data:', err.message);
                    return interaction.reply({ content: 'There was an error setting up the server. Please try again later.', ephemeral: true });
                } else {
                    console.log(`Server setup for ${interaction.guild.name} (${serverId}) by user ${userId}`);
                    return interaction.reply({ content: `## Server setup complete!\n-# Auto Eggs: ${autoEggs}`, ephemeral: true });
                }
            });
        } else {
            return interaction.reply({ content: '## You must be the server owner to use this command.', ephemeral: true });
        }
	},
};
