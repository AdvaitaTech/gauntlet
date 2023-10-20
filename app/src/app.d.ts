// See https://kit.svelte.dev/docs/types#app
import type { PoolClient } from 'pg';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			type?: string;
			data?: any;
		}
		interface Locals {
			db: PoolClient;
			userId: number | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
