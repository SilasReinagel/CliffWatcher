// @ts-check
import { CronJob } from 'cron';
import fs from 'fs';
import dotenv from 'dotenv';
import { resilientAlertOnCliff } from './app.js';
dotenv.config({ path: '.env.local' });

const launchArgs = process.argv.slice(2);
if (launchArgs.length === 0) {
    console.error('No launch arguments provided. Exiting...');
    process.exit(1);
}
if (!process.env.DISCORD_BOT_TOKEN || !process.env.ALPHA_VANTAGE_API_KEY) {
    console.error('Required environment variables are missing. Exiting...');
    process.exit(1);
}

const configFile = launchArgs[0];

const every15Minutes = '0,15,30,45 * * * *';
const userConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
const exec = async () => {
	await resilientAlertOnCliff(userConfig);
}

CronJob.from({
	cronTime: every15Minutes,
	onTick: exec,
	start: true,
});

console.log('Cliffwatcher started...')
console.log('Watching Symbols:', userConfig.symbols)
