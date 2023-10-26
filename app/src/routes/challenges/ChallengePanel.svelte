<script lang="ts">
	import type { Challenge } from '$lib/models/challenges';
	import ChallengeDescription from './ChallengeDescription.svelte';
	const tabs = [
		{ key: 'description', title: 'Description' },
		{ key: 'submissions', title: 'Your Submissions' }
	];
	export let challenge: Challenge;
	let currentTabIndex = 0;
</script>

<div class="w-full h-full overflow-hidden">
	<div class="h-[50px] text-white-500 flex items-center">
		{#each tabs as { title }, index}
			<button
				class="h-full px-10 flex items-center justify-center border-r border-r-primary-950 bg-background-800 flex-1"
				class:border-b-2={currentTabIndex === index}
				class:border-b-primary-800={currentTabIndex === index}
				on:click={() => (currentTabIndex = index)}
			>
				{title}
			</button>
		{/each}
	</div>
	<div class="flex-1 overflow-hidden p-5">
		{#if currentTabIndex === 0}
			<ChallengeDescription title={challenge.title} body={challenge.body || ''} />
		{:else if currentTabIndex === 1}
			<div>Runs come here</div>
		{:else}
			<div>Some error occurred. Try refreshing the page</div>
		{/if}
	</div>
</div>
