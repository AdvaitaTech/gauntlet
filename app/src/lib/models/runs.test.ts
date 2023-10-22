import { getConnection } from '$lib/db';
import type { PoolClient } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createChallenge, type Challenge, fetchChallenge } from './challenges';
import { fetchUser, type User } from './users';
import {
	createRun,
	createTestRun,
	fetchRun,
	filterPopulatedRuns,
	updateRun,
	updateTestRun
} from './runs';

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
		const run = await createRun(client, {
			challengeId: challenge.id,
			userId,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0,
			tests: [
				{
					testId: challenge.tests[0].id,
					success: true,
					time: 0,
					status: 'completed',
					error: ''
				}
			]
		});
		expect(run?.challenge_id).toBe(challenge.id);
		expect(run.id).not.toBeNaN();
		expect(run?.tests[0].id).not.toBeNaN();
		expect(run?.tests[0].test_id).toBe(challenge.tests[0].id);
	});

	it('should return null for incorrect run id', async () => {
		const run = await fetchRun(client, { id: -1 });
		expect(run).toBeNull();
	});

	it('should filter all runs of user1', async () => {
		const run = await createRun(client, {
			challengeId: challenge.id,
			userId,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0,
			tests: [
				{
					testId: challenge.tests[0].id,
					success: true,
					time: 0,
					status: 'completed',
					error: 'test2'
				}
			]
		});
		const runs = await filterPopulatedRuns(client, { user_id: userId });
		expect(runs).toHaveLength(2);
		const runs2 = await filterPopulatedRuns(client, { user_id: userId, id: run.id });
		expect(runs2).toHaveLength(1);
		expect(runs[1].tests[0].error).toBe('test2');
	});

	it('should filter all runs of user2', async () => {
		const run = await createRun(client, {
			challengeId: challenge.id,
			userId: user2.id,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0,
			tests: [
				{
					testId: challenge.tests[0].id,
					success: true,
					time: 0,
					status: 'completed',
					error: ''
				}
			]
		});
		const runs = await filterPopulatedRuns(client, {});
		expect(runs).toHaveLength(3);
		const runs2 = await filterPopulatedRuns(client, { user_id: user2.id });
		expect(runs2).toHaveLength(1);
		expect(runs2[0].tests[0].id).toBe(run.tests[0].id);
	});

	it('should create and update run and test_run', async () => {
		const firstRun = await createRun(client, {
			challengeId: challenge.id,
			userId,
			status: 'completed',
			success: true,
			code: '',
			styles: '',
			timeTaken: 0,
			tests: [
				{
					testId: challenge.tests[0].id,
					success: true,
					time: 0,
					status: 'completed',
					error: ''
				}
			]
		});
		const run = await updateRun(client, firstRun.id, { time_taken: 1, status: 'completed' });
		const testRun = await updateTestRun(client, firstRun.tests[0].id, {
			error: 'something',
			success: false
		});
		expect(run?.time_taken).toBe(1);
		expect(run?.status).toBe('completed');
		expect(testRun?.success).toBe(false);
		expect(testRun?.error).toBe('something');
	});
});
