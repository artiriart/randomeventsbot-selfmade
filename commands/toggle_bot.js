const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../database.js');  // Adjust path as needed

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggle-bot')
    .setDescription('Toggles the bot on or off for your servers'),

  async execute(interaction) {
    const userId = interaction.user.id;

    db.all(`SELECT * FROM servers_db WHERE user_id = ?;`, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        return interaction.reply({ content: 'Database error occurred.', ephemeral: true });
      }

      if (rows.length === 0) {
        return interaction.reply({ content: 'You have no servers set up with this bot.', ephemeral: true });
      }

      // Toggle pause based on first row's current value
      const currentPause = rows[0].pause ? 1 : 0;
      const newPause = currentPause === 1 ? 0 : 1;

      db.run(`UPDATE servers_db SET pause = ? WHERE user_id = ?;`, [newPause, userId], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return interaction.reply({ content: 'Failed to toggle the bot.', ephemeral: true });
        }

        const statusMessage = newPause === 1
          ? 'The bot has been toggled off for your servers.'
          : 'The bot has been toggled on for your servers.';

        return interaction.reply({ content: statusMessage, ephemeral: true });
      });
    });
  },
};
