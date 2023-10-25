import test, { expect } from 'playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/login');
	await page.waitForTimeout(500);
	await page.getByLabel('Email').fill('testing100@example.com');
	await page.getByLabel('Password').fill('testing@123');
	await page.locator('button[type="submit"]').click();
	await expect(page).toHaveURL('/explore');
	await page.locator('a[href="/challenges/simple-counter-1"]').click();
	await expect(page).toHaveURL('/challenges/simple-counter-1');
});

test('should show the challenges page with code and styles', async ({ page }) => {
	await expect(page.locator('div:text-matches("Build a webpage")')).toBeVisible();
	await expect(page.locator('span:text-matches("import React from")')).toBeVisible();
	await page.getByText('Styles').click();
	await expect(page.locator('div:text-matches("import React from")')).not.toBeVisible();
});

test('should show the runs tab', async ({ page }) => {
	await page.getByText('Your Submissions').click();
	await expect(page.locator('div:text-matches("Build a webpage")')).not.toBeVisible();
	await page.getByText('Description').click();
	await expect(page.locator('div:text-matches("Build a webpage")')).toBeVisible();
});
