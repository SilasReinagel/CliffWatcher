// @ts-check
import axios from 'axios';

/**
 * Fetches the stock data for a given symbol.
 * @param {string} apiKey - The API key for Alpha Vantage.
 * @param {string} symbol - The stock symbol to fetch data for.
 * @returns {Promise<StockData>} An object containing the stock data.
 */
export const getStockData = async (apiKey, symbol) => {
  const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
  return response.data;
};

/**
 * Fetches the most recent day's stock data for a given symbol.
 * @param {string} apiKey - The API key for Alpha Vantage.
 * @param {string} symbol - The stock symbol to fetch data for.
 * @returns {Promise<{symbol: string, day: string, data: Object}>} An object containing the symbol, day as 'day' and the stock data as 'data'.
 */
export const getMostRecentDayStockData = async (apiKey, symbol) => {
  const resp = await getStockData(apiKey, symbol);
  const mostRecentDay = Object.keys(resp['Time Series (Daily)'])[0];
  return {
    symbol: symbol,
    day: mostRecentDay,
    data: resp['Time Series (Daily)'][mostRecentDay]
  };
}

/**
 * Fetches the most recent day's percent change in stock price for a given symbol.
 * @param {string} apiKey - The API key for Alpha Vantage.
 * @param {string} symbol - The stock symbol to fetch data for.
 * @returns {Promise<{symbol: string, day: string, percentChange: number}>} An object containing the symbol, day and the percent change of the stock price, limited to 2 decimal places.
 */
export const getMostRecentDayPercentChange = async (apiKey, symbol) => {
  const mostRecentDayData = await getMostRecentDayStockData(apiKey, symbol);
  const openPrice = parseFloat(mostRecentDayData.data['1. open']);
  const closePrice = parseFloat(mostRecentDayData.data['4. close']);
  const percentChange = ((closePrice - openPrice) / openPrice) * 100;
  return {
    symbol: symbol,
    day: mostRecentDayData.day,
    percentChange: parseFloat(percentChange.toFixed(2))
  };
}

/**
 * Fetches the ten-day average low price for a given stock symbol.
 * @param {string} apiKey - The API key for Alpha Vantage.
 * @param {string} symbol - The stock symbol to fetch data for.
 * @returns {Promise<{symbol: string, latestDay: Object, averageLow: number}>} An object containing the symbol, the latest day's data, and the ten-day average low price.
 */
export const getTenDayAverageLow = async (apiKey, symbol) => {
  const resp = await getStockData(apiKey, symbol);
  const tenDayData = Object.values(resp['Time Series (Daily)']).slice(0, 10);
  const latestDay = Object.values(resp['Time Series (Daily)'])[0];
  const sum = tenDayData.reduce((acc, day) => acc + parseFloat(day['3. low']), 0);
  return {
    symbol: symbol,
    latestDay: latestDay,
    averageLow: sum / tenDayData.length
  }
}

/**
 * @typedef {Object} StockData
 * @property {Object} Meta Data - Contains metadata about the stock data.
 * @property {string} Meta Data.1. Information - Information about the data.
 * @property {string} Meta Data.2. Symbol - The stock symbol.
 * @property {string} Meta Data.3. Last Refreshed - The last refreshed time of the data.
 * @property {string} Meta Data.4. Output Size - The output size of the data.
 * @property {string} Meta Data.5. Time Zone - The time zone of the data.
 * @property {Record<string, Object>} Time Series (Daily) - Daily time series data.
 * @property {string} Time Series (Daily).1. open - Opening price for the day.
 * @property {string} Time Series (Daily).2. high - Highest price for the day.
 * @property {string} Time Series (Daily).3. low - Lowest price for the day.
 * @property {string} Time Series (Daily).4. close - Closing price for the day.
 * @property {string} Time Series (Daily).5. volume - Trading volume for the day.
 */

