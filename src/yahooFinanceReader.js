// @ts-check
import puppeteer from 'puppeteer';

let browserInstance = null;

async function getBrowserInstance() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({ headless: true });
  }
  return browserInstance;
}

/**
 * Fetches the current price of QQQ from Yahoo Finance.
 * @returns {Promise<string>} The current price of QQQ.
 */
export const fetchPriceFromYahoo = async (symbol) => {
  const browser = await getBrowserInstance();
  const page = await browser.newPage();
  await page.goto(`https://finance.yahoo.com/quote/${symbol}/`, { waitUntil: 'networkidle2' });

  const priceSelector = '[data-testid="qsp-price"]';
  const price = await page.$eval(priceSelector, el => el.getAttribute('data-value'));

  return price ?? 'N/A';
}
