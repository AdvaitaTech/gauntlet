<script lang="ts">
	import type { PopulatedRun } from '$lib/models/runs';

	export let runs: PopulatedRun[];
	const getRunStatus = (run: PopulatedRun) => {
		if (run.status === 'completed') {
			if (run.success) return 'Accepted';
			else return 'Failed';
		} else if (run.status === 'error') {
			return 'Runtime Error';
		}
	};
	$: runDisplays = runs.map((r) => ({
		...r,
		statusDisplay: getRunStatus(r)
	}));
</script>

{#if runs.length !== 0}
	<div class="w-full border border-background-600 rounded-md">
		<div
			role="table"
			id="runs-table"
			class="w-full grid grid-cols-[1fr_auto_auto_auto] grid-rows-1 auto-rows-auto"
		>
			<!-- <div role="rowgroup" class="flex border-b-2 border-b-background-400"> -->
			<div
				role="columnheader"
				class="p-2 border-r border-r-background-700 text-left font-bold border-b border-b-background-400"
			>
				Status
			</div>
			<div
				role="columnheader"
				class="p-2 border-r border-r-background-700 text-left font-bold border-b border-b-background-400"
			>
				Tests
			</div>
			<div
				role="columnheader"
				class="p-2 border-r border-r-background-700 text-left font-bold border-b border-b-background-400"
			>
				Language
			</div>
			<div role="columnheader" class="p-2 text-left font-bold border-b border-b-background-400">
				Environment
			</div>
			<!-- </div> -->
			{#each runDisplays as run}
				<!-- <div role="rowgroup" class="flex border-b-2 border-background-600"> -->
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
					class:text-red-600={run.statusDisplay === 'Runtime Error' ||
						run.statusDisplay === 'Failed'}
					class:text-primary-600={run.statusDisplay === 'Accepted'}
				>
					{run.statusDisplay}
				</div>
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
				>
					{run.tests.filter((t) => t.status === 'completed' && t.success).length +
						'/' +
						run.tests.length}
				</div>
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
				>
					Javascript
				</div>
				<div role="cell" class="px-2 py-1 text-left border-b border-b-background-400">React</div>
				<!-- <td class="p-2 text-left">{Math.round(Number(run.time_taken)) + 'ms'}</td> -->
				<!-- </div> -->
			{/each}
		</div>
	</div>
{:else}
	<div class="w-full text-center">No submissions yet</div>
{/if}
