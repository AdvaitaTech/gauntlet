import { getConnection } from '$lib/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const db = await getConnection();
	event.locals = { db };
	const response = await resolve(event);
	db.release();
	return response;
};
