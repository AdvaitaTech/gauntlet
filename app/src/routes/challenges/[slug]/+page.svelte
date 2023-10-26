<script lang="ts">
	import ChallengePanel from '../ChallengePanel.svelte';
	import type { PageData } from './$types';
	import Editor from './Editor.svelte';
	export let data: PageData;
</script>

<div class="h-full w-full bg-background-900 flex">
	<div class="flex-1 flex flex-row">
		<div class="w-[550px] h-full text-white-500 border-r border-r-background-950">
			<ChallengePanel challenge={data.challenge} />
		</div>
		<div class="flex-1 bg-background-900 h-full flex flex-col">
			<Editor className="w-full flex-1" />
		</div>
	</div>
</div>

<style>
	code {
		padding: 1px 3px;
		border-radius: 5px;
		border: 1px solid white;
		font-size: var(--size-md);
		color: var(--white-800);
		background: var(--background-700);
	}
</style>
