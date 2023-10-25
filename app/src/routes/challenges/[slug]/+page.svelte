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
			<h3 class="text-xl font-bold mb-10 text-white-500">Simple Counter</h3>
			<div class="text-lg leading-10 text-white-500">
				Build a webpage that displays a count value starting at 0. Provide 3 buttons in a row
				underneath that say <code>Increment</code>, <code>Decrement</code> and
				<code>Reset</code>.
				<p>
					When the
					<code>Increment</code> button is clicked, the value of the counter should go up by 1. When
					<code>Decrement</code>
					is clicked", the value should go down by 1. When <code>Reset</code> is clicked, the value should
					go back to 0
				</p>
			</div>
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
