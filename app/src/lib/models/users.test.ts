import { getConnection } from '$lib/db';
import type { PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { authenticateUser, createUser, fetchUser, updateUser } from './users';

describe('Users Model', () => {
	let client: PoolClient;
	beforeAll(async () => {
		client = await getConnection();
	});
	afterAll(() => {
		client.release();
	});

	it('should create and fetch a user without name', async () => {
		const user = await createUser(client, {
			email: 'testing1@example.com',
			password: 'testing@123'
		});
		expect(user.email).toBe('testing1@example.com');
		expect(user.name).toBe(null);
		const fetched = await fetchUser(client, {
			id: user.id
		});
		expect(fetched?.email).toBe(user.email);
	});

	it('should create and fetch a user without name', async () => {
		const user = await createUser(client, {
			email: 'testing2@example.com',
			password: 'testing@123',
			name: 'Test User 2'
		});
		expect(user.email).toBe('testing2@example.com');
		expect(user.name).toBe('Test User 2');
		const fetched = await fetchUser(client, {
			id: user.id
		});
		expect(fetched?.email).toBe(user.email);
	});

	it('should fetch a user by email', async () => {
		const user = await createUser(client, {
			email: 'testing3@example.com',
			password: 'testing@123',
			name: 'Test User 3'
		});
		expect(user.email).toBe('testing3@example.com');
		expect(user.name).toBe('Test User 3');
		const fetched = await fetchUser(client, {
			email: user.email
		});
		expect(fetched?.email).toBe(user.email);
		expect(fetched?.name).toBe('Test User 3');
	});

	it('should fail on an incorrect fetch', async () => {
		const user = await fetchUser(client, {
			email: 'testing0@example.com'
		});
		expect(user).toBeNull();
	});

	it('should update a users details', async () => {
		const user = await fetchUser(client, { email: 'testing100@example.com' });
		const newUser = await updateUser(client, user?.id || 0, { name: 'Updated' });
		expect(newUser?.name).toBe('Updated');
	});

	it('should authenticate user', async () => {
		const user = await authenticateUser(client, {
			email: 'testing100@example.com',
			password: 'fail'
		});
		expect(user).toBeNull();
		const user2 = await authenticateUser(client, {
			email: 'testing100@example.com',
			password: 'testing@123'
		});
		expect(user2).not.toBeNull();
		expect(user2?.email).toBe('testing100@example.com');
		expect((user2 as any).password).toBeUndefined();
	});
});
