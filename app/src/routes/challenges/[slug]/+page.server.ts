import { fetchChallenge, filterChallenges } from '$lib/models/challenges';
import type { ServerLoad } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { filterPopulatedRuns } from '$lib/models/runs';
import { ForbiddenError } from '$lib/error';

export const load: PageServerLoad = async ({ locals, params, depends }) => {
	if (!locals.userId) throw new ForbiddenError('Please sign in');
	const challenge = await fetchChallenge(locals.db, { slug: params.slug });
	depends('runs:load');
	const runs = await filterPopulatedRuns(locals.db, {
		user_id: locals.userId,
		challenge_id: challenge.id
	});
	return { challenge, runs: runs.reverse() };
};
