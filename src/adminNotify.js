// @ts-check
import { sendDirectMessage } from './discordClient.js';

const infoNotifyDiscordUserId = process.env.INFO_NOTIFY_DISCORD_USER_ID;

export const errorNotify = async (error) => {
  try {
    if (infoNotifyDiscordUserId) {
      await sendDirectMessage(infoNotifyDiscordUserId, `Cliffwatcher Error: ${JSON.stringify(error ?? error.stack, null, 2)}`);
    }
  } catch (error) {
    console.error('Unable to notify about Error', error);
  }
}

export const infoNotify = async (message) => {
  try {
    if (infoNotifyDiscordUserId) {
      await sendDirectMessage(infoNotifyDiscordUserId, message);
    }
  } catch (error) {
    console.error('Unable to notify', error);
  }
}
