import { createChallenge } from '../src/lib/models/challenges';
import { getConnection } from '../src/lib/db';
import { createUser } from '../src/lib/models/users';

console.log('running test setup');
export async function setup() {
	const poolClient = await getConnection();
	const emails = new Array(10).fill(0);
	console.log('setting up');
	await Promise.all(
		emails.map((_, i) =>
			createUser(poolClient, {
				email: `testing${100 + i}@example.com`,
				password: 'testing@123',
				name: `Test User ${100 + i}`
			})
		)
	);
	const challenges = new Array(5).fill(0);
	await Promise.all(
		challenges.map((_, i) =>
			createChallenge(poolClient, {
				title: `Simple Counter ${i + 1}`,
				slug: `simple-counter-${i + 1}`,
				body: `
        Build a webpage that displays a count value starting at 0. Provide 3 buttons in a row
					underneath that say <code>Increment</code>, <code>Decrement</code> and
					<code>Reset</code>. When the
					<code>Increment</code> button is clicked, the value of the counter should go up by 1. When
					<code>Decrement</code>
					is clicked", the value should go down by 1. When <code>Reset</code> is clicked, the value should
					go back to 0
        `,
				level: 'Easy',
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
			})
		)
	);
	poolClient.release();
}

export async function teardown() {}
