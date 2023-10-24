<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import MaterialInput from '$lib/components/MaterialInput.svelte';
	let email: string;
	let password: string;
	let loginDisabled: boolean;

	let error: string | null;
	$: error = $page.url.searchParams.get('error');
	$: loginDisabled = !email || !password;
</script>

<div
	class="h-full w-full bg-gradient-to-b from-background-700 via-background-900 to-background-900 flex items-center justify-center"
>
	<div class="p-10 border border-black rounded-lg bg-background-950 w-[500px] text-white-700">
		<form use:enhance method="POST">
			<h2 class="text-2xl text-white-0 text-center mb-2">Log in to Gauntlet</h2>
			{#if error === 'BadDataError'}
				<div data-testid="form-feedback" class="text-center text-red-500">
					User does not exist. Try creating a new account?
				</div>
			{:else if error === 'AuthError'}
				<div data-testid="form-feedback" class="text-center text-red-500">
					Incorrect password. Please try again
				</div>
			{/if}
			<MaterialInput title="Email" name="email" id="email" bind:value={email} class="mt-[50px]" />
			<MaterialInput title="Password" name="password" id="password" bind:value={password} />
			<button
				type="submit"
				disabled={loginDisabled}
				class="w-full mt-4 py-3 bg-primary-800 text-white-0 font-semibold rounded-lg disabled:bg-primary-300 disabled:text-white-100"
				>Login</button
			>
			<div class="mt-[40px] text-sm text-center">
				<span>Don't have an account? </span>
				<a href="/register" class="text-primary-800 font-bold underline"> Create one </a>
			</div>
		</form>
	</div>
</div>
