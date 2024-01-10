// spell-checker.js
const { Client, GatewayIntentBits, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const specificBotId = '261302296103747584';
const spellData = require('./spellData');

console.log('Starting bot initialization');

client.on('messageCreate', (message) => {
  // Log every received message
  console.log(`Received message: "${message.content}"`);

  // Check if the message is from the specific bot
  if (message.author.id === specificBotId) {
    console.log(`Detected message from specific bot (${specificBotId}): "${message.content}"`);
    
    // Check for embeds in the user's message
    const embeds = message.embeds;
    if (embeds && embeds.length > 0) {
      // Iterate through each embed
      for (const embed of embeds) {
        // Check if the embed has a title
        if (embed.title) {
          // Check for keywords in the embed title
          for (const keyword in spellData) {
            if (embed.title.toLowerCase().includes(keyword.toLowerCase())) {
              // Respond to messages with matching keywords
              const { components, cost, costcons, consumables } = spellData[keyword];
              const randint = Math.floor(Math.random() * 4) + 1;
              const goldcast = costcons ? (randint + 1) * costcons : '';

              // Format the printout as a 1d4 dice roll
              const printout = costcons ? `1d4(${randint})+1 * ${costcons} = \`${goldcast}\` gp` : '';

              const embedResponse = {
                description: `
## ${keyword} Spell Components 
This spell has costly components, be sure you have the correct materials to cast it! If you do not have the material components available when you cast this spell (or have a way to cast this spell without its material components, such as charged magical items), your spell slot is consumed and the spell fails.
`,
                fields: [
                  components ? { name: 'Spell Components', value: components, inline: true } : null,
                  cost ? { name: 'Cost', value: cost.toString(), inline: true } : null,
                  components || cost ? { name: '', value: '', inline: false } : null, // Add an empty field to create a smaller separator
                  consumables ? { name: 'Consumable Components', value: consumables, inline: true } : null,
                  printout ? { name: 'Gold Cast', value: printout, inline: true } : null,
                ].filter(Boolean), // Filter out null values
                footer: {
                  text: consumables ? 'Note: Centuries of alchemical and metallurgical studies allow one to harness the power of the Weavestar to transmute gold into consumable costly spell components for a brief moment of time. This method is imprecise, requiring 1d4+1 times the amount of gold normally required, and may work sporadically or not at all when not near the Weavestar.' : '',
                },
              };

              message.reply({ embeds: [embedResponse] });
              console.log(`Responded to the message with keyword: "${keyword}"`);
              return; // Exit the loop after responding to the first matching keyword
            }
          }
        }
      }
    }
  }
});

client.on('ready', () => {
  // Log when the bot is ready
  console.log(`Bot is logged in as ${client.user.tag}`);
});

console.log('Attempting to log in to Discord');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login('MTE5NDAzMjc0MzU1NDc2NDkwMQ.GFMqXV.5tYpjBYDNgtqQJfDTU6ySpWqVEyZkKXo8SOJHI');
