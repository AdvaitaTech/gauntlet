<script lang="ts">
	import { onMount } from 'svelte';
	import type { editor } from 'monaco-editor/esm/vs/editor/editor.api';

	let editorRef: HTMLDivElement;
	let editorElement: editor.IStandaloneCodeEditor;

	onMount(async () => {
		const monaco = await import('monaco-editor/esm/vs/editor/editor.api');
		monaco.editor.setTheme('vs-dark');
		editorElement = monaco.editor.create(editorRef, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			minimap: {
				enabled: false
			},
			language: 'javascript'
		});
	});
</script>

<div class="h-full w-full bg-background-700 flex">
	<div class="flex-1 flex flex-row">
		<div class="w-[550px] h-full text-white-500 p-5">
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
		</div>
		<div class="flex-1 bg-background-800 h-full">
			<div bind:this={editorRef} class="w-full h-full" />
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
