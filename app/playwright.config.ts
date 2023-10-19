import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
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
