// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			type?: string;
			data?: any;
		}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
