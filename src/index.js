
/**
 * @typedef {Object} StockMonitorConfig
 * @property {string[]} symbols - Array of stock symbols to monitor.
 * @property {number} maxDrop - Maximum drop percentage to trigger an alert.
 */

const checkStocksForAnyCliffs = async (config) => {
  const { symbols, maxDrop } = config;

  for (const symbol of symbols) {
    const stockData = await getStockData(apiKey, symbol);
    const currentPrice = stockData.latestPrice;
    const previousDayPrice = stockData.previousDayPrice;
    const dropPercentage = ((previousDayPrice - currentPrice) / previousDayPrice) * 100;
    if (dropPercentage > maxDrop) {
      console.log(`Cliff detected for ${symbol} with a drop of ${dropPercentage}%`);
    }
  }
}

const everyDay8pmPst = '00 00 20 * * *';

const job = CronJob.from({
	cronTime: everyDay8pmPst,
	onTick: function () {
		console.log('You will see this message every second');
	},
	start: true,
	timeZone: 'America/Los_Angeles'
});



