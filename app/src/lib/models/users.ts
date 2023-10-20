import type { PoolClient } from 'pg';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { ValidationError } from '$lib/error';
import { getParameterizedQuery } from '$lib/db';

export type User = {
	id: number;
	email: string;
	name: string | null;
	token: string;
};

const userSchema = z.object({
	id: z.number(),
	email: z.string(),
	name: z.string().nullable()
});

export const createUser = async (
	client: PoolClient,
	{
		email,
		password,
		name
	}: {
		email: string;
		password: string;
		name?: string;
	}
) => {
	const hash = await bcrypt.hash(password, 10);
	const now = new Date();
	const res = await client.query<User>(
		'INSERT INTO users(email, password, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, token',
		[email, hash, name || null, now, now]
	);
	const newUser = userSchema.safeParse(res.rows[0]);
	if (!newUser.success) {
		console.error(`user creation error: ${newUser.error}`);
		throw new ValidationError('User validation failed');
	}
	return newUser.data;
};

export const fetchUser = async (client: PoolClient, map: { id: number } | { email: string }) => {
	let suffix = 'id' in map ? 'id=$1' : 'email=$1';
	const res = await client.query<User>(`SELECT id, email, name, token FROM users WHERE ${suffix}`, [
		'id' in map ? map.id : map.email
	]);
	if (!res.rows[0]) return null;
	const user = userSchema.safeParse(res.rows[0]);
	if (!user.success) {
		console.error(
			'error',
			user.error,
			res.rows,
			`SELECT id, email, name FROM users WHERE ${suffix}`,
			['id' in map ? map.id : map.email]
		);
		throw new ValidationError('User validation failed');
	}
	return user.data;
};

export const updateUser = async (
	client: PoolClient,
	id: number,
	updates: { name?: string; token?: string }
) => {
	const [suffix, params] = getParameterizedQuery(
		{ ...updates, updated_at: new Date() },
		{ queryPrefix: 'SET', paramOffset: 1, joinString: ', ' }
	);
	const res = await client.query<User>(
		`UPDATE users ${suffix} WHERE id=$1 RETURNING id, email, name, token`,
		[id, ...params]
	);
	return userSchema.parse(res.rows[0]);
};
