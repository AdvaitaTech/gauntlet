<script lang="ts">
	import Editor from './Editor.svelte';
</script>

<div class="h-full w-full bg-background-900 flex">
	<div class="flex-1 flex flex-row">
		<div class="w-[550px] h-full text-white-500 p-5 border-r border-r-background-950">
			<h3 class="text-xl font-bold mb-10">Simple Counter</h3>
			<div class="text-lg leading-10">
				Build a webpage that displays a count value starting at 0. Provide 3 buttons in a row
				underneath that say <code>Increment</code>, <code>Decrement</code> and
				<code>Reset</code>. When the
				<code>Increment</code> button is clicked, the value of the counter should go up by 1. When
				<code>Decrement</code>
				is clicked", the value should go down by 1. When <code>Reset</code> is clicked, the value should
				go back to 0
			</div>
			<button class="px-5 py-2 rounded-lg bg-secondary-600">Submit</button>
		</div>
		<div class="flex-1 bg-background-900 h-full flex flex-col">
			<Editor className="w-full flex-1" />
		</div>
	</div>
</div>

<style>
	code {
		padding: 4px;
		border-radius: 5px;
		border: 1px solid white;
		font-size: var(--size-md);
		color: var(--white-700);
		background: var(--background-700);
	}
</style>
