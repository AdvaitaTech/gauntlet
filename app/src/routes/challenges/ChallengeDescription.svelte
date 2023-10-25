<script lang="ts">
	export let title: string;
	export let body: string;
</script>

<div class="challenge-body">
	<h3 class="text-xl font-bold mb-10 text-white-500">{title}</h3>
	{@html body}
</div>

<style>
	div :global(p) {
		font-size: var(--size-lg);
		color: var(--white-500);
		margin-bottom: 16px;
	}

	div :global(code) {
		padding: 1px 3px;
		border-radius: 5px;
		border: 1px solid white;
		font-size: var(--size-md);
		color: var(--white-800);
		background: var(--background-700);
	}
</style>
