import { fetchChallenge, filterChallenges } from '$lib/models/challenges';
import type { ServerLoad } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const challenge = await fetchChallenge(locals.db, { slug: params.slug });
	return { challenge };
};
