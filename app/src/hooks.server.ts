import jwt from 'jsonwebtoken';
import { getConnection } from '$lib/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const db = await getConnection();
	jwt;
	const userId = token ? Number(jwt.verify(token, process.env.SECRET || '')) : null;
	event.locals = { db, userId };
	const response = await resolve(event);
	db.release();
	return response;
};
