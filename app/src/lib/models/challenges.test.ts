import { getConnection } from '$lib/db';
import type { PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createChallenge, fetchChallenge, filterChallenges } from './challenges';

describe('Challenges Model', () => {
	let poolClient: PoolClient;
	beforeAll(async () => {
		poolClient = await getConnection();
	});
	afterAll(() => {
		poolClient.release();
	});

	it('should create a challenge with tests', async () => {
		const title = 'Test Challenge';
		const level = 'test';
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
		const title = 'Test Challenge 2';
		const level = 'test';
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

	it('should fetch all challenges', async () => {
		const challenges = await filterChallenges(poolClient, {});
		expect(challenges).toHaveLength(7);
	});

	it('should fetch challenges by level', async () => {
		const challenges = await filterChallenges(poolClient, { level: 'test' });
		expect(challenges).toHaveLength(2);
	});
});
