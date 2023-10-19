import { getConnection } from '$lib/db';
import type { PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createUser, fetchUser } from './users';

describe('Users Model', () => {
	let poolClient: PoolClient;
	beforeAll(async () => {
		poolClient = await getConnection();
	});
	afterAll(() => {
		poolClient.release();
	});

	it('should create and fetch a user without name', async () => {
		const user = await createUser(poolClient, {
			email: 'testing1@example.com',
			password: 'testing@123'
		});
		expect(user.email).toBe('testing1@example.com');
		expect(user.name).toBe(null);
		const fetched = await fetchUser(poolClient, {
			id: user.id
		});
		expect(fetched.email).toBe(user.email);
	});

	it('should create and fetch a user without name', async () => {
		const user = await createUser(poolClient, {
			email: 'testing2@example.com',
			password: 'testing@123',
			name: 'Test User 2'
		});
		expect(user.email).toBe('testing2@example.com');
		expect(user.name).toBe('Test User 2');
		const fetched = await fetchUser(poolClient, {
			id: user.id
		});
		expect(fetched.email).toBe(user.email);
	});

	it('should fetch a user by email', async () => {
		const user = await createUser(poolClient, {
			email: 'testing3@example.com',
			password: 'testing@123',
			name: 'Test User 3'
		});
		expect(user.email).toBe('testing3@example.com');
		expect(user.name).toBe('Test User 3');
		const fetched = await fetchUser(poolClient, {
			email: user.email
		});
		expect(fetched.email).toBe(user.email);
		expect(fetched.name).toBe('Test User 3');
	});
});
