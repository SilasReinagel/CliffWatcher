// @ts-check

import { getTenDayAverageLow } from './alphaVantageClient.js';
import { sendDirectMessage } from './discordClient.js';
import { fetchPriceFromYahoo } from './yahooFinanceReader.js';

const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
const infoNotifyDiscordUserId = process.env.INFO_NOTIFY_DISCORD_USER_ID;

const getCachedAverageLow = async (symbol) => {
  if (!apiKey) {
    throw new Error('No API key found');
  }
  if (!symbol) {
    throw new Error('No symbol found');
  }

  const cacheKey = `${symbol}-${new Date().toISOString().slice(0, 10)}`;
  let averageLow;
  if (!globalThis.cache) {
    globalThis.cache = {};
  }
  if (globalThis.cache[cacheKey]) {
    averageLow = globalThis.cache[cacheKey];
  } else {
    const result = await getTenDayAverageLow(apiKey, symbol);
    averageLow = result.averageLow;
    globalThis.cache[cacheKey] = averageLow;
  }
  return averageLow;
}

export const alertOnCliff = async (config) => {
  console.log(`${new Date().toISOString()} - Performing Check`)
  const { symbols, notifyDiscordUserId, infoNotify } = config;

  const symbolsFellOffCliff = [];
  for (const symbol of symbols) {
    const averageLow = await getCachedAverageLow(symbol);
    const currentPrice = await fetchPriceFromYahoo(symbol);
    if (parseFloat(currentPrice) < parseFloat(averageLow)) {
      symbolsFellOffCliff.push(symbol);
    }
  }

  if (symbolsFellOffCliff.length > 0) {
    await sendDirectMessage(notifyDiscordUserId, `PRECIPITOUS STOCK DROP ALERT! ${symbolsFellOffCliff.join(', ')}`);
  }

  if (infoNotify && !!infoNotifyDiscordUserId) {
    if (symbolsFellOffCliff.length > 0) {
      await sendDirectMessage(infoNotifyDiscordUserId, `${symbolsFellOffCliff.length} symbols fell off the cliff: ${symbolsFellOffCliff.join(', ')}`);
    } else {
      await sendDirectMessage(infoNotifyDiscordUserId, `Cliffwatcher is alive and well!`);
    }
  } 
}

export const resilientAlertOnCliff = async (config) => {
  let attempts = 0;
  while (attempts < 3) {
    try {
      await alertOnCliff(config);
      break; // Exit loop if successful
    } catch (error) {
      console.error(error);
      attempts++;
      if (attempts >= 3) {
        console.error('Failed after 3 attempts');
        await errorNotify(error);
      }
    }
  }
}

const errorNotify = async (error) => {
  try {
    if (infoNotifyDiscordUserId) {
      await sendDirectMessage(infoNotifyDiscordUserId, `Cliffwatcher Error: ${JSON.stringify(error ?? error.message, null, 2)}`);
    }
  } catch (error) {
    console.error('Unable to notify about Error', error);
  }
}
