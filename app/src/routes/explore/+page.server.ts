import { filterChallenges } from '$lib/models/challenges';
import type { ServerLoad } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const challenges = await filterChallenges(locals.db, {});
	return { challenges };
};
