import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv-flow';

dotenv.config();
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globalSetup: 'tests/test.setup.ts'
	},
	server: {
		port: Number(process.env.PORT) || 5173
	}
});
