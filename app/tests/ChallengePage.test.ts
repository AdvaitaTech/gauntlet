import test, { expect } from 'playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/login');
	await page.waitForTimeout(500);
	await page.getByLabel('Email').fill('testing100@example.com');
	await page.getByLabel('Password').fill('testing@123');
	await page.locator('button[type="submit"]').click();
	await expect(page).toHaveURL('/explore');
	await page.locator('a[href="/challenges/simple-counter"]').click();
	await expect(page).toHaveURL('/challenges/simple-counter');
});

test('should show the challenges page with code and styles', async ({ page }) => {
	await expect(page.locator('div:text-matches("Build a webpage")')).toBeVisible();
	await expect(page.locator('#code-editor > div')).toHaveAttribute('data-uri', 'file:///main.jsx');
	await page.getByText('Styles').click();
	await expect(page.locator('#code-editor > div')).toHaveAttribute(
		'data-uri',
		'file:///styles.css'
	);
});

test('should show the runs tab', async ({ page }) => {
	await page.getByText('Your Submissions').click();
	await expect(page.locator('div:text-matches("No submissions yet")')).toBeVisible();
	await page.getByText('Description').click();
	await expect(page.locator('div:text-matches("Build a webpage")')).toBeVisible();
});

test('should preview the code and close previewer', async ({ page }) => {
	await page.waitForTimeout(1000);
	const value = page.frameLocator('iframe#preview-frame').locator('body');
	expect(value).not.toBeVisible();
	await page.locator('#preview-code').click();
	await page.waitForTimeout(2000);
	await expect(page.frameLocator('#preview-frame').locator('body')).toBeVisible();
	await expect(
		page.frameLocator('#preview-frame').locator('div:text-matches("Hello World")')
	).toBeVisible();
	await page.waitForTimeout(1000);
	await page.locator('#close-preview').click();
	await expect(page.frameLocator('#preview-frame').locator('body')).not.toBeVisible();
});

test('should submit successful challenge run', async ({ page }) => {
	await page.waitForTimeout(1000);
	await page.locator('#code-editor .view-lines').click();
	await page.locator('#code-editor .view-lines').press('Meta+a');
	await page.locator('#code-editor .view-lines').pressSequentially(`
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
    `);
	await page.locator('#submit-code').click();
	await expect(page.locator('#runs-table')).toBeVisible();
});
