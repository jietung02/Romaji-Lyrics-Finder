const { SlashCommandBuilder } = require('discord.js');
const {retrieveLyrics} = require('../../retrieveLyrics');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Retrieve current spotify playing song romanized lyrics')
    .addStringOption(option =>
      option.setName('lyrics')
        .setDescription('Get Lyrics')
        .setAutocomplete(true)
        .setRequired(true)
    ),

  autocomplete: async (interaction) => {
    await interaction.respond([
      {
        name: 'Get Current Playing Song Lyrics',
        value: 'lyrics'
      }
    ]);
  },
  execute: async (interaction) => {
    await interaction.deferReply();
    embedMsg = await retrieveLyrics()
    await interaction.editReply({ embeds: [embedMsg] })
  },
}

