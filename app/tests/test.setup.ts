import { createChallenge } from '../src/lib/models/challenges';
import { getConnection } from '../src/lib/db';
import { createUser } from '../src/lib/models/users';

console.log('running test setup');
export async function setup() {
	const poolClient = await getConnection();
	const emails = new Array(10).fill(0);
	console.log('setting up');
	await Promise.all(
		emails.map((_, i) =>
			createUser(poolClient, {
				email: `testing${100 + i}@example.com`,
				password: 'testing@123',
				name: `Test User ${100 + i}`
			})
		)
	);
	poolClient.release();
}

export async function teardown() {}
