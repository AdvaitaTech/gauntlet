export default {
	title: 'Todo List',
	slug: 'todo-list',
	level: 'Easy',
	body: `
  <p>Build a todo list that helps a user manage their todos for the day. It have a input element that accepts text. There must be a button next to it with an id of <code>create-todo</code>. Once this button is clicked, the text that the user has entered must show up as a todo underneath.</p>
  <p>Each todo displayed underneath has 2 buttons next to it. One should be a Completed button, and the other should be a Deleted button</p>
  <p>Once the Completed button is clicked, the todo must have a strikethrough style applied to it (<s>something like this</s>)</p>
  <p>Once the Deleted button is clicked, the todo must be removed from the list</p>
  <h4>Testing Considerations</h4>
  <ul>
    <li>The input element should have an id of <code>input-todo</code></li>
    <li>The button to create a todo should should have an id of <code>create-todo</code></li>
    <li>The list that contains the todos should have an id of <code>list-todos</code></li>
    <li>Each todo list item that contains the todo text and the action buttons should have a class of <code>todo-item</code></li>
    <li>The button to complete a todo should should have a class of <code>complete-todo</code></li>
    <li>The button to delete a todo should should have a class of <code>delete-todo</code></li>
  </ul>
  `,
	tests: [
		{
			title: 'should create a todo',
			body: `async ({page, expect}) => {
        await page.locator('#input-todo').fill('Start working', {
          timeout: 1000
        });
        await expect(page.locator('#input-todo[value="Start working"]')).toBeVisible();
        await page.locator('#create-todo').click();
        await expect(page.locator('#list-todos').locator('.todo-item :has-text("Start working")')).toBeVisible();
      }`
		},
		{
			title: 'should clear the input on todo creation',
			body: `async ({page, expect}) => {
        await page.locator('#input-todo').fill('Stop working', {
          timeout: 1000
        });
        await expect(page.locator('#input-todo[value="Stop working"]')).toBeVisible();
        await page.locator('#create-todo').click({
          timeout: 1000
        });
        await expect(page.locator('#input-todo[value="Stop working"]')).not.toBeVisible();
      }`
		},
		{
			title: 'should complete a todo',
			body: `async ({page, expect}) => {
        await expect(page.locator('.todo-item:has-text("Start working")')).toBeVisible();
        await page.locator('.todo-item:has-text("Start working")').locator('#complete-todo').click({
          timeout: 1000
        });
        await expect(page.locator('.todo-item:has-text("Start working")')).toBeVisible();
        const elem = await page.locator('.todo-item :text("Start working")');
        const decoration = await elem.evaluate((element) => window.getComputedStyle(element).getPropertyValue('text-decoration'),);
        if (!decoration.includes('line-through')) {
          await expect(page.locator('.todo-item:has-text("Start working") s')).toBeVisible();
        }
        else expect(decoration).toContain('line-through');
      }`
		},
		{
			title: 'should delete a todo',
			body: `async ({page, expect}) => {
        await expect(page.locator('.todo-item:has-text("Stop working")')).toBeVisible();
        await page.locator('.todo-item:has-text("Stop working")').locator('#delete-todo').click();
        await expect(page.locator('.todo-item:has-text("Stop working")')).not.toBeVisible();
      }`
		}
	]
};
