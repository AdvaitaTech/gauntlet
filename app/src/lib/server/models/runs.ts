import { getParameterizedQuery } from '../db';
import type { PoolClient } from 'pg';

export type Run = {
	id: number;
	challenge_id: number;
	user_id: number;
	created_at: number;
	updated_at: number;
	code: string;
	styles: string;
	time_taken: string;
	success: boolean;
	status: string;
	error: string | null;
};

export type TestRun = {
	id: number;
	run_id: number;
	challenge_id: number;
	test_id: number;
	user_id: number;
	created_at: number;
	updated_at: number;
	time_taken: string;
	success: boolean;
	status: string;
	error: string | null;
};

export type PopulatedRun = Run & {
	tests: TestRun[];
};

export const createRun = async (
	client: PoolClient,
	{
		challengeId,
		userId,
		status,
		code,
		styles,
		success,
		timeTaken,
		error,
		tests
	}: {
		challengeId: number;
		userId: number;
		status: string;
		code: string;
		styles: string;
		timeTaken: number;
		success?: boolean;
		error?: string;
		tests: {
			testId: number;
			success: boolean;
			time: number;
			status: string;
			error?: string;
		}[];
	}
): Promise<PopulatedRun> => {
	try {
		const now = new Date();
		await client.query('BEGIN');
		const res = await client.query<Run>(
			'INSERT INTO runs(challenge_id, user_id, time_taken, code, styles, status, success, error, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
			[
				challengeId,
				userId,
				timeTaken,
				code,
				styles,
				status,
				success || false,
				error || null,
				now,
				now
			]
		);
		const run = res.rows[0];
		const testRuns = await Promise.all(
			tests.map(({ testId, time, success, status, error }) =>
				createTestRun(client, {
					challengeId,
					runId: run.id,
					userId,
					testId,
					time,
					success,
					status,
					error
				})
			)
		);
		await client.query('COMMIT');
		return {
			...run,
			tests: testRuns
		};
	} catch (e) {
		client.query('ROLLBACK');
		console.error('error during run creation', e);
		throw e;
	}
};

export const createTestRun = async (
	client: PoolClient,
	{
		challengeId,
		userId,
		runId,
		testId,
		success,
		time,
		status,
		error
	}: {
		challengeId: number;
		userId: number;
		runId: number;
		testId: number;
		time: number;
		success: boolean;
		status: string;
		error?: string;
	}
) => {
	const now = new Date();
	const res = await client.query<TestRun>(
		'INSERT INTO test_runs(challenge_id, run_id, user_id, test_id, success, time_taken, status, error, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
		[challengeId, runId, userId, testId, success, time, status, error, now, now]
	);
	return res.rows[0];
};

export const fetchRun = async (client: PoolClient, { id }: { id: number }) => {
	const res = await client.query<Run>('SELECT * from runs where id=$1', [id]);
	if (!res.rows[0]) return null;
	return res.rows[0];
};

export const updateRun = async (
	client: PoolClient,
	id: number,
	updates: { time_taken?: number; success?: boolean; status?: string; error?: string }
) => {
	const [updateQ, params] = getParameterizedQuery(
		{ ...updates, updated_at: new Date() },
		{
			queryPrefix: 'SET',
			paramOffset: 1,
			joinString: ', '
		}
	);
	const res = await client.query<Run>(`UPDATE runs ${updateQ} WHERE id=$1 RETURNING *`, [
		id,
		...params
	]);
	return res.rows[0];
};

export const updateTestRun = async (
	client: PoolClient,
	id: number,
	updates: { time_taken?: number; success?: boolean; status?: string; error?: string }
) => {
	const [updateQ, params] = getParameterizedQuery(
		{ ...updates, updated_at: new Date() },
		{
			queryPrefix: 'SET',
			paramOffset: 1,
			joinString: ', '
		}
	);
	const res = await client.query<TestRun>(`UPDATE runs ${updateQ} WHERE id=$1 RETURNING *`, [
		id,
		...params
	]);
	return res.rows[0];
};

export const filterPopulatedRuns = async (
	client: PoolClient,
	props: {
		user_id?: number;
		challenge_id?: number;
		id?: number;
		status?: string;
		success?: boolean;
	}
) => {
	const [query, params] = getParameterizedQuery(props, { fieldPrefix: 'r' });
	const res = await client.query<PopulatedRun>(
		`SELECT r.*, COALESCE(json_agg(row_to_json(t)) FILTER (WHERE t.id IS NOT NULL), '[]') as tests
    FROM runs r
    LEFT JOIN test_runs t ON t.run_id = r.id 
    ${query}
    GROUP BY r.id, t.run_id
    `,
		params
	);
	return res.rows;
};
