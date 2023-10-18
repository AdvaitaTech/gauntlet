<script lang="ts">
	import { onMount } from 'svelte';
	import PlayFill from 'svelte-bootstrap-icons/lib/Play.svelte';
	import type { editor } from 'monaco-editor/esm/vs/editor/editor.api';

	export let className: string;

	let editorRef: HTMLDivElement;
	let editorElement: editor.IStandaloneCodeEditor;

	import editorWorkerUrl from 'monaco-editor/esm/vs/editor/editor.worker?worker&url';
	import cssWorkerUrl from 'monaco-editor/esm/vs/language/css/css.worker?worker&url';
	import htmlWorkerUrl from 'monaco-editor/esm/vs/language/html/html.worker?worker&url';
	import tsWorkerUrl from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker&url';

	onMount(async () => {
		const monaco = await import('monaco-editor');
		const editorWorker = new Worker(editorWorkerUrl, {
			type: 'module'
		});
		const cssWorker = new Worker(cssWorkerUrl, {
			type: 'module'
		});
		const htmlWorker = new Worker(htmlWorkerUrl, {
			type: 'module'
		});
		const tsWorker = new Worker(tsWorkerUrl, {
			type: 'module'
		});
		self.MonacoEnvironment = {
			getWorker: async (_: any, label: string) => {
				console.log('getting worker');
				if (label === 'css' || label === 'scss' || label === 'less') {
					return cssWorker;
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return htmlWorker;
				}
				if (label === 'typescript' || label === 'javascript') {
					return tsWorker;
				}
				return editorWorker;
			}
		};
		monaco.editor.defineTheme('twilight', {
			base: 'vs-dark',
			inherit: true,
			rules: [
				{
					background: '141414',
					token: ''
				},
				{
					foreground: '5f5a60',
					fontStyle: 'italic',
					token: 'comment'
				},
				{
					foreground: 'cf6a4c',
					token: 'constant'
				},
				{
					foreground: '9b703f',
					token: 'entity'
				},
				{
					foreground: 'cda869',
					token: 'keyword'
				},
				{
					foreground: 'f9ee98',
					token: 'storage'
				},
				{
					foreground: '8f9d6a',
					token: 'string'
				},
				{
					foreground: '9b859d',
					token: 'support'
				},
				{
					foreground: '7587a6',
					token: 'variable'
				},
				{
					foreground: 'd2a8a1',
					fontStyle: 'italic underline',
					token: 'invalid.deprecated'
				},
				{
					foreground: 'f8f8f8',
					background: '562d56bf',
					token: 'invalid.illegal'
				},
				{
					background: 'b0b3ba14',
					token: 'text source'
				},
				{
					background: 'b1b3ba21',
					token: 'text.html.ruby source'
				},
				{
					foreground: '9b5c2e',
					fontStyle: 'italic',
					token: 'entity.other.inherited-class'
				},
				{
					foreground: 'daefa3',
					token: 'string source'
				},
				{
					foreground: 'ddf2a4',
					token: 'string constant'
				},
				{
					foreground: 'e9c062',
					token: 'string.regexp'
				},
				{
					foreground: 'cf7d34',
					token: 'string.regexp constant.character.escape'
				},
				{
					foreground: 'cf7d34',
					token: 'string.regexp source.ruby.embedded'
				},
				{
					foreground: 'cf7d34',
					token: 'string.regexp string.regexp.arbitrary-repitition'
				},
				{
					foreground: '8a9a95',
					token: 'string variable'
				},
				{
					foreground: 'dad085',
					token: 'support.function'
				},
				{
					foreground: 'cf6a4c',
					token: 'support.constant'
				},
				{
					foreground: '8996a8',
					token: 'meta.preprocessor.c'
				},
				{
					foreground: 'afc4db',
					token: 'meta.preprocessor.c keyword'
				},
				{
					foreground: '494949',
					token: 'meta.tag.sgml.doctype'
				},
				{
					foreground: '494949',
					token: 'meta.tag.sgml.doctype entity'
				},
				{
					foreground: '494949',
					token: 'meta.tag.sgml.doctype string'
				},
				{
					foreground: '494949',
					token: 'meta.tag.preprocessor.xml'
				},
				{
					foreground: '494949',
					token: 'meta.tag.preprocessor.xml entity'
				},
				{
					foreground: '494949',
					token: 'meta.tag.preprocessor.xml string'
				},
				{
					foreground: 'ac885b',
					token: 'declaration.tag'
				},
				{
					foreground: 'ac885b',
					token: 'declaration.tag entity'
				},
				{
					foreground: 'ac885b',
					token: 'meta.tag'
				},
				{
					foreground: 'ac885b',
					token: 'meta.tag entity'
				},
				{
					foreground: 'e0c589',
					token: 'declaration.tag.inline'
				},
				{
					foreground: 'e0c589',
					token: 'declaration.tag.inline entity'
				},
				{
					foreground: 'e0c589',
					token: 'source entity.name.tag'
				},
				{
					foreground: 'e0c589',
					token: 'source entity.other.attribute-name'
				},
				{
					foreground: 'e0c589',
					token: 'meta.tag.inline'
				},
				{
					foreground: 'e0c589',
					token: 'meta.tag.inline entity'
				},
				{
					foreground: 'cda869',
					token: 'meta.selector.css entity.name.tag'
				},
				{
					foreground: '8f9d6a',
					token: 'meta.selector.css entity.other.attribute-name.tag.pseudo-class'
				},
				{
					foreground: '8b98ab',
					token: 'meta.selector.css entity.other.attribute-name.id'
				},
				{
					foreground: '9b703f',
					token: 'meta.selector.css entity.other.attribute-name.class'
				},
				{
					foreground: 'c5af75',
					token: 'support.type.property-name.css'
				},
				{
					foreground: 'f9ee98',
					token: 'meta.property-group support.constant.property-value.css'
				},
				{
					foreground: 'f9ee98',
					token: 'meta.property-value support.constant.property-value.css'
				},
				{
					foreground: '8693a5',
					token: 'meta.preprocessor.at-rule keyword.control.at-rule'
				},
				{
					foreground: 'ca7840',
					token: 'meta.property-value support.constant.named-color.css'
				},
				{
					foreground: 'ca7840',
					token: 'meta.property-value constant'
				},
				{
					foreground: '8f9d6a',
					token: 'meta.constructor.argument.css'
				},
				{
					foreground: 'f8f8f8',
					background: '0e2231',
					fontStyle: 'italic',
					token: 'meta.diff'
				},
				{
					foreground: 'f8f8f8',
					background: '0e2231',
					fontStyle: 'italic',
					token: 'meta.diff.header'
				},
				{
					foreground: 'f8f8f8',
					background: '0e2231',
					fontStyle: 'italic',
					token: 'meta.separator'
				},
				{
					foreground: 'f8f8f8',
					background: '420e09',
					token: 'markup.deleted'
				},
				{
					foreground: 'f8f8f8',
					background: '4a410d',
					token: 'markup.changed'
				},
				{
					foreground: 'f8f8f8',
					background: '253b22',
					token: 'markup.inserted'
				},
				{
					foreground: 'f9ee98',
					token: 'markup.list'
				},
				{
					foreground: 'cf6a4c',
					token: 'markup.heading'
				}
			],
			colors: {
				'editor.foreground': '#F8F8F8',
				'editor.background': '#141414',
				'editor.selectionBackground': '#DDF0FF33',
				'editor.lineHighlightBackground': '#FFFFFF08',
				'editorCursor.foreground': '#A7A7A7',
				'editorWhitespace.foreground': '#FFFFFF40'
			}
		});
		// monaco.editor.setTheme('vs-dark');
		monaco.editor.setTheme('twilight');

		console.log('urls are', editorWorkerUrl, monaco.languages, monaco.default);
		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
		monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

		editorElement = monaco.editor.create(editorRef, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			minimap: {
				enabled: false
			},
			language: 'typescript'
		});
	});
