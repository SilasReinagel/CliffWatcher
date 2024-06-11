// @ts-check
import { CronJob } from 'cron';
import fs from 'fs';
import dotenv from 'dotenv';
import { resilientAlertOnCliff } from './app.js';
dotenv.config({ path: '.env.local' });

const every15Minutes = '0,15,30,45 * * * *';
const userConfig = JSON.parse(fs.readFileSync('config-test.json', 'utf8'));
const exec = async () => {
	await resilientAlertOnCliff(userConfig);
}

CronJob.from({
	cronTime: every15Minutes,
	onTick: exec,
	start: true,
});
