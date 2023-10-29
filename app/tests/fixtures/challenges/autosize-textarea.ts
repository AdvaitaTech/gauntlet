export default {
	title: 'Autosize TextArea',
	slug: 'autosize-textarea',
	level: 'Medium',
	body: `
  <p>Create a textarea component that changes it's height dynamically in response to the amount of text that is being input. Initially, it should start off with a given width and height. This height should only allow for one line of text to be entered.</p>
  <p>As more text is filled in the textarea, text that is more that one line should increase the height to accomodate the newly filled text. So if the height started at x, it should now be 2x. Then 3x and so on.</p> 
  <p>As text is deleted, the height of the textarea should shorten based on the amount of text in the textarea. There should never be a completely empty line in the textarea.</p>
  <h4>Testing Considerations</h4>
  <p>For the solution you submit to pass, it needs to include a few aspects that will help our end to end testing suite -</p>
  <ul>
    <li>Render the component with an id <code>autosize-textarea</code></li>
    <li>Render this component with an initial width of 500px and a font-size of 16px and a font-family of <code>unset</code>. It should render a textarea with <code>rows="1"</code></li>
  </ul>
  `,
	tests: [
		{
			title: 'should increase in size',
			body: `async ({page, expect}) => {
        const between = (num, target, buffer) => (num > (target - buffer) && num <(target + buffer));
        const dummyText = Array(3).fill("a short line of text").join(' ');
        const filledText = dummyText;
        const initialHeight = await page.locator('#autosize-textarea').evaluate((element) => element.clientHeight, 1);
        await page.locator('#autosize-textarea').fill(filledText);
        let newHeight = await page.locator('#autosize-textarea').evaluate((element) => element.clientHeight, 1);
        await expect(between(newHeight, initialHeight, 8)).toBeTruthy();
        console.log('got heights', newHeight, initialHeight);
        await page.locator('#autosize-textarea').fill(filledText + ' ' + filledText);
        newHeight = await page.locator('#autosize-textarea').evaluate((element) => element.clientHeight, 1);
        console.log('got heights again', newHeight, initialHeight);
        await expect(between(newHeight, initialHeight * 2, 8)).toBeTruthy();
      }`
		},
		{
			title: 'should decrease in size',
			body: `async ({page, expect}) => {
        const between = (num, target, buffer) => (num > (target - buffer) && num <(target + buffer));
        const dummyText = Array(3).fill("a short line of text").join(' ');
        const filledText = dummyText;
        await page.locator('#autosize-textarea').fill('');
        const initialHeight = await page.locator('#autosize-textarea').evaluate((element) => element.clientHeight, 1);
        await page.locator('#autosize-textarea').fill(filledText + filledText);
        let newHeight = await page.locator('#autosize-textarea').evaluate((element) => element.clientHeight, 1);
        console.log('lost heights', newHeight, initialHeight);
        await expect(between(newHeight, initialHeight * 2, 8)).toBeTruthy();
        await page.locator('#autosize-textarea').fill(filledText);
        newHeight = await page.locator('#autosize-textarea').evaluate((element) => element.clientHeight, 1);
        console.log('lost heights again', newHeight, initialHeight);
        await expect(between(newHeight, initialHeight, 8)).toBeTruthy();
      }`
		}
	]
};