</script>

<div class="h-[50px] text-white-500 flex items-center">
	<button
		class="h-full px-10 border-b-primary-800 border-b-2 flex items-center border-r border-r-primary-950 bg-background-800"
	>
		Code
	</button>
	<button
		class="h-full px-10 flex items-center border-b-2 border-b-transparent border-r border-r-primary-950"
	>
		Styles
	</button>
	<button class="mr-5 ml-auto px-[6px] py-[1px] text-sm bg-primary-900 rounded-lg">
		Environment: React
	</button>
	<button class="mr-4 px-[7px] py-[1px] text-sm bg-primary-900 rounded-lg">
		Language: Typescript
	</button>
	<button class="text-[40px] text-primary-600 mr-2">
		<PlayFill height="1em" width="1em" />
	</button>
	<button class="px-5 py-1 bg-primary-700 text-white-500 text-lg rounded-xl mr-5"> Submit </button>
</div>
<div bind:this={editorRef} class={className} />
<!-- <div class="h-[20px] flex justify-end text-white-500 text-xs"> -->
<!-- 	<button class="border-l border-l-background-950 px-8"> React </button> -->
<!-- 	<button class="border-l border-l-background-950 px-8"> Typescript </button> -->
<!-- 	<button class="border-l border-l-background-950" /> -->
<!-- </div> -->
