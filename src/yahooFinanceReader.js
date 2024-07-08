// @ts-check
import * as fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

let browserInstance = null;

async function getBrowserInstance() {
  if (!browserInstance) {
    puppeteer.use(StealthPlugin())
    browserInstance = await puppeteer.launch({ headless: true });
  }
  return browserInstance;
}

/**
 * Fetches the current price of a stock from Yahoo Finance.
 * @param {string} symbol - The stock symbol to fetch the price for.
 * @param {boolean} [shouldSaveScreenshot=false] - Whether to save a screenshot of the page.
 * @returns {Promise<string>} The current price of the stock.
 */
export const fetchPriceFromYahoo = async (symbol, shouldSaveScreenshot = false) => {
  const browser = await getBrowserInstance();
  const page = await browser.newPage();
  await page.goto(`https://finance.yahoo.com/quote/${symbol}/`, { waitUntil: 'networkidle2' });

  const priceSelector = '[data-testid="qsp-price"]';
  const price = await page.$eval(priceSelector, el => el.getAttribute('data-value'));

  if (shouldSaveScreenshot) {
    try {
      if (!fs.existsSync('./screenshots')) {
        fs.mkdirSync('./screenshots');
      }
      const iso8601now = new Date().toISOString();
      await page.screenshot({ path: `./screenshots/${symbol}-${iso8601now}.jpg` });
    } catch (error) {
      console.error('Error saving screenshot:', error);
    }
  }

  return price ?? 'N/A';
}
