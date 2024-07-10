// @ts-check

import { errorNotify } from './adminNotify.js';
import { getTenDayAverageLow } from './alphaVantageClient.js';
import { sendDirectMessage } from './discordClient.js';
import { fetchPriceFromYahoo } from './yahooFinanceReader.js';

const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
const infoNotifyDiscordUserId = process.env.INFO_NOTIFY_DISCORD_USER_ID;
const shouldSaveScreenshot = true;

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
    const currentPrice = await fetchPriceFromYahoo(symbol, shouldSaveScreenshot);
    if (parseFloat(currentPrice) < parseFloat(averageLow)) {
      symbolsFellOffCliff.push(symbol);
    }
    console.log(`${new Date().toISOString()} - Check complete for ${symbol} - 10 day Avg Low: ${averageLow.toFixed(2)} - Current Price: ${currentPrice}`)
  }

  if (symbolsFellOffCliff.length > 0) {
    await sendDirectMessage(notifyDiscordUserId, `PRECIPITOUS STOCK DROP ALERT! ${symbolsFellOffCliff.join(', ')}`);
  }

  if (infoNotify && !!infoNotifyDiscordUserId) {
    if (symbolsFellOffCliff.length > 0) {
      await sendDirectMessage(infoNotifyDiscordUserId, `${symbolsFellOffCliff.length} symbols fell off the cliff: ${symbolsFellOffCliff.join(', ')}`);
    }
  }
  console.log(`${new Date().toISOString()} - Check complete`)
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
