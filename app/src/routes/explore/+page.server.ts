import { filterChallenges } from '$lib/server/models/challenges';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const challenges = await filterChallenges(locals.db, {});
	return { challenges };
};
