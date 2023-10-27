import { error, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { buildFrontend } from '$lib/server/engine';
import { AppError } from '$lib/error';

export const GET: RequestHandler = () => {
	return new Response('pong');
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const schema = z.object({
			content: z.string(),
			styles: z.string(),
			language: z.enum(['typescript', 'javascript']),
			environment: z.enum(['react'])
		});
		const json = await request.json();
		const result = schema.safeParse(json);
		if (!result.success) {
			console.log('validation fail', result.error.issues);
			throw error(400, {
				message: 'Validation failed',
				data: result.error.issues
			});
		}

		const index = await buildFrontend({
			content: result.data.content,
			styles: result.data.styles,
			language: result.data.language,
			environment: result.data.environment
		});
		return new Response(index);
	} catch (e) {
		console.log('error while building', e);
		if (e instanceof AppError) {
			return new Response(e.message, {
				status: e.code,
				statusText: e.name
			});
		} else
			return new Response('Internal Server Error', {
				status: 500,
				statusText: 'Internal Server Error'
			});
	}
};
