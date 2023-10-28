import { AppError, BadDataError, ForbiddenError } from '$lib/error';
import { fetchChallenge } from '$lib/server/models/challenges';
import { createRun } from '$lib/server/models/runs';
import { buildFrontend, executeFrontendRun } from '$lib/server/engine';
import type { RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const submitSchema = z.object({
	challengeId: z.number(),
	content: z.string(),
	styles: z.string(),
	language: z.enum(['typescript', 'javascript']),
	environment: z.enum(['react'])
});

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		if (!locals.userId) throw new ForbiddenError('Sign in before submitting');
		const parsed = submitSchema.safeParse(await request.json());
		if (!parsed.success) {
			console.log('validation failed', parsed.error.issues);
			throw new BadDataError('Validation failed');
		}

		const { challengeId, ...runData } = parsed.data;

		const index = await buildFrontend(runData);
		const challenge = await fetchChallenge(locals.db, { id: challengeId });

		const results = await executeFrontendRun(index, challenge);
		console.log('frontend run completed', results);
		let status = 'completed',
			error: string | undefined = undefined,
			success = true;
		if (results.challenge.buildError) {
			status = 'error';
			error = results.challenge.buildError;
			success = false;
		} else if (results.challenge.testError) {
			error = results.challenge.testError;
			success = false;
		}
		const run = await createRun(locals.db, {
			challengeId: challenge.id,
			code: runData.content,
			styles: runData.styles,
			status,
			timeTaken: results.challenge.time,
			userId: locals.userId,
			error,
			success,
			tests: results.tests.map((testRun) => {
				let status = 'completed',
					error: string | undefined = undefined,
					success = true;
				if (testRun.buildError) {
					status = 'error';
					error = testRun.buildError;
					success = false;
				} else if (testRun.testError) {
					status = 'completed';
					error = testRun.testError;
					success = false;
				}
				return {
					testId: testRun.id,
					time: testRun.time,
					status,
					error,
					success
				};
			})
		});

		return new Response(JSON.stringify(run));
	} catch (e) {
		console.log('error while submitting', e);
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
