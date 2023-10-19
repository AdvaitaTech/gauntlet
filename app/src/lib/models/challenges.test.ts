import { getConnection } from '$lib/db';
import type { PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createChallenge, fetchChallenge } from './challenges';

describe('Challenges Model', () => {
	let poolClient: PoolClient;
	beforeAll(async () => {
		poolClient = await getConnection();
	});
	afterAll(() => {
		poolClient.release();
	});

	it('should create a challenge with tests', async () => {
		const title = 'Simple Counter';
		const level = 'easy';
		const tests = [
			{
				title: 'it should increment count',
				body: 'expect(5).toBe(5)'
			}
		];
		const id = await createChallenge(poolClient, {
			title,
			level,
			tests
		});
		const challenge = await fetchChallenge(poolClient, { id });
		expect(challenge.title).toBe(title);
		expect(challenge.level).toBe(level);
		expect(challenge.tests).toHaveLength(1);
		expect(challenge.tests[0].challenge_id).toBe(id);
		expect(challenge.tests[0].title).toBe(tests[0].title);
		expect(challenge.tests[0].body).toBe(tests[0].body);
	});

	it('should create a challenge with no tests', async () => {
		const title = 'Simple Counter 2';
		const level = 'easy';
		const id = await createChallenge(poolClient, {
			title,
			level,
			tests: []
		});
		const challenge = await fetchChallenge(poolClient, { id });
		expect(challenge.title).toBe(title);
		expect(challenge.level).toBe(level);
		expect(challenge.tests).toHaveLength(0);
	});
});
