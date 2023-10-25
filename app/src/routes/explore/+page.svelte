<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const challenges = data.challenges;
</script>

<div class="bg-background-800 h-full w-full overflow-hidden py-[60px] px-10">
	<div class="font-bold text-2xl text-primary-700 mb-5">Challenges</div>
	<div class="text-white-0 flex flex-wrap gap-5">
		{#each challenges as challenge}
			<div
				class="grid w-[500px] grid-cols-2 grid-rows-[50px_auto_50px] gap-2 p-5 flex-0 rounded-xl bg-background-900"
			>
				<div class="col-span-2 text-xl font-bold">{challenge.title}</div>
				<div class="col-span-2 overflow-hidden text-ellipsis text-md text-white-700 truncate-body">
					{@html challenge.body}
				</div>
				<div class="flex items-center text-sm">
					<div
						class="px-2 py-[1px] bg-background-800 text-red-800 rounded-2xl"
						class:text-primary-600={challenge.level === 'Easy'}
						class:text-foreground-700={challenge.level === 'Medium'}
						class:text-red-800={challenge.level === 'Hard'}
					>
						{challenge.level}
					</div>
				</div>
				<a
					href={`/challenges/${challenge.slug}`}
					class="flex items-center justify-end text-primary-800 text-right font-semibold"
					>Attempt ></a
				>
			</div>
		{/each}
	</div>
</div>

<style>
	.truncate-body {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
</style>
