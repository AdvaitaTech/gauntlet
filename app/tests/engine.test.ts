import test, { expect } from '@playwright/test';

test('it should ping', async ({ request }) => {
	const value = await request.get('/api/engine/build');
	expect(value.ok()).toBeTruthy();
	expect(await value.text()).toBe('pong');
});

test('it should render React code', async ({ context, request }) => {
	const res = await request.post('/api/engine/build', {
		data: {
			content: `
        import React from 'react';
        import { createRoot } from 'react-dom/client';

        const Component = () => {
          return (<div>
            Welcome
          </div>)
        }

        const dom = document.getElementById("root");
        const root = createRoot(dom);
        root.render(<Component />);
      `,
			environment: 'react',
			language: 'javascript'
		}
	});
	expect(res.ok()).toBeTruthy();
	const content = await res.text();
	expect(content).not.toBeNull();
	const page = await context.newPage();
	await page.setContent(content);
	await expect(page.getByText('Welcome')).toBeVisible();
	await expect(page.getByText('Welcome')).toBeInViewport();
	expect(page.getByText('Welcome')).toBeDefined();
});
