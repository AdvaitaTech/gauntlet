<script lang="ts">
	import type { Challenge } from '$lib/server/models/challenges';
	import type { PopulatedRun } from '$lib/server/models/runs';
	import ChallengeDescription from './ChallengeDescription.svelte';
	import SubmissionsTab from './SubmissionsTab.svelte';
	const tabs = [
		{ key: 'description', title: 'Description' },
		{ key: 'submissions', title: 'Your Submissions' }
	];
	export let challenge: Challenge;
	export let runs: PopulatedRun[];
	console.log('got runs in challenge panel', runs);
	export let currentTabIndex: number;
	export let setTabIndex: (index: number) => void;
</script>

<div class="w-full h-full overflow-hidden">
	<div class="h-[50px] text-white-500 flex items-center">
		{#each tabs as { title }, index}
			<button
				class="h-full px-10 flex items-center justify-center border-r border-r-primary-950 bg-background-800 flex-1"
				class:border-b-2={currentTabIndex === index}
				class:border-b-primary-800={currentTabIndex === index}
				on:click={() => setTabIndex(index)}
			>
				{title}
			</button>
		{/each}
	</div>
	<div class="flex-1 overflow-hidden p-5">
		{#if currentTabIndex === 0}
			<ChallengeDescription title={challenge.title} body={challenge.body || ''} />
		{:else if currentTabIndex === 1}
			<SubmissionsTab {runs} />
		{:else}
			<div>Some error occurred. Try refreshing the page</div>
		{/if}
	</div>
</div>
