import { getConnection } from '$lib/db';
import { createUser } from '$lib/models/users';
import test from '@playwright/test';
import type { PoolClient } from 'pg';

let poolClient: PoolClient;
test.beforeAll(async () => {
	poolClient = await getConnection();
});
test.afterAll(() => {
	poolClient.release();
});

test('setup users', async () => {
	const emails = new Array(10);
	await Promise.all(
		emails.map((_, i) =>
			createUser(poolClient, {
				email: `testing${100 + i}@example.com`,
				password: 'testing@123',
				name: `Test User ${100 + i}`
			})
		)
	);
});

test('setup challenges and tests', async () => {});
