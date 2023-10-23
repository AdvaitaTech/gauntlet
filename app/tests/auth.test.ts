import test, { expect } from 'playwright/test';

test('should login a user', async ({ page }) => {
	await page.goto('/login');
	await expect(page.locator('button[type="submit"]')).toBeDisabled();
	await page.waitForTimeout(500);
	await page.getByLabel('Email').fill('testing100@example.com');
	await expect(page.locator('button[type="submit"]')).toBeDisabled();
	await page.getByLabel('Password').fill('testing@123');
	await page.locator('button[type="submit"]').click();
	await expect(page).toHaveURL('/explore');
});

test('should provide an auth error for incorrect password', async ({ page }) => {
	await page.goto('/login');
	await page.waitForTimeout(500);
	await page.getByLabel('Email').fill('testing100@example.com');
	await page.getByLabel('Password').fill('fail');
	await page.locator('button[type="submit"]').click();
	await expect(page.getByTestId('form-feedback')).toContainText('Incorrect password');
});

test('should provide an auth error for invalid user', async ({ page }) => {
	await page.goto('/login');
	await page.waitForTimeout(500);
	await page.getByLabel('Email').fill('fail@example.com');
	await page.getByLabel('Password').fill('fail');
	await page.locator('button[type="submit"]').click();
	await expect(page.getByTestId('form-feedback')).toContainText('User does not exist');
});

// test('should register a user', async ({ page }) => {
// 	page.goto('/register');
// 	await page.getByLabel('Email').fill('testing1example.com');
// 	await page.getByLabel('Password').fill('testing@123');
// 	await page.getByLabel('Confirm Password').fill('testing@123');
// 	await page.getByLabel('Name').fill('Test 1');
// 	await page.locator('button[type="submit"]').click();
// 	await expect(page).toHaveURL('/explore');
// });
//
// test('should register a user without filling name', async ({ page }) => {
// 	page.goto('/register');
// 	await page.getByLabel('Email').fill('testing1example.com');
// 	await page.getByLabel('Password').fill('testing@123');
// 	await page.getByLabel('Confirm Password').fill('testing@123');
// 	await page.locator('button[type="submit"]').click();
// 	await expect(page).toHaveURL('/explore');
// });
//
// test('should show error if user is already registered', async ({ page }) => {
// 	page.goto('/register');
// 	await page.getByLabel('Email').fill('testing1example.com');
// 	await page.getByLabel('Password').fill('testing@123');
// 	await page.getByLabel('Confirm Password').fill('testing@123');
// 	await page.getByLabel('Name').fill('Test 1');
// 	await page.locator('button[type="submit"]').click();
// 	await expect(page.getByTestId('form-feedback')).toContainText('User already exists');
// });
