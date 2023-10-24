<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import MaterialInput from '$lib/components/MaterialInput.svelte';
	let email: string;
	let confirm: string;
	let name: string;
	let password: string;
	let isDisabled: boolean;

	let error: string | null;
	$: error = $page.url.searchParams.get('error');
	$: isDisabled = !email || !password || !confirm;
</script>

<div
	class="h-full w-full bg-gradient-to-b from-background-700 via-background-900 to-background-900 flex items-center justify-center"
>
	<div class="p-10 border border-black rounded-lg bg-background-950 w-[500px] text-white-700">
		<form use:enhance method="POST">
			<h2 class="text-2xl text-white-0 text-center mb-2">Create your Gauntlet account</h2>
			{#if error === 'BadDataError'}
				<div data-testid="form-feedback" class="text-center text-red-500">
					User already exists. Try logging in instead?
				</div>
			{:else if error === 'ValidationError'}
				<div data-testid="form-feedback" class="text-center text-red-500">
					Passwords do not match
				</div>
			{/if}
			<MaterialInput title="Email" name="email" id="email" bind:value={email} class="mt-[50px]" />
			<MaterialInput title="Password" name="password" id="password" bind:value={password} />
			<MaterialInput title="Confirm Password" name="confirm" id="confirm" bind:value={confirm} />
			<MaterialInput title="Name" name="name" id="name" bind:value={name} />
			<button
				type="submit"
				disabled={isDisabled}
				class="w-full mt-4 py-3 bg-primary-800 text-white-0 font-semibold rounded-lg disabled:bg-primary-300 disabled:text-white-100"
				>Register</button
			>
			<div class="mt-[40px] text-sm text-center">
				<span>Already have an account? </span>
				<a href="/login" class="text-primary-800 font-bold underline"> Login </a>
			</div>
		</form>
	</div>
</div>
