// @ts-check
import * as fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

async function getBrowserInstance() {
  puppeteer.use(StealthPlugin())
  return await puppeteer.launch({ headless: true, protocolTimeout: 60000 });
}

/**
 * Fetches the current price of a stock from Yahoo Finance.
 * @param {string} symbol - The stock symbol to fetch the price for.
 * @param {boolean} [shouldSaveScreenshot=false] - Whether to save a screenshot of the page.
 * @returns {Promise<string>} The current price of the stock.
 */
export const fetchPriceFromYahoo = async (symbol, shouldSaveScreenshot = false) => {
  const browser = await getBrowserInstance();
  try {
    const page = await browser.newPage();
    await page.goto(`https://finance.yahoo.com/quote/${symbol}/`, { waitUntil: 'networkidle2' });

    const priceSelector = '[data-testid="qsp-price"]';
    const price = await page.$eval(priceSelector, el => el.getAttribute('data-value'));
    if (shouldSaveScreenshot) {
      try {
        if (!fs.existsSync('./screenshots')) {
          fs.mkdirSync('./screenshots');
        }
        const iso8601now = new Date().toISOString().replace(/[-:]/g, "").slice(0, -5);
        await page.setViewport({ width: 1280, height: 800 });
        const screenshot = await page.screenshot({ 
          path: `screenshots/${symbol}-${iso8601now}.png`, 
          type: "png",
          fullPage: true
        });
        if (!screenshot) {
          throw new Error('Screenshot is empty');
        }
      } catch (error) {
        console.error('Error saving screenshot:', error);
      }
    }
    await page.close();

    return price ?? 'N/A';
  } finally {
    browser?.close();
  }
}
