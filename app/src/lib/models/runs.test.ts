import { getConnection } from '$lib/db';
import type { PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createChallenge, type Challenge, fetchChallenge } from './challenges';
import { fetchUser, type User } from './users';
import { createRun, createTestRun, fetchRun, filterPopulatedRuns } from './runs';

describe('Runs Model', () => {
	let client: PoolClient;
	let challenge: Challenge, userId: number, user2: User;
	beforeAll(async () => {
		client = await getConnection();
		const title = 'Simple Counter';
		const level = 'easy';
		const tests = [
			{
				title: 'it should increment count',
				body: 'expect(5).toBe(5)'
			}
		];
		const id = await createChallenge(client, {
			title,
			level,
			tests
		});
		challenge = await fetchChallenge(client, { id });
		const user = await fetchUser(client, { email: 'testing101@example.com' });
		userId = user!.id;
		const u = await fetchUser(client, { email: 'testing102@example.com' });
		if (u) user2 = u;
	});
	afterAll(() => {
		client.release();
	});

	it('should create run and test_run', async () => {
		const runId = await createRun(client, {
			challengeId: challenge.id,
			userId,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0
		});
		const testRunId = await createTestRun(client, {
			challengeId: challenge.id,
			userId,
			runId,
			testId: challenge.tests[0].id,
			success: true,
			time: 0,
			status: 'completed',
			error: ''
		});
		const run = await fetchRun(client, { id: runId });
		expect(run?.id).toBe(runId);
		expect(runId).not.toBeNaN();
		expect(testRunId).not.toBeNaN();
	});

	it('should return null for incorrect run id', async () => {
		const run = await fetchRun(client, { id: -1 });
		expect(run).toBeNull();
	});

	it('should filter all runs of user1', async () => {
		const runId = await createRun(client, {
			challengeId: challenge.id,
			userId,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0
		});
		const testRunId = await createTestRun(client, {
			challengeId: challenge.id,
			userId,
			runId,
			testId: challenge.tests[0].id,
			success: true,
			time: 0,
			status: 'completed',
			error: ''
		});
		const runs = await filterPopulatedRuns(client, { user_id: userId });
		expect(runs).toHaveLength(2);
		const runs2 = await filterPopulatedRuns(client, { user_id: userId, id: runId });
		expect(runs2).toHaveLength(1);
		expect(runs[1].tests[0].id).toBe(testRunId);
	});

	it('should filter all runs of user2', async () => {
		const runId = await createRun(client, {
			challengeId: challenge.id,
			userId: user2.id,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0
		});
		const testRunId = await createTestRun(client, {
			challengeId: challenge.id,
			userId: user2.id,
			runId,
			testId: challenge.tests[0].id,
			success: true,
			time: 0,
			status: 'completed',
			error: ''
		});
		const runs = await filterPopulatedRuns(client, {});
		expect(runs).toHaveLength(3);
		const runs2 = await filterPopulatedRuns(client, { user_id: user2.id });
		expect(runs2).toHaveLength(1);
		expect(runs2[0].tests[0].id).toBe(testRunId);
	});
});
