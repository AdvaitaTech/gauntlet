import { createChallenge } from '../src/lib/server/models/challenges';
import { getConnection } from '../src/lib/server/db';
import todoList from './fixtures/challenges/todo-list';
import { createUser } from '../src/lib/server/models/users';
import autosizeTextarea from './fixtures/challenges/autosize-textarea';

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
	const challenges = [
		{
			title: `Simple Counter`,
			slug: `simple-counter`,
			body: `
        <p>Build a webpage that displays a count value starting at 0. Provide 3 buttons in a row
					underneath that say <code>Increment</code>, <code>Decrement</code> and
					<code>Reset</code>. </p>
          <p>When the
					<code>Increment</code> button is clicked, the value of the counter should go up by 1.</p> 
          <p>When
					<code>Decrement</code>
					is clicked, the value should go down by 1. </p>
          <p>When <code>Reset</code> is clicked, the value should
					go back to 0</p>
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
		},
		todoList,
		autosizeTextarea
	];

	await Promise.all(challenges.map((challenge, i) => createChallenge(poolClient, challenge)));
	poolClient.release();
}

export async function teardown() {}
