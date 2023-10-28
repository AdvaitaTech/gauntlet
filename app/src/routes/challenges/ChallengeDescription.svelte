<script lang="ts">
	export let title: string;
	export let body: string;
</script>

<div class="challenge-body">
	<h3>{title}</h3>
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

	div :global(h3) {
		font-size: var(--size-2xl);
		font-weight: 600;
		color: var(--white-500);
		margin-bottom: 15px;
	}

	div :global(h4) {
		font-size: var(--size-xl);
		font-weight: 600;
		color: var(--white-500);
		margin-bottom: 10px;
	}

	div :global(ul) {
		list-style-type: disc;
	}

	div :global(li) {
		list-style-position: inside;
		font-size: var(--size-lg);
		margin-bottom: 5px;
	}
</style>
