const fs = require('fs');
const path = require('path');
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID; // from your .env

// Your existing event modules
const bossEvent = require('.\\events\\boss_events.js'); // adjust path if needed
const eggEvent = require('.\\events\\egg_event.js');   // adjust path if needed
const { db } = require('.\\database.js');          // if needed globally

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create a collection to store commands
client.commands = new Collection();

// Load command files dynamically from ./commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Add command to the collection keyed by command name
  client.commands.set(command.data.name, command);
}

// Register slash commands with Discord
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const commands = client.commands.map(cmd => cmd.data.toJSON());

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Event: Bot ready
client.once(Events.ClientReady, readyClient => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});

// Event: Interaction create (slash commands)
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Event: Message create (your custom message event handlers)
client.on(Events.MessageCreate, async message => {
  try {
    await bossEvent.execute(message, client);
    await eggEvent.execute(message, client);
  } catch (err) {
    console.error('❌ Error handling message:', err);
  }
});

// Log in
client.login(token);
