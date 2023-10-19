import type { PoolClient } from 'pg';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { ValidationError } from '$lib/error';

export type User = {
	id: number;
	email: string;
	name: string | null;
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
		'INSERT INTO users(email, password, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
		[email, hash, name || null, now, now]
	);
	const newUser = userSchema.safeParse(res.rows[0]);
	if (!newUser.success) throw new ValidationError('User validation failed');
	return newUser.data;
};

export const fetchUser = async (client: PoolClient, { id }: { id: number }) => {
	const res = await client.query<User>('SELECT id, email, name FROM users WHERE id=$1', [id]);
	const user = userSchema.safeParse(res.rows[0]);
	if (!user.success) throw new ValidationError('User validation failed');
	return user.data;
};