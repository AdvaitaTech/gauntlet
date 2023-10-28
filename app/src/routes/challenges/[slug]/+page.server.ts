import { fetchChallenge, filterChallenges } from '$lib/server/models/challenges';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { filterPopulatedRuns } from '$lib/server/models/runs';

export const load: PageServerLoad = async ({ locals, params, depends }) => {
	if (!locals.userId) throw redirect(303, `/login?then=/challenges/${params.slug}`);
	const challenge = await fetchChallenge(locals.db, { slug: params.slug });
	depends('runs:load');
	const runs = await filterPopulatedRuns(locals.db, {
		user_id: locals.userId,
		challenge_id: challenge.id
	});
	return { challenge, runs: runs.reverse() };
};
