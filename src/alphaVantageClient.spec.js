// @ts-check
import { getMostRecentDayPercentChange, getMostRecentDayStockData, getTenDayAverageLow } from './alphaVantageClient.js';

const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

describe('AlphaVantage Client Integration Test', () => {
  it.skip('should get the most recent day data for IBM', async () => {
    if (!apiKey) {
      throw new Error('No API key found');
    }

    const symbol = 'IBM';
    const res = await getMostRecentDayStockData(apiKey, symbol);

    console.log(res);
    expect(res.data['1. open']).toBeDefined();
    expect(res.data['2. high']).toBeDefined();
    expect(res.data['3. low']).toBeDefined();
    expect(res.data['4. close']).toBeDefined();
    expect(res.data['5. volume']).toBeDefined();
  });

  it.skip('should have a day percent change', async () => {
    if (!apiKey) {
      throw new Error('No API key found');
    }

    const symbol = 'IBM';
    const res = await getMostRecentDayPercentChange(apiKey, symbol);

    console.log(res);
    expect(res.percentChange).toBeDefined();
  });

  it('should get the 10-day average low for IBM', async () => {
    if (!apiKey) {
      throw new Error('No API key found');
    }

    const symbol = 'IBM';
    const res = await getTenDayAverageLow(apiKey, symbol);

    console.log(res);
    expect(res.symbol).toBe(symbol);
    expect(res.averageLow).toBeDefined();
    expect(typeof res.averageLow).toBe('number');
  });
});
