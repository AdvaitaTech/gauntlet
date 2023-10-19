import { getParameterizedQuery } from '$lib/db';
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
		error
	}: {
		challengeId: number;
		userId: number;
		status: string;
		code: string;
		styles: string;
		timeTaken: number;
		success?: boolean;
		error?: string;
	}
) => {
	const now = new Date();
	const res = await client.query<{ id: number }>(
		'INSERT INTO runs(challenge_id, user_id, time_taken, code, styles, status, success, error, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
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
	return res.rows[0].id;
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
		error: string;
	}
) => {
	const now = new Date();
	const res = await client.query<{ id: number }>(
		'INSERT INTO test_runs(challenge_id, run_id, user_id, test_id, success, time_taken, status, error, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
		[challengeId, runId, userId, testId, success, time, status, error, now, now]
	);
	return res.rows[0].id;
};

export const fetchRun = async (client: PoolClient, { id }: { id: number }) => {
	const res = await client.query<Run>('SELECT * from runs where id=$1', [id]);
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
	const [query, params] = getParameterizedQuery(props, { prefix: 'r' });
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
