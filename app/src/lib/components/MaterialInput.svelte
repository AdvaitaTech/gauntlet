<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface $$Props extends HTMLInputAttributes {
		title: string;
		id: string;
		value: string;
	}

	export let value: string;
	export let title: string;
	export let id: string;
	let focused = false;

	const { class: classProp, ...inputProps } = $$restProps;

	function onFocus(event: FocusEvent) {
		focused = true;
		if ($$restProps['on:focus']) $$restProps['on:focus'](event);
	}

	function onBlur(event: FocusEvent) {
		const value = event.target && 'value' in event.target ? event.target.value : null;
		if (!value) focused = false;
		if ($$restProps['on:blur']) $$restProps['on:blur'](event);
	}
</script>

<fieldset
	class={(classProp || '') +
		' px-3 py-2 rounded-md border border-white-700 relative bg-transparent text-white-0 mt-2'}
	class:border-primary-800={focused}
>
	<legend class="top-[-10px] left-0 text-sm bg-white mx-[-4px] h-[11px]" class:w-0={!focused}>
		<div class="visible opacity-0 px-[5px]">{title}</div>
	</legend>
	<label
		class="transition-all duration-200 absolute top-[3px] left-[12px] pointer-events-none text-white-700"
		class:text-md={!focused}
		class:translate-y-[5px]={!focused}
		class:translate-x-[-4px]={!focused}
		class:text-sm={focused}
		class:text-primary-800={focused}
		class:translate-y-[-18px]={focused}
		for={id}
	>
		{title}
	</label>
	<input
		{id}
		bind:value
		class="w-full outline-none bg-transparent text-primary"
		{...inputProps}
		on:blur={onBlur}
		on:focus={onFocus}
	/>
</fieldset>
