import esbuild from 'esbuild';
import { BuildError } from '../error';
import type { PopulatedRun } from '$lib/models/runs';
import { chromium } from 'playwright';
import type { Challenge } from '$lib/models/challenges';
import { expect } from 'playwright/test';

export const LANGUAGES = ['typescript', 'javascript'] as const;
export const ENVIRONMENTS = ['react'] as const;

export const buildFrontend = async ({
	content,
	styles,
	environment,
	language
}: {
	content: string;
	styles: string;
	environment: (typeof ENVIRONMENTS)[number];
	language: (typeof LANGUAGES)[number];
}) => {
	const js = await esbuild.build({
		stdin: {
			contents: content,
			resolveDir: '../environments/react/',
			sourcefile: 'main.js',
			loader: 'jsx'
		},
		bundle: false,
		minify: true,
		jsx: 'transform',
		write: false
	});

	if (js.outputFiles && js.outputFiles[0]) {
		const str = Buffer.from(js.outputFiles[0].contents).toString();
		const index = `<html>
      <head>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="importmap">
          {
            "imports": {
              "react": "https://esm.sh/react@18.2.0",
              "react-dom/client": "https://esm.sh/react-dom@18.2.0?cjs-exports=createRoot,hydrateRoot",
              "react/jsx-runtime": "https://esm.sh/jsx-runtime@1.2.0?cjs-exports=jsx"
            }
          }
        </script>
        <script type="module">${str}</script>
      </body>
    </html>`;
		return index;
	} else {
		throw new BuildError('Error while building frontend: ' + js.errors);
	}
};

type TestRunStatus = {
	id: number;
	time: number;
	testError?: string;
	buildError?: string;
};

export type FrontendRunStatus = {
	challenge: TestRunStatus;
	tests: TestRunStatus[];
};

export const executeFrontendRun = async (
	index: string,
	challenge: Challenge
): Promise<FrontendRunStatus> => {
	try {
		const testStatuses: TestRunStatus[] = [];
		const browser = await chromium.launch();
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.setContent(index);
		await page.waitForLoadState('domcontentloaded');

		const runStart = performance.now();

		for (let i = 0; i < challenge.tests.length; i++) {
			const test = challenge.tests[i];
			const testStart = performance.now();
			let testError: string | null = null,
				buildError: string | null = null;
			try {
				await page.waitForTimeout(100);
				const fn = eval(test.body);
				console.log('got fn', fn);
				await fn({ page, expect });
			} catch (e) {
				if (e instanceof Error) {
					console.log('error while running test:', e);
					testError = e.toString();
				} else {
					console.error('Unknown error caught while executing test:', e);
					buildError = JSON.stringify(e);
				}
			}
			console.log('after error', testError);
			const testEnd = performance.now();
			const status = {
				id: test.id,
				time: testEnd - testStart,
				testError: testError ? testError.toString() : undefined,
				buildError: buildError ? buildError.toString() : undefined
			};
			console.log('pushed', status);
			testStatuses.push(status);
		}
		const runEnd = performance.now();
		const runStatus: TestRunStatus = {
			id: challenge.id,
			time: runEnd - runStart,
			testError: testStatuses.find((t) => t.testError !== undefined)?.testError
		};

		console.log('closing');
		await context.close();
		await browser.close();

		console.log('returned');
		return {
			challenge: runStatus,
			tests: testStatuses
		};
	} catch (re) {
		console.log('Error while executing run - ', re);
		return {
			challenge: {
				id: challenge.id,
				time: 0,
				buildError: JSON.stringify(re)
			},
			tests: challenge.tests.map((t) => ({
				id: t.id,
				time: 0,
				buildError: 'Error starting browser'
			}))
		};
	}
};
