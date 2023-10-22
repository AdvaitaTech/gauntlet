import test from '@playwright/test';
import { setup } from './test.setup';

test('global setup', async () => {
	await setup();
});
