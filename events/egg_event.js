const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  TextDisplayBuilder,
  SectionBuilder,
  ThumbnailBuilder,
  ContainerBuilder
} = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const { db } = require("../database.js");

module.exports = {
  name: "boss_event",
  async execute(message, client) {
    if (message.author.id !== "270904126974590976") return;

    const embed = message.embeds[0];
    if (!embed || !embed.description) return;

    if (embed.description.startsWith("> Aw man, I dropped something in my eggs again.")) {
      const mainChannelId = "1370044766292676608";

      const channel = await client.channels.fetch(mainChannelId);
      if (!channel || !channel.isTextBased()) return;

      const containerMessage = await prepareContainerMessage(message, client);
      if (containerMessage) {
        await channel.send(containerMessage);
      }
    }
  }
};

async function prepareContainerMessage(message, client) {
  const serverId = message.guildId;

  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM servers_db WHERE server_id = ?;`;
    db.get(sql, [serverId], async (err, row) => {
      if (err) {
        console.error("SQL Error:", err.message);
        return reject(err);
      }
      if (!row) return resolve(null);
      if (row.pause === true) return resolve(null);
      if (row.auto_eggs === false) return resolve(null);

      const server = await client.guilds.fetch(serverId).catch(() => null);
      const user = await client.users.fetch(row.user_id).catch(() => null);
      if (!server || !user) return resolve(null);

      const invite = await message.channel.createInvite({
        maxAge: 300,
        unique: true
      }).catch(() => null);
      if (!invite) return resolve(null);
      
      // Date Logic:
      const currentDate = new Date();
      const dayname = currentDate.getUTCDay();
      if (dayname ===  2 && dayname === 6) {
        const ping_text = "-# <@&1370045915326582936>";}
        else {
          const ping_text = "-# <@&1379085469983178783>";
        }
        
      // Section content
      const section = new SectionBuilder()
        .setText(
          new TextDisplayBuilder().setText(
            `## 🥚 **Eggs Event spawned!**\n-# in **${server.name}**, owned by \`${user.username}\` (${user.id})\n${ping_text}`
          )
        )
        .setThumbnail(
          new ThumbnailBuilder().setUrl("https://cdn.discordapp.com/emojis/1015946571864625193.gif")
        );

      // Buttons
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Join Server")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.gg/${invite.code}`),

        new ButtonBuilder()
          .setLabel("Message Link")
          .setStyle(ButtonStyle.Link)
          .setURL(message.url)
      );

      // Final container
      const container = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addSectionComponents(section)
        .addActionRowComponents(buttons);

      resolve({ components: [container] });
    });
  });
}
