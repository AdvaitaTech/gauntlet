import { ValidationError } from '$lib/error';
import type { PoolClient } from 'pg';
import { z } from 'zod';

const testSchema = z.object({
	id: z.number(),
	challenge_id: z.number(),
	title: z.string(),
	body: z.string()
});

const challengeSchema = z.object({
	id: z.number(),
	title: z.string(),
	level: z.string(),
	created_at: z.date(),
	updated_at: z.date(),
	tests: z.array(testSchema)
});

export const createChallenge = async (
	client: PoolClient,
	{
		title,
		level,
		tests
	}: {
		title: string;
		level: string;
		tests: { title: string; body: string }[];
	}
) => {
	try {
		const now = new Date();
		await client.query('BEGIN');
		const res = await client.query(
			'INSERT INTO challenges(title, level, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id',
			[title, level, now, now]
		);
		const challengeId = res.rows[0].id;
		await Promise.all(
			tests.map(({ title, body }) => createTest(client, { challengeId, title, body, date: now }))
		);
		await client.query('COMMIT');
		return challengeId;
	} catch (e) {
		client.query('ROLLBACK');
		console.error('error during challenge creation', e);
		throw e;
	}
};

export const createTest = async (
	client: PoolClient,
	{
		challengeId,
		title,
		body,
		date
	}: {
		challengeId: number;
		title: string;
		body: string;
		date?: Date;
	}
) => {
	const now = date || new Date();
	return await client.query(
		'INSERT INTO tests(challenge_id, title, body, created_at, updated_at) VALUES($1, $2, $3, $4, $5)',
		[challengeId, title, body, now, now]
	);
};

export const fetchChallenge = async (client: PoolClient, { id }: { id: number }) => {
	const res = await client.query(
		`SELECT c.id, c.title, c.level, c.created_at, c.updated_at,
    COALESCE(json_agg(json_build_object('id', t.id, 'title', t.title, 'body', t.body, 'challenge_id', t.challenge_id)) FILTER (WHERE t.id IS NOT NULL), '[]') as tests
    FROM challenges c
    LEFT JOIN tests t ON c.id = t.challenge_id
    WHERE c.id = $1
    GROUP BY c.id, t.challenge_id`,
		[id]
	);
	const value = challengeSchema.safeParse(res.rows[0]);
	if (!value.success) {
		throw new ValidationError(`Validation Error: ${value.error}`);
	}
	return value.data;
};
