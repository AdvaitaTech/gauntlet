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
		expect(challenge.slug).toBe('test-challenge');
		expect(challenge.level).toBe(level);
		expect(challenge.tests).toHaveLength(1);
		expect(challenge.tests[0].challenge_id).toBe(id);
		expect(challenge.tests[0].title).toBe(tests[0].title);
		expect(challenge.tests[0].body).toBe(tests[0].body);
	});

	it('should create a challenge with body', async () => {
		const title = 'Test Challenge s1';
		const level = 'test';
		const body = '<p>Test body</p>';
		const tests = [
			{
				title: 'it should increment count',
				body: 'expect(5).toBe(5)'
			}
		];
		const id = await createChallenge(poolClient, {
			title,
			level,
			slug: 's1',
			body,
			tests
		});
		const challenge = await fetchChallenge(poolClient, { id });
		expect(challenge.title).toBe(title);
		expect(challenge.slug).toBe('s1');
		expect(challenge.level).toBe(level);
		expect(challenge.body).toBe(body);
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
		expect(challenge.slug).toBe('test-challenge-2');
		expect(challenge.level).toBe(level);
		expect(challenge.tests).toHaveLength(0);
	});

	it('should fetch all challenges', async () => {
		const challenges = await filterChallenges(poolClient, {});
		expect(challenges).toHaveLength(8);
	});

	it('should fetch challenges by level', async () => {
		const challenges = await filterChallenges(poolClient, { level: 'test' });
		expect(challenges).toHaveLength(3);
	});

	it('should filter by slug', async () => {
		const challenges = await filterChallenges(poolClient, { slug: 'test-challenge-2' });
		expect(challenges).toHaveLength(1);
		expect(challenges[0].title).toBe('Test Challenge 2');
	});
});
