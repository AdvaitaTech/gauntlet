import { getConnection } from '$lib/db';
import { createUser } from '$lib/models/users';

console.log('running test setup');
export async function setup() {
	const poolClient = await getConnection();
	const emails = new Array(10).fill(0);
	await Promise.all(
		emails.map((_, i) =>
			createUser(poolClient, {
				email: `testing${100 + i}@example.com`,
				password: 'testing@123',
				name: `Test User ${100 + i}`
			})
		)
	);
	const res = await poolClient.query('select * from users');
	poolClient.release();
}

export async function teardown() {}
