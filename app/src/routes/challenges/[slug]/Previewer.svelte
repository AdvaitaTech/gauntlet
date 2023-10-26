<script lang="ts">
	export let isPreviewing: boolean;
	export let previewIndex: string | null;
	export let onPreviewClose: () => void;
</script>

{#if isPreviewing}
	<div class="fixed left-0 top-0 right-0 bottom-0 bg-background-800 opacity-100 z-10">
		<div
			id="frame-wrapper"
			class="absolute left-5 top-5 right-5 bottom-5 rounded-md border-2 border-background-950 opacity-100 bg-white-0"
		>
			<button
				id="close-preview"
				class="absolute right-2 top-2 text-2xl bg-background-900 text-white-0 px-2 rounded-md z-30"
				on:click={onPreviewClose}>X</button
			>
			{#if isPreviewing && !previewIndex}
				<div class="h-full w-full flex items-center justify-center text-3xl">Bundling Code...</div>
			{:else}
				<iframe id="preview-frame" title="preview" class="w-full h-full" srcdoc={previewIndex} />
			{/if}
		</div>
	</div>
{/if}
