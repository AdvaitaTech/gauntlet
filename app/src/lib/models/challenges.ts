import { getParameterizedQuery } from '$lib/db';
import { ValidationError } from '../error';
import type { PoolClient } from 'pg';
import { z } from 'zod';

export type Test = {
	id: number;
	challenge_id: number;
	title: string;
	body: string;
};

export type Challenge = {
	id: number;
	title: string;
	slug: string;
	body?: string;
	level: string;
	tests: Test[];
};

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
	slug: z.string(),
	body: z.string().nullable().optional(),
	created_at: z.date(),
	updated_at: z.date(),
	tests: z.array(testSchema)
});

export const createChallenge = async (
	client: PoolClient,
	{
		title,
		level,
		slug,
		body,
		tests
	}: {
		title: string;
		level: string;
		slug?: string;
		body?: string;
		tests: { title: string; body: string }[];
	}
) => {
	try {
		const now = new Date();
		await client.query('BEGIN');
		const generatedSlug = slug || title.toLowerCase().replaceAll(' ', '-');
		const res = await client.query(
			'INSERT INTO challenges(title, slug, level, body, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
			[title, generatedSlug, level, body || null, now, now]
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

export const fetchChallenge = async (
	client: PoolClient,
	map: { id: number } | { slug: string }
) => {
	const suffix = 'id' in map ? 'c.id=$1' : 'c.slug=$1';
	const res = await client.query(
		`SELECT c.*,
    COALESCE(json_agg(row_to_json(t)) FILTER (WHERE t.id IS NOT NULL), '[]') as tests
    FROM challenges c
    LEFT JOIN tests t ON c.id = t.challenge_id
    WHERE ${suffix}
    GROUP BY c.id, t.challenge_id`,
		['id' in map ? map.id : map.slug]
	);
	const value = challengeSchema.safeParse(res.rows[0]);
	if (!value.success) {
		throw new ValidationError(`Validation Error: ${value.error}`);
	}
	return value.data;
};

export const filterChallenges = async (
	client: PoolClient,
	props: {
		id?: number;
		level?: string;
		slug?: string;
		status?: string;
		success?: boolean;
	}
) => {
	const [query, params] = getParameterizedQuery(props);
	const res = await client.query<Challenge>(
		`SELECT c.*, COALESCE(json_agg(row_to_json(t)) FILTER (WHERE t.id IS NOT NULL), '[]') as tests
    FROM challenges c
    LEFT JOIN tests t ON t.challenge_id = c.id 
    ${query}
    GROUP BY c.id, t.challenge_id
    `,
		params
	);
	return res.rows;
};
