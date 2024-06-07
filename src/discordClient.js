// @ts-check
import { Client } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Sends a direct message to a user on Discord.
 * @param {string} userId - The Discord user ID of the recipient.
 * @param {string} message - The message to be sent.
 */
export const sendDirectMessage = async (userId, message) => {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('DISCORD BOT TOKEN is missing.');
  }
  
  const client = new Client({ intents: ['DirectMessages'] });
  
  await client.login(process.env.DISCORD_BOT_TOKEN);
  try {
    const user = await client.users.fetch(userId);
    await user.send(message);
    console.log(`Message sent to ${user.tag}`);
  } catch (error) {
    console.error('Error sending message:', error);
  }
  await client.destroy();
};

/**
 * Sends a message to a specified channel on Discord.
 * @param {string} channelId - The Discord channel ID where the message will be sent.
 * @param {string} message - The message to be sent.
 */
export const sendMessageToChannel = async (channelId, message) => {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('DISCORD BOT TOKEN is missing.');
  }

  const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

  await client.login(process.env.DISCORD_BOT_TOKEN);
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel?.isTextBased()) {
      await channel.send(message);
      console.log(`Message sent to channel ${channelId}`);
    } else {
      console.error('The channel is not a text channel.');
    }
  } catch (error) {
    console.error('Error sending message to channel:', error);
  }
  await client.destroy();
};
