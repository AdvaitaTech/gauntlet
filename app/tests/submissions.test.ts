import type { PoolClient } from 'pg';
import type { PopulatedRun } from '../src/lib/models/runs';
import test, { expect } from '@playwright/test';
import { getConnection } from '../src/lib/db';
import { createChallenge, type Challenge } from '../src/lib/models/challenges';

let challengeId: Challenge;
let poolClient: PoolClient;

test.beforeAll(async ({ request }) => {
	poolClient = await getConnection();
	challengeId = await createChallenge(poolClient, {
		title: 'Simple Counter',
		level: 'easy',
		tests: [
			{
				title: 'It should start counter at 0',
				body: `async ({page, expect}) => {
        await expect(page.getByText('0')).toBeVisible();
      }`
			},
			{
				title: 'It should increment counter',
				body: `async ({page, expect}) => {
        await page.getByText('Increment').click({
          timeout: 1000
        });
        await expect(page.getByText('1')).toBeVisible();
      }`
			},
			{
				title: 'It should decrement counter',
				body: `async ({page, expect}) => {
        await page.getByText('Decrement').click({
          timeout: 1000
        });
        await expect(page.getByText('0')).toBeVisible();
      }`
			}
		]
	});
});
test.beforeEach(async ({ request }) => {
	await request.post('/login', {
		form: {
			email: 'testing103@example.com',
			password: 'testing@123'
		},
		headers: {
			Origin: 'http://localhost:4001'
		}
	});
});
test.afterAll(() => {
	poolClient.release();
});

test('should fail the whole counter challenge', async ({ context, request }) => {
	const res = await request.post('/api/engine/submit', {
		data: {
			content: `
        import React, {useState} from 'react';
        import { createRoot } from 'react-dom/client';

        const Component = () => {
          const [count, setCount] = useState(0);

          return (<div>failed</div>)
        }

        const dom = document.getElementById("root");
        const root = createRoot(dom);
        root.render(<Component />);
      `,
			styles: ``,
			challengeId: challengeId,
			environment: 'react',
			language: 'javascript'
		}
	});
	const run = (await res.json()) as PopulatedRun;
	expect(res.ok()).toBeTruthy();
	expect(run.error).not.toBeNull();
	expect(run.status).toEqual('completed');
	expect(run.success).toBeFalsy();
	expect(run.tests[0].status).toEqual('completed');
	expect(run.tests[0].success).toBeFalsy();
	expect(run.tests[1].status).toEqual('completed');
	expect(run.tests[1].success).toBeFalsy();
	expect(run.tests[1].error).not.toBeNull();
	expect(run.tests[2].status).toEqual('completed');
	expect(run.tests[2].success).toBeFalsy();
	expect(run.tests[2].error).not.toBeNull();
});

test('should fail the counter challenge some tests', async ({ request }) => {
	const res = await request.post('/api/engine/submit', {
		data: {
			content: `
        import React, {useState} from 'react';
        import { createRoot } from 'react-dom/client';

        const Component = () => {
          const [count, setCount] = useState(0);

          return (<div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Increment</button>
          </div>)
        }

        const dom = document.getElementById("root");
        const root = createRoot(dom);
        root.render(<Component />);
      `,
			styles: ``,
			challengeId,
			environment: 'react',
			language: 'javascript'
		}
	});
	const run = (await res.json()) as PopulatedRun;
	console.log('got new run', run);
	expect(res.ok()).toBeTruthy();
	expect(run.error).not.toBeNull();
	expect(run.status).toEqual('completed');
	expect(run.success).toBeFalsy();
	expect(run.tests[0].status).toEqual('completed');
	expect(run.tests[0].success).toBeTruthy();
	expect(run.tests[1].status).toEqual('completed');
	expect(run.tests[1].success).toBeTruthy();
	expect(run.tests[1].error).toBeNull();
	expect(run.tests[2].status).toEqual('completed');
	expect(run.tests[2].success).toBeFalsy();
	expect(run.tests[2].error).not.toBeNull();
});

test('should pass the counter challenge', async ({ request }) => {
	const res = await request.post('/api/engine/submit', {
		data: {
			content: `
        import React, {useState} from 'react';
        import { createRoot } from 'react-dom/client';

        const Component = () => {
          const [count, setCount] = useState(0);

          return (<div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
          </div>)
        }

        const dom = document.getElementById("root");
        const root = createRoot(dom);
        root.render(<Component />);
      `,
			styles: ``,
			challengeId,
			environment: 'react',
			language: 'javascript'
		}
	});
	const run = (await res.json()) as PopulatedRun;
	expect(res.ok()).toBeTruthy();
	expect(run.error).toBeNull();
	expect(run.status).toEqual('completed');
	expect(run.success).toBeTruthy();
});

test('should fail the counter challenge because of styles', async ({ request }) => {
	const res = await request.post('/api/engine/submit', {
		data: {
			content: `
        import React, {useState} from 'react';
        import { createRoot } from 'react-dom/client';

        const Component = () => {
          const [count, setCount] = useState(0);

          return (<div id="hide">
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
          </div>)
        }

        const dom = document.getElementById("root");
        const root = createRoot(dom);
        root.render(<Component />);
      `,
			styles: `#hide {display: none}`,
			challengeId,
			environment: 'react',
			language: 'javascript'
		}
	});
	const run = (await res.json()) as PopulatedRun;
	expect(res.ok()).toBeTruthy();
	expect(run.error).not.toBeNull();
	expect(run.status).toEqual('completed');
	expect(run.success).toBeFalsy();
	expect(run.tests[0].status).toEqual('completed');
	expect(run.tests[0].success).toBeFalsy();
	expect(run.tests[1].status).toEqual('completed');
	expect(run.tests[1].success).toBeFalsy();
	expect(run.tests[1].error).not.toBeNull();
	expect(run.tests[2].status).toEqual('completed');
	expect(run.tests[2].success).toBeFalsy();
	expect(run.tests[2].error).not.toBeNull();
});
