const keepAlive = require('./server')

const token = process.env['TOKEN']
const CLIENT_ID = process.env['client_id']
const GUILD_ID = process.env['guild_id']

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: '9' }).setToken(token);



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  
  if (interaction.commandName === 'resin'){
    const integer = interaction.options.getInteger('int');
    if (integer >= 0 && integer < 160) {
				await interaction.reply(`Resin will be full in: ${ Math.floor(((160 - integer) * 8)/60) } hours ${((160 - integer) * 8) % 60} minutes`);
			} else {
				await interaction.reply(`Resin must be at between 0-160`);
			}
  }
});

client.login(token);

const { Routes } = require('discord-api-types/v9');

const data = new SlashCommandBuilder()
	.setName('resin')
	.setDescription('Replies how long until your resin is full')
	.addIntegerOption(option => option.setName('int')
    .setDescription('Enter the current amount of resin')
    .setRequired(true));

const commands = [data]; 


(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

keepAlive();