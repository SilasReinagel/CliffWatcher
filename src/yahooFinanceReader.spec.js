// @ts-check
import { fetchPriceFromYahoo } from './yahooFinanceReader';

describe('fetchPriceFromYahoo function', () => {
  it.skip('should get the current price for symbol QQQ', async () => {
    const symbol = 'QQQ';
    const price = await fetchPriceFromYahoo(symbol);
    console.log(`Current price of ${symbol}: ${price}`);
    expect(price).toBeDefined();
  }, 20000);
});
