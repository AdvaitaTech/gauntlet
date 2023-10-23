import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv-flow';

dotenv.config();
const config: PlaywrightTestConfig = {
	expect: {
		timeout: 500
	},
	use: {
		headless: true,
		actionTimeout: 5000
	},
	webServer: {
		// command: 'NODE_ENV=test npm run build && NODE_ENV=test npm run preview',
		command: 'NODE_ENV=test npm run dev',
		port: 4001,
		stdout: 'pipe',
		stderr: 'pipe'
	},
	fullyParallel: true,
	testDir: 'tests',
	projects: [
		{
			name: 'setup',
			testMatch: /playwright\.setup\.ts/
		},
		{
			name: 'tests',
			dependencies: ['setup']
		}
	]
};

export default config;
